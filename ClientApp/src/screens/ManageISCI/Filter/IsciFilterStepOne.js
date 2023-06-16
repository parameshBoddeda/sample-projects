import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from "react-toastify";
import MultiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Radio, FormControl, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import AppDataContext from '../../../common/AppContext';
import DateRangePicker from '../../../sharedComponents/PickDateRange/PickDateRange';
import Helper from '../../../common/Helper';
import { GetMediaType } from '../../../services/common.service';
import ChipsList from '../../../sharedComponents/chips/ChipsList';

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
  const [selectedRadioType, setSelectedRadioType] = useState(1301);
  const [selectedMarketType, setSelectedMarketType] = useState(null);
  const [selectedMarketTypeLabel, setSelectedMarketTypeLabel] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState([]);
  // const [selectedMediaTypeLabel, setSelectedMediaTypeLabel] = useState(null);
  const [mediaTypeData, setMediaTypeData] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const { MarketType } = useContext(AppDataContext);

  useEffect(() => {
    getMedium();
  }, []);

  const handleRadioTypeClick = (e) => {
      var radioType =  e.target.value === "sales" ? 1301 : 1302;
      var radioTypeName =  e.target.value === "sales" ? "Sales" : "Institutional";
      setSelectedRadioType(radioType);      
      props.setFilterCriteria('type', radioType);
      props.setFilterCriteria('typeName', radioTypeName);
  }


  const handleDropdownChange = (name, value) => {
    if (name === "marketType") {        
      setSelectedMarketType(value.lookupId);  
      setSelectedMarketTypeLabel(value.label);        
      props.setFilterCriteria('marketTypeId', value);
    }
    if (name === "mediaType") {
      let temp = selectedMediaType.slice();
      let index = temp.findIndex(t=>t.value === value.value);
      if(index <= -1){
          temp.push(value);
          setSelectedMediaType(temp);
      }
      if(props.setFilterCriteria) {
        props.setFilterCriteria('mediaTypeId', temp);
      }
    }
  }
  const setStartDate = (value) => {
    setSelectedStartDate(value);
    props.setFilterCriteria('startDate', value);
  }

  const setEndDate = (value) => {
    setSelectedEndDate(value);
    props.setFilterCriteria('endDate', value);
  }
  const getMedium = () => {
      GetMediaType(-1).then((data) => {
          if (data) {
               let list = data.map((item) => {
                   return { label: item.mediumLookupText, value: item.mediumLookupId, parentId: item.mediumLookupParentId }
               });
               let filteredMediaType = list.filter(
                   (mediaType) => ((mediaType.value === 150) || (mediaType.value === 200))
               );
               setMediaTypeData(filteredMediaType);
           }
       }).catch(err => console.log(err))
  }

  const handleDelete = (name, value)=>{
    // if (name === "marketType") {
    //     let temp = selectedMarketType.slice();
    //     let index = temp.findIndex(t=>t.value === value.value);
    //     temp.splice(index,1);
    //     setSelectedMarketType(temp);
    //     if(props.setFilterCriteria) {
    //       props.setFilterCriteria('marketTypeId', temp);
    //     }
    // }
    if (name === "mediaType") {
      let temp = selectedMediaType.slice();
      let index = temp.findIndex(t=>t.value === value.value);
      temp.splice(index,1);
      setSelectedMediaType(temp);
      if(props.setFilterCriteria) {
        props.setFilterCriteria('mediaTypeId', temp);
      }
    }
  }

  useEffect(()=>{
    if(props.filterCriteria){

      // setSelectedCustomers(props.filterCriteria?.customer);

      // setSelectedYear(props.filterCriteria.year );
      var marketType = props.filterCriteria.marketTypeId;
      var filteredMarketType = MarketType.filter(x=>x.value = props.filterCriteria.marketTypeId);
      if(!props.filterCriteria.type)
      {
        props.setFilterCriteria('type', 1301);
      }
      setSelectedRadioType(props.filterCriteria.type || 1301);

      setSelectedMediaType(props.filterCriteria.mediaTypeId || []);
      setSelectedMarketType(filteredMarketType[0]);
      setSelectedMarketTypeLabel(filteredMarketType[0]?.label);
      setSelectedStartDate(props.filterCriteria.startDate);
      setSelectedEndDate(props.filterCriteria.endDate);
      if(props.isEditSearch){
        if(props.filterCriteria.marketTypeId && props.filterCriteria.marketTypeId.label){
          setSelectedMarketTypeLabel(props.filterCriteria.marketTypeId.label);
        } else {
          setSelectedMarketTypeLabel();
        }
      }

    }

  }, [props.filterCriteria]);
  
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        
        <Grid container alignItems="center" spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
              <Grid item xs={4}>
                  <FormControl size="small" >
                      <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={selectedRadioType}
                          onChange={handleRadioTypeClick}
                      >
                          <FormControlLabel value="sales" control={<Radio checked={selectedRadioType === 1301} value="sales" size="small" />} label="Sales" />
                          <FormControlLabel value="institutional" control={<Radio checked={selectedRadioType === 1302} value="institutional" size="small" />} label="Institutional" />
                      </RadioGroup>
                  </FormControl>
              </Grid>
          </Grid>
      </Grid>
        <Grid item xs={12}>
              <Grid container spacing={1}>
                  <Grid item xs={4}>
                      <Dropdown name="marketType"  handleChange={handleDropdownChange}
                          value={selectedMarketTypeLabel}
                          size="small" id="marketType" variant="outlined" showLabel={true}
                          lbldropdown="Market Type *" ddData={MarketType.length ? MarketType : []}
                      />
                  </Grid>
                  {/* <Grid item xs={8}>
                    {selectedMarketType && <ChipsList name="marketType" size="small" handleDelete={handleDelete} 
                      showDelete={true} label="" data={selectedMarketType}/>}
                  </Grid> */}

              </Grid>

          </Grid>
        <Grid item xs={12}>
              <Grid container spacing={1}>

                  <Grid item xs={4}>
                      <MultiSelectDropdown name="mediaType" handleChange={handleDropdownChange}
                          // value={selectedMediaTypeLabel}
                          size="small" id="mediaType" variant="outlined" showLabel={true}
                          lbldropdown="Media Type *" ddData={mediaTypeData.length ? mediaTypeData : []}
                      />
                  </Grid>
                  <Grid item xs={8}>
                    {selectedMediaType && <ChipsList name="mediaType" size="small" handleDelete={handleDelete} 
                      showDelete={true} label="" data={selectedMediaType}/>}
                  </Grid>
              </Grid>

          </Grid>
          <Grid item xs={12}>
              <Grid container spacing={1}>
                  <Grid item xs={4}>
                      <DateRangePicker
                          startDateLabel="Start Date"
                          endDateLabel="End Date"
                          startDate={selectedStartDate}
                          endDate={selectedEndDate}
                          setStartDate={setStartDate}
                          setEndDate={setEndDate}
                      />
                  </Grid>
              </Grid>
          </Grid>

        </Grid>        
      </Box>
    </>
  );

}
export default MediaPlanFiltersStepOne;

