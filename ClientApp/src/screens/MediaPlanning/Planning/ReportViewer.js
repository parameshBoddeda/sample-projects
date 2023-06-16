// Global Imports - Start
import React, { useState, useEffect, useContext } from 'react';
import { Box, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';
import { injectStyle } from "react-toastify/dist/inject-style";

// Global Imports - End
// Local Imports - Start
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import * as AppConstants from '../../../common/AppConstants';
import Helper from '../../../common/Helper';
import { GetLookupById, GetMedium, GetPrograms, GetRegions, GetUnitSizes, GetUnitTypes } from '../../../services/common.service';

import AppDataContext from '../../../common/AppContext';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { SaveMediaPlan } from '../../../services/planning.service';

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
    //const {source, height, width} = this.props;
    const source = props.url.replace("<__PLANID__>", props.planId).replace("<___leagueId___>", props.leagueId).replace("<__dealId__>", props.selectedDealId ? props.selectedDealId : 0);
    
    return (
        <>
        <Box pb={1} pl={1} pr={1} pt={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <GridHeader showIcon={true} hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText="Media Planning Reports">
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
            <iframe src={source} height='100%' width='100%'/>   
            </Box>
        </>
    )
}
export default ReportViewer;