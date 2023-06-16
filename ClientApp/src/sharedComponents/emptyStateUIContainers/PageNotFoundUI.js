import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import BrokenImageTwoToneIcon from '@material-ui/icons/BrokenImageTwoTone';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        alignSelf: 'center',
        width: '100%',
        minHeight: '100%'
    },
    icon: {
        color: '#8c9dc4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: "10rem",
        marginBottom: '25px'
    },
    subtext: {
        marginTop: '5px',
        width: '250px',
        textAlign: 'center'
    },
    fab: {
        margin: '8px'
    }
}));

const PageNotFoundUI = (props) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BrokenImageTwoToneIcon className={classes.icon} />

            <Typography variant="h6">Oops!</Typography>
            <Typography variant="body1" className={classes.subtext}>We can't seem to find the page you're looking for.</Typography>
        </div>
    )
}

export default withRouter(PageNotFoundUI);