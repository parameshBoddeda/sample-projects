// Global Imports - Start
import *  as React from 'react';
import { Box, Paper, Button, Grid, IconButton } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import CloseIcon from '@mui/icons-material/Close';
import { injectStyle } from "react-toastify/dist/inject-style";
import { GetReportUrl } from '../../../services/common.service';
import AppDataContext from '../../../common/AppContext';
import Helper from '../../../common/Helper'
// Local Imports - End


if (typeof window !== "undefined") {
    injectStyle();
}
const useStyles = makeStyles((theme) => ({
    contentHeight: {
        height: 'calc(100vh - 198px)',
    },
    indContentHight: {
        height: 'calc(100vh - 179px)',
    }
}));
const TraffickLetterViewer = (props) => {
    const classes = useStyles();
    const [source, setSource] = React.useState("");
    const { username } = React.useContext(AppDataContext);
    React.useEffect(() => {
        if (props.isIndividualLetter) {
            if (props.selectedScheduleData.marketTypeId === 111 && props.selectedScheduleData.isROS) {
                props.setShowLoading(true);
                props.setOpenBackdrop(true);
                GetReportUrl("ReportUrls", "traffikingIndUrlROS").then(data => {
                    const urs = data.replace("<__ScheduleId__>", props.selectedScheduleId)
                    setSource(urs);
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                }).catch(err => {
                    console.log(err);
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                });
            }

            if (props.selectedScheduleData.marketTypeId === 111 && !props.selectedScheduleData.isROS) {
                props.setShowLoading(true);
                props.setOpenBackdrop(true);
                GetReportUrl("ReportUrls", "traffikingIndUrlDomestic").then(data => {
                    const urs = data.replace("<__ScheduleId__>", props.selectedScheduleId)
                    setSource(urs);
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                }).catch(err => {
                    console.log(err);
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                });
            }

            if (props.selectedScheduleData.marketTypeId === 112) {
                props.setShowLoading(true);
                props.setOpenBackdrop(true);
                GetReportUrl("ReportUrls", "traffikingIndUrlInternational").then(data => {
                    const urs = data.replace("<__partnerId__>", props.selectedScheduleData.partnerId)
                        .replace("<__countryId__>", props.selectedScheduleData.countryId)
                        .replace("<__assetId__>", props.selectedScheduleData.assetId)                    
                        .replace("<__startDate__>", Helper.FormatToIsoDate( props.selectedScheduleData.estDate))
                        .replace("<__endDate__>", Helper.FormatToIsoDate( props.selectedScheduleData.estDate));
                    setSource(urs);
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                }).catch(err => {
                    console.log(err);
                    props.setShowLoading(false);
                    props.setOpenBackdrop(false);
                });
            }
        }
        if (props.isMultiple) {
            props.setShowLoading(true);
            props.setOpenBackdrop(true);
            GetReportUrl("ReportUrls", "multipleTraffickingUrl").then(data => {
                let url = data.replace("<__startDate__>", props.traffickLetterParams.startDate)
                    .replace("<__endDate__>", props.traffickLetterParams.endDate)
                    .replace("<__countryId__>", props.traffickLetterParams.countryId)
                    .replace(
                        "<__partnerId__>", props.traffickLetterParams.partnerId 
                        ? props.traffickLetterParams.partnerId.toString() : ""
                    );
                if(props.scheduleIds.length > 0) {
                    props.scheduleIds.map(ele => {
                        url = url + '&rp:ScheduleId=' + ele;
                    });
                }

                if(props.traffickLetterParams.assetId.length > 0){
                    props.traffickLetterParams.assetId.map(ele => {
                        url = url + '&rp:AssetId=' + ele.value;
                    });
                }
                setSource(url);
                props.setShowLoading(false);
                props.setOpenBackdrop(false);
            }).catch(err => {
                console.log(err);
                props.setShowLoading(false);
                props.setOpenBackdrop(false);
            });

        }
    }, [props.selectedScheduleId]);

    return (
        <Paper elevation={0} pt={1} pb={1}>
            {props.isIndividualLetter && <Box pb={1} pl={1} pr={1} pt={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <GridHeader icon={"reporting"} showIcon={true} hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText="Traffic Letter">
                            {props.showCloseIcon && <Box display="flex" alignItems={"flex-end"} justifyContent={"flex-end"}>
                                <IconButton size="small" onClick={props.handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>}
                        </GridHeader>
                    </Grid>
                </Grid>
            </Box>}
            <Box className={`${props.isIndividualLetter ? classes.indContentHight : classes.contentHeight}`} pr={1}>
                <iframe frameborder="0" src={source} height='100%' width='100%' />
            </Box>
        </Paper>
    )
}
export default TraffickLetterViewer;