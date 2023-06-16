//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Paper, Box, Checkbox, FormControlLabel } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import { Typography } from '@mui/material';
import { toast } from "react-toastify";
import * as AppLanguage from '../../../common/AppLanguage';
//Global Imports End

//Regional Imports Start
import DateRangePicker from '../../PickDateRange/PickDateRange';
import AppDataContext from '../../../common/AppContext';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import MultiSelectDropdown from "../../../sharedComponents/Dropdown/MulltiSelectDropdown";
//Regional Imports End

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
        '& li': {
            marginBottom: theme.spacing(.25),
        },
    },
    relativeposistion: {
        position: 'relative',
    },
    CheckboxPadding: {
        padding: theme.spacing(.5) + 'px !important',
    },
}));

function notifyWarning(msg) { toast.warning(msg) }

const DayDropDown = (props) => {
    const classes = useStyles();
    const { WeekDays } = useContext(AppDataContext);
    const [daysList, setDayList] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [chkSales, setChkSales] = useState(props.IsCampaignPlanning ? true : false);
    const [chkUnfilled, setChkUnfilled] = useState(false);

    useEffect(() => {
        if (WeekDays && WeekDays.length > 0) {
            let list = WeekDays.map((item) => {
                return { label: item.lookupText, value: item.lookupId }
            });
            setDayList(list);
        }
    }, [WeekDays]);

    const handleChange = (name, value) => {
        let temp = selectedDays.slice();
        let index = temp.findIndex(t => t.value === value.value);
        if (index <= -1) {
            temp.push(value);
            setSelectedDays(temp);
        }

        props.onSelectionChange(temp, chkSales, chkUnfilled);
    }

    const handleDelete = (name, value) => {
        let temp = selectedDays.slice();
        let index = temp.findIndex(t => t.value === value);
        temp.splice(index, 1);
        setSelectedDays(temp);
        //props.getSelectedDaysData(temp);
        props.onSelectionChange(temp, chkSales, chkUnfilled);
    }

    const inCludeSalesChkChange = () => {
        setChkSales(!chkSales);
        //props.IncludeSalesChange(!chkSales, chkUnfilled);
        props.onSelectionChange(selectedDays, !chkSales, chkUnfilled);
    }

    const showUnfilledChkChange = () => {
        setChkUnfilled(!chkUnfilled);
        //props.ShowUnfilledChange(chkSales, !chkUnfilled);
        props.onSelectionChange(selectedDays, chkSales, !chkUnfilled);
    }

    const handleStartDateChange = (val)=>{
        if (new Date(props.minStartDate) > new Date(val))
        {
            notifyWarning(AppLanguage.APP_MESSAGE.Start_Date_Validation);
            props.ChangeStartDate(props.startDate);
        }
        else
            props.ChangeStartDate(val);
    }

    const handleEndDateChange = (val) => {
        if (new Date(props.maxEndDate) < new Date(val))
        {
            notifyWarning(AppLanguage.APP_MESSAGE.End_Date_Validation);
            props.ChangeEndDate(props.endDate);
        }
        else
            props.ChangeEndDate(val);
    }

    return (<Paper className={classes.relativeposistion}>
        <Box display="flex" flex="1" justifyItems="center">
            <Grid container spacing={1} pt={1} pb={1} px={1}>
                <Grid item lg={4.5} md={3.7}>
                    <DateRangePicker startDateLabel={'Start Date*'}
                        endDateLabel={'End Date*'} disablePast={false}
                        startDate={props.startDate}
                        endDate={props.endDate} setStartDate={handleStartDateChange}
                        setEndDate={handleEndDateChange} />
                </Grid>
                <Grid item lg={1.7} md={1.5}>
                    <FormControl fullWidth size="small" className="dropdown">
                        <MultiSelectDropdown name="Days" size="small" SMwidth="400" fullWidth lbldropdown="Day(s)"
                            ddData={daysList.length ? daysList : []}
                            handleChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item md={3.7} className={classes.chips}>
                    {selectedDays.length > 0 && <ChipsList name="campaign" size="small" handleDelete={handleDelete}
                        showDelete={true} label="" data={selectedDays} />}
                </Grid>
                <Grid item md={2}>
                    <Box display="block" alignItems="center">
                        {props.IsCampaignPlanning  && <FormControlLabel size="small"
                            control={
                                <Checkbox
                                    className={classes.CheckboxPadding}
                                    name="chkSales"
                                    checked={chkSales}
                                    onChange={(e) => inCludeSalesChkChange()}
                                    size="small"
                                />
                            }
                            label={<Typography noWrap variant="caption">{props.IsCampaignPlanning ? 'Include Sales' : 'Include Campaign'}</Typography>}
                        />}

                        <FormControlLabel size="small"
                            control={
                                <Checkbox
                                    className={classes.CheckboxPadding}
                                    size="small"
                                    name="chkUnfilled"
                                    checked={chkUnfilled}
                                    onChange={(e) => showUnfilledChkChange()}
                                />
                            }
                            label={<Typography noWrap variant="caption">Show Only Unfilled</Typography>}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Paper>

    )
}

DayDropDown.displayName = "DayDropDown";
export default DayDropDown;