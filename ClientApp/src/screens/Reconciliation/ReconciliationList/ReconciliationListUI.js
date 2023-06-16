import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Helper from "../../../common/Helper";

import { makeStyles } from "@material-ui/core/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AppDataContext from "../../../common/AppContext";
import { ToastContainer, toast } from "react-toastify";

import { SaveReconciliationData } from "../../../services/reconcilliation.service";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// import GreenStatus from "../../../sharedComponents/customIcons/GreenStatus";
// import RedStatus from "../../../sharedComponents/customIcons/RedStatus";

function notifySuccess(message) {
  toast.success(message);
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "16px 0px",
    width: "100%",
  },
  // control: {
  //   "& .MuiInputLabel-root": {
  //     fontSize: ".75rem",
  //     transform: "translate(14px, 6px) scale(1)",
  //   },
  //   "& .MuiInputBase-input": {
  //     padding: theme.spacing(0.35, 0.75),
  //   },
  // },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  statusIcon: {    
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiSvgIcon-root": {
      height: "15px",
      width: "15px",
    },
  },
  statusGreen: {
    color: '#3cb220',
  },
}));

const ReconciliationListUI = (props) => {
  const classes = useStyles();
  let { data, index, view } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isDNAChecked, setIsDNAChecked] = useState(false);

  const [checked, setChecked] = useState(false);
  const [comment, setComment] = useState("");
  const { leagueInfo, leagueId, username } = useContext(AppDataContext);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    setChecked(data.isDNA);
    setComment(data.comment);
  }, [data]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const saveReconciliationData = (obj) => {
    setIsEditing(false);
    SaveReconciliationData(obj)
      .then((data) => {
        notifySuccess("Data saved successfully");
        setIsEditing(false);
        if (props.refreshDataFromDB) {
          props.refreshDataFromDB();
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleActions = (action) => {
    if (action === "cancel") {
      setIsEditing(false);
      setChecked(data.isDNA);
      setComment(data.comment);
      return;
    }

    if (action === "save") {
      let obj = {
        id: data.id,
        isDNA: checked ? 1 : 0,
        comment: comment,
        updatedBy: username,
      };
      saveReconciliationData(obj);
    }
  };

  const handleCheckboxChange = (e, data) => {
    if (isEditing) {
      setChecked(e.target.checked);
    }
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };
  return (
    <React.Fragment>
      <Grid key={`Grid${index}`} item xs={12}>
        <Box px={1}>
          <Grid container alignItems="center">
          <Grid item xs={.5}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div" mb={.375}>
                  <Typography component="p" variant="caption">Status</Typography>
                </Box>
                <Box component="div" className={classes.statusIcon}>
                {data.status === 7502 ? <CheckCircleIcon className={classes.statusGreen} /> : <CancelIcon color="secondary" fontSize="small" /> }
                </Box>
              </Box>
            </Grid>
            <Grid item xs={1.4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Schedule Id/AdUnit Id</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                     className={classes.control}
                  >
                    {data.scheduleId}/ {data.scheduleAdUnitId}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          
            <Grid item xs={.75}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Region</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.regionName}
                    className={classes.control}
                  >
                    {data.regionName?data.regionName:'-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.75}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Country</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.countryName}
                    className={classes.control}
                  >
                    {data.countryName?data.countryName:'-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.75}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Network</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.networkName}
                    className={classes.control}
                  >
                    {data.networkName?data.networkName:'-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.75}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Partner</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.partnerName}
                    className={classes.control}
                  >
                    {data.partnerName?data.partnerName:'-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Actual AirDate</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                   
                    className={classes.control}
                  >
                    {Helper.FormatDate(data.airDate)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Actual AirTime</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                   
                    className={classes.control}
                  >
                    {Helper.FormatTime(data.airTime)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1.2}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">File Name</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.fileName}
                    className={classes.control}
                  >
                    {data.fileName}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.9}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">ISCI</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.adID}
                    className={classes.control}
                  >
                    {data.adID}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.9}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">ISCI Title</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    component="div"
                    noWrap
                    title={data.isciTitle}
                    className={classes.control}
                  >
                    {data.isciTitle?data.isciTitle:'-'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">DNA</Typography>
                </Box>
                <Box component="div">
                  <Checkbox
                    onChange={(e) => handleCheckboxChange(e, data)}
                    size="small"
                    name="all"
                    checked={checked ? true : false}
                    defaultChecked={false}
                    className={classes.checkboxPadding}
                    color="primary"
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={1.35}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Comment</Typography>
                </Box>
                <Box component="div">
                  {isEditing ? (
                    <TextField
                      id="outlined-multiline-static"
                      // label="Comment"
                      onChange={handleComment}
                      fullWidth
                      variant="standard"
                      value={comment}
                      name="Comment"
                    />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      component="div"
                      noWrap
                      title={data.comment}
                      className={classes.control}
                    >
                      {data.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={.35}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent="space-between"
                >
                  {!isEditing ? (
                    <>
                      <IconButton
                        title="Update DNA"
                        size="small"
                        onClick={handleEditClick}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        title="Save Change"
                        size="small"
                        onClick={() => handleActions("save")}
                      >
                        <SaveOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        title="Cancel Change"
                        size="small"
                        onClick={() => handleActions("cancel")}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

export default ReconciliationListUI;
