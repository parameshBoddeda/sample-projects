import React, { useState, useEffect } from "react";

import { GetConfigs, GetAppDetails } from "../services/auth.service";
import APIHelper from "../common/ApiHelper"
import APIURLConstants from "../common/ApiURLConstants";
//import { GetAllLookupDetails } from "../services/common.service";

//import Helper from "./Helper";

export const AppDataContext = React.createContext({

});

export const AppDataProvider = (props) => {
    const [applicationVersion, setApplicationVersion] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [userCountry, setUserCountry] = useState('');
    const [signoutURL, setSignoutURL] = useState('');
    const [userPermissions, setUserPermissions] = useState('');
    const [userClaims, setUserClaims] = useState('');
    const [leagueInfo, setLeagueInfo] = useState('NBA');
    
    const [userProfile, setUserProfile] = useState('');

    const [isADEnabled, setISADEnabled] = useState(true);
    const [isASMSEnabled, setISASMSEnabled] = useState(true);

    const setUserDetails = (data) => {
        //debugger;
        if (!isADEnabled) {
            setApplicationVersion(data.applicationVersion);
            setUsername(data.userName);
            setUserRole(data.userRole);
            setUserId(data.userId);
            setUserCountry(data.userCountry);
            setUserClaims(data.userClaims);

            setUserPermissions(data.userPermissions);

            setSignoutURL(data.signoutURL);
            // console.log("user");
            // console.log(JSON.stringify(data.userPermissions))
            // sessionStorage.setItem("userPermissions", JSON.stringify(data.userPermissions));
        }
    }

    const getAppDetails = () => {

        GetAppDetails()
            .then(data => {
                //debugger;
                setApplicationVersion(data.applicationVersion);
                setUsername(data.userName);
                setUserRole(data.userRole);
                setUserId(data.userId);
                setUserCountry(data.userCountry);
                setUserPermissions(data.userPermissions);
                setUserClaims(data.userClaims);
                setSignoutURL(data.signoutURL);

            })
            .catch(err => { throw err; })
    }

    const getConfigs = () => {
        GetConfigs().then(data => {
            //debugger;
            setISADEnabled(data.ad);
            setISASMSEnabled(data.asms);
            if (data.ad) {
                getAppDetails();
            }
        });
    }

    useEffect(() => {
        //getAppDetails();
        getConfigs();
    }, []);

    useEffect(() => {

    }, [isADEnabled])

    const providerValue = {
        isADEnabled,
        isASMSEnabled,
        applicationVersion,
        username,
        userId,
        userRole,
        userCountry,
        signoutURL,
        userPermissions,
        userClaims,
        leagueInfo,
        setLeagueInfo: (data) => {setLeagueInfo(data)},
        setUserDetails: (data) => { setUserDetails(data) }
    };

    return (
        <AppDataContext.Provider value={providerValue}>
            {props.children}
        </AppDataContext.Provider>
    );
};

export const AppDataConsumer = AppDataContext.Consumer;

export default AppDataContext;
