//Global Imports Start
import React, {useState, useContext} from "react";
import { Box, IconButton, Divider, Dialog, DialogContent } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Helper from "../../common/Helper";
import SummaryListConfig from "./SummaryListConfig";
import ReportViewer from "../../screens/MediaPlanning/Planning/ReportViewer";
import AppDataContext from '../../common/AppContext';
import { GetReportUrl } from "../../services/common.service";
//Global Imports End

const useStyles = makeStyles(theme => ({
    planSummaryAccordion: {
        padding: theme.spacing(0) + '!important',
        borderTop: '1px solid rgba(0, 0, 0, 0.12) !important',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12) !important',
    },
    noMarginAccordionDetail : {
        '&.MuiAccordionDetails-root': {
            padding : theme.spacing(1),
        },
    }
}));


const PlanSummaryList = (props) => {
  const classes = useStyles();
  const { leagueId } = useContext(AppDataContext);
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const [planId, setPlanId] = useState('');
  const [reportUrl, setReportUrl] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const calculateTotalAmount = (list)=>{
    let price = list.map(item => parseFloat(item.total)).reduce((prev, curr) => prev + curr, 0);
    return Helper.ConvertToDollarFormat(price);
  }

  let unGroupedData = []

  const getUnitIcons = ()=>{
    Object.keys(props.data).map((groupName)=>{
      unGroupedData = unGroupedData.concat(props.data[groupName]);
      return 0;
    })
    let distUnitTypes = [...new Set(unGroupedData.filter(x => (x.mediaTypeId !== 101) && 
      (x.mediaTypeId !== 102) && 
      (x.mediaTypeId !== 103)).map(x => x.unitTypeName).sort())];
    let listUnitIcons = distUnitTypes.map((unitTypeName) =>{
      return <Box pr={2} component="div" display="flex" flexDirection="row" alignItems="center">
        <CircleIcon style={{ color: Helper.GetStringToColour(unitTypeName) }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption">{unitTypeName}</Typography>
      </Box>
    })

    return listUnitIcons;
  }

  const getSummaryCount = (list) => {
    let unitTypes = [...new Set(list.filter(x => (x.mediaTypeId !== 101) && 
      (x.mediaTypeId !== 102) && 
      (x.mediaTypeId !== 103)).map(x => x.unitTypeName).sort())];
    let listUnitIcons = unitTypes.map((unitTypeName) => {
      let count = getUnitsCount(list, unitTypeName);
      return <Box pr={2} title={unitTypeName} component="div">
        <Typography style={{ color: Helper.GetStringToColour(unitTypeName) }} variant="h6">{count}</Typography>
      </Box>
    })

    return listUnitIcons;
  }

  const getUnitsCount = (list, unitType) => {
    return list.filter(x => ((x.mediaTypeId !== 101) && 
    (x.mediaTypeId !== 102) && 
    (x.mediaTypeId !== 103) && 
    x.unitTypeName === unitType)).map(item => item.units).reduce((prev, curr) => prev + curr, 0);
  }

  const isMultiplePartners = (text)=>{
    if(!text) return '';
      let objs = text.split(';');
      return  (objs.length > 1);
  }

  const handleDownloadClick = (planId) =>{
    GetReportUrl("ReportUrls", "mediaPlanReportUrl").then(data => {
      setPlanId("&rp:PlanID=" + planId);
      setReportUrl(data);
      setShow(true);
    }).catch(err => {
      console.log(err);
    })
    
  }

  const isRowSameAsEditPlan = (data)=>{
    if (!props.selectedEditPlan) return false;
    let plan = props.selectedEditPlan;
    let isSame = (data.mediaPlanId === plan.mediaPlanId && data.mediaTypeParentName === plan.mediaTypeParentName 
              && data.assetName === plan.assetName && data.unitSizeName === plan.unitSizeName 
              && data.unitTypeName === plan.unitTypeName && data.startDate === plan.startDate && data.endDate === plan.endDate
              && data.total === plan.total && data.regionName === plan.regionName && data.networkNames === plan.networkNames)

    return isSame;
  }

  return (<React.Fragment>
      {Object.keys(props.data).length === 0 &&
          <Typography variant="subtitle2" color="secondary" component="div" pl={2} pb={1} className={classes.date1}>No summary</Typography>
      }
      {Object.keys(props.data).length > 0 && <Box pl={2} pb={1} display="flex" flexDirection="row" alignItems="center">
        {getUnitIcons()}
      </Box>}

      {Object.keys(props.data).map((groupName, index) =>{
          return(
          <Accordion key={'ACCPlanSummary'+index} expanded={expanded === 'panel' + index.toString()} onChange={handleChange('panel' + index.toString())}
                  style={{ backgroundColor: expanded === 'panel' + index.toString() ? '#e4ecff' : ''}} disableGutters
          >
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />} disableRipple
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes.planSummaryAccordion}
                  style={{ backgroundColor: expanded === 'panel' + index.toString() ? '#e4ecff' : '' }}
              >
                <Box px={2} display="flex" flex="1" key={'PlanSummary' + index} >
                  <Grid container>
                      <Grid item xs={12}>
                          <Grid container mr={.5} spacing={1.5}>
                              <Grid item xs={4} md={4}>
                                  <Box display="flex" flexDirection="column">
                                      <Box component="div">
                                          <Typography variant="caption" style={{ fontSize: "12px" }}>{props.IsCampaignPlanning ? 'Campaign Name' : 'Media Plan Name'}</Typography>
                                      </Box>
                                      <Box component="div">
                                          <Typography variant="subtitle2" noWrap title={props.data[groupName][0].planName} component="div" className={classes.date1}>
                                              {props.data[groupName][0].planName}
                                          </Typography>
                                      </Box>
                                  </Box>
                              </Grid>
                              <Grid item xs={4} md={4}>
                                <Box display="flex" flexDirection="column">
                                  <Box component="div">
                                      <Typography variant="caption" style={{ fontSize: "12px" }}>Booked Units</Typography>
                                  </Box>
                                  <Box pb={1} display="flex" flexDirection="row" alignItems="flex-start">
                                    {getSummaryCount(props.data[groupName])} 
                                  </Box>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={3.5} md={3.5}>
                                  <Box display="flex" flexDirection="column" alignItems={'end'}>
                                      <Box component="div">
                                          <Typography variant="caption" style={{ fontSize: "20px", color: 'red' }}>{calculateTotalAmount(props.data[groupName])}</Typography>
                                      </Box>
                                      <Box component="div">
                                          <Typography variant="subtitle2" component="div" style={{ fontSize: "10px", color: 'red' }} className={classes.date1} >
                                              Total $ Amount
                                          </Typography>
                                      </Box>
                                  </Box>
                              </Grid>
                              <Grid item xs={0.5} md={0.5}>
                                <Box display="flex" justifyContent="end">
                                      <IconButton
                                        title="Download Plan report"
                                        className={classes.done}
                                        size="small"
                                        onClick={() => {
                                          handleDownloadClick(props.data[groupName][0].mediaPlanId);
                                        }}
                                      >
                                        <DownloadOutlinedIcon />
                                      </IconButton>
                                </Box>
                            </Grid>
                          </Grid>
                      </Grid>
                  </Grid>
              </Box>
              </AccordionSummary>
              <AccordionDetails className={classes.noMarginAccordionDetail}
                  style={{ backgroundColor: expanded === 'panel' + index.toString() ? '#e4ecff' : '' }}>
                  {props.data[groupName].map((item, j) => {
                      let fieldsInfo = SummaryListConfig({ IsCampaignPlanning: props.IsCampaignPlanning, MediaType: item.mediaTypeName,
                                                              MediaTypeParent: item.mediaTypeParentName, UnitTypeName : item.unitTypeName });
                    let issame = isRowSameAsEditPlan(item);
                      return (
                        <>
                        <Box pb={1} key={'Child_' + props.data[groupName][0].mediaPlanId + '_' + j} style={{ border: issame ? '0.2px solid red' : '' }}>
                          <Grid container alignItems="center">
                            <Grid item xs={12}>
                              <Grid container>
                                <Grid item xs={1.1}>
                                  <Box display="flex" flexDirection="column" pl={1}>
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Media Type
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" className={classes.date1}>
                                        {item.mediaTypeParentName}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <Box display="flex" flexDirection="column" pl={1}>
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Asset Name
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" noWrap title={Helper.GetDistinct(item.assetName)} className={classes.date1}>
                                        {Helper.GetDistinct(item.assetName)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={fieldsInfo.MediaTypeFields.isDigital ? 1.2 : 1.2}>
                                  <Box pl={1} flexDirection="column">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Unit Size
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" noWrap title={item.unitSizeName}
                                        className={classes.date1}
                                      >
                                        {item.mediaTypeParentName !== 'Digital' ? ':' : ''}{(item.mediaTypeName === 'Social Media' || item.mediaTypeName === 'CRM') ? '1' : (item.unitSizeName !== '' ? item.unitSizeName : '')}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={1}>
                                  <Box pl={1} flexDirection="column">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Unit Type
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" noWrap title={item.unitTypeName} className={classes.date1}>
                                        {item.unitTypeName}
                                        {/* {fieldsInfo.MediaTypeFields.isDigital ? (item.rateTypeName == 'CPM' ? 'Impression' : (item.rateTypeName == 'CPV' ? 'View' : 'Post')) : item.unitTypeName} */}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                {fieldsInfo.MediaTypeFields.isDigital && <Grid item xs={1}>
                                  <Box display="flex" flexDirection="column" pl={1}>
                                    <Box component="div">
                                      <Typography variant="caption">Placement</Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" className={classes.date1}>
                                        {item.placementName}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>}
                                {fieldsInfo.MediaTypeFields.isDigital && <Grid item xs={1}>
                                    <Box display="flex" flexDirection="column" pl={1}>
                                        <Box component="div">
                                            <Typography variant="caption">Rate Type</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1}>
                                                {item.rateTypeName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>}
                                {!fieldsInfo.MediaTypeFields.isDigital && <><Grid item xs={1}>
                                  <Box pl={1} flexDirection="column">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Day Part
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" className={classes.date1}>
                                        {item.dayPartName}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={1}>
                                  <Box pl={1} display="flex" flexDirection="column" justifyContent="space-between">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Episodes
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="p" className={classes.date1}>
                                        {item.episodes}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid></>}
                                <Grid item xs={1.2}>
                                  <Box display="flex" flexDirection="column" pl={1}>
                                    <Box component="div">
                                      <Typography variant="caption">
                                        {fieldsInfo.MediaTypeFields.isDigital ? '# '+ (item.rateTypeName === 'CPM' ? 'Impressions' : (item.rateTypeName === 'CPV' ? 'Views' : 'Posts')) : '# Units'}
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" className={classes.date1}>
                                        {fieldsInfo.MediaTypeFields.isDigital ? (Helper.ConvertToUSNumberFormat(item.impressions) ?? 0) : item.units}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={2.2}>
                                  <Box pl={1} display="flex" flexDirection="column" justifyContent="space-between">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Start Date | End Date
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" className={classes.date1}>
                                        {Helper.FormatDate(item.startDate) +
                                          " | " +
                                          Helper.FormatDate(item.endDate)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <Box pl={1} pt={1} display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="body2" style={{fontSize: "20px",color: "red",}}>
                                      {Helper.ConvertToDollarFormat(item.total)}
                                    </Typography>
                                  </Box>
                                </Grid>
                                {(props.IsCampaignPlanning || (!props.IsCampaignPlanning && item.status !== 'Confirmed')) && <Grid item xs={0.3} justify="flex-end">
                                  <IconButton title="Edit plan" size="small" onClick={() => props.editMediaPlan(item)}>
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Grid>}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container>
                                {/* {
                                  fieldsInfo.MediaTypeFields.isDigital && <Grid item xs={1.1}>
                                  <Box pl={1} display="flex" flexDirection="column" justifyContent="space-between">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        {item.rateTypeName == 'CPM' ? 'Impressions' : (item.rateTypeName == 'CPV' ? 'View' : 'Post')}
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" className={classes.date1}>
                                        {Helper.ConvertToUSNumberFormat(item.impressions) ?? 0}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                } */}
                              {fieldsInfo.MediaTypeFields.regionNetwork && <>
                              <Grid item xs={1.5}>
                                <Box pl={1} display="flex" flexDirection="column" justifyContent="space-between">
                                  <Box component="div">
                                    <Typography variant="caption">
                                      Country
                                    </Typography>
                                  </Box>
                                  <Box component="div">
                                    <Typography variant="subtitle2" component="div" noWrap title={Helper.GetDistinct(item.countryName ?? item.regionName)} className={classes.date1}>
                                      {Helper.GetDistinct(item.countryName ?? item.regionName)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={2.3}>
                                <Box pl={1} display="flex" flexDirection="column" justifyContent="space-between">
                                  <Box component="div">
                                    <Typography variant="caption">
                                      Network
                                    </Typography>
                                  </Box>
                                  <Box component="div">
                                      <Typography variant="subtitle2" component="div" noWrap title={Helper.GetDistinct(item.networkNames)} className={classes.date1}>
                                        {isMultiplePartners(item.networkNames)
                                        ? "Multiple"
                                          : Helper.GetDistinct(item.networkNames)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              {!fieldsInfo.MediaTypeFields.isDigital  &&<Grid item xs={2}>
                                  <Box pl={1} display="flex" flexDirection="column" justifyContent="space-between">
                                    <Box component="div">
                                      <Typography variant="caption">
                                        Channel
                                      </Typography>
                                    </Box>
                                    <Box component="div">
                                      <Typography variant="subtitle2" component="div" noWrap title={item.channel} className={classes.date1}>
                                        {item.channel}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>}
                              </>}
                            </Grid>
                          </Grid>                          
                        </Box>
                        <Divider />
                        </>
                      );
                  })}
              </AccordionDetails>
          </Accordion>)
      })}

      <Dialog open={show} fullWidth={true} maxWidth="xl">
        <DialogContent>
        <ReportViewer hideExpandIcon={true} planId={planId} leagueId={leagueId} url={reportUrl}
          handleClose={() => setShow(false)} showCloseIcon={true} />
        </DialogContent>
      </Dialog>
      </React.Fragment>
    )
}

PlanSummaryList.displayName = "PlanSummaryList";
export default PlanSummaryList;