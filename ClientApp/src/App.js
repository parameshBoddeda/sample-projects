import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppDataProvider, AppDataConsumer } from './common/AppContext';
import Snackbar from '@material-ui/core/Snackbar';
import ApplicationBar from './sharedComponents/ApplicationBar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LoadingAppUI from './sharedComponents/emptyStateUIContainers/LoadingAppUI';
import GenericMessageUI from './sharedComponents/emptyStateUIContainers/GenericMessageUI';
import useServerPing from './common/useServerPing';
import CustomLogin from './customLogin';
import Routing from './Routing';
import AppDataContext from './common/AppContext';
import { LicenseInfo } from '@mui/x-license-pro';

import './App.css';

const dummyData = require('./static/dummyData.json');

LicenseInfo.setLicenseKey(
    '07b349ac4c13897cf621a89c181d4696T1JERVI6MjgzOTUsRVhQSVJZPTE2NjA5MDYyMTIwMDAsS0VZVkVSU0lPTj0x',
);

const useStyles = makeStyles((theme) => ({

    toolbar: theme.mixins.toolbar,
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        overflow: 'overlay',
        marginLeft: theme.spacing(7),
    },
}));

function App() {
    const { pingSuccess, isUserSessionValid } = useServerPing();
    const classes = useStyles();

    useEffect(() => {
        if (isUserSessionValid) {
            let date = new Date();
            let ts = date.getTime();
            window.location.href = `/?ts=${ts}`;
        }

    }, [isUserSessionValid]);


    function unauthorized() {
        return (
            <GenericMessageUI title="Permission Denied"
                message="You do not have permission to access this space."
                icon={<LockOutlinedIcon />}>
            </GenericMessageUI>
        )
    }

    function isAuthorized(userPermissions) {
        //... Check if the user has got access to the app or not.
        return (!userPermissions || userPermissions.filter(p => p.key === "Auth" && p.value === "HasAccess").length > 0);
    }

    return (

        <ThemeProvider theme={theme}>

            <AppDataProvider>
                <AppDataConsumer>
                    {props => {
                        return (
                            <div className={classes.container}>
                                <Router>
                                    {
                                        (props.isCustomLoginEnabled && props.userPermissions === '') ? <CustomLogin /> :
                                            <>
                                                <ApplicationBar setDateToAppContext={(leagueName, leagueId) => {
                                                    props.setLeagueInfo(leagueName);
                                                    props.setLeagueId(leagueId);
                                                }} selectedValue={"nba"} dropdownData={dummyData.dropdownData} userPermissions={props.userPermissions} />
                                                {
                                                    (!props.userPermissions) ? <LoadingAppUI /> : (isAuthorized(props.userPermissions) ? <Routing />: unauthorized()) 
                                                }
                                            </>
                                    }
                                </Router>
                                <Snackbar
                                    open={!pingSuccess}
                                    ContentProps={{
                                        'aria-describedby': 'check-network',
                                    }}
                                    message={<span id="check-network">Oops! It seems that we can't reach to the server right now.</span>}
                                />
                            </div>
                        )
                    }
                    }
                </AppDataConsumer>
            </AppDataProvider>
        </ThemeProvider>
    );
}

export default App;

const theme = createTheme({
    palette: {
        primary: {
            main: '#1D428A',
        },
        secondary: {
            main: '#c70f2c',
        },
    },
});