import React, { useState, useContext } from "react";
import { Grid, Paper, Typography, Container, Box } from '@mui/material';
import AppDataContext from '../../common/AppContext';
import { makeStyles } from '@material-ui/core/styles';

import SubHeader from '../../sharedComponents/SubHeader/SubHeader'
import ProfileAvatar from "../../sharedComponents/ProfilePic/ProfileAvatar";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
    },
    contentHeight: {
        height : 'calc(100vh - 128px)',
        overflowY: 'auto',
    },
}));

const DashboardContainer = (props) => {
    const classes = useStyles();
    const { userPermissions, userDisplayName } = useContext(AppDataContext);

    const GetUserRoles = () => {
        let result = (!userPermissions ? '' : userPermissions.filter(p => p.key === "Role").map(x => x.value).shift());
        let roles = JSON.parse(result).map(x => x.RoleDesc);
        return roles;
    }

    const getUserName = (name)=>{
        if(name){
            let flName = name.split(',');
            return flName[1] + ' ' + flName[0];
        }
    }

    return (
        <React.Fragment>
            <SubHeader headerText="DASHBOARD"></SubHeader>
            <Container maxWidth={false} disableGutters className={classes.container} >
                <Paper elevation={0} className={classes.contentHeight}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} pl={2} pt={1}>
                            <Typography variant="h6" >Welcome {getUserName(userDisplayName)}</Typography> {/* Remove this once content is ready */}        
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} pl={2} pt={1}>
                            <ProfileAvatar />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} pl={2} pt={1}>
                            {
                                (GetUserRoles() !== "") && <>
                                    <Typography variant="subtitle2">Assigned Role(s): </Typography>
                                    {
                                        GetUserRoles().map((row, index) => {
                                            return (
                                                <Typography key={row.trim()+index} variant="subtitle2">{row.trim()}</Typography>
                                            )
                                        })
                                    }

                                </>
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} pl={2} pt={1}>
                            <Typography variant="body2">More content goes here</Typography> {/* Remove this once content is ready */}
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </React.Fragment>
    )
}

export default DashboardContainer;