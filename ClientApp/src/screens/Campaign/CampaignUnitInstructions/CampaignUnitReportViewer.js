// Global Imports - Start
import React, { } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';
import { injectStyle } from "react-toastify/dist/inject-style";
import Helper from '../../../common/Helper';
import ViewReport from '../../Reports/ViewReport';

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

const CampaignUnitReportViewer = (props) => {
    const classes = useStyles();
    //const {source, height, width} = this.props;
    const source = props.url.replace("<___campaignId___>", props.campaignId).replace("<__startDate__>", Helper.FormatToIsoDate(props.startDate)).replace("<__endDate__>", Helper.FormatToIsoDate(props.endDate));

    return (
        <>
            <Box pb={1} pl={1} pr={1} pt={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <GridHeader icon={"reporting"} showIcon={true} hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText="Campaign Unit Report">
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
                {source && <ViewReport url={source} />}
            </Box>
        </>
    )
}
export default CampaignUnitReportViewer;