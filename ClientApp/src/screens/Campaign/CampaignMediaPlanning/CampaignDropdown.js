//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Paper, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import { Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';

import AppDataContext from '../../../common/AppContext';
import { GetCampaignList } from './../../../services/campaign.service';
import { GetCampaignMediaPlans } from './../../../services/planning.service';
import MultiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
//Global Imports End
import ChipsList from '../../../sharedComponents/chips/ChipsList';
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

const CampaignDropdown = (props) => {
    const classes = useStyles();
    const { leagueId } = useContext(AppDataContext);
    const [campaignList, setCampaignList] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState([]);

    useEffect(() => {
        props.getSelectedCampaign(null);
        GetCampaignMediaPlans(leagueId, 0).then(mediaPlans => {
            console.log(mediaPlans);
            let list = mediaPlans.map((item) => {
                return { label: item.planName, value: item.id, year: item.year, campaignOrAdvertiserId: item.campaignOrAdvertiserId, startDate: item.startDate, endDate: item.endDate, marketType: item.marketTypeID}
            });
            if (props.selectedCampaignIdForFilter) {
                var selectedCampaignFiltered = list.filter(x => x.campaignOrAdvertiserId === props.selectedCampaignIdForFilter);
                setSelectedCampaign(selectedCampaignFiltered);
                getPlanDates(selectedCampaignFiltered);
                props.getSelectedCampaign(selectedCampaignFiltered);
            }
            setCampaignList(list);
        }).catch(err => {

        });
    }, [leagueId])

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

    const handleChange = (name, value) => {
        let temp = selectedCampaign.slice();
        let index = temp.findIndex(t => t.value === value.value);
        if (index <= -1) {
            temp.push(value);
            setSelectedCampaign(temp);
        }
        getPlanDates(temp);
        props.getSelectedCampaign(temp);
    }

    const handleDelete = (name, value) => {
        let temp = selectedCampaign.slice();
        let index = temp.findIndex(t => t.label === value);
        temp.splice(index, 1);
        setSelectedCampaign(temp);
        getPlanDates(temp);
        props.getSelectedCampaign(temp);
    }

    return (<Paper>
        <Grid container>
            <Grid item xs={12}>
                <Box sx={{ flexGrow: 1 }} alignItems="center">
                    <Grid container spacing={0} py={1} px={1}>
                        <Grid item md={3}>
                            <FormControl fullWidth size="small" className="dropdown">
                                <MultiSelectDropdown name="campaign" size="small" SMwidth="400" fullWidth lbldropdown="Campaign"
                                    ddData={campaignList.length ? campaignList : []}
                                    handleChange={handleChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={8} className={classes.chips}>
                            {selectedCampaign.length > 0 && <ChipsList name="campaign" size="small" handleDelete={handleDelete} showDelete={true} label="" data={selectedCampaign} />}
                        </Grid>
                        <Grid item md={1}>
                            <Box display="flex" justifyContent="flex-end" flex="1" alignItems="center">
                                <IconButton title="Event Note List View" size="small"
                                    onClick={() => { props.SetView(false); }} color={props.IsCalendarView ? 'primary' : 'secondary'}>
                                    <EventNoteOutlinedIcon />
                                </IconButton>
                                {!props.IsDigitalPlanning && <IconButton title="Event Note Calendar View" size="small"
                                    onClick={() => { props.SetView(true); }} color={props.IsCalendarView ? 'secondary' : 'primary'}>
                                    <CalendarMonthOutlinedIcon />
                                </IconButton>}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    </Paper>

    )
}

CampaignDropdown.displayName = "CampaignDropdown";
export default CampaignDropdown;