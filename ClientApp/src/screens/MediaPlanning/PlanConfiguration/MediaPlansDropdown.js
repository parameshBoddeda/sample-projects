//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Paper, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import Backdrop from '@mui/material/Backdrop';

import MultiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { GetMediaPlans, GetMediaPlanPartners } from '../../../services/planning.service';
import { GetPartnerByType, GetSeason } from '../../../services/common.service';
//Global Imports End

import ChipsList from '../../../sharedComponents/chips/ChipsList';
import AppDataContext from '../../../common/AppContext'
import Helper from "../../../common/Helper";

const useStyles = makeStyles(theme => ({
    card: {
      marginRight: theme.spacing(1),
      display: "inline-flex",
      position: 'relative',
      '&:last-child': {
        marginRight: theme.spacing(0),
      },
    },
    CardContent: { padding: theme.spacing(0) + 'px !important' },
    chips: {
        padding: theme.spacing(1),
        maxHeight: 'calc(100vh - 546px)',
        overflowY: 'auto',
        minHeight: '64px',
        '& li': {
            marginBottom: theme.spacing(.25),
        },
    },
  }));

const MediaPlansDropdown = (props) => {
    const classes = useStyles();
    const { leagueId } = useContext(AppDataContext);
    const [showLoading, setShowLoading] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [currYearMediaPlansList, setCurrYearMediaPlansList] = useState([]);
    const [plansList, setPlansList] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState([]);
    const [partnerList, setPartnerList] = useState([]);
    const [selectedCustId, setSelectedCustId] = useState(0);
    const [selectedCustName, setSelectedCustName] = useState('');
    const [seasonData, setSeasonData] = React.useState([])
    const [selectedYear, setSelectedYear] = React.useState('');

    // useEffect(()=>{
    //     if (props.selectedYear && seasonData.length > 0) 
    //         setSelectedYear(props.selectedYear);
    // }, [seasonData]);

    useEffect(()=>{
        if(leagueId){
            GetSeason(leagueId).then((data) => {
                let season = [];
                data.map(item => {
                    season.push({ label: item.year.toString(), value: item.seasonId, startDate: item.startDate, endDate: item.endDate });
                });
                setSeasonData(season);

                let year = props.selectedYear;
                if(!props.selectedYear)
                    year = data.find(x => x.isCurrentSeason === true)?.year;

                setSelectedYear(year);
                getMediaPartners(leagueId, year, props.selectedPlanData);
            });

            if (!props.selectedYear) {
                setSelectedPlan([]);
                setPlansList([]);
            }
        }
    }, [leagueId]);

    const getMediaPlans = (year, selectedPlanData) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        GetMediaPlans(-1, year, leagueId).then(planData => {
            //let confirmedPlans =planData.filter(x=> x.status === 'Confirmed').map(y=>y.planName);

            let list = planData.filter(x => x.customerId !== 1 && x.leagueId === leagueId && x.status !== 'Confirmed' && x.status !== 'Cancelled' && !x.isPlanVersionConfirmed).map((item) => {
                return { label: item.customerName+' - '+ item.planName + ' - V' + item.version, value: item.id, year: item.year, customerId: item.customerId, 
                            campaignOrAdvertiserId: item.customerId, planStatus: item.status, startDate : Helper.FormatDate(item.startDate), endDate : Helper.FormatDate(item.endDate) }
            });
            setCurrYearMediaPlansList(list);
            setShowLoading(false);
            setOpenBackdrop(false);

            if (selectedCustId !== 0 || selectedPlanData){
                let id = selectedCustId !== 0 ? selectedCustId : selectedPlanData?.customerId;
                let filteredList = list.filter(x => x.customerId === id);
                setPlansList(filteredList);
            }

            if (selectedPlanData){
                let planList = list.filter(x => x.value === selectedPlanData.id);
                setSelectedPlan(planList);                
                getPlanDates(planList);
                props.getSelectedPlan(planList);
            }
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
        });
    }

    const handleChange=(name, value)=>{
        let temp = selectedPlan.slice();
        let index = temp.findIndex(t=>t.value === value.value);
        if(index <= -1){
            temp.push(value);
            setSelectedPlan(temp);
        }
        
        getPlanDates(temp);
        props.getSelectedPlan(temp);
    }

    const handleDelete=(name, value)=>{
        let temp = selectedPlan.slice();
        let index = temp.findIndex(t=>t.label === value);
        temp.splice(index,1);
        setSelectedPlan(temp);
        //console.log(temp);        
        getPlanDates(temp);
        props.getSelectedPlan(temp);
    }

    const getPlanDates =(list)=>{
        if(list && list.length > 0){
            let minDate = new Date(Math.min(...list.map(item => { return new Date(item.startDate) })));
            let maxDate = new Date(Math.max(...list.map(item => { return new Date(item.endDate) })));
            
            if (minDate && maxDate && minDate instanceof Date && !isNaN(minDate) && maxDate instanceof Date && !isNaN(maxDate)){
                //props.SetSeasonStartDate(Helper.FormatDate(minDate));
                //props.SetSeasonEndDate(Helper.FormatDate(maxDate));
                props.SetSeasonDates(Helper.FormatDate(minDate), Helper.FormatDate(maxDate));
            } else {
                //props.SetSeasonStartDate(null);
                //props.SetSeasonEndDate(null);
                props.SetSeasonDates(null, null);
            }
        }
        else{
            //props.SetSeasonStartDate(null);
            //props.SetSeasonEndDate(null);
            props.SetSeasonDates(null, null);
        }
    }

    const getMediaPartners = (league, year, selectedCustData) =>{
        GetMediaPlanPartners(league, year).then((data) => {
            let cList = [];
            if (data) {
                data.map(item => {
                    cList.push({ label: item.partnerName, value: item.id });
                });
                setPartnerList(cList);

                if (selectedCustData) {
                    setSelectedCustName(selectedCustData.customerName);
                    setSelectedCustId(selectedCustData.customerId);
                    getMediaPlans(year, selectedCustData);
                }
                else
                    getMediaPlans(year, null);
            }
        }).catch(err => console.log(err));
    }

    const handleYearChange = (e,item)=>{
        let year = parseInt(item.label);
        setSelectedYear(year);
        setSelectedCustName('');
        setSelectedCustId(0);
        setSelectedPlan([]);
        props.getSelectedPlan([]);
        getMediaPartners(leagueId, year, null);
        //props.SetSeasonStartDate(Helper.FormatDate(item.startDate));
        //props.SetSeasonEndDate(Helper.FormatDate(item.endDate));
        props.SetSeasonDates(Helper.FormatDate(item.minDate), Helper.FormatDate(item.maxDate));
    }

    const handlePartnerChange =(e, item)=>{
        let list = plansList;
        list = currYearMediaPlansList.filter(x=> x.customerId === item.value);
        setSelectedCustName(item.label);
        setSelectedCustId(item.value);
        setPlansList(list);
    }

    return (<Paper>
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{ flexGrow: 1 }} alignItems="center">
                        <Grid container spacing={0.5} py={1} px={1}>
                            <Grid item xs={1}>
                                <Dropdown name="year" handleChange={handleYearChange} value={selectedYear?.toString()}
                                    size="small" id="year" variant="outlined"
                                    showLabel={true} lbldropdown="Year" ddData={seasonData} />
                            </Grid>
                            <Grid item xs={2}>
                                <Dropdown name="partner" handleChange={handlePartnerChange}
                                    size="small" id="partner" variant="outlined" value={selectedCustName}
                                    showLabel={true} lbldropdown="Partner" ddData={partnerList}
                                />
                            </Grid>
                            <Grid item md={3}>
                                <FormControl fullWidth size="small" className="dropdown">
                                    <MultiSelectDropdown name="MediaPlan" size="small" SMwidth="400" fullWidth lbldropdown="Media Plan"
                                        ddData={plansList.length ? plansList : []}
                                        handleChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={5} className={classes.chips}>
                                {selectedPlan.length > 0 && <ChipsList chipcolor={true} name="MediaPlan" size="small" handleDelete={handleDelete} showDelete={true} label="" data={selectedPlan}/>}
                            </Grid>
                            <Grid item md={1}>
                                <Box display="flex" justifyContent="flex-end" flex="1" alignItems="center">
                                    <IconButton title="Event Note List View" size="small" onClick={() => {
                                        props.SetView(false);
                                    }} color={(props.IsCalendarView && !props.IsDigitalPlanning) ? 'primary' : 'secondary'}>
                                        <EventNoteOutlinedIcon />
                                    </IconButton>
                                    {!props.IsDigitalPlanning && <IconButton title="Event Note Calendar View" size="small"
                                        onClick={() => {props.SetView(true); }} color={props.IsCalendarView ? 'secondary' : 'primary'}>
                                        <CalendarMonthOutlinedIcon />
                                    </IconButton>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            {showLoading && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <div className={'loader-div'}><div className={'loading'}></div></div>
            </Backdrop>}
        </Paper>

    )
}

MediaPlansDropdown.displayName = "MediaPlansDropdown";
export default MediaPlansDropdown;