import React, { useEffect, useState } from "react";
import AppDataContext from "../../../../common/AppContext";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import { UpdateTraffickingData } from "../../../../services/trafficking.service";
import { Box, Grid, Typography, IconButton, Tooltip } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@mui/material/Backdrop";
import CircleIcon from "@mui/icons-material/Circle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const useStyles = makeStyles((theme) => ({}));

const AssignedUI = (props) => {
  const { data, index } = props;

  const { username } = React.useContext(AppDataContext);
  const classes = useStyles();
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [dragTrafficData, setDragTrafficData] = useState({});
  const [selectedIsci, setSelectedIsci] = useState({
    id: "",
    label: "",
    title: "",
  });
  const [isciDropdown, setIsciDropdown] = useState();

  const handleChange = (name, value, data) => {
    setSelectedIsci(value);
    if (props.setIsci) {
      props.setIsci(data.scheduleAdUnitId, value.value);
    }
    let params = {
      scheduleAdUnitId: data.scheduleAdUnitId,
      scheduleId: data.scheduleId,
      adId: value.value,
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
          notifySuccess("Data saved successfully..!");
          props.getScheduleAdUnit(data.scheduleId);
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

  useEffect(() => {
    
      setSelectedIsci({
        label: data.adISCI,
        value: data.id,
        title: data.adTitle,
      });
    
  }, [data.adId]);

  useEffect(() => {
    let tempIsciList = [];
    if (data.isciInfo) {
      data.isciInfo.map((ele) => {
        tempIsciList.push({ value: ele.id, label: ele.isci, title: ele.title });
      });
    }

    setIsciDropdown(tempIsciList);
  }, [data.isciInfo]);

  const checkDateRange = () => {
    if (props.data.planEndDate === null && props.data.planEndDate == null) {
      return true;
    }
    if (
      props.selectedScheduleData.estDate >= data.planStartDate &&
      props.selectedScheduleData.estDate <= data.planEndDate
    ) {
      return true;
    } else return false;
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Grid
        item
        xs={12}
        draggable
        // onDragStart={(e) => handleTrafficDragStart(e, index, data)}
        // onDragEnter={(e) => handleTrafficDragEnter(e, index)}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <Grid container alignItems="center" key={`row-${index}`}>
          <Grid container spacing={1} marginTop={0}>
            <Grid item xs={0.5}>
              <IconButton size="small">
                <DragIndicatorIcon size="small" />
              </IconButton>
            </Grid>

            <Grid item xs={1.75}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">ISCI</Typography>
                </Box>
                <Box component="div">
                  {!props.isTrafficked ? (
                    <Dropdown
                      value={selectedIsci.label}
                      name={`ddlISCI-${index}`}
                      variant={"standard"}
                      showLabel={false}
                      id={`ddlISCI-${index}`}
                      ddData={isciDropdown}
                      handleChange={(name, value) =>
                        handleChange(name, value, data)
                      }
                      size="small"
                      disabled={checkDateRange() ? false : true}
                    />
                  ) : (
                    <Typography variant="subtitle2">
                      {selectedIsci.label || "-"}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1.5}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Title</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" noWrap title={data.title}>
                    {selectedIsci.title || "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={2.25}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Advertiser/Campaign</Typography>
                </Box>
                <Box component="div" display="flex">
                  {checkDateRange() ? (
                    ""
                  ) : (
                    <Tooltip title="Invalid campaign date range" arrow>
                      <ErrorOutlineIcon color="secondary" fontSize="small" />
                    </Tooltip>
                  )}
                  <Typography
                    variant="subtitle2"
                    noWrap
                    title={data.campaignOrAdvertiserName}
                  >
                    {data.campaignOrAdvertiserName || "-"}
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
                  {props.data.status === 1354 ? (
                    <CircleIcon style={{ color: "#499e3a" }} fontSize="small" />
                  ) : props.data.status === 1353 ? (
                    <CircleIcon style={{ color: "#fcba03" }} fontSize="small" />
                  ) : props.data.status === 1355 ? (
                    <CircleIcon style={{ color: "#8adbde" }} fontSize="small" />
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Unit Size</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {data.unitSize || "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Unit Type</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {data.unitTypeName || "-"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">
                    Proposed ISCI | Break position
                  </Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {data.proposedAdTitle || "-"} |{" "}
                    {data.proposedBreakPosition || "-"}
                  </Typography>
                </Box>
              </Box>
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
    </>
  );
};

AssignedUI.displayName = "AssignedUI";
export default AssignedUI;
