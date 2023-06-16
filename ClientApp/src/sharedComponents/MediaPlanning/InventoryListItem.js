//Global Imports Start
import React, { useEffect, useState} from "react";
import { Box, IconButton, Checkbox, Divider } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
//Global Imports End

const useStyles = makeStyles(theme => ({
    date1: {
        '& .MuiInputLabel-root': {
            fontSize: '.75rem',
            transform: 'translate(14px, 6px) scale(1)',
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(.35, .75),
        },
    },
    selected: {
        background: "#e4ecff"
    },
    inventoryCheckBox: {
        padding: theme.spacing(.75, .375) + '!important',
    },
    inventoryAddButton: {
        padding: theme.spacing(.75, 0) + '!important',
    },
}));

const InventoryListItem = (props) => {
    const classes = useStyles();
    const [inventory, setInventory] = useState(props.inventory);

    useEffect(()=>{
        setInventory(props.inventory);
    }, [props.inventory])

    const setSelectedInventory = (e, inventory) => {
        if (inventory.isChargable){
            let isValid = true;
            if (props.IsPureDigital){
                /*if (!inventory.unitSizes || inventory.unitSizes === ''){
                    notifyWarning('Please add Unit Size for the Inventory.');
                    isValid = false;
                }*/
            }

            if (!isValid) return;
        }

        props.setSelectedInventory(e, inventory);
    }

    const getRate = (rates) => {
        if (rates?.length > 0) {
            //Check for NonPrime first
            var index = rates.findIndex(x => x.dayPartName === 'Non-Prime' && x.rateTypeId === 801);
            if(props.IsDigitalPlanning)
                index = rates.findIndex(x => x.dayPartName === 'Non-Prime' && x.rateTypeId === 803);
            if (index > -1) {
                return rates[index].rate;
            }

            index = rates.findIndex(x => x.dayPartName === 'Prime' && x.rateTypeId === 801);
            if (props.IsDigitalPlanning)
                index = rates.findIndex(x => x.dayPartName === 'Prime' && x.rateTypeId === 803);
            if (index > -1) {
                return rates[index].rate;
            }
        }
        return '-';
    }

    const isPrime = (rates) => {
        if (rates?.length > 0) {
            //Check for Prime rate only
            let index = rates.findIndex(x => x.dayPartName === 'Prime' && x.rateTypeId === 801);
            if (props.IsDigitalPlanning)
                index = rates.findIndex(x => x.dayPartName === 'Prime' && x.rateTypeId === 803);
            
            if (index > -1) return true;
        }
        return false;
    }

    const checkInSelectedInventory =(selectedInventory, currentInventory) =>{
        if (props.IsSelectAllChecked) return true;
        
        let count = selectedInventory.filter(x=> x.inventoryId === currentInventory.inventoryId 
                                            && x.unitTypeName === currentInventory.unitTypeName 
                                            && x.unitSizeName === currentInventory.unitSizeName
                                            && x.assetId === currentInventory.assetId).length;
        return count > 0;
    }

    const handleShow=(mediatype)=>{
        var notToShow=['Social Media', 'Digital'];
        var status = true;
        if(notToShow.indexOf(mediatype) > -1){
            status = false;
        }
        return status;
    }

    return (<React.Fragment key={props.key}>
        <Divider sx={{ width: '100%' }} />
        <Box className={checkInSelectedInventory(props.selectedInventory, inventory) ? classes.selected : ''}>
            <Grid container spacing={.5}>
                <Grid item xs={1}>
                    {(props.IsCalendarView || props.IsDigitalPlanning) && <Checkbox checked={checkInSelectedInventory(props.selectedInventory, inventory) ? true : false} size="small" 
                        className={classes.inventoryCheckBox} onChange={(e) => setSelectedInventory(e,inventory)} />}
                </Grid>
                <Grid item xs={10}>
                    <Grid container spacing={.5}>
                        <Grid item xs={2}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>League</Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {inventory.leagueName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        {props.IsDigitalPlanning && <Grid item xs={2}>
                            <Box display="flex" flexDirection="column" title={inventory.regionName}>
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Region</Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {inventory.regionName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        {<Grid item xs={2}>
                            <Box display="flex" flexDirection="column" title={inventory.countryName}>
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Country</Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" noWrap component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {inventory.countryName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        {!props.IsDigitalPlanning && <Grid item xs={4}>
                            <Box display="flex" flexDirection="column" title={inventory.partnerName}>
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Network</Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {inventory.partnerName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>}                            
                        <Grid item xs={4}>
                            <Box display="flex" flexDirection="column" title={inventory.assetName}>
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Asset</Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {inventory.assetName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    
                        {!props.IsDigitalPlanning &&<Grid item xs={2}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Episodes</Typography>
                                </Box>
                                <Box component="div" >
                                <Typography variant="subtitle2" style={{ fontSize: "12px" }}>{inventory.totalEpisode - inventory.usedEpisode}</Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        {!props.IsPureDigital && <Grid item xs={2}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Unit Size</Typography>
                                </Box>
                                <Box component="div" >
                                    <Typography variant="subtitle2" style={{ fontSize: "12px" }}>{inventory.unitSizeName}</Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        {props.IsPureDigital && <Grid item xs={4}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px", color: (!inventory.unitSizes || inventory.unitSizes === '') ? 'red' : '' }}>Unit Sizes</Typography>
                                </Box>
                                <Box component="div" >
                                    <Typography variant="subtitle2" noWrap title={inventory.unitSizes} style={{ fontSize: "12px" }}>{inventory.unitSizes}</Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        {props.IsDigitalPlanning && <Grid item xs={4}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px", color: (!props.IsCampaignPlanning &&inventory.isChargable && getRate(inventory.rates) === '-' ?'red' : '') }}>Rate</Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {getRate(inventory.rates)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        {!props.IsDigitalPlanning && <Grid item xs={4}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>{handleShow(inventory.mediaTypeName) && 'Units | Avails |'} <span style={{ color: !props.IsCampaignPlanning && inventory.isChargable && getRate(inventory.rates) === '-' ? 'red' : '' }}> Rate</span></Typography>
                                </Box>
                                <Box component="div">
                                    <Typography variant="subtitle2" component="div" className={classes.date1} style={{ fontSize: "12px" }}>
                                        {inventory.totalUnits} | {inventory.totalUnits - inventory.usedUnits} | {getRate(inventory.rates)} {isPrime(inventory.rates) && <span style={{ color:'red'}} title='Prime Rate'> *</span>}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>}
                        <Grid item xs={props.IsPureDigital ? 2 : 4}>
                            <Box display="flex" flexDirection="column">
                                <Box component="div">
                                    <Typography variant="caption" style={{ fontSize: "10px" }}>Unit Type</Typography>
                                </Box>
                                <Box component="div" >
                                    <Typography variant="subtitle2" style={{ fontSize: "12px" }}>
                                        {inventory.unitTypeName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>                                        
                    </Grid>
                </Grid>

                <Grid item xs={1}>
                    {!props.IsCalendarView && <IconButton title="Select Inventory" size="small" component="div" onClick={(e) => setSelectedInventory(e, props.IsDigitalPlanning ?'Digital':inventory)} className={classes.inventoryAddButton}>
                        <AddCircleRoundedIcon size="small" color="primary" />
                    </IconButton>}
                </Grid>
            </Grid>
        </Box>
    </React.Fragment>
    )
}

InventoryListItem.displayName = "InventoryListItem";
export default InventoryListItem;