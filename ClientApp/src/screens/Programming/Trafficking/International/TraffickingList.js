import React, { useContext, useEffect, useState } from "react";
import { Divider, Box, Grid, Typography } from "@mui/material";
import Helper from "../../../../common/Helper";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import TraffickingUI from "./TraffickingUI";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {
  GetScheduleAdUnit,
  GetNetworkBreakAndPosition,
  UpdateTraffickingStatus,
  FilterTraffickingData,
} from "../../../../services/trafficking.service";
import AppDataContext from "../../../../common/AppContext";
import CircleIcon from "@mui/icons-material/Circle";

import {
  Checkbox,
  IconButton,
  Chip,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchComponent from "../../../../sharedComponents/SearchComponent/SearchComponent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ConfrimDialog from "../../../../sharedComponents/Dialog/ConfirmDialog";
import { Paper } from "@material-ui/core";

import SplitScheduleUnit from "../SplitScheduleUnit";
import MergeScheduleUnits from "../MergeScheduleUnits";

import DrawerComponent from "../../../../sharedComponents/Drawer/DrawerComponent";
import {  GetLookupById } from '../../../../services/common.service';
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";


const label = { inputProps: { "aria-label": "Checkbox demo" } };
function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}
/*#ecfffb green*/
/*#feefea orange*/
/*#00c691 chip Green*/
/*#f99070 chip orange*/
const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 170px)",
    overflowY: "auto",
  },
  header: {
    backgroundColor: "#e4edfc",
  },
  filterWidget: {
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(1),
  },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  halfContentHeight: {
    height: "calc(50vh - 169px)",
  },
  fullHeightTrafficking: {
    height: "calc(100vh - 283px)",
  },
  fullHeightTraffickingwithoutCopy: {
    height: "calc(100vh - 235px) !important",
  },
  showOverflow: {
    overflowY: "auto",
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

const TraffickingList = (props) => {
  const classes = useStyles();
  const { leagueId } = React.useContext(AppDataContext);
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [breakDropdownData, setBreakDropdownData] = React.useState([]);
  const [orgScheduleAd, setOrgScheduleAd] = React.useState([]);
  const [scheduleAd, setScheduleAd] = React.useState([]);
  const { username } = React.useContext(AppDataContext);
  const [isTrafficked, setIsTrafficked] = React.useState(false);
  const [openTraffickedDialog, setOpenTraffickedDialog] = useState(false);
  const [showCopyDrawer, setShowCopyDrawer] = useState(false);
  const [showSplitUnit, setShowSplitUnit] = useState(false);
  const [showMergeUnit, setShowMergeUnit] = useState(false);
  const [selectedSplitUnit, setSelectedSplitUnit] = useState(null);
  const [selectedMergeUnits, setSelectedMergeUnits] = useState(null);
  const [sameUnitTypeData, setSameUnitTypeData] = useState([]);
  const [revisionData,setRevisionData] = useState([])
  const [revisionValue,setRevisionValue] = useState(null)
  const [revisionName,setRevisionName] = useState('')


  const getScheduleAdUnit = (scheduleId) => {
    setShowLoading(true);
    GetScheduleAdUnit(scheduleId, false)
      .then((resp) => {
        setScheduleAd(resp);
        setOrgScheduleAd(resp);
        setShowLoading(false);
      })
      .catch((err) => {
        notifyWarning("Server error.");
        setShowLoading(false);
        console.log(err);
      });
  };

  const getNetworkBreakAndPosition = (networkId, marketTypeId) => {
    setShowLoading(true);
    setOpenBackdrop(true);

    GetNetworkBreakAndPosition(leagueId, networkId, marketTypeId)
      .then((resp) => {
        resp = resp.sort((eleF, eleS) => {
          return eleF.break - eleS.break;
        });

        let breakiList = [];
        if (resp) {
          resp.map((ele) => {
            breakiList.push({ value: ele.id, label: ele.break });
          });
        }

        setBreakDropdownData(breakiList);

        setShowLoading(false);
        setOpenBackdrop(false);
      })
      .catch((err) => {
        notifyWarning("Server error.");
        setShowLoading(false);
        setOpenBackdrop(false);
        console.log(err);
      });
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
          getScheduleAdUnit(props.selectedScheduleId);
          props.refreshPage(checked);
          // setShowLoading(false);
          // setOpenBackdrop(false);
          notifySuccess("Data saved successfully..!");
        } else {
          // setShowLoading(false);
          // setOpenBackdrop(false);
          notifyWarning("Unable to save.");
        }
      })
      .catch((ex) => {
        // setShowLoading(false);
        // setOpenBackdrop(false);
        notifyWarning("Server error.");
      });
  };

  const handleTrafficked = (e) => {
    let confirmed = false;
    let checkIsci = scheduleAd.every(item=>item.adId!==0);

    scheduleAd.forEach((ele) => {
      if (ele.status) {
        if (ele.status === 1353 && !confirmed) {
          confirmed = true;
        }
      }
    });
    
    if(!checkIsci){
      notifyWarning("Please Assign ISCI to all units.");
      return;
    }

    if(confirmed) {
      notifyWarning("Please confirm plan of all units of the schedule.");
      return;
    }

    saveTrafficking(e.target.checked);
    // if (e.target.checked) {
    //   let matchFound = false;
    //   let tempScheduleAd = scheduleAd;
    //   if (tempScheduleAd.length < 1) {
    //     return false;
    //   }

    //   tempScheduleAd.map((ele) => {
    //     if (!ele.adId && !matchFound) {
    //       matchFound = true;
    //     }
    //   });
    //   if (matchFound) {
    //     // setOpenTraffickedDialog(true);
    //     notifyWarning("Please select all ISCI and break positions");
    //     return;
    //   } else {
    //     saveTrafficking(e.target.checked);
    //   }
    // } else {
    //   saveTrafficking(e.target.checked);
    // }
  };

  const setFilterData = (filterData) => {
    setScheduleAd(filterData);
  };

  const setBreak = (scheduleAdUnitId, value) => {
    let tempSchedule = scheduleAd;
    tempSchedule.map((ele) => {
      if (ele.scheduleAdUnitId === scheduleAdUnitId) {
        tempSchedule.break = value.label ? value.label : null;
      }
    });
    setScheduleAd(tempSchedule);
  };

  const handleTraffickedOK = () => {
    saveTrafficking(true);
    setOpenTraffickedDialog(false);
  };

  const handleTraffickedCancel = () => {
    setIsTrafficked(false);
    setOpenTraffickedDialog(false);
  };

  const setIsci = (scheduleAdUnitId, value) => {
    let tempSchedule = scheduleAd;
    tempSchedule.map((ele) => {
      if (ele.scheduleAdUnitId === scheduleAdUnitId) {
        tempSchedule.adId = value.value ? value.value : null;
      }
    });
    setScheduleAd(tempSchedule);
  };

  const handleRefresh = () => {
    getScheduleAdUnit(props.selectedScheduleId);
  };

  useEffect(() => {
    setIsTrafficked(props.selectedScheduleData.isTrafficked);

    getNetworkBreakAndPosition(
      props.selectedScheduleData.networkId,
      props.selectedScheduleData.marketTypeId
    );

    getScheduleAdUnit(props.selectedScheduleId);
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

  const handleCopyClick = (id, data, selectedIsci, selectedBreak) => {
    if(props.setShowCopy) {
      props.setShowCopy(true);
    }
    if (id === -1) {
      let checkAllIsciBreak =
        scheduleAd.length > 0 &&
        scheduleAd.every((item) => item.adISCI);

      if (!checkAllIsciBreak) {
        notifyWarning("Please select all ISCI");
        return;
      } else {
        props.setCurrentScheduleAdUnit(id);
        props.handleTraffickingClick();
        props.setCurrentData(data);
        props.setCurrentSelectedIsci(selectedIsci);
        props.setCurrentSelectedBreak(selectedBreak);
      }

      // GetScheduleAdUnit(props.selectedScheduleId, false).then((resp) => {
      //   let checkAllIsciBreak =
      //     resp.length > 0 && resp.every((item) => item.adISCI && item.break);

      //     console.log('scheduleAd',scheduleAd)
      //   if (!checkAllIsciBreak) {
      //     notifyWarning("Please select all ISCI and break positions");
      //     return;
      //   } else {
      //     props.setCurrentScheduleAdUnit(id);
      //     props.handleTraffickingClick();
      //     props.setCurrentData(data);
      //     props.setCurrentSelectedIsci(selectedIsci);
      //     props.setCurrentSelectedBreak(selectedBreak);
      //   }
      // });
    } else {
      props.setCurrentScheduleAdUnit(id);
      props.handleTraffickingClick();
      props.setCurrentData(data);
      props.setCurrentSelectedIsci(selectedIsci);
      props.setCurrentSelectedBreak(selectedBreak);
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
    let sameTypeUnits = data.filter((x) => x.unitTypeId === unit.unitTypeId && x.unitCostTypeId === unit.unitCostTypeId);
    setSameUnitTypeData(sameTypeUnits);
    setShowMergeUnit(true);
  };

  const handleSaveSplitConfig = () => {
    setShowSplitUnit(false);
    getScheduleAdUnit(props.selectedScheduleId);
  };

  const handleSaveMergeConfig = () => {
    setShowMergeUnit(false);
    getScheduleAdUnit(props.selectedScheduleId);
  };

  const checkDateRange = () => {
    let campaign =
    scheduleAd.length > 0 &&
    scheduleAd.filter(
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

  return (
    <Box>
      <ToastContainer autoClose={3000} />

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
          <SearchComponent
            setFilterData={setFilterData}
            jsonData={scheduleAd}
            originalData={orgScheduleAd}
          />
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

          <IconButton title="Refresh Page" size="small" onClick={handleRefresh}>
            <RefreshOutlinedIcon />
          </IconButton>

          <IconButton title="Copy" size="small" disabled={checkTraffickingDisabled() ? true : false}>
            <ContentCopyIcon onClick={() => handleCopyClick(-1)} />
          </IconButton>
        </Box>
      </Box>
      <Grid item xs={12} className={classes.header}>
        <Grid container alignItems="center">
          <Grid container marginTop={0}>
            <Grid item xs={4}>
              {props.selectedScheduleData != null &&
                props.selectedScheduleData !== undefined && (
                  <Typography color="primary" variant="caption" ml={2}>
                    {`
                               
                                ${
                                  props.selectedScheduleData.networkName
                                    ? props.selectedScheduleData.networkName
                                    : "-"
                                } | 
                                ${
                                  props.selectedScheduleData.estDate
                                    ? Helper.FormatDate(
                                        props.selectedScheduleData.estDate
                                      )
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
                )}
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
                <Box display="flex">
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
                        size="small"
                        className={classes.checkboxPadding}
                        checked={isTrafficked}
                        onChange={(e) => handleTrafficked(e)}
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
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box
        className={`${classes.showOverflow} 
        ${
          props.expandTrafficking && props.expandUnassigned
            ? classes.halfContentHeight
            : props.expandTrafficking
            ? classes.fullHeightTrafficking
            : ""
        } 
        ${
          !props.showCopy ? classes.fullHeightTraffickingwithoutCopy : ""
        }`
      }
      >
        {scheduleAd.length > 0 ? (
          scheduleAd.map((data, index) => {
            return (
              <TraffickingUI
                data={data}
                setBreak={setBreak}
                index={index}
                setIsci={setIsci}
                breakDropdownData={breakDropdownData}
                isTrafficked={isTrafficked}
                selectedScheduleData={props.selectedScheduleData}
                selectedScheduleId={props.selectedScheduleId}
                handleCopyClick={handleCopyClick}
                showCopyDrawer={showCopyDrawer}
                setShowCopyDrawer={setShowCopyDrawer}
                topCopyIcon="topCopyIcon"
                setCurrentScheduleAdUnit={props.setCurrentScheduleAdUnit}
                getScheduleAdUnit={getScheduleAdUnit}
                scheduleId={props.selectedScheduleId}
                handleSplitUnit={(item) => handleSplitUnit(item)}
                handleMergeUnits={(item) => handleMergeUnits(item, scheduleAd)}
              />
            );
          })
        ) : (
          <Typography pl={1} pt={1} variant="subtitle1">
            No Record.
          </Typography>
        )}
      </Box>

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
    </Box>
  );
};

TraffickingList.displayName = "TraffickingList";
export default TraffickingList;
