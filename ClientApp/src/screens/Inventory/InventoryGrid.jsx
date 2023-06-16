import React, { useState, useEffect, useContext } from 'react';
import Grid from '@mui/material/Grid';
import InventoryUI from './InventoryUI';
import GridHeader from '../../sharedComponents/GridHeader/GridHeader';
import { Box, IconButton, Paper, FormControl, Divider, Typography, TextField, MenuItem } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import SearchComponent from '../../sharedComponents/SearchComponent/SearchComponent';
import { makeStyles } from '@material-ui/core/styles';
import * as AppConstants from '../../common/AppConstants';
import InventoryContext from '../../context/InventoryContext';
import CopySchedule from './CopySchedule/CopySchedule';
import { CheckInventoryScheduleByDate, GetCopyScheduleBreakUps } from  "../../services/inventory.service"; //"../../../services/inventory.service";
import { ToastContainer, toast } from "react-toastify";
import ConfrimDialog from '../../sharedComponents/Dialog/ConfirmDialog';
import AppDataContext from '../../common/AppContext';
import * as AppLanguage from '../../common/AppLanguage';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Helper from '../../common/Helper';
import Paging from '../../sharedComponents/Pagination/Paging';

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 189px)',
        overflowY: 'auto',
    },

    changeHeight: {
        height: 'calc(100vh - 390px)'
    },
    selectedItem: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
    },
    iconColor: {
        color: '#424242 !important',
        margin: theme.spacing(0, 1) + ' !important',
        padding: theme.spacing(1) + ' !important',
    },
    fabButton: {
        position: 'absolute !important',
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


const InventoryGrid = (props) => {
    const classes = useStyles();
    const inventoryContext = React.useContext(InventoryContext);
    const { leagueId,FilterPreference } = useContext(AppDataContext);
    const [showCS, showCopySchedule] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState([])
    const [selectedInvId, setSelectedInvId] = useState(-1)
    const [openDialog, setOpenDialog] = useState(false);
    const [copyScheduleData, setCopyScheduleData] = useState([]);
    const [csFreqSelected, setcsFreqSelected] = useState(false);
    const [csFreqStartDate, setcsFreqStartDate] = useState('');
    const [csFreqEndDate, setcsFreqEndDate] = useState('');
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const filterCriteria = props.filterCriteria;

    const filterFieldsExcluded = ["Venturize", "MarketType", "Season", "AssetType"]

    function notifySuccess(message) { toast.success(message) }
    function notifyWarning(message) { toast.warning(message) }
    function notifyError(msg) { toast.error(msg)  }

    useEffect(() => {
        handleCloseSchedule();
    }, [FilterPreference, leagueId]);

    useEffect(()=>{
        if(props.rows && props.rows.length > 0){
            setRows(props.rows);
            setPage(1);
        }

    }, [props.rows])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleOnRowsChanged = (e) => {
        setRowsPerPage(e.target.value);
    }

    const setFilterData = (filterData, status) => {
        props.resetApplyLocalFilter();
        props.setFilterData(filterData, status)
    }

    const handleOpenBuildSchedule = (value) => {
        props.setChildScreen(AppConstants.SCREEN.BUILD_SCHEDULE);
    }

    const handleOpenSchMaintenance = (value) => {

    }

    const handleShowCopySchedule = () => {
        setSelectedIndex([]);
        setcsFreqSelected(false);
        if(!props.selectedInventoryId) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__",'atleast one item from the inventory list'));
            return false;
        }

        GetCopyScheduleBreakUps(props.selectedInventoryId).then((data) => {
            if(data.length > 0) {
                setCopyScheduleData(data);
                showCopySchedule(true);
                props.handleCopySchedule(true);
            } else {
                notifyWarning(AppLanguage.APP_MESSAGE.No_Schedule_Breakup);
            }
        }).catch(err => {
            notifyError(AppLanguage.APP_MESSAGE.Notification_Err)
            console.log(err)
        })

    };

    const handleCloseSchedule = () => {
        showCopySchedule(false);
        setcsFreqSelected(false);
        setSelectedInvId(-1);
        setcsFreqStartDate('');
        setcsFreqEndDate('');
        setSelectedIndex([]);
    };

    const handleCSResetFrequncies = () => {
        setSelectedInvId(-1);
        setSelectedIndex([]);
    }

    const handleCSCheckFrequency = (isFreqselected, startDate, endDate) => {
        setcsFreqSelected(isFreqselected);
        setcsFreqStartDate(startDate);
        setcsFreqEndDate(endDate);
    }

    const handleSetIndex = (id, func) => {

        let indexes = [...selectedIndex];
        let indexesDeSelected = [...selectedIndex];
        let found = false;
        if(indexes.length > 0){
            indexes.map((ele, index) => {
                if(ele.id === id) {
                    indexesDeSelected = indexes.filter(fliterEle => fliterEle.id !== id);
                    found = true;
                }
            });
        }

        if(indexes.length <= 0 || !found) {
            if(!csFreqSelected) {
                notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__",'atleast one frequency item from the copy frequency list.'));
                return false;
            }

                // Validation to check from DB csFreqStartDate, csFreqEndDate
            CheckInventoryScheduleByDate(id, csFreqStartDate, csFreqEndDate).then((data) => {
                // console.log(data);
                if(data){
                    //conform dialog, ok insert the id
                    setOpenDialog(true);
                    setSelectedInvId(id);
                } else {
                    handleDialogOkInsInvId(id);
                }
            }).catch(err => {
                notifyError(AppLanguage.APP_MESSAGE.Notification_Err)
                console.log(err)
            })
        } else { //found and deselect it
            setSelectedInvId(-1);
            setSelectedIndex(indexesDeSelected);
        }
    }

    const handleDialogOkInsInvId = (id) => {
        let indexes = [...selectedIndex];
        indexes.push({id: id});
        setOpenDialog(false);
        setSelectedInvId(-1);
        setSelectedIndex(indexes);
    }

    const handleDialogCancelInsInvId = () => {
        setOpenDialog(false);
        setSelectedInvId(-1);
    }

    const handleAdd = () => {
        props.handleInventoryDeal();
    }

    return (
        <Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader hasFilter={filterCriteria && filterCriteria.Region.length ? true : false} hideExpendIcon={props.hideExpendIcon} showIcon={true} icon="inventory"
                            view={props.view} page={'inventory'} hideCheckbox={true} showScheduleIcon={false}
                            headerText="Inventory">
                                {
                                    filterCriteria && filterCriteria.Region.length ?
                                    <Box display="flex" className={classes.filterDetailsRow}>
                                        {
                                            (Array.isArray(filterCriteria.Country) && filterCriteria.Country.length) || (Array.isArray(filterCriteria.Region) && filterCriteria.Region.length) ?
                                                <Box display="flex" flexDirection="column">
                                                    <Typography variant="caption">
                                                        {filterCriteria.Country.length ? 'Country' : filterCriteria.Region.length ? 'Region' : ''}
                                                    </Typography>
                                                    <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={filterCriteria.Country.length ? filterCriteria.Country.map(x => x.label).join(", ") : filterCriteria.Region.map(x => x.label).join(", ")}>
                                                        {filterCriteria.Country.length ? (filterCriteria.Country.length > 1 ? filterCriteria.Country.map(x => x.label).join(", ") : filterCriteria.Country[0].label) : (filterCriteria.Region.length > 1 ? filterCriteria.Region.map(x => x.label).join(", ") : filterCriteria.Region[0].label)}
                                                    </Typography>
                                                </Box> : ""
                                        }
                                        {
                                            Object.entries(filterCriteria).map((elem) => {
                                                if(!filterFieldsExcluded.includes(elem[0])) {
                                                    if(typeof elem[1] === "object" && !Array.isArray(elem[1]) && elem[1] !== null) {
                                                        return <Box display="flex" flexDirection="column">
                                                                <Typography variant="caption">
                                                                    {elem[0]}
                                                                </Typography>
                                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={elem[1].label}>
                                                                    {elem[1].label}
                                                                </Typography>
                                                            </Box>
                                                    } else if(Array.isArray(elem[1]) && elem[1].length) {
                                                        if(elem[0] !== "Region" && elem[0] !== "Country") {
                                                            return <Box display="flex" flexDirection="column">
                                                                <Typography variant="caption">
                                                                    {elem[0] === "MediaType" ? "Media Type" : elem[0]}
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
                                <Box display="flex">
                                    <SearchComponent enableCustomFilter={true}
                                        applyLocalFilter={props.applyLocalFilter}
                                        resetApplyLocalFilter={props.resetApplyLocalFilter}
                                        restrictedFields={["id","inventoryStagingId", "salesUnitDesc", "venturizedId",
                                        "seasonId","seasonName","networkId", "mediaTypeParentId","inventoryDealId",
                                        "regionId","countryId", "inventoryId","institutionalUnit", "isFound",
                                        "programId","mediaTypeId","buildCount", "marketTypeId","institutionalUnitDesc",
                                        "partnerId", "scheduleStatus", "unitStatus","venturizedText",
                                        "contentCount","createdBy","createdDate","dealRegionId","assetId","networkCode",
                                        "mediaTypeDisplayName","mediaTypeName","dealRegionName", "networkName","marketTypeName",
                                        "updatedBy","updatedDate"]}
                                        searchAbleField="inventoryItems"
                                        setSearchItem={props.setSearchItem}
                                        setFilterData={setFilterData}
                                        searchItem={props.searchItem}
                                        jsonData={props.rows}
                                        originalData={props.originalData}
                                    />
                                </Box>
                                <Box display="flex">
                                    <IconButton title="Copy Schedule" className={`${classes.iconColor} ${showCS ? classes.selectedItem : ""}`} size="small" onClick={handleShowCopySchedule} >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Box>
                        </GridHeader>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Box className={`${classes.contentHeight} ${showCS ? classes.changeHeight : ""}`}>
                <Grid container>
                    {rows.length > 0 && <Grid item xs={12} sm={12} md={12}>
                        <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                            {
                                rows.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                                    return <InventoryUI isEditing={props.isEditing} selectedInventoryId={props.selectedInventoryId}
                                        handleGenerateScheduleClick={props.handleGenerateScheduleClick} selectedIndex={selectedIndex}
                                        handleSplitUnit={props.handleSplitUnit} handleMonthlySplitClick={props.handleMonthlySplitClick}
                                        key={index} data={data} index={index} view={props.view} showCS={showCS} inventoryReports={props.inventoryReports}
                                        getSplitUnitData={(id) => props.getSplitUnitData(id, index)} handleSetIndex={handleSetIndex}
                                        InventoryRows={props.InventoryRows} handleRowClick={props.handleRowClick}
                                        handleInventoryDealEditClick = {props.handleInventoryDealEditClick} selectedDealId={props.selectedDealId}
                                        handleDigitalAdditionalInfoClick={props.handleDigitalAdditionalInfoClick}
                                        selectedMediaTypeId={props.selectedMediaTypeId} refreshPage={props.refreshPage}
                                    />
                                })
                            }
                        </div>
                    </Grid>}
                    {
                        rows.length > 0 &&  <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
                            <Paging minRows={20} currentpage={page} rows={rows.length} 
                                rowsPerPage={rowsPerPage} handleChangePage={handleChangePage} 
                                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
                            />
                        </Grid>
                    }
                    {
                        rows.length < 1 && <Typography pl={1} pt={1} variant="subtitle1">
                            No Record.
                        </Typography>
                    }
                    <Fab size="small" title="Add Inventory Deal" color="primary" className={classes.fabButton} aria-label="add" onClick={handleAdd}>
                        <AddIcon />
                    </Fab>
                    {
                        props.selectedInventoryId && <CopySchedule refreshPage={props.refreshPage}
                            srcId={props.selectedInventoryId} destIds={selectedIndex} clearData={props.clearData}
                            copyData={copyScheduleData} show={showCS}
                            handleCSClose={handleCloseSchedule} handleCSOpen={()=>showCopySchedule(true)} handleCSReset={() => handleCSResetFrequncies()}
                            handleCSCheckFrequency={(isFreqselected, startDate, endDate) => handleCSCheckFrequency(isFreqselected, startDate, endDate)}
                        />
                    }
                    {selectedInvId >= 0 && <ConfrimDialog open={openDialog} title={'Copy Schedule'} description={'Schedule data already exists with the selected frequencies, do you want to override it?'} ok={'OK'} cancel={'Cancel'} handleDialogOk={() => handleDialogOkInsInvId(selectedInvId)} handleDialogCancel={() => handleDialogCancelInsInvId()}></ConfrimDialog>}
                </Grid>
            </Box>
        </Paper>
    )
}

InventoryGrid.displayName = "InventoryGrid";
export default InventoryGrid;