// Global Imports - Start
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Grid,
  TextField,
  FormControlLabel,
  Button,
  Typography,
  Checkbox,
  Divider,
} from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DateRangePicker from "../../../sharedComponents/PickDateRange/PickDateRange";
import {
  GetMediaPlanMedium,
  SaveMediaPlanMedium,
} from "../../../services/planning.service";
import { styled } from "@mui/material/styles";

// Global Imports - End
// Local Imports - Start
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import { MEDIA_PALN_STATUS_IDS, MEDIA_PALN_STATUS_NAMES, ROLE } from "../../../common/AppConstants";
import Helper from "../../../common/Helper";
import {
  GetLookupById,
  GetUsersListByRole,
} from "../../../services/common.service";

import AppDataContext from "../../../common/AppContext";
import Dropdown from "../../../sharedComponents/Dropdown/Dropdown";
import {
  SaveMediaPlan,
  ChangeSalesMediaPlanUnitsStatus,
  ConfirmSalesMediaPlan
} from "../../../services/planning.service";
import MultiSelectDropdown from "../../../sharedComponents/Dropdown/MulltiSelectDropdown";
import PickDate from "../../../sharedComponents/PickDate/PickDate";

import ChipsList from "../../../sharedComponents/chips/ChipsList";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DrawerComponent from "../../../sharedComponents/Drawer/DrawerComponent";
import ErrorDetails from "./ErrorDetails";
// Local Imports - End
//const { username, userId } = useContext(AppDataContext);

if (typeof window !== "undefined") {
  injectStyle();
}
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  radioGroupPadding: {
    paddingBottom: theme.spacing(1),
  },
  contentHeight: {
    height: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  Alert: {
    margin: theme.spacing(1),
  },
  spliUnitHeader: {
    backgroundColor: "#f8f8f8",
  },
  units: {
    height: theme.spacing(6),
    marginTop: theme.spacing(1.5),
  },
  unitGrid: {
    height: theme.spacing(24),
    overflowY: "scroll",
  },
  comments: {
    width: "-webkit-fill-available",
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: "50%",
      // margin: "50px 0 0 0px",
      padding: theme.spacing(0, 1),
    },
  },  
}));
const AddPlan = (props) => {
  let { data } = props;

 
  const classes = useStyles();
  const { MediaPlanStatus, username, userId, leagueInfo, leagueId } = useContext(AppDataContext);

  const [planName, setPlanName] = useState(
    data.planName ? data.planName : null
  );
  const [planVersion, setPlanVersion] = useState(
    data.version ? data.version : null
  );
  const [mediaName, setMediaName] = useState(null);
  const [mediaValue, setMediaValue] = useState(null);
  const [statusName, setStatusName] = useState(null);
  const [statusValue, setStatusValue] = useState(
    data.status ? data.status : null
  );
  const [billByValue, setBillByValue] = useState(
    data.billById ? data.billById : null
  );
  const [billByName, setBillByName] = useState(
    data.billByName ? data.billByName : null
  );
  const [soldByValue, setSoldByValue] = useState(
    data.soldBy ? data.soldBy : null
  );
  const [soldByName, setSoldByName] = useState(
    data.soldBy ? data.soldBy : null
  );
  const [billTypeValue, setBillTypeValue] = useState(
    data.billTypeId ? data.billTypeId : null
  );
  const [billTypeName, setBillTypeName] = useState(
    data.billTypeName ? data.billTypeName : null
  );

  const [isPrimaryVersion, setIsPrimaryVersion] = useState(
    data.primaryFlag ? data.primaryFlag : props.planAction === "Add"
  );

  const [comments, setComments] = useState(data.comments ? data.comments : "");
  const [planMediaAE, setPlanMediaAE] = useState(null);
  const [planStatus, setPlanStatus] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [editVersion, setEditVersion] = useState(
    props.planAction === "Edit" ? true : false
  );
  const [versionChanged, setVersionChanged] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [mediumList, setMediumList] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [selectedMediumStartDate, setSelectedMediumStartDate] = useState(null);
  const [selectedMediumEndDate, setSelectedMediumEndDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMediumId, setSelectedMediumId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [errorDetails,setErrorDetails] = useState([]);
  const [currentStatus,setCurrentStatus] = useState(null)
  const [currentId,setCurrentId] = useState(null);
  const [currentList, setCurrentList] = useState([]);


  const handleDetails = (value) => {
    setShowDetails(value);
  };

 

  useEffect(()=>{
    if (props.planAction === "Add"){
      getStatusData('');
    }
  },[MediaPlanStatus]);

  useEffect(() => {
    //getStatusData();
    getMediaAEData();
    
  }, []);


  useEffect(() => {
    props.showLoading(true);
    props.openBackdrop(true);

    GetMediaPlanMedium(props.planId)
      .then((data) => {
        if (data) {
          setMediumList(data);
          props.showLoading(false);
          props.openBackdrop(false);
        }
      })
      .catch((err) => console.log(err));

     
  }, [props.planId]);

  useEffect(() => {
    let { data } = props;
    if (data) {
      if (props.planAction === "Edit") {
        setEditVersion(true);
        setPlanName(data.planName ? data.planName : null);
        setPlanVersion(data.version ? data.version : null);
        //setPlanStatus(data.status);
        if (data.mediaAE) {
          let temp = JSON.parse(data.mediaAE);
          let mediaAEData = [];
          temp.map((item) => {
            mediaAEData.push({ label: item.UserName, value: item.UserId });
          });
          setMediaList(mediaAEData);
        }

        //let statusVal = returnDropdownData("label", data.status, statusData);
        //if (statusVal) setStatusValue(statusVal);
        if (data.comments == null) setComments("");
        else setComments(data.comments);
        getStatusData(data.status);
      } else {
        setComments("");
        setPlanName("");
        setPlanVersion(1);
        setBillByName("NBA");
        setBillTypeName("Contractual");
        setBillByValue(311);
        setBillTypeValue(251);
        setMediaName(null);
        //setPlanStatus(null);
        setEditVersion(false);
      }
      if (props.startDate) {
        setSelectedStartDate(Helper.FormatToIsoDate(props.startDate));
      }

      if (props.endDate) {
        setSelectedEndDate(Helper.FormatToIsoDate(props.endDate));
      }

   
    }
  }, [props.data]);

  //Helper function to handle Dropdown default value
  const returnDropdownData = (key, val, arrData) => {
    let response;
    arrData.map((item) => {
      if (item[`${key}`] == val) {
        response = item.value;
      }
    });
    return response;
  };
  // Notification helpers
  function notifySuccess(message) {
    toast.success(message);
  }
  function notifyWarning(message) {
    toast.warning(message);
  }
  function notifyError(msg) {
    toast.error(msg);
  }

  const insertMediaPlan = (obj) => {
    props.showLoading(true);
    props.openBackdrop(true);
    SaveMediaPlan(obj)
      .then((res) => {
        if (res > 0) {
            notifySuccess("Media Plan saved successfully");
            props.callApiToRefreshGridData();
            props.handleClose();
        } else if (res === -1) {
          notifyWarning(
            "Some of the schedules are already trafficked. Can't change the status to Cancelled."
          );
        } else {
          notifyWarning("Media Plan already exists. Please try something else");
        }

        props.showLoading(false);
        props.openBackdrop(false);
      })
      .catch((err) => {
        props.showLoading(false);
        props.openBackdrop(false);
        console.log(err);
      });
  };

  const UpdateUnitStatus = (id) => {
    props.showLoading(true);
    props.openBackdrop(true);
    ChangeSalesMediaPlanUnitsStatus(id, statusValue, username)
      .then((data) => {
        props.showLoading(false);
        props.openBackdrop(false);
        notifySuccess("Media Plan saved successfully");
        props.callApiToRefreshGridData();
        props.handleClose();
        //nothing todo here.
      })
      .catch((err) => {
        props.showLoading(false);
        props.openBackdrop(false);
        console.log(err);
      });
  };

  //.....Dropdown data handlers - Start
  const getStatusData = (status) => {
    let statusList = [];
    if(!status || status === ''){
      status = MEDIA_PALN_STATUS_NAMES.WorkingInternal;
      statusList = [MEDIA_PALN_STATUS_NAMES.WorkingInternal];
    }
    else if (status === MEDIA_PALN_STATUS_NAMES.WorkingInternal){
      statusList = [MEDIA_PALN_STATUS_NAMES.WorkingInternal, MEDIA_PALN_STATUS_NAMES.Proposed, MEDIA_PALN_STATUS_NAMES.Cancelled]
    }
    else if (status === MEDIA_PALN_STATUS_NAMES.Proposed) {
      statusList = [MEDIA_PALN_STATUS_NAMES.WorkingInternal, MEDIA_PALN_STATUS_NAMES.Proposed, MEDIA_PALN_STATUS_NAMES.PendingConfirm, MEDIA_PALN_STATUS_NAMES.Cancelled]
    }
    else if (status === MEDIA_PALN_STATUS_NAMES.PendingConfirm) {
      statusList = [MEDIA_PALN_STATUS_NAMES.PendingConfirm, MEDIA_PALN_STATUS_NAMES.Confirmed, MEDIA_PALN_STATUS_NAMES.Cancelled]
    }
    else if (status === MEDIA_PALN_STATUS_NAMES.Confirmed) {
      statusList = [MEDIA_PALN_STATUS_NAMES.PendingConfirm, MEDIA_PALN_STATUS_NAMES.Confirmed, MEDIA_PALN_STATUS_NAMES.Cancelled]
    }
    
    let statusOptions = statusList.map((name)=>{
      return MediaPlanStatus.find(x=> x.label === name);
    });
    setStatusData(statusOptions);

    setPlanStatus(status);
    let statusVal = MediaPlanStatus.find(x=> x.label === status).value;
    if (statusVal) setStatusValue(statusVal);
  };

  const getMediaAEData = () => {
    let id = -1;
    GetUsersListByRole(ROLE.MEDIA_AE)
      .then((data) => {
        let mediumData = [];
        data.map((item) => {
          mediumData.push({
            label: item.fullName,
            value: item.loginId,
            loginId: item.email,
          });
        });
        setMediaData(mediumData);
      })
      .catch((err) => console.log(err));
  };

  //.....Dropdown data handlers - End

  //Form Input Handlers - Start
  const handlePlanName = (e) => {
    setPlanName(e.target.value);
  };

  const handlePlanVersion = (e) => {
    setPlanVersion(e.target.value);
  };

  const handleMediaAE = (name, value) => {
    let temp = mediaList.slice();
    let index = temp.findIndex((t) => t.value === value.value);
    if (index == -1) {
      var obj = { value: value.value, label: value.label };
      temp.push(obj);
      setMediaList(temp);
    }
  };

  const handleDelete = (name, value) => {
    if (name === "media") {
      let temp = mediaList.slice();
      let index = temp.findIndex((t) => t.label === value);
      temp.splice(index, 1);
      setMediaList(temp);
    }
  };

  const handleStatus = (name, value) => {
    setStatusValue(value.value);
    setStatusName(value.label);
    setPlanStatus(value.label);
  };

  const handleComments = (e) => {
    setComments(e.target.value);
  };

  const handleBillByChange = (name, value) => {
    setBillByValue(value.value);
    setBillByName(value.label);
  };

  const handleSoldByChange = (name, value) => {
    setSoldByValue(value.value);
    setSoldByName(value.label);
  };

  const handleBillTypeChange = (name, value) => {
    setBillTypeValue(value.value);
    setBillTypeName(value.label);
  };

  const handleCloneClick = () => {
    let versions = props.allPlansData
      .filter((x) => x.planName === planName)
      .map((y) => y.version);
    let maxV = Math.max(...versions);
    setPlanVersion(maxV + 1);
    setVersionChanged(true);
    setEditVersion(!editVersion);
    getStatusData('')
  };

  const handlePrimaryFlagChange = () => {
    setIsPrimaryVersion(!isPrimaryVersion);
  };

  const getErrorDetails = ()=>{    
    props.showLoading(true);
    props.openBackdrop(true);

    ConfirmSalesMediaPlan(props.planId)
    .then((data) => {      
      if(!data.status){
        setShowDetails(true)
        setErrorDetails(JSON.parse(data.data))
        setCurrentStatus(data.status)
      }
      else{
        notifySuccess("Media Plan confirmed successfully");
        props.callApiToRefreshGridData();
        props.handleClose();
      }
      props.showLoading(false);
      props.openBackdrop(false);
    })
    .catch((err) => console.log(err));
  }

  const handleSubmit = (param) => {
    if (param === "cancel") {
      props.handleClose();
    } else if (param === "submit") {
     
      if (
        planName.replace(/\s+/g, "").length == 0 ||
        planName === "" ||
        planName === undefined ||
        planName === null
      ) {
        notifyWarning("Plan name cannot be empty");
        return;
      }

      if (
        props.planAction === "Add" &&
        props.allPlansData.filter((x) => x.planName === planName).length > 0
      ) {
        notifyWarning("Plan name already exist.");
        return;
      }

      if (
        planVersion === "" ||
        planVersion === undefined ||
        planVersion === null
      ) {
        notifyWarning("Version cannot be empty for a Plan");
        return;
      }
      if (planVersion <= 0) {
        notifyWarning("Version cannot be Zero or Negative");
        return;
      }

      if (mediaList.length === 0) {
        notifyWarning("Please Select MediaAE");
        return;
      }

      if (
        statusValue === "" ||
        statusValue === undefined ||
        statusValue === null
      ) {
        notifyWarning("Please Select Status");
        return;
      }
      
      if (!props.planningRawData.year) {
        notifyError(
          "There is some issue with the year value in the data of this media plan."
        );
        return;
      }

      
      if (selectedStartDate === "") {
        notifyWarning("Please select plan start date");
        return;
      }

      if (selectedEndDate === "") {
        notifyWarning("Please select plan end date");
        return;
      }

      if (props.planAction === "Edit" && props.data.status !== MEDIA_PALN_STATUS_NAMES.Confirmed && props.data.status !== MEDIA_PALN_STATUS_NAMES.PendingConfirm
          && planStatus === MEDIA_PALN_STATUS_NAMES.PendingConfirm && !isPrimaryVersion) {
          notifyError("Please select Mark As Primary checkbox.");
          return;
      }

      if (props.planAction === "Edit" && props.data.status !== MEDIA_PALN_STATUS_NAMES.Confirmed && props.data.status !== MEDIA_PALN_STATUS_NAMES.PendingConfirm 
          && planStatus === MEDIA_PALN_STATUS_NAMES.PendingConfirm) {
        getErrorDetails();
        return;
      }

      let mediaAEPostData = [];
      mediaList.map((item) => {
        mediaAEPostData.push({ UserName: item.label, UserId: item.value });
      });

   
      if( new Date(selectedStartDate)< new Date(Helper.FormatToIsoDate(props.seasonStartDate))||new Date(selectedEndDate)>new Date(Helper.FormatToIsoDate(props.seasonEndDate))){
        notifyWarning("Start and end date must be between Plan start and end date");
        return;
      }

      let reqObj = {
        id:
          props.planAction === "Add"
            ? -1
            : !editVersion
            ? -1 * props.planId
            : props.planId, //-1 for insert else update
        planMasterId: props.planAction === "Add" ? -1 : props.data.planMasterId,
        planName: planName,
        version: planVersion,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        mediaAE: mediaAEPostData,
        status: statusValue,
        comments: comments,
        campaignOrAdvertiserId: props.planningRawData.dealId,
        year: props?.planningRawData?.year,
        billById: billByValue ?? 0,
        billTypeId: billTypeValue ?? 0,
        soldBy: soldByValue ?? "",
        leagueId: leagueId,
        primaryFlag: isPrimaryVersion,
      };
      // console.log(reqObj)
      insertMediaPlan(reqObj);
    }
  };
  //Form Input Handlers - End

  const handleDateSave = (id, task) => {
    if (task === "cancel") {
      setIsEditing(false);
     
      setMediumList(currentList);
      return;
    }

    if (task === "save") {
      if (!selectedMediumStartDate) {
        notifyWarning("Please select media start date");
        return;
      }

      if (!selectedMediumEndDate) {
        notifyWarning("Please select media end date");
        return;
      }

      if (new Date(selectedMediumStartDate) < new Date(selectedStartDate)) {
        notifyWarning("Media start date cannot be less than plan start date");
        return;
      }

      if (new Date(selectedMediumEndDate) > new Date(selectedEndDate)) {
        notifyWarning("Media end date cannot be more than plan end date");

        return;
      }

      let obj = {
        id: selectedMediumId,
        startDate: selectedMediumStartDate,
        endDate: selectedMediumEndDate,
        user: username,
      };
      props.showLoading(true);
      props.openBackdrop(true);
      SaveMediaPlanMedium(obj)
        .then((data) => {
          props.showLoading(false);
          props.openBackdrop(false);
          notifySuccess("Date saved successfully");
          props.callApiToRefreshGridData();
          //   props.handleClose();
        })
        .catch((err) => {
          props.showLoading(false);
          props.openBackdrop(false);
          console.log(err);
        });
    }
    setCurrentId(null);
  };

  const handleDateUpdate = (item) => {
   
    setCurrentId(item.id);

    setCurrentList([...mediumList]);
    setSelectedMediumStartDate(Helper.FormatToIsoDate(item.startDate));

    setSelectedMediumEndDate(Helper.FormatToIsoDate(item.endDate));

    setSelectedMediumId(item.id);
    setIsEditing(true);
  };


  const setStartDate = (value) => {
    setSelectedStartDate(Helper.FormatToIsoDate(value));
  };

  const setEndDate = (value) => {
    setSelectedEndDate(Helper.FormatToIsoDate(value));
  };

 
  const setMediumStartDate = (value) => {
   
    
    let updatedList = mediumList.map((item) => {
      if (item.id === currentId) {
        return { ...item, startDate: Helper.FormatToIsoDate(value) };
      }

      return item;
    });
    setMediumList(updatedList);
    setSelectedMediumStartDate(Helper.FormatToIsoDate(value));
  };

  const setMediumEndDate = (value) => {
   

    let updatedList = mediumList.map((item) => {
      if (item.id === currentId) {
        return { ...item, endDate: Helper.FormatToIsoDate(value) };
      }

      return item;
    });

    setMediumList(updatedList);
    setSelectedMediumEndDate(Helper.FormatToIsoDate(value));
  };

  const Root = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    "& > :not(style) + :not(style)": {
      marginTop: theme.spacing(1),
    },
  }));

  return (
    <>
      {/* <ToastContainer autoClose={3000} /> */}
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <IconButton
                title={`${props.planAction} Media Plan`}
                size="small"
                color="secondary"
              >
                <LocalOfferOutlinedIcon />
              </IconButton>
              <GridHeader
                hideExpendIcon={props.hideExpendIcon}
                fullwidth={true}
                hideCheckbox={true}
                headerText={`${props.planAction} Media Plan`}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" flex="1" ml={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <Typography variant="subtitle2" color="secondary">
              Plan Header
            </Typography>{" "}
          </Grid>
          <Grid item xs={10}>
            <Divider sx={{ width: "100%" }}></Divider>
          </Grid>
        </Grid>
      </Box>
      {/* <Divider textAlign="left">Plan Header</Divider> */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        p={1.5}
        className={classes.contentHeight}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={6}>
            <Box component="div">
              <TextField
                id="mediaPlanName"
                size="small"
                variant="outlined"
                type="text"
                label="Media Plan Name"
                fullWidth
                value={planName}
                onChange={handlePlanName}
              />
            </Box>
          </Grid>
          <Grid item xs={6}></Grid>

          <Grid item xs={4}>
            {/* <MultiSelectDropdown name="media" size="small" SMwidth="400" fullWidth lbldropdown="Media AE"
                                ddData={mediaData.length ? mediaData : []}
                                handleChange={handleMediaAE}
                                id="media"
                                value={mediaName}
                            /> */}
            <MultiSelectDropdown
              size="small"
              id="media"
              name="media"
              variant="outlined"
              // showLabel={true}
              lbldropdown="Media AE"
              value={mediaName}
              handleChange={handleMediaAE}
              ddData={mediaData ? mediaData : []}
            />

            {/* <Dropdown size="small" id="media" variant="outlined" showLabel={true} lbldropdown="Media AE" value={mediaName} handleChange={handleMediaAE} ddData={mediaData ? mediaData : []} /> */}
          </Grid>
          <Grid item xs={8}>
            {mediaList.length > 0 && (
              <ChipsList
                name="media"
                handleDelete={handleDelete}
                showDelete={true}
                className="chips"
                label=""
                data={mediaList}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <Dropdown
              size="small"
              id="status"
              variant="outlined"
              showLabel={true}
              lbldropdown="Status"
              value={planStatus}
              handleChange={handleStatus}
              ddData={statusData ? statusData : []}
            />
          </Grid>
          <Grid item xs={6}>
            <Dropdown
              size="small"
              id="billType"
              handleChange={handleBillTypeChange}
              variant="outlined"
              showLabel={true}
              lbldropdown="Bill Type"
              ddData={props.Billtype ? props.Billtype : []}
              value={billTypeName}
              name="billType"
            />
          </Grid>
          <Grid item xs={6}>
            <Dropdown
              size="small"
              id="billby"
              handleChange={handleBillByChange}
              variant="outlined"
              showLabel={true}
              lbldropdown="Bill By"
              ddData={props.billBy ? props.billBy : []}
              value={billByName}
              name="billBy"
            />
          </Grid>
          <Grid item xs={6}>
            <Dropdown
              size="small"
              id="soldby"
              handleChange={handleSoldByChange}
              variant="outlined"
              showLabel={true}
              lbldropdown="Sold By"
              ddData={props.SoldBy ? props.SoldBy : []}
              value={soldByName}
              name="soldBy"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" flex="1">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2.5}>
                  <Typography variant="subtitle2" color="secondary">
                    Plan Detail
                  </Typography>{" "}
                </Grid>
                <Grid item xs={9.5}>
                  <Divider sx={{ width: "100%" }}></Divider>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" flexDirection="row">
              <Box component="div">
                <TextField
                  id="version"
                  size="small"
                  variant="outlined"
                  type="number"
                  label="Version"
                  disabled={editVersion}
                  InputProps={{
                    inputProps: {
                      max: 10000,
                      min: 1,
                    },
                  }}
                  value={planVersion}
                  onChange={handlePlanVersion}
                />
              </Box>
              {props.planAction === "Edit" &&
                planStatus !== MEDIA_PALN_STATUS_NAMES.Confirmed &&
                !versionChanged && (
                  <Box component="div">
                    <IconButton
                      title={`Clone`}
                      size="small"
                      color="secondary"
                      onClick={() => handleCloneClick()}
                    >
                      <ContentCopyOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
            </Box>
          </Grid>
          <Grid item xs={3} sm={3} className={classes.grid}>
            <Box display="flex">
              <FormControlLabel
                size="small"
                label={
                  <Typography
                    color="primary"
                    fontWeight="medium"
                    variant="caption"
                  >
                    Mark as Primary
                  </Typography>
                }
                control={
                  <Checkbox
                    onChange={handlePrimaryFlagChange}
                    size="small"
                    checked={isPrimaryVersion}
                    className={classes.checkboxPadding}
                  />
                }
              />
            </Box>
          </Grid>
          <Grid item xs={11}>
            <Box display="flex" flexDirection="column">
              {/* <Box component="div">
                                <Typography variant="caption">Start Date | End Date</Typography>
                            </Box> */}
              {/* <Box component="div" >
                                <Typography variant="subtitle2">{props.startDate ? Helper.FormatDate(props.startDate) : ''}{props.endDate ? ` | ${Helper.FormatDate(props.endDate)}` : ''}</Typography>
                            </Box> */}

              <DateRangePicker
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                startDateLabel="Plan Start Date"
                endDateLabel="Plan End Date"
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                standard="standard"
              />
            </Box>
          </Grid>

          {mediumList.length > 0 && (
            <>
              <Grid item xs={12}>
                <Box display="flex" flex="1">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2.5}>
                      <Typography variant="subtitle2" color="secondary">
                        Media Detail
                      </Typography>{" "}
                    </Grid>
                    <Grid item xs={9.5}>
                      <Divider sx={{ width: "100%" }}></Divider>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
              <TableContainer
                  square
                  component={Paper}
                  
                >
                  <Table stickyHeader size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="caption" fontWeight="medium">
                            Media Type
                          </Typography>
                        </TableCell>
                        <TableCell >
                          <Typography variant="caption" fontWeight="medium">
                            Start Date
                          </Typography>
                          <Typography variant="caption" fontWeight="medium" marginLeft={11}>
                            End Date
                          </Typography>
                        </TableCell>

                       
                        <TableCell>
                          <Typography
                            variant="caption"
                            fontWeight="medium"
                          ></Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="caption"
                            fontWeight="medium"
                          ></Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mediumList.map((item, index) => {
                     
                        return (
                          <TableRow
                           
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                            key={item.id}
                          >
                            <TableCell component="th" scope="row">
                              <Typography variant="caption">
                                {item.mediumLookupDisplayText}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              
                               <DateRangePicker
                                startDate={item.startDate?new Date(item.startDate):''}
                                endDate={item.endDate?new Date(item.endDate):''}
                                startDateLabel="Start Date"
                                endDateLabel="End Date"
                                setStartDate={setMediumStartDate}
                                setEndDate={setMediumEndDate}
                                standard="standard"
                                disabled={
                                  isEditing && item.id === currentId
                                    ? false
                                    : true
                                }
                                
                              />
                            </TableCell>

                           
                            <TableCell>
                              <Typography variant="caption">
                                {item.total}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box
                                display="flex"
                                flexDirection={"column"}
                                justifyContent="space-between"
                              >
                                {isEditing && item.id === currentId ? (
                                  <>
                                    <>
                                      <IconButton
                                        color="primary"
                                        title="Save Change"
                                        size="small"
                                        onClick={() =>
                                          handleDateSave(item.id, "save")
                                        }
                                      >
                                        <SaveOutlinedIcon />
                                      </IconButton>
                                      <IconButton
                                        color="secondary"
                                        title="Cancel Change"
                                        size="small"
                                        onClick={() =>
                                          handleDateSave(item.id, "cancel")
                                        }
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </>
                                  </>
                                ) : (
                                  <IconButton
                                    title="Edit Plan"
                                    size="small"
                                    onClick={() => handleDateUpdate(item)}
                                  >
                                    <EditOutlinedIcon />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          <Grid item xs={8}>
            <Box component="div" mt={1}>
              <TextField
                id="comments"
                size="small"
                variant="outlined"
                type="text"
                label="Comments"
                multiline={true}
                className={classes.comments}
                minRows={2}
                value={comments}
                onChange={handleComments}
              />
            </Box>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <Box component="div" p={1.5}>
          <Grid container xs={12} justifyContent="flex-end">
            <Button
              color="secondary"
              onClick={() => handleSubmit("cancel")}
              size="small"
              sx={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSubmit("submit")}
              size="small"
              color="primary"
            >
              Save
            </Button>
          </Grid>
        </Box>
      </Box>
      <DrawerComponent
        open={showDetails}
        handleDrawerClose={() => handleDetails(false)}
        handleDrawerOpen={() => handleDetails(true)}
        anchor={"right"}
        className={classes.drawer}
      >
        <ErrorDetails errorDetails={errorDetails} handleClose={() => handleDetails(false)} key="ValPlanConfirm" />
      </DrawerComponent>
    </>
  );
};
export default AddPlan;
