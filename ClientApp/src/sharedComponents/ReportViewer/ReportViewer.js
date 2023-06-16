// Global Imports - Start
import React from 'react';
import { Box, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';
import { injectStyle } from "react-toastify/dist/inject-style";

// Global Imports - End
// Local Imports - Start
import GridHeader from '../GridHeader/GridHeader';
import Helper from '../../common/Helper';
import { Container } from '@material-ui/core';
// Local Imports - End

if (typeof window !== "undefined") {
    injectStyle();
}
const useStyles = makeStyles((theme) => ({
    contentHeight: {
        height: 'calc(100vh - 124px)',
        overflowX: 'auto',
    },
}));

const ReportViewer = (props) => {
    const classes = useStyles();
    let source = null;
    let headerText = '';
    let icon ='';
    if(props.type === 'MediaReport'){
        source = props.url.replace("<__PLANID__>", props.planId).replace("<___leagueId___>", props.leagueId).replace("<__dealId__>", props.campaignOrDealId ? props.campaignOrDealId : 0);
        headerText = 'Media Planning Reports';
        icon = 'reporting';
    }
    else if (props.type === 'CampaignReport') {
        source = props.url.replace("<___planId___>", props.planId).replace("<___leagueId___>", props.leagueId);
        headerText = 'Campaign Reports';
        icon ='campaign';
    }
    else if (props.type === 'CampaignUnitReport') {
        source = props.url.replace("<___campaignId___>", props.campaignOrDealId).replace("<__startDate__>", Helper.FormatToIsoDate(props.startDate)).replace("<__endDate__>", Helper.FormatToIsoDate(props.endDate));
        headerText = 'Campaign Unit Report';
        icon = 'campaignUnit';
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Box pb={1} pl={1} pr={1} pt={2}>
                <Grid container>
                    <Grid item xs={12}>
                        <GridHeader showIcon={true} icon={icon} hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText={headerText}>
                            {props.showCloseIcon && <Box display="flex" alignItems={"flex-end"} justifyContent={"flex-end"}>
                                <IconButton size="small" onClick={props.handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>}
                        </GridHeader>
                    </Grid>
                </Grid>
            </Box>
            <Box className={classes.contentHeight}>
                <iframe src={source} height='100%' width='100%' />
            </Box>
        </Container>
    )
}
export default ReportViewer;