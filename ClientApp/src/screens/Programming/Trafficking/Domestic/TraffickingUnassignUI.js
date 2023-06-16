import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { UpdateTraffickingData } from "../../../../services/trafficking.service";
import AppDataContext from "../../../../common/AppContext";

import UnassignedUI from "./UnassignedUI";

function notifySuccess(message) {
  toast.success(message);
}

function notifyWarning(message) {
  toast.warning(message);
}

const useStyles = makeStyles((theme) => ({
  textOverflowEllipsis: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  compaignId: {
    paddingLeft: theme.spacing(5.5) + "px !important",
  },
  unassignedContent: {
    height: "calc(100vh - 230px)",
    overflowY: "auto",
    marginLeft: theme.spacing(0.1),
  },
  unassignedContentHalf: {
    height: "calc(50vh - 167px)",
    overflowY: "auto",
    marginLeft: theme.spacing(0.1),
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const TraffickingUnassignUI = (props) => {
  let { data, index, view } = props;

  const [showEditable, setShowEditable] = React.useState();
  const [unassignedType, setUnassignedType] = React.useState("");
  const { username, userId } = React.useContext(AppDataContext);
  const [scheduleAdId, setScheduleAdId] = React.useState("");

  const [scheduleId, setScheduleId] = React.useState("");
  const [isciId, setIsciId] = React.useState("");
  const [unassignedDrop, setUnassignedDrop] = React.useState(false);
  // const [isTrafficked, setIsTrafficked] = React.useState(false);

  const classes = useStyles();
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const saveUnassignedData = (obj) => {
    setShowLoading(true);
    setOpenBackdrop(true);

    UpdateTraffickingData(obj)
      .then((resp) => {
        if (resp) {
          setShowLoading(false);
          setOpenBackdrop(false);
          // notifySuccess("Data saved successfully..!");
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
  const refreshAssignedTrafficData = () => {
    if (props.isTrafficked) {
      return false;
    }

    const mapped = props.networkBreakAndPosition.map((item, index) => {
      if (
        item.traffickingRecord?.scheduleAdUnitId ==
        props.assignedDraggedItem.item.scheduleAdUnitId
      ) {
        return { ...item, traffickingRecord: undefined };
      } else return item;
    });
    props.setNetworkBreakAndPosition(mapped);
    props.setOrgNetworkBreakAndPosition(mapped);
  };

  // React.useEffect(() => {
  //   if (props.selectedScheduleData.isTrafficked) {
  //     setIsTrafficked(props.selectedScheduleData.isTrafficked);
  //   }
  // }, [props.selectedScheduleData.isTrafficked]);

  React.useEffect(() => {
    if (props.checkSend == false && unassignedDrop) {
      const data = {
        scheduleAdUnitId: scheduleAdId,
        scheduleId: scheduleId,
        break: null,
        user: username,
        position: null,
        assigned: 0,
        adId: isciId,
      };
      saveUnassignedData(data);
      setUnassignedDrop(false);
      props.setCheckSend(true);
    }
  }, [props.checkSend, unassignedDrop]);

  const handleUnassignedDrop = () => {
    if (Object.keys(props.assignedDraggedItem).length !== 0) {
      setScheduleAdId(props.assignedDraggedItem.item.scheduleAdUnitId);
      setScheduleId(props.assignedDraggedItem.item.scheduleId);
      setIsciId(props.assignedDraggedItem.item.adId);
      if (
        props.assignedDraggedItem.item.costTypeName === "Paid" &&
        props.assignedDraggedItem.item.unitTypeName !== "Billboard"
      ) {
        const copiedData = [...props.schedulePaidAd];

        const newCopiedData = [...copiedData, props.assignedDraggedItem.item];
        const removeBreakPositions = newCopiedData.map((item, index) => {
          let newItem = { ...item, break: null, position: null };
          return newItem;
        });

        props.setSchedulePaidAd(removeBreakPositions);
      } else if (
        props.assignedDraggedItem.item.costTypeName === "Institutional" &&
        props.assignedDraggedItem.item.unitTypeName !== "Billboard"
      ) {
        const copiedData = [...props.scheduleInstAd];

        const newCopiedData = [...copiedData, props.assignedDraggedItem.item];
        const removeBreakPositions = newCopiedData.map((item, index) => {
          let newItem = { ...item, break: null, position: null };
          return newItem;
        });
        props.setScheduleInstAd(removeBreakPositions);
      } else if (props.assignedDraggedItem.item.unitTypeName === "Billboard") {
        const copiedData = [...props.scheduleBillboardAd];

        const newCopiedData = [...copiedData, props.assignedDraggedItem.item];
        const removeBreakPositions = newCopiedData.map((item, index) => {
          let newItem = { ...item, break: null, position: null };
          return newItem;
        });
        props.setScheduleBillboardAd(removeBreakPositions);
      }
      props.setCheckSend(false);
      setUnassignedDrop(true);
    } else if (Object.keys(props.unassignedDraggedItem).length !== 0) {
      if (
        props.unassignedDraggedItem.item?.costTypeName === "Paid" &&
        props.unassignedDraggedItem.item?.unitTypeName !== "Billboard" &&
        (unassignedType == "Institutional" ||
          unassignedType == "Billboard" ||
          unassignedType == "Paid")
      ) {
        return;
      } else if (
        props.unassignedDraggedItem.item?.costTypeName === "Institutional" &&
        props.unassignedDraggedItem.item?.unitTypeName !== "Billboard" &&
        (unassignedType == "Paid" ||
          unassignedType == "Billboard" ||
          unassignedType == "Institutional")
      ) {
        return;
      } else if (
        (props.unassignedDraggedItem.item?.costTypeName === "Billboard" ||
          props.unassignedDraggedItem.item?.unitTypeName === "Billboard") &&
        (unassignedType == "Paid" ||
          unassignedType == "Billboard" ||
          unassignedType == "Institutional")
      ) {
        return;
      }
    }

    props.setUnassignedDraggedItem({});
    props.setAssignedDraggedItem({});
    refreshAssignedTrafficData();
    // setCheckSend(true);
  };

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <Grid key={`Grid${props.key}`} item xs={12}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={4}
                onDrop={() => handleUnassignedDrop()}
                onDragOver={(e) => {
                  e.preventDefault();

                  setUnassignedType("Paid");
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="medium"
                >
                  Paid
                </Typography>
                <Paper
                  elevation={1}
                  className={
                    props.fullView
                      ? classes.unassignedContentHalf
                      : classes.unassignedContent
                  }
                >
                  {props.schedulePaidAd.length > 0 &&
                    props.schedulePaidAd.map((ele, index) => {
                      return (
                        <UnassignedUI
                          data={ele}
                          index={index}
                          key={ele.scheduleAdUnitId}
                          // getUnassignedData={props.getUnassignedData}
                          setUnassignedDraggedItem={
                            props.setUnassignedDraggedItem
                          }
                        />
                      );
                    })}

                  {props.schedulePaidAd.length < 1 && (
                    <Typography pl={1} pt={1} variant="subtitle1">
                      No Record.
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid
                item
                xs={4}
                onDrop={() => handleUnassignedDrop()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setUnassignedType("Institutional");
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="medium"
                >
                  Institutional
                </Typography>
                <Paper
                  elevation={1}
                  className={
                    props.fullView
                      ? classes.unassignedContentHalf
                      : classes.unassignedContent
                  }
                >
                  {props.scheduleInstAd.length > 0 &&
                    props.scheduleInstAd.map((ele, index) => {
                      return (
                        <UnassignedUI
                          data={ele}
                          index={index}
                          key={ele.scheduleAdUnitId}
                          // getUnassignedData={props.getUnassignedData}
                          setUnassignedDraggedItem={
                            props.setUnassignedDraggedItem
                          }
                        />
                      );
                    })}

                  {props.scheduleInstAd.length < 1 && (
                    <Typography pl={1} pt={1} variant="subtitle1">
                      No Record.
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid
                item
                xs={4}
                onDrop={() => handleUnassignedDrop()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setUnassignedType("Billboard");
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="medium"
                >
                  Billboard
                </Typography>
                <Paper
                  elevation={1}
                  className={
                    props.fullView
                      ? classes.unassignedContentHalf
                      : classes.unassignedContent
                  }
                >
                  {props.scheduleBillboardAd.length > 0 &&
                    props.scheduleBillboardAd.map((ele, index) => {
                      return (
                        <UnassignedUI
                          data={ele}
                          index={index}
                          key={ele.scheduleAdUnitId}
                          // getUnassignedData={props.getUnassignedData}
                          setUnassignedDraggedItem={
                            props.setUnassignedDraggedItem
                          }
                        />
                      );
                    })}

                  {props.scheduleBillboardAd.length < 1 && (
                    <Typography pl={1} pt={1} variant="subtitle1">
                      No Record.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

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
    </React.Fragment>
  );
};

TraffickingUnassignUI.displayName = "TraffickingUnassignUI";
export default TraffickingUnassignUI;
