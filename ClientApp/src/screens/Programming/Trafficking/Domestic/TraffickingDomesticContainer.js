import * as React from "react";
import TraffickingUnassignUI from "./TraffickingUnassignUI";
import TraffickingAssignUI from "./TraffickingAssignUI";
import { Box, IconButton } from "@mui/material";
import AccordionsContainer from "../../../../sharedComponents/Accordions/AccordionsContainer";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import { GetScheduleAdUnit } from "../../../../services/trafficking.service";
import { ToastContainer, toast } from "react-toastify";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

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
  fullHeightAssigned: {
    height: "calc(100vh - 298px)",
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

const TraffickingDomesticContainer = (props) => {
  const classes = useStyles();
  const [expandTrafficking, setExpandTrafficking] = React.useState(true);
  const [expandUnassigned, setExpandUnassigned] = React.useState(true);
  const [isSelectAll, setSelectAll] = React.useState(false);
  const [all, setAll] = React.useState();

  const [unassignedDraggedItem, setUnassignedDraggedItem] = React.useState({});
  const [assignedDraggedItem, setAssignedDraggedItem] = React.useState({});
  const [traffickingData, setTraffickingData] = React.useState([]);

  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [schedulePaidAd, setSchedulePaidAd] = React.useState([]);
  const [scheduleInstAd, setScheduleInstAd] = React.useState([]);
  const [scheduleBillboardAd, setScheduleBillboardAd] = React.useState([]);
  const [scheduleAssigned, setScheduleAssigned] = React.useState([]);
  const [showAddRow, setShowAddRow] = React.useState(false);
  const [networkBreakAndPosition, setNetworkBreakAndPosition] = React.useState(
    []
  );
  const [checkSend, setCheckSend] = React.useState(null);
  const [isTrafficked, setIsTrafficked] = React.useState(false);
  const [orgNetworkBreakAndPosition, setOrgNetworkBreakAndPosition] =
    React.useState([]);

  React.useEffect(() => {
    if (props.selectedScheduleData.isTrafficked) {
      setIsTrafficked(props.selectedScheduleData.isTrafficked);
    }
  }, [props.selectedScheduleData.isTrafficked]);

  const handleAdd = () => {
    setShowAddRow(true);
  };

  const UpdateShowAddRow = (bool) => {
    setShowAddRow(bool);
  };

  const getScheduleAdUnit = (scheduleId) => {
    setShowLoading(true);
    setOpenBackdrop(true);

    GetScheduleAdUnit(scheduleId, false)
      .then((resp) => {
        let paid = resp.filter((ele) => {
          return (
            ele.costTypeName === "Paid" &&
            ele.unitTypeName !== "Billboard" &&
            !ele.break &&
            !ele.position
          );
        });
        let billboard = resp.filter((ele) => {
          return (
            ele.unitTypeName === "Billboard" && !ele.break && !ele.position
          );
        });
        let institutional = resp.filter((ele) => {
          return (
            ele.costTypeName === "Institutional" &&
            ele.unitTypeName !== "Billboard" &&
            !ele.break &&
            !ele.position
          );
        });
        let assigned = resp.filter((ele) => {
          return ele.break !== null && ele.position !== null;
        });
        const result = assigned.filter(
          (data, index, arr) =>
            index ===
            arr.findIndex(
              (t) => t.break === data.break && t.position === data.position
            )
        );

        setSchedulePaidAd(paid);
        setScheduleBillboardAd(billboard);
        setScheduleInstAd(institutional);
        setScheduleAssigned(result);
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

  const handleRefresh = () => {
    getScheduleAdUnit(props.selectedScheduleId);
  };

  React.useEffect(() => {
    getScheduleAdUnit(props.selectedScheduleId);
  }, [props.selectedScheduleId]);

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

  const checkboxClick = (e) => {
    setSelectAll(e.target.checked);
  };

  const handleSelectAll = (bool) => {
    setAll(bool);
  };

  const getUnassignedData = (item) => {
    // setUnassignedDraggedItem({ item: item });
  };

  const getAssignedData = (item) => {
    setAssignedDraggedItem({ item: item });
  };

  const getTraffickData = () => {};

  return (
    <Box height="100%" className="Trafficking">
      <Box>
        <AccordionsContainer
          setClassPosition={true}
          panelName={"trafficking"}
          removeLRPadding={true}
          all={all}
          expand={expandTrafficking}
          title="Trafficking"
          onCheckboxClick={checkboxClick}
          showCheckbox={true}
          handleExpand={handleTraffickingClick}
          showExpandIcon={true}
        >
          <div
            className={
              expandTrafficking && !expandUnassigned
                ? classes.fullHeightAssigned
                : ""
            }
          >
            <TraffickingAssignUI
              handleRefresh={handleRefresh}
              showTraffickLetter={props.showTraffickLetter}
              expandTrafficking={expandTrafficking}
              expandUnassigned={expandUnassigned}
              showAddRow={showAddRow}
              updateShowAddRow={UpdateShowAddRow}
              refreshPage={() => {
                getScheduleAdUnit(props.selectedScheduleId);
                props.refreshPage();
              }}
              selectedScheduleData={props.selectedScheduleData}
              isSelectAll={isSelectAll}
              selectedScheduleId={props.selectedScheduleId}
              fullView={expandTrafficking && expandUnassigned}
              handleSelectAll={handleSelectAll}
              unassignedDraggedItem={unassignedDraggedItem}
              setUnassignedDraggedItem={setUnassignedDraggedItem}
              getAssignedData={getAssignedData}
              assignedDraggedItem={assignedDraggedItem}
              setAssignedDraggedItem={setAssignedDraggedItem}
              traffickingData={traffickingData}
              setTraffickingData={setTraffickingData}
              scheduleBillboardAd={scheduleBillboardAd}
              scheduleInstAd={scheduleInstAd}
              schedulePaidAd={schedulePaidAd}
              setScheduleBillboardAd={setScheduleBillboardAd}
              scheduleAssigned={scheduleAssigned}
              setScheduleAssigned={setScheduleAssigned}
              setSchedulePaidAd={setSchedulePaidAd}
              setScheduleInstAd={setScheduleInstAd}
              showLoading={showLoading}
              openBackdrop={openBackdrop}
              networkBreakAndPosition={networkBreakAndPosition}
              setNetworkBreakAndPosition={setNetworkBreakAndPosition}
              checkSend={checkSend}
              setCheckSend={setCheckSend}
              isTrafficked={isTrafficked}
              setIsTrafficked={setIsTrafficked}
              getScheduleAdUnit={getScheduleAdUnit}
              orgNetworkBreakAndPosition={orgNetworkBreakAndPosition}
              setOrgNetworkBreakAndPosition={setOrgNetworkBreakAndPosition}
            />
          </div>
          <Fab
            title="Add Break and Position"
            size="small"
            color="primary"
            className={classes.fabButton}
            aria-label="add"
            onClick={handleAdd}
          >
            <AddIcon size="small" />
          </Fab>
        </AccordionsContainer>
      </Box>
      <Box mt={1}>
        <AccordionsContainer
          setClassPosition={true}
          panelName={"unassigned"}
          title="Unassigned"
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
            <TraffickingUnassignUI
              selectedScheduleData={props.selectedScheduleData}
              selectedScheduleId={props.selectedScheduleId}
              fullView={expandTrafficking && expandUnassigned}
              getUnassignedData={getUnassignedData}
              assignedDraggedItem={assignedDraggedItem}
              setAssignedDraggedItem={setAssignedDraggedItem}
              unassignedDraggedItem={unassignedDraggedItem}
              setUnassignedDraggedItem={setUnassignedDraggedItem}
              traffickingData={traffickingData}
              setTraffickingData={setTraffickingData}
              scheduleBillboardAd={scheduleBillboardAd}
              scheduleInstAd={scheduleInstAd}
              schedulePaidAd={schedulePaidAd}
              setScheduleBillboardAd={setScheduleBillboardAd}
              setSchedulePaidAd={setSchedulePaidAd}
              setScheduleInstAd={setScheduleInstAd}
              showLoading={showLoading}
              openBackdrop={openBackdrop}
              networkBreakAndPosition={networkBreakAndPosition}
              setNetworkBreakAndPosition={setNetworkBreakAndPosition}
              checkSend={checkSend}
              setCheckSend={setCheckSend}
              isTrafficked={isTrafficked}
              setIsTrafficked={setIsTrafficked}
              orgNetworkBreakAndPosition={orgNetworkBreakAndPosition}
              setOrgNetworkBreakAndPosition={setOrgNetworkBreakAndPosition}
            />
          </div>
        </AccordionsContainer>
      </Box>
    </Box>
  );
};

TraffickingDomesticContainer.displayName = "TraffickingDomesticContainer";
export default TraffickingDomesticContainer;
