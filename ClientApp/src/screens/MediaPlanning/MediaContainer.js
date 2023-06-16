//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FiltersScreen from './Filter/MediaPlanFiltersScreen';
//Global Imports End
import ReportViewer from "./Planning/ReportViewer";
//Regional Imports Start
import MediaGrid from './MediaGrid';
import AppDataContext from '../../common/AppContext';
import Helper from '../../common/Helper';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import MediaPlanningContainer from './MediaPlanningContainer';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import Budget from "./Budget/Budget";
import DealEdit from './DealEdit/DealEdit';
import { GetDeals, GetBillBy, GetAdditionalDealInfo, GetMediaPlans } from './../../services/planning.service';
import PlanningGrid from "./Planning/PlanningGrid";
import SoldByDataList from '../../static/SoldBy.json';
import AddPlan from "./Planning/AddPlan";
import { ToastContainer, toast } from "react-toastify";
import { GetLookupById, GetUserPreference, GetReportUrl } from "./../../services/common.service";
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";

function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
const MediaContainer = (props) => {
    const classes = useStyles();
    const { leagueId, username, FilterPreference } = useContext(AppDataContext);
    const [DealOriginalRows, setDealOriginalRows] = useState();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [expandDealGrid, setExpandDealGrid] = useState(true);
    const [expandedEditDeal, setExpendEditDeal] = useState(false);
    const [expandReport, setExpandReport] = useState(false);
    const [expandedPlanning, setExpandPlanning] = useState(false);
    const [expandBudget, setExpandBudget] = useState(false);
    const [expandAddMediaPlan, setExpandAddMediaPlan] = useState(false);
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [expandSalesMediaPlaaning, setExpandSalesMediaPlanning] = useState(false);
    const [planningRawData, setPlanningRawData] = React.useState({
        dealId: '', year: '',
    });
    const [showLoading, setShowLoading] = useState(false)
    const [rowClick, setRowClick] = useState(false);
    const [selectedBudgetIndex, setSelectedBudgetIndex] = useState();
    const [selectedDealId, setSelectedDealId] = useState();
    const [dealAmount, setDealAmount] = useState(0)
    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        dealGrid: true,
        budget: false,
        editDeal: false,
        showPlanning: false,
        addMediaPlan: false,
        report: false,
        salesMediaPlanning: false
    });
    const [clearFilterStatus, setClearFilterStatus] = useState(false);
    const [DealsData, setDealsData] = useState();
    const [selectedBtn, setSelectedBtn] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [seasonStartDate, setSeasonStartDate] = useState(null);
    const [seasonEndDate, setSeasonEndDate] = useState(null);
    const [planAction, setPlanAction] = useState('Add');
    const [planId, setPlanId] = useState(-1);
    const [BillByData, setBillByData] = useState([]);
    const [SoldByData, setSoldByData] = useState([]);
    const [AdditionalDealInfoData, setAdditionalDealInfoData] = useState([]);
    const [planRows, setPlanRows] = useState([]);
    const [originalPlanData, setOriginalPlanData] = useState([]);
    const [editData, setEditData] = useState({});
    const [selectedInventoryId, setSelectedInventoryId] = useState();
    const [selectedMediaPlanId, setSelectedMediaPlanId] = useState(null);
    const [billTypeData, setBillTypeData] = useState([]);
    const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
    const [TypeId, setTypeId] = useState();
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [savedSearchList, setSavedSearchList] = useState([]);
    const [reportUrl, setReportUrl] = useState("");

    const [applyLocalFilter, setApplyLocalFilter] = useState(false);
    const [searchItem, setSearchItem] = useState();

    const [applyLocalFilterPlan, setApplyLocalFilterPlan] = useState(false);
    const [searchItemPlan, setSearchItemPlan] = useState();

    const [selectedEle, setSelectedEle] = useState([]);
    const [selectedFilterId, setSelectedFilterId] = useState(0);    
    const [isEditSearch, setIsEditSearch] = useState(false);

    const getBillBy = () => {
        GetBillBy().then(BillByData => {
            let billByList = [];
            BillByData.map(billBy => {
                billByList.push({ label: billBy.lookupText, value: billBy.lookupId });
            });
            setBillByData(billByList);

        }).catch(err => {
            return [];
        });
    }

    const getSoldBy = () => {
        let soldByList = [];
        SoldByDataList.map(soldBy => {
            soldByList.push({ label: soldBy.soldByName, value: soldBy.soldById });
            setSoldByData(soldByList);

        });
    }

    const getBillType = () => {
        let id = 250;
        GetLookupById(id)
            .then((data) => {
                let billType = [];
                if (data) {
                    data.map((item) => {
                        billType.push({ label: item.lookupText, value: item.lookupId });
                    });
                    setBillTypeData(billType);
                }
            })
            .catch((err) => console.log("err", err));
    };

    const getAdditionalDealInfo = (id) => {
        GetAdditionalDealInfo(id).then((data) => {
            setAdditionalDealInfoData(data);
            setShowLoading(false);
            setOpenBackdrop(false);
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: true,
                showPlanning: false,
                report: false,
                salesMediaPlanning: false
            });
        }).catch(err => console.log(err))
    }

    const handleExpandDealGrid = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: false,
            editDeal: false,
            showPlanning: false,
            addMediaPlan: false,
            report: false,
            salesMediaPlanning: false
        });
        setExpandPlanning(false);
        setSelectedBtn();
        setSelectedDealId();
        setIsEditing(false);
        setExpandDealGrid(true);
        setExpandBudget(false);
        setExpendEditDeal(false);
        setExpandReport(false);
        getDeals(filterCriteria);
    }

    const showMediaPlanningContainer = (id) => {
        setSelectedMediaPlanId(id);
        setobjAccordionVisiblity({
            dealGrid: false,
            budget: false,
            editDeal: false,
            showPlanning: true,
            addMediaPlan: false,
            report: false,
            salesMediaPlanning: true
        });
        setExpandPlanning(false);
        setExpendEditDeal(false);
        setExpandBudget(false);
        setRowClick(false);
        setExpandSalesMediaPlanning(true);
    }

    const handleDealEditExpand = () => {
        setExpendEditDeal(!expandedEditDeal);
        setExpandBudget(false);
        if (expandedEditDeal) {
            setRowClick(false);
        } else {
            setRowClick(false);
        }
    }

    const handleBudgetExpand = () => {
        setExpandBudget(!expandBudget);
        setExpendEditDeal(!expandedEditDeal);
        if (expandBudget) {
            setRowClick(false);
        } else {
            setRowClick(false);
        }
    }
    const handleAddMediaExpand = () => {
        setExpandAddMediaPlan(false);
    }

    const handleReportExpand = () => {


        if(expandReport && expandedPlanning){
            setExpandPlanning(false);
            setExpandReport(true)
        } else {
            if(!expandedPlanning) {
                setExpandPlanning(true);
            } else {
                setExpandPlanning(false);
            }

            setExpandReport(!expandReport)
        }

    }

    const handleSalesMediaExpand = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: false,
            editDeal: false,
            showPlanning: true,
            addMediaPlan: false,
            report: false,
            salesMediaPlanning: false
        });
        setExpandSalesMediaPlanning(false);
        setExpandReport(false);
        setExpandAddMediaPlan(false);
        setExpandBudget(false);
        setExpandPlanning(true);
        setExpandDealGrid(false);
        setIsEditing(false);
    }

    const gridRowClick = (id) => {
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: true,
            editDeal: true,
            showPlanning: false,
            report: false,
        });
        setRowClick(true);
        setSelectedDealId(id);
    }

    const handleClose = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: false,
            editDeal: false,
            showPlanning: false,
            report: false,
        });
        setRowClick(false);
        setExpendEditDeal(false);
        setExpandPlanning(false);
        setExpandBudget(false);
        setSelectedDealId();
        setSelectedInventoryId();
        setIsEditing(false);
        setExpandReport(false);
    }

  

    const handleDealEditClick = (dealId, btnName) => {
        if (isEditing) {
            notifyWarning("Already open in edit mode.");
            return false;
        }
        setIsEditing(true);
        setShowLoading(true);
        setOpenBackdrop(true);
        setRowClick(false);
        setSelectedBtn(btnName);
        setExpendEditDeal(true);
        setSelectedBudgetIndex();
        setExpandBudget(false);
        setExpandReport(false);
        setSelectedDealId(dealId);
        getBillBy();
        getSoldBy();
        getAdditionalDealInfo(dealId);
    }

    const handleBudgetClick = (id, index) => {
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: true,
            editDeal: false,
            showPlanning: false,
            report: false,
            salesMediaPlanning: false
        });
        setExpandPlanning(false);
        setExpendEditDeal(false);
        setSelectedBtn();
        setSelectedBudgetIndex(index);
        setExpandBudget(true);
        setRowClick(false);
        setSelectedDealId(id);
    }


    const prepareRequestObect = (criteria) => {

        const obj = {
            LeagueId: leagueId,
            TypeId: TypeId,
            user: username

        };

        let customers = [];

        if(criteria.customer.length > 0) {
            criteria.customer.map(ele => {
                customers.push(ele.value);
            });
        }

        if(criteria.Id){
            obj["Id"] = criteria.Id
        }

        if(criteria.name){
            obj["name"] = criteria.name
        }

        if(criteria.description){
            obj["description"] = criteria.description
        }

        if(criteria.customer && customers.length > 0){
            obj["customer"] = customers
        }

        if(criteria.year){
            obj["year"] = criteria.year
        }

        if(criteria && ("marketType" in criteria)){
            obj["marketType"] = criteria.marketType?.value
        }
        return obj;
    }

    const editGlobalSearch = (data) => {
        setIsEditSearch(true);
        let tempObj = {
            LeagueId: leagueId,
            TypeId: TypeId,
            Id: data.id,
            name: data.name,
            description: data.description || "",
        }

        let prefJson = JSON.parse(data.prefererJson);
        tempObj["customer"] = prefJson.customer;
        tempObj["year"] = prefJson.year;
        tempObj["marketType"] = prefJson.marketType;
        setFilterCriteria(tempObj);
        setSelectedFilterId(data.id)
        setShowFilterPopup(true);
    }


    const getDeals = (criteria) => {
        setShowLoading(true);
        setOpenBackdrop(true);

        GetDeals(prepareRequestObect(criteria)).then(dealsData => {
            setDealsData(dealsData);
            if(searchItem){
                setApplyLocalFilter(true);
            }
            setDealOriginalRows(dealsData);
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            setDealsData([]);
            setDealOriginalRows([]);
        });
    }

    const handleShowPlanning = (amount, dealId, year, startDate, endDate, inventoryId, seasonStartDate, seasonEndDate, descEle) => {
  
        if (isEditing) {
            notifyWarning("Already open in edit mode.");
            return false;
        }
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: false,
            editDeal: false,
            showPlanning: true,
        });
        setPlanningRawData({
            dealId, year,
        });
        setDealAmount(amount);
        setSelectedEle(descEle);
        setExpandBudget(false);
        setExpandReport(false);
        setExpendEditDeal(false);
        setExpandDealGrid(false);
        setExpandAddMediaPlan(false)
        setExpandDetail(false);
        // setIsEditing(true);
        setExpandPlanning(true);
        setStartDate(startDate);
        setEndDate(endDate);
        setSelectedDealId(dealId);
        setSelectedInventoryId(inventoryId)
        setSeasonStartDate(seasonStartDate)
        setSeasonEndDate(seasonEndDate)
    }



    const handleExpandDetail = (dealId) => {
        let indexes = expandDetail;
        if (indexes.length > 0) {
            let found = false;
            indexes.map((ele, index) => {
                if (ele.id === dealId) {
                    indexes = indexes.filter(fliterEle => fliterEle.id !== dealId);
                    found = true;
                }
            });
            if (!found) {
                indexes.push({ id: dealId });
            }
        } else {
            indexes.push({ id: dealId });
        }
        setExpandDetail(indexes);
    }

    const handleBackToDealList = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            budget: false,
            editDeal: false,
            showPlanning: false,
        });
        setRowClick(false);
        setExpandDealGrid(true);
        setExpandPlanning(true);
        setExpendEditDeal(false);
        setExpandBudget(false);
        setSelectedDealId();
    }
    const splitUIHandler = (action, editData) => {
        // console.log(editData)
        if (action === "salesPlanning") {
            setEditData(editData);
            showMediaPlanningContainer(editData.id);
              
        }
        if (action === "addPlan") {
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: true,
            })
            setExpandAddMediaPlan(true);
            if (editData?.startDate) {
                setEditData(editData);
                setPlanId(editData.id);
                setPlanAction('Edit');
                setStartDate(editData.startDate);
                getBillBy();
                getSoldBy();
                getBillType();
                setIsEditing(true)
            }
            else {
                setEditData({});
                setPlanId(-1);
                setPlanAction('Add')
                setStartDate(seasonStartDate)
                getBillBy();
                getSoldBy();
                getBillType();
                setIsEditing(false)
            }
            if (editData?.endDate)
                setEndDate(editData.endDate)
            else
                setEndDate(seasonEndDate)
        } else if (action === "cancel") {
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: false,
            })
            setExpandDealGrid(false);
            setExpandAddMediaPlan(false);
            setExpandReport(false);
            setIsEditing(false)
            setExpendEditDeal(false);
            setExpandPlanning(true);
            setExpandBudget(false);
            setExpandAddMediaPlan(false);
            setExpandDetail(false);
            setStartDate('');
            setEndDate('');
            setEditData({});
        }
        else if (action === "download") {
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: false,
                report: true
            });
            GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
                setReportUrl(data);
                setPlanId("&rp:PlanID=" + editData.id);
                setExpandReport(true);

            }).catch(err => {
                console.log(err);
            })

        }
        else if(action === "downloadCustomer"){
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: false,
                report: true
            });
            GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
                data = data.replace("&rp:Columns_Hide=N","&rp:Columns_Hide=Y")
                setReportUrl(data);
                setPlanId("&rp:PlanID=" + editData.id);
                setExpandReport(true);

            }).catch(err => {
                console.log(err);
            })
        }
        else if (action === "downloadAll") {
            console.log("selectedEle ", selectedEle)
            let planIds = "";
            selectedEle.mediaPlans.map((ele, index) => {
                planIds = planIds + `&rp:PlanID=` + ele.planId;
            })
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: false,
                report: true
            });
            GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
                setReportUrl(data);
                setPlanId(planIds);
                setExpandReport(true);

            }).catch(err => {
                console.log(err);
            })
        }
        else if(action === "downloadCustomerAll"){
            console.log("selectedEle ", selectedEle)
            let planIds = "";
            selectedEle.mediaPlans.map((ele, index) => {
                planIds = planIds + `&rp:PlanID=` + ele.planId;
            })
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: false,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: false,
                report: true
            });
            GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
                data = data.replace("&rp:Columns_Hide=N","&rp:Columns_Hide=Y")
                setReportUrl(data);
                setPlanId(planIds);
                setExpandReport(true);

            }).catch(err => {
                console.log(err);
            })
        }
        else if (action === "budget") {
            setobjAccordionVisiblity({
                dealGrid: true,
                budget: true,
                editDeal: false,
                showPlanning: true,
                addMediaPlan: false,
                report: false
            })
            setEditData(editData);
            setExpandBudget(true);
            setExpandAddMediaPlan(false);
            setExpandReport(false);
        }
    }
    const getMediaPlans = () => {
        setShowLoading(true);
        setOpenBackdrop(true);
        GetMediaPlans(planningRawData.dealId, planningRawData.year, leagueId).then(planData => {
            setPlanRows(planData);
            setOriginalPlanData(planData);
            if(searchItemPlan){
                setApplyLocalFilterPlan(true);
            }
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            setPlanRows([]);
            setOriginalPlanData([]);
        });
    }

    const setFilterData = (filterData, status) => {

        if (!status) {
            setDealsData(DealOriginalRows);
            return false;
        }

        let dealList = [];
        if (filterData !== null && filterData.length > 0) {

            filterData.map((deal, i) => {
                if (deal.isFound) {
                    dealList.push(deal);
                }
                else if (deal.advertiserBudgetItems !== null && deal.advertiserBudgetItems.length > 0) {

                    let inventories = deal.advertiserBudgetItems.filter(x => x.isFound);
                    deal.advertiserBudgetItems = inventories;
                    dealList.push(deal);
                }
            })

            setDealsData(dealList);
        } else {
            setDealsData(filterData);
        }

    }

    /******************************

    Global Filter -

    ********************************/

    const getEmptyFilterCriteria = () => {

        return {
            LeagueId: leagueId,
            customer: [],
            year: 0,
            TypeId: TypeId,
            name: "",
            description: "",
            Id: 0,
            user: username
        }
    }

    const buttonClicked = () => {
        setIsEditSearch(false);
        setShowSavedSearchPopup(true);
    }

    const handleFilterClick = () => {
        let tempFilters = {
            LeagueId: leagueId,
            customer: [],
            year: 0,
            TypeId: TypeId,
            name: "",
            description: "",
            Id: 0,
            user: username
        };
        setIsEditSearch(false);
        setFilterCriteria(tempFilters);
        setShowFilterPopup(true);
    }

    const handleClearFilterClick = () => {
        setIsEditSearch(false)
        getDeals(getEmptyFilterCriteria());
        setClearFilterStatus(false);
        setShowFilterPopup(false);
        setSelectedFilterId(0)
        setFilterCriteria(getEmptyFilterCriteria());
    }

    const handleFilterCloseClick = () => {
        setShowFilterPopup(false);
        if(selectedFilterId) {
            getUserPreference(TypeId, selectedFilterId);
        } else {
            const clearedFilter = getEmptyFilterCriteria()
            setFilterCriteria(clearedFilter)
            getDeals(clearedFilter);
            setClearFilterStatus(false);
            setSelectedFilterId(0)
        }
    }

    const handleSearchCriteriaChange = (criteriaObj, addInPrefList) => {
        setOpenBackdrop(true);
        setShowLoading(true);
        setFilterCriteria(criteriaObj);
        setShowFilterPopup(false);
        setClearFilterStatus(true);
        if (addInPrefList) {
            getUserPreference(TypeId);
        }
        else {
            getDeals(filterCriteria);
        }

    }

    const getUserPreference = (TypeId, prefId) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        if(!prefId && selectedFilterId && isEditSearch){
            prefId = selectedFilterId;
        }
        GetUserPreference(TypeId, leagueId).then((data) => {

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
            prefJson.TypeId = TypeId;
            prefJson.Id = defaultPref ? defaultPref.id : 0;
            prefJson.name = defaultPref?.name || '';
            prefJson.description = defaultPref?.description || '';
            setFilterCriteria(prefJson);
            setSavedSearchList(data);
            getDeals(prefJson);
            // getSchedule(leagueId);
            //getAllRateCardData(prefJson);
            setShowSavedSearchPopup(false);
        }).catch(err => {
            console.log(err);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    const handleSavedSearchesPopup = (status) => {
        setShowSavedSearchPopup(false);
        setShowFilterPopup(false);
        if (status) {
            getUserPreference(TypeId);
        }
    }

    const handleSavedSearchesChange = (id) => {
        setShowFilterPopup(false);
        setSelectedFilterId(id)
        getUserPreference(TypeId, id);
    }

    useEffect(() => {
        if (FilterPreference && FilterPreference.length > 0) {
            let tId = FilterPreference.find(x => x.lookupText === "Deals").lookupId;
            getUserPreference(tId, null);
            setTypeId(tId)
            setFilterCriteria({
                LeagueId: leagueId,
                TypeId: tId,
                user: username
            })
        }
    }, [leagueId, FilterPreference]);


    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText={!AccordionVisiblity.showPlanning ? "ADVERTISERS" : "MEDIA PLANNING"}
            >
                <>
                    <IconButton component="div" onClick={handleFilterClick}>
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

            {
                showFilterPopup ? <FiltersScreen handleFilterCloseClick={handleFilterCloseClick} notifySuccess={(msg) => notifySuccess(msg)}
                handleCriteriaChange={(criteria, addInPrefList) => handleSearchCriteriaChange(criteria, addInPrefList)}
                Criteria={filterCriteria} showLoading={(bool)=>setShowLoading(bool)} openBackdrop={(bool) => setOpenBackdrop(bool)}
                notifyWarning={(msg) => notifyWarning(msg)} isEditSearch={isEditSearch}

            />

            :

                props.page === "media" && <Container maxWidth={false} disableGutters className={classes.container}>
                    <>
                        {AccordionVisiblity.dealGrid && <AccordionHorizontal
                            resize={(expandDealGrid && expandedEditDeal) || (expandDealGrid && expandBudget)}
                            accordionTitle={"Sponsorship Deal"} displayName="Sponsorship Deal"
                            handleExpand={handleExpandDealGrid}
                            Expanded={expandDealGrid}>
                            <MediaGrid setFilterData={setFilterData}
                                selectedBudgetIndex={selectedBudgetIndex}
                                rows={DealsData} selectedInventoryId={selectedInventoryId}
                                originalData={DealOriginalRows}
                                isEditing={isEditing} handleShowPlanning={handleShowPlanning}
                                view={!(expandDealGrid && (expandedEditDeal || expandBudget))}
                                selectedDealId={selectedDealId} handleExpandDetail={handleExpandDetail} expandDetail={expandDetail}
                                handleDealEditClick={handleDealEditClick}
                                handlebudgetClick={handleBudgetClick} selectedBtn={selectedBtn}

                                setSearchItem={(val) => setSearchItem(val)}
                                resetApplyLocalFilter={()=> {
                                        setApplyLocalFilter(false);
                                    }
                                }
                                applyLocalFilter={applyLocalFilter}
                                searchItem={searchItem}
                                filterCriteria={filterCriteria}
                            />
                        </AccordionHorizontal>}
                    </>
                    {
                        AccordionVisiblity.editDeal && <AccordionHorizontal
                            resize={(expandDealGrid && expandedEditDeal)} displayName="Deal"
                            accordionTitle={"Deal"} Expanded={expandedEditDeal}
                            handleExpand={handleDealEditExpand}
                        >
                            <DealEdit showCloseIcon={!rowClick}
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                handleClose={handleClose}
                                hideExpendIcon={rowClick ? false : true} billBy={BillByData}
                                SoldBy={SoldByData} additionalDealInfoData={AdditionalDealInfoData[0]}
                                selectedDealId={selectedDealId}
                                isEditing={isEditing}
                            />

                        </AccordionHorizontal>
                    }
                    {/* {
                        AccordionVisiblity.budget && <AccordionHorizontal hideExpandButton={rowClick ? false : true}
                            resize={!rowClick ? !(expandDealGrid && expandBudget) : (expandDealGrid && expandBudget)} displayName="Budget"
                        >
                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.budget && <AccordionHorizontal
                            resize={(expandDealGrid && expandBudget)} displayName="Budget"
                            accordionTitle={"Budget"} Expanded={expandBudget}
                            handleExpand={handleBudgetExpand}
                        >
                            <Budget showCloseIcon={!rowClick} handleClose={handleClose} />

                        </AccordionHorizontal>
                    } */}



                    {
                        AccordionVisiblity.showPlanning && <AccordionHorizontal
                            resize={(expandedPlanning && expandAddMediaPlan) ||
                                (expandedPlanning && expandReport) ||
                                (expandedPlanning && expandBudget)
                            } displayName="Meadia Planning"
                            accordionTitle={"Media Plans"} Expanded={expandedPlanning}
                            handleExpand={handleSalesMediaExpand}
                        >
                            <PlanningGrid planningRawData={planningRawData}
                                view={
                                    (expandedPlanning && expandAddMediaPlan) ||
                                    (expandedPlanning && expandReport) ||
                                    (expandedPlanning && expandBudget)
                                }
                                dealAmount={dealAmount} planData={planRows}
                                handleBackToDealList={handleBackToDealList}
                                dealStartDate={startDate} dealEndDate={endDate}
                                splitUIHandler={(action, editData) => splitUIHandler(action, editData)}
                                expandAddMediaPlan={!expandAddMediaPlan}
                                expandReport={expandReport}
                                getMediaPlans={getMediaPlans}


                                setSearchItem={(val) => setSearchItemPlan(val)}
                                resetApplyLocalFilter={()=> {
                                        setApplyLocalFilterPlan(false);
                                    }
                                }
                                applyLocalFilter={applyLocalFilterPlan}
                                searchItem={searchItemPlan}
                                isEditing={isEditing}
                            />

                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.addMediaPlan && <AccordionHorizontal hideExpandButton={rowClick ? false : true}
                            resize={expandedPlanning && expandAddMediaPlan} displayName="Add Media Plan"
                            accordionTitle={"Add Media Plan"} Expanded={expandAddMediaPlan}
                            handleExpand={handleAddMediaExpand}
                        >
                            <AddPlan planningRawData={planningRawData} showCloseIcon={!rowClick}
                                planAction={planAction} planId={planId} startDate={startDate} endDate={endDate}
                                data={editData} allPlansData={planRows} handleClose={() => splitUIHandler('cancel')}
                                callApiToRefreshGridData={() => { getMediaPlans() }}
                                hideExpandIcon={true}
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                billBy={BillByData}
                                SoldBy={SoldByData}
                                Billtype={billTypeData}
                                seasonStartDate={seasonStartDate}
                                seasonEndDate={seasonEndDate}/>
                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.report && <AccordionHorizontal hideExpandButton={false}
                            resize={expandedPlanning && expandReport} displayName="SSRS Report"
                            accordionTitle={"SSRS Report"} Expanded={expandReport}
                            handleExpand={handleReportExpand}
                        >
                            <ReportViewer hideExpandIcon={true} planId={planId} leagueId={leagueId} url={reportUrl}
                                splitUIHandler={(editData) => splitUIHandler('download', editData)} selectedDealId={selectedDealId}
                                handleClose={() => splitUIHandler('cancel')} showCloseIcon={!rowClick} />
                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.budget && <AccordionHorizontal
                            resize={(expandedPlanning && expandBudget)} displayName="Planned $ Amount"
                            accordionTitle={"Planned $ Amount"} Expanded={expandBudget}
                            handleExpand={handleBudgetExpand}
                        >
                            <Budget showCloseIcon={!rowClick}
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                handleClose={() => splitUIHandler('cancel')}
                                showMediaPlanningContainer={(id) => showMediaPlanningContainer(id)}
                                startDate={startDate} endDate={endDate}
                                planningRawData={planningRawData} hideExpandIcon={true}
                                callApiToRefreshGridData={() => { getMediaPlans() }}
                                data={editData}
                                seasonStartDate={seasonStartDate}
                                seasonEndDate={seasonEndDate}
                            />

                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.salesMediaPlanning && <AccordionHorizontal
                            resize={(expandedPlanning && expandSalesMediaPlaaning)} displayName="Media Planning"
                            accordionTitle={"Media Planning"} Expanded={expandSalesMediaPlaaning}
                            handleExpand={handleSalesMediaExpand} hideExpandButton={true}
                        >
                            <MediaPlanningContainer selectedPlanData={editData} year={editData.year} selectedPlanIdForFilter={selectedMediaPlanId} hideHeader={true} />

                        </AccordionHorizontal>
                    }

                    {showSavedSearchPopup && <SavedSearches data={savedSearchList}
                        notifySuccess={notifySuccess}
                        notifyWarning={notifyWarning}
                        show={showSavedSearchPopup}
                        handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
                        handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                        selectedFilterId={selectedFilterId}
                        handleEditClick={editGlobalSearch}
                        deleteSelectedFilter={() => setSelectedFilterId(0)}
                    />}

                    {showLoading && <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                    >
                        <div className={'loader-div'}><div className={'loading'}></div></div>
                    </Backdrop>}


                </Container>
            }

        </React.Fragment>
    )
}

MediaContainer.displayName = "MediaContainer";
export default MediaContainer;