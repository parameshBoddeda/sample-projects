import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import PermDataSettingOutlinedIcon from '@mui/icons-material/PermDataSettingOutlined';
import Divider from '@mui/material/Divider';
import Helper from '../../common/Helper';
import { makeStyles } from '@material-ui/core/styles';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';

const useStyles = makeStyles(theme => ({

    selected: {
        background: "#e4ecff"
    },
    dealRow: {
        cursor: "pointer"
    },
    iconColor: {
        color: '#424242 !important',
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }

    }
}));

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const CampaignUI = (props) => {
    let { data, index, view } = props;
    const classes = useStyles();
    
    const handleCompaignEditClick = (dealId, btnName, campaignId, selectedRowData) => {
        if (props.isEditing) {
            return false;
        }
        if (props.handleCompaignEditClick) {
            props.handleCompaignEditClick(dealId, btnName, campaignId, selectedRowData);
        }
    }

    const handleCompaignUnitClick = (id, iPlanCampaignID, name, planId = null,data) => {
        if(props.handleCompaignUnitClick) {
            props.handleCompaignUnitClick(id, iPlanCampaignID, name, planId,data);
        }
    }

    const handlebudgetClick = (id, name) => {
        if(props.handlebudgetClick) {
            props.handleShowMediaPlanningContainer(id);
            //props.handlebudgetClick(id.name);
        }
    }

    return (
        <React.Fragment>            
            <Grid className={`${classes.deal} ${data.id && props.selectedDealId && data.id === props.selectedDealId ? classes.selected : ""}`} key={`Grid${props.index}`} item xs={12}>
                <Box px={1}>
                    <Grid container>
                        <Grid item xs={10.5}>
                            <Grid container spacing={1} marginTop={0}>
                                <Grid item xs={props.view ? 2.5 : 6}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Campaign Name</Typography>
                                        </Box>
                                        <Box component="div" >
                                            <Typography variant="subtitle2" noWrap title={data.campaignName}>{data.campaignName}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? 1.5 : 6}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Campaign Short Name</Typography>
                                        </Box>
                                        <Box component="div" >
                                            <Typography variant="subtitle2" noWrap title={data.campaignShortName}>{data.campaignShortName}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? 1.75 : 6}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Season</Typography>
                                        </Box>
                                        <Box component="div" >
                                            <Typography variant="subtitle2" noWrap title={data.seasonName}>{data.seasonName}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? .65 : 2}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Category</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography noWrap title={data.category} variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.category}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? 1.75 : 4}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Institutional Media Planner</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography noWrap title={data.mediaPlanner} variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.mediaPlanner}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? 1 : 2}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Market Type</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography noWrap title={data.marketType} variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.marketType}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 2 : 4}>
                                    <Box display="flex" flexDirection="column">
                                        <Box display="flex" alignItems="center">
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">Start Date</Typography>
                                                <Typography variant="subtitle2">
                                                    {Helper.FormatDate(data.startDate)}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column">
                                                <Box mr={.5} ml={.5}>|</Box>
                                                <Box mr={.5} ml={.5}>|</Box>
                                            </Box>
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">End Date</Typography>
                                                <Typography variant="subtitle2">
                                                    {Helper.FormatDate(data.endDate)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? .85 : 2}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Campaign Id</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography noWrap title={data.iPlanCampaignID} variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.iPlanCampaignID}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={1.5}>
                            <Box key={`GridAction${props.index}`} display="flex" justifyContent="space-between" flexDirection={props.view ? 'row' : 'column'}>

                                <IconButton title="Edit Campaign" className={`${classes.iconColor} 
                                    ${props.selectedCompaignId === data.iPlanCampaignID && props.selectedBtn === "edit" 
                                        ? classes.selectedbtn : ''}`} size="small" 
                                        onClick={() => handleCompaignEditClick(data.id, "edit", data.iPlanCampaignID, props.data)}>
                                    <CreateOutlinedIcon />
                                </IconButton>
                                
                                <IconButton color="default" title="Campaign Plan Configuration" 
                                    className={`${classes.iconColor} ${props.selectedCompaignId === data.iPlanCampaignID && props.selectedBtn === "plan" 
                                        ? classes.selectedbtn : ''}`}
                                        size="small" onClick={() => {
                                        handlebudgetClick(data.id, "plan")
                                    }} >
                                    <FormatAlignLeftIcon />
                                </IconButton>

                                <IconButton
                                    title="Download report for users"
                                    className={classes.done}
                                    size="small"
                                    onClick={() => {
                                        handleCompaignUnitClick(data.id, data.iPlanCampaignID, "download", data.mediaPlanId);
                                    }}
                                    >
                                    <DownloadOutlinedIcon />
                                </IconButton>

                                <IconButton
                                    title="Download report for customers"
                                    className={classes.done}
                                    size="small"
                                    onClick={() => {
                                        handleCompaignUnitClick(data.id, data.iPlanCampaignID, "downloadCustomers", data.mediaPlanId);
                                    }}
                                    >
                                    <DownloadForOfflineOutlinedIcon />
                                </IconButton>
                                
                                <IconButton title="Campaign Unit Instructions" 
                                    className={`${classes.iconColor} ${props.selectedCompaignId === data.iPlanCampaignID && props.selectedBtn === "unit" 
                                        ? classes.selectedbtn : ''}`} 
                                    size="small" onClick={() => handleCompaignUnitClick(data.id, data.iPlanCampaignID, "unit",data.planId,data)}>
                                    <PermDataSettingOutlinedIcon />
                                </IconButton>
                                
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Divider sx={{ width: '100%' }} />
        </React.Fragment>
    );
}

CampaignUI.displayName = "CampaignUI";
export default CampaignUI;
