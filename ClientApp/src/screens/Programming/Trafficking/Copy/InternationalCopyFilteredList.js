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
import { Checkbox, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/system";
import GreenStatus from "../../../../sharedComponents/customIcons/GreenStatus";
import RedStatus from "../../../../sharedComponents/customIcons/RedStatus";
import CircleIcon from "@mui/icons-material/Circle";

const useStyles = makeStyles((theme) => ({
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  filteredListTable: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(0.75),
    },
  },
  checkboxChecked: {
    backgroundColor: "#e4edfc",
  },
  full: {
    maxHeight: "calc(100vh - 346px)",
    overflowY: "auto",

  },
  half: {
    maxHeight: "calc(100vh - 590px)",
    overflowY: "auto",
  }
}));

const InternationalCopyFilteredList = (props) => {
  const classes = useStyles();

  const [isChecked, setIsChecked] = useState(false);
  const [checkedSchedulesState, setCheckedSchedulesState] = useState([]);
  const [topChecked, setTopChecked] = useState(false);

  const [allEpisodes, setAllEpisodes] = useState([]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      let data = props.filteredScheduleData.map((item) => {
        return item.status == 1 ? { ...item, isChecked: checked } : item;
      });
      props.handleSelected(data);

      props.setFilteredScheduleData(data);
    } else {
      let data = props.filteredScheduleData.map((item) =>
        String(item.scheduleId) === name
          ? { ...item, isChecked: checked }
          : item
      );
      props.handleSelected(data);
      props.setFilteredScheduleData(data);
    }
  };

  return (
    <TableContainer
      square
      component={Paper}
      className={`${classes.filteredListTable} ${!props.fullView ? classes.full : classes.half}`}
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
                  props.filteredScheduleData.length > 0 &&
                  props.filteredScheduleData.every((item) => item.status == 0)
                    ? false
                    : props.filteredScheduleData.length > 0 &&
                      !props.filteredScheduleData
                        .filter((item) => item.status == 1)
                        .some((item) => item?.isChecked !== true)
                }
                disabled={
                  props.filteredScheduleData.length > 0 &&
                  props.filteredScheduleData.every((item) => item.status == 0)
                    ? true
                    : false
                }
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
                Status
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.filteredScheduleData.length > 0 &&
            props.filteredScheduleData.map((item, index) => {
              return (
                <TableRow
                  // key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={item.scheduleId}
                  className={
                    item?.isChecked == true ? classes.checkboxChecked : ""
                  }
                >
                  <TableCell component="th" scope="row">
                    <Checkbox
                      onChange={(e) => handleCheckboxChange(e, index)}
                      size="small"
                      checked={
                        item.status == 0
                          ? false
                          : item?.isChecked
                          ? true
                          : false
                      }
                      className={classes.checkboxPadding}
                      name={item.scheduleId}
                      disabled={item.status === 0 ? true : false}
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
                      {item.countryName}
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
                    <Typography variant="caption">{item.episode}</Typography>
                  </TableCell>
                  <TableCell>
                    {item.status === 1 ? <GreenStatus /> : (item.status === 0 ? <RedStatus/> : <CircleIcon style={{ color: "#8adbde" }} fontSize="small" />)}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InternationalCopyFilteredList;
