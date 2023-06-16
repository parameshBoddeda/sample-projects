import React, { useState, useEffect, useContext } from 'react';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import { ToastContainer, toast } from "react-toastify";
import MultiDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import * as AppConstants from '../../../common/AppConstants';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
  GetPartnerByType,
}
  from '../../../services/common.service';
import AppDataContext from '../../../common/AppContext';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';

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
const MediaPlanFiltersStepOne = (props) => {
  const classes = useStyles();
  const { MarketType } = React.useContext(AppDataContext);
  const [selectedYear, setSelectedYear] = useState(props.filterCriteria.year);

  const [customerData, setCustomerData] = useState([]);
  const [customerName, setCustomerName] = useState();
  const [customerId, setCustomerId] = useState();
  const [selectedMarketTypeValue, setSelectedMarketTypeValue] = React.useState(props.filterCriteria?.marketType || '');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  useEffect(() => {
    getCustomerData();
    
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
  
  const handleCustomerChange = (name, value) => {
    setCustomerId(value.value);
    setCustomerName(value.label);
    let temp = selectedCustomers.slice();
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedCustomers(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }
  
  const handleQuantityFromBlur = (value) => {
    setSelectedYear(value);
    //props.updateInventoryData("quantityFrom", value);
    if(props.setFilterCriteria) {
      props.setFilterCriteria("year", value);
    }
}

const handleCustomersDelete = (name, value) => {
  let temp = selectedCustomers.slice();
  let index = temp.findIndex(t=>t.label === value);
  temp.splice(index,1);
  setSelectedCustomers(temp);
  
  if(props.setFilterCriteria) {
    props.setFilterCriteria(name, temp);
  }
}

  useEffect(()=>{
    if(props.filterCriteria){

      setSelectedCustomers(props.filterCriteria?.customer);

      setSelectedYear(props.filterCriteria.year );

    }

  }, [props.filterCriteria]);

  useEffect(() => {
    if (props.isEditSearch) {

      // if (props.filterCriteria) {
      //   if (props.filterCriteria.customer && props.filterCriteria.customer.length) {
      //     let customersList = [];
      //     props.filterCriteria.customer.map(ele => {
      //       customersList.push(ele);
      //     });
      //     setSelectedCustomers(customersList);
      //   }

      if (props.filterCriteria.year) {
        setSelectedYear(props.filterCriteria.year);
      }
    }

  }, [props.isEditSearch])

  const handleChange = (name, value) => {
    if(name === 'marketType'){
        setSelectedMarketTypeValue(value.value);        
        // filterCriteria.marketType = (value);
        props.setFilterCriteria("marketType", value);
    }
  }
  
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={4}>
            <Dropdown name="marketType" SMwidth="400" size="small" lbldropdown="Market Type" value={selectedMarketTypeValue?.label} ddData={MarketType} handleChange={handleChange}/>
          </Grid>
          <Grid item xs={8}>
            &nbsp;
          </Grid>
          <Grid item xs={4}>
            <MultiDropdown size="small" name="customer" id="customer" value={customerName}  
              variant="outlined" showLabel={true} lbldropdown="Customer" handleChange={handleCustomerChange} 
              ddData={customerData ? customerData : []} 
            />
          </Grid>
          <Grid item xs={8}>
            {selectedCustomers && <ChipsList name="customer" size="small" handleDelete={handleCustomersDelete} 
              showDelete={true} label="" data={selectedCustomers}/>}
          </Grid>

          <Grid item xs={4}>
            <TextboxField lblName="Year" textboxData={selectedYear}
              size="small" fullWidth 
              type="text" handleBlur={handleQuantityFromBlur}
            />
          </Grid>
          

        </Grid>        
      </Box>
    </>
  );

}
export default MediaPlanFiltersStepOne;

