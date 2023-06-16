//Global Imports Start
import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@mui/material/Accordion';
import CircleIcon from '@mui/icons-material/Circle';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Helper from "../../../common/Helper";

//Global Imports End
//Regional Imports Start

//Regional Import End

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
    oneThirdWidth: { width: "calc(30% - 4px)" },
    twoThirdWidth: { width: "calc(70% - 4px)" },
    borderBottom: {
        borderBottom: '1px solid'
    },
    noPadding : {
        padding : '2px !important',
    },
    campaignHeight: {
        height: 'calc(100vh - 430px)',
        overflowY: 'auto',
    },
    unitTypeName:{
        fontSize: '10px', 
        lineHeight: '1'
    }
}));

export default function CampaignList(props) {
    const classes = useStyles();

    const handleChange = (panel, mediaPlanId, campOrAdvId) => (event, isExpanded) => {
        props.onHeaderSelectionChange(mediaPlanId, campOrAdvId);
    };

    const handleISCIchange = (isciInfo, mediaPlanId)=>{
        props.onISCISelectionChange(isciInfo, mediaPlanId);
    }

    let unGroupedData = [];
    const getUnitIcons = () => {
        Object.keys(props.SummaryList).map((groupName) => {
            unGroupedData = unGroupedData.concat(props.SummaryList[groupName]);
            return 0;
        })
        let distUnitTypes = [...new Set(unGroupedData.filter(x =>  x.unitTypeName !== null).map(x => x.unitTypeName).sort())];
        let listUnitIcons = distUnitTypes.map((unitTypeName) => {
            return <Box pr={1} component="div" display="flex" flexDirection="row" alignItems="center" lineHeight={'1'}>
                <CircleIcon style={{ color: Helper.GetStringToColour(unitTypeName), fontSize: '10px' }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption" className={classes.unitTypeName}>{unitTypeName}</Typography>
            </Box>
        }) 

        return listUnitIcons;
    }

    const getSummaryCount = (list) => {
        let unitTypes = [...new Set(list.filter(x => x.unitTypeName !== null).map(x => x.unitTypeName).sort())];
        let listUnitIcons = unitTypes.map((unitTypeName) => {
            let count = getUnitsCount(list, unitTypeName);
            return <Box pr={1} title={unitTypeName} component="div">
                <Typography style={{ color: Helper.GetStringToColour(unitTypeName), fontSize: '0.875rem' }} variant="caption" fontWeight="medium">{count}</Typography>
            </Box>
        })

        return listUnitIcons;
    }

    const getUnitsCount = (list, unitType) => {
        return list.filter(x => x.unitTypeName === unitType).map(item => item.units).reduce((prev, curr) => prev + curr, 0);
    }

    return (
        <Container maxWidth={false} disableGutters>
            <React.Fragment>
                {Object.keys(props.SummaryList).length > 0 && <Box pl={2} pb={1} display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
                    {getUnitIcons()}
                </Box>}
                <Box className={classes.campaignHeight}>
                {Object.keys(props.SummaryList).map((groupName, index) => {
                    let mediaPlanId = props.SummaryList[groupName][0].mediaPlanId;
                    let campaignOrAdvertiserId = props.SummaryList[groupName][0].campaignOrAdvertiserId;

                    return (
                        <Accordion key={'CalCampSummary'+index} 
                        // expanded={expanded === 'panel' + index.toString()} 
                        disableGutters
                            onChange={handleChange('panel' + index.toString(), mediaPlanId, campaignOrAdvertiserId)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />} disableRipple
                                aria-controls="panel1bh-content"
                                style={{ backgroundColor: !props.selectedISCIinfo && (props.setlecedMediaPlan === mediaPlanId) ? '#e4ecff' : '',
                                                            borderTop: '1px solid grey', borderBottom: '1px solid grey' }}
                                id="panel1bh-header"
                            >
                                <Grid container mr={.5}>
                                    <Grid item xs={12}>
                                        <Box display="flex" flexDirection="column">
                                            <Box component="div">
                                                <Typography variant="caption">Campaign Name</Typography>
                                            </Box>
                                            <Box component="div">
                                                <Typography variant="caption" fontWeight="medium" component="div" className={classes.date1}>
                                                    {props.SummaryList[groupName][0].planName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" flexDirection="column">
                                            <Box component="div">
                                                <Typography variant="caption">Booked Units</Typography>
                                            </Box>
                                            <Box pb={1} display="flex" flexDirection="row" alignItems="flex-start">
                                                {getSummaryCount(props.SummaryList[groupName])}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails className={classes.noPadding}>
                                <Grid container disableGutters>
                                    <Grid item xs={12}>
                                        {props.IscisList.filter(x => x.campaignOrAdvertiserId === campaignOrAdvertiserId).map((item) => {
                                            return (
                                                <div onClick={() => handleISCIchange(item, mediaPlanId)}
                                                    style={{ backgroundColor: (props.selectedISCIinfo && props.selectedISCIinfo.isci === item.isci) ? '#e4ecff' : '' }}>
                                                    <Grid container className={classes.borderBottom}>
                                                        <Grid item xs={6} md={6}>
                                                            <Box display="flex" flexDirection="column" flex="1" title={"Flight Start/End Date: " + Helper.FormatDate(item.flightStartDate) + " - " + Helper.FormatDate(item.flightEndDate)}>
                                                                <Typography variant="caption">
                                                                    ISCI
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    {item.isci}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6} md={6}>
                                                            <Box display="flex" flexDirection="column" flex="1">
                                                                <Typography variant="caption">
                                                                    ISCI Title
                                                                </Typography>
                                                                <Typography variant="caption" component="div" className={classes.date1}>
                                                                    {item.title}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )
                                        })}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {props.IscisList.filter(x => x.campaignOrAdvertiserId === campaignOrAdvertiserId).length === 0 &&
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>No ISCI's available</Typography>
                                        }
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>)
                })}
                {Object.keys(props.SummaryList).length === 0 &&
                    <Typography variant="subtitle2" color="secondary" component="div" className={classes.date1}>No {props.IsCampaignPlanning ? 'Campaign' : 'Media Plan'} selected</Typography>
                }
                </Box>
            </React.Fragment>
        </Container>
    )
}
