//.....Global Imports Start
import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Divider, IconButton, Typography } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined';
import CallMergeOutlinedIcon from '@mui/icons-material/CallMergeOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { HideBreakPositions, SCHEDULE_ADUNIT_STATUS_IDS, SCHEDULE_STATUS_IDS } from '../../common/AppConstants';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

import Helper from '../../common/Helper';
//.....lobal Imports End

const useStyles = makeStyles((theme) => ({
    cellStyle: {
        textAlign: 'center',
        border: '1px solid white',
        margin: "1px",
        height: theme.spacing(8),
        cursor: 'pointer'
    },
    cellText: {
        fontSize: '0.75rem !important',
        //marginTop: theme.spacing(1.25),
    },
    greenColor: {
        backgroundColor: ' #3CE9AF',
    },
    orangeColor: {
        backgroundColor: ' #FEC961',
    },
    greyColor: {
        backgroundColor: ' #f1f1f1',
    },
    cellConfirmed: {
        backgroundColor: '#F62727',
        color: '#FFFFFF',
    },
    cellAvailable: {
        backgroundColor: '#C4C4C4',
        color: '#FFFFFF'
    },
    cellWorking: {
        backgroundColor: '#F6AB27',
        color: '#FFFFFF',
    },
    cellPendingConfirm: {
        backgroundColor: '#7CB9E8',
        color: '#FFFFFF',
    },
    availableCursor: {
        cursor: 'pointer',
    },
    workingCursor: {
        cursor: 'progress'
    },
    confirmedCursor: {
        cursor: 'no-drop'
    },
    calTitleBox: {
        top: 0,
        padding: "4px",
        zIndex: 100,
        position: "sticky",
        backgroundColor: "white"
    },
    calTitleBoxTitle: {
        fontSize: "14px",
    },
    calTitleBoxDate: {
        fontSize: "11px",
    },
    calTitleBoxEpisode: {
        fontSize: "14px",
    },
    menu: {
        fontSize: theme.spacing(1),
        display: 'flex',
        height: '-webkit-fill-available',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        marginLeft: theme.spacing(-3),
        zIndex: '1120'
    },
    menuBox: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        //height: '-webkit-fill-available',
        //width: 'fit-content',
        padding: theme.spacing(0, 0.5),
        backgroundColor: 'white',
        border: '1px dashed black',
        float: 'right',
        zIndex: '1120',
        cursor: 'pointer',
    },
    buttonPosition: {
        position: 'absolute !important',
        right: 0,
        bottom: 0
    },
    buttonPositionLeft: {
        position: 'absolute !important',
        left: 0,
        bottom: 0,
        paddingLeft : '4px',
        color: 'white',
    },
    buttonPositionRightTop: {
        position: 'absolute !important',
        right: 0,
        top: 0,
        paddingRight: '4px',
        //color: 'white',
    },
    menuPosition: {
        position: 'absolute !important',
        right: 0,
        top: 15,
        minHeight : '100px',
        zIndex : 1500
    }
}));

function notifyWarning(msg) { toast.warning(msg) }

const Cell = (props) => {
    const classes = useStyles();
    let { index, cellState, key, activateCursor, scheduleInfo } = props;
    let unitSize = scheduleInfo.unitSize;
    let unitType = scheduleInfo.unitTypeName;
    let isCampaignUnit = scheduleInfo.costTypeName === "Institutional";

    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = useCallback((e, info) => {
        if (showMenu) {
            e.preventDefault();
            e.stopPropagation();
            if (canIShowContextMenu()){
                if (cellState === 'available') {
                    props.callForCellAction('available', unitSize, unitType, index);
                } else if (cellState === 'working') {
                    props.callForCellAction('working', unitSize, unitType, index);
                } else if (cellState === 'pending') {
                    props.callForCellAction('pending', unitSize, unitType, index);
                } else if (cellState === 'confirmed') {
                    props.callForCellAction('confirmed', unitSize, unitType, index);
                }
            }
            showMenu && setShowMenu(false);
        }
        else {
            props.onCellClick(info);
        }
    }, [showMenu]);

    const handleContextMenu = useCallback(
        (e) => {
            if (canIShowContextMenu()){
                e.stopPropagation();
                e.preventDefault();
                setXPos(`${e.pageX}px`);
                setYPos(`${e.pageY}px`);
                setShowMenu(true);
                props.makeMapActive(true);
            }
        },
        [setXPos, setYPos]
    );

    const validateSalesUnit = ()=>{
        if (!isCampaignUnit && scheduleInfo.customerId !== 1 && props.IsCampaignPlanning) {
            notifyWarning("Action can't perform on Sales Unit");
            return false;
        }
        // if (!isCampaignUnit && cellState === 'confirmed' && props.IsCampaignPlanning) {
        //     notifyWarning("Action can't perform on Sales Unit");
        //     return false;
        // }

        return true;
    }

    const handleMenu = ()=>{
        props.makeMapActive(false);
        setShowMenu(false);
    }

    const handleCancel = () => {
        props.makeMapActive(false);
        setShowMenu(false);
        props.CancelCellAction();
    }

    const canIShowContextMenu = ()=>{
        if (scheduleInfo.marketTypeId === 111 && scheduleInfo.scheduleStatusId === SCHEDULE_STATUS_IDS.Trafficked) return false;

        if(props.IsCampaignPlanning){
            if (!isCampaignUnit && scheduleInfo.customerId > 1) return false;
        }
        else{
            if (scheduleInfo.marketTypeId === 112 && isCampaignUnit) return false;

            if (scheduleInfo.marketTypeId === 111 && !isCampaignUnit && (scheduleInfo.statusId === SCHEDULE_ADUNIT_STATUS_IDS.Confirmed))
                return false;
            
        }
        return true;
    }

    let planName = scheduleInfo.planName ? (scheduleInfo.planName.length > 27 ? scheduleInfo.planName.substring(0, 27) + '...' : scheduleInfo.planName) : '';
    let isci = scheduleInfo.isciCode ? (scheduleInfo.isciCode.length > 27 ? scheduleInfo.isciCode.substring(0, 27) + '...' : scheduleInfo.isciCode) : ''
    return (
        <Box position="relative">
            <Box key={key} component="div"
                className={`${classes.cellStyle}
                    ${cellState === 'available' ? classes.cellAvailable : (cellState === 'confirmed' || cellState === 'trafficked') ? classes.cellConfirmed : 
                                    cellState === 'pending' ? classes.cellPendingConfirm : classes.cellWorking}
                    ${activateCursor ? cellState === 'available' ? classes.availableCursor : 
                                        (cellState === 'confirmed' || cellState === 'trafficked' || cellState === 'pending') ? classes.confirmedCursor : classes.workingCursor : ''}`
                }
                onClick={(e) => {
                    if ((e.type === 'click') && (props.data?.marketTypeId === 112 || (props.data?.marketTypeId === 111 && props.data?.scheduleStatusId !== 704))) {
                        handleClick(e, props.scheduleInfo)
                    }
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (canIShowContextMenu()){
                        // console.group(props.mapActive)
                        if (props.mapActive) {
                            props.callForCellAction();
                        } else
                            handleContextMenu(e);
                    }
                }}
            >
                <Box display="flex" flex={1} flexDirection="column" alignItems="center">
                    <Typography className={classes.cellText} component="p" noWrap
                        title={!scheduleInfo.planName ? '' : 'Campaign/Media Plan : ' + scheduleInfo.planName} >{!scheduleInfo.planName ? <br /> : planName}</Typography>
                    <Typography className={classes.cellText} component="p" noWrap
                        title={!scheduleInfo.isciCode ? '' : 'ISCI : ' + scheduleInfo.isciCode} >{!scheduleInfo.isciCode ? <br /> : isci}</Typography>
                    <Typography className={classes.cellText} component="p">{unitType} {unitSize}</Typography>
                </Box>
            </Box>
            {
                <Typography className={classes.buttonPositionLeft} component="p">{Helper.GetNameInitials(scheduleInfo.costTypeName)}</Typography>
            }
            {
                <Typography className={classes.buttonPositionRightTop}
                                    title={scheduleInfo.scheduleAdUnitId}>&nbsp;</Typography>
            }
            {
                cellState !== 'available' && !showMenu && HideBreakPositions.indexOf(scheduleInfo.mediaName) === -1 &&
                scheduleInfo.scheduleStatusId !== 704 &&
                <IconButton size='small' onClick={() => props.handleBreakPosition(scheduleInfo)} className={classes.buttonPosition}
                    title={scheduleInfo.break ? ('Current BreakPosition: ' + scheduleInfo.break + (scheduleInfo.position ?" - "+ scheduleInfo.position : '' )):  `Assign Break and Position`}>
                    <LinkOutlinedIcon color='white' htmlColor='white' />
                </IconButton>
            }
            {
                canIShowContextMenu() && <div className={classes.menuPosition}>
                    {showMenu ? cellState === 'available' ? (
                        <Grid className={classes.menuBox}>
                            <Box display="flex" flexDirection="column" flex="1" >
                                <IconButton size="small" style={{ color: 'black' }}
                                    onClick={() => handleMenu()}>
                                    <CloseOutlinedIcon fontSize='small' /> <Typography className={classes.menu}>Close</Typography>
                                </IconButton>
                                {props.prevAction &&<><Divider></Divider>
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            handleCancel();
                                        }}>
                                        <UndoOutlinedIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Undo Cut</Typography>
                                    </IconButton>
                                    <Divider></Divider>
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.onCellAction(scheduleInfo, 'Paste');
                                            handleMenu();
                                        }}>
                                        <AssignmentOutlinedIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Paste</Typography>
                                    </IconButton>
                                </>}
                                {scheduleInfo.unitSize > 5 && <>
                                    <Divider></Divider>
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.handleSplitUnit(scheduleInfo);
                                            handleMenu();
                                        }}>
                                        <CallSplitOutlinedIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Split</Typography>
                                    </IconButton></>}
                                <Divider></Divider>
                                <IconButton size="small" style={{ color: 'black' }}
                                    onClick={() => {
                                        props.handleMergeUnits(scheduleInfo);
                                        handleMenu();
                                    }}>
                                    <CallMergeOutlinedIcon fontSize='small' />
                                    <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Merge</Typography>
                                </IconButton>
                                <Divider></Divider>
                                {
                                    !props.IsCampaignPlanning && scheduleInfo.costTypeName === "Paid" ?
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.convertUnitCostTypeToBonus(scheduleInfo, 4);
                                            handleMenu();
                                        }}>
                                        <MoneyOffIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Convert to Bonus</Typography>
                                    </IconButton> : (
                                    (!props.IsCampaignPlanning && (scheduleInfo.costTypeName === "Bonus" || scheduleInfo.costTypeName === "No Charge")) ?
                                         <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.convertUnitCostTypeToBonus(scheduleInfo, 2);
                                            handleMenu();
                                        }}>
                                        <AttachMoneyIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Convert to Paid</Typography>
                                    </IconButton> : ""
                                    )
                                }
                            </Box>
                        </Grid>
                    ) : (
                        <Grid className={classes.menuBox}>
                            <Box display="flex" flexDirection="column" flex="1" >
                                <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => handleMenu()}>
                                    <CloseOutlinedIcon fontSize='small' /> <Typography className={classes.menu}>Close</Typography>
                                </IconButton>
                                {!props.prevAction && <><Divider></Divider>
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.onCellAction(scheduleInfo, 'Cut');
                                            handleMenu();
                                        }}>
                                        <ContentCutOutlinedIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Cut</Typography>
                                    </IconButton>
                                    <Divider></Divider>
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.onCellAction(scheduleInfo, 'Release');
                                            handleMenu();
                                        }}>
                                        <NewReleasesOutlinedIcon fontSize='small' />
                                                <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp; Release</Typography>
                                    </IconButton>
                                </>}
                                {scheduleInfo.unitSize > 5 && <>
                                    <Divider></Divider>
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.handleSplitUnit(scheduleInfo);
                                            handleMenu();
                                        }}>
                                        <CallSplitOutlinedIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Split</Typography>
                                    </IconButton></>}
                                <Divider></Divider>
                                <IconButton size="small" style={{ color: 'black' }}
                                    onClick={() => {
                                        props.handleMergeUnits(scheduleInfo);
                                        handleMenu();
                                    }}>
                                    <CallMergeOutlinedIcon fontSize='small' />
                                    <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Merge</Typography>
                                </IconButton>
                                <Divider></Divider>
                                {
                                    !props.IsCampaignPlanning && scheduleInfo.costTypeName === "Paid" ?
                                    <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.convertUnitCostTypeToBonus(scheduleInfo, 4);
                                            handleMenu();
                                        }}>
                                        <MoneyOffIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Convert to Bonus</Typography>
                                    </IconButton> : (
                                    (!props.IsCampaignPlanning && (scheduleInfo.costTypeName === "Bonus" || scheduleInfo.costTypeName === "No Charge")) ?
                                         <IconButton size="small" style={{ color: 'black' }}
                                        onClick={() => {
                                            props.convertUnitCostTypeToBonus(scheduleInfo, 2);
                                            handleMenu();
                                        }}>
                                        <AttachMoneyIcon fontSize='small' />
                                        <Typography key={`${index}MenuKey`} className={classes.menu}>&nbsp;Convert to Paid</Typography>
                                    </IconButton> : ""
                                    )
                                }
                            </Box>
                        </Grid>
                    )
                    : ''
                    }
                </div>
            }
        </Box>
    )
}

const HeatMapColumn = (props) => {

    const classes = useStyles();
    const [cursor, activateCursor] = useState(false);
    //.....Action Handlers
    const handleCellAction = (cellState, unitSize, unitType, index) => {
        // activateCursor(true);
        if (cellState === 'available') {
            //notifySuccess(`You can use the cell for ${unitSize} ${unitType} ${index}`)
        } else if (cellState === 'working') {
            //notifyWarning(`You can paste in the cell for ${unitSize} ${unitType} ${index}`)
        } else if (cellState === 'confirmed') {
            // notifyError(`Cell Action not allowed for ${unitSize} ${unitType} ${index}`)
        } else {
            //notifyError(`Please complete the current cell action`);
            // activateCursor(true);
            //return;
        }
        props.makeMapActive(false);

    }
    const updateCalendarData = () => {
        activateCursor(false)
    }

    return (
        <>
            <ToastContainer autoClose={3000} />
            {/*<Grid> */}
            <Box px={0} flexDirection="column">
                {/* <Grid container direction={'column'}> */}
                <Box className={classes.calTitleBox} style={{ minWidth: '200px', backgroundColor: props.data.scheduleStatusId === 704 ? '#72E056' : '' }}>
                    <Box display="flex" flexDirection="row">
                        <Typography variant="subtitle2" component="div" className={classes.calTitleBoxTitle}>
                            {props.data.networkName}
                        </Typography>
                    </Box>
                    <Typography variant="caption" className={classes.calTitleBoxDate}>
                        {Helper.FormatDate(props.data.estDate)} | {Helper.FormatTime(props.data.estTime)}
                    </Typography>
                    <Typography variant="subtitle2" component="div" className={classes.calTitleBoxEpisode}>
                        {props.data.episodeName}
                    </Typography>
                    <Typography className={classes.buttonPositionRightTop} title={props.data.scheduleId}>&nbsp;</Typography>
                </Box>
                {props.cells.map((item, index) => (
                    <Box key={`${index}gridKey`} style={{ minWidth: '200px' }}>
                        <Cell
                            {...props}
                            key={`${index}key`} index={index} activateCursor={cursor}
                            cellState={item.statusName === 'Initial' ? 'available' : 
                                        ((item.statusName === 'Confirmed' || item.statusName === 'Trafficked') ? 'confirmed' : 
                                    item.statusName === 'Pending Confirm' ? 'pending' : 'working')}
                            scheduleInfo={item}
                            callForCellAction={handleCellAction}
                            //onCellClick={(item)=> props.onCellClick(item)}
                            onCellAction={(item, action) => props.onCellAction(item, action)}
                            mapActive={props.mapActive}
                            makeMapActive={props.makeMapActive}
                            updateCalendarData={updateCalendarData} />
                    </Box>
                ))}

                {/* </Grid> */}
            </Box>
            {/* </Grid> */}
        </>
    )
}
export default HeatMapColumn;