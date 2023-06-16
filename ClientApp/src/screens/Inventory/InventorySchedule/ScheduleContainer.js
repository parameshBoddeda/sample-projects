import * as React from "react";
import Grid from "@mui/material/Grid";
import ScheduleUI from "./ScheduleUI";
import AppDataContext from '../../../common/AppContext';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import {
  Box,
  IconButton,
  Paper,
  Divider,
  Typography,
  Autocomplete,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import SearchComponent from "../../../sharedComponents/SearchComponent/SearchComponent";
import { makeStyles } from "@material-ui/core/styles";
import * as AppConstants from "../../../common/AppConstants";
import {
  EditScheduleData,
  DeleteScheduleData,
  GetEpisodesList,
} from "../../../../src/services/inventory.service";

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 189px)",
    overflowY: "auto",
  },
  contentLinearHeight: {
    height: "calc(100vh - 430px)",
    overflowY: "auto",
  },
  contentLinearDayHeight: {
    height: "calc(100vh - 468px)",
    overflowY: "auto",
  },
}));

const ScheduleContainer = (props) => {
  const classes = useStyles();
  const { episodesData } = React.useContext(AppDataContext);
  const [episodesNames, setEpisodesName] = React.useState([]);

  const setFilterData = (filterData) => {
    props.setFilterData(filterData);
  };

  const handleOpenBuildSchedule = (value) => {
    props.setChildScreen(AppConstants.SCREEN.BUILD_SCHEDULE);
  };

  const handleOpenSchMaintenance = (value) => {};

  React.useEffect(() => {
    setEpisodesName(episodesData);
  }, []);

  return (
    <Paper elevation={0}>
      <Grid container>
        <Grid item sm={12}>
          <Box p={1}>
            <GridHeader
              view={props.view}
              showIcon={true}
              icon={"schedule"}
              hideCheckbox={true}
              headerText={`${
                props.rowClick
                  ? `Schedules ${
                      props.recordCount ? `(${props.recordCount})` : "(0)"
                    }`
                  : `Schedules ${
                      props.recordCount ? `(${props.recordCount})` : "(0)"
                    }`
              }`}
            >
              {!props.hideIcons && (
                <>
                  <Box display="flex">
                    <SearchComponent
                      setFilterData={setFilterData}
                      jsonData={props.rows}
                      originalData={props.originalData}
                    />
                  </Box>
                  <Box display="flex">
                    {!props.hideActionIcon && (
                      <>
                        <IconButton
                          size="small"
                          onClick={handleOpenBuildSchedule}
                        >
                          <AddSharpIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleOpenSchMaintenance}
                        >
                          <HandymanOutlinedIcon />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>{" "}
                      </>
                    )}
                    <IconButton size="small">
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                </>
              )}
            </GridHeader>
          </Box>
          <Divider style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Box
        className={
          props.rowClick
            ? classes.contentHeight
            : !props.isLinearBuildSchedule
            ? classes.contentHeight
            : props.isShowDaysSelector
            ? classes.contentLinearDayHeight
            : classes.contentLinearHeight
        }
      >
        <Grid container>
          {props.rows &&
            props.rows.map((data, index) => {
              return (
                <ScheduleUI
                  isLinearBuildSchedule={
                    props.isLinearBuildSchedule
                      ? props.isLinearBuildSchedule
                      : false
                  }
                  key={index}
                  data={data}
                  index={index}
                  view={props.view}
                  refreshDataFromDB={props.refreshDataFromDB}
                  seasonStartDate={props.seasonStartDate}
                  seasonEndDate={props.seasonEndDate}
                  episodesNames={episodesNames}
                  setEpisodesName={setEpisodesName}
                />
              );
            })}
          {props.rows.length === 0 && (
            <Paper elevation={0}>
              <Grid container>
                <Grid item xs={12}>
                  <Box px={1}>
                    <Typography variant="subtitle2">No Records</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

ScheduleContainer.displayName = "InventoryScheduleContainer";
export default ScheduleContainer;
