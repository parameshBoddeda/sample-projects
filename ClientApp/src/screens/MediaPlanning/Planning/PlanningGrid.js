import React, {useContext} from 'react';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PlanningUI from './PlanningUI';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import { Box, Paper, Divider, Typography, Button, Collapse } from '@mui/material';
import SearchComponent from '../../../sharedComponents/SearchComponent/SearchComponent';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { GetMediaPlans } from '../../../services/planning.service';
import { IconButton } from '@material-ui/core';
import Helper from '../../../common/Helper';
import AppDataContext from "../../../common/AppContext";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { Exclude_BillTypeIds_Total_Dollar_Calc } from '../../../common/AppConstants'
import { ToastContainer, toast } from "react-toastify";



const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fafafa',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#fafafa',
      },
  }));

  function notifyWarning(message) { toast.warning(message) }


const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 186px)',
        overflowY: 'auto',
    },
    fabButton: {
        position: 'absolute !important',
        right: theme.spacing(10),
        bottom: theme.spacing(2),
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
    infoIcon: {
        marginRight: theme.spacing(1),
    }
}));


const PlanningGrid = (props) => {
    const classes = useStyles();
    const { BillType } = useContext(AppDataContext);
    const [rows, setRows] = React.useState([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [originalData, setOriginalData] = React.useState(props.planData);
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [selectedId, setSlectedId] = React.useState();

    const setFilterData = (filterData) => {
        let groupedData = Helper.GroupBy(filterData, 'planMasterId');
        setRows(groupedData);
    }

    React.useEffect(() => {
        props.getMediaPlans();
    }, []);

    React.useEffect(() => {
        if(props.planData){
            let groupedData = Helper.GroupBy(props.planData, 'planMasterId');
            setRows(groupedData);
            setOriginalData(props.planData);
        }
    }, [props.planData]);

    const checkExpand = (name) => {
        let found = false;
        expandDetail && expandDetail.forEach(eleD => {
            if (eleD === name && found === false) {
                found = true;
            }
        });
        return found;
    }

    const handleExpandDetail = (name) => {
        let list = [...expandDetail];
        if (list.length > 0) {
            let index = list.findIndex( x=> x === name);
            if(index === -1)
                list.push(name);
            else
                list.splice(index, 1);
        } else {
            list.push(name);
        }
        setExpandDetail(list);
    }

    const isPlanConfirmed = (masterId) =>{
        return props.planData.filter(x => x.planMasterId === masterId && x.status === 'Confirmed').length > 0;
    }

    const getConfirmedPlanAmount = () => {
        return props.planData.filter(x => x.primaryFlag === true && !Exclude_BillTypeIds_Total_Dollar_Calc.includes(x.billTypeId))?.map(y => y.plannedBudget).reduce((prev, curr) => prev + curr, 0);
    }

    const getReminingAmount = () => {
        return (props.dealAmount - getConfirmedPlanAmount());
    }

    const handleClick = (action) => {
        props.splitUIHandler(action, 0);
    };

    const handleAdd = ()=>{
        if(props.isEditing){
            notifyWarning("Already open in edit mode.");
            return;
        }
      
            props.splitUIHandler('addPlan', null)
        
      
    }

    return (
        <Paper>
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader hideExpendIcon={props.hideExpendIcon} showIcon={true} icon={"mediaPlanning"} hideCheckbox={true} showScheduleIcon={false} headerText="Media Planning">
                            <Box display="flex" flex="1" justifyContent="flex-end" alignItems="center" >

                                {!props.view ? <>


                                    <Box mr={2} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end" style={{ color: 'green', fontSize: props.expandAddMediaPlan ? '10px !important' : '8px !important' }}>
                                        <Typography lineHeight={1.25} variant="h6">{Helper.ConvertToDollarFormat(props.dealAmount)}</Typography>
                                        <Typography lineHeight={1} variant="caption" noWrap>Total Budget</Typography>
                                    </Box>

                                    <Box mr={2} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end" style={{ color: '#F6AB27', fontSize: props.expandAddMediaPlan ? '10px !important' : '8px !important' }}>
                                        <Typography lineHeight={1.25} variant="h6">{Helper.ConvertToDollarFormat(getReminingAmount())}</Typography>
                                        <Typography lineHeight={1} variant="caption" noWrap>Remaining Budget</Typography>
                                    </Box>

                                </> : <LightTooltip title={

                                        <>
                                            <Box mr={2} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end" style={{ color: 'green', fontSize: props.expandAddMediaPlan ? '10px !important' : '8px !important' }}>
                                                <Typography lineHeight={1.25} variant="h6">{Helper.ConvertToDollarFormat(props.dealAmount)}</Typography>
                                                <Typography lineHeight={1} variant="caption" noWrap>Total Budget</Typography>
                                            </Box>

                                            <Divider sx={{ width: '100%', mt: 1, mb: 1 }} />

                                            <Box mr={2} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end" style={{ color: '#F6AB27', fontSize: props.expandAddMediaPlan ? '10px !important' : '8px !important' }}>
                                                <Typography lineHeight={1.25} variant="h6">{Helper.ConvertToDollarFormat(getReminingAmount())}</Typography>
                                                <Typography lineHeight={1} variant="caption" noWrap>Remaining Budget</Typography>
                                            </Box></>

                                    } arrow>

                                    <IconButton size="small" color='primary' className={classes.infoIcon}>
                                        <InfoOutlinedIcon />
                                    </IconButton>

                                </LightTooltip>}

                                <Box mr={2} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-end" style={{ color: 'red', fontSize: props.expandAddMediaPlan ? '10px !important' : '8px !important' }}>
                                    <Typography lineHeight={1.25} variant="h6">{Helper.ConvertToDollarFormat(getConfirmedPlanAmount())}</Typography>
                                    <Typography lineHeight={1} variant="caption" noWrap>Planned Budget</Typography>
                                </Box>

                                <Box display="flex">
                                    <SearchComponent setFilterData={setFilterData} jsonData={rows} originalData={originalData}
                                        setSearchItem={props.setSearchItem}
                                        resetApplyLocalFilter={props.resetApplyLocalFilter}
                                        applyLocalFilter={props.applyLocalFilter}
                                        searchItem={props.searchItem}
                                    />
                                </Box>

                                <Box display={"flex"}>
                                    <IconButton
                                        title="Download Plan report for user"
                                        className={classes.done}
                                        size="small"
                                        onClick={() => {
                                            handleClick("downloadAll");
                                        }}
                                    >
                                        <DownloadOutlinedIcon />
                                    </IconButton>

                                </Box>

                                <Box display={"flex"}>
                                    <IconButton
                                        title="Download Plan report for customers"
                                        className={classes.done}
                                        size="small"
                                        onClick={() => {
                                            handleClick("downloadCustomerAll");
                                        }}
                                    >
                                        <DownloadForOfflineOutlinedIcon />
                                    </IconButton>

                                </Box>


                            </Box>
                        </GridHeader>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Box className={classes.contentHeight}>
                <Grid container>
                    {
                        Object.keys(rows).length > 0 &&  Object.keys(rows).map((groupName, index) =>{
                            let row = rows[groupName][0];
                            return(
                            <Grid item xs={12}>
                                <Grid container alignItems={"center"} className={checkExpand(groupName) ?classes.selectedDealRow : ""}>
                                    <Grid item xs={10}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                <Box display="flex" flexDirection="column" pl={1.5}>
                                                    <Box component="div" title={groupName}>
                                                        <Typography variant="caption">Media Plan Name</Typography>
                                                    </Box>
                                                    <Box component="div">
                                                        <Typography variant="subtitle2 ">{row.planName}</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Box display="flex" flexDirection="column">
                                                    <Box component="div">
                                                        <Typography variant="caption">Customer</Typography>
                                                    </Box>
                                                    <Box component="div">
                                                        <Typography
                                                            variant="subtitle2"
                                                            component="div"
                                                            className={classes.date1}
                                                        >
                                                            {row.customerName}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Box display="flex" flexDirection="column" pl={1}>
                                                    <Box component="div">
                                                        <Typography variant="caption">Year</Typography>
                                                    </Box>
                                                    <Box component="div">
                                                        <Typography
                                                            variant="subtitle2"
                                                            component="div"
                                                            className={classes.date1}
                                                        >
                                                            {row.year}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Box display="flex" flexDirection="column" pl={1}>
                                                    <Box component="div">
                                                        <Typography variant="caption">Bill Type</Typography>
                                                    </Box>
                                                    <Box component="div">
                                                        <Typography
                                                            variant="subtitle2"
                                                            component="div"
                                                            className={classes.date1}
                                                        >
                                                            {row.billTypeName}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={2} key={`GridAction${index}`} alignItems={"center"} justifyContent="flex-end">
                                        <Box flexDirection={'row'} alignItems={'flex-start'} display="flex" justifyContent={"flex-end"}>
                                            <IconButton title="Details" className={checkExpand(groupName) ? classes.selectedbtn : ''} size="small" onClick={() => handleExpandDetail(groupName)} >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Divider sx={{ width: '100%' }} />
                                </Grid>
                                <Collapse in={checkExpand(groupName) ? true : false}>
                                {
                                    rows[groupName].filter(x => x.status !== 'Cancelled').map(item =>{
                                        return <PlanningUI row={row} selectedId={selectedId} data={item} IsPlanConfirmed={isPlanConfirmed(item.planMasterId)}
                                        splitUIHandler={(action, id) => {
                                            setSlectedId(id);
                                            props.splitUIHandler(action, item);
                                        }} />
                                    })
                                }
                                </Collapse>
                            </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>
            {/* add below condition to check if Deal endDate is greaterthan today's date or not. otherwise hide it. */}
            {/* {
                Helper.FormatDate(props.dealEndDate) >= Helper.FormatDate(new Date())
            } */}
            <Fab size="small" color="primary" title={'Add Media Plan'} className={classes.fabButton} aria-label="add" onClick={handleAdd}>
                <AddIcon />
            </Fab>
            {showLoading && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <div className={'loader-div'}><div className={'loading'}></div></div>
            </Backdrop>}

        </Paper>
    )
}

PlanningGrid.displayName = "PlanningGrid";
export default PlanningGrid;