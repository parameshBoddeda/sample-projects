import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import ScheduleUI from "./ScheduleUI";
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import { Box, IconButton, Paper, FormControl, Divider, Typography, Checkbox, TextField, MenuItem } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import SearchComponent from "../../../sharedComponents/SearchComponent/SearchComponent";
import { makeStyles } from "@material-ui/core/styles";
import * as AppConstants from "../../../common/AppConstants";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import Dropdown from "../../../sharedComponents/Dropdown/Dropdown";
import Helper from "../../../common/Helper";
import Paging from "../../../sharedComponents/Pagination/Paging";

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 184px)",
    overflowY: "auto",
  },
  fabButton: {
    position: "absolute !important",
    right: theme.spacing(10),
    bottom: theme.spacing(2),
  },
  filterDetailsRow: {
    columnGap: theme.spacing(3.75),
    marginRight: theme.spacing(2),
    backgroundColor: "#dfe3ec",
    padding: theme.spacing(0, 2.5),
    borderRadius: theme.spacing(.75),
    height: theme.spacing(5),
  },
  ddMinWidth: {
    width: "150px",
  },
  ddMinWidthRecordCount: {
    width: "120px",
  },
  ellipsisStyle: {
    width: "110px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
}));

const ScheduleContainer = (props) => {
  const classes = useStyles();
  const [currentRows, setCurrentRows] = React.useState([]);
  const [statusValue, setStatusValue] = React.useState(2);
  const [statusName, setStatusName] = React.useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // const [starteDt, setStatusName] = React.useState("All");
  // const [statusName, setStatusName] = React.useState("All");
  const filterCriteria = props.filterCriteria;

  const filterFieldsExcluded = ["asset"] // to be decided

  const fieldLabels = {
    region: "Region",
    country: "Country",
    network: "Network",
    mediaType: "Media Type",
    asset: "Asset",
  }

  const setFilterData = (filterData) => {
    props.setFilterData(filterData);
  };

  const handleAdd = () => {};

  React.useEffect(() => {
    setCurrentRows(props.rows);
    setPage(1);
  }, [props.rows]);

  React.useEffect(() => {
    if (statusValue === 2) {
      let mapped = [...props.rows];
      setCurrentRows(mapped);
    } else {
      let newrows = [...props.rows];
      let filtered = newrows.filter((item) => item.isReady === statusValue);
      setCurrentRows(filtered);
    }
  }, [statusValue]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleOnRowsChanged = (e) => {
    setRowsPerPage(e.target.value);
  }

  const handleStatusChange = (name, value) => {
    // setStatusValue(value.value);
    // setStatusName(value.label);
    props.handleStatusChange(name, value);
  };

  const handlerRecordCountChange = (name, value) => {
    props.handlerRecordCountChange(value)
  }

  return (
    <Paper>
      <Grid container className="Schedule">
        <Grid item xs={12}>
          <Box p={1}>
            <GridHeader
              hideCheckbox={true}
              showIcon={true}
              view={props.view}
              showScheduleIcon={true}
              headerText="Schedules"
              hasFilter={Object.keys(filterCriteria).length && (("startDate" in filterCriteria && filterCriteria.startDate) || ("endDate" in filterCriteria && filterCriteria.endDate) || ("region" in filterCriteria && filterCriteria.region.length) || ("country" in filterCriteria && filterCriteria.country.length) || ("network" in filterCriteria && filterCriteria.network.length) || (filterCriteria?.mediaType && "label" in filterCriteria.mediaType)) ? true : false}
            >
              {
                  Object.keys(filterCriteria).length && (("startDate" in filterCriteria && filterCriteria.startDate) || ("endDate" in filterCriteria && filterCriteria.endDate) || ("region" in filterCriteria && filterCriteria.region.length) || ("country" in filterCriteria && filterCriteria.country.length) || ("network" in filterCriteria && filterCriteria.network.length) || (filterCriteria?.mediaType && "label" in filterCriteria.mediaType)) ?
                  <Box display="flex" className={classes.filterDetailsRow}>
                      {
                          (Array.isArray(filterCriteria.country) && filterCriteria.country.length) || (Array.isArray(filterCriteria.region) && filterCriteria.region.length) ?
                              <Box display="flex" flexDirection="column">
                                  <Typography variant="caption">
                                    {filterCriteria.country.length ? 'Country' : filterCriteria.region.length ? 'Region' : ''}
                                  </Typography>
                                  <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={filterCriteria.country.length ? filterCriteria.country.map(x => x.label).join(", ") : filterCriteria.region.map(x => x.label).join(", ")}>
                                    {filterCriteria.country.length ? (filterCriteria.country.length > 1 ? filterCriteria.country.map(x => x.label).join(", ") : filterCriteria.country[0].label) : (filterCriteria.region.length > 1 ? filterCriteria.region.map(x => x.label).join(", ") : filterCriteria.region[0].label)}
                                  </Typography>
                              </Box> : ""
                      }
                       {
                          filterCriteria.startDate || filterCriteria.endDate ?
                              <Box display="flex" flexDirection="column">
                                  <Typography variant="caption">
                                      Start Date | End Date
                                  </Typography>
                                  <Typography variant="caption" fontWeight={600}>
                                      {filterCriteria.startDate ? Helper.FormatDate(filterCriteria.startDate) : "-- "} | {filterCriteria.endDate ? Helper.FormatDate(filterCriteria.endDate) : " --"}
                                  </Typography>
                              </Box> : ""
                      }
                      {
                          Object.entries(filterCriteria).map((elem) => {
                              if(!filterFieldsExcluded.includes(elem[0])) {
                                  if(typeof elem[1] === "object" && !Array.isArray(elem[1]) && elem[1] !== null) {
                                      return <Box display="flex" flexDirection="column">
                                              <Typography variant="caption">
                                                  {fieldLabels[elem[0]]}
                                              </Typography>
                                              <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600}>
                                                  {elem[1].label}
                                              </Typography>
                                          </Box>
                                  } else if(Array.isArray(elem[1]) && elem[1].length) {
                                      if(elem[0] !== "region" && elem[0] !== "country") {
                                          return <Box display="flex" flexDirection="column">
                                              <Typography variant="caption">
                                                  {fieldLabels[elem[0]]}
                                              </Typography>
                                              <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={elem[1].length > 1 ? elem[1].map(x => x.label).join(", ") : ""}>
                                                {/* {elem[1].length === 1 ? elem[1][0].label : `${elem[1][0].label}...`} */}
                                                {elem[1].length > 1 ? elem[1].map(x => x.label).join(", ") : elem[1][0].label}
                                              </Typography>
                                          </Box>
                                      }
                                  }
                              }
                          })
                      }
                  </Box>
                  : ''
              }
              {/* <Box display="flex" mr={2}>
                <Dropdown
                  classList={classes.ddMinWidthRecordCount}
                  size="small"
                  name="RecordCount"
                  lbldropdown="Record Count"
                  value={props.recordCountLabel}
                  ddData={[
                    {
                      label: "20",
                      value: 20,
                    },
                    {
                      label: "50",
                      value: 50,
                    },
                    {
                      label: "100",
                      value: 100,
                    },
                    {
                      label: "200",
                      value: 200,
                    },
                    {
                      label: "500",
                      value: 500,
                    },
                    {
                      label: "1000",
                      value: 1000,
                    },
                    {
                      label: "1500",
                      value: 1500,
                    },
                    {
                      label: "2000",
                      value: 2000,
                    },
                  ]}
                  handleChange={handlerRecordCountChange}
                />
              </Box> */}
              <Box display="flex" mr={2} className={classes.ddMinWidth}>
                <Dropdown
                  size="small"
                  name="status"
                  fullWidth
                  lbldropdown="Status"
                  value={props.recordStatusLabel}
                  ddData={[
                    {
                      label: "All",
                      value: -1,
                    },
                    {
                      label: "Ready",
                      value: 1,
                    },
                    {
                      label: "Not Ready",
                      value: 0,
                    },
                    {
                      label: "Trafficked",
                      value: 2,
                    },
                  ]}
                  handleChange={handleStatusChange}
                />
              </Box>
              <Box display="flex">
                <SearchComponent
                  setFilterData={setFilterData}
                  jsonData={props.rows}
                  originalData={props.originalData}
                  // restrictedFields={props.restrictedFields}

                  setSearchItem={props.setSearchItem}
                  resetApplyLocalFilter={props.resetApplyLocalFilter}
                  applyLocalFilter={props.applyLocalFilter}
                  searchItem={props.searchItem}
                />
              </Box>
              <Box display="flex">
                {/* <IconButton size="small">
                                    <HandymanOutlinedIcon />
                                </IconButton>
                                <IconButton size="small">
                                    <DownloadIcon />
                                </IconButton>
                                <IconButton size="small">
                                    <ContentCopyIcon />
                                </IconButton> */}
                <IconButton
                  title="Generate Traffic Letter"
                  size="small"
                  onClick={props.showTraffickLetter}
                >
                  <MarkunreadOutlinedIcon size="small" />
                </IconButton>
              </Box>
            </GridHeader>
          </Box>
          <Divider sx={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Box className={classes.contentHeight}>
        <Grid container>
          {currentRows.length > 0 &&<Grid item xs={12} sm={12} md={12}>
            <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
              {
                currentRows.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                    return (
                      <ScheduleUI
                        handleTraffickingClick={props.handleTraffickingClick}
                        showIndivisualTraffickLetter={
                          props.showIndivisualTraffickLetter
                        }
                        key={index}
                        data={data}
                        index={index}
                        view={props.view}
                        selectedScheduleId={props.selectedScheduleId}
                        showTraffickLetter={props.showTraffickLetter}
                      />
                    );
                  })
              }
            </div>
          </Grid>}  
          {
            currentRows.length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
              <Paging minRows={20} currentpage={page} rows={currentRows.length}
                rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
              />
            </Grid>
          }
          {props.rows.length < 1 && (
            <Typography pl={1} pt={1} variant="subtitle1">
              No Record.
            </Typography>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

ScheduleContainer.displayName = "ScheduleContainer";
export default ScheduleContainer;
