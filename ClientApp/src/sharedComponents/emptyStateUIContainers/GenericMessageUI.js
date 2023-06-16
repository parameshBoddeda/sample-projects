import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
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
        color: "#8c9dc4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10rem !important",
        marginBottom: "25px",
        "& svg": {
            fontSize: "10rem",
        }
    },
    subtext: {
        marginTop: "5px",
        width: "250px",
        textAlign: "center",
    },
}));
const GenericMessageUI = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.icon}>
                {props.icon}
            </div>

            <Typography variant="h6">{props.title}</Typography>
            <Typography variant="body1" className={classes.subtext}>{props.message}</Typography>

        </div>
    )
}

export default GenericMessageUI;