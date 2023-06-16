import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import AppDataContext from '../common/AppContext';
import Helper from '../common/Helper';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ProfileAvatar from './ProfilePic/ProfileAvatar';

const useStyles = makeStyles(theme => ({
    menu: {
        width: "250px",
    },
    itemIcon: {
        minWidth: "35px",
    },
    avatar: {
        fontSize: "15px"
    },
    appVersion: {
        marginLeft: theme.spacing(2),
        fontSize: '10px'
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    marginLeft1: {
        marginLeft: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
}));


const UserMenu = (props) => {
    const classes = useStyles();
    const {
        signoutURL,
        userDisplayName,
        applicationVersion
    } = useContext(AppDataContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <ProfileAvatar isCircle={true} variant="circular" small={true} />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <List className={classes.list}>
                    <ListItem
                        className={classes.menu}
                        style={{ paddingBottom: "20px" }}
                    >
                        <ListItemAvatar>
                            <ProfileAvatar isCircle={true} variant="circular" small={true} />
                        </ListItemAvatar>
                        <ListItemText id="user-name" primary={userDisplayName}  />
                    </ListItem>
                    <Divider></Divider>
                    <MenuItem onClick={() => Helper.LogOutApplication(signoutURL)}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </List>

                <span className={classes.appVersion}>Version: {applicationVersion}</span>
            </Menu>
        </div>
    )
}

export default UserMenu;