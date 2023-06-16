//Global Imports Start
import React, { useState, useEffect, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as AppLanguage from '../../common/AppLanguage';
//Global Imports End

//Regional Imports Start
import InventoryGrid from './InventoryGrid';
import DmsInventoryReport from './Reports/DmsInventoryReport';
import Helper from "../../common/Helper";
import MonthlySplit from './MonthlySplit/MonthlySplit'
import InventoryScreen from '../Inventory/addEditInventory/InventoryScreen'
import * as AppConstants from '../../common/AppConstants';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import AppDataContext from '../../common/AppContext';
import SplitUnit from "./SplitUnit/SplitUnit";
import { ToastContainer, toast } from "react-toastify";
import LinearSchedule from './LinearInventorySchedule/LinearBuildSchedule';
import DigitalAdditionalInventoryInfo from './DigitalAdditionalInventoryInfo/DigitalAdditionalInventoryInfo';
import { GetCostTypes, GetUnitTypes, GetNetworkByRegion, GetUserPreference } from './../../services/common.service';
import { GetInventoryUnit, GetInventory, GetFrequencies, GetDays, GetInventorySchedule, GetDigitalInventoryAdditionalInfo, GetDigitalAssetAdUnitMapping } from './../../services/inventory.service'
import FiltersScreen from "../../sharedComponents/Filter/FiltersScreen";
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";
import InventoryDeal from "./InventoryDeal";
//Regional Imports End

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
const InventoryContainer = (props) => {
    const classes = useStyles();
    const { leagueId, FilterPreference } = useContext(AppDataContext);
    const [InventoryOriginalRows, setInventoryOriginalRows] = useState([]);

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [ScheduleOriginalRows, setScheduleOriginalRows] = React.useState([]);
    const [ScheduleRows, setScheduleRows] = React.useState([]);

    const [childScreen, setChildScreen] = useState("");
    const [InventoryId, setInventoryId] = useState();
    const [ProgramName, setProgramName] = useState();
    const [quantityTo, setQuantityTo] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [expandInventoryGrid, setExpandInventoryGrid] = useState(true);
    const [expandedBuildSchedule, setExpendBuildSchedule] = React.useState(false);
    const [expandDigitalInventoryInfo, setExpandDigitalInventoryInfo] = useState(false);
    const [expandSplitUnit, setExpandSplitUnit] = useState(false);
    const [expandInventoryReport, setExpandInventoryReport] = useState(false);
    const [dealData, setDealData] = useState({});
    const [costTypeData, setCostTypeData] = useState([]);
    const [unitTypeData, setUnitTypeData] = useState([]);
    const [rowClick, setRowClick] = useState(false);
    const [splitUnitData, setSplitUnitData] = useState([]);
    const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [onlyViewSplit, setOnlyViewSplit] = useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [editSchedule, setEditSchedule] = React.useState(false);
    const [InventoryRows, setInventoryRows] = useState([]);
    const [InventoryRow, setInventoryRow] = useState([]);
    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        inventoryGrid: true,
        InventoryDeal: false,
        spliUnit: false,
        generateSchedule: false,
        monthlySplit: false,
        digitalInventoryInfo: false,
        inventoryScreen: false,
        inventoryReport: false,
    });
    const [showScheduleLoading, setShowScheduleLoading] = useState(false);
    const [DealInventoryEdit, setDealInventoryEdit] = useState(false);
    const [expandMonthlySplit, setExpandMonthlySplit] = useState(false);
    const [expandInventoryDeal, setExpandInventoryDeal] = useState(false);
    const [Frequency_Data, setFrequencyData] = useState([]);
    const [DaysList_Data, setDaysListData] = useState([]);
    const [Network_Data, setNetworkData] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState([]);
    const [isOpenCS, setIsOpenCS] = useState(false);
    const [inventoryPreferences, setInventoryPreferences] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState(null);
    const [seasonStartDate, setSeasonStartDate] = useState();
    const [seasonEndDate, setSeasonEndDate] = useState();
    const [inventoryTypeId, setInventoryTypeId] = useState(0);
    const [clearFilterStatus, setClearFilterStatus] = useState(false);
    const [selectedBtn, setSelectedBtn] = useState();
    const [inventoryDealData, setInventoryDealData] = useState();
    const [inventoryData, setInventoryData] = useState(false);
    const [selectedDealId, setSelectedDealId] = useState();
    const [digiAddInvInfoData, setDigiAddInvInfoData] = useState();
    const [digitalAssetAdUnitMappingData, setDigitalAssetAdUnitMapping] = useState();
    const [AssetId, setAssetId] = useState();
    const [dealSourceId, setDealSourceId] = useState();
    const [applyLocalFilter, setApplyLocalFilter] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [MediaTypeId, setMediaTypeId] = useState();
    const [searchItem, setSearchItem] = useState();
    const [selectedFilterId, setSelectedFilterId] = useState(0)
    const [countDealInventoryItems, setCountDealInventoryItems] = useState();
    const [enableDealEdit, setEnableDealEdit] = useState(false);
    const [isEditSearch, setIsEditSearch] = useState(false);
    const getEmptyFilterCriteria = () => {

        return {
            name: '',
            LeagueId: leagueId,
            TypeId: inventoryTypeId,
            User: '',
            Network: '',
            MediaType: '',
            MarketType: 0,
            Season: 0,
            Venturize: 0,
            Region: 0,
            AssetType: '',
            Episode: '',
            Country: 0,
        }
    }

    const handleClose = () => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            InventoryDeal: false,
            spliUnit: false,
            inventoryReport: false,
            monthlySplit: false,
            generateSchedule: false
        });
        setExpandInventoryGrid(true);
        setExpandInventoryReport(false);
        setEditSchedule(false);
        setDealInventoryEdit(false);
        setIsEditing(false);
        //setInventoryId();
        setProgramName();
        setSeasonStartDate();
        setSeasonEndDate();
        setSelectedDealId();
        setExpendBuildSchedule(false);
        setExpandSplitUnit(false);
        setAssetId();
    }

    const successClose = () => {

        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: true
        });
        setExpandInventoryReport(false);
        setEditSchedule(true);
        refreshPage();
        setIsEditing(true);
        setInventoryId(InventoryId);
        setExpendBuildSchedule(true);
        setExpandSplitUnit(false);
        getSchedules(InventoryId);
    }

    const convertToSearchCriteria = (criteria) => {
        let region = Array.isArray(criteria.Region) ? criteria.Region : (criteria.Region ? [criteria.Region] : '');
        let country = Array.isArray(criteria.Country) ? criteria.Country : (criteria.Country ? [criteria.Country] : '');
        var venturize = criteria.Venturize && criteria?.Venturize.length == 1 ? [...new Set(criteria.Venturize.map(x => x.value))].join(): '-1';

        let obj = getEmptyFilterCriteria();
        obj.TypeId = criteria.TypeId;
        obj.Region = region ? [...new Set(region.map(x => x.value))].join() : '';
        obj.Country = country ? [...new Set(country.map(x => x.value))].join() : '';
        obj.Venturize = venturize ;
        obj.MarketType = criteria.MarketType?.value;
        obj.MediaType = criteria.MediaType ? [...new Set(criteria.MediaType.map(x => x.value))].join() : '';
        obj.Season = criteria.Season?.value;
        obj.Network = criteria.Network ? [...new Set(criteria.Network.map(x => x.value))].join() : '';
        obj.AssetType = criteria.AssetType ? [...new Set(criteria.AssetType.map(x => x.value))].join() : '';
        obj.Episode = criteria.Episode ? [...new Set(criteria.Episode.map(x => x.value))].join() : '';
        return obj;
    }

    const getInventory = (criteria) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        GetInventory(convertToSearchCriteria(criteria)).then(data => {
            if (data) {
                setInventoryOriginalRows(data);
                if(searchItem){
                    setApplyLocalFilter(true);
                } else {
                    setApplyLocalFilter(false);
                }
                setInventoryRows(data);
                setOpenBackdrop(false);
                setShowLoading(false);
            }
            else {
                console.log("GetInventory API is failing");
            }

        })
    }

    const getUserPreference = (typeId, prefId) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        if(!prefId && selectedFilterId && isEditSearch){
            prefId = selectedFilterId;
        }
        GetUserPreference(typeId, leagueId).then((data) => {
            //
            let defaultPref = null;
            if (prefId) {
                defaultPref = data && data.find(x => x.id === prefId);
            } else {
                defaultPref = data && data.length > 0 ? data[0] : null;
                setSelectedFilterId(defaultPref?.id)
            }

            let prefJson = defaultPref ? JSON.parse(defaultPref.prefererJson) : getEmptyFilterCriteria();
            let clearFilterStatus = defaultPref ? true : false;
            setClearFilterStatus(clearFilterStatus);
            prefJson.LeagueId = leagueId;
            prefJson.TypeId = typeId;
            prefJson.Id = defaultPref ? defaultPref.id : 0;
            prefJson.name = defaultPref?.name || '';
            prefJson.description = defaultPref?.description || '';
            setFilterCriteria(prefJson);
            setInventoryPreferences(data);
            getInventory(prefJson);
            setShowSavedSearchPopup(false);
            // setShowLoading(false);
            // setOpenBackdrop(false);
        }).catch(err => {
            console.log(err);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    useEffect(() => {
        if (FilterPreference && FilterPreference.length > 0) {
            let inventoryTypeId = FilterPreference.find(x => x.lookupText === "Inventory").lookupId;
            //getInventory(leagueId);
            getUserPreference(inventoryTypeId, null);
            setInventoryTypeId(inventoryTypeId);
        }

        if (editSchedule !== true) {
            setScheduleOriginalRows([]);
            setScheduleRows([]);
            setExpandInventoryGrid(true);
            setExpandMonthlySplit(false);
            setExpandSplitUnit(false);
            setExpendBuildSchedule(false);
            setExpandInventoryDeal(false);
            setExpandInventoryReport(false);
            setIsEditing(false);
            setDealInventoryEdit(false);
            setobjAccordionVisiblity({
                inventoryGrid: true,
                inventoryReport: false,
                InventoryDeal: false,
                spliUnit: false,
                generateSchedule: false,
                monthlySplit: false,
            })
        } else {
            setEditSchedule(false);
        }

    }, [leagueId, FilterPreference])

    useEffect(() => {
        if(expandSplitUnit) {
            setEditSchedule(false);
        }
    }, [])

    const getInventoryUnit = (id) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        GetInventoryUnit(id).then((data) => {
            // console.log(data);
            setSplitUnitData(data);
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            console.log(err);
        })
    }

    const buttonClicked = () => {
        setShowSavedSearchPopup(true);
    }

    const SavedSearchPopupClose = () => {
        setShowSavedSearchPopup(false);
    }

    const handleFilterClick = () => {
        let tempFilters = {
            name: '',
            LeagueId: leagueId,
            TypeId: inventoryTypeId,
            User: '',
            Network: '',
            MediaType: '',
            MarketType: 0,
            Season: 0,
            Venturize: 0,
            Region: 0,
            AssetType: '',
            Episode: '',
            Country: 0,
            Id: 0,
        };
        setFilterCriteria(tempFilters);
        setShowFilterPopup(true);
        setIsEditSearch(false);
    }

    const handleFilterCloseClick = () => {
        setShowFilterPopup(false);
        if(selectedFilterId) {
            getUserPreference(inventoryTypeId, selectedFilterId);
        } else {
            const clearedFilter = getEmptyFilterCriteria()
            setFilterCriteria(clearedFilter)
            getInventory(clearedFilter);
            setClearFilterStatus(false);
            setSelectedFilterId(0)
        }
    }

    const handleClearFilterClick = () => {
        getInventory(getEmptyFilterCriteria());
        setIsEditSearch(false);
        setClearFilterStatus(false);
        setShowFilterPopup(false);
        setSelectedFilterId(0)
        setFilterCriteria(getEmptyFilterCriteria());
    }

    const handleBackdropClose = () => setOpenBackdrop(false);

    const handleGenerateScheduleClick = (index, InventoryId, quantityTo, programName, inventoryData, startDate, endDate,assetId) => {
        if (isEditing) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        setDealInventoryEdit(true);
        setExpandInventoryDeal(false);
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: true,
            inventoryScreen: false
        });
        setExpandInventoryReport(false);
        setSelectedDealId(inventoryData.inventoryDealId);
        setExpendBuildSchedule(true);
        setExpandSplitUnit(false);
        setIsEditing(true);
        setProgramName(programName);
        setQuantityTo(quantityTo)
        setInventoryId(InventoryId);
        setRowClick(false);
        getSchedules(InventoryId);
        setInventoryData(inventoryData);
        setSeasonStartDate(Helper.FormatDate(startDate));
        setSeasonEndDate(Helper.FormatDate(endDate));
        setAssetId(assetId);
    }

    const handleDigitalAdditionalInfoClick = (programName, btnName, InventoryId, assetId) => {
        if (isEditing) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        console.log(assetId);
        setExpandInventoryDeal(false);
        setExpendBuildSchedule(false);
        setExpandSplitUnit(false);
        setIsEditing(true);
        setProgramName(programName);
        setInventoryId(InventoryId);
        setAssetId(assetId)
        setShowLoading(true);
        setOpenBackdrop(true);
        getDigitalAssetAdUnitMapping(assetId);
        getDigitalInventoryAdditionalInfo(InventoryId);
        setExpandDigitalInventoryInfo(true)
        setSelectedBtn(btnName);
    }

    const getDigitalInventoryAdditionalInfo = (inventoryId) => {
        GetDigitalInventoryAdditionalInfo(inventoryId).then((data) => {
            setDigiAddInvInfoData(data);
            setShowLoading(false);
            setOpenBackdrop(false);
            setobjAccordionVisiblity({
                inventoryGrid: true,
                inventoryReport: false,
                InventoryDeal: false,
                spliUnit: false,
                monthlySplit: false,
                generateSchedule: false,
                inventoryScreen: false,
                digitalInventoryInfo: true
            });
        }).catch(err => console.log(err))
    }

    const getDigitalAssetAdUnitMapping = (assetId) => {
        GetDigitalAssetAdUnitMapping(assetId).then((data) => {
            setDigitalAssetAdUnitMapping(data);

        }).catch(err => console.log(err))
    }

    const getCostTypes = async () => {
        GetCostTypes().then((data) => {
            let costData = [];
            if (data)
                data.map(item => {
                    costData.push({ label: item.costTypeName, value: item.id });
                });
            setCostTypeData(costData);
        }).catch(err => console.log(err))
    }
    const getUnitTypes = async (id) => {
        GetUnitTypes(id).then((data) => {
            let unitData = [];
            data.map(item => {
                unitData.push({ label: item.unitTypeName, value: item.id, mediaTypeId: item.mediaTypeId });
            });
            setUnitTypeData(unitData);
        }).catch(err => console.log(err))
    }

    const handleSplitUnit = async (mediaTypeId, inventoryId, index, startDate, endDate, data) => {
        if (isEditing) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode)
            return false;
        }
        setOnlyViewSplit(false);
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: true,
            monthlySplit: false,
            generateSchedule: false
        });
        setMediaTypeId(mediaTypeId)
        setExpandInventoryReport(false);
        setDealInventoryEdit(true);
        setSelectedDealId(data.inventoryDealId);
        setExpandInventoryDeal(false);
        setExpendBuildSchedule(false);
        setExpandSplitUnit(true);
        setIsEditing(true);
        setInventoryId(inventoryId);
        const InventorySpiltRow = InventoryRows.filter(item => item.id === inventoryId);
        setInventoryRow(InventorySpiltRow);
        setSeasonStartDate(Helper.FormatDate(startDate));
        setSeasonEndDate(Helper.FormatDate(endDate));
        setRowClick(false);
    }

    const selectedDeal = (dealData) => {
        setSelectedDealId(dealData.inventoryDealId);
    }

    const handleInventoryDealEditClick = (dealId, btnName, inventoryDealData, dealSourceId, countDealInventoryItems) => {
        setDealSourceId(dealSourceId)
        setCountDealInventoryItems(countDealInventoryItems)
        if (DealInventoryEdit) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        if (isEditing) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        setDealInventoryEdit(true);
        setEnableDealEdit(true);
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: true,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false,
            inventoryScreen: false
        });
        setExpandInventoryReport(false);
        setSelectedDealId(inventoryDealData.inventoryDealId);
        setSelectedBtn(btnName);
        setInventoryDealData(inventoryDealData);
        setExpandMonthlySplit(false);
        setExpandSplitUnit(false);
        setExpendBuildSchedule(false);
        setIsEditing(true);
        setExpandInventoryDeal(true);

    }

    const handleRowClick = (id, index, inventoryDealId, dealData, mediaTypeId) => {
        if (isEditing || DealInventoryEdit) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode + ' Please close the edit screen.');
            return false;
        }
        if (!isOpenCS) {
            if (InventoryId === id) {
                return false;
            }
            setSelectedDealId(inventoryDealId);
            setInventoryDealData(dealData);
            setSeasonStartDate(Helper.FormatDate(dealData.inventoryItems[0].seasonStartDate));
            setSeasonEndDate(Helper.FormatDate(dealData.inventoryItems[0].seasonEndDate));
            setDealInventoryEdit(false);
            setExpandInventoryDeal(false);
            getInventoryUnit(id);
            setOnlyViewSplit(true);
            setobjAccordionVisiblity({
                inventoryGrid: true,
                inventoryReport: false,
                InventoryDeal: false,
                spliUnit: true,
                monthlySplit: false,
                generateSchedule: true,
                inventoryScreen: false
            });
            getSchedules(id);
            setExpandInventoryReport(false);
            setExpandInventoryGrid(true);
            setExpandMonthlySplit(false);
            if (expandedBuildSchedule === false && expandSplitUnit === false) {
                setExpendBuildSchedule(true);
                setExpandSplitUnit(false);
            }
            setInventoryId(id);
            setMediaTypeId(mediaTypeId);
            setIsEditing(false);
            setRowClick(true);
        } else {
            setobjAccordionVisiblity({
                inventoryGrid: true,
                inventoryReport: false,
                InventoryDeal: false,
                spliUnit: false,
                monthlySplit: false,
                generateSchedule: false
            });
            setExpandInventoryReport(false);
        }
    }

    const getSplitUnitData = (id, index) => {
        if (isEditing) {
            return false;
        }
        if (!isOpenCS) {
            if (InventoryId === id) {
                return false;
            }
            setShowLoading(true);
            setOpenBackdrop(true);
            setDealInventoryEdit(false);
            setExpandInventoryDeal(false);
            setOnlyViewSplit(true);
            setobjAccordionVisiblity({
                inventoryGrid: true,
                inventoryReport: false,
                InventoryDeal: false,
                spliUnit: true,
                monthlySplit: false,
                generateSchedule: true,
                inventoryScreen: false
            });
            setExpandInventoryReport(false);
            setExpandInventoryGrid(true);
            setExpandMonthlySplit(false);
            if (expandedBuildSchedule === false && expandSplitUnit === false) {
                setExpendBuildSchedule(true);
                setExpandSplitUnit(false);
            }
            setInventoryId(id);
            setIsEditing(false);
            setRowClick(true);
        } else {
            setobjAccordionVisiblity({
                inventoryGrid: true,
                inventoryReport: false,
                InventoryDeal: false,
                spliUnit: false,
                monthlySplit: false,
                generateSchedule: false
            });
            setExpandInventoryReport(false);
        }
    }

    const getSchedules = (id) => {
        setScheduleOriginalRows([]);
        setScheduleRows([]);
        setShowScheduleLoading(true)
        GetInventorySchedule(id).then(Schedules => {
            setScheduleOriginalRows(Schedules);
            setScheduleRows(Schedules);
            setShowScheduleLoading(false);
        }).catch(err => {
            console.log("Error ", err);
            setShowScheduleLoading(false);
            return [];
        })
    }

    const handleGenerateScheduleExpand = () => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: true,
            monthlySplit: false,
            generateSchedule: true
        });
        setExpendBuildSchedule(!expandedBuildSchedule);
        setExpandSplitUnit(false);
        setExpandInventoryReport(false);
    }

    const handleReportClose = () => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false
        });
        setExpandInventoryReport(false);
    }

    const handleReportExpand = () => {
        if(expandInventoryReport && expandInventoryGrid){
            setExpandInventoryGrid(false);
            setExpandInventoryReport(true);
        }  else {
            if(expandInventoryGrid) {
                setExpandInventoryGrid(false);
            } else {
                setExpandInventoryGrid(true);
            }
            setExpandInventoryReport(!expandInventoryReport);
        }

    }

    const handleInventoryGridExpand = () => {
        if (expandInventoryDeal) {
            setExpandInventoryGrid(!expandInventoryGrid);
        }
        if (expandInventoryReport) {
            setExpandInventoryGrid(!expandInventoryGrid);
        }
        setExpendBuildSchedule(false);
        setExpandSplitUnit(false);
    }

    const handleSplitUnitExpand = () => {
        setExpandSplitUnit(!expandSplitUnit);
        setExpendBuildSchedule(false);
    }

    const handleExpandMonthlySplit = () => {
        setExpandMonthlySplit(!expandMonthlySplit);
    }

    const handleExpandDigitalInventoryInfo = () => {
        var expandDigitalInventoryInfoLocal = expandDigitalInventoryInfo;
        setExpandDigitalInventoryInfo(!expandDigitalInventoryInfoLocal);
    }

    const handleCopySchedule = (isStatus) => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false
        });
        setExpandInventoryReport(false);
        setIsOpenCS(isStatus);
        setExpandMonthlySplit(false);
        setExpandSplitUnit(false);
        setExpendBuildSchedule(false);
    }

    const handleMonthlySplitClick = (id, quantityTo, data) => {
        if (isEditing) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        setSelectedDealId(data.inventoryDealId);
        setDealInventoryEdit(true);
        setExpandInventoryDeal(false);
        setInventoryId(id);
        setIsEditing(true);
        setTotalQuantity(quantityTo);
        setExpandMonthlySplit(true);
        setExpandSplitUnit(false);
        setExpendBuildSchedule(false);
        setExpandInventoryReport(false);
        setRowClick(false);
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: true,
            generateSchedule: false,
            inventoryScreen: false
        });
    }

    const refreshPage = () => {
        getInventory(filterCriteria);
    }

    const handleMontlySplitClose = () => {
        setExpandMonthlySplit(false);
        setSelectedDealId();
        //setInventoryId();
        setIsEditing(false);
        setDealInventoryEdit(false);
        setTotalQuantity();
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false
        });
    }

    const handleSavedSearchesChange = (id) => {
        setDealInventoryEdit(false);
        setExpandInventoryDeal(false);
        setOpenBackdrop(true);
        setShowLoading(true);
        setShowFilterPopup(false);
        setSelectedFilterId(id)
        getUserPreference(inventoryTypeId, id);
    }

    const handleSearchCriteriaChange = (criteria, addInPrefList) => {
        setOpenBackdrop(true);
        setShowLoading(true);
        setFilterCriteria(criteria);
        setShowFilterPopup(false);
        setClearFilterStatus(true);
        if (addInPrefList)
            getUserPreference(inventoryTypeId);
        else
            getInventory(criteria);
    }

    const setInventoryFilterData = (filterData, status) => {

        if (!status) {
            setInventoryRows(InventoryOriginalRows);
            return false;
        }

        let dealList = [];
        if (filterData !== null && filterData.length > 0) {

            filterData.map((deal, i) => {
                if (deal.isFound) {
                    dealList.push(deal);
                }
                else if (deal.inventoryItems !== null && deal.inventoryItems.length > 0) {

                    let inventories = deal.inventoryItems.filter(x => x.isFound);
                    deal.inventoryItems = inventories;
                    dealList.push(deal);
                }
            })

            setInventoryRows(dealList);
        } else {
            setInventoryRows(filterData);
        }

    }

    const setFilterData = (filterData) => setScheduleRows(filterData);

    const handleSavedSearchesPopup = (status) => {
        setShowSavedSearchPopup(false);
        setShowFilterPopup(false);
        if (status) {
            // getUserPreference(inventoryTypeId);
            handleClearFilterClick(getEmptyFilterCriteria())
        }
    }

    const handleInventoryDeal = () => {
        setDealSourceId();
        if (DealInventoryEdit) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: true,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false
        });
        setExpandInventoryReport(false);
        setExpandInventoryDeal(true);
        setDealInventoryEdit(true);
        setEnableDealEdit(false);
        setCountDealInventoryItems();

        setExpendBuildSchedule(false);
        setExpandDigitalInventoryInfo(false);
        setExpandSplitUnit(false);
        setExpandMonthlySplit(false);
        setSelectedDealId();
        setInventoryDealData();

    }

    const handleEditDeal = (id) => {
        if (DealInventoryEdit) {
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            return false;
        }
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: true,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false
        });
        setExpandInventoryReport(false);
        setDealInventoryEdit(true);
        setExpandInventoryDeal(true);
    }

    const handleCloseInventoryDeal = () => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: false,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false
        });
        setExpandInventoryReport(false);
        setSelectedDealId();
        //setInventoryId();
        setEnableDealEdit(false);
        setDealInventoryEdit(false);
        setIsEditing(false);
        setExpandInventoryDeal(false);
        setInventoryDealData({});
        setCountDealInventoryItems("");
    }

    const inventoryReports = (data) => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            inventoryReport: true,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false,
            digitalInventoryInfo: false
        });
        setSelectedDealId(data.inventoryDealId);
        setInventoryDealData(data);
        //setInventoryId();
        setDealInventoryEdit(false);
        setIsEditing(false);
        setExpandInventoryReport(true);
        setExpandMonthlySplit(false);
        setExpandSplitUnit(false);
        setExpendBuildSchedule(false);
        setExpandInventoryDeal(false);
    }

    const handleDigitalInventoryInfoClose = () => {
        setobjAccordionVisiblity({
            inventoryGrid: true,
            InventoryDeal: false,
            spliUnit: false,
            monthlySplit: false,
            generateSchedule: false,
            digitalInventoryInfo: false
        });
        setExpandInventoryReport(false);
        setExpandDigitalInventoryInfo(false);
        setIsEditing(false);
        setProgramName("");
        //setInventoryId();
        setDigiAddInvInfoData({});
        setDigitalAssetAdUnitMapping({});
        setAssetId();

    }

    const editGlobalSearch = (data) => {

        if(showFilterPopup){
            notifyWarning(AppLanguage.APP_MESSAGE.Edit_Mode);
            setShowSavedSearchPopup(false);
            return false;
        }
        let tempObj = {
            LeagueId: leagueId,
            TypeId: inventoryTypeId,
            Id: data.id,
            name: data.name,
            description: data.description || "",
        }
    
        let prefJson = JSON.parse(data.prefererJson);
        tempObj["Venturize"] = prefJson.Venturize;
        tempObj["Season"] = prefJson.Season;
        tempObj["Region"] = prefJson.Region;
        tempObj["Network"] = prefJson.Network;
        tempObj["MediaType"] = prefJson.MediaType;
        tempObj["MarketType"] = prefJson.MarketType;

        tempObj["Episode"] = prefJson.Episode;
        tempObj["Country"] = prefJson.Country;
        tempObj["AssetType"] = prefJson.AssetType;

        setFilterCriteria(tempObj);
        setShowSavedSearchPopup(false);
        setSelectedFilterId(data.id)
        setIsEditSearch(true);
        setShowFilterPopup(true);
      }

    const refreshDataFromDB = () => {
        getSchedules(InventoryId);
    }

    const handleExpandInventoryDeal = () => {
        setExpandInventoryDeal(!expandInventoryDeal);

    }
    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText="INVENTORY MANAGEMENT"
            >
                <>
                    <IconButton onClick={handleFilterClick} component="div" title="Add Filter">
                        <FilterAltOutlinedIcon className={classes.filter} />
                    </IconButton>
                    {clearFilterStatus && <IconButton onClick={handleClearFilterClick} component="div" title="Clear Filter">
                        <FilterAltOffOutlinedIcon className={classes.filter} />
                    </IconButton>}
                    <Box component="div">
                        <Button onClick={buttonClicked} size="small" color="primary" variant="contained">{'Saved Searches'}</Button>
                    </Box>
                </>
            </SubHeader>
            {showFilterPopup && <FiltersScreen
                notifySuccess={notifySuccess}
                notifyWarning={notifyWarning}
                FilterName="Inventory" handleClose={handleFilterCloseClick}
                handleCriteriaChange={(criteria, addInPrefList) => handleSearchCriteriaChange(criteria, addInPrefList)}
                Criteria={filterCriteria}
                inventoryPreferences={inventoryPreferences} />
            }

            {
                props.page === "inventory" && !showFilterPopup && <Container maxWidth={false} disableGutters className={classes.container}>
                    <>
                        <AccordionHorizontal
                            resize={((expandInventoryGrid && expandInventoryReport) ||
                                (expandInventoryGrid && expandSplitUnit) ||
                                (expandInventoryGrid && expandedBuildSchedule) ||
                                (expandInventoryGrid && expandInventoryDeal) ||
                                (expandInventoryGrid && expandMonthlySplit) ||
                                (expandInventoryGrid && expandDigitalInventoryInfo)
                            )

                            }
                            accordionTitle={"Inventory"} displayName="Inventory Grid"
                            handleExpand={handleInventoryGridExpand}
                            Expanded={expandInventoryGrid}>
                            {expandInventoryGrid && <InventoryGrid selectedDealId={selectedDealId} inventoryReports={inventoryReports}
                                setChildScreen={setChildScreen} isEditing={isEditing}
                                handleGenerateScheduleClick={handleGenerateScheduleClick}
                                handleSplitUnit={(mediaTypeId, id, index, startDate, endDate, data) => {
                                    handleSplitUnit(mediaTypeId, id, index, startDate, endDate, data)
                                }}
                                setSearchItem={(val) => setSearchItem(val)}
                                resetApplyLocalFilter={()=> {
                                        setFilterLoading(false);
                                        setApplyLocalFilter(false);
                                    }
                                }
                                clearData={()=> {
                                    setIsOpenCS(false);
                                }}
                                searchItem={searchItem}
                                applyLocalFilter={applyLocalFilter}
                                handleEditDeal={handleEditDeal}
                                handleInventoryDeal={handleInventoryDeal}
                                refreshPage={refreshPage}
                                handleCopySchedule={handleCopySchedule}
                                handleMonthlySplitClick={handleMonthlySplitClick}
                                handleInventoryDealEditClick={handleInventoryDealEditClick}
                                selectedInventoryId={InventoryId}
                                selectedMediaTypeId={MediaTypeId}
                                view={!(expandInventoryGrid && (expandedBuildSchedule || expandSplitUnit || expandMonthlySplit || expandInventoryDeal || expandDigitalInventoryInfo || expandInventoryReport))}
                                setFilterData={setInventoryFilterData}
                                rows={InventoryRows}
                                originalData={InventoryOriginalRows}
                                getSplitUnitData={(id) => {
                                    getSplitUnitData(id)
                                }}
                                handleRowClick={handleRowClick}
                                handleDigitalAdditionalInfoClick={handleDigitalAdditionalInfoClick}
                                filterCriteria={filterCriteria}
                            />}
                        </AccordionHorizontal>
                    </>
                    {
                        AccordionVisiblity.generateSchedule && <AccordionHorizontal
                            resize={expandInventoryGrid && expandedBuildSchedule} displayName="BuildSchedule"
                            accordionTitle={"Generate Schedule"} Expanded={expandedBuildSchedule}
                            handleExpand={handleGenerateScheduleExpand}
                        >
                            <LinearSchedule rows={ScheduleRows}
                                originalData={ScheduleOriginalRows}
                                recordCount={ScheduleRows ? ScheduleRows.length : 0}
                                setFilterData={setFilterData}
                                rowClick={rowClick}
                                showCloseIcon={rowClick ? false : true}
                                ProgramName={ProgramName}
                                successClose={successClose}
                                refreshDataFromDB={refreshDataFromDB}
                                InventoryId={InventoryId}
                                InventoryData={inventoryData}
                                handleClose={handleClose}
                                scheduleLength={quantityTo}
                                seasonStartDate={seasonStartDate}
                                seasonEndDate={seasonEndDate}
                                AssetId = {AssetId}
                                notifySuccess={msg => notifySuccess(msg)}
                            />

                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.spliUnit && <AccordionHorizontal
                            resize={(expandInventoryGrid && expandSplitUnit)} displayName="Split Unit"
                            accordionTitle={"Split Unit"} Expanded={expandSplitUnit}
                            handleExpand={handleSplitUnitExpand}
                        >
                            <SplitUnit handleClose={handleClose}
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                inventoryId={InventoryId}
                                data={dealData}
                                seasonStartDate={seasonStartDate}
                                seasonEndDate={seasonEndDate}
                                showCloseIcon={rowClick ? false : true}
                                MediaTypeId={MediaTypeId}
                                onlyViewSplit={onlyViewSplit}
                                InventoryRows={InventoryRows} />
                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.monthlySplit && <AccordionHorizontal
                            resize={(expandInventoryGrid && expandMonthlySplit)} displayName="Monthly Split"
                            accordionTitle={"Split Unit"} Expanded={expandMonthlySplit}
                            handleExpand={handleExpandMonthlySplit}
                        >
                            <MonthlySplit inventoryId={InventoryId} projectedQuantity={totalQuantity}
                                //totalQuantity={totalQuantity + Math.floor(1 + Math.random() * 100)}
                                handleClose={handleMontlySplitClose} showCloseIcon={true}
                                isEditing={isEditing}
                            />

                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.InventoryDeal && <AccordionHorizontal
                            resize={(expandInventoryGrid && expandInventoryDeal)} displayName="Inventory Deal"
                            accordionTitle={"Inventory Deal"} Expanded={expandInventoryDeal}
                            handleExpand={handleExpandInventoryDeal}
                        >
                            <InventoryDeal handleClose={handleCloseInventoryDeal} refreshPage={refreshPage}
                                inventoryDealData={inventoryDealData} isEditing={isEditing} inventoryReports={inventoryReports}
                                dealSourceId={dealSourceId} countDealInventoryItems={countDealInventoryItems}
                                enableDealEdit={enableDealEdit} updateEnableDealEdit={(val) => setEnableDealEdit(val)}
                            />

                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.digitalInventoryInfo && <AccordionHorizontal
                            resize={(expandInventoryGrid && expandDigitalInventoryInfo)} displayName="DigitalInventoryInfo"
                            accordionTitle={"Digital Inventory Info"} Expanded={expandDigitalInventoryInfo}
                            handleExpand={handleExpandDigitalInventoryInfo}
                        >
                            <DigitalAdditionalInventoryInfo ProgramName={ProgramName} AssetId={AssetId}
                                handleClose={handleDigitalInventoryInfoClose} showCloseIcon={true}
                                isEditing={isEditing} InventoryId={InventoryId} digiAddInvInfoData={digiAddInvInfoData && digiAddInvInfoData[0]} digitalAssetAdUnitMappingDetails={digitalAssetAdUnitMappingData}
                            />

                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.inventoryReport && <AccordionHorizontal
                            resize={(expandInventoryGrid && expandInventoryReport)} displayName="DMS Inventory"
                            accordionTitle={"DMS Inventory"} Expanded={expandInventoryReport} handleExpand={handleReportExpand}
                        >
                            <DmsInventoryReport dealId={inventoryDealData.dealId} handleReportClose={handleReportClose} />
                        </AccordionHorizontal>
                    }

                    {!filterLoading ? showLoading && <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                    >
                        <div className={'loader-div'}><div className={'loading'}></div></div>
                    </Backdrop> :

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={filterLoading}
                    >
                        <div className={'loader-div'}><div className={'loading'}></div></div>
                    </Backdrop>
                    }

                    {
                        showScheduleLoading && <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={showScheduleLoading}
                        >
                            <div className={'loader-div'}><div className={'loading'}></div></div>
                        </Backdrop>
                    }
                </Container>
            }
            {showSavedSearchPopup && <SavedSearches data={inventoryPreferences}
                notifySuccess={notifySuccess} handleEditClick={editGlobalSearch}
                show={showSavedSearchPopup}
                handleSavedSearchesPopup={() => handleSavedSearchesPopup(false)}
                handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                selectedFilterId={selectedFilterId}
                deleteSelectedFilter={() => setSelectedFilterId(0)}
            />}

        </React.Fragment>
    )
}

InventoryContainer.displayName = "InventoryContainer";
export default InventoryContainer;