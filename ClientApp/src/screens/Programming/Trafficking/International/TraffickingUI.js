import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Divider,
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Checkbox,
  Paper,
} from "@mui/material";
import Helper from "../../../../common/Helper";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  UpdateTraffickingData,
  FilterTraffickingData,
  SaveTraffickingScheduleCopyData,
} from "../../../../services/trafficking.service";
import AppDataContext from "../../../../common/AppContext";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import MultiSelectDropdown from "../../../../sharedComponents/Dropdown/MulltiSelectDropdown";

import CallSplitOutlinedIcon from "@mui/icons-material/CallSplitOutlined";
import CallMergeOutlinedIcon from "@mui/icons-material/CallMergeOutlined";
import RedCircle from "../../../../sharedComponents/customIcons/RedCircle";
import CircleIcon from '@mui/icons-material/Circle';


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
  toolbar: theme.mixins.toolbar,
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
  filteredListTable: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(0.75),
    },
  },
  rowBackground: {
    "&:nth-child(even)": {
      background: "#F0F7FF",
      "& .MuiChip-root": {
        background: "#1D428A",
        color: "#fff",
      },
    },
    "&:nth-child(odd)": {
      background: "#FFF",
      "& .MuiChip-root": {
        background: "#1D428A",
        color: "#fff",
      },
    },
  },
  borderRight: {
    borderRight: "1px solid #ccc",
  },
  fabButton: {
    margin: theme.spacing(1) + "px !important",
    marginTop: theme.spacing(1) + "px !important",
    marginBottom: theme.spacing(1) + "px !important",
    minHeight: "25px !important",
    height: "25px !important",
    width: "25px !important",
  },
  textField: {
    width: "120px",
  },
  traffickingCopyDrawer: {
    "& .MuiDrawer-paper": {
      width: "calc(100vw - 55vw)",
      margin: "0 0 0 65px",
      //   padding: theme.spacing(2, 1),
    },
  },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
}));

const TraffickingUI = (props) => {
  const classes = useStyles();


  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const [isciDropdown, setIsciDropdown] = useState();
  const [adTitle, setAdTitle] = useState();

  const [selectedIsci, setSelectedIsci] = useState({
    id: "",
    label: "",
    title: "",
  });
  const [selectedBreak, setSelectedBreak] = useState({
    id: "",
    label: "",
  });
  const { username } = useContext(AppDataContext);

  const handleChange = (action, value) => {
    if (action == "BREAK") {
      setSelectedBreak(value);
      props.setBreak(props.data.scheduleAdUnitId, value);
    }

    if (action == "ISCI") {
      setSelectedIsci(value);
      setAdTitle(value.title);
      props.setIsci(props.data.scheduleAdUnitId, value);
    }

    let params = {
      scheduleAdUnitId: props.data.scheduleAdUnitId,
      scheduleId: props.data.scheduleId,
      adId: action == "ISCI" ? value.value : null,
      break: action == "BREAK" ? value.label : null,
      user: username,
      assigned: 1,
    };
    setShowLoading(true);
    setOpenBackdrop(true);
    UpdateTraffickingData(params)
      .then((resp) => {
        if (resp) {
          setShowLoading(false);
          setOpenBackdrop(false);
          props.getScheduleAdUnit(props.scheduleId);
          notifySuccess("Data saved successfully..!");
        } else {
          setShowLoading(false);
          setOpenBackdrop(false);
          notifyWarning("Unable to save.");
        }
      })
      .catch((ex) => {
        setShowLoading(false);
        setOpenBackdrop(false);
        notifyWarning("Server error.");
      });
  };

  const getIsciDropdown = () => {
    let tempIsciList = [];
    if (props.data.isciInfo) {
      props.data.isciInfo.map((ele) => {
        tempIsciList.push({ value: ele.id, label: ele.isci, title: ele.title });
      });
    }

    setIsciDropdown(tempIsciList);
  };

  useEffect(() => {
    //.log(props);
    //debugger;
    setSelectedBreak({ id: props.data.break, label: props.data.break });
    setSelectedIsci({
      id: props.data.adId,
      label: props.data.adISCI,
      title: props.data.adTitle,
    });
    setAdTitle(props.data.adTitle);

    getIsciDropdown();
  }, []);

  const checkIsciBreak = (id, data) => {
    if (selectedIsci.title === null || selectedBreak.title === null) {
      notifyWarning("Please select ISCI and break positions");
      return;
    } else {
      props.handleCopyClick(id, data, selectedIsci, selectedBreak);
    }
  };

  const checkDateRange = () => {
  
    if (props.data.planEndDate === null && props.data.planEndDate == null) {
      return true;
    }
    if (
      props.selectedScheduleData.estDate >= props.data.planStartDate &&
      props.selectedScheduleData.estDate <= props.data.planEndDate
    ) {
      return true;
    } else return false;
  };



  return (
    <>
      <ToastContainer autoClose={3000} />

      <Grid container alignItems="center">
        <Grid item xs={10.95}>
          <Grid container alignItems="center" key={`row-${props.index}`}>
            <Grid container spacing={1} marginTop={0}>
              <Grid item xs={1.5}>
                <Box display="flex" flexDirection="column" pl={1}>
                  <Box component="div">
                    <Typography variant="caption">Break</Typography>
                  </Box>
                  <Box component="div">
                    {props.isTrafficked ? (
                      <Typography variant="subtitle2" noWrap>
                        {selectedBreak.label}
                      </Typography>
                    ) : (
                      <Dropdown
                        value={selectedBreak.label}
                        name={`ddlBreak-${props.index}`}
                        variant={"standard"}
                        showLabel={false}
                        id={`ddlBreak-${props.index}`}
                        ddData={props.breakDropdownData}
                        handleChange={(name, value) => {
                          //debugger;
                          handleChange("BREAK", value);
                        }}
                        size="small"
                        disabled={checkDateRange() ? false : true}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={2}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">ISCI</Typography>
                  </Box>
                  <Box component="div">
                    {props.isTrafficked ? (
                      <Typography variant="subtitle2" noWrap>
                        {selectedIsci.label}
                      </Typography>
                    ) : (
                      <Dropdown
                        value={selectedIsci.label}
                        name={`ddlISCI-${props.index}`}
                        variant={"standard"}
                        showLabel={false}
                        id={`ddlISCI-${props.index}`}
                        ddData={isciDropdown}
                        handleChange={(name, value) =>
                          handleChange("ISCI", value)
                        }
                        size="small"
                        disabled={checkDateRange() ? false : true}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={1}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">Title</Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="subtitle2" noWrap>
                      {adTitle}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

            

              <Grid item xs={2.5}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">
                      Advertiser/Campaign
                    </Typography>
                  </Box>
                  <Box component="div" display="flex">
                    {checkDateRange() ? "" : <CircleIcon style={{ color: '#F62727' }} fontSize="small" />}
                    <Typography
                      variant="subtitle2"
                      noWrap
                      title={props.data.campaignOrAdvertiserName}
                      ml={1}
                    >
                      {props.data.campaignOrAdvertiserName || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={2.5}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">Unit | Cost</Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="subtitle2">
                      {props.data.unitTypeName || "-"} |{" "}
                      {props.data.costTypeName || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={0.95}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">Unit Size</Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="subtitle2">
                      {props.data.unitSize || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={1}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Status</Typography>
                </Box>
                <Box component="div">
                
                    {props.data.status===1354? <CircleIcon style={{ color: '#499e3a' }} fontSize="small" />:props.data.status===1353?<CircleIcon style={{ color: '#fcba03' }} fontSize="small" />:props.data.status===1355?<CircleIcon style={{color: '#8adbde' }} fontSize="small" />:''}
                 
                </Box>
              </Box>
            </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" xs={0.35}>
          <IconButton
            size="small"
            title="Copy"
            disabled={checkDateRange() ? false : true}
          >
            <ContentCopyIcon
              onClick={() => {
                checkIsciBreak(props.data.scheduleAdUnitId, props.data);
              }}
            />
          </IconButton>
        </Grid>
        {props.data.marketTypeId === 112 &&
          !props.selectedScheduleData.isTrafficked && (
            <>
              {" "}
              <Grid item xs={0.35}>
                <IconButton
                  size="small"
                  title="Split"
                  disabled={checkDateRange() ? false : true}
                >
                  <CallSplitOutlinedIcon
                    onClick={() => {
                      props.handleSplitUnit(props.data);
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item xs={0.35}>
                <IconButton
                  size="small"
                  title="Merge"
                  disabled={checkDateRange() ? false : true}
                  
                >
                  <CallMergeOutlinedIcon
                    onClick={() => {
                      props.handleMergeUnits(props.data);
                    }}
                  />
                </IconButton>
              </Grid>
            </>
          )}
      </Grid>

      <Divider sx={{ width: "100%" }} />
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

TraffickingUI.displayName = "TraffickingUI";
export default TraffickingUI;
