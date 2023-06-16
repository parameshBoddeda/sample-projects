import React, { useEffect, useState } from "react";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Divider,
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Paper,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AppDataContext from "../../../../common/AppContext";
import { ToastContainer, toast } from "react-toastify";
import SearchComponent from "../../../../sharedComponents/SearchComponent/SearchComponent";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Helper from "../../../../common/Helper";
import {
  GetScheduleAdUnit,
  UpdateTraffickingStatus,
  UpdateTraffickingData,
} from "../../../../services/trafficking.service";

import {
  GetCopyPlanSchedules,
  GetPlannedUnits,
} from "../../../../services/planning.service";
import PlannedUnitItemTable from "./PlannedUnitItemTable";
import GridHeader from "../../../../sharedComponents/GridHeader/GridHeader";

function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: "#e4edfc",
  },
  filterWidget: {
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(1),
  },
  contentHeight: {
    height: "calc(50vh - 170px)",
    overflowY: "auto",
  },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  filteredListTable: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(0.75),
    },
  },
  halfContentHeight: {
    height: "calc(50vh - 169px)",
  },
  fullHeightTrafficking: {
    height: "calc(100vh - 283px)",
  },
  showOverflow: {
    overflowY: "auto",
  },
}));

const PlannedUnitList = (props) => {
  const classes = useStyles();
  const [plannedUnitsData, setPlannedUnitsData] = useState([]);
  const [plannedUnitsOriginalData, setPlannedUnitsOriginalData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [checkedSchedulesState, setCheckedSchedulesState] = useState([]);
  const [checkedPlannedUnits, setCheckedPlannedUnits] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [priorityWithSchedule, setPriorityWithSchedule] = useState([]);
  const [priorityValue, setPriorityValue] = useState(null);
  const [remove, setRemove] = useState([]);

  useEffect(() => {
    if (plannedUnitsData.length > 0) {
      setCheckedPlannedUnits(new Array(plannedUnitsData.length).fill(false));
      let arr = [];
      for (let i = 1; i <= plannedUnitsData.length; i++) {
        arr.push(i);
      }
      setPriorityData(arr);
  
      let filteredStartDateUnits = plannedUnitsData.filter(ele=>ele.planStartDate!==null)
      let filteredEndDateUnits = plannedUnitsData.filter(ele=>ele.planEndDate!==null)

      let minDate = new Date(
        Math.min(
          ...filteredStartDateUnits.map((element) => {
            return new Date(element.planStartDate);
          })
        )
      );
      let maxDate = new Date(
        Math.max(
          ...filteredEndDateUnits.map((element) => {
            return new Date(element.planEndDate);
          })
        )
      );

       props.setMinimumStartDate(Helper.FormatToIsoDate(minDate));
      props.setMaximumEndDate(Helper.FormatToIsoDate(maxDate));
    }
  }, [plannedUnitsData]);

  // const getPriorityValue = (value, item) => {
  //   console.log(item, value);
  //   if (priorityWithSchedule.length > 0) {
  //     let v = priorityWithSchedule.find(
  //       (pws) => pws.adUnitId == item.scheduleAdUnitId
  //     );
  //
  //     return v.priority;
  //   }
  // };

  const handlePriorityChange = (name, value, item) => {
    // if (priorityWithSchedule.length > 0) {
    //   for (let key of priorityWithSchedule) {
    //     if (key.priority == value) {
    //       notifyWarning("Please select different priority");
    //       return;
    //     }
    //   }
    // } else

    // if (props.ros) {
    //   if (priorityWithSchedule.length == 0) {
    //     setPriorityValue(value);
    //     let mapped =
    //       item.scheduleAdUnitIds.length > 0 &&
    //       item.scheduleAdUnitIds.split(",").map((s) => {
    //         return {
    //           adUnitId: s,
    //           priority: value,
    //           scheduleAdUnitId: item.scheduleAdUnitId,
    //         };
    //       });
    //     setPriorityWithSchedule(mapped);
    //   } else if (
    //     priorityWithSchedule.every(
    //       (p) => p.scheduleAdUnitId !== item.scheduleAdUnitId
    //     )
    //   ) {
    //     setPriorityValue(value);
    //     let mapped =
    //       item.scheduleAdUnitIds.length > 0 &&
    //       item.scheduleAdUnitIds.split(",").map((s) => {
    //         return {
    //           adUnitId: s,
    //           priority: value,
    //           scheduleAdUnitId: item.scheduleAdUnitId,
    //         };
    //       });
    //     setPriorityWithSchedule([...priorityWithSchedule, ...mapped]);
    //   } else if (
    //     priorityWithSchedule.some(
    //       (p) => p.scheduleAdUnitId === item.scheduleAdUnitId
    //     )
    //   ) {
    //     setPriorityValue(value);
    //     let filtered = priorityWithSchedule.filter(
    //       (it) => it.scheduleAdUnitId !== item.scheduleAdUnitId
    //     );
    //     let mapped =
    //       item.scheduleAdUnitIds.length > 0 &&
    //       item.scheduleAdUnitIds.split(",").map((s) => {
    //         return {
    //           adUnitId: s,
    //           priority: value,
    //           scheduleAdUnitId: item.scheduleAdUnitId,
    //         };
    //       });
    //     setPriorityWithSchedule([...filtered, ...mapped]);
    //   }
    // } else {
      if (priorityWithSchedule.length == 0) {
        setPriorityValue(value);
        setPriorityWithSchedule([
          {
            adUnitId: item.scheduleAdUnitId,
            priority: value,
          },
        ]);
      } else if (
        priorityWithSchedule.every((p) => p.adUnitId !== item.scheduleAdUnitId)
      ) {
        setPriorityValue(value);
        setPriorityWithSchedule([
          ...priorityWithSchedule,
          {
            adUnitId: item.scheduleAdUnitId,
            priority: value,
          },
        ]);
      } else if (
        priorityWithSchedule.some((p) => p.adUnitId === item.scheduleAdUnitId)
      ) {
        setPriorityValue(value);
        let mapped = priorityWithSchedule.map((el, index) => {
          if (el.adUnitId === item.scheduleAdUnitId) {
            return { ...el, priority: value };
          } else return el;
        });

        setPriorityWithSchedule(mapped);
      }
    // }
  };

  useEffect(() => {
    let valueToRemove = priorityWithSchedule.map((i) => i.priority);

    setRemove(valueToRemove);
    // let arr = [];
    // for (let key of priorityData) {
    //   if (!valueToRemove.includes(key)) {
    //     arr.push(key);
    //   }
    // }

    // setPriorityData(arr);
    props.setSourceUnits(priorityWithSchedule);
  }, [priorityWithSchedule]);


  useEffect(()=>{
    let mapped = plannedUnitsData.map((ele,index)=>({
      
        adUnitId: ele.scheduleAdUnitId,
        priority: index+1,
        scheduleAdUnitIds:ele.scheduleAdUnitIds?ele.scheduleAdUnitIds:null
    
    }))
 
    setPriorityWithSchedule(mapped);
  
  },[priorityData])

  const getTotalCount = () => {
    if (plannedUnitsData.length > 0) {
      let total = [];

      plannedUnitsData.forEach((item) => {
        total.push(item.countPerc);
      });
      return total.reduce((a, b) => a + b, 0);
    }
  };

  const handleCheckboxChange = (e, position, value) => {
    const updateSchedules = checkedPlannedUnits.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedPlannedUnits(updateSchedules);

    handleSelected(updateSchedules);
  };

  const handleSelected = (items) => {
    let selectedSchedules = [];
    items.forEach((v, i) => {
      if (v === false) {
        selectedSchedules.push(i);
      }
    });

    let arr = [];

    plannedUnitsData.forEach((item, index) => {
      selectedSchedules.forEach((v, i) => {
        if (v === index) {
          arr.push(item.scheduleAdUnitId);
        }
      });
    });

    setAllUnits(arr);
    props.setSourceUnits(arr);
  };

  const getPlannedUnitsData = (scheduleId) => {
    setShowLoading(true);
    setOpenBackdrop(true);
    GetPlannedUnits(scheduleId, props.planTypeValue, props.ros ? true : false)
      .then((resp) => {
        setPlannedUnitsData(resp);
        setPlannedUnitsOriginalData(resp);
        let ids = resp.map((unit) => unit.scheduleAdUnitId);
        props.setAllPlannedScheduleUnits(ids);
        props.setMediaTypeId(resp[0].mediaTypeId);
        setOpenBackdrop(false);
        setShowLoading(false);
      })
      .catch((err) => {
        notifyWarning("Server error.");
        setShowLoading(false);
        setOpenBackdrop(false);
        console.log(err);
      });
  };

  const setFilterData = (filterData) => {
    setPlannedUnitsData(filterData);
  };

  // useEffect(() => {
  //   if (plannedUnitsData.length > 0) {
  //     let ids = plannedUnitsData.map((unit) => unit.scheduleAdUnitId);

  //     props.setAllPlannedScheduleUnits(ids);
  //   }
  // }, [plannedUnitsData]);


  useEffect(() => {
    getPlannedUnitsData(props.selectedScheduleId);
  }, []);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        className={classes.filterWidget}
      >
        <Box display="flex">
          <SearchComponent
            jsonData={plannedUnitsData}
            originalData={plannedUnitsOriginalData}
            setFilterData={setFilterData}
          />
        </Box>
      </Box>

      <Grid item xs={12} className={classes.header}>
        <Grid container alignItems="center">
          <Grid item xs={8.5}>
            <Typography color="primary" variant="caption" ml={2}>
              {`
                ${props.mediaTypeId === 151 ? "Game" : "Non-Game"}   | 
                ${
                  props.selectedScheduleData.networkName
                    ? props.selectedScheduleData.networkName
                    : "-"
                } | 
                ${
                  props.selectedScheduleData.estDate
                    ? Helper.FormatDate(props.selectedScheduleData.estDate)
                    : "-"
                } | 
                ${
                  props.selectedScheduleData.id
                    ? props.selectedScheduleData.id
                    : "-"
                } | 
                ${
                  props.selectedScheduleData.episodeName
                    ? props.selectedScheduleData.episodeName
                    : "-"
                }
             `}
            </Typography>
          </Grid>
          <Grid item xs={3.5}>
            {props.ros ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                pr={2}
              >
                <Typography
                  color="primary"
                  fontWeight="medium"
                  variant="caption"
                >
                  Total Count : {getTotalCount()}%
                </Typography>
              </Box>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Grid>
      <div>
        {/* <Box className={classes.contentHeight}>
          {plannedUnitsData.length > 0 ? (
            plannedUnitsData.map((ele, index) => {
              return (
                <>
                  <Grid container spacing={1} marginTop={0} pb={0.5}>
                    <PlannedUnitItemTable
                      data={ele}
                      selectedScheduleData={props.selectedScheduleData}
                    />
                  </Grid>

                  <Divider sx={{ width: "100%" }} />
                </>
              );
            })
          ) : (
            <Typography pl={1} pt={1} variant="subtitle1">
              No Record.
            </Typography>
          )}
        </Box> */}
        <Box
          className={`${classes.showOverflow} ${
            props.expandTrafficking && props.expandUnassigned
              ? classes.halfContentHeight
              : props.expandTrafficking
              ? classes.fullHeightTrafficking
              : ""
          }`}
        >
          <TableContainer
            square
            component={Paper}
            className={classes.filteredListTable}
          >
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  {/* <TableCell> */}
                  {/* <Checkbox
                      onChange={handleTraffickingChange}
                      size="small"
                      checked={props.isTrafficked}
                      className={classes.checkboxPadding}
                    /> */}
                  {/* </TableCell> */}

                  <TableCell width="20%">
                    <Typography variant="caption" fontWeight="medium">
                      Copy Priority
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography variant="caption" fontWeight="medium">
                      ISCI Code{" "}
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography variant="caption" fontWeight="medium">
                      ISCI Title
                    </Typography>
                  </TableCell>
                  {props.ros ? (
                    <TableCell width="10%">
                      <Typography variant="caption" fontWeight="medium">
                        Count(%)
                      </Typography>
                    </TableCell>
                  ) : (
                    ""
                  )}

                  <TableCell width="25%">
                    <Typography variant="caption" fontWeight="medium">
                      Advertiser/Campaign
                    </Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography variant="caption" fontWeight="medium">
                      Unit | Cost
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography variant="caption" fontWeight="medium">
                      Unit Size
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plannedUnitsData.length > 0 &&
                  plannedUnitsData.map((item, index) => (
                    <PlannedUnitItemTable
                      item={item}
                      key={index}
                      index={index}
                      handleCheckboxChange={handleCheckboxChange}
                      checkedPlannedUnits={checkedPlannedUnits}
                      priorityData={priorityData}
                      handlePriorityChange={handlePriorityChange}
                      priorityValue={priorityValue}
                      remove={remove}
                      ros={props.ros}
                      // getPriorityValue={getPriorityValue}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>

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

export default PlannedUnitList;
