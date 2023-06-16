import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Helper from '../../../common/Helper';


const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
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
  }));

const ErrorDetails = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.toolbar} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center" pb={2} pt={1}
      >
      <Typography variant="subtitle2" color="secondary">
        Media Plan Validation Failed
      </Typography>
      </Box>
      <TableContainer
          square
          // component={Paper}
          className={classes.filteredListTable}
        >
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>                  
                <TableCell width="31%">
                  <Typography variant="caption" fontWeight="medium">
                    Episode Name
                  </Typography>
                </TableCell>
                <TableCell width="12%">
                  <Typography variant="caption" fontWeight="medium">
                    EstDate
                  </Typography>
                </TableCell>
                <TableCell width="12%">
                  <Typography variant="caption" fontWeight="medium">
                    Unit Type 
                  </Typography>
                </TableCell>
                <TableCell width="20%">
                  <Typography variant="caption" fontWeight="medium">
                  Available | Required
                  </Typography>
                </TableCell>
                <TableCell width="25%">
                  <Typography variant="caption" fontWeight="medium">
                    Message
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {props.errorDetails.map((item, index) => {
               return (<TableRow key={'valPlanError' + index.toString()} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                <TableCell component="td">
                  <Typography variant="caption">{item.EpisodeName}</Typography>
                </TableCell>
                <TableCell component="td">
                  <Typography variant="caption">{Helper.FormatDate(item.EstDateTime)}</Typography>
                </TableCell>
                <TableCell component="td">
                  <Typography variant="caption">{item.UnitTypeName}</Typography>
                </TableCell>
                <TableCell component="td" align='center'>
                  <Typography variant="caption">{item.AvailableUnit} | {item.RequiredUnit}</Typography>
                </TableCell>
                <TableCell component="td">
                  <Typography variant="caption" color={(item.MessageInfo.indexOf('Failed') !== -1 || item.MessageInfo === 'Out of range') ? 'secondary' : 'Primary'}>{item.MessageInfo} {item.MessageInfo === 'Out of range' ? '#' : (item.MessageInfo.indexOf('Failed') !== -1 ? '*' : '')}</Typography>
                </TableCell>
              </TableRow>)
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" flexDirection="column" alignContent="start" pt={2}>
        <Typography variant="subtitle2" color="secondary">* Unit(s) are not available for the Episode(s)</Typography>
        <Typography variant="subtitle2" color="secondary"># Schedule is out of Planned date range</Typography>
        {props.showRefreshMsg && <Typography variant="subtitle2" color="secondary">Please search again to know available Inventory.</Typography>}
        <Button color="primary" onClick={() => props.handleClose()}>Close</Button>
      </Box>
    </>
  )
}

export default ErrorDetails