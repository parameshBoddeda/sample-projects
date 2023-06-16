import React from "react";
import TrafficRosList from "./TrafficRosList";
import { Box, Container } from "@mui/material";
import AccordionsContainer from "../../../../sharedComponents/Accordions/AccordionsContainer";
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import RosTraffickingCopyUI from "../Copy/RosTraffickingCopyUI";

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 189px)",
    overflowY: "auto",
  },
  traffickingDataHeader: {
    backgroundColor: "#e3edff",
  },
  halfContentHeight: {
    height: "calc(50vh - 145px)",
  },
  fullHeightTrafficking: {
    height: "calc(100vh - 254px)",
  },
  fullHeightUnassigned: {
    height: "calc(100vh - 208px)",
  },
  showOverflow: {
    overflowY: "auto",
  },
  fabButton: {
    margin: theme.spacing(1) + "px !important",
    marginTop: theme.spacing(1) + "px !important",
    marginBottom: theme.spacing(1) + "px !important",
    minHeight: "25px !important",
    height: "25px !important",
    width: "25px !important",
  },
}));
function notifyWarning(message) {
  toast.warning(message);
}

const TrafficRosContainer = (props) => {
  const classes = useStyles();

  const [expandTrafficking, setExpandTrafficking] = React.useState(true);
  const [expandUnassigned, setExpandUnassigned] = React.useState(false);
  const [currentScheduleAdUnit, setCurrentScheduleAdUnit] =
    React.useState(null);
  const [currentData, setCurrentData] = React.useState(null);
  const [currentSelectedIsci, setCurrentSelectedIsci] = React.useState(null);
  const [currentSelectedBreak, setCurrentSelectedBreak] = React.useState(null);
  const [currentMediaType, setCurrentMediaType] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [showCopy, setShowCopy] = React.useState(false);

  const handleTraffickingClick = (state) => {
    if (!state) {
      if (!expandUnassigned) {
        setExpandUnassigned(true);
      }
    }
    setExpandTrafficking(state);
  };

  const handleUnassignedClick = (state) => {
    if (!state) {
      if (!expandTrafficking) {
        setExpandTrafficking(true);
      } 
    }
    setExpandUnassigned(state);
  };
  return (
    <Container maxWidth={false} disableGutters className={classes.container}>
      
        <AccordionsContainer
          panelName={"trafficking"}
          removeLRPadding={true}
          title="Trafficking"
          showExpandIcon={true}
          setClassPosition={true}
          expand={expandTrafficking}
          handleExpand={handleTraffickingClick}
        >
          <div>
          <TrafficRosList
            showTraffickLetter={props.showTraffickLetter}
            selectedScheduleId={props.selectedScheduleId}
            selectedScheduleData={props.selectedScheduleData}
            expandTrafficking={expandTrafficking}
            expandUnassigned={expandUnassigned}
            fullView={expandTrafficking && expandUnassigned}
            handleTraffickingClick={handleTraffickingClick}
            setCurrentData={setCurrentData}
            setCurrentSelectedIsci={setCurrentSelectedIsci}
            setCurrentSelectedBreak={setCurrentSelectedBreak}
            setCurrentScheduleAdUnit={setCurrentScheduleAdUnit}
            currentScheduleAdUnit={currentScheduleAdUnit}
            setCurrentMediaType={setCurrentMediaType}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            refreshPage={props.refreshPage}
            showCopy={showCopy}
            setShowCopy={(val)=>{
              setShowCopy(val);
            }}
          />
          </div>
        </AccordionsContainer>
      

      <Box mt={1}>
        {showCopy ? <AccordionsContainer
          panelName={"Copy"}
          // removeLRPadding={true}
          title="Copy"
          setClassPosition={true}
          isOtherExpand={expandTrafficking}
          expand={expandUnassigned}
          handleExpand={handleUnassignedClick}
          showExpandIcon={true}
        >
          <div
            className={
              expandTrafficking && expandUnassigned
                ? classes.halfContentHeight
                : expandUnassigned
                ? classes.fullHeightUnassigned
                : ""
            }
          >
            <RosTraffickingCopyUI
              currentScheduleAdUnit={currentScheduleAdUnit}
              fullView={expandTrafficking && expandUnassigned}
              currentData={currentData}
              currentSelectedIsci={currentSelectedIsci}
              currentSelectedBreak={currentSelectedBreak}
              selectedScheduleId={props.selectedScheduleId}
              selectedScheduleData={props.selectedScheduleData}
              startDate={startDate}
              endDate={endDate}
              setShowCopy={(val)=>{
                setShowCopy(val);
              }}
            />
          </div>
        </AccordionsContainer> : ""}
      </Box>
    </Container>
  );
};

TrafficRosContainer.displayName = "TrafficRosContainer";
export default TrafficRosContainer;
