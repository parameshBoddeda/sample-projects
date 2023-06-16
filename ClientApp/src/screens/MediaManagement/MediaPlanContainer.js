//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@mui/material/Backdrop';
import FiltersScreen from './Filter/MediaPlanFiltersScreen';
//Global Imports End
import ReportViewer from "../MediaPlanning/Planning/ReportViewer";
//Regional Imports Start
import AppDataContext from '../../common/AppContext';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import MediaPlanningContainer from '../MediaPlanning/MediaPlanningContainer';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import Budget from "../MediaPlanning/Budget/Budget";
import { GetBillBy, GetMediaPlansWithCriteria } from '../../services/planning.service';
import PlanningGrid from "./Planning/PlanningGrid";
import SoldByDataList from '../../static/SoldBy.json';
import AddPlan from '../MediaPlanning/Planning/AddPlan';
import { ToastContainer, toast } from "react-toastify";
import { GetLookupById, GetUserPreference, GetReportUrl } from "../../services/common.service";
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';

function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
const MediaPlanContainer = (props) => {
    const classes = useStyles();
    const { leagueId, username, FilterPreference } = useContext(AppDataContext);
    const [DealOriginalRows, setDealOriginalRows] = useState();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [expandDealGrid, setExpandDealGrid] = useState(false);
    const [expandedEditDeal, setExpendEditDeal] = useState(false);
    const [expandReport, setExpandReport] = useState(false);
    const [expandedPlanning, setExpandPlanning] = useState(true);
    const [expandBudget, setExpandBudget] = useState(false);
    const [expandAddMediaPlan, setExpandAddMediaPlan] = useState(false);
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [expandSalesMediaPlaaning, setExpandSalesMediaPlanning] = useState(true);
    const [planningRawData, setPlanningRawData] = React.useState({
        campaignOrAdvertiserId: -1, year: -1,
    });
    const [showLoading, setShowLoading] = useState(false)
    const [rowClick, setRowClick] = useState(false);
    const [selectedBudgetIndex, setSelectedBudgetIndex] = useState();
    const [selectedDealId, setSelectedDealId] = useState();
    const [dealAmount, setDealAmount] = useState(0)
    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        budget: false,
        showPlanning: true,
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
    const [selectedFilterId, setSelectedFilterId] = useState(0);
    const [isEditSearch, setIsEditSearch] = useState(false);

    React.useEffect(() => {
         if (FilterPreference && FilterPreference.length > 0) {
            let typeId = FilterPreference.find(x => x.lookupText === "Planning").lookupId;
            // getMediaPlans();
            getUserPreference(typeId, null);
            setTypeId(typeId);
        }
    }, [leagueId, FilterPreference]);

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

    const showMediaPlanningContainer = (id) => {
        setSelectedMediaPlanId(id);
        setobjAccordionVisiblity({
            budget: false,
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
        if(expandReport && expandedPlanning) {
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
        setIsEditing(true);
    }

    const getEmptyFilterCriteria = () => {
        return {
            campaignOrAdvertiserId: -1,
            leagueId: leagueId,
            TypeId: TypeId,
            year: -1,
            startDate: null,
            endDate: null,
            customer: [],
            mediaAE: [],
            billType: 0,
            billBy: 0,
            soldBy: null,
            name: "",
            description: "",
            Id: 0,
            user: username
        }
    }

    const prepareRequestObject = (criteria) => {
        const obj = {
            campaignOrAdvertiserId: planningRawData.campaignOrAdvertiserId,
            leagueId: leagueId,
            year: -1,
            user: username
        };

        let mediaAE = [];
        let seasons = [];
        let customers = [];
        criteria = criteria ?? getEmptyFilterCriteria();

        if(criteria?.Id){
            obj["Id"] = criteria.Id
        }

        if(criteria?.name){
            obj["name"] = criteria.name
        }

        if(criteria?.description){
            obj["description"] = criteria.description
        }

        if (criteria && ("mediaAE" in criteria) && criteria?.mediaAE.length > 0) {
            criteria.mediaAE.map(ele => {
                mediaAE.push(ele.value);
            });
        }

        if(mediaAE.length > 0) {
            obj["mediaAE"] = mediaAE;
        }

        if(criteria && ("season" in criteria) && criteria?.season.length > 0) {
            criteria.season.map(ele => {
                seasons.push(ele.value);
            });
        }

        if(seasons.length > 0) {
            obj["season"] = seasons;
        }

        if (criteria && ("customer" in criteria) && criteria?.customer.length > 0) {
            criteria.customer.map(ele => {
                customers.push(ele.value);
            });
        }
        
        if(customers.length > 0) {
            obj["customer"] = customers;
        }

        return obj;
    }

    const splitUIHandler = (action, editData) => {
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
            }
            else {
                setEditData({});
                setPlanId(-1);
                setPlanAction('Add')
                setStartDate(seasonStartDate)
                getBillBy();
                getSoldBy();
                getBillType();
            }
            if (editData?.endDate)
                setEndDate(editData.endDate)
            else
                setEndDate(seasonEndDate)
        } else if (action === "cancel") {
            setobjAccordionVisiblity({
                budget: false,
                showPlanning: true,
                addMediaPlan: false,
                report: false,
            })
            setExpandDealGrid(false);
            setExpandAddMediaPlan(false);
            setExpandReport(false);

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
                budget: false,
                showPlanning: true,
                addMediaPlan: false,
                report: true
            });
            GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
                setReportUrl(data);
                setPlanId(editData.id);
                setPlanningRawData({
                    campaignOrAdvertiserId: editData.campaignOrAdvertiserId,
                    year: editData.year
                })
                setExpandReport(true);

            }).catch(err => {
                console.log(err);
            })

        }
        else if(action === "downloadCustomer"){
            setobjAccordionVisiblity({
                budget: false,
                showPlanning: true,
                addMediaPlan: false,
                report: true
            });
            GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
                data = data.replace("&rp:Columns_Hide=N","&rp:Columns_Hide=Y")
                setReportUrl(data);
                setPlanId(editData.id);
                setPlanningRawData({
                    campaignOrAdvertiserId: editData.campaignOrAdvertiserId,
                    year: editData.year
                })
                setExpandReport(true);

            }).catch(err => {
                console.log(err);
            })
        }
        else if (action === "budget") {
            setobjAccordionVisiblity({
                budget: true,
                showPlanning: true,
                addMediaPlan: false,
                report: false
            })
            setStartDate(editData.startDate);
            setEndDate(editData.endDate);
            setEditData(editData);
            setExpandBudget(true);
            setExpandAddMediaPlan(false);
            setExpandReport(false);
        }
    }

    const getMediaPlans = (criteria) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        setApplyLocalFilter(false);
        GetMediaPlansWithCriteria(prepareRequestObject(criteria)).then(planData => {
            let data = planData.filter(x => x.customerId !== 1);
            setPlanRows(data);
            setOriginalPlanData(data);
            if(searchItem) {
                setApplyLocalFilter(true);
            } else {
                setApplyLocalFilter(false);
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

    const buttonClicked = () => {
        setShowSavedSearchPopup(true);
        setIsEditSearch(false);
    }

    const handleFilterClick = () => {
        let tempFilters = {
            LeagueId: leagueId,
            year: 0,
            TypeId: TypeId,
            name: "",
            description: "",
            Id: 0,
            user: username
        };
        setFilterCriteria(tempFilters);
        setShowFilterPopup(true);
        setIsEditSearch(false);
    }

    const handleClearFilterClick = () => {
        getMediaPlans(getEmptyFilterCriteria());
        setClearFilterStatus(false);
        setShowFilterPopup(false);
        setSelectedFilterId(0)
        setFilterCriteria(getEmptyFilterCriteria());
        setIsEditSearch(false)
    }

    const handleFilterCloseClick = () => {
        setShowFilterPopup(false);
        setIsEditSearch(false);
        if(selectedFilterId) {
            getUserPreference(TypeId, selectedFilterId);
        } else {
            const clearedFilter = getEmptyFilterCriteria()
            setFilterCriteria(clearedFilter)
            getMediaPlans(clearedFilter);
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
            getMediaPlans(filterCriteria);
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
            getMediaPlans(prefJson);
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
        setOpenBackdrop(true);
        setShowLoading(true);
        setSelectedFilterId(id)
        getUserPreference(TypeId, id);
    }

    const closeAll = () => {
        setobjAccordionVisiblity({
            budget: false,
            showPlanning: true,
            addMediaPlan: false,
            report: false,
        })
        setExpandDealGrid(false);
        setExpandAddMediaPlan(false);
        setExpandReport(false);

        setExpendEditDeal(false);
        setExpandPlanning(true);
        setExpandBudget(false);
        setExpandAddMediaPlan(false);
        setExpandDetail(false);
        setStartDate('');
        setEndDate('');
        setEditData({});
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
        tempObj["mediaAE"] = prefJson.mediaAE;
        tempObj["season"] = prefJson.season;
        setFilterCriteria(tempObj);
        setSelectedFilterId(data.id)
        setShowFilterPopup(true);
    }

    const setFilterData = (data) => setPlanRows(data);

    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText={!AccordionVisiblity.showPlanning ? "ADVERTISERS" : "MEDIA PLANS"}
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

                props.page === "mediaPlan" && <Container maxWidth={false} disableGutters className={classes.container}>
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
                                hideBudgetDetails={true}
                                setFilterData={setFilterData}
                                dealAmount={dealAmount} planData={planRows}
                                originalPlanData={originalPlanData}
                                dealStartDate={startDate} dealEndDate={endDate}
                                splitUIHandler={(action, editData) => splitUIHandler(action, editData)}
                                expandAddMediaPlan={!expandAddMediaPlan}
                                expandReport={expandReport}
                                getMediaPlans={() => getMediaPlans(filterCriteria)}
                                setSearchItem={(val) => setSearchItem(val)}
                                resetApplyLocalFilter={()=> {
                                        setApplyLocalFilter(false);
                                    }
                                }
                                applyLocalFilter={applyLocalFilter}
                                searchItem={searchItem}
                                filterCriteria={filterCriteria}
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
                                callApiToRefreshGridData={() => {
                                    getMediaPlans(filterCriteria);
                                    closeAll();
                                }}
                                hideExpandIcon={true}
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                billBy={BillByData}
                                SoldBy={SoldByData}
                                Billtype={billTypeData} />
                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.report && <AccordionHorizontal hideExpandButton={false}
                            resize={expandedPlanning && expandReport} displayName="SSRS Report"
                            accordionTitle={"SSRS Report"} Expanded={expandReport}
                            handleExpand={handleReportExpand}
                        >
                            <ReportViewer hideExpandIcon={true} planId={'&rp:PlanID=' + planId} leagueId={leagueId} 
                                url={reportUrl}  selectedDealId={planningRawData.campaignOrAdvertiserId}
                                splitUIHandler={(editData) => splitUIHandler('download', editData)}
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
                                callApiToRefreshGridData={() => {
                                    getMediaPlans(filterCriteria);
                                    //closeAll();
                                }}
                                data={editData}
                                seasonStartDate={startDate}
                                seasonEndDate={endDate}
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
                        show={showSavedSearchPopup}
                        handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
                        handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                        selectedFilterId={selectedFilterId}
                        deleteSelectedFilter={() => setSelectedFilterId(0)}
                        handleEditClick={editGlobalSearch}
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

MediaPlanContainer.displayName = "MediaPlanContainer";
export default MediaPlanContainer;