import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Container, Grid, Typography } from '@mui/material';
import AppDataContext from '../../../common/AppContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import { deepPurple } from '@mui/material/colors';
import * as AppConstants from '../../../common/AppConstants';
import BuildSchedule from './BuildSchedule';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    applicationBar: {
        background: '#ffffff',
        color: '#677790',
        [theme.breakpoints.down('xs')]: {
            paddingTop: theme.spacing(1),
        },
        '& > div': {
            [theme.breakpoints.down('xs')]: {
                display: 'flex',
                flexDirection: 'column',
            },
        },
        '& h6': {
            flex: '1',
            [theme.breakpoints.down('xs')]: {
                display: 'flex',
                flexDirection: 'row'
            },
            '& button': {
                [theme.breakpoints.down('xs')]: {
                    padding: theme.spacing(.75, .5)
                },
            },
        },
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        '& button': {
            marginLeft: 'unset',
            color: '#677790'
        },
    },
    content: {
        flexGrow: 1,
        overflow: 'overlay',
    },
    toolbar: theme.mixins.toolbar,

    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '30ch',
        '& .MuiOutlinedInput-input': {
            padding: theme.spacing(1, 1.75)
        },
        '& .MuiInputBase-root': {
            color: '#bfbfbf',
        },
    },
    mainContainer: {
        paddingTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(2.5),
        borderRadius: theme.spacing(1.25),
        marginTop: theme.spacing(4),
    },

    loaderPlaceholder: {
        height: 40,
        textAlign: 'center'
    },
}));

const drawerWidth = 54;

const BuildScheduleContainer = (props) => {
    const classes = useStyles();
    const { userPermissions } = useContext(AppDataContext);
    const [reload, setReload] = React.useState(false);

    const checkRole = (permissionType) => {
        let result = (!userPermissions ||
            userPermissions.filter(p => p.key === "Role" && p.value === permissionType).length > 0);
        return result;
    }


    return (

        <>
            <div className={classes.root}>
                <CssBaseline />

                <div className={classes.content}>
                    <AppBar position="static" className={classes.applicationBar} elevation={1}>
                        <Toolbar>
                            <Typography variant="h6" component="h6">Build Schedule</Typography>
                        </Toolbar>
                    </AppBar>
                    <Container className={classes.mainContainer} maxWidth="false">
                        <BuildSchedule />
                    </Container>
                </div>
            </div>

        </>
    );
}

export default BuildScheduleContainer;