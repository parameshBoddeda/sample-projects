import React, { useState, useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography, IconButton, TextField, Autocomplete } from "@mui/material";
import { Article } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { GetSchedules } from "../../../services/common.service";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import TimePicker from "../../../sharedComponents/TimePicker/TimePicker";
import AppDataContext from "../../../../src/common/AppContext";
import * as AppConstants from "../../../../src/common/AppConstants";
import { toast } from "react-toastify";
import Helper from "../../../../src/common/Helper";
import {
  EditScheduleData,
  DeleteScheduleData,
  GetEpisodesList,
} from "../../../../src/services/inventory.service";
import ConfrimDialog from "../../../sharedComponents/Dialog/ConfirmDialog";
import * as AppLanguage from '../../../common/AppLanguage';

function notifyWarning(message) {
  toast.warning(message);
}
function notifySuccess(message) {
  toast.success(message);
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const useStyles = makeStyles((theme) => ({
  rowContainer: {
    border: "none",
    borderBottom: "1px solid",
    width: "100%",
  },
  container: {
    padding: "16px 0px",
    width: "100%",
  },
  episodes: {
    minWidth: theme.spacing(15),
    maxWidth: theme.spacing(15),
    "& .MuiInputLabel-root": {
      fontSize: ".75rem",
    },
    "& .MuiInputBase-input": {
      fontSize: ".75rem",
      padding: theme.spacing(0, 0.5, 0, 0.75) + "!important",
    },
  },
  time: {
    "& .MuiInputBase-input": {
      fontSize: ".75rem",
      padding: theme.spacing(0.75),
    },
  },
  date1: {
    "& .MuiInputLabel-root": {
      fontSize: ".75rem",
      transform: "translate(14px, 6px) scale(1)",
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.35, 0.75),
    },
  },
  done: {
    color: "#3BB11E !important",
  },
  cancel: {
    color: "#C81020 !important",
  },
  refresh: {
    color: "#F6AB27 !important",
  },
  statusActual: {
    color: "#469a10",
  },
  validFrom: {
    width: "-webkit-fill-available",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ScheduleUI = (props) => {
  let { data, index, view } = props;

  const [showEditable, setShowEditable] = React.useState();
  const [schedulesdata, setSchedulesdata] = useState([]);
  const [userAction, setUserAction] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { username, userId } = useContext(AppDataContext);
  const [episodeName, setEpisodeName] = useState("");
  const [estDate, setEstDate] = useState("");
  const [estTime, setEstTime] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [EditSchedule, setEditSchedule] = useState({
    scheduleId: data.scheduleId,
    estDate: data.estDate,
    estTime: data.estTime,
    episodeName: data.episodeName,
  });
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    if (data?.episodeName) {
      setEditSchedule(data);
    }
  }, [data]);

  const classes = useStyles();
  const handleClick = (index) => {
    if (showEditable) {
      return false;
    }
    let temp = {
      index: index,
      edit: true,
    };
    setEditSchedule(temp);
  };

  const handleDone = (index) => {
    if (showEditable && showEditable.index === index) {
      setShowEditable(null);
    }
  };

  const handleChecked = (index) => {};

  const handlednaChecked = (index) => {};

  const handleEditDeleteClick = (index, InventoryId, caller) => {
    if (caller === "updateSchedule") {
      setUserAction("updateSchedule");
      setEpisodeName(data.episodeName);
      setEstDate(Helper.FormatDateToYYYYMMDD(data.estDate));
      setEstTime(data.estTime.split(" ")[1]);
      setScheduleId(data.id);
      setIsEditing(true);
      return;
    }
  };

  const handleSaveCancelActions = (caller) => {
    if (caller === "cancel") {
      setIsEditing(false);
      setEpisodeName("");
      setEstDate("");
      setEstTime("");
      setScheduleId();
      return;
    } else if (caller === "save") {
      callApiToSaveData("save");
    }
  };
  const callApiToSaveData = (caller) => {
    if (caller === "save") {
      if (episodeName == "") {
        notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Episode Name"));
        
        return;
      }
      if (estDate == "") {
        notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Est AirDate"));
        return;
      }
      if (estTime == "") {
        notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Est AirTime"));
        return;
      }

      if (
        Helper.FormatToIsoDate(estDate) <
          Helper.FormatToIsoDate(props.seasonStartDate) ||
        Helper.FormatToIsoDate(estDate) >
          Helper.FormatToIsoDate(props.seasonEndDate)
      ) {
        notifyWarning(
          "Make sure EST AirDate falls between season start date and season end date"
        );
        return;
      }
      let reqObj = {
        scheduleId: scheduleId,
        episodeName: episodeName,
        estTime: estTime,
        estDate: estDate,
        user: username,
      };
      editScheduleData(reqObj);
    }
  };

  const editScheduleData = (obj) => {
    EditScheduleData(obj)
      .then((data) => {
        notifySuccess("Schedule updated successfully");
        setIsEditing(false);
        props.refreshDataFromDB();
      })
      .catch((err) => console.log(err));
    if (!props.episodesNames.includes(obj.episodeName)) {
      let allEpisodes = [...props.episodesNames, obj.episodeName];
      props.setEpisodesName(allEpisodes);
    }
  };

  const handleDeleteActions = (caller) => {
    console.log(caller);
    if (caller === "deleteSchedule") {
      setUserAction("deleteSchedule");
      setScheduleId(data.id);
      setIsEditing(false);
      deleteScheduleData(data.id);
    }
  };

  const deleteScheduleData = (id) => {
    DeleteScheduleData(id)
      .then((data) => {
        notifySuccess("Schedule deleted successfully");
        props.refreshDataFromDB();
      })
      .catch((err) => console.log(err));
  };

  const getSchedules = () => {
    GetSchedules()
      .then((schdata) => {
        setSchedulesdata(schdata);
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleEpisodeNameChange = (e) => {
    setEpisodeName(e.target.value);
  };

  const handleEstDateChange = (e) => {
    setEstDate(e.target.value);
  };

  const handleEstTimeChange = (value) => {
    setEstTime(value);
  };

  const handleAirTimeBlur = (value) => {
    setEstTime(value);
  };

  const handleDialogCancel = () => {
    setOpenDialog(false);
  };
  const handleDialogOpen = (index) => {
    setUserAction("deleteSchedule");
    setOpenDialog(true);
  };

  return (
    <React.Fragment>
      <Grid
        key={`Grid${index}`}
        onClick={() => handleChecked(index)}
        item
        xs={12}
      >
        <Grid container>
          <Grid item xs={0.75}>
            <Box
              component="div"
              display="flex"
              alignItems="center"
              pl={1}
              pt={1}
            >
              <Article
                className={`${data.status === 703 ? classes.statusActual : ""}`}
              />
            </Box>
          </Grid>
          <Grid item xs={10.6}>
            <Grid container spacing={1} marginTop={0}>
              <Grid item xs={isEditing ? 7 : 3.5}>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {data.assetName ? data.assetName : "-"}
                  </Typography>
                </Box>
                <Box></Box>
                <Box display="flex" flexDirection="column">
                  {isEditing && userAction === "updateSchedule" ? (
                    <Box display="flex">
                      <Typography variant="caption">
                        {data.gameId ? data.gameId : data.id ? data.id : "-"} |{" "}
                      </Typography>
                      <Box display="flex" flex="1">
                        {/* <TextField
                          id="rate"
                          size="small"
                          variant="standard"
                          type="text"
                          label=""
                          value={episodeName}
                          onChange={handleEpisodeNameChange}
                        /> */}
                        <Autocomplete
                          size="small"
                          open={open}
                          freeSolo
                          fullWidth
                          onOpen={() => {
                            if (inputValue && inputValue.length > 1) {
                              setOpen(true);
                            }
                          }}
                          // sx={{ width: 80 }}
                          onClose={() => setOpen(false)}
                          inputValue={inputValue}
                          onInputChange={(e, value, reason) => {
                            setInputValue(value);
                            setEpisodeName(value);

                            if (!value) {
                              setOpen(false);
                            }
                          }}
                          options={props.episodesNames}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // label="Episode name"
                              variant="standard"
                              size="small"
                              fullWidth
                              // value={episodeName}
                              // onChange={handleEpisodeNameChange}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box component="div" display="flex">
                        <Typography variant="caption">
                          {data.gameId ? data.gameId : data.id ? data.id : "-"}{" "}
                          | {data.episodeName ? data.episodeName : "-"}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={isEditing ? 5 : 8.5}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="subtitle2" title="Network">
                      {data.networkName ? data.networkName : "-"}
                    </Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="caption">
                      {data.regionName ? data.regionName : "USA"} |{" "}
                      {data.countryName ? data.countryName : "USA"}{" "}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={isEditing ? 7 : 3.5}>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center">
                    <Box component="div" display="flex" flexDirection="column">
                      {isEditing && userAction === "updateSchedule" ? (
                        <>
                          <Typography variant="caption">EST AirDate</Typography>
                          <Box component="div">
                            <TextField
                              className={classes.validFrom}
                              id="Est AirDate"
                              size="small"
                              variant="standard"
                              type="date"
                              label=""
                              InputLabelProps={{ shrink: true }}
                              value={estDate}
                              onChange={(e) => handleEstDateChange(e)}
                            />
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="caption">EST AirDate</Typography>

                          <Box component="div">
                            <Typography variant="caption">
                              {data.estDate ? data.estDate.split(" ")[0] : "-"}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Box mr={0.5} ml={0.5}>
                        |
                      </Box>
                      <Box mr={0.5} ml={0.5}>
                        |
                      </Box>
                    </Box>
                    <Box component="div" display="flex" flexDirection="column">
                      {isEditing && userAction === "updateSchedule" ? (
                        <>
                          <Typography variant="caption">Time</Typography>
                          <Box component="div" pb={0.5}>
                            <TimePicker
                              className={classes.validFrom}
                              defaultValue={estTime}
                              size="small"
                              fullWidth
                              textboxData={estTime}
                              lblName=""
                              handleChange={handleEstTimeChange}
                              handleBlur={handleAirTimeBlur}
                            />
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="caption">Time</Typography>
                          <Box component="div">
                            <Typography variant="caption">
                              {data.estTime ? data.estTime.split(" ")[1] : "-"}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              {data.gameId != null ? (
                <>
                  {/* { isEditing ? (<> */}
                  <Grid item xs={3.75}>
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" alignItems="center">
                        <Box
                          component="div"
                          display="flex"
                          flexDirection="column"
                        >
                          <Typography variant="caption">
                            Regional Air Date
                          </Typography>
                          <Typography variant="caption">
                            {data.regionalDate
                              ? data.regionalDate.split(" ")[0]
                              : "-"}
                          </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Box mr={0.5} ml={0.5}>
                            |
                          </Box>
                          <Box mr={0.5} ml={0.5}>
                            |
                          </Box>
                        </Box>
                        <Box
                          component="div"
                          display="flex"
                          flexDirection="column"
                        >
                          <Typography variant="caption">Time</Typography>
                          <Typography variant="caption">
                            {data.regionalTime
                              ? data.regionalTime.split(" ")[1]
                              : "-"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              <Grid item xs={isEditing ? 5 : 4.75}>
                <Box display="flex" alignItems="center">
                  <Box component="div" display="flex" flexDirection="column">
                    <Typography variant="caption">Sellable</Typography>
                    <Typography variant="caption">
                      {data.usedSalesUnit ? data.usedSalesUnit : "0"}/
                      {data.totSalesUnit ? data.totSalesUnit : "0"}
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="column">
                    <Box mr={0.5} ml={0.5}>
                      |
                    </Box>
                    <Box mr={0.5} ml={0.5}>
                      |
                    </Box>
                  </Box>
                  <Box component="div" display="flex" flexDirection="column">
                    <Typography variant="caption">Institutional</Typography>
                    <Typography variant="caption">
                      {data.usedInstUnit ? data.usedInstUnit : "0"}/
                      {data.totInstUnit ? data.totInstUnit : "0"}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Box mr={0.5} ml={0.5}>
                      |
                    </Box>
                    <Box mr={0.5} ml={0.5}>
                      |
                    </Box>
                  </Box>
                  <Box component="div" display="flex" flexDirection="column">
                    <Typography variant="caption">Billboard</Typography>
                    <Typography variant="caption">
                      {data.usedBillboardUnit ? data.usedBillboardUnit : "0"}/
                      {data.totBillboardUnit ? data.totBillboardUnit : "0"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {data.gameId === null ? (
            <>
              <Grid
                container
                flexDirection="column"
                justifyContent="space-between"
                xs={0.65}
                pb={1}
              >
                {!isEditing ? (
                  <>
                    <IconButton
                      title="Update Schedule"
                      size="small"
                      onClick={() =>
                        handleEditDeleteClick(index, data.id, "updateSchedule")
                      }
                    >
                      <CreateOutlinedIcon fontSize="small" />
                    </IconButton>
                    {data.plannedUnitCount === 0 ? (
                      <IconButton
                        title="Delete Schedule"
                        size="small"
                        onClick={() => handleDialogOpen(index + 1)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <></>
                    )}
                    {userAction === "deleteSchedule" && (
                      <ConfrimDialog
                        open={openDialog}
                        title={"Delete Schedule"}
                        description={
                          "Are you sure, You want to delete schedule?"
                        }
                        ok={"OK"}
                        cancel={"Cancel"}
                        handleDialogOk={() =>
                          handleDeleteActions("deleteSchedule")
                        }
                        handleDialogCancel={handleDialogCancel}
                      ></ConfrimDialog>
                    )}
                  </>
                ) : (
                  <>
                    <IconButton
                      color="primary"
                      title="Save Change"
                      size="small"
                      onClick={() => handleSaveCancelActions("save")}
                    >
                      <SaveOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      title="Cancel Change"
                      size="small"
                      onClick={() => handleSaveCancelActions("cancel")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

ScheduleUI.displayName = "InventoryScheduleUI";
export default ScheduleUI;
