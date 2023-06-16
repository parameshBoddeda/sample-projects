import React, { useState } from 'react';
import { Box, Grid, Button, IconButton, Paper, Typography, Checkbox  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GridHeader from '../../sharedComponents/GridHeader/GridHeader';
import { makeStyles } from '@material-ui/core/styles';
import SelectFiles from './SelectFiles';
import DataTable from '../../sharedComponents/DataTable/DataTable';
import { GridCellCheckboxRenderer } from "@mui/x-data-grid";
import { UpLoadData } from '../../services/reconcilliation.service';
import * as AppLanguage from '../../common/AppLanguage';
import Helper from '../../common/Helper';
import renderCellExpand from '../../sharedComponents/DataTable/RenderCellExpand';

const getAirDate = (params) => {
  return <>{Helper.FormatDate(params.row.airDate)}</>
}
const getAirTime = (params) => {
  return <>{Helper.FormatTime(params.row.airTime)}</>
}

const useStyles = makeStyles(theme => ({
  tableHeight: {
    height: 'calc(100vh - 345px)',
    overflowY: 'auto',
    marginBottom: theme.spacing(1),
  },
  contentHeight: {
    height: 'calc(100vh - 266px)',
  },
}));



const ReconciliationUploadUtil = (props) => {

  const columns = [
    {
      field: "__check__",
      type: "checkboxSelection",
      sortable: false,
      width: 60,
      renderHeader: (params) => (
        <React.Fragment>
          {/* <GridHeaderCheckbox {...params} /> */}
          <Typography component="p" variant='subtitle2'>
            Ignore
          </Typography>
        </React.Fragment>
      ),
      renderCell: (params) => <Checkbox checked={params.row?.ignore !== 0 ? true : false} onChange={(event) => handleCheckboxChange(event, params.row.id)} disabled={params.row.scheduleAdUnitId} {...params} />
  
    },
    { field: 'league', headerName: 'League', width: 110, renderCell: renderCellExpand, sortable: false,},
    { field: 'regionName', headerName: 'Region', width: 110, renderCell: renderCellExpand, sortable: false,},
    { field: 'countryName', headerName: 'Country', width: 110, renderCell: renderCellExpand, sortable: false,},
    { field: 'partnerName', headerName: 'Partner', width: 160, renderCell: renderCellExpand, sortable: false,},
    { field: 'channel', headerName: 'Channel', width: 90, renderCell: renderCellExpand, sortable: false, },
    { field: 'programName', headerName: 'Program', width: 220, renderCell: renderCellExpand, sortable: false, },
    { field: 'advertiser', headerName: 'Advertiser', width: 130, renderCell: renderCellExpand, sortable: false,},
    { field: 'airDate', headerName: 'Date', width: 110, renderCell: renderCellExpand, valueGetter: getAirDate, sortable: false,},
    { field: 'airTime', headerName: 'AirTime', width: 110, renderCell: renderCellExpand, valueGetter: getAirTime, sortable: false, },
    { field: 'adID', headerName: 'Ad-Id', width: 112, renderCell: renderCellExpand, sortable: false, },
    { field: 'gameId', headerName: 'GameId', width: 112, renderCell: renderCellExpand, sortable: false,},
    { field: 'mediaType', headerName: 'MediaType', width: 112, renderCell: renderCellExpand, sortable: false,},
    // { field: 'length', headerName: 'Length', width: 70, renderCell: renderCellExpand, sortable: false, },
    // { field: 'rate', headerName: 'Rate', width: 60, renderCell: renderCellExpand, sortable: false, },
    { field: 'scheduleId', headerName: 'Schedule Id', width: 100, renderCell: renderCellExpand, sortable: false,},
    { field: 'scheduleAdUnitId', headerName: 'Schedule Ad Unit', width: 130, renderCell: renderCellExpand, sortable: false, },
    { field: 'comment', headerName: 'Comment', width: 210, renderCell: renderCellExpand, sortable: false,},
  ];

    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [validationMsg, setValidationMsg] = React.useState("");
    const [fileName, setFileName] = useState();

    const handleCancel = () => {
      setValidationMsg("")
      setRows([]);
    }

    const handleSubmit = () => {
      getUploadFile();
    }

    const handleCheckboxChange = (event, id) => {
      let tempRows = rows.map(ele => {
        if(ele.id === id){
          ele["ignore"] = event.target.checked ? 1 : 0;
        }
        return ele;
      })
      setRows(tempRows);
    }

    const getUploadFile = () => {
      // if(selectedIds && selectedIds.length > 0 && selectedIds.length !== rows.length){
      //   props.notifyWarning(AppLanguage.APP_MESSAGE.Invalid_Reconcile);
      //   return false;
      // }
      props.setShowLoading(true);
      props.setOpenBackdrop(true);
      let tempRows = rows.map(ele => {
        ele["fileName"] = fileName
        return ele;
      });
      let uploadData = [...tempRows];
      UpLoadData(uploadData).then(resp => {
        props.notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
        props.setShowLoading(false);
        props.setOpenBackdrop(false);
      }).catch(err => {
        console.log(err);
        props.setShowLoading(false);
        props.setOpenBackdrop(false);

      })
    }

    return (
        <Paper elevation={0}>
          <Grid container >
            <Grid item xs={12}>
              <Box p={1}>
                <GridHeader view={true} hasFilter={false} icon={"reconciliation"} hideExpendIcon={true}
                  hideCheckbox={true} showIcon={true} headerText={`Upload File`}
                >
                  <Box display="flex">
                    <IconButton size="small" onClick={()=>props.handleClose()}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </GridHeader>
              </Box>
            </Grid>
          </Grid>
          <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5}>
            <Grid container spacing={1} >

              <Grid item xs={12}>
                <SelectFiles setShowLoading={props.setShowLoading} setOpenBackdrop={props.setOpenBackdrop} 
                  setRowsData={data => setRows(data)} setSelectedIds={ids => setSelectedIds(ids)} notifySuccess={props.notifySuccess} validationMsg={validationMsg}
                  notifyWarning={props.notifyWarning} setValidationMsg={val => setValidationMsg(val)} setFileName={val => setFileName(val)}
                />
              </Grid>

              <Grid item xs={12} className={rows && rows.length <= 0 ? classes.contentHeight : ""}>
                {rows && rows.length > 0 ? <>
                  <Typography variant='subtitle2' color='primary' mb={.5}>Details</Typography>
                  <DataTable columns={columns} notifySuccess={props.notifySuccess} notifyWarning={props.notifyWarning} 
                    rows={rows} setSelectedIds={ids => setSelectedIds(ids)} applyCustomClass={classes.tableHeight}
                  />
                  </>
                  : null}
              </Grid>
              
            <Grid container justifyContent="flex-end" xs={12}>
              {rows && rows.length > 0 ? <>
                <Button onClick={handleCancel} color="secondary">
                  Cancel
                </Button>
                <Button variant="contained" autoFocus onClick={handleSubmit} color="primary">
                  Upload
                </Button></>
                : null}
            </Grid> 

            </Grid>
          </Box>
        </Paper>
    )
}

export default ReconciliationUploadUtil;

