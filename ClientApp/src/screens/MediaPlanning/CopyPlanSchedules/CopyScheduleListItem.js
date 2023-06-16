import React from "react";
import { SportsBasketballOutlined } from "@mui/icons-material";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  IconButton,
  Paper,
  FormControl,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import Helper from "../../../common/Helper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
}));

const CopyScheduleListItem = (props) => {
  let { data, index, view } = props;
  const classes = useStyles();
  const handleCopyClick = (data) => {
    props.handleCopySchedule(data);
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
          <Grid item xs={1}>
            <Box display="flex" alignItems="baseline" pl={1}>
              {<SportsBasketballOutlined color="secondary" />}
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={1} marginTop={0}>
              <Grid item xs={3}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                    <Typography variant="subtitle2" title="Network">
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
                    <Typography variant="subtitle2">
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

              <Grid item xs={3}>
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

              <Grid item xs={3}>
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
              flexDirection="column"
              justifyContent="space-between"
            >
              <IconButton title="Copy Schedules" size="small">
                <ContentCopyIcon
                  size="small"
                  onClick={() => handleCopyClick(data)}
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

export default CopyScheduleListItem;
