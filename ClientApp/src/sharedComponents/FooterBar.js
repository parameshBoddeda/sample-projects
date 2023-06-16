import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AppDataContext from '../common/AppContext';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '5px',
        display: 'flex',
    },
    copyright: {
        marginLeft: 'auto'
    }

}));


const FooterBar = () => {
    const classes = useStyles();

    const {
        applicationVersion
    } = useContext(AppDataContext);

    return (

        <Paper elevation={6} className={classes.root}>
            <Typography variant="caption">Version: {applicationVersion}</Typography>
            <Typography variant="caption" className={classes.copyright}>© 2021 NBA Properties, Inc. All rights reserved.</Typography>
        </Paper>

    )
}

export default FooterBar;