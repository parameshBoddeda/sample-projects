import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Helper from '../../common/Helper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import Collapse from '@mui/material/Collapse';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { GetSchedules } from "../../services/common.service";
import { DeleteInventory } from "../../../src/services/inventory.service";
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import * as AppConstants from '../../common/AppConstants';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import ConfrimDialog from "../../sharedComponents/Dialog/ConfirmDialog";
import { toast } from "react-toastify";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const BorderLinearProgressFull = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#a5d6a7',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        // backgroundColor: theme.palette.mode === 'light' ? '#469a10' : '#469a10',
        backgroundColor: '#469a10',
    },
}));

const BorderLinearProgressUnder = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#FFA500',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        // backgroundColor: theme.palette.mode === 'light' ? '#FFA500' : '#FFA500',
        backgroundColor: '#FFA500',
    },
}));

const BorderLinearProgressOver = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#FF0000',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        // backgroundColor: theme.palette.mode === 'light' ? '#FF0000' : '#FF0000',
        backgroundColor: '#FF0000',

    },
}));
const useStyles = makeStyles(theme => ({
    rowContainer: {
        border: "none",
        borderBottom: "1px solid",
        width: '100%'
    },
    container: {
        padding: '16px 0px',
        width: '100%'
    },
    episodes: {
        minWidth: theme.spacing(15),
        maxWidth: theme.spacing(15),
        '& .MuiInputLabel-root': {
            fontSize: '.75rem',
        },
        '& .MuiInputBase-input': {
            fontSize: '.75rem',
            padding: theme.spacing(0, .5, 0, .75) + '!important',
        },
    },
    time: {
        '& .MuiInputBase-input': {
            fontSize: '.75rem',
            padding: theme.spacing(.75),
        },
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }

    },
    selectedItem: {
        '& svg': {
            color: '#94d584',
        }
    },
    selectedDealRow: {
        backgroundColor: "#f0f7ff",
    },
    iconColor: {
        color: '#424242 !important',
    },
    date1: {
        '& .MuiInputLabel-root': {
            fontSize: '.75rem',
            transform: 'translate(14px, 6px) scale(1)',
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(.35, .75),
        },
    },
    done: {
        // color: '#3BB11E !important',
    },
    cancel: {
        color: '#C81020 !important',
    },
    refresh: {
        color: '#F6AB27 !important',
    },
    selected: {
        background: "#e4ecff"
    },
    inventoryRow: {
        cursor: "pointer"
    },
    statusOver
    : {
        color: '#FF0000',
  },

}));

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function notifyWarning(message) {
    toast.warning(message);
}
function notifySuccess(message) {
    toast.success(message);
}

const InventoryUI = React.memo((props) => {
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [mediaType, setMediatype] = React.useState(AppConstants.Inventory.MediaTypeId);
    let { data, index, view } = props;
    const [schedulesdata, setSchedulesdata] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteInventoryId, setDeleteInventoryId] = useState(null);
    const classes = useStyles();
    const handleClick = (index, InventoryId, quantityTo, programName, data, seasonStartDate,
        seasonEndDate, assetId) => {
        if (props.handleGenerateScheduleClick) {
            props.handleGenerateScheduleClick(index, InventoryId, quantityTo, programName, data, seasonStartDate,
                seasonEndDate, assetId);
        }
    }
    const handleDigitalAdditionalInfoClick = (programName, btnName, InventoryId, assetId) => {
        // if (props.isEditing) {
        //     return false;
        // }
        if (props.handleDigitalAdditionalInfoClick) {
            props.handleDigitalAdditionalInfoClick(programName, btnName, InventoryId, assetId);
        }
    }

    const handleChecked = (index) => {
        // let tempObj = [] = {
        //   index: index, checked: true
        // };
        // tempObj = checkedObj.length > 0 ?  tempObj.push(checkedObj) : tempObj;
        // debugger;
        // setCheckedObj(tempObj);
    }

    const handlednaChecked = (index) => {

    }

    const handleIconClick = (id, func) => {
        if (props.handleSetIndex) {
            props.handleSetIndex(id, func);
        }

    }

    const getSchedules = () => {
        GetSchedules().then(schdata => {
            setSchedulesdata(schdata);
        }).catch(err => {
            throw err;
        });
    }

    const checkSelection = (id) => {
        let isSelected = false;
        props.selectedIndex.forEach(ele => {
            if (!isSelected) {
                if (ele.id === id && !isSelected) {
                    isSelected = true;
                }
            }

        });
        return isSelected;
    }


    const handleExpandDetail = (dealId, dealData) => {

        let indexes = [...expandDetail];
        if (indexes.length > 0) {
            let found = false;
            indexes.map((ele, index) => {
                if (ele.id === dealId) {
                    indexes = indexes.filter(fliterEle => fliterEle.id !== dealId);
                    found = true;
                }
            });
            if (!found) {
                indexes.push({ id: dealId });
            }
        } else {
            indexes.push({ id: dealId });
        }
        setExpandDetail(indexes);
        if (props.selectedDeal) {
            props.selectedDeal(dealData);
        }

    }

    const handleEditDeal = (id) => {
        if (props.handleEditDeal) {
            props.handleEditDeal(id);
        }
    }

    const checkExpand = (id) => {
        let found = false;
        expandDetail && expandDetail.forEach(eleD => {
            if (eleD.id === id && found === false) {
                found = true;
            }
        });
        return found;
    }
    const handleDealClick = (dealId, btnName, selectedRowData, dealSourceId, countDealInventoryItems) => {
        if (props.handleInventoryDealEditClick) {
            props.handleInventoryDealEditClick(dealId, btnName, selectedRowData, dealSourceId, countDealInventoryItems);
        }
    }

    const handleReporting = (data) => {
        if (props.inventoryReports) {
            props.inventoryReports(data);
        }
    }

    const handleRowClick = (row) => {
        if (row.mediaTypeId !== 101 && row.mediaTypeId !== 102 && row.mediaTypeId !== 103)
            props.handleRowClick(row.inventoryId, props.index, row.inventoryDealId, props.data, row.mediaTypeId);
    }

    const handleDialogDeleteCancel = () => {
            setDeleteInventoryId(null);
            setOpenDeleteDialog(false);

        };
    const handleDialogDeleteOpen = (index, _inventoryId) => {
        setDeleteInventoryId(_inventoryId);
        setOpenDeleteDialog(true);
    };
    const handleDeleteInventoryActions = (caller) => {
        let obj = {}
        obj.inventoryId = deleteInventoryId;
        DeleteInventory(obj)
            .then((data) => {
                notifySuccess("Inventory deleted successfully");
                setOpenDeleteDialog(false);
                props.refreshPage();
            })
            .catch((err) => console.log(err));
    };

        const todayDate = new Date();
        let currentYear = todayDate.getFullYear();
        return (
            <>
                {
                    openDeleteDialog ? 
                        <ConfrimDialog
                            open={openDeleteDialog}
                            title={"Delete Inventory"}
                            description={
                                "Are you sure, You want to delete Inventory?"
                            }
                            ok={"OK"}
                            cancel={"Cancel"}
                            handleDialogOk={() =>
                                handleDeleteInventoryActions("deleteInventory")
                            }
                            handleDialogCancel={handleDialogDeleteCancel}
                        ></ConfrimDialog>
                    : ""
                }
                {props.data && <Grid item xs={12}>
                    <Grid container alignItems={"center"} className={props.selectedDealId
                        && props.selectedDealId === data.inventoryDealId ? classes.selectedDealRow : ""}>

                        <Grid item xs={10}>
                            <Grid container spacing={1}>

                                <Grid item xs={2}>
                                    <Box display="flex" flexDirection="column" pl={1.5}>
                                        <Box component="div" title={props.data.dealId}>
                                            <Typography variant="caption">Deal Id</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2 ">{props.data.dealId || "-"}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box display="flex" title={props.data.regionName} flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Region Name</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" noWrap>{props.data.regionName || "-"}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box title={props.data.dealName} display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Deal Name</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="p" noWrap>{props.data.dealName || "-"}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box display="flex" title={props.data.partnerName} flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Partner Name</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" noWrap>{props.data.partnerName || "-"}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={2}>
                                    <Box display="flex" flexDirection="column">
                                        <Box display="flex" alignItems="center">
                                            <Box component="div" display="flex" flexDirection="column" title={Helper.FormatDate(props.data.dealStartDate)}>
                                                <Typography variant="caption">Start Date</Typography>
                                                <Typography variant="subtitle2">
                                                    {Helper.FormatDate(props.data.dealStartDate)}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column">
                                                <Box mr={.5} ml={.5}>|</Box>
                                                <Box mr={.5} ml={.5}>|</Box>
                                            </Box>
                                            <Box component="div" display="flex" flexDirection="column" title={Helper.FormatDate(props.data.dealEndDate)}>
                                                <Typography variant="caption">End Date</Typography>
                                                <Typography variant="subtitle2">
                                                    {Helper.FormatDate(props.data.dealEndDate)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid xs={2} key={`GridAction${index}`} alignItems={"center"} justifyContent="flex-end">
                            <Box flexDirection={props.view ? 'row' : 'column'} alignItems={props.view ? 'flex-start' : 'flex-end'} display="flex" justifyContent={"flex-end"}>
                                {props.data.dealSourceId === 1052 && <IconButton title="DMS Inventory" size="small" onClick={() => handleReporting(data)}>
                                    <AssessmentOutlinedIcon />
                                </IconButton>}
                                <IconButton title="Edit Inventory Deal" size="small" onClick={() => handleDealClick(props.data.dealId, "edit", props.data, props.data.dealSourceId, props.data.inventoryItems?.length)}>
                                    <CreateOutlinedIcon />
                                </IconButton>
                                <IconButton title="Details" className={checkExpand(props.data.dealId) ? classes.selectedbtn : ''} size="small" onClick={() => handleExpandDetail(props.data.dealId, props.data)} >
                                    <VisibilityIcon />
                                </IconButton>
                            </Box>
                        </Grid>

                        <Divider sx={{ width: '100%' }} />
                    </Grid>
                    <Collapse in={checkExpand(props.data.dealId) ? true : false}>
                        {
                            checkExpand(props.data.dealId) && props.data && props.data.inventoryItems && props.data.inventoryItems.length > 0 && props.data.inventoryItems.map((data, index) => {

                                return <React.Fragment>
                                    <Box px={1} className={`${classes.inventoryRow} ${data.inventoryId && props.selectedInventoryId && data.inventoryId === props.selectedInventoryId ? classes.selected : ""}`} key={`Grid${index}`}

                                        id={`${data.inventoryId && props.selectedInventoryId && data.inventoryId === props.selectedInventoryId ? 'rowFocus' : null}`}
                                    >
                                        <Grid container>
                                            <Grid item xs={11} onClick={() => handleRowClick(data)}>
                                                <Grid container spacing={1} marginTop={0}>


                                                    {props.showCS && <Grid item xs={props.view ? .5 : 2.75}>
                                                        <Box display="flex">
                                                            <>
                                                                {(props.selectedMediaTypeId === data.mediaTypeId) && props.selectedInventoryId && data.inventoryId !== props.selectedInventoryId &&
                                                                    props.showCS && <IconButton className={`${classes.iconColor} ${checkSelection(data.inventoryId) ? classes.selectedItem : ""}`} size="small" onClick={() => handleIconClick(data.inventoryId, "")} >
                                                                        <ContentCopyIcon />
                                                                    </IconButton>
                                                                }

                                                            </>
                                                        </Box>
                                                    </Grid>}
                                                    <Grid item xs={.5}>
                                                        <Box display="flex" flexDirection="column">
                                                            <IconButton size="small" >
                                                                <PersonalVideoIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={props.view ? 1.7 : 2.85}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div">
                                                                <Typography variant="caption">Season</Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography noWrap title={data.seasonName || ""} variant="subtitle2">{data.seasonName ? `${data.seasonName}` : ''}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={props.view ? data.mediaTypeParentId === 100 && (data.mediaTypeId === 103 || data.mediaTypeId === 102 || data.mediaTypeId === 101) ? 3.5 : 1.3 : data.mediaTypeParentId === 100 && (data.mediaTypeId === 102 || data.mediaTypeId === 101) ? 5 : 2.85}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div">
                                                                <Typography variant="caption">
                                                                    Asset Name
                                                            </Typography>
                                                            </Box>
                                                            <Box component="div" >
                                                                <Typography noWrap title={data.assetName} variant="subtitle2">{data.assetName}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={props.view ? data.mediaTypeParentId === 100 && (data.mediaTypeId === 102 || data.mediaTypeId === 101) ? 1.7 : 1 : 2.75}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div">
                                                                <Typography variant="caption">
                                                                    {data.countryName}
                                                                </Typography>
                                                            </Box>
                                                            <Box component="div" >
                                                                <Typography noWrap title={data.networkCode} variant="subtitle2">{data.networkCode}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={props.view ? 1 : 2.75}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div">
                                                                <Typography variant="caption">
                                                                    Media Type
                                                            </Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography noWrap title={data.mediaTypeName} variant="subtitle2">{data.mediaTypeName}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>

                                                    {
                                                        data.mediaTypeParentId === 100 && (data.mediaTypeId === 102 || data.mediaTypeId === 101 || data.mediaTypeId === 103) ? "" : <Grid item xs={props.view ? 1.5 : 2.2}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Box component="div">
                                                                    <Typography variant="caption">Quantity From | To</Typography>
                                                                </Box>
                                                                <Box component="div">
                                                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                                        {data.quantityFrom}{` | ${data.quantityTo}`}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    }
                                                    {data.mediaTypeParentId === 100 && (data.mediaTypeId === 102 || data.mediaTypeId === 101 || data.mediaTypeId === 103) ? "" : <Grid item xs={props.view ? 1.3 : 3}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div" display="flex" justifyContent={'space-between'}>
                                                                <Typography variant="caption">{data.usedCount}</Typography>
                                                                <Typography variant="caption">{data.quantityTo}</Typography>
                                                            </Box>

                                                            <Box component="div">
                                                                {(function () {
                                                                    if (data.usedCount < data.quantityFrom || data.usedCount === 0) {
                                                                        return <BorderLinearProgressUnder variant="determinate" value={data.usedCount ? data.usedCount * (100 / data.quantityTo) : 0} />
                                                                    }
                                                                    if (data.usedCount > data.quantityTo) {
                                                                        return <BorderLinearProgressOver variant="determinate" value={data.usedCount ? data.usedCount * (100 / data.quantityTo) : 0} />
                                                                    }
                                                                    if ((data.usedCount === data.quantityTo) || (data.usedCount >= data.quantityFrom)) {
                                                                        return <BorderLinearProgressFull
                                                                            variant="determinate" value={data.usedCount ? data.usedCount * (100 / data.quantityTo) : 0} />
                                                                    }

                                                                })()}
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    }
                                                    <Grid item xs={props.view ? 1.8 : 3.2}>
                                                        <Box display="flex" flexDirection="column" pl={2}>
                                                            <Box component="div">
                                                                <Typography variant="caption">Sales Unit | Sales Right</Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography variant="subtitle2"> <Typography variant="subtitle2" component="span" color={`${data.unitStatus === 553 ? "secondary" : ''}`}>{data.salesUnit ? data.salesUnit : '0'}</Typography> {data.salesUnitDescText ? ` | ${data.salesUnitDescText}` : ''}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={props.view ? 1.8 : 3.5}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div">
                                                                <Typography variant="caption">Ins Unit | Ins Right</Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography variant="subtitle2">{data.institutionalUnit ? data.institutionalUnit : '0'}{data.institutionalUnitDescText ? ` | ${data.institutionalUnitDescText}` : ''}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid xs={1} key={`GridAction${index}`} container alignItems="center" justifyContent="flex-end">
                                                <Box display="flex" flexDirection={props.view ? 'row' : 'column'} justifyContent="space-between">
                                                    {/*<IconButton*/}
                                                    {/*    title="Delete Inventory"*/}
                                                    {/*    size="small"*/}
                                                    {/*    onClick={() => handleDialogDeleteOpen(index + 1, data.inventoryId)}*/}
                                                    {/*>*/}
                                                    {/*    <DeleteOutlineIcon fontSize="small" />*/}
                                                    {/*</IconButton>*/}
                                                    {(data.mediaTypeId === 104 || data.mediaTypeId === 151 || data.mediaTypeId === 152 || data.mediaTypeId === 201 || data.mediaTypeId === 202 || data.mediaTypeId === 153)
                                                        && <IconButton component="a" href="#rowFocus" title="Monthly Split" size="small" onClick={() => props.handleMonthlySplitClick(data.inventoryId, data.quantityTo, data)}>
                                                            <EventNoteIcon />
                                                        </IconButton>}
                                                    {(data.mediaTypeId !== 102 && data.mediaTypeId !== 101 && data.mediaTypeId !== 103) && !AppConstants.IdsToHideBuildSchedule.includes(data.mediaTypeId) && <IconButton component="a" href="#rowFocus" title="Generate Schedules" size="small"
                                                        onClick={() => handleClick(index, data.inventoryId, data.quantityTo, data.assetName, data, data.seasonStartDate,
                                                            data.seasonEndDate, data.assetId)}
                                                    >
                                                        <BuildCircleOutlinedIcon />
                                                    </IconButton>}

                                                    {/*{AppConstants.IdsToHideBuildSchedule.includes(data.mediaTypeId) && <IconButton title="Digital Additional Info" size="small"*/}
                                                    {/*   onClick={() => handleDigitalAdditionalInfoClick(data.assetName)}*/}
                                                    {/*>*/}

                                                    {/* {(data.mediaTypeId === 101) && <IconButton component="a" href="#rowFocus" title="Digital Additional Info" size="small"
                                                    onClick={() => handleDigitalAdditionalInfoClick(data.assetName, "DigitalAddInvinfo", data.inventoryId, data.assetId)}
                                                >
                                                    <LocalOfferOutlinedIcon color={data.isAdditionInfoAdded ? 'default' : 'secondary'} />
                                                </IconButton>} */}

                                                    <IconButton component="a" href="#rowFocus" title="Split" className={classes.done} size="small" onClick={() => {
                                                        props.getSplitUnitData(data.inventoryId, props.index)
                                                        props.handleSplitUnit(data.mediaTypeId,
                                                            data.inventoryId, props.index, data.seasonStartDate,
                                                            data.seasonEndDate, data
                                                        )
                                                    }} >
                                                        <CallSplitOutlinedIcon />
                                                    </IconButton>
                                                </Box>
                                            </Grid>
                                            <Divider sx={{ width: '100%' }} />
                                        </Grid>
                                    </Box>

                                </React.Fragment>
                            })
                        }
                    </Collapse>
                </Grid>}
            </>
        );

   })

InventoryUI.displayName = "InventoryUI";
export default InventoryUI;
