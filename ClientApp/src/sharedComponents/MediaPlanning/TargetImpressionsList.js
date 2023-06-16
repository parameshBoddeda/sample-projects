//Global Imports Start
import React, { useEffect, useState } from "react";
import { Container, Box, Button, Grid, Typography, Divider, TextField } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import { toast } from "react-toastify";
import * as AppLanguage from '../../common/AppLanguage';
//Global Imports End
import Helper from '../../common/Helper';
import Paging from "../Pagination/Paging";

const useStyles = makeStyles(theme => ({
    date1: {
        '& .MuiInputLabel-root': {
            fontSize: '.75rem',
            transform: 'translate(14px, 6px) scale(1)',
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(.35, .75),
        },
    },
    selected: {
        background: "#e4ecff"
    },
    color:{
        backgroundColor:'#e5e0e0'
    }
}));

const TargetImpressionsList = (props) => {
    const classes = useStyles();
    const [percent, setPercent]= useState(props.PercentImpressions ?? 0);
    const [targetImpression, setTargetImpression]= useState(props.TargetImpressions ?? 0);
    const [impData, setImpData] = useState([]);
    const [hptoImpData, setHPTOImpData] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    function notifyWarning(message) { toast.warning(message) }

    useEffect(()=>{
        setHPTOImpData(props.HPTOImpressionsData);
        if(props.ImpressionsData && (props.ImpressionsData.length > 0) && (props.PercentImpressions || props.TargetImpressions)){
            calculateImpressions(props.ImpressionsData, props.HPTOImpressionsData, props.PercentImpressions, props.TargetImpressions);
        }else{
            setImpData(props.ImpressionsData);
        }
    },[props.ImpressionsData, props.PercentImpressions, props.TargetImpressions]);

    useEffect(() => {
        if (props.ImpressionsData && (props.ImpressionsData.length > 0)) {
            let impdata = props.ImpressionsData.filter(x => new Date(Helper.FormatDate(x.date)) >= new Date(Helper.FormatDate(props.startDate)) 
                                                                        && new Date(Helper.FormatDate(x.date)) <= new Date(Helper.FormatDate(props.endDate)));

            let hptoData = props.HPTOImpressionsData.filter(x => new Date(Helper.FormatDate(x.date)) >= new Date(Helper.FormatDate(props.startDate))
                                                                    && new Date(Helper.FormatDate(x.date)) <= new Date(Helper.FormatDate(props.endDate)));
            calculateImpressions(impdata, hptoData, props.PercentImpressions, props.TargetImpressions);
        }
    }, [props.startDate, props.endDate]);

    const handleClose = () => {
        props.handleClose();
    }

    const handleSaveImpressions = () => {
        if(targetImpression === 0 && percent === 0){
            notifyWarning(AppLanguage.APP_MESSAGE.Impressions_or_Percentage_Validation);
            return;
        }
        //let newImpData = props.IsCampaignPlanning ? impData.filter(x=>x.instImpressions === 0 && x.calcImpressions === 0):impData.filter(x=>x.salesImpressions === 0 && x.calcImpressions === 0);
        

        /*if(newImpData.length > 0){
            let returnVal = window.confirm('Please confirm whether you want to enter the impressions for the assets');
            // notifyWarning('Impressions are not available for an Asset. Click Daywise popup to enter impressions.');
            // return;
            if(!returnVal){
                return;
            }
        }*/
        //let filteredImpData = impData.filter(x=>x.calcImpressions !== 0);
        props.handleSaveImpressions({ ImpressionData: impData, TargetImpressions : targetImpression, PercentImpressions : percent});
        handleClose();
    }

    const handlePercentChange=(e)=>{
        setPercent(e.target.value === '' ? 0 : e.target.value);
        setTargetImpression(0);
        calculateImpressions(impData, hptoImpData, e.target.value, null);
    }

    const handleImpressionChange=(e)=>{
        setTargetImpression(e.target.value === '' ? 0 : e.target.value);
        setPercent(0);
        calculateImpressions(impData, hptoImpData, null, e.target.value);
    }

    const calculateImpressions = (data, hptoData, percent, targetImp) =>{
        let daySum = 0;
        let finalData = [];
        let lastYearTotal = props.IsCampaignPlanning ? data.map(item => item.instImpressions).reduce((prev, curr) => prev + curr, 0)
                        : data.map(item => item.salesImpressions).reduce((prev, curr) => prev + curr, 0);
        let lastYearHPTOTotal = props.IsCampaignPlanning ? hptoData.map(item => item.instImpressions).reduce((prev, curr) => prev + curr, 0)
            : hptoData.map(item => item.salesImpressions).reduce((prev, curr) => prev + curr, 0)
        
            if((lastYearTotal + lastYearHPTOTotal) > 0){
                if(targetImp) {
                    //console.log((targetImp / (lastYearTotal + lastYearHPTOTotal)) * 100);
                    setPercent(((targetImp / (lastYearTotal + lastYearHPTOTotal)) * 100).toFixed(2));
                }
                else if(percent){
                    targetImp = Math.round((lastYearTotal + lastYearHPTOTotal) * (percent/100));
                    setTargetImpression(targetImp);
                }
                finalData = data.map((dayImp, i) =>{
                    let lastImp = props.IsCampaignPlanning ? dayImp.instImpressions : dayImp.salesImpressions;
                    let lastHptoImp = (props.IsCampaignPlanning ? hptoData[i].instImpressions : hptoData[i].salesImpressions) ?? 0;
                    let currImp = Math.floor((lastImp / (lastYearTotal + lastHptoImp)) * targetImp) ;
                    //currImp = currImp === 0 ? 1 : currImp; 
                    daySum += currImp;
                    return { ...dayImp, calcImpressions : currImp};
                });
            }else{
                let noDays = Math.floor((new Date(Helper.FormatToIsoDate(props.endDate)) - new Date(Helper.FormatToIsoDate(props.startDate))) / (1000 * 3600 * 24)) + 1;
                let dayImpressions = Math.floor(parseInt(targetImp) / noDays);
                                
                finalData = data.map((dayImp, i) =>{
                    daySum += dayImpressions;
                    return { ...dayImp, calcImpressions : dayImpressions};
                });
            }
        

        if (targetImp - daySum > 0 && finalData.length > 0)
            finalData[finalData.length - 1].calcImpressions = finalData[finalData.length - 1].calcImpressions + (targetImp - daySum);

        setImpData(finalData);
    }

    const handleTargetChange=(e,date,country,assetId)=>{
        let data = [...impData];
        let index = data.findIndex(x => x.assetId === assetId && x.country === country && x.date === date);
        data[index].calcImpressions = parseInt(e.target.value !== "" ? e.target.value : 0);
        setImpData(data);

        let total = data.map(item => item.calcImpressions).reduce((prev, curr) => prev + curr, 0);
        setTargetImpression(total);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleOnRowsChanged = (e) => {
        setRowsPerPage(e.target.value);
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Grid container my={2}>
                <Grid item xs={12} display="flex" mb={1.5}>
                    <Grid item xs={5.5}>
                    </Grid>

                    <Grid item xs={2.5}>
                        <TextField id="impressions" size="small" variant="outlined"
                            type="number" label={props.impressionLabel} fullWidth 
                            InputProps={{
                                inputProps: {
                                    max: 10000, min: 0
                                }
                            }}
                            value={targetImpression} onChange={(e) => handleImpressionChange(e)} />
                    </Grid>
                    <Grid item xs={.5} mx={1.5} alignSelf="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{`Or`}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="precent" size="small" variant="outlined"
                            type="number" label="Percent" fullWidth 
                            InputProps={{
                                inputProps: {
                                    max: 10000, min: 0
                                }
                            }}
                            value={percent} onChange={(e) => handlePercentChange(e)} />
                    </Grid>
                </Grid>
                <Divider sx={{ width: '100%' }} />
                <Grid className={``} key={`ConfigGridReadOnly`} item xs={12}>
                    <Box style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                        <div>
                            <Grid container alignItems="center">
                                <Grid item xs={12} className={classes.color}>
                                    <Grid container>
                                        <Grid item xs={1.5}>
                                            <Typography variant="caption">Date</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="caption">Country</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="caption">Asset</Typography>
                                        </Grid>
                                        <Grid item xs={2.5}>
                                            <Typography variant="caption">HPTO | </Typography>
                                            <Typography variant="caption">{props.IsCampaignPlanning ? 'Last Year Ins. Only' : 'Last Year Sales only'}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="caption">{props.IsCampaignPlanning ? 'Ins. Avails' : 'Sales Avails'}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="caption">{props.IsCampaignPlanning ? 'Ins. Target' : 'Sales Target'}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {impData.length > 0 && impData.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map(function (impr, k) {
                                    let hptoData = hptoImpData.find(x => x.date === impr.date);
                                    return (<>
                                        <Divider sx={{ width: '100%' }} />
                                        <Grid key={k} item xs={12} pt={1} pb={1}>
                                            <Grid container>
                                                <Grid item xs={1.5}>
                                                    <Typography variant="subtitle2">{Helper.FormatDate(impr.date)}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="subtitle2">{impr.country}</Typography>
                                                </Grid>
                                                <Grid item xs={2.5}>
                                                    <Typography variant="subtitle2">{impr.assetName}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Box display="flex">
                                                        <Typography variant="subtitle2">{props.IsCampaignPlanning ? hptoData.instImpressions : hptoData.salesImpressions} |&nbsp;</Typography>
                                                        <Typography variant="subtitle2">{props.IsCampaignPlanning ? impr.instImpressions : impr.salesImpressions}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="subtitle2">
                                                        {props.IsCampaignPlanning ? ((hptoData.instImpressions + impr.instImpressions) - impr.instUsedImpressions) 
                                                                                            : ((impr.salesImpressions + hptoData.salesImpressions) - impr.salesUsedImpressions)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <TextField type="number" size="small" label=""
                                                        variant="outlined"
                                                        value={impr.calcImpressions ?? 0}
                                                        InputProps={{
                                                            inputProps: {
                                                                max: 10000, min: 1
                                                            }
                                                        }} onChange={(e) => handleTargetChange(e, impr.date, impr.country, impr.assetId)} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>
                                    )
                                })}
                            </Grid >
                        </div>
                    </Box >
                </Grid >
                <Grid className={``} key={`ScheduleListBtns`} item xs={12} pb={1} pt={1}>
                    <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                        <Paging minRows={20} currentpage={page} rows={impData.length}
                            rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                            handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
                        />
                       
                        <Button onClick={handleClose} color="secondary">{'Cancel'}</Button>
                        <Button onClick={handleSaveImpressions} color="primary" variant="contained">{'Save'}</Button>
                    </Box>
                </Grid >
            </Grid>
        </Container>
    )
}

TargetImpressionsList.displayName = "TargetImpressionsList";
export default TargetImpressionsList;