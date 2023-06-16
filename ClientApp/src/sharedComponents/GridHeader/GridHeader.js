import * as React from 'react';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import EditScheduleIcon from '../customIcons/EditScheduleIcon';
import { DvrOutlined, InventoryOutlined, PlayLessonOutlined } from '@mui/icons-material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import DealListIcon from '../customIcons/DealListIcon';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PermDataSettingOutlinedIcon from '@mui/icons-material/PermDataSettingOutlined';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TuneIcon from '@mui/icons-material/Tune';

import {
    FactCheckOutlined
} from '@mui/icons-material';

import {AirplayOutlined} from '@mui/icons-material';


import ISCIIcon from '../customIcons/ISCIIcon'

const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1',
    },
    headerText: {
        marginRight: theme.spacing(2) + 'px !important',
    },
}));

const GridHeader = (props) => {
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
        <Grid item xs={12}>
            <Grid container alignItems={"center"}>
                {props.hideCheckbox !== true && <Grid item sm={props.view ? .35 : .65}>
                    <Box display={"flex"} alignItems={"center"} ml={-1.125} pr={1}>
                        {!props.hideCheckbox && <Checkbox size="small" />}
                    </Box>
                </Grid>}
                {props.showIcon && <Grid item sm={props.view ? .35 : .75}>
                    <Box display={"flex"} alignItems={"center"}>
                        {
                            props.showIcon && (props.icon === "deal" || props.icon ==="campaignPlanConf") && <LocalOfferOutlinedIcon color="secondary" size="small" />
                        }
                        {
                            props.showIcon && props.icon === "budget" && <MonetizationOnOutlinedIcon color="secondary" size="small" />
                        }
                        {
                            props.showIcon && props.icon === "media" && <DealListIcon color="secondary" size="small" />
                        }
                        {
                            props.showIcon && props.icon === "schedule" && <EditScheduleIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'inventory' && <InventoryOutlined color="secondary" size="small" />
                        }
                        {
                            props.icon === 'monthlySplit' && <EventNoteIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'ratecard' && <PermMediaIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'mediaPlanning' && <FactCheckOutlined color="secondary" size="small" />
                        }
                        {
                            props.icon === 'digitalPlans' && <PlayLessonOutlined color="secondary" size="small" />
                        }
                        {
                            props.icon === 'mediaPlan' && <AirplayOutlined color="secondary" size="small" />
                        }
                        {
                            props.icon === 'campaign' && <CampaignIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'campaignUnit' && <PermDataSettingOutlinedIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'inventoryDeal' && <AddToQueueIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'traffickLetter' && <MarkunreadOutlinedIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === 'invReport' && <AssessmentOutlinedIcon color="secondary" size="small" />
                        }
                        {props.showScheduleIcon && <EditScheduleIcon color="secondary" size="small" />}
                        {props.showTraffickingIcon && <DvrOutlined color="secondary" size="small" />}
                        {
                            props.icon === 'ISCI' && <ISCIIcon color="secondary" size="small" />
                        }
                        {
                            props.icon === "reporting" && <MarkunreadOutlinedIcon color="secondary" size="small" />
                        }
                        {                            
                            props.icon === "reconciliation" && <CloudUploadIcon color="secondary" size="small" />
                        }
                        {                            
                            props.icon === "reconciliationList" && <TuneIcon color="secondary" size="small" />
                        }

                    </Box>
                </Grid>
                }

                <Grid item sm={props.view ? !props.hideCheckbox ? 11.3 : 11.65  : !props.hideCheckbox ? 10.6 : 11.25}>
                    <Grid container alignItems="center">
                        <Grid item xs={props.hasFilter ? 1 : 3}>
                            <Typography title={props.headerText ? props.headerText : ''} noWrap variant="subtitle1" sx={{ fontWeight: 'medium' }} color="primary">{props.headerText ? props.headerText : ''}</Typography>
                        </Grid>
                        <Grid item xs={props.hasFilter ? 11 : 9}>
                            <Grid container alignItems='center' justifyContent="flex-end" sx={!props.hideExpendIcon ? { paddingRight: '32px' } : ""}>
                                {props.children}
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    );
}
Grid.displayName = "GridHeader";
export default GridHeader;