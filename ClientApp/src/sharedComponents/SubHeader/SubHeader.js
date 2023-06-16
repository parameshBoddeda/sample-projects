import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    appbarBackground: {
        background: '#FFF !important',
        color: '#394150 !important',
        '& .MuiToolbar-root': {
            maxHeight: theme.spacing(6),
            minHeight: theme.spacing(6),
        },
    },
    title: {
        flex: '1',
    },
    headerText: {
        marginRight: theme.spacing(2) + 'px !important',
    },
}));

const SubHeader = (props) => {
    const classes = useStyles();
    const [showFilterPopup, setShowFilterPopup] = React.useState(false);
    const [showSavedSearchPopup, setShowSavedSearchPopup] = React.useState(false);


    const buttonClicked = () => {
        setShowSavedSearchPopup(true);
    }

    const SavedSearchPopupClose = () => {
        setShowSavedSearchPopup(false);
    }

    const handleFilterClick = () => {
        setShowFilterPopup(true);
    }

    const handleFilterPopupClose = () => {
        setShowFilterPopup(false);
    }

    return (
        <>
            <AppBar position="static" className={classes.appbarBackground}>
                <Toolbar>
                    <Box display="flex" alignItems="center" className={classes.title}>
                        <Typography variant="subtitle2" className={classes.headerText}>{props.headerText ? props.headerText : ''}</Typography>
                        <Typography variant="caption" className={classes.dateContainer}>
                            {props.startDate ? props.startDate : ''}{props.endDate ? ` - ${props.endDate}` : ''}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        { props.children}
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}

SubHeader.displayName = "SubHeaderComponent";
export default SubHeader;