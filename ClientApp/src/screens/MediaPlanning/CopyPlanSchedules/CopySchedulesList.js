import React, {useState} from "react";
import {
  Box,
  IconButton,
  Paper,
  FormControl,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
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
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import CopyScheduleListItem from "./CopyScheduleListItem";
import Helper from "../../../common/Helper";
import Paging from '../../../sharedComponents/Pagination/Paging';

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 138px)",
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
  ellipsisStyle: {
    width: "110px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
}));

const CopySchedulesList = (props) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const filterCriteria = props.filterCriteria;
  const filterFieldsExcluded = ["mediaType"] // to be decided
  const fieldLabels = {
    region: "Region",
    country: "Country",
    network: "Network",
    asset: "Asset",
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleOnRowsChanged = (e) => {
    setRowsPerPage(e.target.value);
  }

  const setFilterData = (filterData) => {
    props.setFilterData(filterData);

    if(filterData.length !== props.rows.length)
      setPage(1);
  };

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
              headerText="Schedules List"
            >
              <Box display={"flex"}>
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
                          if (!filterFieldsExcluded.includes(elem[0])) {
                            if (typeof elem[1] === "object" && !Array.isArray(elem[1]) && elem[1] !== null) {
                              return <Box display="flex" flexDirection="column">
                                <Typography variant="caption">
                                  {fieldLabels[elem[0]]}
                                </Typography>
                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600}>
                                  {elem[1].label}
                                </Typography>
                              </Box>
                            } else if (Array.isArray(elem[1]) && elem[1].length) {
                              if (elem[0] !== "region" && elem[0] !== "country") {
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
              </Box>

              <Box display="flex">
                <SearchComponent
                  jsonData={props.rows}
                  originalData={props.originalData}
                  setFilterData={setFilterData}
                  setSearchItem={props.setSearchItem}
                  resetApplyLocalFilter={props.resetApplyLocalFilter}
                  applyLocalFilter={props.applyLocalFilter}
                  searchItem={props.searchItem}
                />
              </Box>
              {/* <Box display="flex">
                <IconButton size="small">
                  <HandymanOutlinedIcon />
                </IconButton>
                <IconButton size="small">
                  <DownloadIcon />
                </IconButton>
                <IconButton size="small">
                  <ContentCopyIcon />
                </IconButton>
              </Box> */}
            </GridHeader>
          </Box>
          <Divider sx={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Box className={classes.contentHeight}>
        <Grid container>
          {props.rows.length > 0 && <Grid item xs={12} sm={12} md={12}>
            <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
              {
                props.rows.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                  return (
                    <CopyScheduleListItem
                      handleCopySchedule={props.handleCopySchedule}
                      key={index}
                      data={data}
                      index={index}
                      view={props.view}
                      selectedScheduleId={props.selectedScheduleId}
                    />
                  );
                })}
            </div>
          </Grid>}
          {
            props.rows.length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
              <Paging minRows={20} currentpage={page} rows={props.rows.length}
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

export default CopySchedulesList;
