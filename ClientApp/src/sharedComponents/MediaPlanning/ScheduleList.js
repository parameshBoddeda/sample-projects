//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, Button, Grid, Typography, Divider, TextField, Checkbox } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
//Global Imports End
import Helper from '../../common/Helper';
import AppDataContext from '../../common/AppContext';
import DateRangePicker from '../../sharedComponents/PickDateRange/PickDateRange';
import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import * as AppLanguage from '../../common/AppLanguage';

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
    }
}));


const ScheduleList = (props) => {
    const classes = useStyles();
    const { DistributionRules } = useContext(AppDataContext);
    const [distributionRules, setDistributionRules] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(props.startDate);
    const [selectedEndDate, setSelectedEndDate] = useState(props.endDate);
    const [unitPerEpisode, setUnitPerEpisode] = useState('');
    const [unit, setUnit] = useState('');
    const [distributionName, setDistributionName] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    //const [distributionData, setDistributionData] = useState([{ label: 'Even Distrubution', value: 'Even Distribution' }, { label: 'Every Other', value: 'Every Other' }, { label: 'First Available', value: 'First Available' }]);
    const [schedules, setSchedules] = useState([]);
    const [orgSchedules, setOrgSchedules] = useState([])
    const [selectedEpisodes, setSelectedEpisodes] = useState([]);
    const [flag, setFlag] = useState(0);
    const [isValidUnitsPerEpisode, setIsValidUnitsPerEpisode] = useState(true);
    const [disableUnitsPerEpisode, setDisableUnitsPerEpisode] = useState(false);
    const [disableUnits, setDisableUnits] = useState(false);

    useEffect(() => {
        if (DistributionRules && DistributionRules.length > 0) {
            let list = DistributionRules.map((item) => {
                return { label: item.lookupText, value: item.lookupId }
            });
            setDistributionRules(list);
        }
    }, [DistributionRules]);

    useEffect(() => {
        setSelectedStartDate(props.startDate);
        setSelectedEndDate(props.endDate);
    }, [props.startDate, props.endDate]);

    useEffect(() => {
        // setSelectedEpisodes([]);
        // var startDate = Helper.FormatDate(selectedStartDate);
        // var endDate = Helper.FormatDate(selectedEndDate);
        // var filteredSchedules = [...orgSchedules].filter(s => {
        //     // return (Helper.FormatDate(s.estDate) >= startDate && Helper.FormatDate(s.estDate) <= endDate);
        //     return (new Date(s.estDate) >= new Date(startDate) && new Date(s.estDate) <= new Date(endDate));
        // });

        // setSchedules(filteredSchedules);
    }, [selectedStartDate, selectedEndDate]);

    useEffect(() => {
        if(props.schedules){
            let sortedData = props.schedules.sort((a, b) => (a.estTime < b.estTime) ? 1 : -1).sort((a, b) => (a.estDate > b.estDate) ? 1 : -1);
            setSchedules(sortedData);
            setOrgSchedules(sortedData);
        }
    }, [props.schedules]);

    const handleUnitChange = (e) => {

        if (e.target.value !== '') {
            let allSchedules = schedules;

            let sum = allSchedules.reduce((accumulator, obj) => {
                return accumulator + obj.availableUnits;
            }, 0);

            if (sum < parseInt(e.target.value))
            {
                props.notifyWarning(AppLanguage.APP_MESSAGE.Assign_Unit_Validation);
                setAllChecked(false);
                setSelectedEpisodes([]);
            }
            else {
                setUnit(e.target.value);
                checkAllForUnitsAndDistribution(allChecked, e.target.value, distributionName);
            }
        }
        else
            setUnit('');

        setUnitPerEpisode('');
    }

    const checkAllForUnitsperEpisodes = (isChecked, units)=>{
        let allSchedules = schedules;
        var selectedEpisodes = [];
        if (isChecked && units !== '' && units !== 0) {
            var id= 0;
            let newEpisodes = allSchedules.map(s => {
                let unit = units;
                if(s.availableUnits < parseInt(unit)){
                    unit = s.availableUnits;
                }
                return { ...s, unitsPerEpisode: isChecked ? parseInt(unit) : 0, updatedUnitsPerEpisode: isChecked ? parseInt(unit) : 0 }
            });
    
            setSchedules(newEpisodes);
            var filtererdEpisodes = newEpisodes.filter(s=> s.updatedUnitsPerEpisode > 0);
            setSelectedEpisodes(filtererdEpisodes);
            if(filtererdEpisodes.length === 0)
                props.notifyWarning(AppLanguage.APP_MESSAGE.Episode_Length_msg);
        }
        else
            setSelectedEpisodes([]);
    }

    const checkAllForUnitsAndDistribution = (isChecked, unit, distType) =>{
        let allSchedules = [...schedules];
        let id = 0;
        if (isChecked && (unit !== '') && (distType !== '')) {
            var unitvalue = parseInt(unit);
            var episodeCount = allSchedules.length;    
            var avgunitrem = unitvalue%episodeCount;
            unitvalue = unitvalue - avgunitrem;        
            var avgunit = unitvalue/episodeCount;
            var unitvaluenew = parseInt(unit);
            let newEpisodes = allSchedules.map((s, index) => {            
                    if(distType.value === 1151){ // first available
                        if(unitvaluenew < 2){                         
                             avgunit = unitvaluenew;
                        }else{                            
                            avgunit = 2;
                        }
                        var unitDeduct = 2;
                        if(s.availableUnits <2){
                            unitDeduct = s.availableUnits;
                        }
                        unitvaluenew = unitvaluenew - unitDeduct ;
                    }else{
                        avgunitrem = avgunitrem - 1;
                        var val = 0;
                        if(avgunitrem > -1){
                            val = 1;
                        }
                    }
                    var unitPerEpisodeValue = isCheckOnDistribution(avgunit, val, s.availableUnits, distType);
                    var obj = { ...s, unitsPerEpisode: unitPerEpisodeValue , updatedUnitsPerEpisode:  unitPerEpisodeValue };
                    return obj;
            });
            setSchedules(newEpisodes);
            var filtererdEpisodes = newEpisodes.filter(s=> s.updatedUnitsPerEpisode > 0);
            setSelectedEpisodes(filtererdEpisodes);
        }
        else
            setSelectedEpisodes([]);
    }

    const handleUnitPerEpisodeChange = (e) => {
        setUnitPerEpisode(e.target.value);
        if (e.target.value !== '' && allChecked) {
            checkAllForUnitsperEpisodes(allChecked, e.target.value);            
        }
        else
            setSelectedEpisodes([]);

        setUnit('');
        setDistributionName('');
    }

    const handleDistributionChange = (name, value) => {
        if (unit === '')
            props.notifyWarning(AppLanguage.APP_MESSAGE.Unit_Validation);
        else
        {
            setDistributionName(value);
            checkAllForUnitsAndDistribution(allChecked, unit, value);
        }
    }

    const handleClose = () => {
        props.handleClose();
    }

    const handleSaveSchedules = () => {
        if (selectedEpisodes.length === 0) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Checkbox_selection);
            return false;
        }
        let status = true;
        let greaterExist = false;
        for (var i = 0; i < selectedEpisodes.length; i++) {
            if (!selectedEpisodes[i].updatedUnitsPerEpisode || (selectedEpisodes[i].updatedUnitsPerEpisode === '') 
                || (selectedEpisodes[i].updatedUnitsPerEpisode === 0 || selectedEpisodes[i].updatedUnitsPerEpisode === '0')) {
                status = false;
            }

            if (selectedEpisodes[i].updatedUnitsPerEpisode > selectedEpisodes[i].availableUnits)
                greaterExist = true;
        }

        if (!status) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Selected_Episode_Value);
            return status;
        }

        if (greaterExist) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Greater_Exist_AvailableUnits);
            return status;
        }

        var schedueledata = {};
        schedueledata.startDate = selectedStartDate;
        schedueledata.endDate = selectedEndDate;
        schedueledata.unitPerEpisode = unitPerEpisode;
        schedueledata.unit = unit;
        schedueledata.distributionName = distributionName;
        schedueledata.selectedEpisodes = selectedEpisodes;
        var newScheduleData = [];
        for(var j=0;j<selectedEpisodes.length;j++){
            var obj = {};
            obj.ScheduleId = selectedEpisodes[j].id;
            obj.UnitsPerEpisode = selectedEpisodes[j].updatedUnitsPerEpisode;
            obj.DistributionType = distributionName.value;
            newScheduleData.push(obj);
        }
        props.handleSaveSchedule(newScheduleData);
    }

    const handleChecked = (id) => {
        var selectedIndex = selectedEpisodes.findIndex(x => x.id === id);
        var allEpisodes = selectedEpisodes;
        let isChecked = true;
        if (selectedIndex === -1) {
            var index = schedules.findIndex(x => x.id === id);
            var episode = schedules[index];
            allEpisodes.push(episode);
        } else {
            allEpisodes.splice(selectedIndex, 1);
            // setSelectedEpisodes(allEpisodes);
            isChecked = false;
        }

        if ((unitPerEpisode !== '') && isChecked) {
            let allSchedules = schedules;
            // var allSelectedEpisodes = allEpisodes;
            let selectedIndex = allEpisodes.findIndex(x =>x.id === id);
            let newEpisodes = allSchedules.map(s => {
                if (s.id === id) {    
                    var unit = unitPerEpisode;     
                    if(s.availableUnits < parseInt(unit)){
                        unit = s.availableUnits;
                    }     
                    allEpisodes[selectedIndex].updatedUnitsPerEpisode = parseInt(unitPerEpisode);
                    return { ...s, unitsPerEpisode: isChecked ? parseInt(unit) : 0, updatedUnitsPerEpisode: isChecked ? parseInt(unit) : 0 }
                }
                return s;
            });
            // setSelectedEpisodes(allSelectedEpisodes);

            setSchedules(newEpisodes);
        }
        if ((unit !== '') && (distributionName !== '')) {
            let allSchedules = schedules;            
            var unitvalue = parseInt(unit);
            var episodeCount = allEpisodes.length;    
            var avgunitrem = unitvalue%episodeCount;
            unitvalue = unitvalue - avgunitrem;        
            var avgunit = unitvalue/episodeCount;
            var unitvaluenew = parseInt(unit);
            let newEpisodes = allSchedules.map((s, index) => {
                let selectedIndex = allEpisodes.findIndex(x =>x.id === s.id);
                if(selectedIndex !== -1){                                
                    if(distributionName.value === 1151){ // first available
                        if(unitvaluenew < 2){
                            // avgunitrem = avgunitrem -2;                            
                             avgunit = unitvaluenew;
                            // console.log(avgunit);
                        }else{                            
                            avgunit = 2;
                        }
                        var unitDeduct = 2;
                        if(s.availableUnits <2){
                            unitDeduct = s.availableUnits;
                        }
                        unitvaluenew = unitvaluenew - unitDeduct ;
                    }else{
                        avgunitrem = avgunitrem - 1;
                        var val = 0;
                        if(avgunitrem > -1){
                            val = 1;
                        }
                    }
                    var unitPerEpisodeValue = isCheckOnDistribution(avgunit, val, s.availableUnits, distributionName);
                    allEpisodes[selectedIndex].updatedUnitsPerEpisode = unitPerEpisodeValue;
                    var obj = { ...s, unitsPerEpisode: unitPerEpisodeValue , updatedUnitsPerEpisode:  unitPerEpisodeValue };
                    return obj;
                }
                return s;
            });
            // setSelectedEpisodes(allSelectedEpisodes);
            setSchedules(newEpisodes);
            var filtererdEpisodes = allEpisodes.filter(s=> s.updatedUnitsPerEpisode > 0);
            allEpisodes = filtererdEpisodes;
        }
        //TODO add distribution logic here
        // console.log(allEpisodes);
        setSelectedEpisodes(allEpisodes);
        setFlag(flag + 1);
    }

    const isCheckOnDistribution = (avgunit, avgunitrem, availableUnits, distType) => {
        if (distType.value === 1151){ // first available            
            let val = Math.floor(avgunit);
            if(val > availableUnits)
                val = availableUnits;
            return val;
        }

        if (distType.value === 1153){ // even distribution
            let val = Math.floor(avgunit + avgunitrem);
            if(val > availableUnits)
                val = availableUnits;

            return val;
        }
        
        return 0;
    }

    const handleAllChecked = (e) => {
        if (unitPerEpisode === '' && (unit === '' || distributionName === '')){
            props.notifyWarning(AppLanguage.APP_MESSAGE.Episode_Unit_Rule);
            return;
        }

        let isChecked = !allChecked;
        setAllChecked(isChecked);
        
        if (unitPerEpisode !== '') {
            checkAllForUnitsperEpisodes(isChecked, unitPerEpisode);
        } else if (unit !== '' && distributionName !== ''){
            checkAllForUnitsAndDistribution(isChecked, unit, distributionName);
        }
        else{
            setSelectedEpisodes([]);
            var startDate = Helper.FormatDate(selectedStartDate);
            var endDate = Helper.FormatDate(selectedEndDate);
            var filteredSchedules = [...orgSchedules].filter(s => {
                // return (Helper.FormatDate(s.estDate) >= startDate && Helper.FormatDate(s.estDate) <= endDate);
                return (new Date(s.estDate) >= new Date(startDate) && new Date(s.estDate) <= new Date(endDate));
            });
            setSchedules(filteredSchedules);
        }
        setFlag(flag + 1);
    }

    const isChecked = (id) => {
        var allEpisodes = selectedEpisodes;
        var index = allEpisodes.findIndex(x => x.id === id);
        if ((index !== -1)) {
            if((allEpisodes[index].updatedUnitsPerEpisode <= 0)){
                return false;
            }else{
                return true;
            }
        }
        return false;
    }

    const handleUnitPerEpisodeWithIdChange = (e, schedule) => {
        if (isNaN(e.target.value)){
            props.notifyWarning(AppLanguage.APP_MESSAGE.Invalid_Value);
            return;
        }
        if (e.target.value > schedule.availableUnits) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.AvailableUnits_Validation);            
        }
        var allEpisodes = selectedEpisodes;
        var index = allEpisodes.findIndex(x => x.id === schedule.id);
        if (index !== -1) {
            allEpisodes[index].updatedUnitsPerEpisode = e.target.value;
        }
        setSelectedEpisodes(allEpisodes);
        //setFlag(flag + 1);
    }

    const handleSearch=()=>{
        setSelectedEpisodes([]);
        var startDate = Helper.FormatDate(selectedStartDate);
        var endDate = Helper.FormatDate(selectedEndDate);
        var filteredSchedules = [...orgSchedules].filter(s => {
            // return (Helper.FormatDate(s.estDate) >= startDate && Helper.FormatDate(s.estDate) <= endDate);
            return (new Date(s.estDate) >= new Date(startDate) && new Date(s.estDate) <= new Date(endDate));
        });
        setSchedules(filteredSchedules);
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Grid container my={2}>
                <Grid item xs={12} mb={1.5} display="flex" alignItems={'flex-end'}>
                    <Grid item xs="6"></Grid>
                    <Grid item xs="5.5" ml={1.5}>
                        <DateRangePicker
                            startDateLabel={'Start Date'}
                            disablePast={false}
                            endDateLabel={'End Date'}
                            startDate={selectedStartDate}
                            endDate={selectedEndDate}
                            setStartDate={setSelectedStartDate}
                            setEndDate={setSelectedEndDate} />
                    </Grid>
                    <Grid xs=".5" alignSelf={'center'} pl={1}>
                        <SearchOutlinedIcon onClick={()=>handleSearch()}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} display="flex" mb={1.5}>
                    <Grid item xs={1}>
                        <Checkbox checked={allChecked} onChange={(e) => handleAllChecked(e)} />
                    </Grid>
                    <Grid item xs={2} alignSelf="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }} color="primary">{`Schedules`}</Typography>
                    </Grid>

                    <Grid item xs={2.5}>
                        <TextField id="unitsperepisodes" size="small" variant="outlined"
                            type="number" label="Units Per Episodes" fullWidth disabled={disableUnitsPerEpisode}
                            InputProps={{
                                inputProps: {
                                    max: 10000, min: 0
                                }
                            }}
                            value={unitPerEpisode} onChange={(e) => handleUnitPerEpisodeChange(e)} />
                    </Grid>
                    <Grid item xs={.5} mx={1.5} alignSelf="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{`Or`}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="units" size="small" variant="outlined"
                            type="number" label="Units" fullWidth disabled={disableUnits}
                            InputProps={{
                                inputProps: {
                                    max: 10000, min: 0
                                }
                            }}
                            value={unit} onChange={(e) => handleUnitChange(e)} />
                    </Grid>
                    <Grid item xs={3} ml={1.5}>
                        <Dropdown name="distribution" size="small" id="distribution" variant="outlined" showLabel={true}
                            lbldropdown="Distribution Rule" value={distributionName} handleChange={handleDistributionChange}
                            disabled={disableUnits}
                            ddData={distributionRules} />
                    </Grid>
                </Grid>
                <Divider sx={{ width: '100%' }} />
                <Grid className={``} key={`ConfigGridReadOnly`} item xs={12}>
                    <Box style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                        <div>
                            <Grid container alignItems="center">
                                {schedules.length > 0 && schedules.map(function (schedule, k) {
                                    return (<>
                                        {k !== 0 && <Divider sx={{ width: '100%' }} />}
                                        <Grid className={isChecked(schedule.id) ? classes.selected : ''} key={k} item xs={12}>
                                            <Grid container>
                                                <Grid item xs={1}>
                                                    <Checkbox checked={isChecked(schedule.id)} disabled={schedule.availableUnits === 0 || !isValidUnitsPerEpisode} onChange={() => handleChecked(schedule.id)} />
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Box component="div">
                                                            <Typography variant="caption">Episode</Typography>
                                                        </Box>
                                                        <Box component="div" nowarp title={schedule.episodeName + (schedule.networkName ? '(' + schedule.networkName + ')' : '')}>
                                                            <Typography variant="subtitle2">{schedule.episodeName} {schedule.networkName ? '(' + schedule.networkName +')' : ''}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={1.5}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Box component="div">
                                                            <Typography variant="caption">Date</Typography>
                                                        </Box>
                                                        <Box component="div" >
                                                            <Typography variant="subtitle2">{Helper.FormatDate(schedule.estDate)}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={1.5}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Box component="div">
                                                            <Typography variant="caption">Time</Typography>
                                                        </Box>
                                                        <Box component="div" >
                                                            <Typography variant="subtitle2">
                                                                {Helper.FormatTime(schedule.estTime)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Box component="div">
                                                            <Typography variant="caption">Available | Units Per Episode</Typography>
                                                        </Box>
                                                        <Box component="div" display='flex' alignItems="center">
                                                            <Typography variant="subtitle2">
                                                                {schedule.availableUnits}
                                                            </Typography>
                                                            <Box px={.5}>|</Box>
                                                            <Typography variant="subtitle2">{isChecked(schedule.id) ? ((unitPerEpisode === '' && unit === '') ? <TextField type="number" size="small" label=""
                                                                InputProps={{
                                                                    inputProps: {
                                                                        max: schedule.availableUnits, min: 1
                                                                    }
                                                                }} onChange={(e) => handleUnitPerEpisodeWithIdChange(e, schedule)} variant="standard" /> : schedule.unitsPerEpisode) : 0}</Typography>
                                                        </Box>
                                                    </Box>
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
                        <Button onClick={handleClose} color="secondary">{'Cancel'}</Button>
                        <Button onClick={handleSaveSchedules} color="primary" variant="contained">{'Save'}</Button>
                    </Box>
                </Grid >
            </Grid>
        </Container>
    )
}

ScheduleList.displayName = "ScheduleList";
export default ScheduleList;