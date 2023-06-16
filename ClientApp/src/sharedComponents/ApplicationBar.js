import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerNav from './NavBar/DrawerNav';
import * as AppConstants from '../common/AppConstants';
import NBALogo from './nbaLogo/NBALogo';
import UserMenu from './UserMenu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SelectDropdown from './SelectDropdown/SelectDropDown';
import { IconButton } from '@mui/material';
import AppDataContext from "../common/AppContext";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const useStyles = makeStyles(theme => ({
    applicationBar: {
        background: '#06255B !important',
        '& .MuiToolbar-root': {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    },
    title: {
        flexGrow: 1,
    },
    appVersion: {
        marginLeft: theme.spacing(2),
        fontSize: '10px'
    },
    headerDropdown: {
        background: '#ffffff',
        marginRight: theme.spacing(1) + 'px !important',
        '& .MuiInputBase-root': {
            borderRadius: theme.spacing(0),
            '& .MuiSelect-select': {
                fontFamily: '"Action NBA  Web"',
                lineHeight: 1,
                minHeight: '0.95em',
                fontSize: '2.8rem',
                paddingTop: theme.spacing(1.25),
                paddingBottom: theme.spacing(1.25),
            },
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
            },
        },
    },
}));


const ApplicationBar = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState();
    const [opensubmenu, setOpenSubMenu] = React.useState(true);
    const [leagueData, setLeagueData] = useState([]);
    const [selectedValue, setSelectedValue] = useState(1);
    const [resetLeftNav, setResetLeftNav] = useState(false);
    const { Leagues, environment } = useContext(AppDataContext);

    const handleSubMenuClick = () => {
        setOpenSubMenu(!opensubmenu);
    };

    const handleChange = (value) => {
        setSelectedValue(value);
        let selectedObj = leagueData.filter(ele => ele.value === value);
        props.setDateToAppContext(selectedObj[0].label, selectedObj[0].value);
        history.push({ pathname: '/' });        
        setResetLeftNav(true);

        setTimeout(function () {
            setResetLeftNav(false);
        }, [2000]);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = (val) => {
        setOpen(val);
    };

    useEffect(() => {
        if (Leagues) {
            let leagueData = [];
            Leagues.map(item => {
                leagueData.push({ label: item.leagueName, value: item.id });
            });
            setLeagueData(leagueData);
        }
    }, [Leagues]);

    const getEnvTextColor = ()=>{
        if (environment === 'Development' || environment === 'Dev') return 'aqua';
        if (environment === 'QA') return 'yellow';
        if (environment === 'UAT' || environment === 'Staging' || environment === 'STG') return 'orange';
        if (environment === 'Local') return 'green';

        return '';
    }
    
    // function isAuthorized(userPermissions) {
    //     return (!userPermissions || userPermissions.filter(p => p.key === "Auth" && p.value === "HasAccess").length > 0);
    // }

    return (
        <>
            <AppBar position="fixed" className={classes.applicationBar} open={open}>
                <Toolbar>
                    <NBALogo />
                    <Typography variant="subtitle1" className={`${classes.title} headerTitle`}>
                        {AppConstants.CONSTANTS.APP_NAME}&nbsp;&nbsp;
                        <span style={{ color: getEnvTextColor() }}>{!environment ? '' : (environment === 'Production' ? '' : environment)}</span> 
                    </Typography>                       
                        
                    {props.userPermissions !== '' && <>
                        <SelectDropdown handleChange={handleChange} className={classes.headerDropdown} showImages={true} data={leagueData} selectValue={selectedValue} />
                        <IconButton color='inherit'>
                            <NotificationsIcon />
                        </IconButton>
                        <UserMenu />
                    </>}
                </Toolbar>
            </AppBar>
            {props.userPermissions !== '' && <DrawerNav open={open} ResetLeftNav={resetLeftNav} handleDrawerClose={handleDrawerClose} />}
        </>
    )
}

export default ApplicationBar;