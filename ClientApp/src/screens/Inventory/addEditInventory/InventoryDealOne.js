import * as React from 'react';
import AppDataContext from '../../../common/AppContext';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import Helper from '../../../common/Helper';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Grid, Button, Typography} from '@mui/material';
import DateRangePicker from '../../../sharedComponents/PickDateRange/PickDateRange';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import { GetPartnerByType } from '../../../services/common.service';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
    contentHeight: {
        height: 'calc(100vh - 279px)',
        overflowY: 'auto',
    },
}));

/*

import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles((theme) => ({
    contentHeight: {
        height: 'calc(100vh - 130px)',
        overflowY: 'auto',
    },
}));


*/
const InventoryDealOne = (props) => {
    const classes = useStyles();
    const { leagueId, Regions } = React.useContext(AppDataContext);
    const [showLoading, setShowLoading] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    // const [inventoryDealData, setInventoryDealData] = React.useState(props.inventoryDealData);
    const [regionList, setRegionList] = React.useState();
    const [partnerList, setPartnerList] = React.useState();
    


    const handleClose = () => {
    }

    const handleDealIdBlur = (value) => {
        props.updateInventoryDealData("dealId", value);

    }

    const handleDealNameBlur = (value) => {
        props.updateInventoryDealData("dealName", value);
    }

    const setStartDate = (value) => {
        props.updateInventoryDealData("startDate", value);
    }

    const setEndDate = (value) => {
        props.updateInventoryDealData("endDate", value);
    }

    const handleChange = (name, value) => {
        props.updateInventoryDealData(name, value);
    }

    const getRegions = () => {
        let list = Regions.map((item) => {
            return { label: item.regionName, value: item.id }
        });
        setRegionList(list);
    }

    const getPartners = () => {
        GetPartnerByType(503).then((data) => {
            let cList = [];
            if (data) {
                data.map(item => {
                    cList.push({ label: item.partnerName, value: item.id });
                });
                setPartnerList(cList);
            }
        }).catch(err => console.log(err));
    }

    React.useEffect(()=> {
        if (Regions && Regions.length > 0) {
            getRegions(Regions);
        }
        getPartners();
    }, [])

    // React.useEffect(()=>{
    //     setInventoryDealData(props.inventoryDealData);
    // },[props.inventoryDealData]);
  
   
    return (
        <Paper elevation={0} className={classes.contentHeight}>
            {/* <ToastContainer autoClose={3000} /> */}
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5}>
                <Grid container spacing={1.25}>
                    
                    <Grid item xs={8}>
                        <TextboxField lblName="Deal Name" textboxData={props.inventoryDealData.dealName}
                            size="small" fullWidth
                            type="text" handleBlur={handleDealNameBlur} 
                            disabled={props.dealSourceId === 1052 ? true : false}
                            />
                            
                    </Grid>
                    <Grid item xs={8}>
                        <DateRangePicker disablePast={false}
                            startDate={props.inventoryDealData.startDate}
                            endDate={props.inventoryDealData.endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            disabled={props.dealSourceId === 1052 ? true : false}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Dropdown name="region" handleChange={handleChange} value={props.inventoryDealData.region.label}
                            size="small" id="region" variant="outlined"
                            showLabel={true} lbldropdown="Region" ddData={regionList}
                            disabled={props.dealSourceId === 1052 || (props.IsEditing && props.countDealInventoryItems > 0) || props.newDealInventoryId > 0 ? true : false} />
                    </Grid>
    
                    <Grid item xs={8}>
                        <Dropdown name="partner" handleChange={handleChange} value={props.inventoryDealData.partner.label}
                            size="small" id="partner" variant="outlined"
                            showLabel={true} lbldropdown="Partner" ddData={partnerList}
                            disabled={props.dealSourceId === 1052 || (props.IsEditing && props.countDealInventoryItems > 0) || props.newDealInventoryId > 0 ? true : false}
                             />
                    </Grid>
                </Grid>
                
            </Box>

            {
                showLoading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <div className={'loader-div'}><div className={'loading'}></div></div>
                </Backdrop>
            }

        </Paper>
    );

}

InventoryDealOne.displayName = "Deal Header";
export default InventoryDealOne;

