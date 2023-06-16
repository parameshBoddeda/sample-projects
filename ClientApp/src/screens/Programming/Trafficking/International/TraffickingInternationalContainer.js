import * as React from "react";
import TraffickingList from "./TraffickingList";
import { Box, IconButton, Container } from "@mui/material";
import AccordionsContainer from "../../../../sharedComponents/Accordions/AccordionsContainer";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import InternationalTraffickingCopyUI from "../Copy/InternationalTraffickingCopyUI";
import SubHeader from "../../../../sharedComponents/SubHeader/SubHeader";

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

const TraffickingInternationalContainer = (props) => {
  const classes = useStyles();
  const [showLoading, setShowLoading] = React.useState(false);
  const [expandTraffickList, setExpandTraffickList] = React.useState(true);
  const [expandFiltered, setExpandFiltered] = React.useState(true);
  const [expandTrafficking, setExpandTrafficking] = React.useState(true);
  const [expandUnassigned, setExpandUnassigned] = React.useState(false);
  const [currentScheduleAdUnit, setCurrentScheduleAdUnit] =
    React.useState(null);
  const [currentData, setCurrentData] = React.useState(null);
  const [currentSelectedIsci, setCurrentSelectedIsci] = React.useState(null);
  const [currentSelectedBreak, setCurrentSelectedBreak] = React.useState(null);
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
    <React.Fragment>
      
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
            <TraffickingList
              showTraffickLetter={props.showTraffickLetter}
              expandTrafficking={expandTrafficking}
              expandUnassigned={expandUnassigned}
              selectedScheduleData={props.selectedScheduleData}
              selectedScheduleId={props.selectedScheduleId}
              setCurrentScheduleAdUnit={setCurrentScheduleAdUnit}
              currentScheduleAdUnit={currentScheduleAdUnit}
              handleTraffickingClick={handleTraffickingClick}
              setCurrentData={setCurrentData}
              setCurrentSelectedIsci={setCurrentSelectedIsci}
              setCurrentSelectedBreak={setCurrentSelectedBreak}
              fullView={expandTrafficking && expandUnassigned}
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
              <InternationalTraffickingCopyUI
                selectedScheduleData={props.selectedScheduleData}
                selectedScheduleId={props.selectedScheduleId}
                currentScheduleAdUnit={currentScheduleAdUnit}
                fullView={expandTrafficking && expandUnassigned}
                currentData={currentData}
                currentSelectedIsci={currentSelectedIsci}
                currentSelectedBreak={currentSelectedBreak}
                setShowCopy={(val)=>{
                  setShowCopy(val);
                }}
              />
            </div>
          </AccordionsContainer> : ""}
        </Box>
      </Container>
    </React.Fragment>
  );
};

TraffickingInternationalContainer.displayName =
  "TraffickingInternationalContainer";
export default TraffickingInternationalContainer;
