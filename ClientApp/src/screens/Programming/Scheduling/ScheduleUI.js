import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Article, SportsBasketballOutlined } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Helper from "../../../common/Helper";
import { GetSchedules } from "../../../services/common.service";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import GreenStatus from "../../../sharedComponents/customIcons/GreenStatus";
import RedStatus from "../../../sharedComponents/customIcons/RedStatus";
import CircleIcon from "@mui/icons-material/Circle";

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
  selected: {
    background: "#e4ecff",
  },
  isTrafficked: {
    cursor: "pointer",
  },
  statusIcon: {
    "& .MuiSvgIcon-root": {
      height: "15px",
      width: "15px",
      display: "flex",

      alignItems: "flex-end",
      justifyContent: "center",
    },
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
  const classes = useStyles();
  const handleClick = (data) => {
    if (showEditable) {
      return false;
    }
    let temp = {
      index: index,
      edit: true,
    };
    setShowEditable(temp);
    if (props.handleTraffickingClick) {
      props.handleTraffickingClick(data);
    }
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

  return (
    <React.Fragment>
      <Grid
        key={`Grid${index}`}
        item
        xs={12}
        className={data.id === props.selectedScheduleId ? classes.selected : ""}
      >
        <Grid container alignItems="center">
          <Grid item xs={.4}>            
            <Box display="flex" alignItems="baseline" pl={1}>
              {data.isGameSchedule === 1 && (
                <SportsBasketballOutlined color="secondary" />
              )}
            </Box>
          </Grid>
          <Grid item xs={.4}>
          <Box
              display="flex"
              className={classes.statusIcon}
              alignItems="flex-end"
            >
              {data.isReady === 1 ? <GreenStatus /> : data.isReady === 0 ? <RedStatus /> : <CircleIcon style={{ color: "#8adbde" }} fontSize="small" />}
            </Box>
          </Grid>
          <Grid item xs={10.2}>
            <Grid container spacing={1} marginTop={0}>
              <Grid item xs={3}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography noWrap title={data.networkName} variant="subtitle2">
                      {data.networkName}
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

              <Grid item xs={3}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="subtitle2" noWrap title={data.assetMasterName}>
                      {data.assetMasterName}
                    </Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="caption">
                      {data.id} | {data.episodeName}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={2.5}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">
                      EST AirDate | Time
                    </Typography>
                  </Box>
                  <Box component="div">
                    <Typography
                      variant="subtitle2"
                      component="div"
                      className={classes.date1}
                      style={{ display: "flex" }}
                    >
                      {Helper.FormatDate(data.estDate)} |{" "}
                      {Helper.FormatTime(data.estTime)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={2.5}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">
                      Regional AirDate | Time
                    </Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="subtitle2">
                      {Helper.FormatDate(data.regionalDate)} |{" "}
                      {Helper.FormatTime(data.regionalTime)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={1}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="caption">Units </Typography>
                  </Box>
                  <Box component="div">
                    <Typography variant="subtitle2">
                      {data.usedUnit} | {data.totalUnit}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            key={`GridAction${index}`}
            container
            justifyContent="flex-end"
            xs={1}
          >
            <Box
              display="flex"
              flexDirection={props.view ? 'row' : 'column'}
              justifyContent="space-between"
            >
              <IconButton
                title="Trafficking"
                size="small"
                onClick={() => handleClick(data)}
              >
                <QueuePlayNextIcon size="small" />
              </IconButton>

              {data.isTrafficked && (
                <IconButton
                  title="Generate Traffick Letter"
                  size="small"
                  onClick={() => {
                    if (data.isTrafficked) {
                      props.showIndivisualTraffickLetter(data);
                    }
                  }}
                >
                  <MarkunreadOutlinedIcon size="small" />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

ScheduleUI.displayName = "ScheduleUI";
export default ScheduleUI;
