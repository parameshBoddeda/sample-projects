import React, { useState, useEffect, useContext } from 'react';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown'; 
import GroupRadioButtons from '../../../sharedComponents/GroupRadioButtons/GroupRadioButtons'
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, TextareaAutosize, Snackbar, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
//import { DataGrid } from '@mui/material/data-grid';
import { Grid, Container, Button, ButtonGroup, Typography, CircularProgress, Paper, Chip, FormControl, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//import { GetONBAuditLog, GetONBInvalidEmployees, UpdateONBNewEmployee } from '../../services/common.service';
import BuildInventory from './BuildInventory';
import AppDataContext from '../../../common/AppContext';
import Checkbox from '@mui/material/Checkbox';
import { green, yellow } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Helper from '../../../common/Helper';
import Fade from '@mui/material/Fade';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import CloseIcon from '@mui/icons-material/Close';
import PickDate from "../../../sharedComponents/PickDate/PickDate";

const inventoryColumns = [
    { id: 'employeeId', label: 'Unit Type', width: '10%', disablePadding: false, },
    { id: 'employeeFirstLastName', label: 'Unit Cost Type', width: '15%', disablePadding: false, },
    { id: 'documentName', label: 'Unit Size', width: '25%', disablePadding: false, },
    { id: 'processStatusOut', label: 'Is Sellable', width: '10%', disablePadding: false, },
    { id: 'failedReason', label: 'New Units', width: '25%', disablePadding: false, },
];

const useStyles = makeStyles((theme) => ({
    buildScheduleTable: {
        '& .MuiTableCell-head': {
            backgroundColor: '#f8f8f8',
        },
    },
}));

const BuildSchedule = (props) => {
    const classes = useStyles();
    const { userPermissions, userId } = useContext(AppDataContext);
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(true);
    const [openSuccess, setOpenSuccess] = useState(false);

    const [InvalidEmployeeIdValidation, setInvalidEmployeeIdValidation] = useState(false);
    const [NewEmployeeIdValidation, setNewEmployeeIdValidation] = useState(false);
    const [InvalidEmployeeId, setInvalidEmployeeId] = useState(null);
    const [NewEmployeeId, setNewEmployeeId] = useState(null);

    const [InvalidEmployeeIdOpt, setInvalidEmployeeIdOpt] = useState([]);
    const [employeesRows, setEmployeesRows] = useState(null);

    const [ONBEmpId, setONBEmpId] = useState(null);

    const [ErrFromDate, setErrFromDate] = useState(false);
    const [ErrToDate, setErrToDate] = useState(false);

    const [EmployeeId, setEmployeeId] = useState(null);
    const [Firstname, setFirstname] = useState(null);
    const [Lastname, setLastname] = useState(null);
    const [FromDate, setFromDate] = useState(null);
    const [ToDate, setToDate] = useState(null);
    const [IsPending, setIsPending] = useState(false);
    const [IsCompleted, setIsCompleted] = useState(false);
    const [IsFailed, setIsFailed] = useState(false);
    const [IsNotReqUpload, setIsNotReqUpload] = useState(false);
    const [Error, setError] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitNewEmployee, setIsSubmitNewEmployee] = useState(false);
    const [FailedEmployees, setFailedEmployees] = useState([]);


    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    const InformError = () => {

    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccess(false);
    };

    const handlePendingChange = (event) => {
        setIsPending(event.target.checked);
    };

    const handleCompletedChange = (event) => {
        setIsCompleted(event.target.checked);
    };
    const handleFailedChange = (event) => {
        setIsFailed(event.target.checked);
    };
    const handleNotReqUploadChange = (event) => {
        setIsNotReqUpload(event.target.checked);
    };

    //const getInvalidEmployees = () => {

    //    GetONBInvalidEmployees(EmployeeId, Firstname, Lastname, FromDate, ToDate, IsPending, IsCompleted, IsFailed, IsNotReqUpload)
    //        .then(data => {
    //            console.log(data);
    //            setFailedEmployees(data);
    //            setInvalidEmployeeIdOpt(data);
    //        }).catch(err => {
    //            throw err;
    //        });

    //};

    const validatSearchForm = () => {
        //debugger;
        let isValid = true;

        if (FromDate === '' || FromDate === null) {
            setErrFromDate(true);
            isValid = false;
        }
        else {
            setErrFromDate(false);
        }

        if (ToDate === '' || ToDate === null) {
            setErrToDate(true);
            isValid = false;
        }
        else {
            setErrToDate(false);
        }


        return isValid;
    };

    //const searchForONBDocumentAudit = (fromDate, toDate) => {
    //    // debugger;

    //    GetONBAuditLog(EmployeeId, Firstname, Lastname, (fromDate === undefined ? FromDate : fromDate), (toDate === undefined ? ToDate : toDate), IsPending, IsCompleted, IsFailed, IsNotReqUpload).then(data => {
    //        console.log(data);
    //        setEmployeesRows(data);
    //    }).catch(err => {
    //        throw err;
    //    });
    //}


    //const updateEmployeeId = () => {
    //    //debugger;
    //    let documentInfo = {};
    //    documentInfo.oNBEmpId = ONBEmpId.trim();
    //    documentInfo.newEmployeeId = NewEmployeeId;
    //    setLoading(true);
    //    setIsSubmitNewEmployee(true);
    //    setError(null);
    //    UpdateONBNewEmployee(documentInfo).then(data => {
    //        setLoading(false);
    //        setOpenSuccess(true);
    //        setOpen(false);
    //        if (data) {
    //            setSuccess(true);
    //            searchForONBDocumentAudit();
    //            setInvalidEmployeeId('');
    //            setONBEmpId('');
    //            setFailedEmployees([]);
    //        } else {
    //            setSuccess(false);
    //        }
    //    }).catch(err => {
    //        setLoading(false);
    //        throw err;
    //    });
    //}
    const handleSelected = (value) => {

    }

    const handleChange = (value) => {

    } 

    const handleCloseBuildSchedule = (value) => {
        props.setChildScreen("");
    }

    useEffect(() => {
        //debugger;
        var date = new Date();
        //var fromDate = `${date.getMonth() + 1}-${date.getDate() - 7}-${date.getFullYear()}`;
        //var toDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
        //var fromDateFormat = Helper.FormatDateToYYYYMMDD(fromDate);
        //var toDateFormat = Helper.FormatDateToYYYYMMDD(toDate);
        //fromDateFormat = '2021-07-16';
        //toDateFormat = '2021-07-23';
        //var fromDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 7}`;
        //var toDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        //fromDate = '2021-07-16';
        //toDate = '2021-07-23';

        var fromDate;
        date.setDate(date.getDate() - 7);

        fromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
            + ('0' + date.getDate()).slice(-2);


        date = new Date();
        var toDate;
        date.setDate(date.getDate());

        toDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
            + ('0' + date.getDate()).slice(-2);


        setFromDate(fromDate);
        setToDate(toDate);

        //searchForONBDocumentAudit(fromDate, toDate);
    }, []);

    return (
        <Box component={Paper} px={2} py={1}>
            <Grid container spacing={1}>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="primary">Build Schedule</Typography>
                        <IconButton aria-label="delete" size="small" onClick={handleCloseBuildSchedule}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </Box>
            </Grid>
            <Grid item xs={12} md={12}>

                <form className={classes.root}>
                        <Grid container spacing={1}>
                            <Grid item sm={2}>
                                <FormControl size="small" fullWidth>
                            <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Region" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "United States",
                                    "value": "United States"
                                },
                                {
                                    "label": "Russia",
                                    "value": "Russia"
                                },
                                
                                    ]} />
                                </FormControl>
                                    </Grid>
                            <Grid item sm={2}>
                                <FormControl size="small" fullWidth>
                                    <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Country" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "United States",
                                    "value": "United States"
                                },
                                {
                                    "label": "Russia",
                                    "value": "Russia"
                                },

                                    ]} />
                                </FormControl>
                        </Grid>
                            <Grid item sm={2}>
                                <FormControl size="small" fullWidth>
                            <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Media Type" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "TV",
                                    "value": "TV"
                                },
                                {
                                    "label": "Radio",
                                    "value": "Radio"
                                },

                                    ]} />
                                </FormControl>
                            </Grid>
                            <Grid item sm={6}>
                                <Box display="flex" flexDirection="column" flex="1">
                                    <Typography variant="caption" fontWeight="medium">Selected Media</Typography>
                                    <Box display="flex">
                                        <Chip
                                            label="TV"
                                            size="small"
                                            //onClick={handleClick}
                                            //onDelete={handleDelete}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={3}>
                                        <FormControl fullWidth>
                                        <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Network" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                            {
                                                "label": "ABC",
                                                "value": "1039"
                                            },
                                            {
                                                "label": "ESPN America",
                                                "value": "428"
                                            },

                                            ]} />
                                        </FormControl>
                            </Grid>
                            <Grid item sm={9}>
                                        <Box display="flex" flexDirection="column" flex="1">
                                            <Typography variant="caption" fontWeight="medium">Selected Network</Typography>
                                            <Box display="flex">
                                                <Chip
                                                    label="ABC"
                                                    size="small"
                                                //onClick={handleClick}
                                                //onDelete={handleDelete}
                                                />
                                            </Box>
                                        </Box>                     
                        </Grid>
                            <Grid item sm={3}>
                                <FormControl fullWidth>
                                    <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Program" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "Game",
                                    "value": "Game"
                                },
                                {
                                    "label": "NBA TV",
                                    "value": "NBA TV"
                                },

                                    ]} />
                                </FormControl>
                            </Grid>
                            <Grid item sm={9}>
                                <Box display="flex" flexDirection="column" flex="1">
                                    <Typography variant="caption" fontWeight="medium">Selected Programs</Typography>
                                    <Box display="flex">
                                        <Chip
                                            label="ABC"
                                            size="small"
                                        //onClick={handleClick}
                                        //onDelete={handleDelete}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={3}>
                                <FormControl fullWidth>
                            <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Episodes" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "Episode1",
                                    "value": "Episode1"
                                },
                                {
                                    "label": "Episode2",
                                    "value": "Episode2"
                                },

                                    ]} />
                                </FormControl>
                            </Grid>
                            <Grid item sm={9}>
                                <Box display="flex" flexDirection="column" flex="1">
                                    <Typography variant="caption" fontWeight="medium">Selected Episodes</Typography>
                                    <Box display="flex">
                                        <Chip
                                            label="ABC"
                                            size="small"
                                        //onClick={handleClick}
                                        //onDelete={handleDelete}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={7}>
                                <Typography variant="subtitle2" fontWeight="normal" component="p">Air Date/Time</Typography>
                             <TableContainer className={classes.buildScheduleTable}>
                                <Table
                                    className={classes.table}
                                    aria-labelledby="tableTitle"
                                    size={'small'}
                                    aria-label="enhanced table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align={'left'}
                                            >
                                                Program
                                            </TableCell>
                                            <TableCell
                                                align={'left'}
                                            >
                                                Start Date
                                            </TableCell>
                                            <TableCell
                                                align={'left'}
                                            >
                                                End Date
                                            </TableCell>
                                            <TableCell
                                                align={'left'}
                                            >
                                                Air Time
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={props.colspan}>
                                                <div className={classes.notify}>1</div>
                                            </TableCell>
                                            <TableCell colSpan={props.colspan}>
                                                    <div className={classes.notify}>
                                                        <PickDate label="Date" />
                                                    </div>
                                            </TableCell>
                                            <TableCell colSpan={props.colspan}>
                                                    <div className={classes.notify}>
                                                        <PickDate label="Date" />
                                                    </div>
                                            </TableCell>
                                            <TableCell colSpan={props.colspan}>
                                                <div className={classes.notify}>4</div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>
                            <Grid item sm={5}></Grid>
                            <Grid item sm={2}>
                                <FormControl fullWidth>
                            <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Day(s)" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "Monday",
                                    "value": "Monday"
                                },
                                {
                                    "label": "Tuesday",
                                    "value": "Tuesday"
                                },
                                {
                                    "label": "Wednesday",
                                    "value": "Wednesday"
                                },
                                {
                                    "label": "Thursday",
                                    "value": "Thursday"
                                }, {
                                    "label": "Friday",
                                    "value": "Friday"
                                },
                                {
                                    "label": "Saterday",
                                    "value": "Saterday"
                                },
                                {
                                    "label": "Sunday",
                                    "value": "Sunday"
                                },
                                    ]} />
                                </FormControl>
                            </Grid>
                            <Grid item sm={10}>
                                <Box display="flex" flexDirection="column" flex="1">
                                    <Typography variant="caption" fontWeight="medium">Selected Days</Typography>
                                    <Box display="flex">
                                        <Chip
                                            label="ABC"
                                            size="small"
                                        //onClick={handleClick}
                                        //onDelete={handleDelete}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={2}>
                                <FormControl fullWidth>
                            <Dropdown id="myId" variant="outlined" size="small" showLabel={true} lbldropdown="Frequency" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                                {
                                    "label": "Daily",
                                    "value": "Daily"
                                },
                                {
                                    "label": "Monthly",
                                    "value": "Monthly"
                                },
                                {
                                    "label": "Yearly",
                                    "value": "Yearly"
                                },
                                    ]} />
                                </FormControl>
                        </Grid>
                        <Grid item sm={10} className={classes.btnParent}>
                            <FormControlLabel
                                control={<Checkbox checked={true} onChange={handleFailedChange} name="chkFailed" />}
                                label="Build Units"
                            />
                        </Grid>
                        
                    </Grid>
                </form>
                
                <div className={classes.dataGrid}>
                    <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={success ? "success" : "error"}>
                            {success ? (isSubmitNewEmployee ? "New Employee updated!" : "The document is resubmitted!") : ((Error !== null) ? Error : "Error occurred!")}
                        </Alert>
                    </Snackbar>
                    
                </div>
            </Grid>
            </Grid>
        </Box>
    )
}
export default withRouter(BuildSchedule);