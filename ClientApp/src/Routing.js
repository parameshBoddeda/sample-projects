import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import RouteConstants from './common/RouteConstants';
import PageNotFoundUI from './sharedComponents/emptyStateUIContainers/PageNotFoundUI';
import DashboardContainer from './screens/dashboard/DashboardContainer';
import DemoContainer from './screens/demo/DemoContainer';
import ProgrammingContainer from './screens/Programming/ProgrammingContainer';

import GenericMessageUI from './sharedComponents/emptyStateUIContainers/GenericMessageUI';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import InventoryContainer from './screens/Inventory/InventoryContainer';
import MediaContainer from './screens/MediaPlanning/MediaContainer';
import MediaPlanContainer from './screens/MediaManagement/MediaPlanContainer';
//import { InventoryDataProvider, InventoryDataConsumer } from './context/InventoryContext';
import { RateDataProvider } from './context/RateDataContext'
import RateCardContainer from './screens/RateCard/RateCardContainer';
import Seasons from './screens/Administration/Season';
import CampaignContainer from './screens/Campaign/CampaignContainer';
import MediaPlanningContainer from './screens/MediaPlanning/MediaPlanningContainer';
import ISCIcontainer from './screens/ManageISCI/ISCIcontainer';
import ReportsContainer from './screens/Reports/ReportsContainer';
// import PlanSchedulesContainer from './screens/MediaPlanning/CopyPlanSchedules/PlanSchedulesContainer';
import CopyPlanSchedulesContainer from './screens/MediaPlanning/CopyPlanSchedules/CopyPlanSchedulesContainer';
import DigitalTraffickingContainer from './screens/DigitalTrafficking/DigitalTraffickingContainer';
import ReconciliationContainer from './screens/Reconciliation/ReconciliationContainer';
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

const Routing = (props) => {
    const classes = useStyles();

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

        <div className={classes.container}>
            <div className={classes.toolbar} />
            <div className={classes.content}>

                <Switch>
                    <Route exact path={RouteConstants.HOME}>
                        {isAuthorized(props.userPermissions) ? <DashboardContainer /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.TRAFFICKING}>
                        {isAuthorized(props.userPermissions) ? <ProgrammingContainer page="scheduling" /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.DIGITALTRAFFICKING}>
                        {isAuthorized(props.userPermissions) ? <DigitalTraffickingContainer page="digitalTrafficking" /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.LINEAR_INVENTORY}>
                        {isAuthorized(props.userPermissions) ? (
                                <InventoryContainer page="inventory" />
                        )
                            : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.RATE_CARD}>
                        {isAuthorized(props.userPermissions) ? (
                            <RateDataProvider>
                                <RateCardContainer page="ratecard" />
                            </RateDataProvider>

                        )
                            : unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.DEALS}>
                        {isAuthorized(props.userPermissions) ?
                            <MediaContainer page="media" />
                            : unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.MEDIAPLANS}>
                        {isAuthorized(props.userPermissions) ?
                            <MediaPlanContainer page="mediaPlan" />
                            : unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.MEDIAPLANNING}>
                        {isAuthorized(props.userPermissions) ? <MediaPlanningContainer page="mediaplanning" /> : unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.CAMPAIGNPLANNING}>
                        {isAuthorized(props.userPermissions) ?
                            <CampaignContainer page="media" />
                            : unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.MANAGE_ISCI}>
                        {isAuthorized(props.userPermissions) ?<ISCIcontainer page="ISCI" />: unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.REPORTS}>
                        {isAuthorized(props.userPermissions) ? <ReportsContainer /> : unauthorized()}
                    </Route>

                    <Route exact path={RouteConstants.Demo}>
                        {isAuthorized(props.userPermissions) ? <DemoContainer /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.SEASON}>
                        {isAuthorized(props.userPermissions) ? <Seasons /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.ACCESS_DENIED}>
                        {isAuthorized(props.userPermissions) ? <Redirect path="/" to="/" /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.PLAN_SCHEDULES}>
                        {isAuthorized(props.userPermissions) ? <CopyPlanSchedulesContainer page="copyPlanSchedules" /> : unauthorized()}
                    </Route>
                    <Route exact path={RouteConstants.RECONCILIATION}>
                        {isAuthorized(props.userPermissions) ? <ReconciliationContainer page="Reconciliation" /> : unauthorized()}
                    </Route>

                    <Route exact path='*'>
                        <PageNotFoundUI />
                    </Route>
                </Switch>

            </div>
        </div>
    )
}

export default Routing;