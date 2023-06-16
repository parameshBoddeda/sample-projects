//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, Grid, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from "react-toastify";
import CircleIcon from '@mui/icons-material/Circle';

//Global Imports End
//Regional Imports Start
import AppDataContext from '../../../common/AppContext';
import DayDropDown from "./DayDropDown";
import CampaignList from "./CampaignList";
import CalendarPlanning from "./CalendarPlanning";
import { GetMediaPlanCalendarSummary, GetSchedulesByInventory, UpdateScheduleUnitInfo, UpdateSalesScheduleUnitInfo
    , GetSchedulesByCampaignOrMediaPlanId, GetISCIsByCampaignId, ValidateSalesInventoryAndPlan, ValidateCampaignInventoryAndPlan } from '../../../services/planning.service';
import Helper from "../../../common/Helper";
import MediaPlansList from "./MediaPlansList";
import { MEDIA_PALN_STATUS_NAMES, SCHEDULE_ADUNIT_STATUS_IDS } from "../../../common/AppConstants";
import DrawerComponent from "../../Drawer/DrawerComponent";
import ErrorDetails from "../../../screens/MediaPlanning/Planning/ErrorDetails";
//Regional Imports End
import * as AppLanguage from '../../../common/AppLanguage';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
    oneThirdWidth: { width: "calc(30% - 4px)" },
    twoThirdWidth: { width: "calc(70% - 4px)" },
    validationDrawer: {
        "& .MuiDrawer-paper": {
            width: "50%",
            // margin: "50px 0 0 0px",
            padding: theme.spacing(0, 1),
        },
    },
}));

function notifySuccess(msg) { toast.success(msg) }
function notifyWarning(msg) { toast.warning(msg) }
function notifyError(msg) { toast.error(msg) }

const CalendarViewMediaPlanning = (props) => {
    const classes = useStyles();
    const { ScheduleAdUnitStatus } = useContext(AppDataContext);
    const [mediaPlanSummaryList, setMediaPlanSummaryList] = useState([]);
    const [orgScheduleList, setOrgScheduleList] = useState([]);
    const [schedulesList, setSchedulesList] = useState([]);
    const [isciSList, setISCIsList] = useState([]);
    const [selectedISCIinfo, setSelectedISCIinfo] = useState(null);
    const [selectedCampaignOrAdvertiserId, setSelectedCampaignOrAdvertiserId] = useState(null);
    const [selectedMediaPlanId, setMediaPlanId] = useState(null);
    const [currentActivityData, setCurrentActivityData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [chkSales, setChkSales] = useState(props.IsCampaignPlanning ? true : false);
    const [chkUnfilled, setChkUnfilled] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(props.startDate);
    const [selectedEndDate, setSelectedEndDate] = useState(props.endDate);
    const [cutReleaseCellData, setCutReleaseCellData]= useState(null);
    const [prevAction, setPrevAction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showValidationDetails, setShowValidationDetails] = useState(false);
    const [errorDetails, setErrorDetails] = useState([]);

    let confirmedStatuses = ['Pending Confirm', 'Confirmed', 'Trafficked'];

    useEffect(() => {
        setSelectedStartDate(props.startDate);
        setSelectedEndDate(props.endDate);
        populateData(selectedDays, chkSales, chkUnfilled, null);
    }, [props.startDate, props.endDate]);

    const getMediaplanSummary = () => {
        let ids = props.DropDownData.map(x => x.value).join();
        let obj = {
            Ids: ids,
            IsCampaign : props.IsCampaignPlanning,
            StartDate: props.startDate,
            EndDate: props.endDate
        }

        GetMediaPlanCalendarSummary(obj).then(data => {
            if (data && data.length > 0) {
                let groupedData = Helper.GroupBy(data, props.IsCampaignPlanning ? 'campaignOrAdvertiserId' : 'mediaPlanId');
                setMediaPlanSummaryList(groupedData);                
                let groupFirstKey = Object.keys(groupedData)[0];
                setSelectedCampaignOrAdvertiserId(groupedData[groupFirstKey][0].campaignOrAdvertiserId);
                setMediaPlanId(groupedData[groupFirstKey][0].mediaPlanId);
                if(!props.data || props.data?.length === 0){
                    getSchedulesByCampOrMediaPlan(groupedData[groupFirstKey][0].mediaPlanId);
                }
            }
            else{
                setMediaPlanSummaryList([]);
                setSelectedCampaignOrAdvertiserId(null);
            }
        }).catch(err => {
            console.log(err);
            setMediaPlanSummaryList([]);
            setSelectedCampaignOrAdvertiserId(null);
        })
    }

    const getSchedules = () => {             
        setSchedulesList(null);
        setOrgScheduleList([]);
        let obj = {
            InventoryIds : props.data.map(x => x.inventoryId.toString()).join(),
            StartDate: props.startDate,
            EndDate: props.endDate,
            IsCampaignPlanning : props.IsCampaignPlanning
        }
        GetSchedulesByInventory(obj).then(data => {
            if (data && data.length > 0) {
                // console.log(data);
                let finalData = [];
                props.data.map(inv=>{
                    let filterData = data.filter(x => x.inventoryId === inv.inventoryId && x.assetId === inv.assetId &&
                                                        x.unitTypeId === inv.unitTypeId && x.unitSizeId === inv.unitSizeId);

                    if(filterData.length > 0)
                        finalData = finalData.concat(filterData);
                    return finalData;
                });

                setOrgScheduleList(finalData);                
                populateData(selectedDays, chkSales, chkUnfilled, finalData);
                if (props.IsCampaignPlanning) {
                    let minDate = new Date(Math.min(...data.map(item => { return new Date(Helper.FormatToIsoDate(item.estDate)) })));
                    let maxDate = new Date(Math.max(...data.map(item => { return new Date(Helper.FormatToIsoDate(item.estDate)) })));
                    getISCIList(minDate, maxDate);
                }
            }
            else {
                setSchedulesList([]);
                setOrgScheduleList([]);
            }
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setSchedulesList([]);
            setOrgScheduleList([]);
            setIsLoading(false);
        })
    }

    const getSchedulesByCampOrMediaPlan = (selectedId) => {
        if(props.DropDownData && props.DropDownData.length > 0 && (!props.data || (props.data && props.data.length === 0) )){
            setSchedulesList(null);
            setOrgScheduleList([]);
            let obj = {
                //CampaignOrMediaPlanId: selectedId ?? props.DropDownData[0].value,
                MediaPlanId: selectedId ?? selectedMediaPlanId,
                IsCampaignPlanning: props.IsCampaignPlanning
            }
            GetSchedulesByCampaignOrMediaPlanId(obj).then(data => {
                setIsLoading(false);
                if (data && data.length > 0) {
                    setOrgScheduleList(data);
                    populateData(selectedDays, chkSales, chkUnfilled, data);
                    if (props.IsCampaignPlanning){
                        let minDate = new Date(Math.min(...data.map(item => { return new Date(Helper.FormatToIsoDate(item.estDate)) })));
                        let maxDate = new Date(Math.max(...data.map(item => { return new Date(Helper.FormatToIsoDate(item.estDate)) })));
                        getISCIList(minDate, maxDate);
                    }
                }
                else {
                    setSchedulesList([]);
                    setOrgScheduleList([]);
                }
            }).catch(err => {
                console.log(err);
                setSchedulesList([]);
                setOrgScheduleList([]);
                setIsLoading(false);
            })
        }
    }

    const getISCIList = (sDate, eDate) => {
        if(props.IsCampaignPlanning){
            let obj = {
                CampaignIds: props.DropDownData.map(x => x.campaignOrAdvertiserId).join(),
                FlightStartDate: props.startDate,
                FlightEndDate: props.endDate
            }
            
            GetISCIsByCampaignId(obj).then(data => {
                if (data && data.length > 0)
                    setISCIsList(data);
                else
                    setISCIsList([]);
            }).catch(err => {
                console.log(err);
                setISCIsList([]);
            })
        }
    }

    useEffect(()=>{
        if (orgScheduleList && orgScheduleList.length > 0 && ((selectedStartDate && selectedEndDate))){
            populateData(selectedDays, chkSales, chkUnfilled, orgScheduleList);
        }
    },[selectedStartDate, selectedEndDate]);

    useEffect(() => {
        if (props.data && props.data.length > 0) {
            getSchedules();
        }
        else {
            setSchedulesList([]);
            setOrgScheduleList([]);
        }
    }, [props.data]);

    useEffect(() => {
        if (props.DropDownData && props.DropDownData.length > 0) {
            //setIsLoading(true);
            getMediaplanSummary();            
        }
        else {
            setMediaPlanSummaryList([]);
            setISCIsList([]);
            setSelectedISCIinfo(null);
            setSelectedCampaignOrAdvertiserId(null);

            if(props.data && props.data.length === 0){
                setSchedulesList([]);
                setOrgScheduleList([]);
            }
        }
    }, [props.DropDownData]);

    //get called when APPLY button clicked
    useEffect(()=>{
        if(props.SaveAllMediaPlans){
            setTimeout(function(){
                getSchedules();
                getMediaplanSummary();
            }, 1000);
        }

    }, [props.SaveAllMediaPlans]);

    useEffect(() => {
        if (selectedCell) {
            applyHeaderOrISCI(selectedCell);
            setSelectedCell(null);
        }
    }, [selectedCell]);

    const isSalesPlanPendingCofirm = (mediaPlanId)=>{
        let found = props.DropDownData.find(x => x.value === mediaPlanId && x.planStatus === MEDIA_PALN_STATUS_NAMES.PendingConfirm);
        if(found) return true;
        return false;
    }

    const onHeaderSelectionChange = (mediaPlanId, campOrAdvId) => {
        setSelectedCampaignOrAdvertiserId(campOrAdvId);
        setMediaPlanId(mediaPlanId);
        setSelectedISCIinfo(null);
        if (props.data?.length === 0 && mediaPlanId !== selectedMediaPlanId && (!props.data || (props.data && props.data.length === 0)))
            getSchedulesByCampOrMediaPlan(mediaPlanId);
    }

    const onISCISelectionChange = (isciInfo, mediaPlanId) => {
        setSelectedISCIinfo(isciInfo);
        setSelectedCampaignOrAdvertiserId(isciInfo.campaignOrAdvertiserId);
        setMediaPlanId(mediaPlanId);
    }

    const updateScheduleBreakPostion = (schedule) =>{
        let list = [...orgScheduleList];
        let index = list.findIndex(x => x.scheduleAdUnitId === schedule.scheduleAdUnitId);
        list.splice(index, 1, schedule);
        setOrgScheduleList(list);
        onCellAction(schedule, 'NoChange', list);
    }

    const handleStateShift = (cellData, action) => {
        if (action === 'Cut') {
            let data = {...cellData};
            setCutReleaseCellData(data);
            cellData.statusName = 'Initial';
            setPrevAction('Cut');
        } else if (action === 'Paste') {
            if (cutReleaseCellData){
                //if(prevAction === '')
                let status = ScheduleAdUnitStatus.find(x => x.lookupText === 'Working Internal');
                cellData = {
                    ...cellData, isciId: cutReleaseCellData.isciId, isciCode: cutReleaseCellData.isciCode, isciTitle: cutReleaseCellData.isciTitle, 
                        proposedISCI: cutReleaseCellData.isciId?.toString(), campaignOrAdvertiserId: cutReleaseCellData.campaignOrAdvertiserId, 
                        planName: cutReleaseCellData.planName, statusId: status.lookupId, statusName: status.lookupText, mediaPlanId : cutReleaseCellData.mediaPlanId
                };
            }
            else
                cellData.statusName = 'Working Internal';            
        } else if (action === 'Release') {
            let status = ScheduleAdUnitStatus.find(x => x.lookupText === 'Initial');
            cellData = {
                ...cellData, isciId: null, isciCode: null, isciTitle: null, proposedISCI: null
                , campaignOrAdvertiserId: 0, planName: null, statusId: status.lookupId, statusName: status.lookupText
            };
        }
        return cellData;
    }

    const findItemInActivityData = (id, campaignOrAdvertiserId) => {
        if(campaignOrAdvertiserId)
            return currentActivityData.findIndex(item => item.scheduleAdUnitId === id && item.campaignOrAdvertiserId === campaignOrAdvertiserId);

        return currentActivityData.findIndex(item => item.scheduleAdUnitId === id);
    }

    const onCellAction = (item, action, data) => {
        //----- Logic to update cell State on UserAction - Begin
        let tempActivityData = [...currentActivityData];
        let list = data ?? [...orgScheduleList];
        let tempScheduleList ;
        if(props.IsCampaignPlanning){
            tempScheduleList = list.map((schedule) => {
                if (schedule.scheduleAdUnitId === item.scheduleAdUnitId) {
                    let updatedSchedule;
                    let foundIndex = findItemInActivityData(item.scheduleAdUnitId)
                    if (foundIndex !== -1) {
                        updatedSchedule = handleStateShift(schedule, action);
                        tempActivityData.splice(foundIndex, 1, updatedSchedule);
                    } else {
                        updatedSchedule = handleStateShift(schedule, action);
                        tempActivityData.push(updatedSchedule);
                    }
                    return updatedSchedule;
                } else return schedule;
            });
        }
        else{
            tempScheduleList = list.map((schedule) => {
                if (schedule.scheduleAdUnitId === item.scheduleAdUnitId && schedule.campaignOrAdvertiserId === item.campaignOrAdvertiserId) {
                    let updatedSchedule = handleStateShift(schedule, action);
                    let foundIndex = findItemInActivityData(item.scheduleAdUnitId, item.campaignOrAdvertiserId)
                    if (foundIndex !== -1) {
                        tempActivityData.splice(foundIndex, 1, updatedSchedule);
                    } else {
                        tempActivityData.push(updatedSchedule);
                    }
                    return updatedSchedule;
                } else return schedule;
            });
        }

        if(cutReleaseCellData && action === 'Paste'){
            tempScheduleList = tempScheduleList.map((schedule) => {
                if (schedule.scheduleAdUnitId === cutReleaseCellData.scheduleAdUnitId) {
                    let status = ScheduleAdUnitStatus.find(x => x.lookupText === 'Initial');
                    let updatedSchedule = {
                        ...schedule, isciId: null, isciCode: null, isciTitle:null, proposedISCI: null
                        , campaignOrAdvertiserId: 0, planName: null, statusId: status.lookupId, statusName: status.lookupText
                    };
                    let foundIndex = findItemInActivityData(cutReleaseCellData.scheduleAdUnitId)
                    if (foundIndex !== -1) {
                        tempActivityData.splice(foundIndex, 1, updatedSchedule);
                    } else {
                        tempActivityData.push(updatedSchedule);
                    }
                    return updatedSchedule;
                } else return schedule;
            });

            setCutReleaseCellData(null);
            setPrevAction(null);
        }

        if(!data)
            setOrgScheduleList(tempScheduleList);

        //console.log(tempActivityData)
        if (!props.IsCampaignPlanning && action === 'Release' && isSalesPlanPendingCofirm(item.mediaPlanId)){
            //call API;
            item.campaignOrAdvertiserId = 0;
            UpdateSalesScheduleUnitInfo([item]).then(data => {
                props.refreshSummary();
                let groupedData = mediaPlanSummaryList;
                let index = groupedData[item.mediaPlanId].findIndex(x=> x.unitTypeName === item.unitTypeName);
                if(index !== -1){
                    groupedData[item.mediaPlanId][index].units = groupedData[item.mediaPlanId][index].units -1;
                    setMediaPlanSummaryList(groupedData);
                }
            }).catch(err => {
                console.log(err);
            })
        }
        else
            setCurrentActivityData(tempActivityData);

        populateData(selectedDays, chkSales, chkUnfilled, tempScheduleList);
        //----- Logic to update cell State on UserAction - End
    }

    const onCellClick = (item) => {
        setSelectedCell(item);
    }

    const applyHeaderOrISCI = (item) => {
        if(orgScheduleList.length === 0){
            return;
        }
        let scheduleUnit = orgScheduleList.find(x => x.scheduleAdUnitId === item.scheduleAdUnitId) || {};
        if (scheduleUnit.statusName === 'Trafficked') {
            notifyError(AppLanguage.APP_MESSAGE.Spot_Status_Err
                .replace('__Status__', scheduleUnit.statusName === 'Trafficked' ? 'Trafficked' : 'Confirmed'));
            return;
        }

        let status = ScheduleAdUnitStatus.find(x => x.lookupText === 'Working Internal');
        let newObj = item;
        let planName = '';
        let list = [...orgScheduleList];
        let data;
        if(props.IsCampaignPlanning){
            // if (confirmedStatuses.indexOf(scheduleUnit.statusName) !== -1) {
            //     notifyError("Selected spot already " + (scheduleUnit.statusName === 'Trafficked' ? 'Trafficked' : 'Confirmed'));
            //     return;
            // }

            if (scheduleUnit.unitCostTypeId === 2 && scheduleUnit.customerId > 1) {
                notifyError(AppLanguage.APP_MESSAGE.Unable_To_Assign_Campaign);
                return;
            }

            if (selectedCampaignOrAdvertiserId && scheduleUnit.campaignOrAdvertiserId !== 0 && scheduleUnit.campaignOrAdvertiserId !== selectedCampaignOrAdvertiserId) {
                notifyError(AppLanguage.APP_MESSAGE.Spot_Assigned_Err);
                return;
            }

            Object.keys(mediaPlanSummaryList).forEach((groupName) => {
                if (groupName === selectedCampaignOrAdvertiserId.toString())
                    planName = mediaPlanSummaryList[groupName][0].planName;
            });
            
            data = list.map(obj => {
                if (obj.scheduleAdUnitId === item.scheduleAdUnitId) {
                    if (selectedISCIinfo)
                        newObj = {
                            ...obj, isciId: selectedISCIinfo.id, isciCode: selectedISCIinfo.isci, isciTitle: selectedISCIinfo.title, proposedISCI: selectedISCIinfo.id.toString()
                            , campaignOrAdvertiserId: selectedCampaignOrAdvertiserId, planName: planName, statusId: status.lookupId, statusName: status.lookupText,
                            mediaPlanId: selectedMediaPlanId
                        };
                    else
                        newObj = {
                            ...obj, campaignOrAdvertiserId: selectedCampaignOrAdvertiserId, planName: planName,
                            statusId: status.lookupId, statusName: status.lookupText, mediaPlanId: selectedMediaPlanId
                        };

                    return newObj;
                }

                return obj;
            });

            setOrgScheduleList(data);
            onCellAction(newObj, 'Paste', data);
        }
        else{
            let replaceUnit = false;
            if (confirmedStatuses.indexOf(scheduleUnit.statusName) !== -1 && scheduleUnit.customerId === 1) {
                replaceUnit = true;
            }
            else if (confirmedStatuses.indexOf(scheduleUnit.statusName) !== -1 && scheduleUnit.customerId !== 1) {
                notifyError(AppLanguage.APP_MESSAGE.Spot_Status_Err
                    .replace('__Status__', scheduleUnit.statusName === 'Trafficked' ? 'Trafficked' : 'Confirmed'));
                return;
            }

            Object.keys(mediaPlanSummaryList).forEach((groupName) => {
                if (groupName === selectedCampaignOrAdvertiserId?.toString() || groupName === selectedMediaPlanId?.toString())
                    planName = mediaPlanSummaryList[groupName][0].planName;
            });

            data = list;

            if(!replaceUnit){
                let distUnitsCount = [...new Set(orgScheduleList.filter(x => x.scheduleId === item.scheduleId && x.unitCostTypeId !== 1).map(y => y.scheduleAdUnitId))].length;
                let allPendingConfirm = orgScheduleList.filter(x => x.scheduleId === item.scheduleId && x.unitCostTypeId !== 1 && confirmedStatuses.indexOf(x.statusName) !== -1).length;
                if (distUnitsCount === allPendingConfirm) {
                    notifyError(AppLanguage.APP_MESSAGE.Spot_Status);
                    return;
                }

                let unitsCount = orgScheduleList.filter(x => x.scheduleId === item.scheduleId && x.unitCostTypeId !== 1 && x.mediaPlanId === selectedMediaPlanId).length;
                if (distUnitsCount === unitsCount) {
                    notifyError(AppLanguage.APP_MESSAGE.Unavailable_Spots);
                    return;
                }

                let isAlreadyThere = orgScheduleList.filter(x => x.scheduleAdUnitId === item.scheduleAdUnitId && x.campaignOrAdvertiserId === selectedCampaignOrAdvertiserId && x.mediaPlanId === selectedMediaPlanId).length > 0;
                if (isAlreadyThere) {
                    let isFound = false
                    let filterData = orgScheduleList.filter(x => x.scheduleId === item.scheduleId && x.scheduleAdUnitId !== item.scheduleAdUnitId && confirmedStatuses.indexOf(x.statusName) === -1);
                    for(let y of filterData){
                        isFound = orgScheduleList.filter(x => x.scheduleId === item.scheduleId && x.scheduleAdUnitId === y.scheduleAdUnitId
                            && x.campaignOrAdvertiserId === selectedCampaignOrAdvertiserId && x.mediaPlanId === selectedMediaPlanId).length > 0;

                        if (!isFound) {
                            item = orgScheduleList.find(x => x.scheduleId === item.scheduleId && x.scheduleAdUnitId === y.scheduleAdUnitId);
                            isFound = true;
                            isAlreadyThere = false;
                            break;
                        }
                    }
                }

                if (isAlreadyThere) {
                    notifyError(AppLanguage.APP_MESSAGE.Media_Plan_Validation);
                    return;
                }

                let count = list.filter(x => x.scheduleAdUnitId === item.scheduleAdUnitId && x.campaignOrAdvertiserId !== 0).length;
                if (count === 0) {
                    data = list.map(obj => {
                        if (obj.scheduleAdUnitId === item.scheduleAdUnitId) {
                            newObj = {
                                ...obj, campaignOrAdvertiserId: selectedCampaignOrAdvertiserId, planName: planName,
                                statusId: status.lookupId, statusName: status.lookupText, mediaPlanId: selectedMediaPlanId
                            };

                            return newObj;
                        }

                        return obj;
                    });
                }
                else {
                    newObj = Object.assign({}, list.find(x => x.scheduleAdUnitId === item.scheduleAdUnitId));
                    newObj = {
                        ...newObj, campaignOrAdvertiserId: selectedCampaignOrAdvertiserId, planName: planName,
                        statusId: status.lookupId, statusName: status.lookupText, mediaPlanId: selectedMediaPlanId
                    };
                    data.push(newObj);
                }
            }
            else{
                data = list.map(obj => {
                    if (obj.scheduleAdUnitId === item.scheduleAdUnitId && obj.campaignOrAdvertiserId === item.campaignOrAdvertiserId && obj.mediaPlanId === item.mediaPlanId) {
                        newObj = {
                            ...obj, campaignOrAdvertiserId: selectedCampaignOrAdvertiserId, planName: planName,
                            statusId: status.lookupId, statusName: status.lookupText, mediaPlanId: selectedMediaPlanId
                        };

                        return newObj;
                    }

                    return obj;
                });
            }

            setOrgScheduleList(data);
            onCellAction(newObj, 'Paste', data);
        }
    }

    const groupData = (data) => {
        let sortedData = data.sort((a, b) => (a.estTime < b.estTime) ? 1 : -1).sort((a, b) => (a.estDate > b.estDate) ? 1 : -1);
        let groupedData = Helper.GroupByMultiple(sortedData, function (item) { return [item.estDate, item.estTime, item.networkName, item.episodeName, item.scheduleId]; });
        setSchedulesList(groupedData);
    }

    const populateData = (days, chkSales, chkUnfilled, changedData) => {
        let data = changedData??[...orgScheduleList];

        if (days && days.length > 0) {
            let dayNames = days.map((item) => { return item.label.toUpperCase() });
            data = data.filter(x => dayNames.indexOf(x.weekDay.toUpperCase()) !== -1);
        }

        if (chkSales === false)
            data = !props.IsCampaignPlanning ? data.filter(x => x.unitCostTypeId !== 1) : data.filter(x => x.unitCostTypeId === 1);

        if (chkUnfilled === true)
            data = data.filter(x => x.statusId === 1346);

        if (selectedStartDate && selectedEndDate)
            data = data.filter(x => new Date(Helper.FormatDate(x.estDate)) >= new Date(Helper.FormatDate(selectedStartDate)) && new Date(Helper.FormatDate(x.estDate)) <= new Date(Helper.FormatDate(selectedEndDate)));

        setSelectedDays(days);
        setChkSales(chkSales);
        setChkUnfilled(chkUnfilled);

        groupData(data);
    }

    const CancelCellAction = ()=>{
        setPrevAction(false);
        if(cutReleaseCellData){
            let list = [...orgScheduleList];
            let index = list.findIndex(x=> x.scheduleAdUnitId === cutReleaseCellData.scheduleAdUnitId);
            list.splice(index, 1, cutReleaseCellData);
            setOrgScheduleList(list);
            populateData(selectedDays, chkSales, chkUnfilled, list);
        }
        setCutReleaseCellData(null);
    }

    const handleClear = () => {
        setCurrentActivityData([]);
        //setSelectedCampaignOrAdvertiserId(null);
        setSelectedCell(null);
        setSelectedDays(null);
        setChkSales(false);
        setChkUnfilled(false);
        setSelectedISCIinfo(null);
        if(props.data && props.data.length > 0)
            getSchedules();
        else
            getSchedulesByCampOrMediaPlan();
    }

    const callSaveSalesUnitsAPI = (schedules)=>{
        UpdateSalesScheduleUnitInfo(schedules).then(data => {
            notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
            setCurrentActivityData([]);
            setMediaPlanSummaryList([]);
            setSelectedCampaignOrAdvertiserId(null);
            setSelectedISCIinfo(null);
            setSelectedCell(null);
            setSelectedDays(null);
            setChkSales(false);
            setChkUnfilled(false);
            getMediaplanSummary();
            if (props.data && props.data.length > 0)
                getSchedules();
            else
                getSchedulesByCampOrMediaPlan();

            props.refreshSummary();
            props.setShowLoading(false);
            /*if (refreshPage)
                notifyWarning('Please wait. Refreshing schedules.');*/
        }).catch(err => {
            console.log(err);
            notifyError(AppLanguage.APP_MESSAGE.API_Error);
            props.setShowLoading(false);
        })
    }

    const callSaveCampaignUnitsAPI = () => {
        UpdateScheduleUnitInfo(currentActivityData).then(data => {
            notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
            setCurrentActivityData([]);
            setMediaPlanSummaryList([]);
            setSelectedCampaignOrAdvertiserId(null);
            setSelectedISCIinfo(null);
            setSelectedCell(null);
            setSelectedDays(null);
            setChkSales(false);
            setChkUnfilled(false);
            getMediaplanSummary();
            if (props.data && props.data.length > 0)
                getSchedules();
            else
                getSchedulesByCampOrMediaPlan();
            props.refreshSummary();
            props.setShowLoading(false);
            /*if (refreshPage)
                notifyWarning('Please wait. Refreshing schedules.');*/
        }).catch(err => {
            console.log(err);
            notifyError(AppLanguage.APP_MESSAGE.API_Error);
            props.setShowLoading(false);
        })
    }

    const handleSaveChanges = (refreshPage) => {
        if(currentActivityData && currentActivityData.length > 0){
            props.setShowLoading(true);
            if(props.IsCampaignPlanning){
                /*let scheduleAdUnitInfo = currentActivityData.map(x => {
                        return { ScheduleAdUnitId: x.scheduleAdUnitId, UnitTypeId: x.unitTypeId, UnitSizeId: x.unitSizeId, MediaPlanId: x.mediaPlanId }
                    }
                );

                let finalObj = {
                    ScheduleIds: currentActivityData.map(x => x.ScheduleId).join(),
                    ScheduleUnitIds: JSON.stringify(scheduleAdUnitInfo),
                    NoOfUnits: 1,
                    UnitTypeIds: '',
                    UnitSizeIds: '',
                    MediaPlanIds: currentActivityData.map(x => x.mediaPlanId).join()
                }

                ValidateCampaignInventoryAndPlan(finalObj).then(data => {
                    if (!data.status) {
                        props.setShowLoading(false);
                        setShowValidationDetails(true);
                        setErrorDetails(JSON.parse(data.data));
                    }
                    else {
                        callSaveCampaignUnitsAPI();
                    }
                }).catch(err => {
                    console.log(err);
                    props.setShowLoading(false);
                })*/
                callSaveCampaignUnitsAPI();
            }
            else
            {
                let releaseUnitsCount = currentActivityData.filter(x=> x.campaignOrAdvertiserId === 0).length;
                if(releaseUnitsCount !== currentActivityData.length){
                    let selectedPlans = currentActivityData.map(x=> x.mediaPlanId);
                    let pendingCofirmPlans = props.DropDownData.filter(x => selectedPlans.indexOf(x.value) !== -1 && x.planStatus === MEDIA_PALN_STATUS_NAMES.PendingConfirm);
                    if (pendingCofirmPlans && pendingCofirmPlans.length > 0){
                        let pendingConfirmPlanIds = pendingCofirmPlans.map(x => x.value);
                        let scheduleAdUnitInfo = currentActivityData.filter(y=> pendingConfirmPlanIds.indexOf(y.mediaPlanId) !== -1).map(x => { 
                            return { ScheduleAdUnitId: x.scheduleAdUnitId, UnitTypeId: x.unitTypeId, UnitSizeId: x.unitSizeId, MediaPlanId: x.mediaPlanId }}
                        );

                        let finalObj = {
                            ScheduleIds: currentActivityData.map(x => x.ScheduleId).join(),
                            ScheduleUnitIds: JSON.stringify(scheduleAdUnitInfo),
                            NoOfUnits: 1,
                            UnitTypeIds: '',
                            UnitSizeIds: '',
                            MediaPlanIds: pendingCofirmPlans.map(x=> x.mediaPlanId).join()
                        }

                        ValidateSalesInventoryAndPlan(finalObj).then(data => {
                            if (!data.status) {
                                props.setShowLoading(false);
                                setShowValidationDetails(true);
                                setErrorDetails(JSON.parse(data.data));
                            }
                            else {
                                let updSchedules = currentActivityData.map(obj => {
                                    if (pendingConfirmPlanIds.indexOf(obj.mediaPlanId) !== -1){
                                        let newObj = { ...obj, statusId: SCHEDULE_ADUNIT_STATUS_IDS.PendingConfirm };
                                        return newObj;
                                    }
                                    
                                    return obj;
                                });
                                callSaveSalesUnitsAPI(updSchedules);
                            }
                        }).catch(err => {
                            console.log(err);
                            props.setShowLoading(false);
                        })
                    }
                    else
                        callSaveSalesUnitsAPI(currentActivityData);
                }
                else
                    callSaveSalesUnitsAPI(currentActivityData);
            }
        }
        else if (refreshPage){
            setSelectedCell(null);
            if (props.data && props.data.length > 0)
                getSchedules();
            else
                getSchedulesByCampOrMediaPlan();
        }
        else
            notifyWarning('There are no changes to save');
    }

    return (
        <Container maxWidth={false}
            disableGutters className={classes.container}>
            <Grid container>
                <Grid md={12} mb={1}>
                    <DayDropDown {...props}
                        onSelectionChange={(days, chkSales, chkUnfilled) => populateData(days, chkSales, chkUnfilled)}
                        minStartDate={props.startDate} maxEndDate={props.endDate}
                        startDate={selectedStartDate} endDate={selectedEndDate}
                        ChangeStartDate={(val)=>setSelectedStartDate(val)}
                        ChangeEndDate={(val) => setSelectedEndDate(val)}
                    />
                </Grid>
                <Grid container alignItems="flex-start" md={12}>
                    <Grid item xs={4}>
                        {props.IsCampaignPlanning && <CampaignList {...props} collapseData={[]}
                            IscisList={isciSList}
                            onHeaderSelectionChange={(mediaPlanId, campOrAdvId) => onHeaderSelectionChange(mediaPlanId, campOrAdvId)}
                            onISCISelectionChange={(isciInfo, mediaPlanId) => onISCISelectionChange(isciInfo, mediaPlanId)}
                            SummaryList={mediaPlanSummaryList}
                            setlecedMediaPlan={selectedMediaPlanId}
                            selectedISCIinfo={selectedISCIinfo} />}
                            
                        {!props.IsCampaignPlanning && <MediaPlansList 
                            {...props} collapseData={[]}
                            onHeaderSelectionChange={(mediaPlanId, campOrAdvId) => onHeaderSelectionChange(mediaPlanId, campOrAdvId)}
                            SummaryList={mediaPlanSummaryList}
                            setlecedMediaPlan={selectedMediaPlanId}
                        /> }
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container ml={0.5} >
                            <Grid item xs={12}>
                                <CalendarPlanning Schedules={schedulesList??[]}
                                    IsLoading={isLoading}
                                    startDate={props.startDate} endDate={props.endDate}
                                    onCellClick={(item) => onCellClick(item)}
                                    IsCampaignPlanning={props.IsCampaignPlanning}
                                    onCellAction={(item, action) => onCellAction(item, action)}
                                    prevAction={prevAction} CancelCellAction={() => CancelCellAction()}
                                    selectedCampaignOrAdvertiserId={selectedCampaignOrAdvertiserId}
                                    updateScheduleBreakPostion={updateScheduleBreakPostion}
                                    selectedMediaPlanId={selectedMediaPlanId}
                                    RefreshPage={()=>handleSaveChanges(true)}
                                    selectedISCIinfo={selectedISCIinfo} />
                            </Grid>
                            <Grid item xs={9} pt={2}>
                                <Box display="flex" flex="1" alignItems="center">
                                    <Box pr={2} component="div" display="flex" flexDirection="row" alignItems="center">
                                        <CircleIcon style={{color: '#F6AB27' }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption">Working/Proposed</Typography>
                                    </Box>
                                    <Box pr={2} component="div" display="flex" flexDirection="row" alignItems="center">
                                        <CircleIcon style={{ color: '#7CB9E8' }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption">Pending Confirm</Typography>
                                    </Box>
                                    <Box pr={2} component="div" display="flex" flexDirection="row" alignItems="center">
                                        <CircleIcon style={{ color: '#F62727' }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption">Confirmed</Typography>
                                    </Box>
                                    <Box component="div" display="flex" flexDirection="row" alignItems="center">
                                        <CircleIcon style={{ color: '#C4C4C4' }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption">Available</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={3} pt={2}>
                                <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                                    <Button onClick={handleClear} color="secondary">{'Reset'}</Button>
                                    <Button onClick={handleSaveChanges} color="primary" variant="contained">{'Save'}</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>                   
                </Grid>
            </Grid>
            <ToastContainer autoClose={3000} />
            <DrawerComponent
                open={showValidationDetails}
                handleDrawerClose={() => setShowValidationDetails(false)}
                handleDrawerOpen={() => setShowValidationDetails(true)}
                anchor={"right"}
                className={classes.validationDrawer}
            >
                <ErrorDetails errorDetails={errorDetails} handleClose={() => setShowValidationDetails(false)} key="CalValPlanConfirm" />
            </DrawerComponent>
        </Container>
    )
}
export default CalendarViewMediaPlanning;