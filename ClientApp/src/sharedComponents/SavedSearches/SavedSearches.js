import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Divider from "@material-ui/core/Divider";
import { Box, Drawer, Grid, Typography} from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { DeleteUserPreference } from './../../services/common.service';
import * as AppLanguage from '../../common/AppLanguage';
import { ToastContainer, toast } from "react-toastify";

function notifyWarning(message) { toast.warning(message) }

const drawerWidthRight = 430;
const useStyles = makeStyles(theme => ({
    SearchContent: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: "4px 4px",
        paddingLeft: "8px"
    },
    title: {
        flexGrow: 1,
    },
    fontWeight600: {
        fontWeight: '600'
    },
    drawerRight: {
        width: drawerWidthRight,
        flexShrink: 0,
    },
    drawerPaperRight: {
        width: drawerWidthRight,
        height: `50%`,
        overflowX: 'hidden',
        top: '110px',
        '&::-webkit-scrollbar': {
            width: '6px'
        },
        right: '10px',
        '&::-webkit-scrollbar-thumb': {
            background: '#bfb6b6cc'
        },
        boxShadow: '0px 0px 2px 2px #487adc',
        borderRadius: '4px'
    },
}));

const SavedSearches = (props) => {
    const classes = useStyles();
    const [savedSearches, setSavedSearches] = useState(props.data);
    const [refreshStatus, setRefreshStatus] = useState(false);

    const DeleteSavedSearch = (id)=>{
        DeleteUserPreference(id).then((data) => {
            var allSavedSearches = savedSearches;
            var searchIndex = allSavedSearches.findIndex(x=>x.id === id);
            allSavedSearches.splice(searchIndex, 1);
            setSavedSearches(allSavedSearches);
            setRefreshStatus(true);
            props.deleteSelectedFilter()
            props.handleSavedSearchesPopup(true);
            props.notifySuccess(AppLanguage.APP_MESSAGE.Filter_Delete);
        }).catch(err => {
            console.log(err);
        });
    }
    const handleEditClick = (data) => {
        if(props.handleEditClick) {
            props.handleEditClick(data);
        } else {
            notifyWarning(AppLanguage.APP_MESSAGE.Not_Yet_Available);
        }
    }

    return (
        <>
            <ToastContainer autoClose={3000} />
            <Drawer className={classes.drawerRight} anchor='right' open={props.show}
                classes={{
                    paper: classes.drawerPaperRight,
                }}
                onClose={() => props.handleSavedSearchesPopup(refreshStatus)}>
                <Grid container fullWidth style={{ padding: '10px' }} >
                    <Grid item xs={12} sm={12}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" flex="1">
                            <Typography variant='body2' className={classes.fontWeight600} component="p" >Saved Searches</Typography>
                            <IconButton size="small" title="close" onClick={() => props.handleSavedSearchesPopup()}>
                                <CloseOutlinedIcon ></CloseOutlinedIcon>
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12}><Divider /> </Grid>
                    <Grid item xs={12} sm={12}>

                        {savedSearches.map((item) => {
                            return <>
                                <Divider></Divider>
                                <Box flexDirection={'row'}
                                    Display="flex"
                                    className={classes.SearchContent}
                                    sx={props.selectedFilterId === item.id ? { backgroundColor: "#dfe3ec" } : {}}>
                                    <a href="javascript:void(0)" onClick={() => props.handleSavedSearchesChange(item.id)}>
                                        <Typography variant='body2' component="p" >{item.name}</Typography>
                                    </a>
                                    <Box display={"flex"}>
                                        <IconButton title="Edit Searches" onClick={() => handleEditClick(item)}>
                                            <CreateOutlinedIcon />
                                        </IconButton>

                                        <IconButton title='Delete' onClick={() => DeleteSavedSearch(item.id)}>
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>

                                    </Box>
                                </Box>
                            </>
                        })}

                    </Grid>
                </Grid>
            </Drawer>
        </>
    )
}

export default SavedSearches;