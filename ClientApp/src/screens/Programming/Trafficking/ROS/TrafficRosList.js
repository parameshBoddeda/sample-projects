import React, { useEffect, useState } from "react";
import {
  Divider,
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import AppDataContext from "../../../../common/AppContext";
import { ToastContainer, toast } from "react-toastify";
import ConfrimDialog from "../../../../sharedComponents/Dialog/ConfirmDialog";
import SearchComponent from "../../../../sharedComponents/SearchComponent/SearchComponent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Helper from "../../../../common/Helper";
import { makeStyles } from "@material-ui/core/styles";
import TrafficRosListItem from "./TrafficRosListItem";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import SplitScheduleUnit from "../SplitScheduleUnit";
import MergeScheduleUnits from "../MergeScheduleUnits";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import {
  GetScheduleAdUnit,
  UpdateTraffickingStatus,
  UpdateTraffickingData,
} from "../../../../services/trafficking.service";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DrawerComponent from "../../../../sharedComponents/Drawer/DrawerComponent";
import CircleIcon from '@mui/icons-material/Circle';
import {  GetLookupById } from '../../../../services/common.service';
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";



function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: "#e4edfc",
  },
  filterWidget: {
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(1),
  },
  halfContentHeight: {
    height: "calc(50vh - 182px)",
  },
  contentHeight: {
    height: "calc(100vh - 294px)",
    overflowY: "auto",
  },
  fullHeightTraffickingwithoutCopy: {
    height: "calc(100vh - 235px) !important",
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: "30%",
      margin: "50px 0 0 0px",
      padding: theme.spacing(2, 1),
    },
  },
  showBySpacing: {
    minWidth: "125px",
    marginLeft: theme.spacing(1),
    "& .MuiInputBase-input": {
      paddingRight: theme.spacing(0) + "px !important",
    },
  },
}));

const TrafficRosList = (props) => {
  const classes = useStyles();
  const { username } = React.useContext(AppDataContext);
  const [rosData, setRosData] = useState([]);
  const [openTraffickedDialog, setOpenTraffickedDialog] = useState(false);
  const [isTrafficked, setIsTrafficked] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [showSplitUnit, setShowSplitUnit] = useState(false);
  const [showMergeUnit, setShowMergeUnit] = useState(false);
  const [selectedSplitUnit, setSelectedSplitUnit] = useState(null);
  const [selectedMergeUnits, setSelectedMergeUnits] = useState(null);
  const [sameUnitTypeData, setSameUnitTypeData] = useState([]);
  const [revisionData,setRevisionData] = useState([])
  const [revisionValue,setRevisionValue] = useState(null)
  const [revisionName,setRevisionName] = useState('')


  const getTotalCount = () => {
    if (rosData.length > 0) {
      let total = [];

      rosData.forEach((item) => {
        total.push(item.countPerc);
      });
      return total.reduce((a, b) => a + b, 0);
    }
  };

  const saveTrafficking = (checked) => {
    setIsTrafficked(checked);
    // setShowLoading(true);
    // setOpenBackdrop(true);
    let params = {
      id: props.selectedScheduleId,
      user: username,
      isTrafficked: checked,
      revisionNumber:String(revisionValue)
    };
    UpdateTraffickingStatus(params)
      .then((resp) => {
        if (resp) {
          getRosData(props.selectedScheduleId);
          props.refreshPage(checked);
          notifySuccess("Data saved successfully..!");
        } else {
          notifyWarning("Unable to save.");
        }
        // setShowLoading(false);
        // setOpenBackdrop(false);
      })
      .catch((ex) => {
        notifyWarning("Server error.");
        // setShowLoading(false);
        // setOpenBackdrop(false);
      });
  };

  const handleTraffickingChange = (e) => {
    if (e.target.checked) {
      let matchFound = false;
      let confirmed = false;
      let tempRosData = rosData;
      if (tempRosData.length < 1) {
        return false;
      }
      tempRosData.map((ele) => {
        if (!ele.adId && !matchFound) {
          matchFound = true;
        }
      });

      tempRosData.forEach((ele) => {
        if (ele.status) {
          if (ele.status === 1353 && !confirmed) {
            confirmed = true;
          }
        }
      });

      if (confirmed) {
        notifyWarning("Please confirm plan of all units of the schedule.");
        return;
      }

      if (matchFound) {
        notifyWarning("Please Assign ISCI and date range");
        return;
        // setOpenTraffickedDialog(true);
      } else {
        saveTrafficking(e.target.checked);
      }
    } else {
      saveTrafficking(e.target.checked);
    }
  };

  const handleTraffickedOK = () => {
    saveTrafficking(true);
    setOpenTraffickedDialog(false);
  };

  const handleTraffickedCancel = () => {
    setIsTrafficked(false);
    setOpenTraffickedDialog(false);
  };

  const setBreak = (scheduleAdUnitId, value) => {
    let tempRosData = rosData;
    tempRosData.map((ele) => {
      if (ele.scheduleAdUnitId === scheduleAdUnitId) {
        ele.adId = value.value ? value.value : null;
        ele.adISCI = value.label ? value.label : null;
        ele.adTitle = value.title ? value.title : null;
      }
    });
    setRosData(tempRosData);
  };

  const getRosData = (scheduleId) => {
    setShowLoading(true);
    setOpenBackdrop(true);
    GetScheduleAdUnit(scheduleId, true)
      .then((resp) => {
        setRosData(resp);
        setOpenBackdrop(false);
        setShowLoading(false);
      })
      .catch((err) => {
        notifyWarning("Server error.");
        setShowLoading(false);
        setOpenBackdrop(false);
        console.log(err);
      });
  };

  useEffect(() => {
    setIsTrafficked(props.selectedScheduleData.isTrafficked);
    getRosData(props.selectedScheduleId);
    getRevisionData()
  }, []);

  
  useEffect(()=>{
    if(revisionData.length>0){
      let rname = props.selectedScheduleData.revisionNumber===null?"1":props.selectedScheduleData.revisionNumber;
     
      let rvalue = revisionData.find(data=>data.label===rname)
    
       setRevisionName(rname)
       setRevisionValue(rvalue.value)
    }
      },[revisionData])

  const handleCopyClick = (id, data, selectedIsci) => {
    if(props.setShowCopy) {
      props.setShowCopy(true);
    }
    if (id === -1) {
      console.log("rosData", rosData);

      let checkAllIsciDate =
        rosData.length > 0 &&
        rosData.every(
          (item) => item.adISCI && item.adStartDate && item.adEndDate
        );

      if (!checkAllIsciDate) {
        notifyWarning("Please select all ISCI and date range");
        return;
      } else {
        let mappedStart = rosData.map((item) => item.adStartDate);
        let mappedEnd = rosData.map((item) => item.adEndDate);

        let startDate = mappedStart.reduce((a, b) => {
          return Date.parse(a) > Date.parse(b) ? b : a;
        });

        let endDate = mappedEnd.reduce(function (a, b) {
          return Date.parse(a) < Date.parse(b) ? b : a;
        });
        props.setStartDate(startDate);
        props.setEndDate(endDate);

        props.setCurrentScheduleAdUnit(id);
        props.handleTraffickingClick();
        // props.setCurrentData(data);
        // props.setCurrentSelectedIsci(selectedIsci);
      }

      // GetScheduleAdUnit(props.selectedScheduleId, true).then((resp) => {
      //   let checkAllIsciDate =
      //     resp.length > 0 &&
      //     resp.every(
      //       (item) => item.adISCI && item.adStartDate && item.adEndDate
      //     );

      //   if (!checkAllIsciDate) {
      //     notifyWarning("Please select all ISCI and date range");
      //     return;
      //   } else {
      //     let mappedStart = resp.map((item) => item.adStartDate);
      //     let mappedEnd = resp.map((item) => item.adEndDate);

      //     let startDate = mappedStart.reduce((a, b) => {
      //       return Date.parse(a) > Date.parse(b) ? b : a;
      //     });

      //     let endDate = mappedEnd.reduce(function (a, b) {
      //       return Date.parse(a) < Date.parse(b) ? b : a;
      //     });
      //     props.setStartDate(startDate);
      //     props.setEndDate(endDate);

      //     props.setCurrentScheduleAdUnit(id);
      //     props.handleTraffickingClick();
      // props.setCurrentData(data);
      // props.setCurrentSelectedIsci(selectedIsci);
      //   }
      // });
    } else {
      props.setCurrentScheduleAdUnit(id);
      props.handleTraffickingClick();
      props.setCurrentData(data);
      props.setCurrentSelectedIsci(selectedIsci);
      props.setStartDate(data.adStartDate);
      props.setEndDate(data.adEndDate);
    }
  };

  const handleSplitUnitDrawer = (value) => {
    setShowSplitUnit(value);
  };

  const handleMergeUnitDrawer = (value) => {
    setShowMergeUnit(value);
  };

  const handleSplitUnit = (splitUnit) => {
    setShowSplitUnit(true);
    setSelectedSplitUnit(splitUnit);
  };

  const handleMergeUnits = (unit, data) => {
    setSelectedMergeUnits(unit);
    let sameTypeUnits = data.filter((x) => x.unitTypeId === unit.unitTypeId);
    setSameUnitTypeData(sameTypeUnits);
    setShowMergeUnit(true);
  };
  const handleSaveSplitConfig = () => {
    setShowSplitUnit(false);
    getRosData(props.selectedScheduleId);
  };

  const handleSaveMergeConfig = () => {
    setShowMergeUnit(false);
    getRosData(props.selectedScheduleId);
  };

 

  const checkDateRange = () => {
    let campaign =
    rosData.length > 0 &&
    rosData.filter(
        (unit) => unit.planEndDate !== null && unit.planStartDate !== null
      );

    if (campaign.length > 0) {
      let range = campaign.every(
        (item) =>
          props.selectedScheduleData.estDate >= item.planStartDate &&
          props.selectedScheduleData.estDate <= item.planEndDate
      );
      return !range;
    }
  };

  const checkTraffickingDisabled = () => {
    if (props.selectedScheduleData.isReady === 0) {
      return true;
    } else {
      checkDateRange();
    }
  };

  
  const getRevisionData = () => {
    GetLookupById(1750).then((data) => {
    
        let revisionList = [];
        if (data) {
            data.map(item => {
              revisionList.push({ label: item.lookupText, value: item.lookupId });
            });
            setRevisionData(revisionList);
        }
    }).catch(err => console.log(err))

}

const handleRevisionChange = (name, value) => {
 
  setRevisionName(value.label);


  setRevisionValue(value.value)

};

  return (
    <>
      <ConfrimDialog
        open={openTraffickedDialog}
        title={"Notification"}
        description={
          "Some or all ISCI are blank, Do you still want to confirm trafficking?"
        }
        ok={"Yes"}
        cancel={"No"}
        handleDialogOk={() => handleTraffickedOK()}
        handleDialogCancel={() => handleTraffickedCancel()}
      ></ConfrimDialog>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        className={classes.filterWidget}
      >
        <ToastContainer autoClose={3000} />
        <Box display="flex">
          {props.selectedScheduleData.isTrafficked && (
            <IconButton
              title="Generate Traffic Letter"
              size="small"
              onClick={() => {
                if (props.selectedScheduleData.isTrafficked) {
                  props.showTraffickLetter(props.selectedScheduleData);
                }
              }}
            >
              <MarkunreadOutlinedIcon size="small" />
            </IconButton>
          )}
        </Box>
        <Box display="flex">
          <SearchComponent />
        </Box>
        <Box display="flex">
          {/* <IconButton size="small">
            <HandymanOutlinedIcon />
          </IconButton>
          <IconButton size="small">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
          <IconButton size="small">
            <DownloadIcon />
          </IconButton> */}

          <IconButton title="Refresh Page" size="small" onClick={() => getRosData(props.selectedScheduleId)}>
            <RefreshOutlinedIcon />
          </IconButton>

          <IconButton title="Copy" size="small" disabled={checkTraffickingDisabled() ? true : false}>
            <ContentCopyIcon onClick={() => handleCopyClick(-1)} />
          </IconButton>
          
        </Box>
      </Box>
      <Grid item xs={12} className={classes.header}>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Typography color="primary" variant="caption" ml={2}>
              {`
                 
                  ${
                    props.selectedScheduleData.networkName
                      ? props.selectedScheduleData.networkName
                      : "-"
                  } | 
                  ${
                    props.selectedScheduleData.estDate
                      ? Helper.FormatDate(props.selectedScheduleData.estDate)
                      : "-"
                  } | 
                  ${
                    props.selectedScheduleData.id
                      ? props.selectedScheduleData.id
                      : "-"
                  } | 
                  ${
                    props.selectedScheduleData.episodeName
                      ? props.selectedScheduleData.episodeName
                      : "-"
                  }
               `}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              pr={2}
            >
              <Box display="flex" flex="1" alignItems="center">
                <Box
                  pr={2}
                  component="div"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <CircleIcon style={{ color: "#8adbde" }} fontSize="small" />
                  &nbsp;&nbsp;
                  <Typography variant="caption">Trafficked</Typography>
                </Box>
                <Box
                  pr={2}
                  component="div"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <CircleIcon style={{ color: "#fcba03" }} fontSize="small" />
                  &nbsp;&nbsp;
                  <Typography variant="caption">Pending Confirm</Typography>
                </Box>
                <Box
                  pr={2}
                  component="div"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <CircleIcon style={{ color: "#499e3a" }} fontSize="small" />
                  &nbsp;&nbsp;
                  <Typography variant="caption">Confirmed</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <FormControlLabel
                  size="small"
                  label={
                    <Typography
                      color="primary"
                      fontWeight="medium"
                      variant="caption"
                    >
                      Trafficked
                    </Typography>
                  }
                  control={
                    <Checkbox
                      onChange={handleTraffickingChange}
                      size="small"
                      checked={isTrafficked}
                      className={classes.checkboxPadding}
                      disabled={checkTraffickingDisabled() ? true : false}
                    />
                  }
                />
              </Box>

              <Box display="flex" alignItems="center"   pr={2}>
                  <FormControlLabel
                    variant="standard"
                    size="small"
                    labelPlacement="start"
                    label={
                      <Typography
                        color="primary"
                        fontWeight="medium"
                        variant="caption"
                      >
                        Revision Number:{" "}
                      </Typography>
                    }
                    control={
                      <Dropdown
                        classList={classes.showBySpacing}
                        name="revision"
                        handleChange={handleRevisionChange}
                        size="small"
                        id="categoryId"
                        value={revisionName}
                        variant="standard"
                        showLabel={false}
                        lbldropdown=""
                        ddData={revisionData}
                        disabled={props.selectedScheduleData.isTrafficked?true:false}
                      />
                    }
                  />
                </Box>
              <Typography color="primary" fontWeight="medium" variant="caption">
                Total Count : {getTotalCount()}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <div>
        <Box className={`${props.expandTrafficking && props.expandUnassigned ? classes.halfContentHeight : classes.contentHeight} 
        ${!props.showCopy ? classes.fullHeightTraffickingwithoutCopy : ""}        
        `}>
          {rosData.length > 0 ? (
            rosData.map((ele, index) => {
              return (
                <>
                  <Grid container spacing={1} marginTop={0} pb={0.5}>
                    <TrafficRosListItem
                      data={ele}
                      setBreak={setBreak}
                      isTrafficked={isTrafficked}
                      selectedScheduleData={props.selectedScheduleData}
                      handleCopyClick={handleCopyClick}
                      handleSplitUnit={(item) => handleSplitUnit(item)}
                      handleMergeUnits={(item) =>
                        handleMergeUnits(item, rosData)
                      }
                      getScheduleAdUnit={getRosData}
                      scheduleId={props.selectedScheduleId}
                    />
                  </Grid>

                  <Divider sx={{ width: "100%" }} />
                </>
              );
            })
          ) : (
            <Typography pl={1} pt={1} variant="subtitle1">
              No Record.
            </Typography>
          )}
        </Box>
      </div>
      <DrawerComponent
        open={showSplitUnit}
        handleDrawerClose={() => handleSplitUnitDrawer(false)}
        handleDrawerOpen={() => handleSplitUnitDrawer(true)}
        anchor={"right"}
        className={classes.drawer}
      >
        {showSplitUnit && (
          <SplitScheduleUnit
            handleDrawerOpen={() => handleSplitUnitDrawer(true)}
            handleClose={() => handleSplitUnitDrawer(false)}
            Schedule={selectedSplitUnit}
            handleSave={handleSaveSplitConfig}
          />
        )}
      </DrawerComponent>
      <DrawerComponent
        open={showMergeUnit}
        handleDrawerClose={() => handleMergeUnitDrawer(false)}
        handleDrawerOpen={() => handleMergeUnitDrawer(true)}
        anchor={"right"}
        className={classes.drawer}
      >
        {showMergeUnit && (
          <MergeScheduleUnits
            handleDrawerOpen={() => handleMergeUnitDrawer(true)}
            handleClose={() => handleMergeUnitDrawer(false)}
            Schedule={selectedMergeUnits}
            SameTypeUnits={sameUnitTypeData}
            handleSave={handleSaveMergeConfig}
          />
        )}
      </DrawerComponent>
      {showLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <div className={"loader-div"}>
            <div className={"loading"}></div>
          </div>
        </Backdrop>
      )}
    </>
  );
};

export default TrafficRosList;
