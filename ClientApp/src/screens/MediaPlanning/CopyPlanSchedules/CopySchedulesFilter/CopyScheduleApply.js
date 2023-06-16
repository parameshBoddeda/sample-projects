import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Helper from "../../../../common/Helper";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Checkbox, Typography, withStyles } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/system";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import GreenStatus from "../../../../sharedComponents/customIcons/GreenStatus";
import YellowStatus from "../../../../sharedComponents/customIcons/YellowStatus";
import RedTickStatus from "../../../../sharedComponents/customIcons/RedTickStatus";
import { Tooltip } from "@material-ui/core";
import Divider from "@mui/material/Divider";

const useStyles = makeStyles((theme) => ({
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  checkboxChecked: {
    backgroundColor: "#e4edfc",
  },

  filteredListTable: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(0.75),
    },
  },
  cursor: {
    "&:hover": {
      background: "#e4edfc",
      cursor: "pointer",
      border: "1px solid black",
    },
  },
  dividerColor: {
    color: "#fff",
    backgroundColor: "#fff",
  },
  customTooltip: {
    backgroundColor: "#fff",
    // border: "1px solid black",
  },
  customArrow: {
    color: "#1D428A",
  },
  full: {
    maxHeight: 'calc(100vh - 346px)',
    overflowY: 'auto',
  },
  half: {
    maxHeight: 'calc(100vh - 590px)',
    overflowY: 'auto',
  },
}));

const CopyScheduleApply = (props) => {
  const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);
  const [checkedSchedulesState, setCheckedSchedulesState] = useState([]);
  const [filterCheck, setFilterCheck] = useState(false);
  const [statusFilteredData, setStatusFilteredData] = useState(
    props.filteredScheduleData
  );

  useEffect(() => {
    if (props.filteredScheduleData.length > 0) {
      setCheckedSchedulesState(
        new Array(props.filteredScheduleData.length).fill(false)
      );
    }

    setStatusFilteredData(props.filteredScheduleData);
  }, [props.filteredScheduleData]);

  const handleCheckboxChange = (e, position, value) => {
    const { name, checked } = e.target;
    if (name === "all") {
      // let data = props.filteredScheduleData.map((item) => {
      //   return { ...item, isChecked: checked };
      // });

      statusFilteredData.forEach((item) => {
        item.isChecked = checked;
      });
      let data = statusFilteredData;
      props.handleSelected(data);
      setStatusFilteredData(data);

      // props.setFilteredScheduleData(data);
    } else {
      // let data = statusFilteredData.map((item) =>
      //   String(item.scheduleId) === name
      //     ? { ...item, isChecked: checked }
      //     : item
      // );
      let objIndex = statusFilteredData.findIndex(
        (item) => String(item.scheduleId) === name
      );
      statusFilteredData[objIndex].isChecked = checked;
      let data = statusFilteredData;
      props.handleSelected(data);
      setStatusFilteredData(data);
    }
  };

  useEffect(() => {
    if (props.status === 2) {
      setStatusFilteredData(props.filteredScheduleData);
      return;
    }
    let filtered = props.filteredScheduleData.filter(
      (item) => item.status === props.status
    );
    setStatusFilteredData(filtered);
  }, [props.status]);

  const getDetails = (inventory) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        color="red"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="subtitle2" color="primary">
          Details
        </Typography>
        {/* <Divider variant="fullWidth" className={classes.dividerColor} /> */}
        <TableContainer
          square
          component={Paper}
          className={classes.filteredListTable}
        >
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="caption" fontWeight="medium">
                    Unit Type
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight="medium">
                    Unit Size
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight="medium">
                    Total
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight="medium">
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length > 0 &&
                inventory.map((item, index) => {
                  return (
                    <TableRow
                      // key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={item.scheduleId}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="caption">
                          {item.unitTypeName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {item.unitSizeName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption">{item.total}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {item.status === 1 ? (
                            <YellowStatus />
                          ) : item.status === 0 ? (
                            <GreenStatus />
                          ) : (
                            <RedTickStatus />
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <>
      <TableContainer
        square
        component={Paper}
        className={`${classes.filteredListTable} ${!props.fullView ? classes.full : classes.half}`}
        style={{ backgroundColor: "#fff" }}
      >
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={(e) => handleCheckboxChange(e)}
                  size="small"
                  name="all"
                  checked={
                    statusFilteredData.length > 0
                      ? statusFilteredData.every(
                          (item) => item.isChecked === true
                        )
                        ? true
                        : false
                      : false
                  }
                  defaultChecked={false}
                  // checked={
                  //   props.filteredScheduleData.length > 0 &&
                  //   props.filteredScheduleData.every((item) => item.status == 0)
                  //     ? false
                  //     : props.filteredScheduleData.length > 0 &&
                  //       !props.filteredScheduleData.some(
                  //         (item) => item?.isChecked !== true
                  //       )
                  // }
                  // disabled={
                  //   props.filteredScheduleData.length > 0 &&
                  //   props.filteredScheduleData.every((item) => item.status == 0)
                  //     ? true
                  //     : false
                  // }
                  className={classes.checkboxPadding}
                />
              </TableCell>

              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Date
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Region|Country
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Network
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Asset
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Episode
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Inventory Link
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontWeight="medium">
                  Indicator
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusFilteredData.length > 0 &&
              statusFilteredData.map((item, index) => (
                <TableRow
                  // key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className={
                    checkedSchedulesState[index] == true
                      ? classes.checkboxChecked
                      : ""
                  }
                >
                  <TableCell component="th" scope="row">
                    <Checkbox
                      size="small"
                      // disabled={item.isEligible ? false : true}
                      onChange={(e) => handleCheckboxChange(e, index)}
                      checked={item?.isChecked ? true : false}
                      className={classes.checkboxPadding}
                      name={item.scheduleId}
                      // disabled={item.status === 0 ? true : false}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography variant="caption">
                      {item.scheduleId}{" "}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {Helper.FormatDate(item.scheduleDate)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption">
                      {`${item.regionName}|${item.countryName}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {item.partnerName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{item.assetName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {item.episodeName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={getDetails(item.copyScheduleInventories)}
                      placement="left"
                      arrow
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="primary"
                        className={classes.cursor}
                      >
                        View Inventory
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    {item.status === 1 ? (
                      <YellowStatus />
                    ) : item.status === 0 ? (
                      <GreenStatus />
                    ) : (
                      <RedTickStatus />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CopyScheduleApply;
