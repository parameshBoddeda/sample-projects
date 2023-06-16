import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        alignSelf: 'center',
        width: '100%',
        height: '100vh'
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
    progress: {
        margin: theme.spacing(2)
    }
}));

const LoadingAppUI = (props) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {
                props.circular &&

                <div id="noDataUIIcon" className={classes.icon}>
                    <CircularProgress className={classes.progress} color="secondary" />
                </div>
            }

            <Typography variant="h6">Loading</Typography>
            {
                !props.circular &&

                <div style={{ width: "100px" }}>
                    <LinearProgress className={classes.progress} color="secondary" />
                </div>
            }
        </div>
    )
}

export default LoadingAppUI;