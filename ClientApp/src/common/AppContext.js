import React, { useState, useEffect } from "react";

import { GetConfigs, GetAppDetails } from "../services/auth.service";
import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";
import * as CommonService from "../services/common.service";
import { GetFrequencies, GetDays, GetEpisodesList} from '../services/inventory.service';
import { LOOKUP_VALUE } from '../common/AppConstants';

import Helper from "./Helper";

export const AppDataContext = React.createContext({

});

export const AppDataProvider = (props) => {
    const [applicationVersion, setApplicationVersion] = useState('');
    const [userDisplayName, setUserDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [picData, setPicData] = useState(null);
    const [userCountry, setUserCountry] = useState('');
    const [signoutURL, setSignoutURL] = useState('');
    const [userPermissions, setUserPermissions] = useState('');
    const [userClaims, setUserClaims] = useState('');
    const [leagueInfo, setLeagueInfo] = useState('NBA');
    const [leagueId, setLeagueId] = useState(1);
    const [userProfile, setUserProfile] = useState('');
    const [environment, setEnvironment] = useState('');
    const [Leagues, setLeagues] = useState([]);
    const [Regions, setRegions] = useState([]);
    const [CurrentSeasons, setCurrentSeasons] = useState([]);
    const [sharePointDocDriveID, setSharePointDocDriveID] = useState('');

    const [ProgrammeStatus, setProgrammeStatus] = useState([]);
    const [PlanningStatus, setPlanningStatus] = useState([]);
    const [BillType, setBillType] = useState([]);
    const [BillBy, setBillBy] = useState([]);
    const [FilterPreference, setFilterPreference] = useState([]);
    const [ColumnPreference, setColumnPreference] = useState([]);
    const [UploadStatus, setUploadStatus] = useState([]);
    const [PartnerTypes, setPartnerTypes] = useState([]);
    const [InventoryStatus, setInventoryStatus] = useState([]);
    const [DistributionType, setDistributionType] = useState([]);
    const [ScheduleStatus, setScheduleStatus] = useState([]);
    const [InventoryActionType, setInventoryActionType] = useState([]);
    const [RateType, setRateType] = useState([]);
    const [Venturized, setVenturized] = useState([]);
    const [MarketType, setMarketType] = useState([]);
    const [MediaPlanStatus, setMediaPlanStatus] = useState([]);
    const [DayPartList, setDayPart] = useState([]);
    const [WeekDays, setWeekDays] = useState([]);
    const [DistributionRules, setDistributionRules] = useState([]);
    const [ScheduleAdUnitStatus, setScheduleAdUnitStatus] = useState([]);
    const [DigitalPlacement, setDigitalPlacement] = useState([]);
    const [DemographicList, setDemoGraphic] = useState([]);
    const [moduleNames,setModuleNames] = useState([])

    const [isADEnabled, setISADEnabled] = useState(true);
    const [isASMSEnabled, setISASMSEnabled] = useState(true);
    const [isCustomLoginEnabled, setIsCustomLoginEnabled] = useState(false);
    const [costTypeData, setCostType] = useState([]);
    const [unitTypeData, setUnitType] = useState([]);

    const [frequencyData, setFrequencyData] = useState([]);
    const [daysListData, setDaysListData] = useState([]);    
    const [episodesData, setEpisodesData] =useState([]); 

    const getLookupDetails = ()=>{
        CommonService.GetLookups().then((data) => {
            let finalData = data.map((lookup) =>{
                return { ...lookup, label: lookup.lookupText, value: lookup.lookupId }
            });

            let programmeStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Programming_Status });
            let planningStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Planning_Status });
            let billType = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Bill_Type });
            let filterPreference = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Filter_Preference });
            let billBy = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Bill_By });
            let columnPreference = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Column_Preference });
            let uploadStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Upload_Status });
            let partnerTypes = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.PartnerType });
            let inventoryStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Inventory_Status });
            let distributionType = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Distribution_Type });
            let scheduleStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Schedule_Status });
            let inventoryActionType = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Inventory_Action_Type });
            let rateType = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Rate_Type });
            let venturized = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Venturized });
            let marketType = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Market_Type });
            let mediaPlanStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Media_Plan_Status });
            let weeksDays = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Days_of_Week });
            let distributionRuleType = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Distribution_Rule_Type });
            let scheduleAdUnitStatus = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Schedule_Ad_Unit_Status });
            let dayPartList = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Day_Part });
            let digitalPlacement = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Digital_Placement });
            let demographic = finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Demography_Type });
            let modules =  finalData.filter(function (x) { return x.lookupParentId === LOOKUP_VALUE.Module_Names });

            setProgrammeStatus(programmeStatus);
            setPlanningStatus(planningStatus);
            setBillType(billType);
            setFilterPreference(filterPreference);
            setBillBy(billBy);
            setColumnPreference(columnPreference);
            setUploadStatus(uploadStatus);
            setPartnerTypes(partnerTypes);
            setInventoryStatus(inventoryStatus);
            setDistributionType(distributionType);
            setScheduleStatus(scheduleStatus);
            setInventoryActionType(inventoryActionType);
            setRateType(rateType);
            setVenturized(venturized);
            setMarketType(marketType);
            setMediaPlanStatus(mediaPlanStatus);
            setWeekDays(weeksDays);
            setDistributionRules(distributionRuleType);
            setScheduleAdUnitStatus(scheduleAdUnitStatus);
            setDayPart(dayPartList);
            setDigitalPlacement(digitalPlacement);
            setDemoGraphic(demographic);
            setModuleNames(modules)
        }).catch(err =>{
            console.log(err);
        })
    }

    const getLeagues = () => {
        CommonService.GetLeagues().then((data) => {
            setLeagues(data);
        }).catch(err =>
            console.log(err)
        )
    }

    const getRegions = () => {
        CommonService.GetRegions().then((data) => {
            setRegions(data);
        }).catch(err =>
            console.log(err)
        )
    }

    const getcurrentSeason = () => {
        CommonService.GetCurrentSeasonsInfo().then((data) => {
            setCurrentSeasons(data);
        }).catch(err =>
            console.log(err)
        )
    }

    const setUserDetails = (data) => {
        //debugger;
        if (isCustomLoginEnabled) {
            setApplicationVersion(data.applicationVersion);
            setUsername(data.userId);
            setUserDisplayName(data.userName);
            setUserRole(data.userRole);
            setUserId(data.userId);
            setUserCountry(data.userCountry);
            setUserClaims(data.userClaims);
            setEnvironment(data.environment);

            setUserPermissions(data.userPermissions);
            setSharePointDocDriveID(data.sharePointDocumentDrive);
            setSignoutURL(data.signoutURL);
            getLookupDetails();
            getLeagues();
            getRegions();
            getcurrentSeason();
            getCostTypes();
            getUnitTypes();
            getDays();
            getFrequencies();
            getEpisodes();
        }
    }

    const getCostTypes = () => {
        CommonService.GetCostTypes().then((data) => {
            let costData = [];
            if (data)
                data.map(item => {
                    costData.push({ label: item.costTypeName, value: item.id });
                });
            setCostType(costData);
        }).catch(err => console.log(err))
    }
    const getUnitTypes = () => {
        CommonService.GetUnitTypes(-1).then((data) => {
            let unitData = [];
            data.map(item => {
                unitData.push({ label: item.unitTypeName, value: item.id, mediaTypeId: item.mediaTypeId });
            });
            setUnitType(unitData);
        }).catch(err => console.log(err))
    }

    const getDays = () => {
        GetDays().then(dayData => {
            let days = [];
            dayData.map(day => {
                days.push({ label: day.dayName, value: day.dayId });
            });
            setDaysListData(days);
        }).catch(err => {
            return [];
        });
    }

    const getEpisodes = () => {
        GetEpisodesList().then((resp) => {
            let episodes = resp.map((item) => item.episodeName);
            setEpisodesData(episodes);
        });
    }

    const getFrequencies = () => {
        GetFrequencies().then(frequencyData => {
            let frequency = [];
            frequencyData.map(frequencyEle => {
                frequency.push({ label: frequencyEle.frequencyName, value: frequencyEle.frequencyId });
            });
            setFrequencyData(frequency);
        }).catch(err => {
            return [];
        });
    }

    const getAppDetails = () => {

        GetAppDetails()
            .then(data => {
                //debugger;
                setApplicationVersion(data.applicationVersion);
                setEnvironment(data.environment);
                setUsername(data.userId);
                setUserDisplayName(data.userName);
                setUserRole(data.userRole);
                setUserId(data.userId);
                setUserCountry(data.userCountry);
                setUserPermissions(data.userPermissions);
                setUserClaims(data.userClaims);
                setSignoutURL(data.signoutURL);
                setSharePointDocDriveID(data.sharePointDocumentDrive);
                getLookupDetails();
                getLeagues();
                getRegions();
                getcurrentSeason();
                getCostTypes();
                getUnitTypes();
                getDays();
                getFrequencies();
                getEpisodes();
            })
            .catch(err => { 
                //throw err; 
                setUserPermissions('NoAccess');
            })
    }

    const getConfigs = () => {
        GetConfigs().then(data => {
            //debugger;
            setISADEnabled(data.ad);
            setISASMSEnabled(data.asms);
            setIsCustomLoginEnabled(data.isCustomLoginEnabled);
            if (data.ad && !data.isCustomLoginEnabled) {
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
        isCustomLoginEnabled,
        applicationVersion,
        environment,
        username,
        userDisplayName,
        userId,
        picData,
        userRole,
        userCountry,
        signoutURL,
        userPermissions,
        userClaims,
        sharePointDocDriveID,
        leagueInfo,
        leagueId,
        Leagues,
        Regions,
        CurrentSeasons,
        ProgrammeStatus,
        PlanningStatus,
        BillType,
        FilterPreference,
        BillBy,
        ColumnPreference,
        PartnerTypes,
        InventoryStatus,
        DistributionType,
        UploadStatus,
        ScheduleStatus,
        InventoryActionType,
        RateType,
        Venturized,
        MarketType,
        MediaPlanStatus,
        WeekDays,
        DistributionRules,
        ScheduleAdUnitStatus,
        DayPartList,
        DemographicList,
        moduleNames,
        DigitalPlacement,
        unitTypeData,
        costTypeData,
        frequencyData,
        daysListData,
        episodesData,
        setLeagueId: (leagueId) => { setLeagueId(leagueId) },
        setLeagueInfo: (data) => { setLeagueInfo(data) },
        setUserDetails: (data) => { setUserDetails(data) },
        setPic: (data) => { setPicData(data) }
    };

    return (
        <AppDataContext.Provider value={providerValue}>
            {props.children}
        </AppDataContext.Provider>
    );
};

export const AppDataConsumer = AppDataContext.Consumer;

export default AppDataContext;
