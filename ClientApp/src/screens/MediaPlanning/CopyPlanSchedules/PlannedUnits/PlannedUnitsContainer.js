import React, { useState } from "react";
import AccordionsContainer from "../../../../sharedComponents/Accordions/AccordionsContainer";
import PlannedUnitList from "./PlannedUnitList";
import { Box, IconButton, Paper } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
// import CopySchedulesFilterContainer from "../CopySchedulesFilter/CopySchedulesFilterContainer";
import CopyScheduleFilterContainer from "../CopySchedulesFilter/CopyScheduleFilterContainer";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
    height: "calc(100vh - 260px)",
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

const PlannedUnitsContainer = (props) => {
  const classes = useStyles();

  const [showLoading, setShowLoading] = React.useState(false);
  const [expandTrafficking, setExpandTrafficking] = React.useState(true);
  const [expandUnassigned, setExpandUnassigned] = React.useState(true);
  const [currentScheduleAdUnit, setCurrentScheduleAdUnit] =
    React.useState(null);
  const [allPlannedScheduleUnits, setAllPlannedScheduleUnits] = useState([]);
  const [mediaTypeId, setMediaTypeId] = useState(null);
  const [sourceUnits, setSourceUnits] = useState([]);
  const [minimumStartDate,setMinimumStartDate] =useState(null);
  const [maximumEndDate,setMaximumEndDate] =useState(null);

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
    <Box height="100%" className="Trafficking">
      <Box>
        <AccordionsContainer
          panelName={"plannedunits"}
          removeLRPadding={true}
          title="Schedule Copy"
          setClassPosition={true}
          expand={expandTrafficking}
          handleExpand={handleTraffickingClick}
          showExpandIcon={true}
          // expandTraffickList={expandTraffickList}
          // expandFiltered={expandFiltered}
        >
          <div>
            <PlannedUnitList
              selectedScheduleId={props.selectedScheduleId}
              planTypeValue={props.planTypeValue}
              selectedScheduleData={props.selectedScheduleData}
              setAllPlannedScheduleUnits={setAllPlannedScheduleUnits}
              mediaTypeId={mediaTypeId}
              setMediaTypeId={setMediaTypeId}
              setSourceUnits={setSourceUnits}
              handleTraffickingClick={handleTraffickingClick}
              expandTrafficking={expandTrafficking}
              expandUnassigned={expandUnassigned}
              fullView={expandTrafficking && expandUnassigned}
              ros={props.ros}
              setMinimumStartDate={setMinimumStartDate}
              setMaximumEndDate={setMaximumEndDate}
            />
          </div>
        </AccordionsContainer>
      </Box>

      <Box mt={1}>
        <AccordionsContainer
          setClassPosition={true}
          panelName={"Copy"}
          // removeLRPadding={true}
          title="Copy"
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
            <CopyScheduleFilterContainer
              setShowLoading={props.setShowLoading}
              setOpenBackdrop={props.setOpenBackdrop}
              selectedScheduleId={props.selectedScheduleId}
              selectedScheduleData={props.selectedScheduleData}
              allPlannedScheduleUnits={allPlannedScheduleUnits}
              mediaTypeId={mediaTypeId}
              sourceUnits={sourceUnits}
              fullView={expandTrafficking && expandUnassigned}
              ros={props.ros}
              planTypeValue={props.planTypeValue}
              minimumStartDate={minimumStartDate}
              maximumEndDate={maximumEndDate}
            />
          </div>
        </AccordionsContainer>
      </Box>
    </Box>
  );
};

PlannedUnitsContainer.displayName = "PlannedUnitsContainer";
export default PlannedUnitsContainer;
