import React, { useState, useEffect } from 'react';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import { ToastContainer } from "react-toastify";
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import MulltiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import * as AppConstants from '../../../common/AppConstants';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
  GetLookupById,
  GetPartnerByType,
  GetUnitTypes,
  GetMedium
}
  from '../../../services/common.service';
import Backdrop from "@mui/material/Backdrop";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: 'calc(100vh - 294px)',
  },

}));
const RateCardFilterStepTwo = (props) => {
  const classes = useStyles();
  const [unitTypeName, setUnitTypeName] = useState(null);
  const [rateTypeName, setRateTypeName] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [unitTypeData, setUnitTypeData] = useState([]);
  const [rateTypeData, setRateTypeData] = useState([]);
  const [daypartData, setDaypartData] = useState([]);
  const [dayPartName, setDayPartName] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [selectedUnitType, setSelectedUnitType] = useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  useEffect(() => {
    getMediumData();
    getCustomerData();
    getRateTypeData();
    getDaypartData();
  }, []);
  
  const getCustomerData = () => {
    GetPartnerByType(AppConstants.PartnerType.Licensee_Sponsor).then((data) => {
      let customer = [];
      data.map(item => {
        customer.push({ label: item.partnerName, value: item.id });
      });
      setCustomerData(customer);
    }).catch(err => console.log(err))
  }
  
  const getMediumData = () => {
    GetMedium(-1).then(data => {
      if (data) {
        let mediumLst = data.filter(x => x.mediumLookupId === props.filterCriteria.mediaType.value);
        if (mediumLst !== null && mediumLst.length > 0)
          getUnitTypeData(mediumLst[0].mediumLookupId);
      }
      
      else console.log("GetMedium API is failing");
    }).catch((error) => {
      console.log('Error in GetMedium ', error);
    });
  }


  const getUnitTypeData = (id) => {
    GetUnitTypes(id).then((data) => {
      let unitTypes = [];
      data.map(item => {
        unitTypes.push({ label: item.unitTypeName, value: item.id });
      });
      setUnitTypeData(unitTypes);
    }).catch(err => console.log(err))
  }
  const getRateTypeData = () => {
    GetLookupById(AppConstants.LOOKUP_VALUE.Rate_Type).then((data) => {
      let rateTypes = [];
      data.map(item => {
        rateTypes.push({ label: item.lookupText, value: item.lookupId });
      });
      setRateTypeData(rateTypes);
    }).catch(err => console.log(err))
  }

  const getDaypartData = () => {
    GetLookupById(AppConstants.LOOKUP_VALUE.Day_Part).then((data) => {
      let dayParts = [];
      data.map(item => {
        dayParts.push({ label: item.lookupText, value: item.lookupId });
      });
      setDaypartData(dayParts);
    }).catch(err => console.log(err))
  }


  const handleUnitTypeChange = (name, value) => {
    setUnitTypeName(value.label);
    let temp = selectedUnitType ? selectedUnitType.slice() : [];
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedUnitType(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  };


  const handleUnitTypeDelete = (name, value) => {
    let temp = selectedUnitType.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedUnitType(temp);
    
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }

  const handleRateTypeChange = (name, value) => {
    setRateTypeName(value.label);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, value);
    }
  };

  const handleCustomerChange = (name, value) => {
    setCustomerName(value.label);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, value);
    }
  }

  const handleDayPartChange = (name, value) => {
    setDayPartName(value.label);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, value);
    }
  };


  useEffect(()=>{
    if(props.filterCriteria){
      setShowLoading(true);
      setOpenBackdrop(true);
      GetMedium(-1).then(data => {
        if (data) {
          let mediumLst = data.filter(x => x.mediumLookupId === props.filterCriteria.mediaType.value);
          if (mediumLst !== null && mediumLst.length > 0)
            getUnitTypeData(mediumLst[0].mediumLookupId);
          setShowLoading(false);
          setOpenBackdrop(false);
        }
        else {
          setShowLoading(false);
          setOpenBackdrop(false);
          console.log("GetMedium API is failing");
        }         
      }).catch((error) => {
        setShowLoading(false);
        setOpenBackdrop(false);
        console.log('Error in GetMedium ', error);
      });
      setSelectedUnitType(props.filterCriteria.unitType  ? props.filterCriteria.unitType : "");
      setRateTypeName(props.filterCriteria?.rateType?.label);
      setDayPartName(props.filterCriteria?.dayPart?.label);
      setCustomerName(props.filterCriteria?.customer?.label);
           
    }

  }, [props.filterCriteria]);  

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={4}>
            <MulltiSelectDropdown size="small" id="unitType" name="unitType" value={unitTypeName} variant="outlined" showLabel={true} lbldropdown="Unit Type" handleChange={handleUnitTypeChange} ddData={unitTypeData ? unitTypeData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedUnitType && <ChipsList name="unitType" size="small" handleDelete={handleUnitTypeDelete} 
              showDelete={true} label="" data={selectedUnitType}/>}
          </Grid>
          <Grid item xs={4}>
            <Dropdown size="small" name="rateType" id="rateType" value={rateTypeName} variant="outlined" showLabel={true} lbldropdown="Rate Type" handleChange={handleRateTypeChange} ddData={rateTypeData ? rateTypeData : []} />
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Dropdown size="small" name="dayPart" id="dayPart" value={dayPartName} variant="outlined" showLabel={true} lbldropdown="Day Part" handleChange={handleDayPartChange} ddData={daypartData ? daypartData : []} />
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Dropdown size="small" name="customer" id="customer" value={customerName}  variant="outlined" showLabel={true} lbldropdown="Customer" handleChange={handleCustomerChange} ddData={customerData ? customerData : []} />
          </Grid>

        </Grid>
      </Box>
      {showLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <div className={'loader-div'}><div className={'loading'}></div></div>
        </Backdrop>
      )}
    </>
  );

}
export default RateCardFilterStepTwo;

