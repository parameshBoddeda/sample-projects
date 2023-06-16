import React, { useContext, useEffect, useState } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import SubHeader from "../../../sharedComponents/SubHeader/SubHeader";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import AccordionHorizontal from "../../../sharedComponents/HorizontalAccordion/AccordionWrapper";
import CopySchedulesList from "./CopySchedulesList";
import AppDataContext from "../../../common/AppContext";
import { GetCopyPlanSchedulesList } from "../../../services/planning.service";

import PlannedUnitsContainer from "./PlannedUnits/PlannedUnitsContainer";
import Helper from "../../../common/Helper";
import { ROLE, CLAIMS } from "../../../common/AppConstants";

import FiltersScreen from '../../Programming/Filter/ProgrammingFiltersScreen';
import SavedSearches from "../../../sharedComponents/SavedSearches/SavedSearches";
import { GetUserPreference } from './../../../services/common.service';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import * as AppLanguage from '../../../common/AppLanguage';

function notifyWarning(message) {
  toast.warning(message);
}
function notifySuccess(message) { toast.success(message) }

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    display: "flex !important",
  },
}));

const CopyPlanSchedulesContainer = (props) => {
  const classes = useStyles();
  const [showLoading, setShowLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [accordionVisiblity, setAccordionVisiblity] = React.useState({
    schedulesList: true,
    plannedUnit: false,
  });

  const [applyLocalFilter, setApplyLocalFilter] = useState(false);
  const [searchItem, setSearchItem] = useState();

  const [expandScheduleList, setExpandScheduleList] = React.useState(true);
  const [expandScheduleManage, setExpandScheduleManage] = React.useState(true);
  const [expandPlannedUnits, setExpandPlannedUnits] = React.useState(false);

  const [selectedScheduleId, setSelectedScheduleId] = React.useState();
  const [selectedScheduleData, setSelectedScheduleData] = React.useState();
  const { leagueId, username, FilterPreference } = useContext(AppDataContext);
  const [allSchedulesData, setAllSchedulesData] = useState([]);
  const [allSchedulesOriginalData, setAllSchedulesOriginalData] = useState([]);
  const [planTypeValue, setPlanTypeValue] = useState(null);
  const [ros, setRos] = useState("");

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
  const [clearFilterStatus, setClearFilterStatus] = useState(false);
  const [recordStatus, setRecordStatus] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [savedSearchList, setSavedSearchList] = useState([]);
  const [selectedFilterId, setSelectedFilterId] = useState(0);
  const [TypeId, setTypeId] = useState();
  const [isEditSearches, setIsEditSearches] = useState(false)

  //
  const { userPermissions, baseURL, userId, userClaims } =
    useContext(AppDataContext);
  const GetUserRole = () => {
    let result = !userPermissions
      ? ""
      : userPermissions
          .filter((p) => p.key === "Role")
          .map((x) => x.value)
          .shift();
    return result;
  };

  const CheckRole = (claimedRole) => {
    return Helper.CheckRole(GetUserRole(), claimedRole);
  };

  const CheckClaim = (permission) => {
    return Helper.CheckClaim(GetUserRole(), userClaims, permission);
  };

  //
  const handleScheduleExpand = () => {
    if (!selectedScheduleId) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_validation.replace("__FieldName__", "any schedule to proceed"));
      return false;
    }
    if (!expandScheduleList) {
      setExpandPlannedUnits(false);
    } else {
      setExpandPlannedUnits(true);
    }
    setExpandScheduleList(!expandScheduleList);
  };

  const handlePlannedUnitsExpand = () => {
    if (!selectedScheduleId) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_validation.replace("__FieldName__", "any schedule to proceed"));
      return false;
    }
    if (!expandPlannedUnits) {
      setExpandScheduleList(false);
    } else {
      setExpandScheduleList(true);
    }
    setExpandPlannedUnits(!expandPlannedUnits);
  };

  const prepareRequestObect = (criteria, marketId) => {
    let planType=1;
    if (CheckRole(ROLE.ADMIN) )
        planType = 1;
    else if ( CheckRole(ROLE.CAMPAIGN_PLANNER) && CheckClaim(CLAIMS.ManageCampaignPlanning) )
      planType = 1;

    setPlanTypeValue(planType);

    const obj = {
        LeagueId: leagueId,
        TypeId: criteria.TypeId || TypeId,
        marketId: marketId,
        marketTypeId: -1,
        planType: planType,

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

    

    if(criteria.name){
        obj["name"] = criteria.name
    }
    return obj;
}

  const getSchedule = (criteria) => {
    setShowLoading(true);
    setOpenBackdrop(true);

    // let planType=1;
    // if (CheckRole(ROLE.ADMIN) )
    //     planType = 1;
    // else if ( CheckRole(ROLE.CAMPAIGN_PLANNER) && CheckClaim(CLAIMS.ManageCampaignPlanning) )
    //   planType = 1;
    // //else if (
    // //    CheckRole(ROLE.SALES_PLANNER) &&
    // //  CheckClaim(CLAIMS.ManagePlanSchedule)
    // //)
    // //  planType = 2;

    

    let params = prepareRequestObect(criteria);

    GetCopyPlanSchedulesList(params)
      .then((scheduleData) => {
        if(searchItem){
          setApplyLocalFilter(true);
      }
        setShowLoading(false);
        setOpenBackdrop(false);
        setAllSchedulesData(scheduleData);
        setAllSchedulesOriginalData(scheduleData);
      })
      .catch((err) => {
        setShowLoading(false);
        setOpenBackdrop(false);
      });
  };

  const handleCopySchedule = (data) => {
    setAccordionVisiblity({
      schedulesList: true,
      plannedUnit: true,
    });
    // setScheduleRows(ScheduleOriginalRows);
    setExpandScheduleList(false);
    setExpandPlannedUnits(true);
    setSelectedScheduleId(data.id);
    setSelectedScheduleData(data);
    setRos(data ? data.isROS : "");
  };

  // Start of Global Filter Implementation

  const getEmptyFilterCriteria = () => {

    return {
      LeagueId: leagueId,
      //recordCount: recordCount,
      //recordStatus: recordStatus,
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
    setIsEditSearches(false);
  }

  const handleFilterClick = () => {
    setIsEditSearches(false);
    let tempFilters = {
      LeagueId: leagueId,
      //recordCount: recordCount,
      //recordStatus: recordStatus,
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
    setShowFilterPopup(true);
  }

  const handleClearFilterClick = () => {
    setIsEditSearches(false);
    //getAllRateCardData(getEmptyFilterCriteria());
    getSchedule(getEmptyFilterCriteria());
    setClearFilterStatus(false);
    setShowFilterPopup(false);
    setSelectedFilterId(0)
    setFilterCriteria(getEmptyFilterCriteria());
  }

  const handleFilterCloseClick = () => {
    setIsEditSearches(false);
    setShowFilterPopup(false);
    if (selectedFilterId) {
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
    // criteriaObj["recordCount"] = recordCount;
    // criteriaObj["recordStatus"] = recordStatus;
    setFilterCriteria(criteriaObj);
    setShowFilterPopup(false);
    setClearFilterStatus(true);
    if (addInPrefList) {
      getUserPreference(TypeId);
    }
    else {
      getSchedule(filterCriteria);
      //getAllRateCardData(criteriaObj);
    }
  }

  const getUserPreference = (TypeId, prefId) => {
    setShowLoading(true);
    setOpenBackdrop(true);
    if(!prefId && selectedFilterId && isEditSearches){
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
      // prefJson["recordCount"] = recordCount;
      // prefJson["recordStatus"] = recordStatus;
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

  // End of Global Filter

  

  // const refreshPage = (trafficked) => {
  //     let tempSelectedScheduleData = selectedScheduleData;
  //     tempSelectedScheduleData.isTrafficked = trafficked;
  //     setSelectedScheduleData(tempSelectedScheduleData);
  //     getSchedule(leagueId);
  // }

  useEffect(() => {
    //getSchedule(leagueId);
    if (FilterPreference && FilterPreference.length > 0) {
      let tId = FilterPreference.find(x => x.lookupText === "PlanSchedule").lookupId;
      setTypeId(tId)
      setFilterCriteria(prevState => ({
        ...prevState,
        LeagueId: leagueId,
        TypeId: tId,
        // recordCount: recordCount,
        // recordStatus: recordStatus,
        user: username,
      }));
      getUserPreference(tId, null);
      setExpandScheduleList(true);
      setExpandPlannedUnits(false);
      setSelectedScheduleId();
      setAccordionVisiblity({
        schedulesList: true,
        plannedUnit: false,
      });
    }
  }, [leagueId]);

  const editGlobalSearch = (data) => {
    setIsEditSearches(true);
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
    setSelectedFilterId(data.id)
    setShowFilterPopup(true);
  }

  const setFilterData = (filterData) => setAllSchedulesData(filterData);

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <SubHeader headerText={"PLAN SCHEDULES"}>
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
          notifyWarning={(msg) => notifyWarning(msg)} isEditSearches={isEditSearches}
        />

          :

          props.page === "copyPlanSchedules" && (
            <Container
              maxWidth={false}
              disableGutters
              className={classes.container}
            >
              {accordionVisiblity.schedulesList && (
                <AccordionHorizontal
                  resize={
                    accordionVisiblity.schedulesList &&
                    accordionVisiblity.plannedUnit &&
                    expandPlannedUnits &&
                    expandScheduleList
                  }
                  accordionTitle={"Schedules"}
                  Expanded={expandScheduleList}
                  handleExpand={handleScheduleExpand}
                >
                  <CopySchedulesList
                    view={!(expandScheduleList && expandPlannedUnits)}
                    rows={allSchedulesData}
                    filterCriteria={filterCriteria}
                    originalData={allSchedulesOriginalData}
                    handleCopySchedule={handleCopySchedule}
                    setFilterData={setFilterData}
                    setSearchItem={(val) => setSearchItem(val)}
                    resetApplyLocalFilter={() => {
                      setApplyLocalFilter(false);
                    }
                    }
                    applyLocalFilter={applyLocalFilter}
                    searchItem={searchItem}
                  />
                </AccordionHorizontal>
              )}

              {accordionVisiblity.plannedUnit && (
                <AccordionHorizontal
                  addTraffickingClass={true}
                  hideExpandButton={false}
                  resize={expandScheduleList && expandPlannedUnits}
                  accordionTitle={"Planned Units"}
                  Expanded={expandPlannedUnits}
                  handleExpand={handlePlannedUnitsExpand}
                >
                  <PlannedUnitsContainer
                    setShowLoading={(value) => setShowLoading(value)}
                    setOpenBackdrop={(value) => setOpenBackdrop(value)}
                    selectedScheduleId={selectedScheduleId}
                    view={!(expandScheduleList && expandPlannedUnits)}
                    selectedScheduleData={selectedScheduleData}
                    planTypeValue={planTypeValue}
                    ros={ros}
                  />
                </AccordionHorizontal>
              )}
            </Container>
          )
      }

      {showLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <div className={'loader-div'}><div className={'loading'}></div></div>
        </Backdrop>
      )}

      {showSavedSearchPopup && <SavedSearches data={savedSearchList}
        notifySuccess={notifySuccess} handleEditClick={editGlobalSearch}
        show={showSavedSearchPopup}
        handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
        handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
        selectedFilterId={selectedFilterId}
        deleteSelectedFilter={() => setSelectedFilterId(0)}

      />}

    </React.Fragment>
  );
};

export default CopyPlanSchedulesContainer;
