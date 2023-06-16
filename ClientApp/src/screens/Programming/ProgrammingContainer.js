import React, { useEffect, useState, useContext } from "react";
import AppDataContext from '../../common/AppContext';
import ScheduleContainer from './Scheduling/ScheduleContainer';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import TraffickingContainer from "./Trafficking/TraffickingContainer";
import { Container, Box, IconButton, Button, Typography  } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import GridListData from '../../static/GridListData.json';
import Trafficking from '../../static/Trafficking.json'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { GetSchedule } from './../../services/trafficking.service';
import { ToastContainer, toast } from "react-toastify";
import Helper from "../../common/Helper";
import { ROLE, CLAIMS } from "../../common/AppConstants";
import TraffickLetterContainer from './TraffickLetter/TraffickLetterContainer';
import FiltersScreen from './Filter/ProgrammingFiltersScreen';
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";
import { GetUserPreference } from './../../services/common.service';
import TraffickLetterViewer from './TraffickLetter/TraffickLetterViewer';

function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
        '& > .MuiCard-root': {
            '& .MuiCardActions-root': {
                height: 'calc(100vh - 128px) !important',
            },
            '& > .MuiCollapse-entered': {
                maxHeight: 'calc(100vh - 128px) !important',
            },
        },
    },

    isTrafficking: {

    }
}));

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}



const ProgrammingContainer = (props) => {
    const restrictedFields = [];
    const classes = useStyles();
    const TraffickingOriginalRows = Trafficking.rows;
    const { leagueId, username, FilterPreference } = useContext(AppDataContext);
    const [ScheduleOriginalRows, setScheduleOriginalRows] = React.useState([]);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [ScheduleRows, setScheduleRows] = React.useState([]);
    const [TraffickingRows, setTraffickingRows] = React.useState(TraffickingOriginalRows);
    const [expandSchedule, setExpandSchedule] = React.useState(true);
    const [expandScheduleManage, setExpandScheduleManage] = React.useState(true);
    const [expandTrafficking, setExpandTrafficking] = React.useState(false);
    const [expandTraffickLetter, setExpendTraffickLetter] = useState(false);
    const [selectedItem, setSelectedItem] = useState()
    const [objAccordionVisiblity, setobjAccordionVisiblity] = React.useState({
        schedule: true,
        trafficking: false,
        traffickLetter: false,
        indTraffickLetter: false
    });
    const [savedSearchList, setSavedSearchList] = useState([]);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = React.useState();
    const [selectedScheduleData, setSelectedScheduleData] = React.useState();
    const [expandIndTraffickLetter, setExpandIndTraffickLetter] = useState();
    const [recordCount, setRecordCount] = useState(20);
    const [recordCountLabel, setRecordCountLabel] = useState("20");
    const [recordStatusLabel, setRecordStatusLabel] = useState("Ready");
    const [recordStatus, setRecordStatus] = useState(1);

    const [clearFilterStatus, setClearFilterStatus] = useState(false);
    const setFilterData = (filterData) => setScheduleRows(filterData);

    const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
    const setTrafficingFilterData = (filterData) => {
        setTraffickingRows(filterData);
    }
    const [isEditSearches, setIsEditSearhces] = useState(false)
    const [TypeId, setTypeId] = useState();
    const [selectedFilterId, setSelectedFilterId] = useState(0);
    const [applyLocalFilterPlan, setApplyLocalFilterPlan] = useState(false);

    const [searchItemPlan, setSearchItemPlan] = useState();

    const splitScreenHandler = () => {

    }
    //
    const { userPermissions, baseURL, userId, userClaims } = useContext(AppDataContext);
    const GetUserRole = () => {
        let result = (!userPermissions ? '' : userPermissions.filter(p => p.key === "Role").map(x => x.value).shift());
        return result;
    }

    const CheckRole = (claimedRole) => {
        return Helper.CheckRole(GetUserRole(), claimedRole);
    }

    const CheckClaim = (permission) => {
        return Helper.CheckClaim(GetUserRole(), userClaims, permission);
    }

    //

    const setScheduleExpand = () => {
        if (!selectedScheduleId && !expandTraffickLetter) {
            notifyWarning("Please select any schedule to proceed.");
            return false;
        }
        if (!expandSchedule) {
            setExpandTrafficking(false);
        } else {
            setExpandTrafficking(true);
        }

        if(objAccordionVisiblity.traffickLetter){
            if (!expandSchedule) {
                setExpendTraffickLetter(false);
            } else {
                setExpendTraffickLetter(true);
            }
        }
        setExpandSchedule(!expandSchedule);
        setExpandIndTraffickLetter(false);
    }

    const setTraffickingExpand = () => {
        if (!selectedScheduleId) {
            notifyWarning("Please select any schedule to proceed.");
            return false;
        }
        if (!expandTrafficking) {
            setExpandSchedule(false);
        } else {
            setExpandSchedule(true);
        }
        setExpandTrafficking(!expandTrafficking);
        setExpendTraffickLetter(false);
    }


    const handleTraffickingClick = (data) => {
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: true,
            traffickLetter: false,
            indTraffickLetter: false
        });
        setScheduleRows(ScheduleOriginalRows);
        setExpandSchedule(false);
        setExpendTraffickLetter(false);
        setExpandTrafficking(true);
        setExpendTraffickLetter(false);
        setSelectedScheduleId(data.id);
        setSelectedScheduleData(data);
    }

    const prepareRequestObect = (criteria, marketId) => {

        const obj = {
            LeagueId: leagueId,
            TypeId: criteria.TypeId || TypeId,
            marketId: marketId,
            user: username
        };

        let regions = [];

        if(criteria.region.length > 0) {
            criteria.region.map(ele => {
                regions.push(ele.value);
            });
        }

        let countries = [];

        if(criteria.country.length > 0) {
            criteria.country.map(ele => {
                countries.push(ele.value);
            });
        }

        let networks = [];

        if(criteria.network.length > 0) {
            criteria.network.map(ele => {
                networks.push(ele.value);
            });
        }

        let assets = [];

        if(criteria.asset.length > 0) {
            criteria.asset.map(ele => {
                assets.push(ele.value);
            });
        }

        if(criteria.Id){
            obj["Id"] = criteria.Id
        }

        if(criteria.region.length > 0){
            obj["regions"] = regions
        }

        if(criteria.country.length > 0){
            obj["countries"] = countries
        }

        if(criteria.mediaType){
            obj["mediaType"] = criteria.mediaType.value
        }

        if(criteria.network.length > 0){
            obj["network"] = networks;
        }

        if(criteria.asset.length > 0){
            obj["asset"] = assets
        }

        if(criteria.startDate){
            obj["startDate"] = criteria.startDate
        }

        if(criteria.endDate){
            obj["endDate"] = criteria.endDate
        }

        if(criteria.description){
            obj["description"] = criteria.description
        }

        obj["recordCount"] = criteria.recordCount.toString();

        obj["recordStatus"] = criteria.recordStatus;

        if(criteria.name){
            obj["name"] = criteria.name
        }
        return obj;
    }

    const getFilteredData = (data) => {
        if(searchItemPlan && searchItemPlan.length > 2) {
            const searchRegex = new RegExp(escapeRegExp(searchItemPlan.trim()), 'i');
            const filteredRows = data.filter((row) => {
                return Object.keys(row).some((field) => {
                    if (restrictedFields.length > 0) {
                        if (row[field] && (!restrictedFields.includes(field))) {
                            return searchRegex.test(row[field].toString());
                        }
                    } else {
                        if (row[field]) {
                            return searchRegex.test(row[field].toString());
                        }
                    }
                });
            });
            return filteredRows;
        } else {
            return data;
        }
    }

    const getSchedule = (criteria) => {
        setShowLoading(true);
        setOpenBackdrop(true);

        let marketId=-1;
        //if (CheckRole(ROLE.TRAF1_INT) && CheckRole(ROLE.TRAF1_DOM) && CheckClaim(CLAIMS.ManageTrafficking))
        //    marketId = -1;
        //else if (CheckRole(ROLE.TRAF1_DOM) && CheckClaim(CLAIMS.ManageTrafficking))
        //    marketId = 111;
        //else if (CheckRole(ROLE.TRAF1_INT) && CheckClaim(CLAIMS.ManageTrafficking))
        //    marketId = 112;

        let params = prepareRequestObect(criteria, marketId);

        GetSchedule(params).then(scheduleData => {
            if(searchItemPlan){
                setTimeout(() => {
                    setApplyLocalFilterPlan(true);
                    setScheduleRows(getFilteredData(scheduleData));
                    setShowLoading(false);
                    setOpenBackdrop(false);
                }, 2000);
            } else {
                setApplyLocalFilterPlan(false);
                setScheduleRows(scheduleData);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
            setScheduleOriginalRows(scheduleData);
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
        });
    }

    const refreshPage = (trafficked) => {
       
        let tempSelectedScheduleData = selectedScheduleData;
        tempSelectedScheduleData.isTrafficked = trafficked;
        setSelectedScheduleData(tempSelectedScheduleData);
        getSchedule(filterCriteria);
    }

    const refreshDataFromDB = () => {
         getSchedule(filterCriteria);
    }

    const showTraffickLetter = (data) => {
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: false,
            traffickLetter: true,
            indTraffickLetter: false
        });
        setExpandSchedule(false);
        setExpendTraffickLetter(true);
        setExpandIndTraffickLetter(false);
    }

    const setTraffickLetterExpand = () => {
        if (!expandTrafficking) {
            setExpandSchedule(false);
        } else {
            setExpandSchedule(true);
        }
        setExpendTraffickLetter(!expandTraffickLetter);
        setExpandTrafficking(false);
        //setExpandSchedule(true);
    }

    const closeTraffickingLetter = () => {
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: false,
            traffickLetter: false,
            indTraffickLetter: false
        });
        setExpandSchedule(true);
        setExpendTraffickLetter(false);
        setSelectedScheduleId();
        setSelectedScheduleData();
    }

    /* Global Filter  */

    const getEmptyFilterCriteria = () => {

        return {
            LeagueId: leagueId,
            recordCount: recordCount,
            recordStatus: recordStatus,
            region: [],
            country: [],
            mediaType: 0,
            network: [],
            asset: [],
            startDate: null,
            endDate: null,
            TypeId: TypeId,
            name: "",
            description: "",
            Id: 0,
            user: username
        }
    }

    const buttonClicked = () => {
        setShowSavedSearchPopup(true);
        setIsEditSearhces(false);
    }

    const handleFilterClick = () => {
        let tempFilters = {
            LeagueId: leagueId,
            recordCount: recordCount,
            recordStatus: recordStatus,
            region: [],
            country: [],
            mediaType: 0,
            network: [],
            asset: [],
            startDate: null,
            endDate: null,
            TypeId: TypeId,
            name: "",
            description: "",
            Id: 0,
            user: username
        };
        setFilterCriteria(tempFilters);
        setIsEditSearhces(false);
        setShowFilterPopup(true);
        setIsEditSearhces(false);
    }

    const handleClearFilterClick = () => {
        //getAllRateCardData(getEmptyFilterCriteria());
        getSchedule(getEmptyFilterCriteria());
        setIsEditSearhces(false);
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
            getSchedule(clearedFilter);
            setClearFilterStatus(false);
            setSelectedFilterId(0)
        }
    }

    const handleSearchCriteriaChange = (criteriaObj, addInPrefList) => {
        setOpenBackdrop(true);
        setShowLoading(true);
        criteriaObj["recordCount"] = recordCount;
        criteriaObj["recordStatus"] = recordStatus;
        setFilterCriteria(criteriaObj);
        setShowFilterPopup(false);
        setClearFilterStatus(true);
        if (addInPrefList){
            getUserPreference(TypeId);
        }
        else {
            getSchedule(filterCriteria);
            //getAllRateCardData(criteriaObj);
        }
    }

    const getUserPreference = (TypeId, prefId) => {
        if(!prefId && selectedFilterId && isEditSearches){
            prefId = selectedFilterId;
        }
        setShowLoading(true);
        setOpenBackdrop(true);
        GetUserPreference(TypeId, leagueId).then((data) => {

            let defaultPref = null;
            if (prefId) {
                defaultPref = data && data.find(x => x.id === prefId);
            } else {
                defaultPref = data && data.length > 0 ? data[0] : null;
                if(data.length > 0) {
                    setSelectedFilterId(data[0].id);
                }
            }

            let prefJson = defaultPref ? JSON.parse(defaultPref.prefererJson) : getEmptyFilterCriteria();
            let clearFilterStatus = defaultPref ? true : false;
            setClearFilterStatus(clearFilterStatus);
            prefJson.LeagueId = leagueId;
            prefJson.TypeId = TypeId;
            prefJson.Id = defaultPref ? defaultPref.id : 0;
            prefJson.name = defaultPref?.name || '';
            prefJson.description = defaultPref?.description || '';
            prefJson["recordCount"] = recordCount;
            prefJson["recordStatus"] = recordStatus;
            setFilterCriteria(prefJson);
            setSavedSearchList(data);
            getSchedule(prefJson);
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
            // getUserPreference(TypeId);
            handleClearFilterClick(getEmptyFilterCriteria())
        }
    }

    const handleSavedSearchesChange = (id) => {
        setShowFilterPopup(false);
        setSelectedFilterId(id)
        getUserPreference(TypeId, id);
    }

    const showIndivisualTraffickLetter = (data) => {
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: false,
            traffickLetter: false,
            indTraffickLetter: true
        });
        setExpandIndTraffickLetter(true);
        setExpandSchedule(false);
        setExpendTraffickLetter(false);
        setExpandTrafficking(false);
        setExpendTraffickLetter(false);
        setSelectedScheduleId(data.id);
        setSelectedScheduleData(data);
    }


    const getTraffickLetter = data => {
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: false,
            traffickLetter: false,
            indTraffickLetter: true
        });
        setExpandIndTraffickLetter(true);
        setExpandSchedule(false);
        setExpendTraffickLetter(false);
        setExpendTraffickLetter(false);
        setSelectedScheduleId(data.id);
        setSelectedScheduleData(data);
    }

    const handleIndTraffickLetterClose = () => {
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: false,
            traffickLetter: false,
            indTraffickLetter: false
        });
        setExpandIndTraffickLetter(false);
        setExpandSchedule(true);
        setExpendTraffickLetter(false);
        setExpandTrafficking(false);
        setExpendTraffickLetter(false);
        setSelectedScheduleId("");
        setSelectedScheduleData("");
    }

    const handleExpandIndTraffickLetter = () => {
        setExpandSchedule(!expandSchedule);
        setExpandIndTraffickLetter(!expandIndTraffickLetter);
    }

    const handlerRecordCountChange = (value) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        setRecordCount(value.value);
        setRecordCountLabel(value.label);
        let tempFilterCriteria = filterCriteria;
        tempFilterCriteria["recordCount"] = value.value;
        setFilterCriteria(tempFilterCriteria);
        getSchedule(tempFilterCriteria);
    }

    const handleStatusChange = (name, value) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        setRecordStatus(value.value);
        setRecordStatusLabel(value.label);
        let tempFilterCriteria = filterCriteria;
        tempFilterCriteria["recordStatus"] = value.value;
        setFilterCriteria(tempFilterCriteria);
        getSchedule(tempFilterCriteria);
    }

    useEffect(()=>{
        setExpandSchedule(true);
        setExpandTrafficking(false);
        setSelectedScheduleId();
        setobjAccordionVisiblity({
            schedule: true,
            trafficking: false,
            traffickLetter: false,
            indTraffickLetter: false
        });
        setExpendTraffickLetter(false);
        if (FilterPreference && FilterPreference.length > 0) {
            let tId = FilterPreference.find(x => x.lookupText === "Programming").lookupId;
            setTypeId(tId)
            setFilterCriteria(prevState => ({
                ...prevState,
                LeagueId: leagueId,
                TypeId:tId,
                recordCount: recordCount,
                recordStatus: recordStatus,
                user: username,
            }));
            getUserPreference(tId, null);
        }
    }, [leagueId, FilterPreference])

    const editGlobalSearch = (data) => {
        let tempObj = {
            LeagueId: leagueId,
            TypeId: TypeId,
            Id: data.id,
            name: data.name,
            description: data.description || "",
        }
    
        let prefJson = JSON.parse(data.prefererJson);
        tempObj["asset"] = prefJson.asset;
        tempObj["country"] = prefJson.country;
        tempObj["endDate"] = prefJson.endDate;
        tempObj["startDate"] = prefJson.startDate;
        tempObj["mediaType"] = prefJson.mediaType;    
        tempObj["network"] = prefJson.network;
        tempObj["region"] = prefJson.region;
        setFilterCriteria(tempObj);
        setShowSavedSearchPopup(false);
        setSelectedFilterId(data.id);
        setIsEditSearhces(true);
        setShowFilterPopup(true);
    }

    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText="Schedule/Trafficking">
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

            {
                showFilterPopup ? <FiltersScreen handleFilterCloseClick={handleFilterCloseClick} notifySuccess={(msg) => notifySuccess(msg)}
                handleCriteriaChange={(criteria, addInPrefList) => handleSearchCriteriaChange(criteria, addInPrefList)}
                Criteria={filterCriteria} showLoading={(bool)=>setShowLoading(bool)} openBackdrop={(bool) => setOpenBackdrop(bool)}
                notifyWarning={(msg) => notifyWarning(msg)} isEditSearches={isEditSearches}
            />

            :

            props.page === "scheduling" && <Container maxWidth={false} disableGutters className={classes.container}>
                {objAccordionVisiblity.schedule && <AccordionHorizontal
                    resize={
                        (objAccordionVisiblity.schedule && objAccordionVisiblity.trafficking
                            && expandTrafficking && expandSchedule) ||
                        (objAccordionVisiblity.schedule && objAccordionVisiblity.scheduleMgmt
                            && expandScheduleManage && expandSchedule)
                    }
                    accordionTitle={"Scheduling"} Expanded={expandSchedule} handleExpand={setScheduleExpand}>

                    <ScheduleContainer handleTraffickingClick={handleTraffickingClick} selectedScheduleId={selectedScheduleId}
                        view={!(expandSchedule && expandTrafficking)} setFilterData={setFilterData}
                        rows={ScheduleRows} originalData={ScheduleOriginalRows} showIndivisualTraffickLetter={showIndivisualTraffickLetter}
                        refreshDataFromDB = {refreshDataFromDB} showTraffickLetter={showTraffickLetter}
                        filterCriteria={filterCriteria}
                        restrictedFields={restrictedFields}
                        recordCountLabel={recordCountLabel}
                        recordStatusLabel={recordStatusLabel}
                        handleStatusChange={handleStatusChange}
                        handlerRecordCountChange={handlerRecordCountChange}

                        setSearchItem={(val) => setSearchItemPlan(val)}
                        resetApplyLocalFilter={() => {
                            setApplyLocalFilterPlan(false);
                        }
                        }
                        applyLocalFilter={applyLocalFilterPlan}
                        searchItem={searchItemPlan}
                    />
                </AccordionHorizontal>}

                {objAccordionVisiblity.trafficking &&
                    <AccordionHorizontal addTraffickingClass={true} hideExpandButton={expandTrafficking}
                        resize={expandSchedule && expandTrafficking} accordionTitle={"Trafficking"} Expanded={expandTrafficking}
                        handleExpand={setTraffickingExpand}>
                        <TraffickingContainer selectedScheduleId={selectedScheduleId}
                            showTraffickLetter={getTraffickLetter}
                            view={!(expandSchedule && expandTrafficking && expandIndTraffickLetter)}
                            refreshPage={refreshPage}
                            selectedScheduleData={selectedScheduleData}
                            setFilterData={setTrafficingFilterData} rows={TraffickingRows}
                            originalData={TraffickingOriginalRows} />
                    </AccordionHorizontal>
                }

                {objAccordionVisiblity.traffickLetter &&
                    <AccordionHorizontal addTraffickingClass={true}
                        hideExpandButton={expandTraffickLetter}
                        resize={expandSchedule && expandTraffickLetter}
                        accordionTitle={"Traffic Letter"}
                        Expanded={expandTraffickLetter}
                        handleExpand={setTraffickLetterExpand}>
                        <TraffickLetterContainer
                            selectedScheduleData={selectedScheduleData}
                            selectedScheduleId={selectedScheduleId}
                            closeTraffickingLetter={closeTraffickingLetter}
                            refreshPage={refreshPage}
                        />
                    </AccordionHorizontal>
                }

                {objAccordionVisiblity.indTraffickLetter &&
                    <AccordionHorizontal addTraffickingClass={true}
                        hideExpandButton={expandIndTraffickLetter}
                        resize={expandSchedule && expandIndTraffickLetter}
                        accordionTitle={"Traffic Letter"}
                        Expanded={expandIndTraffickLetter}
                        handleExpand={handleExpandIndTraffickLetter}>
                        <TraffickLetterViewer handleClose={handleIndTraffickLetterClose}
                            isIndividualLetter={true} setShowLoading={(bool) => setShowLoading(bool)}
                            setOpenBackdrop={(bool) => setOpenBackdrop(bool)}
                            showCloseIcon={true} selectedScheduleId={selectedScheduleId}
                            selectedScheduleData={selectedScheduleData}
                        />
                    </AccordionHorizontal>
                }


            </Container>}

            {
                showLoading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <div className={'loader-div'}><div className={'loading'}></div></div>
                </Backdrop>
            }

            {showSavedSearchPopup && <SavedSearches data={savedSearchList}
                notifySuccess={notifySuccess} handleEditClick={editGlobalSearch}
                show={showSavedSearchPopup}
                handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
                handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                selectedFilterId={selectedFilterId}
                deleteSelectedFilter={() => setSelectedFilterId(0)}

            />}

        </React.Fragment>
    )
}

ProgrammingContainer.displayName = "ProgrammingContainer";

export default ProgrammingContainer;