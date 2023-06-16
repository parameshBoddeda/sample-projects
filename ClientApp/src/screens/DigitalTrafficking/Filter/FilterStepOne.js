import React, { useContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import { Grid, Box, Button, Typography, Paper, Stack } from '@mui/material';
import AppDataContext from '../../../common/AppContext';
import PickDateRange from '../../../sharedComponents/PickDateRange/PickDateRange';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import MulltiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown'
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import * as AppConstants from '../../../common/AppConstants';
import {
  GetAssets,
  GetAssetsParent,
  GetRegions,
  GetCountries,

}
  from '../../../services/common.service';
import PickDate from '../../../sharedComponents/PickDate/PickDate';
import Helper from '../../../common/Helper';

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: 'calc(100vh - 320px)',
  },

}));
const FiltersStepOne = (props) => {
  const classes = useStyles();
  const { leagueId, Venturized, MarketType } = useContext(AppDataContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null)
  const [newStartDate, setnewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null)
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [venturized, setVenturized] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [marketType, setMarketType] = useState(null);
  const [asset, setAsset] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [assetName, setAssetName] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [mediaTypeName, setMediaTypeName] = useState(null);
  const [network, setNetwork] = useState(null);
  const [partner, setPartner] = useState(null);
  const [partnerName, setPartnerName] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [mediaTypeData, setMediaTypeData] = useState([
    { label: "Digital", value: 101 },
    { label: "CRM", value: 121 }
  ]);

  const [marketTypeData, setMarketTypeData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const { username } = React.useContext(AppDataContext);
  const [selectedRegions, setSelectedRegion] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState([]);
  const [selectedDays, setSelectedDays] = React.useState('');

  useEffect(() => {
    getRegionData();
    getVenturizedData();
    getMarketTypeData();

    if (props.filterCriteria) {
      // setSelectedRegion(props.Criteria.region || []);
       setRegionName(props.filterCriteria?.region[0]?.label)
      setSelectedCountry(props.filterCriteria.country || []);
      setMediaTypeName(props.filterCriteria.mediaType
        && props.filterCriteria.mediaType.label
        ? props.filterCriteria.mediaType.label : ""
      );
      setMediaType(props.filterCriteria.mediaType.value);
      if (!props.edit) {
        props.setFilterCriteria("startDate", Helper.FormatToIsoDate(props.seasonStartDateDefault));
      }
     
      setStartDate(props.filterCriteria.startDate || null);
      setEndDate(props.filterCriteria.endDate || null);

      setSelectedAsset(props.filterCriteria.asset
        && props.filterCriteria.asset
        ? props.filterCriteria.asset : "");

      if (props.filterCriteria.mediaType
        && props.filterCriteria.mediaType.value) {
        getAssetData(null, null, props.filterCriteria.mediaType.value)
      }

      if (!props.edit) {
        props.setFilterCriteria("endDate", Helper.FormatToIsoDate(props.seasonEndDateDefault));
      }
      let days = props.filterCriteria.days===0?'':props.filterCriteria.days
      setSelectedDays(days)
     // setSelectedDays(props.filterCriteria.days)

    }

  }, [props.filterCriteria]);
  useEffect(()=>{

    if (regionName === 'United States') {
      var selectedMarketType = marketTypeData.filter(v => v.label == 'Domestic');
      setMarketType(selectedMarketType[0]?.value);

    } else {
      var selectedMarketType = marketTypeData.filter(v => v.label == 'International');
      setMarketType(selectedMarketType[0]?.value);
    }
    if(props.filterCriteria.region[0] != null)
    {
      getCountryData(props.filterCriteria?.region[0]);
    }
    // getAssetData(marketType, venturized,mediaType)
  },[regionName ])
    useEffect(()=>{
    getAssetData(marketType, venturized,mediaType)
  },[marketType,mediaType,regionName])

  // useEffect(() => {
  //   getRegionData();
  //   getVenturizedData();
  //   getMarketTypeData();

  // }, []);

  function notifyWarning(message) { toast.warning(message) }
  const getRegionData = () => {
    GetRegions().then((data) => {
      let region = [];
      data.map(item => {
        region.push({ label: item.regionName, value: item.id });
      });
      setRegionData(region);
    }).catch(err => console.log(err))
  }
  const getCountryData = (region) => {
    GetCountries(region.value).then((data) => {
      let countries = [];
      data.map(item => {
        countries.push({ label: item.countryName, value: item.id, regionId: region.label });
      });
      setCountryData(countries);
    }).catch(err => console.log(err))
  }
  
  const getAssetData = (_marketType, _venturized, _mediaType) => {
    if (_marketType === null)
      _marketType = marketType;
    if (_venturized === null)
      _venturized = venturized;
    if (_mediaType === null)
      _mediaType = mediaType;

    if (_marketType === null || !_marketType || _venturized === null || _mediaType === null)
      return;

    GetAssets(leagueId, _marketType, _venturized, _mediaType).then(data => {
      if (data) {

        let list = data.map((item) => {
          return { label: item.assetDisplayName, value: item.id }
        });

        let distList = Array.from(new Set(list.map(a => a.value)))
          .map(id => {
            return list.find(a => a.value === id)
          });

        setAssetData(distList);
      }
      else console.log("GetAssets API is failing");
    });
  }


  const handleRegionChange = (name, value) => {
    setSelectedCountry([]);
    setRegion(value.value);
    setRegionName(value.label);
    setMediaTypeName("");
    setAssetName("");
    props.setFilterCriteria("mediaType", "");
    if (value.label === 'United States') {
      var selectedMarketType = marketTypeData.filter(v => v.label == 'Domestic');
      setMarketType(selectedMarketType[0].value);

    } else {
      var selectedMarketType = marketTypeData.filter(v => v.label == 'International');
      setMarketType(selectedMarketType[0].value);
    }
    getAssetData(null, null, selectedMarketType[0].value);
    getCountryData(value);

    let temp = selectedRegions.slice();
    let index = temp.findIndex(t => t.value === value.value);
    if (index <= -1) {
      temp.push(value);
      setSelectedRegion(temp);
    }
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
      props.setFilterCriteria('country', []);
    }
    setCountryName("");

  };

  const handleCountryChange = (name, value) => {
    setCountry(value.value);
    setCountryName(value.label);
    setMediaTypeName("");
    props.setFilterCriteria("mediaType", "");
    setAssetName("");
    let temp = selectedCountry.slice();
    let index = temp.findIndex(t => t.value === value.value);
    if (index <= -1) {
      temp.push(value);
      setSelectedCountry(temp);
    }
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
    setTimeout(() => {
      setCountryName("");
    }, 1000);
  };

  const handleMediaTypeChange = (name, value) => {
    setMediaType(value.value);
    setMediaTypeName(value.label);
    setAssetName("");
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, value);
    };
    getAssetData(null, null, value.value);
    
  };

  const getMarketTypeData = () => {
    if (MarketType && MarketType.length > 0) {
      let list = MarketType.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setMarketTypeData(list);
    }
  }

  const handleAssetChange = (name, value) => {
    setAsset(value.value);
    setAssetName(value.label);
    let temp = selectedAsset.slice();
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedAsset(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  };


  const handleAssetDelete = (name, value) => {
    let temp = selectedAsset.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedAsset(temp);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }

  const handleCountryDelete = (name, value) => {
    let temp = selectedCountry.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedCountry(temp);
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }
  const getVenturizedData = () => {
    if (Venturized && Venturized.length > 0) {
      let list = Venturized.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      let nonVenture = list.filter(x => x.value == 952);
      setVenturized(nonVenture[0].value);
    }
  }

  const handleBlur = (value) => {

    let globalFilterErr = false;

    setSelectedDays(value)
    if (value > 0) {

      let currentStartDate = new Date();
      setStartDate(Helper.FormatToIsoDate(currentStartDate));
      if (props.setFilterCriteria) {
        props.setFilterCriteria("startDate", Helper.FormatToIsoDate(currentStartDate));
      }
      let result = currentStartDate.setDate(currentStartDate.getDate() + Number(value))

      if (new Date(result) > new Date(props.seasonEndDate)) {
        notifyWarning(AppConstants.Inventory.EndAfterCheck);
        globalFilterErr = true;
      }
      else {
        setEndDate(Helper.FormatToIsoDate(new Date(result)));
        if (props.setFilterCriteria) {
          props.setFilterCriteria("endDate", Helper.FormatToIsoDate(new Date(result)));
        }
      }
    }
    if (props.setFilterCriteria) {
      props.setFilterCriteria("days", value);
    }
  }



  const handleEndDateChange = (value) => {
    setEndDate(value);
    if (props.setFilterCriteria) {
      props.setFilterCriteria("endDate", value);
    }
  }

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if (props.setFilterCriteria) {
      props.setFilterCriteria("startDate", value);
    }
  }

  const handleDaysChange = (value) => {
    setSelectedDays(value);
    if (props.setFilterCriteria) {
      props.setFilterCriteria("days", value);
    }
  }

  return (
    <>
      <ToastContainer autoClose={3000} />
     
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextboxField lblName="Filter in Days" textboxData={selectedDays}
                 handleChange={handleDaysChange}
                  size="small" fullWidth
                  type="text" handleBlur={handleBlur} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <PickDate setDefaultValue={true} value={startDate} initialValue={Helper.FormatToIsoDate(props.seasonStartDateDefault)} size="small" setDate={handleStartDateChange} label="Start Date" />
              </Grid>
              <Grid item xs={2}>
                <PickDate setDefaultValue={true} value={endDate} initialValue={Helper.FormatToIsoDate(props.seasonEndDateDefault)} size="small" setDate={handleEndDateChange} label="End Date" />
              </Grid>
              {/* <PickDateRange startDate={startDate} endDate={endDate}
              setStartDate={handleStartDateChange} setEndDate={handleEndDateChange}
            /> */}
            </Grid>
          </Grid>


          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Dropdown value={regionName} size="small" name="region" id="region" variant="outlined" showLabel={true} lbldropdown="Region" handleChange={handleRegionChange} ddData={regionData ? regionData : []} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={4}>
                <MulltiSelectDropdown size="small" name="country" id="country" variant="outlined" showLabel={true} lbldropdown="Country" handleChange={handleCountryChange} ddData={countryData ? countryData : []} />
                {/* <Dropdown value={countryName} size="small" name="country" id="country" variant="outlined" showLabel={true} lbldropdown="Country" handleChange={handleCountryChange} ddData={countryData ? countryData : []} /> */}
              </Grid>
              <Grid item xs={8}>
                {selectedCountry && <ChipsList name="country" size="small" handleDelete={handleCountryDelete}
                  showDelete={true} label="" data={selectedCountry} />}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Dropdown value={mediaTypeName} size="small" name="mediaType" id="mediaType" variant="outlined" showLabel={true} lbldropdown="Media Type" handleChange={handleMediaTypeChange} ddData={mediaTypeData ? mediaTypeData : []} />
              </Grid>
            </Grid>
          </Grid>


          <Grid xs={12} item>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={4}>
                <MulltiSelectDropdown size="small" id="asset" name="asset" value={assetName} variant="outlined" showLabel={true} lbldropdown="Asset" handleChange={handleAssetChange} ddData={assetData ? assetData : []} />
              </Grid>
              <Grid item xs={8}>
                {selectedAsset && <ChipsList name="asset" size="small" handleDelete={handleAssetDelete}
                  showDelete={true} label="" data={selectedAsset} />}
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </>
  );

}
export default FiltersStepOne;

