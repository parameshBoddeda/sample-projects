import React from 'react';
import { Grid, Box, Container, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Helper from '../../../common/Helper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    
    content: {
        height: 'calc(100vh - 158px)',
        overflowY: 'auto',
      },
  }));

const TraffickStatusUI = (props) => {
    const classes = useStyles();
    return (
        <>
            {props.data && props.data.length > 0 &&

                <>
                    <Box display="flex">

                        <Grid container>

                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="subtitle2" color={"primary"}>Schedule list validation</Typography>
                                <IconButton size="small" onClick={props.handleClose}>
                                    <CloseIcon />
                                </IconButton>
                                </Box>                                
                            </Grid>
                            <Divider sx={{ width: '100%' }} />

                            <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                                <Typography variant="subtitle2" color={"primary"}>Following schedules are not ready for trafficking.</Typography>
                                </Box> 

                            <Grid item xs={12}>
                                <Box p={1} mr={.25}>
                                <Grid container alignItems="center" >
                                    <Grid item xs={2}>
                                        <Typography variant="subtitle2">Schedule Id</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="subtitle2">Episode Name</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography variant="subtitle2">EstDate</Typography>
                                    </Grid>
                                </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box className={classes.content} px={1} mr={.25}>
                                {props.data.map((ele, index) => {
                                    return (
                                        <>
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item xs={2}>
                                                    <Typography noWrap title={ele.ScheduleId} variant="body1">{ele.ScheduleId}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography noWrap title={ele.EpisodeName} variant="body1">{ele.EpisodeName}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography noWrap title={Helper.FormatDate(ele.EstDate)} variant="body1">{Helper.FormatDate(ele.EstDate)}</Typography>
                                                </Grid>

                                            </Grid>
                                        </>
                                    )
                                })

                                }
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            }
        </>
    )
}

TraffickStatusUI.displayName = "TraffickStatusUI";
export default TraffickStatusUI;