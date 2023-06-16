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
import { Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";

const useStyles = makeStyles((theme) => ({
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  filteredListTable: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(0.75),
    },
  },
  maxWidth100: {
    maxWidth: "200px",
  },
}));

const PlannedUnitItemTable = (props) => {
  const classes = useStyles();

  return (
    <TableRow
      // key={row.name}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="td" scope="row">
        {/* <Checkbox
          onChange={(e) => props.handleCheckboxChange(e, props.index)}
          size="small"
          checked={!props.checkedPlannedUnits[props.index]}
          className={classes.checkboxPadding} */}
        {/* /> */}
        <Autocomplete
          size="small"
          id="region"
          variant="priority"
          showLabel={true}
          lbldropdown="priority"
          className={classes.maxWidth100}
          defaultValue={props.index + 1}
          //  value={regionName}
          // getOptionSelected={(option, value) => option.value === value.value}
          getOptionDisabled={(option) => props.remove.includes(option)}
          onChange={(name, value) =>
            props.handlePriorityChange(name, value, props.item)
          }
          options={props.priorityData ? props.priorityData : []}
          renderInput={(params) => (
            <TextField {...params} label="Copy Priority" />
          )}
        />
      </TableCell>
      {/* <TableCell component="td" scope="row">
        <Typography variant="caption">{props.item.break} </Typography>
      </TableCell> */}
      <TableCell component="td">
        <Typography variant="caption">{props.item.isciCode}</Typography>
      </TableCell>
      <TableCell component="td">
        <Typography variant="caption">{props.item.isciTitle}</Typography>
      </TableCell>
      {props.ros ? (
        <TableCell component="td">
          <Typography variant="caption">{props.item.countPerc}</Typography>
        </TableCell>
      ) : (
        ""
      )}
      <TableCell component="td">
        <Typography variant="caption">{props.item.advertiserName}</Typography>
      </TableCell>
      <TableCell component="td">
        <Typography variant="caption">{`${props.item.unitTypeName} | ${props.item.costTypeName}`}</Typography>
      </TableCell>
      <TableCell component="td">
        <Typography variant="caption">{props.item.unitSizeName}</Typography>
      </TableCell>
    </TableRow>
  );
};

export default PlannedUnitItemTable;
