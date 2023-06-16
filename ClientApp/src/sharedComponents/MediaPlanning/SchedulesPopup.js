//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button, Paper, Grid, Typography, Divider, TextField, Checkbox, Popover } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';

//Global Imports End
import Helper from '../../common/Helper';

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
    Popover: {
        "& .MuiPopover-paper": {
            minWidth: '240px',
            maxWidth: '280px'
        }
    }
}));


const SchedulesPopup = (props) => {
    const classes = useStyles();
    
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        let sortedData = props.schedules.sort((a, b) => (a.estDate > b.estDate) ? 1 : -1);
        setSchedules(sortedData);
    }, [props.schedules]);

    const handleClose = () => {
        props.handleClose();
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Popover className={classes.Popover}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Grid container my={2}>
                    <Grid className={``} key={`ConfigGridPopupReadOnly`} item xs={12}>
                        <Box style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                            <div>
                                <Grid container alignItems="center">
                                    {schedules.length > 0 && schedules.map(function (schedule, k) {
                                        return (<>
                                            {k != 0 && <Divider sx={{ width: '100%' }} />}
                                            <Grid  key={k} item xs={12}>
                                                <Grid container>
                                                    <Grid item xs={5}>
                                                        <Box display="flex" flexDirection="column">
                                                            <Box component="div">
                                                                <Typography variant="caption">Episode</Typography>
                                                            </Box>
                                                            <Box component="div" >
                                                                <Typography variant="subtitle2">{schedule.episodeName}</Typography>
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
                                                                <Typography variant="caption">Available</Typography>
                                                            </Box>
                                                            <Box component="div" display='flex' alignItems="center">
                                                                <Typography variant="subtitle2">
                                                                    {schedule.availableUnits}
                                                                </Typography>
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
                    <Grid className={``} key={`ScheduleListPopupBtns`} item xs={12} pb={1} pt={1}>
                        <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                            <Button onClick={handleClose} color="secondary">{'Cancel'}</Button>
                        </Box>
                    </Grid >
                </Grid>
            </Popover>
        </Container>
    )
}

SchedulesPopup.displayName = "SchedulesPopup";
export default SchedulesPopup;