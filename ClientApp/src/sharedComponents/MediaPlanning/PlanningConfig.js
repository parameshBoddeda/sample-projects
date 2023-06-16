import React, { useState, useEffect, useContext } from 'react'
import { TextField, Typography } from '@mui/material';
import { Grid, Box, IconButton, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';

import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import MultiSelectDropdown from '../../sharedComponents/Dropdown/MulltiSelectDropdown';
import PickDateRange from '../../sharedComponents/PickDateRange/PickDateRange';
import {
    GetScheduleAndUnits, SaveCampaignMediaPlanAndUnits, GetAvailableEpisodeAndUnits, SaveDigitalMediaPlanData, GetDigitalDefaultUnitSizesByInventory,
    GetDigitalUnitSizesByInventory,  GetDaywiseImpressions, GetISCIsByCampaignId, ValidateSalesInventoryAndPlan, 
    GetImpressionsSummary, ValidateCampaignInventoryAndPlan} from '../../services/planning.service';
import { GetRatesByInventoryId } from '../../services/rate.service';
import { GetChannels } from '../../services/common.service';
import AppDataContext from '../../common/AppContext';
import ScheduleList from './ScheduleList';
import DrawerComponent from '../Drawer/DrawerComponent';
import PickDate from '../PickDate/PickDate';
import PlanFieldsConfig from './PlanFieldsConfig';
import Helper from '../../common/Helper';
import TextboxField from '../TextboxField/TextboxField';
import ChipsList from '../chips/ChipsList';
import TargetImpressionsList from './TargetImpressionsList';
import { MEDIA_PALN_STATUS_NAMES, SCHEDULE_ADUNIT_STATUS_IDS } from '../../common/AppConstants';
import ErrorDetails from '../../screens/MediaPlanning/Planning/ErrorDetails';


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
    validationDrawer: {
        "& .MuiDrawer-paper": {
            width: "50%",
            // margin: "50px 0 0 0px",
            padding: theme.spacing(0, 1),
        },
    },
}));

const PlanningConfig = (props) => {
    const classes = useStyles();
    const {leagueId, DayPartList, DigitalPlacement, DemographicList, RateType } = useContext(AppDataContext);
    const [totalSchedules, setTotalSchedules] = useState([]);
    const [totalImpressions, setTotalImpressions] = useState([]);
    const [orgSchedules, setOrgSchedules] = useState([]);
    const [totalHPTOImpressions, setTotalHPTOImpressions] = useState([]);
    const [data, setData] = useState(props.data && props.data.length > 0 ? props.data[0] : []);
    const [editData, setEditData] = useState(null);
    const [startDate, setStartDate] = useState(props.startDate ? props.startDate : null);
    const [endDate, setEndDate] = useState(props.endDate ? props.endDate : null);
    const [rateTypeData, setRateTypeData] = useState([]);
    const [dayPart, setDayPart] = useState(null);
    const [dayPartName, setDayPartName] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [episodes, setEpisodes] = useState(null);
    const [totalEpisodes, setTotalEpisodes] = useState(props.data?.totalEpisode);
    const [unitsPerWeek, setUnitsperWeek] = useState(null);
    const [rate, setRate] = useState(0);
    const [selectedDemographics, setSelectedDemographics] = useState([]);
    const [isciSList, setISCIsList] = useState([]);
    const [selectedISCI, setSelectedISCI] = useState(null);
    const [selectedISCIName, setSelectedISCIName] = useState(null);
    const [isciStartDate, setIsciStartDate] = useState(null);
    const [isciEndDate, setIsciEndDate] = useState(null);
    const [trackingUrl, setTrackingUrl] = useState(null);
    const [impressions, setImpressions] = useState(null);
    const [customerRate, setCustomerRate] = useState(0);
    const [unitSizes, setUnitSizes] = useState([]);
    const [unitSizesData, setUnitSizesData] = useState([]);
    const [networkNames, setNetworkNames] = useState('');
    const [assetNames, setAssetNames] = useState('');
    const [regionNames, setRegionNames] = useState('');
    const [countryNames, setCountryNames] = useState('');
    //const [assetIds, setAssetIds] = useState('');
    const [inventoryIds, setInventoryIds] = useState('');
    const [isDayPartVisible, setIsDayPartVisible] = useState(false);
    const [channelsList, setChannelsList] = useState([{ label: 'All', value: 0 }]);
    const [selectedChannel, setSelectedChannel] = useState(0);
    const [selectedChannelName, setSelectedChannelName] = useState('');

    //const [campaignOrMediaPlan, setCampaignOrMediaPlan] = useState(null);
    const [campaignOrMediaPlanName, setCampaignOrMediaPlanName] = useState(null);
    const [mediaPlanId, setMediaPlanId] = useState(null);
    const [campaignOrAdvertiserId, setCampaignOrAdvertiserId] = useState(null);

    const [totalUnits, setTotalUnits] = useState(0);
    const [totalAvailUnits, setTotalAvailUnits] = useState(0);
    const [plannedUnitsPerEpisode, setPlannedUnitsPerEpisode] = useState(0);
    const [totalDollarAmount, setTotalDollarAmount] = useState(0);
    const [proposedPlanUnits, setProposedPlanUnits] = useState(null);

    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [selectedPlacementName, setSelectedPlacementName] = useState(null);
    const [selectedRateType, setSelectedRateType] = useState(803);
    const [selectedRateTypeName, setSelectedRateTypeName] = useState('CPM');
    const [comments, setComments] = useState(null);
    const [show, setShow] = useState(false);
    const [showImpression, setShowImpressions] = useState(false);
    const [lastYearImp, setLastYearImp] = useState(0);
    const [lastYearHPTOImp, setLastYearHPTOImp] = useState(0);
    const [availImps, setAvailImps] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);

    const [IsPureDigital, setIsPureDigital] = useState(false);
    const [IsDigitalPlanning, setIsDigitalPlanning] = useState(false);
    const [isPercentOrImpsToUpdate, setIsPercentOrImpsToUpdate] = useState(false);
    const [showValidationDetails, setShowValidationDetails] = useState(false);
    const [errorDetails, setErrorDetails] = useState([]);

    let fieldsInfo = PlanFieldsConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaTypeParent: data?.mediaTypeParentName, MediaType: data?.mediaTypeName });

    useEffect(()=>{
        setIsPureDigital(props.IsPureDigital);
    },[props.IsPureDigital]);

    useEffect(() => {
        setIsDigitalPlanning(props.IsDigitalPlanning);
    }, [props.IsDigitalPlanning]);

    useEffect(() => {
        setDaypartData();
    }, [DayPartList]);

    useEffect(() => {
        setIsDayPartVisible(props.isDayPartVisible);
    }, [props.isDayPartVisible]);

    useEffect(() => {
        setDefault();
    }, [leagueId]);

    useEffect(()=>{
        if(RateType && RateType.length > 0){
            let list = RateType.filter(x=> x.label !== 'Spot');
            setRateTypeData(list);
        }
    },[RateType])

    const setDefault=()=>{
        setIsPureDigital(false);
        setTotalSchedules([]);
        setData([]);
        setEditData(null);
        setDayPart(null);
        setDayPartName(null);
        setPercentage(null);
        setEpisodes(0);
        setUnitsperWeek(0);
        setRate(0);
        setSelectedDemographics([]);
        setISCIsList([]);
        setIsciStartDate(null);
        setIsciEndDate(null);
        setTrackingUrl(null);
        setImpressions(null);
        setCustomerRate(0);
        setUnitSizes([]);
        setNetworkNames('');
        setAssetNames('');
        setRegionNames('');
        setCountryNames('');
        //setAssetIds('');
        setInventoryIds('');

        //setCampaignOrMediaPlan(null);
        setMediaPlanId(null);
        setCampaignOrAdvertiserId(null);
        setCampaignOrMediaPlanName(null);
        setTotalEpisodes(0);
        setTotalUnits(0);
        setTotalAvailUnits(0);
        setLastYearImp(0);
        setAvailImps(0);
        setPlannedUnitsPerEpisode(0);
        setTotalDollarAmount(0);
        setProposedPlanUnits(null);
        setChannelsList([{ label: 'All', value: 0 }]);
        setSelectedChannel(0);
        setSelectedChannelName('');

        setSelectedISCI(null);
        setSelectedISCIName(null);
        setUnitSizesData([]);
        setSelectedPlacement(null);
        setSelectedPlacementName(null);
        setSelectedRateType(null);
        setSelectedRateTypeName(null);
        setComments(null);
        setTotalImpressions([]);
        setTotalHPTOImpressions([]);
        setLastYearHPTOImp([]);
        setIsEditMode(false);
        setIsDigitalPlanning(false);
        setIsPureDigital(false);
    }

    useEffect(() => {
        handleClear();

        if (props.data && props.data.length > 0) {
            
            setData(props.data[0]);
            setIsEditMode(false);
            if (props.IsDigitalPlanning) {
                var inventoryIDs = [];
                var assetIds = [];
                var selectedAssets = [];
                let unitSizes = [];
                var selectedCountries = [];
                var selectedRegions = [];
                let networks = []
                props.data.map(function (inventory, k) {
                    inventoryIDs.push(inventory.inventoryId);
                    assetIds.push(inventory.assetId);
                    selectedAssets.push(inventory.assetName);
                    selectedRegions.push(inventory.regionName);
                    selectedCountries.push(inventory.countryName);
                    networks.push(inventory.partnerName);
                    if (inventory.unitSizes && inventory.unitSizes !== '')
                        unitSizes = unitSizes.concat(inventory.unitSizes.split(/[;,]/));
                    return null;
                });
                setIsDigitalPlanning(true);
                setInventoryIds(inventoryIDs.sort().join(','));
                //setAssetIds(assetIds.sort().join(','));
                setAssetNames([...new Set(selectedAssets)].join(','));
                setRegionNames([...new Set(selectedRegions)].join(','));
                setCountryNames([...new Set(selectedCountries)].join(','));
                setNetworkNames([...new Set(networks)].join(','));
                let unitSizesList = [...new Set(unitSizes)].map(size =>{
                    return {label : size, value : size };
                });
                setUnitSizesData(unitSizesList);
                //setUnitSizes(unitSizesList);
                getDigitalDefaultUnitSizes(inventoryIDs.sort().join(','));

                if(props.IsPureDigital)
                    setIsPureDigital(true);
            }
            else
                setInventoryIds(props.data[0].inventoryId);

            fieldsInfo = PlanFieldsConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaTypeParent: props.IsROS ? 'ROS' : props.data[0]?.mediaTypeParentName, MediaType: props.IsROS ? 'ROS' : props.data[0]?.mediaTypeName });
            let nonPrime = DayPartList.find(x => x.lookupText.toUpperCase() === 'NON-PRIME');

            if (!isEditMode && props.DropDownData && (props.DropDownData?.length === 1)) {
                setMediaPlanId(props.DropDownData[0].value);
                setCampaignOrMediaPlanName(props.DropDownData[0].label);
                setCampaignOrAdvertiserId(props.DropDownData[0].campaignOrAdvertiserId);
            }

            if (!props.IsDigitalPlanning) {
                let defaultRateType = RateType.find(x => x.label === 'Spot');
                let rate = props.data[0]?.rates.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType?.value)?.rate;
                setRate(rate ?? 0);
                setCustomerRate(rate ?? 0);
                setDayPart(nonPrime.lookupId);
                setDayPartName(nonPrime.lookupText);

                if (!isEditMode && props.DropDownData && props.DropDownData?.length === 1) {
                    getAvailableScheduleUnitsCount(nonPrime.lookupId, props.data[0], props.DropDownData[0].value);

                    let custRate = props.data[0].rates?.find(x => x.dayPartId === nonPrime.lookupId && x.customerId === props.DropDownData[0].campaignOrAdvertiserId)?.customerRate;
                    custRate = custRate ?? rate;
                    setCustomerRate(custRate);

                    if(props.IsROS)
                        getISCIList(props.DropDownData[0].campaignOrAdvertiserId, props.startDate, props.endDate);
                }

                if (fieldsInfo?.MediaTypeFields?.demography?.visible){
                    if (props.IsCampaignPlanning){
                        let p2Plus = DemographicList.find(x => x.lookupText.toUpperCase() === 'P2+');
                        setSelectedDemographics([p2Plus]);
                    }
                }

                getChannels(props.data[0].partnerId, null, null, props.data[0].mediaTypeParentName, props.data[0].mediaTypeName);
            }
            else{
                let list = RateType.filter(x => x.label !== 'Spot');
                if(props.data[0].unitTypeName === 'Display'){
                    list = RateType.filter(x => x.label !== 'Spot' && x.label !== 'CPV' && x.label !== 'Cost Per Post');
                }
                else if (props.data[0].unitTypeName === 'Pre-Roll' || props.data[0].unitTypeName === 'Video') {
                    list = RateType.filter(x => x.label !== 'Spot' && x.label !== 'Cost Per Post');
                }
                setRateTypeData(list);
                let defaultRateType = rateTypeData.find(x=> x.label === 'CPM');
                let rate = props.data[0].rates?.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType.value)?.rate;
                setRate(rate ?? 0);
                setCustomerRate(rate ?? 0);
                setSelectedRateType(defaultRateType.lookupId);
                setSelectedRateTypeName(defaultRateType.lookupText);

                let defaultPlacement = DigitalPlacement.find(x => x.label === 'ROS');
                setSelectedPlacement(defaultPlacement.value);
                setSelectedPlacementName(defaultPlacement.label);

                if (props.IsPureDigital && props.DropDownData && props.DropDownData?.length === 1)
                    getImpressionsSummary(inventoryIDs, props.data[0].unitTypeId, props.DropDownData[0].value, null, null, defaultPlacement.value);

                if (props.DropDownData && props.DropDownData?.length === 1){
                    let custRate = props.data[0].rates?.find(x => x.dayPartId === nonPrime.lookupId && x.customerId === props.DropDownData[0].campaignOrAdvertiserId)?.customerRate;
                    custRate = custRate ?? rate;
                    setCustomerRate(custRate ?? 0);
                }
            }

            setPercentage(0);
            setEpisodes(0);
            setUnitsperWeek(0);
            setTotalUnits(0);
        }
        else {
            setData([]);
            setInventoryIds(null);
        }

    }, [props.data, props.DropDownData]);

    useEffect(() => {
        if (props.editedMediaPlanInfo) {
            if ((props.editedMediaPlanInfo?.inventoryId === data.inventoryId) && (props.editedMediaPlanInfo?.mediaPlanId === data.mediaPlanId)){
                return;
            }
            handleClear();
            let editPlanData = props.editedMediaPlanInfo;
            editPlanData.partnerName = editPlanData.networkNames;
            setData(editPlanData);
            setMediaPlanId(editPlanData.mediaPlanId);
            setCampaignOrAdvertiserId(editPlanData.campaignOrAdvertiserId);

            setDayPart(editPlanData.dayPart);
            setDayPartName(editPlanData.dayPartName);
            setCampaignOrMediaPlanName(editPlanData.planName);
            setStartDate(editPlanData.startDate);
            setEndDate(editPlanData.endDate);
            setEpisodes(editPlanData.episodes);
            setRate(editPlanData.baseRate);
            setCustomerRate(editPlanData.rate);
            setIsEditMode(true);
            //setAssetIds(editPlanData.assetId.toString());
            
            if (editPlanData.mediaTypeParentName === 'Digital' && (editPlanData.mediaTypeName === 'Digital' || editPlanData.mediaTypeName === 'Social Media' || editPlanData.mediaTypeName === 'CRM')) {
                let objs = [];
                for (let i = 0; i < editPlanData.inventoryId.split(',').length; i++) {
                    let regionName = editPlanData.regionName.split(',')[i].trim();
                    let regionId = parseInt(editPlanData.regionId.split(',')[i].trim());
                    let inventoryId = parseInt(editPlanData.inventoryId.split(',')[i].trim());
                    let assetId = parseInt(editPlanData.assetId.split(',')[i].trim());
                    let assetName = editPlanData.assetName.split(',')[i].trim();
                    let countryName = editPlanData.countryName.split(',')[i].trim();
                    let networkName = editPlanData.networkNames.split(',')[i].trim();
                    objs.push({ ...editPlanData, inventoryId: inventoryId, assetId: assetId, assetName: assetName, regionId: regionId, regionName: regionName, countryName: countryName, networkName: networkName });
                }
                setEditData(objs);
            }

            if (editPlanData.mediaTypeName === 'Digital'){
                setIsPureDigital(true);
                setIsDigitalPlanning(true);
                let list = RateType.filter(x => x.label !== 'Spot');
                if (editPlanData.unitTypeName === 'Display') {
                    list = RateType.filter(x => x.label !== 'Spot' && x.label !== 'CPV' && x.label !== 'Cost Per Post');
                }
                else if (editPlanData.unitTypeName === 'Pre-Roll' || editPlanData.unitTypeName === 'Video') {
                    list = RateType.filter(x => x.label !== 'Spot' && x.label !== 'Cost Per Post');
                }
                setRateTypeData(list);
                setIsPercentOrImpsToUpdate(true);
                setImpressions(editPlanData.impressions);
                setInventoryIds(editPlanData.inventoryId);
                let defaultRateType = rateTypeData.find(x => x.label === editPlanData.rateTypeName);
                setSelectedRateType(defaultRateType.lookupId);
                setSelectedRateTypeName(defaultRateType.lookupText);

                let placementType = DigitalPlacement.find(x => x.label === editPlanData.placementName);
                setSelectedPlacement(placementType.lookupId);
                setSelectedPlacementName(placementType.lookupText);
            }
            else if (editPlanData.mediaTypeName === 'Social Media' || (editPlanData.mediaTypeParentName === 'Digital' && editPlanData.mediaTypeName === 'CRM')){
                setIsDigitalPlanning(true);
                setIsPureDigital(false);
                let list = RateType.filter(x => x.label !== 'Spot');
                setRateTypeData(list);
                setIsPercentOrImpsToUpdate(true);
                setImpressions(editPlanData.impressions);
                let defaultRateType = rateTypeData.find(x => x.label === editPlanData.rateTypeName);
                setSelectedRateType(defaultRateType.lookupId);
                setSelectedRateTypeName(defaultRateType.lookupText);

                let placementType = DigitalPlacement.find(x => x.label === editPlanData.placementName);
                setSelectedPlacement(placementType.lookupId);
                setSelectedPlacementName(placementType.lookupText);
                
                setInventoryIds(editPlanData.inventoryId.toString());
            }
            else{
                getChannels(editPlanData.partnerId, true, editPlanData.channelId, editPlanData.mediaTypeParentName, editPlanData.mediaTypeName);
                getRateDetails(editPlanData);
                setIsDigitalPlanning(false);
                setIsPureDigital(false);
            }

            fieldsInfo = PlanFieldsConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaTypeParent: props.IsROS ? 'ROS' : editPlanData.mediaTypeParentName, MediaType: props.IsROS ? 'ROS' : editPlanData.mediaTypeName });
        }
    }, [props.editedMediaPlanInfo]);

    useEffect(() => {
        if(isEditMode){
            if(IsPureDigital)
            {
                getImpressionsSummary();
                getDigitalInventoryUnitSizes(data.inventoryId);
            }
            else
                updateTotalAmount();
        }
    }, [isEditMode]);

    useEffect(() => {
        //if(!props.editedMediaPlanInfo){
            setStartDate(props.startDate);
            setEndDate(props.endDate);
        //}
    }, [props.startDate, props.endDate]);

    useEffect(() => {
        updateTotalAmount();
    }, [percentage, episodes, unitsPerWeek, customerRate, selectedRateType, selectedRateTypeName, impressions])

    const updateTotalAmount =()=>{
        if (!IsDigitalPlanning) {
            let totalForUnits = episodes * unitsPerWeek;
            let totalDollarAmount = totalForUnits * (!props.IsCampaignPlanning ? customerRate : rate)
            if (totalForUnits) {
                setTotalUnits(totalForUnits);
                setTotalDollarAmount(totalDollarAmount.toFixed(2));
            }
        }
        else if (IsDigitalPlanning && (isPercentOrImpsToUpdate || props.IsCampaignPlanning)) {
            setIsPercentOrImpsToUpdate(false);
            let totalImp = lastYearImp + lastYearHPTOImp;
            let total = 0;

            if (selectedRateType && (impressions || percentage)) {
                let imp = impressions ?? 0;
                if (totalImp > 0) {
                    if (impressions && parseFloat(percentage ?? 0) === 0)
                        setPercentage(((impressions / totalImp) * 100).toFixed(2));
                    if (percentage && parseFloat(impressions ?? 0) === 0) {
                        imp = Math.round(totalImp * (percentage / 100));
                        setImpressions(imp);
                    }
                }

                let rRate = props.IsCampaignPlanning ? rate : customerRate;
                if (rRate) {
                    if (selectedRateTypeName === 'CPM') {
                        total = (imp / 1000) * rRate;
                    }
                    else if (selectedRateTypeName === 'CPV' || selectedRateTypeName === 'Cost Per Post') {
                        total = imp * rRate;
                    }
                    else
                        total = parseFloat(rRate);

                    setTotalDollarAmount(total.toFixed(2));
                }
                else
                    setTotalDollarAmount(0.00);
            }
            else {
                setTotalDollarAmount(0);
            }
        }
    }

    const getDigitalInventoryUnitSizes = (inventoryId)=>{
        GetDigitalUnitSizesByInventory(inventoryId, props.IsCampaignPlanning).then(res => {
            if(res.length > 0){
                let unitSizesList = res.split(/[;,]/).map(size => {
                    return { label: size.trim(), value: size.trim() };
                })
                setUnitSizesData(unitSizesList);

                if(isEditMode){
                    let selUnitSizesList = data.unitSizeName.split(',').map(size => {
                        return { label: size.trim(), value: size.trim() };
                    })
                    setUnitSizes(selUnitSizesList);
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getDigitalDefaultUnitSizes = (inventoryId) => {
        GetDigitalDefaultUnitSizesByInventory(inventoryId, props.IsCampaignPlanning).then(res => {
            if (res.length > 0) {
                let unitSizesList = [...new Set(res.split(/[;,]/))].map(size => {
                    return { label: size.trim(), value: size.trim() };
                })
                setUnitSizes(unitSizesList);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getChannels = (partnerId, editMode, channelId, mediaTypeParentName, mediaType) => {
        let type = mediaTypeParentName === "Digital" && mediaType === "OTT" ? 'OTT' : mediaTypeParentName;

        GetChannels(partnerId, type.toString()).then(res => {
            setSelectedChannel(0);
            setSelectedChannelName('All');
            if (res.length > 0) {
                let chnList = [{ label: 'All', value: 0 }];
                res.forEach(chn => {
                    chnList.push({ label: chn.channelName, value: chn.id});
                })
                setChannelsList(chnList);

                /*if (editMode && channelId && channelId > 0) {
                    setSelectedChannel(channelId);
                    setSelectedChannelName(chnList.find(x => x.value === channelId).label);
                }*/

            }
        }).catch(err => {
            console.log(err);
        })
    }

    const setDaypartData = () => {
        if (props.IsCampaignPlanning && DayPartList) {
            let nonPrime = DayPartList.find(x => x.label.toUpperCase() === 'NON-PRIME');
            setDayPart(nonPrime.value);
            setDayPartName(nonPrime.label);
        }
    }

    const getImpressionsSummary = (Ids, unitTypeId, planId, sDate, eDate, placementId) => {
        sDate = sDate ?? startDate;
        eDate = eDate ?? endDate;
        let obj = {
            StartDate: sDate,
            EndDate: eDate,
            InventoryIds: Ids?.join() ?? inventoryIds,
            UnitTypeId: unitTypeId ?? data.unitTypeId,
            IsCampaignPlanning: props.IsCampaignPlanning,
            MediaPlanId: planId ?? mediaPlanId,
            PlacementId: placementId ?? selectedPlacement
        }

        if (obj.MediaPlanId) {
            props.setShowLoading(true);
            GetImpressionsSummary(obj).then(res => {
                let hptoImprsObjs = res.find(x => x.placementId === 1601);
                let objList = res.find(x => x.placementId !== 1601);

                let lastYearTotal = props.IsCampaignPlanning ? objList.instImpressions : objList.salesImpressions;
                let availsTotal = props.IsCampaignPlanning ? objList.instImpressions - objList.instUsedImpressions : objList.salesImpressions - objList.salesUsedImpressions;
                setLastYearImp(lastYearTotal);

                let lastYearHPTOTotal = props.IsCampaignPlanning ? hptoImprsObjs.instImpressions : hptoImprsObjs.salesImpressions;
                let availsHPTOTotal = props.IsCampaignPlanning ? hptoImprsObjs.instImpressions - hptoImprsObjs.instUsedImpressions
                                                                : hptoImprsObjs.salesImpressions - hptoImprsObjs.salesUsedImpressions;

                setLastYearHPTOImp(lastYearHPTOTotal);
                setAvailImps(availsTotal + availsHPTOTotal);
                props.setShowLoading(false);
                updateTotalAmount();
            }).catch(err => {
                console.log(err);
                props.setShowLoading(false);
            })
            getDaywiseImpressions(Ids, unitTypeId, planId, sDate, eDate, placementId);
        }
    }

    const getDaywiseImpressions = (Ids, unitTypeId, planId, sDate, eDate, placementId) => {
        sDate = sDate ?? startDate;
        eDate = eDate ?? endDate;
        let obj = {
            StartDate: sDate,
            EndDate: eDate,
            InventoryIds: Ids?.join() ?? inventoryIds,
            UnitTypeId: unitTypeId ?? data.unitTypeId,
            IsCampaignPlanning : props.IsCampaignPlanning,
            MediaPlanId: planId ?? mediaPlanId,
            PlacementId : placementId ?? selectedPlacement
        }

        if(obj.MediaPlanId){
            GetDaywiseImpressions(obj).then(res => {
                let hptoImprsObjs = res.impressionsInfo.filter(x=> x.placementId === 1601); 
                let objList = res.impressionsInfo.filter(x => x.placementId !== 1601);

                let sortedData = objList.sort((a, b) => (Helper.FormatDate(a.date) > Helper.FormatDate(b.date)) ? 1 : -1);

                setTotalImpressions(sortedData);
                let lastYearTotal = props.IsCampaignPlanning ? sortedData.map(item => item.instImpressions).reduce((prev, curr) => prev + curr, 0)
                    : sortedData.map(item => item.salesImpressions).reduce((prev, curr) => prev + curr, 0);

                let availsTotal = props.IsCampaignPlanning ? sortedData.map(item => item.instImpressions - item.instUsedImpressions).reduce((prev, curr) => prev + curr, 0)
                    : sortedData.map(item => item.salesImpressions - item.salesUsedImpressions).reduce((prev, curr) => prev + curr, 0);

                setLastYearImp(lastYearTotal);

                let sortedHPTOData = hptoImprsObjs.sort((a, b) => (Helper.FormatDate(a.date) > Helper.FormatDate(b.date)) ? 1 : -1);

                setTotalHPTOImpressions(sortedHPTOData);
                let lastYearHPTOTotal = props.IsCampaignPlanning ? sortedHPTOData.map(item => item.instImpressions).reduce((prev, curr) => prev + curr, 0)
                    : sortedHPTOData.map(item => item.salesImpressions).reduce((prev, curr) => prev + curr, 0);

                let availsHPTOTotal = props.IsCampaignPlanning ? sortedHPTOData.map(item => item.instImpressions - item.instUsedImpressions).reduce((prev, curr) => prev + curr, 0)
                    : sortedHPTOData.map(item => item.salesImpressions - item.salesUsedImpressions).reduce((prev, curr) => prev + curr, 0);

                setLastYearHPTOImp(lastYearHPTOTotal);
                setAvailImps(availsTotal + availsHPTOTotal);
            }).catch(err => {
                console.log(err);
                props.setShowLoading(false);
            })
        }
    }

    const getAvailableSchedulesList = (dayPartId, invData, planId) => {
        let sDate = startDate ?? invData?.startDate;
        let eDate = endDate ?? invData?.endDate;
        let inventoryId = invData ? invData.inventoryId : data.inventoryId;

        if (!sDate || !eDate || !inventoryId || !dayPartId) return;
        let obj = {
            StartDate: Helper.FormatDate(sDate),
            EndDate: Helper.FormatDate(eDate),
            DayPartId: dayPartId,
            LeagueId: invData ? invData.leagueId : data.leagueId,
            AssetId: invData ? invData.assetId : data.assetId,
            InventoryId: invData ? invData.inventoryId : data.inventoryId,
            UnitTypeId: invData ? invData.unitTypeId : data.unitTypeId,
            UnitSizeId: invData ? invData.unitSizeId : data.unitSizeId,
            UnitCostTypeId: props.IsCampaignPlanning ? 1 : 2,
            IsCampaignPlanning: props.IsCampaignPlanning,
            CampaignOrAdvertiserId: campaignOrAdvertiserId ?? 0,
            IsEditMode: isEditMode,
            MediaPlanId: mediaPlanId ?? planId
        }

        GetScheduleAndUnits(obj).then(res => {
            setOrgSchedules(res);
            setTotalSchedules(res);
            setSelectedChannel(0);
            setSelectedChannelName('All');
        }).catch(err => {
            console.log(err);
        })
    }

    const getAvailableScheduleUnitsCount = (dayPartId, invData, planId) => {
        let sDate = startDate ?? invData?.startDate;
        let eDate = endDate ?? invData?.endDate;
        let inventoryId = invData ? invData.inventoryId : data.inventoryId;

        if (!sDate || !eDate || !inventoryId || !dayPartId) return;

        let obj = {
            StartDate: Helper.FormatDate(sDate),
            EndDate: Helper.FormatDate(eDate),
            DayPartId: dayPartId,
            LeagueId: invData ? invData.leagueId : data.leagueId,
            AssetId: invData ? invData.assetId : data.assetId,
            InventoryId: invData ? invData.inventoryId : data.inventoryId,
            UnitTypeId: invData ? invData.unitTypeId : data.unitTypeId,
            UnitSizeId: invData ? invData.unitSizeId : data.unitSizeId,
            UnitCostTypeId: props.IsCampaignPlanning ? 1 : 2,
            IsCampaignPlanning: props.IsCampaignPlanning,
            CampaignOrAdvertiserId: campaignOrAdvertiserId ?? 0,
            IsEditMode : isEditMode,
            MediaPlanId: mediaPlanId ?? planId
        }

        if (obj.MediaPlanId){
            GetAvailableEpisodeAndUnits(obj).then(resData => {
                getAvailableSchedulesList(dayPartId, invData, planId);
                setTotalEpisodes(resData?.[0].availableCount);
                setTotalAvailUnits(resData?.[0].availableUnits);
                if (props.IsROS)
                    setPlannedUnitsPerEpisode(resData?.[0].plannedUnits);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const getRateDetails = (planData) => {        
        GetRatesByInventoryId(planData.inventoryId).then(resData => {
            planData.rates = resData;
            setData(planData);

            let rate = resData?.find(x => x.dayPartId === planData.dayPart)?.rate;
            let channelCustRate = null;

            if (planData.channelId){
                channelCustRate = resData?.find(x => x.dayPartId === planData.dayPart && x.customerId === planData.campaignOrAdvertiserId && x.channelId === planData.channelId)?.customerRate;

                if (!channelCustRate)
                    channelCustRate = resData?.find(x => x.dayPartId === planData.dayPart && x.channelId === planData.channelId)?.customerRate;
            }
            
            if (!channelCustRate)
                channelCustRate = resData?.find(x => x.dayPartId === planData.dayPart && x.customerId === planData.campaignOrAdvertiserId)?.customerRate;

            setRate(channelCustRate ?? rate ??0);
        }).catch(err => {
            console.log(err);
        })
    }

    const getISCIList = (val, sDate, eDate) => {
        if(((val === null) || (val === undefined)) || !props.IsCampaignPlanning){
            return;
        }
        let obj={
            CampaignIds : val.toString(),
            FlightStartDate : sDate,
            FlightEndDate : eDate
        }

        GetISCIsByCampaignId(obj).then(data => {
            if (data && data.length > 0) {
                let list = [];
                data.forEach(item => {
                    list.push({ label: item.isci, value: item.id });
                });
                setISCIsList(list);
            }
            else
                setISCIsList([]);
        }).catch(err => {
            console.log(err);
            setISCIsList([]);
        })
    }

    const handleStartDateChange = (val) => {
        if(val < props.startDate){
            setStartDate(null);
            notifyWarning('Selected Date range is outside the filter data range');
            return;
        }

        setStartDate(val);
    }

    useEffect(()=>{
        if (!IsDigitalPlanning) {
            let nonPrime = DayPartList.find(x => x.label.toUpperCase() === 'NON-PRIME');
            handleDayPart(null, nonPrime, null, true)
        }
        if (IsPureDigital && !isEditMode) {
            setImpressions(0);
            setPercentage(0);
            setTotalDollarAmount(0);
        }

        if (IsPureDigital) {
            getImpressionsSummary(null, null, null, Helper.FormatDate(startDate), Helper.FormatDate(endDate), selectedPlacement);
        }
        else if(props.IsROS && startDate && endDate)
            getISCIList(campaignOrAdvertiserId, startDate, endDate)

    }, [startDate,endDate])

    const handleChannelChange = (e, val) =>{
        setSelectedChannel(val.value);
        setSelectedChannelName(val.label);

        let schedules = val.value === 0 ? orgSchedules : orgSchedules.filter(x => x.networkId === val.value || x.status === 702);
        setTotalEpisodes(schedules.length);
        setTotalAvailUnits(schedules.map(y => y.availableUnits).reduce((prev, curr) => prev + curr, 0));
        setTotalSchedules(schedules);

        let rate = data.rates?.find(x => x.dayPartId === dayPart)?.rate;
        let channelCustRate = data.rates?.find(x => x.dayPartId === dayPart && x.customerId === campaignOrAdvertiserId && x.channelId === val.value)?.customerRate;
        
        if (!channelCustRate)
            channelCustRate = data.rates?.find(x => x.dayPartId === dayPart && x.channelId === val.value)?.customerRate;

        if(!channelCustRate)
            channelCustRate = data.rates?.find(x => x.dayPartId === dayPart && x.customerId === campaignOrAdvertiserId)?.customerRate;

        setRate(channelCustRate ?? rate);
        setCustomerRate(channelCustRate ?? rate);
    }

    const handleEndDateChange = (val) => {
        if (val > Helper.FormatToIsoDate(props.endDate)) {
            setEndDate(null);
            notifyWarning('Selected Date range is outside the filter data range');
            return;
        }

        setEndDate(val);
    }

    const handlePlacementChange = (e, val) => {
        setSelectedPlacement(val.value);
        setSelectedPlacementName(val.label);
    }

    const handleRateTypeChange = (e, val) => {
        setIsPercentOrImpsToUpdate(true);
        setSelectedRateType(val.value);
        setSelectedRateTypeName(val.label);
        let rate = data?.rates?.find(x=> x.rateTypeId === val.value)?.rate;
        let custRate = data?.rates?.find(x => x.rateTypeId === val.value)?.customerRate;
        setRate(rate ?? 0);
        setCustomerRate(custRate && custRate !== 0 ? custRate : rate ?? 0);
    }

    const handleISCIchange = (e, val) => {
        setSelectedISCI(val.value);
        setSelectedISCIName(val.label);
    }

    const handleCommentChange = (val)=>{
        setComments(val);
    }

    const handleTrackingLinkChange = (val)=>{
        setTrackingUrl(val);
    }

    const handleDayPart = (e, val, planId, isMediaPlanSelected = false) => {
        if (!props.IsCampaignPlanning && !isMediaPlanSelected && (!mediaPlanId || mediaPlanId === '' || mediaPlanId === 0)) {
            notifyWarning('Please select Media Plan');
            return;
        }
        setDayPart(val?.value);
        setDayPartName(val?.label);
        if(!isEditMode){
            let rate = data?.rates?.find(x => x.dayPartId === val?.value)?.rate;
            let customerRate = 0;
            if(!props.IsCampaignPlanning){
                customerRate = data?.rates?.find(x => x.dayPartId === val?.value && x.customerId === campaignOrAdvertiserId)?.customerRate;
                customerRate = customerRate ?? 0;
            }

            setRate(rate ?? 0);
            setCustomerRate(customerRate !== 0 ? customerRate : rate ?? 0);
        }
        getAvailableScheduleUnitsCount(val?.value, null, planId);
    }

    const handlePercentageChange = (e) => {
        if (IsPureDigital && mediaPlanId && lastYearImp === 0){
            notifyWarning('Please enter Target Impressions');
            return;
        }

        setPercentage(e.target.value);
        if(IsPureDigital){
            setImpressions(0);
            setIsPercentOrImpsToUpdate(true);
        }
        if (e.target.value > 100) {
            setPercentage(100);
            notifyWarning('The percentage value cannot be more than 100');
        }
        else if (props.IsROS) {
            if (e.target.value > 0 && episodes > 0) {
                let units = (plannedUnitsPerEpisode/totalEpisodes) * episodes;
                let count = (Math.round((units / 100) * e.target.value)/episodes);
                setUnitsperWeek(count);
            }
            else
                setUnitsperWeek(0);
        }

        if (e.target.value === 0 && unitsPerWeek === 0)
            setTotalUnits(0);
    }

    const handleEpisodesChange = (e) => {
        if (e.target.value > 0)
            setEpisodes(e.target.value);
        else
            setEpisodes(null);

        if (props.IsROS && e.target.value > 0 && percentage > 0) {
            let units = (plannedUnitsPerEpisode / totalEpisodes) * e.target.value;
            let count = (Math.round((units / 100) * percentage)/e.target.value);
            setUnitsperWeek(count);
        }
    }

    const handleUnitsPerWeekChange = (e) => {
        if (e.target.value > 0)
            setUnitsperWeek(e.target.value);
        else {
            setUnitsperWeek(0);
            setTotalUnits(0);
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
        if (e.target.value > 0){
            setImpressions(e.target.value);
            setPercentage(0);
            setIsPercentOrImpsToUpdate(true);
        }else{
            setImpressions(0);
        }
    }

    const handleCampaignOrMediaPlanChange = (e, val) => {
        setMediaPlanId(val.value);
        setCampaignOrAdvertiserId(val.campaignOrAdvertiserId);
        setCampaignOrMediaPlanName(val.label);
        let nonPrime = DayPartList.find(x => x.label.toUpperCase() === 'NON-PRIME');

        if(IsDigitalPlanning){
            let impCPM = rateTypeData.find(x => x.lookupText === 'CPM');
            setSelectedRateType(impCPM.value);
            setSelectedRateTypeName(impCPM.label);
            let defaultRateType = rateTypeData.find(x => x.label === 'CPM');
            let rate = data.rates?.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType.value)?.rate;
            let customerRate = 0;
            setRate(rate ?? 0);
            if (!props.IsCampaignPlanning) {
                customerRate = data?.rates?.find(x => x.dayPartId === nonPrime.lookupId && x.rateTypeId === defaultRateType.value 
                                                        && x.customerId === val.campaignOrAdvertiserId)?.customerRate;
                customerRate = customerRate ?? 0;
            }

            setCustomerRate(customerRate !== 0 ? customerRate : rate ?? 0);
            if(IsPureDigital)
                getImpressionsSummary(null, null, val.value, null, null, selectedPlacement);
        }
        else
        {
            handleDayPart(e, nonPrime, val.value, true);
            setProposedPlanUnits(null);
        }

        if (props.IsROS && startDate && endDate){
            getISCIList(val.campaignOrAdvertiserId, startDate, endDate);
        }
    }

    const handleClear = () => {
        if(isEditMode){
            props.clearEditMediaPlanData();
        }

        setStartDate(props.startDate);
        setEndDate(props.endDate);        
        setDefault();
    }

    const handleClose = () => {
        setShow(false);
        setShowImpressions(false);
    }

    const handleIsciDate = (val, eleName) => {
        if (eleName === 'Start') {
            setIsciStartDate(val);
        }
        if (eleName === 'End') {
            setIsciEndDate(val);
        }
    }

    const handleOpen = () => {
        if (dayPart && dayPart !== 0) {
            setShow(true);
        }
        else
            notifyWarning('Please select Day part');
    }

    const handleImpressionsDrawer = () => {
        setShowImpressions(true);      
    }

    const handleSaveSchedule = (schedules) => {
        handleClose();
        //let advId = props.IsCampaignPlanning ? campaignOrMediaPlan : props.DropDownData.find(x => x.value === campaignOrMediaPlan).campaignOrAdvertiserId;
        schedules.forEach(schedule => {
            schedule.MediaPlanId = mediaPlanId;
            schedule.AdvertiserId = campaignOrAdvertiserId;
            schedule.InventoryId = data.inventoryId;
            schedule.UnitTypeId = data.unitTypeId;
            schedule.UnitSizeId = data.unitSizeId;
            schedule.UnitCostTypeId = props.IsCampaignPlanning ? 1 : 2;
            schedule.MediaTypeId = data.mediaTypeParentId;
            schedule.ProposedISCI = selectedISCI;
            schedule.ProposedISCIStartDate = isciStartDate ? isciStartDate : null;
            schedule.ProposedISCIEndDate = isciEndDate ? isciEndDate : null;
            schedule.CustomerRate = props.IsCampaignPlanning ? rate : (customerRate ?? rate);
            schedule.Demographic = selectedDemographics.map(x => x.value).join();
            schedule.Impressions = impressions;
            schedule.TrackingUrl = trackingUrl;
            schedule.Placement = selectedPlacement;
            schedule.Comment = comments;
            schedule.IsEditMode = isEditMode;
            schedule.StatusId = props.IsCampaignPlanning ? SCHEDULE_ADUNIT_STATUS_IDS.Confirmed : SCHEDULE_ADUNIT_STATUS_IDS.WorkingInternal;
            schedule.ChannelId = selectedChannel;
        });
        setProposedPlanUnits(schedules);
        handleSaveData(schedules);
    }

    const handleSaveImpressions=(impData)=>{
        setIsPercentOrImpsToUpdate(false);
        setImpressions(impData.TargetImpressions);
        setPercentage(impData.PercentImpressions);

        let guid = Helper.GetRandomId(6);
        let rateI = props.IsCampaignPlanning ? rate : (customerRate ?? rate);
        let schedules = impData.ImpressionData.map(dayImp => {
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
        handleSaveMediaPlanUnits(schedules, impData.TargetImpressions);
    }

    const handleSaveData = (schedules) => {
        handleSaveMediaPlanUnits(schedules ?? proposedPlanUnits);
    }

    const calculateImpressions = (impdata) =>{
        if (lastYearImp === 0) return [];

        impdata = impdata.filter(x => new Date(Helper.FormatDate(x.date)) >= new Date(Helper.FormatDate(startDate))
                                                && new Date(Helper.FormatDate(x.date)) <= new Date(Helper.FormatDate(endDate)));

        let targetImp = impressions;

        let daySum = 0;
        let finalData = impdata.map((dayImp) =>{
            let lastImp = props.IsCampaignPlanning ? dayImp.instImpressions : dayImp.salesImpressions;
            let currImp = Math.floor((lastImp / lastYearImp) * targetImp);
            daySum += currImp;
            return { ...dayImp, calcImpressions : currImp};
        });

        if(targetImp - daySum > 0 && finalData.length > 0)
            finalData[finalData.length - 1].calcImpressions = finalData[finalData.length - 1].calcImpressions + (targetImp - daySum);

        let guid = Helper.GetRandomId(6);
        let rateI = props.IsCampaignPlanning ? rate : (customerRate ?? rate);

        let schedules = finalData.map(dayImp => {
            return {
                MediaPlanId: mediaPlanId,
                Date: Helper.FormatDate(dayImp.date),
                InventoryId: dayImp.inventoryId,
                Impressions: dayImp.calcImpressions,
                UnitTypeId: data.unitTypeId,
                UnitSizeId: data.unitSizeId,
                Percentage: percentage ?? 0,
                CustomerRate: rateI,
                Group: guid
            }
        });

        return schedules;
    }

    const validateISCIdates =()=>{

        if (new Date(Helper.FormatDate(startDate)) > new Date(Helper.FormatDate(isciStartDate))
                || new Date(Helper.FormatDate(endDate)) < new Date(Helper.FormatDate(isciStartDate))) {
            notifyWarning('ISCI Start date must be between Start Date and End Date');
            return false;
        }
        if (new Date(Helper.FormatDate(startDate)) > new Date(Helper.FormatDate(isciEndDate))
            || new Date(Helper.FormatDate(endDate)) < new Date(Helper.FormatDate(isciEndDate))) {
            notifyWarning('ISCI End date must be between Start Date and End Date');
            return false;
        }

        if (new Date(Helper.FormatDate(isciStartDate)) > new Date(Helper.FormatDate(isciEndDate))) {
            notifyWarning('ISCI End date must be equal or greater than ISCI Start Date');
            return false;
        }

        return true;
    }

    const callInventoryValidationAPI = (schedules)=>{

        let scheduleIds = schedules.map(x => x.ScheduleId).join();

        let finalObj = {
            ScheduleIds: scheduleIds,
            ScheduleUnitIds: null,
            NoOfUnits: unitsPerWeek,
            UnitTypeIds: data.unitTypeId.toString(),
            UnitSizeIds: data.unitSizeId.toString(),
            MediaPlanIds : mediaPlanId.toString(),
            IsEditMode : isEditMode
        }

        props.setShowLoading(true);
        props.setOpenBackdrop(true);
        ValidateSalesInventoryAndPlan(finalObj).then(data => {
            if (!data.status) {
                props.setShowLoading(false);
                props.setOpenBackdrop(false);
                setShowValidationDetails(true);
                setErrorDetails(JSON.parse(data.data));
            }
            else {
                let updSchedules = schedules.map((obj) =>{
                    return { ...obj, StatusId: SCHEDULE_ADUNIT_STATUS_IDS.PendingConfirm}
                })
                callSaveMediaPlanAPI(updSchedules);
            }
        }).catch(err => {
            console.log(err);
            props.setShowLoading(false);
            props.setOpenBackdrop(false);
        })
    }

    const callCampInventoryValidationAPI = (schedules) => {

        let scheduleIds = schedules.map(x => x.ScheduleId).join();

        let finalObj = {
            ScheduleIds: scheduleIds,
            ScheduleUnitIds: null,
            NoOfUnits: unitsPerWeek,
            UnitTypeIds: data.unitTypeId.toString(),
            UnitSizeIds: data.unitSizeId.toString(),
            MediaPlanIds: mediaPlanId.toString(),
            IsEditMode: isEditMode
        }

        props.setShowLoading(true);
        props.setOpenBackdrop(true);
        ValidateCampaignInventoryAndPlan(finalObj).then(data => {
            if (!data.status) {
                props.setShowLoading(false);
                props.setOpenBackdrop(false);
                setShowValidationDetails(true);
                setErrorDetails(JSON.parse(data.data));
            }
            else {
                callSaveMediaPlanAPI(schedules);
            }
        }).catch(err => {
            console.log(err);
            props.setShowLoading(false);
            props.setOpenBackdrop(false);
        })
    }

    const callSaveMediaPlanAPI = (schedules) =>{
        let mediaPlanData = {
            MediaPlanId: mediaPlanId,
            StartDate: startDate,
            EndDate: endDate,
            Rate: rate,
            Units: unitsPerWeek ?? 0,
            DayPart: dayPart,
            CustomerRate: customerRate,
            IsRateChanged: rate !== customerRate
        }

        let rateInfo = null;
        if (schedules && schedules.length > 0 && !props.IsCampaignPlanning && ((rate === 0 && customerRate > 0) || rate !== customerRate )) {
            rateInfo = {
                AdvertiserId: campaignOrAdvertiserId,
                InventoryId: data.inventoryId,
                RateCardMasterId: -1,
                CustomerRate: customerRate,
                Rate: rate,
                DayPartId: dayPart,
                AssetId: data.assetId,
                UnitTypeId: data.unitTypeId,
                UnitSizeId: data.unitSizeId,
                ChannelId : selectedChannel
            }
        }
        
        let unassignUnitInfo = null;
        if (isEditMode) {
            unassignUnitInfo = {
                MediaPlanId: mediaPlanId,
                StartDate: Helper.FormatDate(startDate),
                EndDate: Helper.FormatDate(endDate),
                InventoryIds: data.inventoryId.toString(),
                UnitTypeId: data.unitTypeId,
                UnitSizeId: data.unitSizeId,
                IsCampaignPlanning: props.IsCampaignPlanning,
                MediaTypeId: data.mediaTypeParentId,
                ChannelId : selectedChannel
            }
        }

        let finalObj = {
            IsCampaignPlanning: props.IsCampaignPlanning,
            MediaPlanData: mediaPlanData,
            RateInfo: rateInfo,
            UnassignUnitInfo: unassignUnitInfo,
            ProposedPlanUnits: schedules
        }

        props.setShowLoading(true);
        props.setOpenBackdrop(true);
        SaveCampaignMediaPlanAndUnits(finalObj).then(data => {
            props.refreshSummary();
            handleClear();
            notifySuccess('Data saved successfully.');
            props.setShowLoading(false);
            props.setOpenBackdrop(false);
        }).catch(err => {
            console.log(err);
            props.setShowLoading(false);
            props.setOpenBackdrop(false);
        })
    }

    const handleSaveMediaPlanUnits = (schedules, impr) => {

        let isValid = true;
        if (!isEditMode && (new Date(startDate) < new Date(props.startDate) || new Date(endDate) > new Date(props.endDate))) {
            notifyWarning('Selected Date range is outside the filter data range');
            isValid = false;
        }

        if (!mediaPlanId || mediaPlanId <= 0) {
            notifyWarning('Please select ' + (props.IsCampaignPlanning ? 'Campaign.' : 'Media Plan.'));
            isValid = false;
        }

        if(isEditMode && ( !endDate || endDate === '')){
            notifyWarning('Please enter End Date.');
            isValid = false;
        }

        if (isEditMode && (!startDate || startDate === '')) {
            notifyWarning('Please enter Start Date.');
            isValid = false;
        }

        if(!IsDigitalPlanning){
            if (!props.IsROS && unitsPerWeek <= 0 && !schedules && !isEditMode) {
                notifyWarning('Please enter Units.');
                isValid = false;
            }

            if (isDayPartVisible && dayPart <= 0) {
                notifyWarning('Please select DayPart.');
                isValid = false;
            }

            if (totalEpisodes === 0 && !isEditMode) {
                notifyWarning('Episodes not available.');
                isValid = false;
            }

            if (props.IsROS && percentage <= 0 && unitsPerWeek <= 0 && !isEditMode) {
                notifyWarning('Please enter either percentage or units per episode.');
                isValid = false;
            }
            else if (props.IsROS){
                isValid = validateISCIdates()
            }

            if (episodes <= 0 && !schedules && !isEditMode) {
                notifyWarning('Please enter Episodes.');
                isValid = false;
            }
            else if (episodes > 0 && totalEpisodes < episodes) {
                notifyWarning("Please enter Episodes lessthan or equal to available episodes (" + totalEpisodes + ").");
                isValid = false;
            }

            if (totalAvailUnits === 0) {
                notifyWarning('No Units available.');
                isValid = false;
            }
            else if (totalAvailUnits < totalUnits && !schedules) {
                notifyWarning('Total units (' + totalUnits.toString() + ') exceeds the Inventory total units (' + totalAvailUnits + ')');
                isValid = false;
            }
        }
        else{
            if (!isEditMode && (selectedPlacement === 0 || selectedPlacement === null)) {
                notifyWarning('Please select Placement.');
                isValid = false;
            }

            if (!isEditMode && (selectedRateType === 0 || selectedRateType === null)) {
                notifyWarning('Please select Rate Type');
                isValid = false;
            }

            /*if (!isEditMode && IsPureDigital && unitSizes.length === 0) {
                notifyWarning('Please select Unit Size');
                isValid = false;
            }*/

            if (!isEditMode && IsPureDigital && !schedules && (!impressions || impressions === 0) && percentage <= 0)
            {
                notifyWarning('Please enter either Impressions or Percentage.');
                isValid = false;
            }
            else if (!isEditMode && !IsPureDigital && (!impressions || impressions === 0)) {
                notifyWarning('Please enter Impressions.');
                isValid = false;
            }
        }

        if (isValid && !schedules && totalSchedules && (campaignOrAdvertiserId !== 0) && unitsPerWeek > 0 && !IsDigitalPlanning) {

            let schedulesForDates = totalSchedules.filter(x => new Date(Helper.FormatDate(x.estDate)) >= new Date(Helper.FormatDate(startDate))
                && new Date(Helper.FormatDate(x.estDate)) <= new Date(Helper.FormatDate(endDate)) && x.availableUnits >= parseInt(unitsPerWeek));

            if (schedulesForDates.length < parseInt(episodes)) {
                notifyWarning('Units are not available for each episode.');
                isValid = false;
                return;
            }

            schedules = [];
            for (var i = 0; i < episodes; i++) {
                var obj = {};
                obj.ScheduleId = schedulesForDates[i].id;
                obj.UnitsPerEpisode = unitsPerWeek;
                obj.MediaPlanId = mediaPlanId;
                obj.AdvertiserId = campaignOrAdvertiserId;
                obj.InventoryId = data.inventoryId;
                obj.UnitTypeId = data.unitTypeId;
                obj.UnitSizeId = data.unitSizeId;
                obj.UnitCostTypeId = props.IsCampaignPlanning ? 1 : 2;
                obj.MediaTypeId = data.mediaTypeParentId;
                obj.ProposedISCI = selectedISCI;
                obj.ProposedISCIStartDate = isciStartDate ? isciStartDate : null;
                obj.ProposedISCIEndDate = isciEndDate ? isciEndDate : null;
                obj.CustomerRate = props.IsCampaignPlanning ? rate : (customerRate ?? rate);
                obj.Demographic = selectedDemographics.map(x => x.value).join();
                obj.Impressions = impressions;
                obj.TrackingUrl = trackingUrl;
                obj.Placement = selectedPlacement;
                obj.Comment = comments;
                obj.IsEditMode = isEditMode;
                obj.StatusId = props.IsCampaignPlanning ? SCHEDULE_ADUNIT_STATUS_IDS.Confirmed : SCHEDULE_ADUNIT_STATUS_IDS.WorkingInternal;
                obj.ChannelId = selectedChannel;
                schedules.push(obj);
            }
        }

        if (isValid) {

            if(!IsDigitalPlanning){
                let planStatus = props.DropDownData.find(x => x.value === mediaPlanId).planStatus;
                if (!props.IsCampaignPlanning && planStatus === MEDIA_PALN_STATUS_NAMES.PendingConfirm &&  schedules &&schedules.length > 0){
                    callInventoryValidationAPI(schedules);
                }
                /*else if(props.IsCampaignPlanning && schedules && schedules.length > 0){
                    callCampInventoryValidationAPI(schedules);
                }*/
                else
                    callSaveMediaPlanAPI(schedules);
            }
            else{
                let targetImp = impr ?? impressions;
                var unitSizesDrp = unitSizes;
                var unitSizesCal = unitSizesDrp.map(x=> x.value);
                let planHeaderInfo ={
                    MediaPlanId: mediaPlanId,
                    UnitTypeId: data.unitTypeId,
                    UnitSizes : unitSizesCal.join(', '),
                    Placement : selectedPlacement,
                    TrackingUrl : trackingUrl,
                    RateType : selectedRateType,
                    InventoryIds: inventoryIds.split(',').sort().join(),
                    Rate: selectedRateType === 804 ? customerRate : null,
                    Comment : comments
                }

                if(IsPureDigital && (!schedules || schedules.length === 0)){
                    schedules = calculateImpressions(totalImpressions);
                }

                if (impressions > 0 && (!schedules || schedules.length === 0)){
                    schedules = [];
                    let noDays = Math.floor((new Date(Helper.FormatToIsoDate(endDate)) - new Date(Helper.FormatToIsoDate(startDate))) / (1000 * 3600 * 24)) + 1;
                    let dayImpressions = Math.floor(impressions / noDays);
                    let leftOverImp = impressions - (dayImpressions * noDays);
                    if(!props.IsPureDigital)
                    {
                        let invCount = inventoryIds.split(',').length;
                        dayImpressions = Math.floor(impressions / (noDays * invCount));
                        leftOverImp = Math.floor(impressions - (dayImpressions * noDays * invCount));
                    }

                    let guid = Helper.GetRandomId(6);                    
                    let rateI = props.IsCampaignPlanning ? rate : (customerRate ?? rate);
                    
                    inventoryIds.split(',').forEach(Id =>{
                        for (let i = 0; i < noDays; i++){
                            let newDate = moment(new Date(Helper.FormatDate(startDate))).add(i, 'd');
                            let obj = {
                                MediaPlanId: mediaPlanId,
                                Date: Helper.FormatDate(newDate),
                                InventoryId: Id,
                                Impressions: dayImpressions,
                                UnitTypeId : data.unitTypeId,
                                UnitSizeId : data.unitSizeId,
                                ImpressionSource : '1',
                                Percentage : percentage ?? 0,
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
                    editData??props.data.map(row =>{
                        let rateInfo = {
                            AdvertiserId: campaignOrAdvertiserId,
                            InventoryId: row.inventoryId,
                            RateCardMasterId: -1,
                            CustomerRate: customerRate,
                            Rate: rate,
                            DayPartId: 852,
                            AssetId: row.assetId,
                            UnitTypeId: data.unitTypeId,
                            UnitSizeId: data.unitSizeId,
                            RateTypeId : selectedRateType
                        }

                        assetRateInfo.push(rateInfo);
                    })
                }

                let unassignPlanImps = null;
                if (isEditMode) {
                    unassignPlanImps = {
                        MediaPlanId : mediaPlanId,
                        StartDate: Helper.FormatDate(startDate),
                        EndDate: Helper.FormatDate(endDate),
                        InventoryIds: inventoryIds,
                        UnitTypeId: data.unitTypeId,
                        UnitSizeId: data.unitSizeId,
                        IsCampaignPlanning: props.IsCampaignPlanning,
                        MediaTypeId: data.mediaTypeParentId,
                        PlacementId: selectedPlacement,
                    }
                }

                let finalObj ={
                    IsCampaignPlanning : props.IsCampaignPlanning,
                    HeaderInfo : planHeaderInfo,
                    RateInfo: assetRateInfo,
                    UnassignPlanImps: unassignPlanImps,
                    PlanDetails: targetImp > 0 && schedules ? schedules : []
                }
                // console.log(finalObj);
                //return;
                //Call API to Save
                props.setShowLoading(true);
                props.setOpenBackdrop(true);
                SaveDigitalMediaPlanData(finalObj).then(data => {
                    props.refreshSummary();
                    handleClear();
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                    notifySuccess('Data saved successfully.');
                }).catch(err => {
                    console.log(err);
                    props.setShowLoading(false);
                })
            }
        }else{
            props.setShowLoading(false);
        }
    }

    const handleChange=(name, value)=>{
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
            let index = unitSizesNew.findIndex(x => x.label === value);
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
            <Grid className={``} key={`ConfigGridReadOnly`} item xs={12} pb={1}>
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
                                {IsDigitalPlanning && <Grid item xs={1.5}>
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
                                </Grid>}
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
            <Grid className={``} key={`ConfigGrid1`} item xs={12} pb={1}>
                <Box px={1}>
                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={!props.IsROS ? 4.50 : 4}>
                                    <Box component="div" pl={1}>
                                        <PickDateRange startDate={startDate} endDate={endDate} disablePast={false}
                                            setStartDate={handleStartDateChange} setEndDate={handleEndDateChange} />
                                    </Box>
                                </Grid>
                                {fieldsInfo.MediaTypeFields?.estimatedImpressions?.visible && <Grid item xs={2}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Estimated Impressions</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {'0'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>}
                                {fieldsInfo.MediaTypeFields.showEpisodesAndUnits && <>
                                    {isDayPartVisible && <Grid item xs={2}>
                                    <Box pl={1}>
                                        <Dropdown size="small" id="daypart" variant="outlined" showLabel={true} lbldropdown="Day Part"
                                            value={dayPartName} handleChange={handleDayPart} ddData={DayPartList ?? []} />
                                    </Box>
                                </Grid>}
                                {!props.IsROS && <Grid item xs={2.5}>
                                    <Box pl={1}>
                                        <Dropdown size="small" id="channels" variant="outlined" showLabel={true} lbldropdown="Channels" disabled={channelsList.length < 3}
                                            value={selectedChannelName} handleChange={handleChannelChange} ddData={channelsList ?? []} />
                                    </Box>
                                </Grid>}
                                <Grid item xs={!props.IsROS ? 2.25 : 2}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Total #Episodes | #Units</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {totalEpisodes ?? '0'} | {totalAvailUnits ?? '0'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                    {!props.IsROS && <Grid item xs={0.5}>
                                        <Box pl={1} display="flex" flexDirection='row' justifyContent="space-between">
                                            <IconButton onClick={handleOpen} disabled={data.length === 0 || (!totalSchedules && totalSchedules.length === 0)} title={`Schedules List`} size="small">
                                                <ViewListOutlinedIcon fontSize='large' color={data.length === 0 || totalSchedules.length === 0 ? 'default' : 'primary'} />
                                            </IconButton>
                                        </Box>
                                    </Grid>}
                                </>}
                                {fieldsInfo.MediaTypeFields.placement?.visible && <Grid item xs={IsPureDigital ? 1.75 : 2.5}>
                                    <Box pl={1}>
                                        <Dropdown size="small" id="placement" variant="outlined" showLabel={true} lbldropdown="Placement"
                                            value={selectedPlacementName} handleChange={handlePlacementChange} ddData={DigitalPlacement ?? []} />
                                    </Box>
                                </Grid>}
                                {fieldsInfo.MediaTypeFields.rateType?.visible && <Grid item xs={IsPureDigital ? 1.75 : 2.25}>
                                    <Box pl={1}>
                                        <Dropdown size="small" id="rateType" variant="outlined" showLabel={true} lbldropdown="Rate Type"
                                            value={selectedRateTypeName} handleChange={handleRateTypeChange} ddData={rateTypeData ?? []} />
                                    </Box>
                                </Grid>}
                                {props.IsROS && <><Grid item xs={1.75}>
                                    <Box pl={1} pt={1}>
                                        <Dropdown id="proposedISCI" variant="outlined" showLabel={true} lbldropdown="Proposed ISCI"
                                            value={selectedISCIName} handleChange={handleISCIchange} size="small"
                                            ddData={isciSList ? isciSList : []} />
                                    </Box>
                                </Grid>
                                    <Grid item xs={1.75}>
                                        <Box pl={1} pt={1}>
                                            <PickDate showLabel label="ISCI Start Date" value={isciStartDate} size="small"
                                                setDate={(val) => handleIsciDate(val, 'Start')} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1.75}>
                                        <Box pl={1} pt={1}>
                                            <PickDate showLabel label="ISCI End Date" value={isciEndDate} size="small"
                                                setDate={(val) => handleIsciDate(val, 'End')} />
                                        </Box>
                                    </Grid></>}
                            </Grid>
                        </Grid>
                    </Grid >
                </Box >
            </Grid >
            <Grid className={``} key={`ConfigGrid2`} item xs={12} pb={1}>
                <Box px={1}>
                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            <Grid container>
                                {fieldsInfo.MediaTypeFields.showEpisodesAndUnits && <>
                                    <Grid item xs={props.IsCampaignPlanning ? 1.5 : 1.25}>
                                        <Box component="div" pl={1}>
                                            <TextField id="episodes" size="small" variant="outlined"
                                                type="number" label="#Episodes" fullWidth
                                                InputProps={{
                                                    inputProps: {
                                                        max: 10000, min: 0
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={episodes} onChange={handleEpisodesChange} />
                                        </Box>
                                    </Grid>
                                    {props.IsROS && <>
                                        <Grid item xs={0.75}>
                                            <Box pl={1}>
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
                                        <Grid item xs={.25}>
                                            <Box component="div" pl={1} display="flex" flex="1" alignItems="center">
                                                <Typography variant="caption">Or</Typography>
                                            </Box>
                                        </Grid>
                                    </>}
                                    <Grid item xs={!props.IsROS ? 1.75 : 1.5}>
                                        <Box component="div" pl={1}>
                                            <TextField id="unitsPerWeek" size="small" variant="outlined"
                                                type="number" label="Units Per Episode" fullWidth
                                                disabled={percentage > 0}
                                                InputProps={{
                                                    inputProps: {
                                                        max: 10000, min: 0
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={unitsPerWeek} onChange={handleUnitsPerWeekChange} />
                                        </Box>
                                    </Grid>
                                </>}
                                {IsPureDigital && <>
                                    <Grid item xs={2} pl={1}>
                                        <Box component="div" display="flex" alignItems="center" pl={1} borderRadius={1} style={{ backgroundColor: '#dfe3ec' }}>
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">HPTO</Typography>
                                                <Typography variant="subtitle2">
                                                    {Helper.ConvertToUSNumberFormat(lastYearHPTOImp)}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column">
                                                <Box mr={.5} ml={.5}>|</Box>
                                                <Box mr={.5} ml={.5}>|</Box>
                                            </Box>
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">Last Year Actual</Typography>
                                                <Typography variant="subtitle2">
                                                    {Helper.ConvertToUSNumberFormat(lastYearImp)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Box pl={1}>
                                            <Box component="div">
                                                <Typography variant="caption">{'Available Impressions'}</Typography>
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
                                                    inputProps: { min: 0}
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
                                            <IconButton disabled={lastYearImp === 0} onClick={handleImpressionsDrawer} title={`Daywise Impressions`} size="small">
                                                <ViewListOutlinedIcon fontSize='small' color={data.length === 0 || lastYearImp === 0 ? 'default' : 'primary'} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </>}
                                {fieldsInfo.MediaTypeFields.showEpisodesAndUnits && <Grid item xs={1}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Total Units</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {totalUnits}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>}
                                <Grid item xs={IsDigitalPlanning ? 1.25 : 1}>
                                    <Box pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">{fieldsInfo.MediaTypeFields.RateLabel  + (selectedRateTypeName ? ' ('+ selectedRateTypeName+')':'')}</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {Helper.ConvertToDollarFormatWithoutSymbol(rate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                {fieldsInfo.MediaTypeFields.customerRate.visible && <Grid item xs={1.75}>
                                    <Box component="div" pl={1} pt={1}>
                                        <TextField id="customerRate" size="small" variant="outlined"
                                            type="number" label={fieldsInfo.MediaTypeFields.CustomRateLabel + (selectedRateTypeName ? ' ('+ selectedRateTypeName+')':'')} fullWidth
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
                                {fieldsInfo.MediaTypeFields.impressions.visible && <>
                                    {!fieldsInfo.MediaTypeFields.impressions.editable && <Grid item xs={1.25}>
                                        <Box display="flex" flexDirection="column" pl={1}>
                                            <Box component="div">
                                                <Typography variant="caption">Impressions</Typography>
                                            </Box>
                                            <Box component="div">
                                                <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                    {data.impressions ? Helper.ConvertToUSNumberFormat(data.impressions) : 0}
                                                </Typography>
                                            </Box>
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
                                </>}
                                <Grid item xs={1.25}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Total $ Amount</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {Helper.ConvertToDollarFormatWithoutSymbol(totalDollarAmount)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>                                
                                {fieldsInfo.MediaTypeFields.demography.visible && <><Grid item xs={1.75}>
                                    <Box component="div" pl={1} pt={1}>
                                        <MultiSelectDropdown name="demography" size="small" SMwidth="400" fullWidth lbldropdown="Demography"
                                            ddData={DemographicList.length ? DemographicList : []}
                                            handleChange={handleChange}
                                        />
                                    </Box>
                                </Grid>
                                    <Grid item xs={2.25} pt={1}>
                                        {selectedDemographics && selectedDemographics.length > 0 &&
                                            <ChipsList name="demographics" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedDemographics} />
                                        }
                                    </Grid></>}
                                {fieldsInfo.MediaTypeFields?.comment?.visible && <Grid item xs={4}>
                                    <Box component="div" pl={1} pt={1}>
                                        <TextboxField fullWidth lblName="Comment" size="small" textboxData={comments} handleChange={handleCommentChange} />
                                    </Box>
                                </Grid>}
                                {fieldsInfo.MediaTypeFields?.trackingLink?.visible && <Grid item xs={4}>
                                    {/* <Box component="div" pl={1} pt={1}>
                                        <TextField id="trackingUrl" size="small" variant="outlined"
                                            type="text" label={"Tracking Link"} fullWidth
                                            value={trackingUrl} onChange={handleTrackingLinkChange} />
                                    </Box> */}
                                    <Box component="div" pl={1} pt={1}>
                                        <TextboxField fullWidth lblName="Tracking Link" size="small" textboxData={trackingUrl} handleChange={handleTrackingLinkChange} />
                                    </Box>
                                </Grid>}
                                {/* {props.data[0]?.mediaTypeParentName} */}
                                {/* {props.data[0]?.mediaTypeName} */}                                
                            </Grid>
                        </Grid>
                    </Grid >
                </Box >
            </Grid >
            <Grid className={``} key={`ConfigGrid3`} item xs={12} pb={1}>
                <Box px={1}>
                    <Grid container alignItems="center">
                        <Grid item xs={10} display="flex">
                            {fieldsInfo.MediaTypeFields.unitSizes.visible && fieldsInfo.MediaTypeFields.unitSizes.editable && <>
                                <Grid item xs={1.5}>
                                    <Box pl={1}>
                                        <MultiSelectDropdown name="unitsize" size="small" SMwidth="400" fullWidth lbldropdown="Unit Size"
                                            ddData={unitSizesData.length ? unitSizesData : []}
                                            handleChange={handleChange}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={10.5}>
                                    {unitSizes && unitSizes.length > 0 &&
                                        <ChipsList name="unitsize" key="DigiUnitSizeChip" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={unitSizes} />
                                    }
                                </Grid>
                            </>}
                        </Grid>

                        <Grid className={``} key={`PlanningConfigBtns`} item xs={2} pb={1}>
                            <Box px={1} display="flex" alignItems="center" justifyContent="flex-end">
                                <Button onClick={handleClear} color="secondary">{'Reset'}</Button>
                                <Button onClick={() => handleSaveData()} color="primary" variant="contained">{'Save'}</Button>
                            </Box>
                        </Grid >
                    </Grid>
                </Box>
            </Grid>
            <DrawerComponent open={show || showImpression} handleDrawerClose={handleClose} handleDrawerOpen={handleOpen} anchor={'right'} className={classes.scheduleDrawer}>
                {show && <ScheduleList notifyWarning={notifyWarning} handleClose={handleClose} handleSaveSchedule={handleSaveSchedule}
                    schedules={totalSchedules} startDate={startDate} endDate={endDate} />}
                {showImpression && <TargetImpressionsList impressionLabel = {fieldsInfo.MediaTypeFields.ImpressionsLabel} notifyWarning={notifyWarning} handleClose={handleClose} handleSaveImpressions={handleSaveImpressions}
                    IsCampaignPlanning ={props.IsCampaignPlanning} PercentImpressions={percentage} TargetImpressions={impressions} IsPureDigital={props.IsPureDigital}
                    ImpressionsData={totalImpressions} HPTOImpressionsData={totalHPTOImpressions} startDate={startDate} endDate={endDate} />}
            </DrawerComponent>
            <DrawerComponent
                open={showValidationDetails}
                handleDrawerClose={() => setShowValidationDetails(false)}
                handleDrawerOpen={() => setShowValidationDetails(true)}
                anchor={"right"}
                className={classes.validationDrawer}
            >
                <ErrorDetails errorDetails={errorDetails} handleClose={() => setShowValidationDetails(false)} key="ValPlanConfirm" />
            </DrawerComponent>
        </React.Fragment >
    )
}
export default PlanningConfig;