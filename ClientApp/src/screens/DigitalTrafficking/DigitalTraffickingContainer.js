import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@mui/material/Backdrop';
import AppDataContext from '../../common/AppContext';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import DigitalTraffickingGrid from './Trafficking/DigitalTraffickingGrid';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import { ToastContainer, toast } from "react-toastify";
import { GetDigitalSchedule } from '../../services/trafficking.service';
import Helper from "../../common/Helper";

//start of Global Filter Export
import { GetUserPreference } from '../../services/common.service';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FiltersScreen from './Filter/FiltersScreen';
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";
import { DataSaverOff } from "@mui/icons-material";
//end of Global Filter Export

function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));

const DigitalTraffickingContainer = (props) => {
    const classes = useStyles();
    const { leagueId, username, FilterPreference } = useContext(AppDataContext);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [expandedDigitalList, setExpandPlanning] = useState(true);

    //start varibles declaration for global filter
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
    const [clearFilterStatus, setClearFilterStatus] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [savedSearchList, setSavedSearchList] = useState([]);
    const [selectedFilterId, setSelectedFilterId] = useState(0);
    const [TypeId, setTypeId] = useState();
    //end of global filter variable declaration

    const [showLoading, setShowLoading] = useState(false)
    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        showDigitalList: true,
    });
    const [searchItem, setSearchItem] = useState();
    const [applyLocalFilter, setApplyLocalFilter] = useState(false);

    const [edit, setEdit] = useState(false);
    const restrictedFields = [
        "countryId", "isTrafficked", "mediaTypeParentName", 
        "planId", "regionId", "statusId", "unitType", "unitTypeName", 
        "user", "id", "planId",
    ]

    const [rows, setRows] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [seasonStartDate, setSeasonStartDate] = useState();
    const [seasonEndDate, setSeasonEndDate] = useState();
    const [isEditSearch, setIsEditSearch] = useState(false);
    const setFilterData = (data) => setRows(data);

    const getDigitalSchedule = (criteria) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        let params = prepareRequestObect(criteria);
        GetDigitalSchedule(params).then(resp => {

            if(searchItem){
                setApplyLocalFilter(true);
                setRows(Helper.applyLocalFilter(searchItem, restrictedFields ,resp));
            } else {
                setApplyLocalFilter(false);
                setRows(resp);
            }
            
            setOriginalData(resp);
            setShowLoading(false);
            setOpenBackdrop(false);
            setSeasonStartDate(resp[0].seasonStartDate);
            setSeasonEndDate(resp[0].seasonEndDate);

        }).catch(err => {
            setRows([]);
            setOriginalData([]);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    const prepareRequestObect = (criteria, marketId) => {

        const obj = {
            LeagueId: leagueId,
            TypeId: criteria.TypeId || TypeId,
         //   marketId: marketId,
            marketTypeId: -1,
            user: username,
            status: 0,
            days: 0,
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
    
        if(criteria.name){
            obj["name"] = criteria.name
        }
        if(criteria.status){
            obj["status"] = criteria.status
        }
        if(criteria.days > 0){
            obj["days"] = criteria.days
        }
    
        return obj;
    }

    

    const splitUIHandler = () => { }

    //start global filter

    useEffect(() => {
        if (FilterPreference && FilterPreference.length > 0) {
            let tId = FilterPreference.find(x => x.lookupText === "DigitalPlan").lookupId;
            setTypeId(tId)
            setFilterCriteria(prevState => ({
              ...prevState,
              LeagueId: leagueId,
              TypeId: tId,
              status: 2,
              // recordCount: recordCount,
              // recordStatus: recordStatus,
              user: username,
            }));
            getUserPreference(tId, null);
        }

    }, [leagueId]);

    const getEmptyFilterCriteria = () => {

        return {
          LeagueId: leagueId,
          region: [],
          country: [],
          mediaType: 0,
          asset: [],
          days:0,
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
    }

    const handleFilterClick = () => {
        let tempFilters = {
          LeagueId: leagueId,
          region: [],
          country: [],
          mediaType: 0,
          asset: [],
          days:0,
          startDate: null,
          endDate: null,
          TypeId: TypeId,
          name: "",
          description: "",
          Id: 0,
          user: username
        };
        setEdit(false);
        setIsEditSearch(false);
        setFilterCriteria(tempFilters);
        setShowFilterPopup(true);
      }

    const handleClearFilterClick = () => {
        getDigitalSchedule(getEmptyFilterCriteria());
        setClearFilterStatus(false);
        setShowFilterPopup(false);
        setSelectedFilterId(0)
        setIsEditSearch(false);
        setFilterCriteria(getEmptyFilterCriteria());
        setEdit(false);
    }

    const handleFilterCloseClick = () => {
        setShowFilterPopup(false);
        setEdit(false);
        if (selectedFilterId) {
            getUserPreference(TypeId, selectedFilterId);
        } else {
            const clearedFilter = getEmptyFilterCriteria()
            setFilterCriteria(clearedFilter)
            getDigitalSchedule(clearedFilter);
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
            getDigitalSchedule(filterCriteria);
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
                if (data.length > 0) {
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
            setFilterCriteria(prefJson);
            setSavedSearchList(data);
            getDigitalSchedule(prefJson);
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
            handleClearFilterClick(getEmptyFilterCriteria())
        }
    }

    const callAPI = (name, value) => {
        let tempFilterCriteria = filterCriteria;
        tempFilterCriteria[name] = value.value;
        getDigitalSchedule(tempFilterCriteria);
        setFilterCriteria(tempFilterCriteria);

    }

    const handleSavedSearchesChange = (id) => {
        setShowFilterPopup(false);
        setSelectedFilterId(id)
        getUserPreference(TypeId, id);
    }
    const handleEditClick = (item,IsEdit) => {
        console.log(item)
        setEdit(true);
        let data = JSON.parse(item.prefererJson)
        console.log(data)
        let tempFilters = {
        LeagueId: leagueId,
        region: data.region,
        country: data.country,
        mediaType: data.mediaType,
        asset:data.asset,
        days: data.days,
        startDate: data.startDate,
        endDate: data.endDate,
        TypeId: item.TypeId,
        name: item.name,
        description: item.description || "",
        Id: item.id,
        user: username
      };
  
      setShowFilterPopup(true);
      setFilterCriteria(tempFilters);
      setIsEditSearch(true);
      setSelectedFilterId(item.id);
      setShowSavedSearchPopup(false);
    }

    // End of Global Filter

    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText={"Digital Trafficking"}
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
            {
                showFilterPopup ? <FiltersScreen isSchedulePlan={true} handleFilterCloseClick={handleFilterCloseClick} notifySuccess={(msg) => notifySuccess(msg)}
                    handleCriteriaChange={(criteria, addInPrefList) => handleSearchCriteriaChange(criteria, addInPrefList)}
                    Criteria={filterCriteria} showLoading={(bool) => setShowLoading(bool)} openBackdrop={(bool) => setOpenBackdrop(bool)}
                    notifyWarning={(msg) => notifyWarning(msg)} seasonStartDateDefault = {seasonStartDate} seasonEndDateDefault = {seasonEndDate} edit = {edit}
                />

                    :

                    props.page === "digitalTrafficking" ? <Container maxWidth={false} disableGutters className={classes.container}>
                        {
                            AccordionVisiblity.showDigitalList && <AccordionHorizontal
                                displayName="Digital Trafficking"
                                accordionTitle={"Digital Trafficking"} Expanded={expandedDigitalList}
                                handleExpand={() => { return false; }}
                            >
                                <DigitalTraffickingGrid
                                    setSearchItem={(val) => setSearchItem(val)}
                                    resetApplyLocalFilter={()=> {
                                            setApplyLocalFilter(false);
                                        }
                                    }
                                    applyLocalFilter={applyLocalFilter}
                                    rows={rows} filterCriteria={filterCriteria}
                                    originalData={originalData}
                                    setShowLoading={setShowLoading} setOpenBackdrop={setOpenBackdrop}
                                    refreshList={()=>{getDigitalSchedule(filterCriteria)}}
                                    setFilterData={setFilterData} callAPI={callAPI}
                                    restrictedFields={restrictedFields}
                                    splitUIHandler={(action, editData) => splitUIHandler(action, editData)}
                                    notifySuccess={(msg) => notifySuccess(msg)} notifyWarning={(msg) => notifyWarning(msg)}

                                />

                            </AccordionHorizontal>
                        }

                        {
                            showLoading ? <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={openBackdrop}
                            >
                                <div className={'loader-div'}><div className={'loading'}></div></div>
                            </Backdrop> : null
                        }


                    </Container> : null
            }

            {showSavedSearchPopup && <SavedSearches data={savedSearchList}
                notifySuccess={notifySuccess}
                show={showSavedSearchPopup}
                handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
                handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                selectedFilterId={selectedFilterId}
                handleEditClick ={handleEditClick}
                deleteSelectedFilter={() => setSelectedFilterId(0)}

            />}

        </React.Fragment>
    )
}

DigitalTraffickingContainer.displayName = "DigitalTraffickingContainer";
export default DigitalTraffickingContainer;