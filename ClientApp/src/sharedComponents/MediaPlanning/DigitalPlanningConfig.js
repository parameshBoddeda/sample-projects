import React, { useState, useEffect, useContext } from 'react'
import { TextField, Typography } from '@mui/material';
import { Grid, Box, Divider, IconButton, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';

import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import MultiSelectDropdown from '../../sharedComponents/Dropdown/MulltiSelectDropdown';
import PickDateRange from '../../sharedComponents/PickDateRange/PickDateRange';
import { GetISCIList } from '../../services/common.service';
import {
    GetScheduleAndUnits, SaveCampaignMediaPlanAndUnits, GetAvailableEpisodeAndUnits, SaveDigitalMediaPlanData,
    GetDaywiseImpressions, GetISCIsByCampaignId
} from '../../services/planning.service';
import { GetDigitalInventoryAdditionalInfo } from '../../services/inventory.service';
import AppDataContext from '../../common/AppContext';
import ScheduleList from './ScheduleList';
import DrawerComponent from '../Drawer/DrawerComponent';
import PickDate from '../PickDate/PickDate';
import PlanFieldsConfig from './PlanFieldsConfig';
import Helper from '../../common/Helper';
import TextboxField from '../TextboxField/TextboxField';
import ChipsList from '../chips/ChipsList';
import TargetImpressionsList from './TargetImpressionsList';

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }

const useStyles = makeStyles(theme => ({
    hidden: {
        display: 'none !important',
    },
    rowContainer: {
        border: "none",
        borderBottom: "1px solid",
        width: '100%'
    },
    container: {
        padding: '16px 0px',
        width: '100%'
    },
    date1: {
        '& .MuiInputLabel-root': {
            fontSize: '.75rem',
            transform: 'translate(14px, 6px) scale(1)',
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(.35, .75),
        },
    },
    selected: {
        background: "#e4ecff"
    },
    rateCardRow: {
        cursor: "pointer"
    },
    updatedRate: {
        color: '#ff6347',
    },
    validFrom: {
        width: '-webkit-fill-available',
    },
    green: {
        color: '#3eff3e'
    },
    grey: {
        color: '#9fa19f'
    },
    scheduleDrawer: {
        '& .MuiDrawer-paper': {
            width: '50%',
            margin: '50px 0 0 0px',
            padding: theme.spacing(2, 1),

        },
    },

}));

const DigitalPlanningConfig = (props) => {
    const classes = useStyles();
    const { leagueId, DayPartList, DigitalPlacement, DemographicList, RateType } = useContext(AppDataContext);
    const [totalImpressions, setTotalImpressions] = useState([]);
    const [data, setData] = useState(props.data ? props.data : []);
    const [startDate, setStartDate] = useState(props.startDate ? props.startDate : null);
    const [endDate, setEndDate] = useState(props.endDate ? props.endDate : null);
    //const [rateTypeData, setRateTypeData] = useState([]);
    const [dayPart, setDayPart] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [rate, setRate] = useState(0);
    const [selectedDemographics, setSelectedDemographics] = useState([]);
    const [trackingUrl, setTrackingUrl] = useState(null);
    const [impressions, setImpressions] = useState(null);
    const [customerRate, setCustomerRate] = useState(0);
    const [unitSizes, setUnitSizes] = useState([]);
    const [unitSizesData, setUnitSizesData] = useState([]);
    const [networkNames, setNetworkNames] = useState('');
    const [assetNames, setAssetNames] = useState('');
    const [regionNames, setRegionNames] = useState('');
    const [countryNames, setCountryNames] = useState('');
    const [assetIds, setAssetIds] = useState('');
    const [inventoryIds, setInventoryIds] = useState('');
    const [campaignOrMediaPlanName, setCampaignOrMediaPlanName] = useState(null);
    const [mediaPlanId, setMediaPlanId] = useState(null);
    const [campaignOrAdvertiserId, setCampaignOrAdvertiserId] = useState(null);
    const [totalDollarAmount, setTotalDollarAmount] = useState(0);

    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [selectedPlacementName, setSelectedPlacementName] = useState(null);
    const [selectedRateType, setSelectedRateType] = useState(803);
    const [selectedRateTypeName, setSelectedRateTypeName] = useState('CPM');
    const [comments, setComments] = useState(null);
    const [show, setShow] = useState(false);
    const [showImpression, setShowImpressions] = useState(false);
    const [lastYearImp, setLastYearImp] = useState(0);
    const [availImps, setAvailImps] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);

    const [IsPureDigital, setIsPureDigital] = useState(false);
    const [isPercentOrImpsToUpdate, setIsPercentOrImpsToUpdate] = useState(false);
    const [isImpsForAllAssets, setIsImpsForAllAssets] = useState(true);

    let fieldsInfo = PlanFieldsConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaTypeParent: data?.mediaTypeParentName, MediaType: data?.mediaTypeName });

    useEffect(() => {
        setIsPureDigital(props.IsPureDigital);
    }, [props.IsPureDigital]);

    useEffect(() => {
        setDefault();
    }, [leagueId]);

    /*useEffect(() => {
        if (RateType && RateType.length > 0) {
            let list = RateType.filter(x => x.label !== 'Spot');
            setRateTypeData(list);
        }
    }, [RateType])*/

    const setDefault = () => {
        setIsPureDigital(false);
        setData([]);
        setPercentage(null);
        setRate(0);

        setTrackingUrl('');
        setImpressions(null);
        setCustomerRate(null);
        setUnitSizes([]);

        setNetworkNames('');
        setAssetNames('');
        setRegionNames('');
        setCountryNames('');
        setAssetIds('');
        setInventoryIds('');

        setMediaPlanId(null);
        setCampaignOrAdvertiserId(null);
        setCampaignOrMediaPlanName(null);
        setTotalDollarAmount(0);

        setSelectedPlacement(null);
        setSelectedPlacementName(null);
        setSelectedRateType(null);
        setSelectedRateTypeName(null);
        setComments(null);
        setTotalImpressions([]);
        setIsEditMode(false);
        setIsImpsForAllAssets(true);
    }

    useEffect(() => {
        if (props.data && props.data.length > 0) {
            handleClear();
            setData(props.data[0]);
            setIsEditMode(false);

            var inventoryIDs = [];
            var assetIds = [];
            var selectedAssets = [];
            let unitSizes = [];
            var selectedCountries = [];
            var selectedRegions = [];
            props.data.map(function (inventory, k) {
                inventoryIDs.push(inventory.inventoryId);
                assetIds.push(inventory.assetId);
                selectedAssets.push(inventory.assetName);
                selectedRegions.push(inventory.regionName);
                selectedCountries.push(inventory.countryName);
                if (inventory.unitSizes && inventory.unitSizes !== '')
                    unitSizes = unitSizes.concat(inventory.unitSizes.split(';'));
                return null;
            });

            setInventoryIds(inventoryIDs.join(','));
            setAssetIds(assetIds.join(','));
            setAssetNames(selectedAssets.join(','));
            setRegionNames([...new Set(selectedRegions)].join(','));
            setCountryNames([...new Set(selectedCountries)].join(','));
            let unitSizesList = [...new Set(unitSizes)].map(size => {
                return { label: size, value: size };
            });
            setUnitSizesData(unitSizesList);
            setUnitSizes(unitSizesList);

            if (props.IsPureDigital) {
                setIsPureDigital(true);
            }

            if (!isEditMode && props.DropDownData && props.DropDownData?.length === 1) {
                setMediaPlanId(props.DropDownData[0].value);
                setCampaignOrAdvertiserId(props.DropDownData[0].campaignOrAdvertiserId);
                setCampaignOrMediaPlanName(props.DropDownData[0].label);
                if (props.IsPureDigital)
                    getDaywiseImpressions(inventoryIDs, props.data[0].unitTypeId, props.DropDownData[0].value);
            }

            fieldsInfo = PlanFieldsConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaTypeParent: props.IsROS ? 'ROS' : props.data[0]?.mediaTypeParentName, MediaType: props.IsROS ? 'ROS' : props.data[0]?.mediaTypeName });
            let nonPrime = DayPartList.find(x => x.lookupText.toUpperCase() === 'NON-PRIME');
            
            let defaultRateType = props.rateTypeData.find(x => x.label === 'CPM');
            let rate = props.data[0].rates?.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType.value)?.rate;
            setRate(rate ?? 0);
            setCustomerRate(rate ?? 0);
            setSelectedRateType(defaultRateType.lookupId);
            setSelectedRateTypeName(defaultRateType.lookupText);

            let defaultPlacement = DigitalPlacement.find(x => x.label === 'ROS');
            setSelectedPlacement(defaultPlacement.value);
            setSelectedPlacementName(defaultPlacement.label);

            setPercentage(0);
        }
        // else {
        //     setData([]);
        //     setInventoryIds(null);
        //     handleClear();
        // }

    }, [props.data]);

    useEffect(() => {
        if (props.editedMediaPlanInfo) {
            populateEditPlanData();
        }
    }, [props.editedMediaPlanInfo]);

    const populateEditPlanData = ()=>{
        if ((props.editedMediaPlanInfo?.inventoryId == data.inventoryId) && (props.editedMediaPlanInfo?.mediaPlanId == data.mediaPlanId)) {
            return;
        }
        handleClear();
        let editPlanData = props.editedMediaPlanInfo;
        editPlanData.partnerName = editPlanData.channels;
        setData(editPlanData);
        setMediaPlanId(editPlanData.mediaPlanId);
        setCampaignOrAdvertiserId(editPlanData.campaignOrAdvertiserId);

        setCampaignOrMediaPlanName(editPlanData.planName);
        setStartDate(editPlanData.startDate);
        setEndDate(editPlanData.endDate);
        setRate(editPlanData.baseRate);
        setCustomerRate(editPlanData.rate);
        setIsEditMode(true);
        if (editPlanData.mediaTypeName === 'Digital') {
            setIsPureDigital(true);
            setInventoryIds(editPlanData.inventoryId.toString());
            let defaultRateType = props.rateTypeData.find(x => x.label === editPlanData.rateTypeName);
            setSelectedRateType(defaultRateType.lookupId);
            setSelectedRateTypeName(defaultRateType.lookupText);

            setImpressions(editPlanData.impressions);
            setInventoryIds(editPlanData.inventoryId.toString());
        }
        else if (editPlanData.mediaTypeName === 'Social Media') {
            setIsPureDigital(false);
            setImpressions(editPlanData.impressions);
            let defaultRateType = props.rateTypeData.find(x => x.label === editPlanData.rateTypeName);
            setSelectedRateType(defaultRateType.lookupId);
            setSelectedRateTypeName(defaultRateType.lookupText);
            setInventoryIds(editPlanData.inventoryId.toString());
        }

        setAssetIds(editPlanData.assetId.toString());

        fieldsInfo = PlanFieldsConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaTypeParent: editPlanData.mediaTypeParentName, MediaType: editPlanData.mediaTypeName });
    }

    useEffect(() => {
        if (isEditMode) {
            if (IsPureDigital) {
                //getDaywiseImpressions();
                getDigitalInventoryUnitSizes(data.inventoryId);
            }
        }
    }, [isEditMode]);

    useEffect(() => {
        if(!props.editedMediaPlanInfo){
            setStartDate(props.startDate);
            setEndDate(props.endDate);
        }
    }, [props.startDate, props.endDate]);

    useEffect(() => {
        if (isPercentOrImpsToUpdate) {
            setIsPercentOrImpsToUpdate(false);
            let totalImp = lastYearImp;
            let total = 0;
            if (selectedRateType && customerRate && impressions) {
                if (totalImp > 0)
                    setPercentage(((impressions / totalImp) * 100).toFixed(2));

                if (selectedRateTypeName === 'CPM') {
                    total = Math.round((impressions / 1000) * customerRate)
                }
                else if (selectedRateTypeName === 'CPV') {
                    total = Math.round(impressions * customerRate)
                }
                else
                    total = customerRate;

                setTotalDollarAmount(total);
            }
            else if (selectedRateType && customerRate && percentage) {
                setImpressions(Math.round(totalImp * (percentage / 100)));
                if (selectedRateTypeName === 'CPM') {
                    total = Math.round(((totalImp * (percentage / 100)) / 1000) * customerRate);
                }
                else if (selectedRateTypeName === 'CPV') {
                    total = Math.round(totalImp * (percentage / 100) * customerRate);
                }
                else
                    total = customerRate;

                setTotalDollarAmount(total);
            }
            else {
                setTotalDollarAmount(0);
            }
        }
    }, [percentage, customerRate, selectedRateType, selectedRateTypeName, impressions])

    const getDigitalInventoryUnitSizes = (inventoryId) => {
        GetDigitalInventoryAdditionalInfo(inventoryId).then(res => {
            if (res.length > 0) {
                let unitSizesList = res[0].uniqueSizes.split(';').map(size => {
                    return { label: size, value: size };
                })
                setUnitSizesData(unitSizesList);

                if (isEditMode) {
                    let selUnitSizesList = data.unitSizeName.split(',').map(size => {
                        return { label: size, value: size };
                    })
                    setUnitSizes(selUnitSizesList);
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getDaywiseImpressions = (Ids, unitTypeId, planId, sDate, eDate) => {
        sDate = sDate ?? startDate;
        eDate = eDate ?? endDate;
        let obj = {
            StartDate: sDate,
            EndDate: eDate,
            InventoryIds: Ids?.join() ?? inventoryIds,
            UnitTypeId: unitTypeId ?? data.unitTypeId,
            IsCampaignPlanning: props.IsCampaignPlanning,
            MediaPlanId: planId ?? mediaPlanId
        }

        if (obj.MediaPlanId) {
            GetDaywiseImpressions(obj).then(res => {
                let isAllImprsExist = true;
                let objList = [];
                let noDays = ((new Date(eDate) - new Date(sDate)) / (1000 * 3600 * 24)) + 1;
                let selectedInvs = isEditMode ? [data] : (props.data && props.data.length > 0 ? props.data : [data]);
                for (let i = 0; i < noDays; i++) {
                    let newDate = moment(new Date(Helper.FormatDate(sDate))).add(i, 'd');
                    selectedInvs.map(function (item, k) {
                        var dayData = res.find(x => Helper.FormatDate(x.date) === Helper.FormatDate(newDate) && item.inventoryId === x.inventoryId);

                        var obj = { "assetId": item.assetId, "assetName": item.assetName, "instImpressions": 0, "salesImpressions": 0, "instUsedImpressions": 0, "salesUsedImpressions": 0, "date": "", "country": item.countryName, "inventoryId": item.inventoryId };
                        if (!dayData || dayData === null)
                            isAllImprsExist = false;
                        else {
                            obj = dayData;
                        }

                        obj.date = Helper.FormatDate(newDate);
                        objList.push(obj);
                    });
                }

                if (selectedInvs.length > 1)
                    setIsImpsForAllAssets(isAllImprsExist);

                let sortedData = objList.sort((a, b) => (Helper.FormatDate(a.date) > Helper.FormatDate(b.date)) ? 1 : -1);

                setTotalImpressions(sortedData);
                let lastYearTotal = props.IsCampaignPlanning ? sortedData.map(item => item.instImpressions).reduce((prev, curr) => prev + curr, 0)
                    : sortedData.map(item => item.salesImpressions).reduce((prev, curr) => prev + curr, 0);

                let availsTotal = props.IsCampaignPlanning ? sortedData.map(item => item.instImpressions - item.instUsedImpressions).reduce((prev, curr) => prev + curr, 0)
                    : sortedData.map(item => item.salesImpressions - item.salesUsedImpressions).reduce((prev, curr) => prev + curr, 0);

                setLastYearImp(lastYearTotal);
                setAvailImps(availsTotal);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const handleStartDateChange = (val) => {
        if (val < props.startDate) {
            setStartDate(null);
            notifyWarning('Selected Date range is outside the filter data range');
            return;
        }

        setStartDate(val);
    }

    useEffect(() => {
        if (IsPureDigital && !isEditMode) {
            setImpressions(0);
            setPercentage(0);
            setTotalDollarAmount(0);
        }

        if (IsPureDigital) {
            /*if (totalImpressions.length > 0 && Helper.FormatDate(data.startDate) >= Helper.FormatDate(startDate) && Helper.FormatDate(data.endDate) <= Helper.FormatDate(endDate)) {
                getLastYearAndAvailableImpressions(totalImpressions, startDate, endDate);
            }
            else*/
                getDaywiseImpressions(null, null, null, Helper.FormatDate(startDate), Helper.FormatDate(endDate));
        }

    }, [startDate, endDate])

    const handleEndDateChange = (val) => {
        if (val > Helper.FormatToIsoDate(props.endDate)) {
            setEndDate(null);
            notifyWarning('Selected Date range is outside the filter data range');
            return;
        }

        setEndDate(val);
    }

    const getLastYearAndAvailableImpressions = (imp, startDate, endDate) => {
        let filteredData = imp.filter(x => Helper.FormatDate(x.date) >= Helper.FormatDate(startDate) && Helper.FormatDate(x.date) <= Helper.FormatDate(endDate));
        let lastYearTotal = props.IsCampaignPlanning ? filteredData.map(item => item.instImpressions).reduce((prev, curr) => prev + curr, 0)
            : filteredData.map(item => item.salesImpressions).reduce((prev, curr) => prev + curr, 0);
        let currYearTotal = props.IsCampaignPlanning ? filteredData.map(item => item.instUsedImpressions).reduce((prev, curr) => prev + curr, 0)
            : filteredData.map(item => item.salesUsedImpressions).reduce((prev, curr) => prev + curr, 0);

        let availableImpressions = lastYearTotal - currYearTotal;
        setLastYearImp(lastYearTotal);
        setAvailImps(availableImpressions);
    }

    const handlePlacementChange = (e, val) => {
        setSelectedPlacement(val.value);
        setSelectedPlacementName(val.label);
    }

    const handleRateTypeChange = (e, val) => {
        setIsPercentOrImpsToUpdate(true);
        setSelectedRateType(val.value);
        setSelectedRateTypeName(val.label);
        let rate = data?.rates?.find(x => x.rateTypeId === val.value)?.rate;
        let custRate = data?.rates?.find(x => x.rateTypeId === val.value)?.customerRate;
        setRate(rate ?? 0);
        setCustomerRate(custRate && custRate !== 0 ? custRate : rate ?? 0);
    }

    const handleCommentChange = (val) => {
        setComments(val);
    }

    const handleTrackingLinkChange = (val) => {
        setTrackingUrl(val);
    }

    const handlePercentageChange = (e) => {
        if (IsPureDigital && mediaPlanId && lastYearImp === 0) {
            notifyWarning('Please enter Target Impressions');
            return;
        }

        setPercentage(e.target.value);
        if (IsPureDigital) {
            setImpressions(0);
            setIsPercentOrImpsToUpdate(true);
        }
        if (e.target.value > 100) {
            setPercentage(100);
            notifyWarning('The percentage value cannot be more than 100');
        }
    }

    const handleCustomerRate = (e) => {
        setIsPercentOrImpsToUpdate(true);

        if (e.target.value > 0)
            setCustomerRate(e.target.value);
        else
            setCustomerRate(0);
    }

    const handleImpressions = (e) => {
        if (e.target.value > 0) {
            setImpressions(e.target.value);
            setPercentage(0);
            setIsPercentOrImpsToUpdate(true);
        } else {
            setImpressions(0);
        }
    }

    const handleCampaignOrMediaPlanChange = (e, val) => {
        setMediaPlanId(val.value);
        setCampaignOrAdvertiserId(val.campaignOrAdvertiserId);
        setCampaignOrMediaPlanName(val.label);
        let nonPrime = DayPartList.find(x => x.label.toUpperCase() === 'NON-PRIME');

        let impCPM = props.rateTypeData.find(x => x.label === 'CPM');
        setSelectedRateType(impCPM.value);
        setSelectedRateTypeName(impCPM.label);
        let defaultRateType = props.rateTypeData.find(x => x.label === 'CPM');
        let rate = data.rates?.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType.value)?.rate;
        let customerRate = data.rates?.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType.value)?.customerRate;
        setRate(rate ?? 0);
        setCustomerRate(customerRate !== 0 ? customerRate : rate ?? 0);
        if (IsPureDigital)
            getDaywiseImpressions(null, null, val.value);
    }

    const handleClear = () => {
        setStartDate(props.startDate);
        setEndDate(props.endDate);
        setUnitSizesData([]);
        props.clearEditMediaPlanData();
        setDefault();
    }

    const handleClose = () => {
        setShow(false);
        setShowImpressions(false);
    }

    const handleOpen = () => {
        setShow(true);
    }

    const handleImpressionsDrawer = () => {
        setShowImpressions(true);
    }

    const handleSaveImpressions = (impData) => {
        setIsPercentOrImpsToUpdate(false);
        setImpressions(impData.TargetImpressions);
        setPercentage(impData.PercentImpressions);
        setIsImpsForAllAssets(true);

        let guid = Helper.GetRandomId(6);
        let noDays = ((new Date(Helper.FormatDate(endDate)) - new Date(Helper.FormatDate(startDate))) / (1000 * 3600 * 24)) + 1;
        let rateI = props.IsCampaignPlanning ? rate : (parseFloat(customerRate) ?? rate);
        let schedules = impData.ImpressionData.map(dayImp => {
            /*let perDateRate = 0;
            if (selectedRateTypeName === 'CPM') {
                perDateRate = (dayImp.calcImpressions / 1000) * rateI;
            }
            else if (selectedRateTypeName === 'CPV') {
                perDateRate = dayImp.calcImpressions * rateI;
            }
            else {
                perDateRate = (rateI / noDays);
            }*/

            return {
                MediaPlanId: mediaPlanId,
                Date: Helper.FormatDate(dayImp.date),
                InventoryId: dayImp.inventoryId,
                Impressions: dayImp.calcImpressions,
                UnitTypeId: data.unitTypeId,
                UnitSizeId: data.unitSizeId,
                Percentage: impData.PercentImpressions,
                CustomerRate: rateI,
                Group: guid
            }
        });
        handleSaveMediaPlanUnits(schedules);
    }

    const handleSaveData = (schedules) => {
        handleSaveMediaPlanUnits(schedules);
    }

    const calculateImpressions = (impdata) => {
        if (lastYearImp === 0) return [];

        impdata = impdata.filter(x => new Date(Helper.FormatDate(x.date)) >= new Date(Helper.FormatDate(startDate))
            && new Date(Helper.FormatDate(x.date)) <= new Date(Helper.FormatDate(endDate)));

        let targetImp = impressions;

        let daySum = 0;
        let finalData = impdata.map((dayImp) => {
            let lastImp = props.IsCampaignPlanning ? dayImp.instImpressions : dayImp.salesImpressions;
            let currImp = Math.floor((lastImp / lastYearImp) * targetImp);
            daySum += currImp;
            return { ...dayImp, calcImpressions: currImp };
        });

        if (targetImp - daySum > 0 && finalData.length > 0)
            finalData[finalData.length - 1].calcImpressions = finalData[finalData.length - 1].calcImpressions + (targetImp - daySum);

        let guid = Helper.GetRandomId(6);
        let noDays = ((new Date(Helper.FormatDate(endDate)) - new Date(Helper.FormatDate(startDate))) / (1000 * 3600 * 24)) + 1;
        let rateI = props.IsCampaignPlanning ? rate : (parseFloat(customerRate) ?? rate);

        let schedules = finalData.map(dayImp => {
            /*let perDateRate = 0;
            if (selectedRateTypeName === 'CPM') {
                perDateRate = (dayImp.calcImpressions / 1000) * rateI;
            }
            else if (selectedRateTypeName === 'CPV') {
                perDateRate = dayImp.calcImpressions * rateI;
            }
            else {
                perDateRate = (rateI / noDays);
            }*/
            return {
                MediaPlanId: mediaPlanId,
                Date: Helper.FormatDate(dayImp.date),
                InventoryId: dayImp.inventoryId,
                Impressions: dayImp.calcImpressions,
                UnitTypeId: data.unitTypeId,
                UnitSizeId: data.unitSizeId,
                Percentage: percentage,
                CustomerRate: rateI,
                Group: guid
            }
        });

        return schedules.filter(x => x.Impressions !== 0);
    }

    const handleSaveMediaPlanUnits = (schedules) => {
        let isValid = true;
        if (!isEditMode && (new Date(startDate) < new Date(props.startDate) || new Date(endDate) > new Date(props.endDate))) {
            notifyWarning('Selected Date range is outside the filter data range');
            isValid = false;
        }

        if (!mediaPlanId || mediaPlanId <= 0) {
            notifyWarning('Please select ' + (props.IsCampaignPlanning ? 'Campaign.' : 'Media Plan.'));
            isValid = false;
        }

        if (!isEditMode && (selectedPlacement === 0) || (selectedPlacement === null)) {
            notifyWarning('Please select Placement.');
            isValid = false;
        }

        if (!isEditMode && (selectedRateType === 0) || (selectedRateType === null)) {
            notifyWarning('Please select Rate Type');
            isValid = false;
        }

        if (!isEditMode && IsPureDigital && unitSizes.length === 0) {
            notifyWarning('Please select Unit Size');
            isValid = false;
        }

        if (!isEditMode && IsPureDigital && !schedules && (!impressions || impressions === 0) && percentage <= 0) {
            notifyWarning('Please enter either Impressions or Percentage.');
            isValid = false;
        }
        else if (!isEditMode && !IsPureDigital && (!impressions || impressions === 0)) {
            notifyWarning('Please enter Impressions.');
            isValid = false;
        }
        else if (!isEditMode && IsPureDigital && !isImpsForAllAssets) {
            notifyWarning('Impressions are not available for an Asset. Click Daywise popup to enter impressions.');
            isValid = false;
        }        

        if (isValid) {
            var unitSizesDrp = unitSizes;
            var unitSizesCal = unitSizesDrp.map(x => x.value);
            let planHeaderInfo = {
                MediaPlanId: mediaPlanId,
                UnitTypeId: data.unitTypeId,
                UnitSizes: unitSizesCal.join(', '),
                Placement: selectedPlacement,
                TrackingUrl: trackingUrl,
                RateType: selectedRateType,
                InventoryIds: inventoryIds,
                Rate: selectedRateType === 804 ? parseFloat(customerRate) : null,
                Comment: comments
            }

            if (IsPureDigital && (!schedules || schedules.length === 0)) {
                schedules = calculateImpressions(totalImpressions);
            }

            if (impressions > 0 && (!schedules || schedules.length === 0)) {
                schedules = [];
                let noDays = ((new Date(Helper.FormatDate(endDate)) - new Date(Helper.FormatDate(startDate))) / (1000 * 3600 * 24)) + 1;
                let dayImpressions = Math.floor(impressions / noDays);
                let guid = Helper.GetRandomId(6);
                let leftOverImp = impressions - (dayImpressions * noDays);
                let rateI = props.IsCampaignPlanning ? rate : (parseFloat(customerRate) ?? rate);
                inventoryIds.split(',').map(Id => {
                    for (let i = 0; i < noDays; i++) {
                        let newDate = moment(new Date(Helper.FormatDate(startDate))).add(i, 'd');
                        /*let perDateRate = 0;
                        if (selectedRateTypeName === 'CPM') {
                            perDateRate = (dayImpressions / 1000) * rateI;
                        }
                        else if (selectedRateTypeName === 'CPV') {
                            perDateRate = dayImpressions * rateI;
                        }
                        else {
                            perDateRate = (rateI / noDays);
                        }*/
                        let obj = {
                            MediaPlanId: mediaPlanId,
                            Date: Helper.FormatDate(newDate),
                            InventoryId: Id,
                            Impressions: dayImpressions,
                            UnitTypeId: data.unitTypeId,
                            UnitSizeId: data.unitSizeId,
                            ImpressionSource: '1',
                            Percentage: percentage,
                            CustomerRate: rateI,
                            Group: guid
                        }
                        schedules.push(obj);
                    }
                })

                if (schedules.length > 0 && leftOverImp > 0)
                    schedules[schedules.length - 1].Impressions = schedules[schedules.length - 1].Impressions + leftOverImp;
            }

            let assetRateInfo = null;
            if (!props.IsCampaignPlanning && rate === 0 && customerRate > 0) {
                assetRateInfo = [];
                assetIds.split(',').map(assetId => {
                    let rateInfo = {
                        AdvertiserId: campaignOrAdvertiserId,
                        InventoryId: data.inventoryId,
                        RateCardMasterId: -1,
                        CustomerRate: customerRate,
                        Rate: rate,
                        DayPartId: 852,
                        AssetId: assetId,
                        UnitTypeId: data.unitTypeId,
                        UnitSizeId: data.unitSizeId,
                        RateTypeId: selectedRateType
                    }

                    assetRateInfo.push(rateInfo);
                })
            }

            let unassignPlanImps = null;
            if (isEditMode) {
                unassignPlanImps = {
                    MediaPlanId: mediaPlanId,
                    StartDate: Helper.FormatDate(startDate),
                    EndDate: Helper.FormatDate(endDate),
                    InventoryIds: inventoryIds,
                    UnitTypeId: data.unitTypeId,
                    UnitSizeId: data.unitSizeId,
                    IsCampaignPlanning: props.IsCampaignPlanning,
                    MediaTypeId: data.mediaTypeParentId
                }
            }

            let finalObj = {
                IsCampaignPlanning: props.IsCampaignPlanning,
                HeaderInfo: planHeaderInfo,
                RateInfo: assetRateInfo,
                UnassignPlanImps: unassignPlanImps,
                PlanDetails: schedules
            }

            //return;
            //Call API to Save
            SaveDigitalMediaPlanData(finalObj).then(data => {
                props.refreshSummary();
                handleClear();
                notifySuccess('Data saved successfully.');
                props.setShowLoading(false);
            }).catch(err => {
                console.log(err);
                props.setShowLoading(false);
            })
            
        } else {
            props.setShowLoading(false);
        }
    }

    const handleChange = (name, value) => {
        if (name === 'unitsize') {
            var unitSizesNew = unitSizes.slice();
            let index = unitSizesNew.findIndex(x => x.value === value.value);
            if (index === -1) {
                unitSizesNew.push(value);
                setUnitSizes(unitSizesNew);
            }
        }
        if (name === 'demography') {
            var list = selectedDemographics.slice();
            let index = list.findIndex(x => x.value === value.value);
            if (index === -1) {
                list.push(value);
                setSelectedDemographics(list);
            }
        }
    }

    const handleDelete = (name, value) => {
        if (name === 'unitsize') {
            var unitSizesNew = unitSizes.slice();
            let index = unitSizesNew.findIndex(x => x.label === value.value)
            unitSizesNew.splice(index, 1);
            setUnitSizes(unitSizesNew);
        }
        if (name === 'demographics') {
            var list = selectedDemographics.slice();
            let index = list.findIndex(x => x.label === value)
            list.splice(index, 1);
            setSelectedDemographics(list);
        }
    }

    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <Grid className={``} key={`DigitalConfigGridReadOnly`} item xs={12} pb={1}>
                <Box px={1}>
                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={3} pt={0.5}>
                                    <Box pl={1}>
                                        <Dropdown disabled={isEditMode} size="small" id="campaign" variant="outlined" showLabel={true}
                                            lbldropdown={props.IsCampaignPlanning ? "Campaign" : 'Media Plan'} value={campaignOrMediaPlanName} handleChange={handleCampaignOrMediaPlanChange}
                                            ddData={props.DropDownData ? props.DropDownData : []} />
                                    </Box>
                                </Grid>
                                <Grid item xs={0.75}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">League</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {data.leagueName ? data.leagueName : ''}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={1.25}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Region</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" noWrap title={regionNames ? regionNames : (data.regionNames ? data.regionNames : '')} className={classes.date1}>
                                                {regionNames ? regionNames : (data.regionName ? data.regionName : '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                {IsPureDigital && <Grid item xs={1.25}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Country</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" noWrap title={countryNames ? countryNames : (data.assetName ? data.countryName : '')} className={classes.date1}>
                                                {countryNames ? countryNames : (data.countryName ? data.countryName : '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>}
                                <Grid item xs={1.5}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Network</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" noWrap title={networkNames ? networkNames : (data.partnerName ? data.partnerName : '')} component="div" className={classes.date1}>
                                                {networkNames ? networkNames : (data.partnerName ? data.partnerName : '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={1.25}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Media Type</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {data.mediaTypeParentName ? data.mediaTypeParentName : ''}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Asset</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" noWrap title={assetNames ? assetNames : (data.assetName ? data.assetName : '')} className={classes.date1}>
                                                {assetNames ? assetNames : (data.assetName ? data.assetName : '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Unit Type</Typography>
                                        </Box>
                                        <Box component="div" >
                                            <Typography variant="subtitle2" noWrap title={data.unitTypeName ? data.unitTypeName : ''}>
                                                {data.unitTypeName ? data.unitTypeName : ''}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                {(data.mediaTypeName !== 'Digital') && <Grid item xs={1}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Unit Size</Typography>
                                        </Box>
                                        <Box component="div" >
                                            <Typography variant="subtitle2">{':' + data.unitSizeName ? data.unitSizeName : ''}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>}
                            </Grid>
                        </Grid>
                    </Grid >
                </Box >
            </Grid >
            <Grid className={``} key={`DigitalConfigGrid1`} item xs={12} pb={1}>
                <Box px={1}>
                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            <Grid container>
                                {fieldsInfo.MediaTypeFields.unitSizes.visible && fieldsInfo.MediaTypeFields.unitSizes.editable && <>
                                    <Grid item md={1.5}>
                                        <Box component="div" pl={1}>
                                            <MultiSelectDropdown name="unitsize" size="small" SMwidth="400" fullWidth lbldropdown="Unit Size"
                                                ddData={unitSizesData.length ? unitSizesData : []}
                                                handleChange={handleChange}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item md={2.5}>
                                        {unitSizes && unitSizes.length > 0 &&
                                            <ChipsList name="unitsize" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={unitSizes} />
                                        }
                                    </Grid>
                                </>}
                                <Grid item xs={!props.IsROS ? 4.50 : 4.25}>
                                    <Box component="div" pl={1}>
                                        <PickDateRange startDate={startDate} endDate={endDate} disablePast={false}
                                            setStartDate={handleStartDateChange} setEndDate={handleEndDateChange} />
                                    </Box>
                                </Grid>
                                <Grid item xs={IsPureDigital ? 1.75 : 2.5}>
                                    <Box pl={1}>
                                        <Dropdown size="small" id="placement" variant="outlined" showLabel={true} lbldropdown="Placement"
                                            value={selectedPlacementName} handleChange={handlePlacementChange} ddData={DigitalPlacement ?? []} />
                                    </Box>
                                </Grid>
                                <Grid item xs={IsPureDigital ? 1.75 : 2.25}>
                                    <Box pl={1}>
                                        <Dropdown size="small" id="rateType" variant="outlined" showLabel={true} lbldropdown="Rate Type"
                                            value={selectedRateTypeName} handleChange={handleRateTypeChange} ddData={props.rateTypeData ?? []} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid >
                </Box >
            </Grid >
            <Grid className={``} key={`DigitalConfigGrid2`} item xs={12} pb={1}>
                <Box px={1}>
                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            <Grid container>
                                {IsPureDigital && <>
                                    <Grid item xs={2}>
                                        <Box component="div" pl={1}>
                                            <Box component="div" display="flex" flexDirection="column" pl={1} borderRadius={1} style={{ backgroundColor: '#dfe3ec' }}>
                                                <Box component="div">
                                                    <Typography variant="caption">Last Year Actual</Typography>
                                                </Box>
                                                <Box component="div">
                                                    <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                        {Helper.ConvertToUSNumberFormat(lastYearImp)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box pl={1}>
                                            <Box component="div">
                                                <Typography variant="caption">{'Available' + (selectedRateTypeName ? ' ('+ selectedRateTypeName+')':'')}</Typography>
                                            </Box>
                                            <Box component="div">
                                                <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                    {Helper.ConvertToUSNumberFormat(availImps)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box component="div" pl={1} pt={1}>
                                            <TextField id="DigitalImp" size="small" variant="outlined"
                                                type="number" label={fieldsInfo.MediaTypeFields.ImpressionsLabel} fullWidth
                                                InputProps={{
                                                    inputProps: { min: 0 }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={impressions} onChange={handleImpressions} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={.25}>
                                        <Box component="div" pl={1} pt={1} display="flex" flex="1" alignItems="center">
                                            <Typography variant="caption">Or</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Box pl={1} pt={1}>
                                            <TextField id="percentage" size="small" variant="outlined"
                                                type="number" label="%"
                                                InputProps={{
                                                    inputProps: {
                                                        max: 100, min: 0
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={percentage} onChange={handlePercentageChange} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={0.5}>
                                        <Box pl={1} pt={1} display="flex" flexDirection='row' justifyContent="space-between" alignItems="center">
                                            <IconButton disabled={totalImpressions.length === 0} onClick={handleImpressionsDrawer} title={`Daywise Impressions`} size="small">
                                                <ViewListOutlinedIcon fontSize='small' color={data.length === 0 || totalImpressions.length === 0 ? 'default' : 'primary'} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </>}
                                <Grid item xs={IsPureDigital ? 1 : 1.25}>
                                    <Box pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">{fieldsInfo.MediaTypeFields.RateLabel + (selectedRateTypeName ? ' (' + selectedRateTypeName + ')' : '')}</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {Helper.ConvertToUSNumberFormat(rate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                {fieldsInfo.MediaTypeFields.customerRate.visible && <Grid item xs={1.75}>
                                    <Box component="div" pl={1} pt={1}>
                                        <TextField id="customerRate" size="small" variant="outlined"
                                            type="number" label={fieldsInfo.MediaTypeFields.CustomRateLabel + (selectedRateTypeName ? ' (' + selectedRateTypeName + ')' : '')} fullWidth
                                            InputProps={{
                                                inputProps: {
                                                    max: 100000, min: 0
                                                }
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={customerRate} onChange={handleCustomerRate} />
                                    </Box>
                                </Grid>}
                                {!IsPureDigital && fieldsInfo.MediaTypeFields.impressions.editable && <Grid item xs={2}>
                                    <Box component="div" pl={1} pt={1}>
                                        <TextField id="nonDigitalImp" size="small" variant="outlined"
                                            type="number" label={fieldsInfo.MediaTypeFields.ImpressionsLabel} fullWidth
                                            InputProps={{
                                                inputProps: { min: 0 }
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={impressions} onChange={handleImpressions} />
                                    </Box>
                                </Grid>}
                                <Grid item xs={1.25}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Total $ Amount</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {Helper.ConvertToUSNumberFormat(totalDollarAmount)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>                    
                                {fieldsInfo.MediaTypeFields?.comment?.visible && <Grid item xs={4}>
                                    <Box component="div" pl={1} pt={1}>
                                        <TextboxField fullWidth lblName="Comment" size="small" textboxData={comments} handleChange={handleCommentChange} />
                                    </Box>
                                </Grid>}
                                {fieldsInfo.MediaTypeFields?.trackingLink?.visible && <Grid item xs={4}>
                                    <Box component="div" pl={1} pt={1}>
                                        <TextboxField fullWidth lblName="Tracking Link" size="small" textboxData={trackingUrl} handleChange={handleTrackingLinkChange} />
                                    </Box>
                                </Grid>}                                
                            </Grid>
                        </Grid>
                    </Grid >
                </Box >
            </Grid >
            <Grid className={``} key={`DigitalPlanningConfigBtns`} item xs={12} pb={1}>
                <Box px={1} display="flex" alignItems="center" justifyContent="flex-end">
                    <Button onClick={handleClear} color="secondary">{'Reset'}</Button>
                    <Button onClick={() => handleSaveData()} color="primary" variant="contained">{'Save'}</Button>
                </Box>
            </Grid >

            <DrawerComponent open={show || showImpression} handleDrawerClose={handleClose} handleDrawerOpen={handleOpen} anchor={'right'} className={classes.scheduleDrawer}>
                {showImpression && <TargetImpressionsList notifyWarning={notifyWarning} handleClose={handleClose} handleSaveImpressions={handleSaveImpressions}
                    IsCampaignPlanning={props.IsCampaignPlanning} impressionLabel = {fieldsInfo.MediaTypeFields.ImpressionsLabel} PercentImpressions={percentage} TargetImpressions={impressions}
                    ImpressionsData={totalImpressions} startDate={startDate} endDate={endDate} />}
            </DrawerComponent>
        </React.Fragment >
    )
}
export default DigitalPlanningConfig;