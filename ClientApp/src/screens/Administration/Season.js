import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, 
        TableHead, TableRow, TextField, Typography, Button, Tooltip, Dialog, DialogTitle, DialogContent, InputLabel, FormControl, DialogActions } from "@material-ui/core";
import {
    Pagination,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useState, useEffect, useContext } from "react";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
//import { MuiPickersUtilsProvider, DatePicker, DateTimePicker, TimePicker } from "@mui/pickers";

import AppDataContext from "../../common/AppContext";
import { GetLeagues, GetSeasons, InsUpdSeason, ExportToExcel } from './../../services/common.service';
import Helper from '../../common/Helper'
import SelectDropdown from "../../sharedComponents/SelectDropdown/SelectDropDown";
import APIURLConstants from "../../common/ApiURLConstants";
import GreenCircle from "../../sharedComponents/customIcons/GreenCircle";
import RedCircle from "../../sharedComponents/customIcons/RedCircle";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        height: `calc(100vh - 20px)`,
    },
    pagination: {
        flexGrow: 1,
        float: 'right',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    table : {
        width : '98%'
    },
    searchContainer: {
        display: 'flex',
        justifyContent: 'flex-end',        
        padding: '0 10px 15px',
        alignItems : 'center'
    },
    contentAreaAppBar: {
        display: "flex",
        justifyContent: 'space-between',
        padding: '5px 25px',
        alignItems: 'center',
    },
}));


const Season = (props) =>{
    const classes = useStyles();
    const [SeasonList, setSeasonList] = useState([]);
    const [filteredSeasonList, setFilteredSeasonList] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchName, setSearchName] = useState('');
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [showDialog, setShowDialog] = useState(null);

    const getSeasonData = () =>{
        GetSeasons().then(data => {
            if (data) {
                console.log("received latest data");
                setSeasonList(data);
                setFilteredSeasonList(data);
            }
            else console.log("Seasons API is failing");
        });
    }

    // API call to the Season List data
    useEffect(() => {
        getSeasonData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleValueChange = (e) => {

        if (e.target.value.length > 0) {
            let text = e.target.value.toLowerCase();
            let filtredData = SeasonList.filter(x => x.seasonName.toLowerCase().indexOf(text) !== -1 || (x.leagueName.toLowerCase().indexOf(text) !== -1));
            setFilteredSeasonList(filtredData);
        }
        else
            setFilteredSeasonList(SeasonList);

        setSearchName(e.target.value);
    }

    const addNew =()=>{
        setShowDialog(true);
    }

    const onEditClick = (data) =>{
        data.startDate = Helper.FormatToIsoDate(data.startDate);
        data.endDate = Helper.FormatToIsoDate(data.endDate);
        setSelectedSeason(data);
        setShowDialog(true);
    }

    const handleDialogClose = (refresh)=>{
        setShowDialog(false);
        setSelectedSeason(null);
        if(refresh)
            getSeasonData();
    }

    const exportExcel =()=>{
        let url = 'https://localhost:60000/api' + APIURLConstants.EXPORT_TO_EXCEL
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.responseType = 'arraybuffer';

        try {
            xhr.onload = function () {
                if (this.status == 200) {
                    let fileName = "TrafficLetter";
                    var blob = new Blob([this.response], { type: "application/vnd.ms-excel" });
                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName + ".xlsx";
                    link.click();
                }
            };
            xhr.send();
        }
        catch (err) { // instead of onerror
            alert("Request failed" + err);
        }

        ExportToExcel().then(() => {
            
        }).catch(err =>
            console.log(err)
        )
    }

    return(
        <div className={classes.root}>
            <Paper square={true}>
                <div className={classes.contentAreaAppBar}>
                    <Typography variant="h6">Season</Typography>
                </div>
            </Paper>
            <Box className={classes.searchContainer}>
                <Box alignItems="center" display="flex" flex="1">
                    &nbsp; Search :&nbsp;&nbsp;<TextField margin="dense" key="searchName" required
                        name="searchName" variant="outlined" inputProps={{ maxLength: '10' }}
                        autoComplete="off" value={searchName} onChange={(e) => handleValueChange(e)}
                    />
                </Box>
                <div>
                    <Button variant="contained" color="primary" startIcon={<AddOutlinedIcon />} onClick={(e) => addNew(e)}>
                        ADD
                    </Button>
                    {/* <Button variant="contained" color="primary" onClick={(e) => exportExcel(e)}>
                        Export
                    </Button> */}
                </div>
            </Box>
            <Box alignItems="center" display="flex" justifyContent="center">
                <TableContainer component={Paper} className={classes.table}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: '30%' }}>Season Name</StyledTableCell>
                                <StyledTableCell style={{ width: '15%' }}>League Name</StyledTableCell>
                                <StyledTableCell style={{ width: '10%' }}>Year</StyledTableCell>
                                <StyledTableCell style={{ width: '15%' }}>Start Date</StyledTableCell>
                                <StyledTableCell style={{ width: '15%' }}>End Date</StyledTableCell>
                                <StyledTableCell style={{ width: '20%' }}>Current Season</StyledTableCell>

                                <StyledTableCell align="right" style={{ width: '10%' }}>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSeasonList && filteredSeasonList.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                                return (
                                    <TableRow className={classes.tableRow}>
                                        <TableCell align="left" style={{ width: '30%' }} >
                                            <Typography variant="body2"> {data.seasonName} </Typography>
                                        </TableCell>
                                        <TableCell align="left" style={{ width: '15%' }} >
                                            <Typography variant="body2"> {data.leagueName} </Typography>
                                        </TableCell>
                                        <TableCell align="left" style={{ width: '10%' }} >
                                            <Typography variant="body2"> {data.year} </Typography>
                                        </TableCell>
                                        <TableCell align="left" style={{ width: '15%' }} >
                                            <Typography variant="body2"> {Helper.FormatDate(data.startDate)} </Typography>
                                        </TableCell>
                                        <TableCell align="left" style={{ width: '15%' }} >
                                            <Typography variant="body2"> {Helper.FormatDate(data.endDate)} </Typography>
                                        </TableCell>
                                        <TableCell align="left" style={{ width: '20%' }} >
                                            <Typography variant="body2"> {data.isCurrentSeason?<GreenCircle/>:<RedCircle/>} </Typography>
                                        </TableCell>
                                        <TableCell align="right" style={{ width: '10%' }}>
                                            <Tooltip title="Edit" onClick={() => onEditClick(data)} style={{ cursor: "pointer" }}>
                                                <EditOutlinedIcon color="primary" />
                                           </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan="6" align="center">
                                    <Box display="flex" flex="1" alignItems="center" justifyContent="center" >
                                        <Typography variant="subtitle2" >Page: {page}</Typography>
                                        <Pagination count={Math.ceil(filteredSeasonList.length / 10)} showFirstButton showLastButton page={page} onChange={handleChangePage} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>

            {showDialog && <ManageSeason
                open={showDialog}
                onClose={(refresh) => handleDialogClose(refresh)}                
                data={selectedSeason}                
            >
            </ManageSeason>
            }
        </div>
    )
}

export default Season;

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#24428a",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const ManageSeason = (props) =>{

    let obj ={
        seasonId : 0,
        year : Helper.GetCurrentYear(),
        startDate : null,
        endDate : null,
        seasonName : '',
        leagueId : 1,
        leagueName : ''
    }

    let errorObj = {
        year: false,
        startDate: false,
        endDate: false,
        seasonName: false,
        leagueId: false
    }
    const classes = useStyles();
    const [seasonInfo, setSeasonInfo] = useState(props.data??obj);
    const [leagueData, setLeagueData] = useState([]);
    const [errorInfo, setErrorInfo] = useState(errorObj);
    const { Leagues } = useContext(AppDataContext);
    const[isCurrentSeason, setisCurrentSeason] = useState(props.data?.isCurrentSeason || false);
    // const loadLeague = () => {
    //     GetLeagues().then((data) => {
    //         let leagueData = [];
    //         data.map(item => {
    //             leagueData.push({ label: item.leagueName, value: item.id });
    //         });
    //         setLeagueData(leagueData);
    //     }).catch(err => console.log(err))
    // };

    useEffect(() => {
        //loadLeague();
        if(Leagues){
            let leagueData = [];
            Leagues.map(item => {
                leagueData.push({ label: item.leagueName, value: item.id });
            });
            setLeagueData(leagueData);
        }
    }, [Leagues]);

    const handleValueChange = (field, value) => {
        setSeasonInfo({ ...seasonInfo, [field]: value });
    }

    const handleClose = () => {
        props.onClose(false);
    };

    const handleSubmit = ()=>{
        let error = errorObj;
        if(seasonInfo.seasonName === '')
            error.seasonName = true;
        if(seasonInfo.year === '' || seasonInfo.year === 0)
            error.year = true;
        if (!seasonInfo.startDate || seasonInfo.startDate === '')
            error.startDate = true;
        if (!seasonInfo.endDate || seasonInfo.endDate === '')
            error.endDate = true;

        setErrorInfo(error);
        if (Object.values(error).indexOf(true) === -1){
            //call api.
            InsUpdSeason(seasonInfo).then(() => {                
                props.onClose(true);
            }).catch(err =>
                console.log(err)
            )
        }
    }

    const handleCurrentSeasonChange = (e) => {
        setisCurrentSeason(!isCurrentSeason);
        seasonInfo.isCurrentSeason = !isCurrentSeason;
        // let isCurrentSeason = false;
        // if (e.target.checked) {
        //     isCurrentSeason = true;
        // }
        //  return isCurrentSeason;
            }

    let title = props.data ? 'Edit Season' : 'Add Season';

    return(
        <Dialog
            open={props.open}
            maxWidth='md'
            fullWidth={true}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} className={classes.grid}>
                        <InputLabel htmlFor="seasonNames">Season Name</InputLabel>
                        <FormControl fullWidth required variant="outlined" >
                            <TextField margin="dense" fullWidth key="seasonName" required
                                name="seasonName" variant="outlined" inputProps={{ maxLength: '100' }}
                                error={errorInfo.seasonName}
                                autoComplete="off" value={seasonInfo.seasonName} onChange={(e) => handleValueChange('seasonName', e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.grid}>
                        <InputLabel htmlFor="league">League</InputLabel>
                        <SelectDropdown handleChange={(value) => handleValueChange('leagueId', value)} 
                            className={classes.headerDropdown} fullWidth
                            showImages={false}
                            data={leagueData} selectValue={seasonInfo.leagueId} />
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.grid}>
                        <InputLabel htmlFor="year">Season Year</InputLabel>
                        <TextField
                            id="year"
                            type="number"
                            value={seasonInfo.year}
                            error={errorInfo.year}
                            onChange={(e) => handleValueChange('year', parseInt(e.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>                    
                    <Grid item xs={12} sm={6} className={classes.grid}>
                        <InputLabel htmlFor="startDate">Start Date</InputLabel>
                        <TextField
                            id="startDate"
                            type="date"
                            format="MM/dd/yyyy"
                            value={seasonInfo.startDate}
                            className={classes.textField}
                            error={errorInfo.startDate}
                            onChange={(e) => handleValueChange('startDate', e.target.value) }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.grid}>
                        <InputLabel htmlFor="endDate">End Date</InputLabel>
                        <TextField
                            id="endDate"
                            format="MM/dd/yyyy"
                            value={seasonInfo.endDate}
                            type="date"
                            error={errorInfo.endDate}
                            onChange={(e) => handleValueChange('endDate', e.target.value)}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.grid}>
                        <Box display="flex">
                            <FormControlLabel
                                size="small"
                                label={
                                    <Typography
                                        color="primary"
                                        fontWeight="medium"
                                        variant="caption"
                                    >
                                        Current Season
                                    </Typography>
                                }
                                control={
                                    <Checkbox
                                        onChange={handleCurrentSeasonChange}
                                        size="small"
                                        checked={isCurrentSeason}
                                        className={classes.checkboxPadding}
                                    />
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button variant="contained" autoFocus onClick={handleSubmit} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog >

    )
}