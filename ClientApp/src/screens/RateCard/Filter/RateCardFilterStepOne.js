import React, { useState, useEffect, useContext } from 'react';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import { ToastContainer } from "react-toastify";
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import MultiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import * as AppConstants from '../../../common/AppConstants';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
  GetPartnerByType,
  GetAssets,
  GetRegions,
  GetCountries,
  GetMedium
}
  from '../../../services/common.service';
import AppDataContext from '../../../common/AppContext';


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
const RateCardFilterStepOne = (props) => {
  const classes = useStyles();
  const { leagueId, Venturized, MarketType } = useContext(AppDataContext);
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [venturized, setVenturized] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [marketType, setMarketType] = useState(null);
  const [asset, setAsset] = useState(null);
  const [network, setNetwork] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [assetName, setAssetName] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [venturizedName, setVenturizedName] = useState(null);
  const [mediaTypeName, setMediaTypeName] = useState(null);
  const [rateTypeName, setRateTypeName] = useState(null);

  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [venturizedData, setVenturizedData] = useState([]);
  const [mediaTypeData, setMediaTypeData] = useState([]);
  const [mediumData, setMediumData] = useState([]);
  const [marketTypeData, setMarketTypeData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const [selectedRegions, setSelectedRegion] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);

  useEffect(() => {
    getRegionData();
    getVenturizedData();
    getMediaTypeData();
    getPartnerData();
    getMarketTypeData();
  }, []);

  const getVenturizedData = () => {
    if (Venturized && Venturized.length > 0) {
      let list = Venturized.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setVenturizedData(list);
      let nonVenture = list.filter(x => x.value == 952);
      setVenturized(nonVenture[0].value);
      setVenturizedName(nonVenture[0].label);
    }
  }

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
  const getPartnerData = () => {
    GetPartnerByType(AppConstants.PartnerType.Broadcaster).then((data) => {
      let networks = [];
      data.map(item => {
        networks.push({ label: item.partnerName, value: item.id });
      });
      setNetworkData(networks);
    }).catch(err => console.log(err))
  }
  const getMarketTypeData = () => {
    if (MarketType && MarketType.length > 0) {
      let list = MarketType.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setMarketTypeData(list);
      if(props.isEditSearch){
        if (props.filterCriteria.region && props.filterCriteria.region.length > 0 && props.filterCriteria.region[0].label === 'United States') {
          var selectedMarketType = list.filter(v => v.label == 'Domestic');
          setMarketType(selectedMarketType[0].value);
    
        } else {
          var selectedMarketType = list.filter(v => v.label == 'International');
          setMarketType(selectedMarketType[0].value);
        }

      }
    }
  }
  const getMediaTypeData = () => {
    GetMedium(-1).then(data => {
      if (data) {
        setMediumData(data);
        let list = data.map((item) => {
          return { label: item.mediumLookupDisplayText, value: item.mediumLookupId }
        });
        setMediaTypeData(list);
      }
      else console.log("GetMedium API is failing");
    }).catch((error) => {
      console.log('Error in GetMedium ', error);
    });
  }

  const getAssetData = (_marketType, _venturized, _mediaType) => {
    //debugger;
    if (_marketType === null)
      _marketType = marketType;
    if (_venturized === null)
      _venturized = venturized;
    if (_mediaType === null)
      _mediaType = mediaType;

    if (_marketType === null || _venturized === null || _mediaType === null)
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
    setRegion(value.value);
    setRegionName(value.label);
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
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedRegion(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
    setCountryName("");
    setTimeout(()=>{
      setRateTypeName("");
    }, 1000);
    
  };

  const handleCountryChange = (name, value) => {
    setCountry(value.value);
    setCountryName(value.label);
    let temp = selectedCountry.slice();
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedCountry(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
    setTimeout(()=>{
      setCountryName("");
    }, 1000);
  };

  const handleMediaTypeChange = (name, value) => {
    setMediaType(value.value);
    setMediaTypeName(value.label);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, value);
    }
    getAssetData(null, null, value.value);
    
  };
  const handleNetworkChange = (name, value) => {
    setNetwork(value.value);
    setNetworkName(value.label);
    let temp = selectedPartner.slice();
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedPartner(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  };

  const handleAssetChange = (name, value) => {
    setAsset(value.value);
    setAssetName(value.label);
    let temp = selectedAssets.slice();
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedAssets(temp);
    }
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  };

  const handleRegionDelete = (name, value) => {
    let temp = selectedRegions.slice();
    let tempSelectedCountry = selectedCountry.slice();
    let index = temp.findIndex(t=>t.label === value);
    temp.splice(index,1);
    setSelectedRegion(temp);
    let tempCountry = tempSelectedCountry.filter(ele => ele.regionId !== value) ;
    setSelectedCountry(tempCountry);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
      props.setFilterCriteria("country", tempCountry);
    }
  }

  const handleNetworksDelete = (name, value) => {
    let temp = selectedPartner.slice();    
    let index = temp.findIndex(t=>t.label === value);
    temp.splice(index,1);
    setSelectedPartner(temp);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }

  const handleAssetsDelete = (name, value) => {
    let temp = selectedAssets.slice();    
    let index = temp.findIndex(t=>t.label === value);
    temp.splice(index,1);
    setSelectedAssets(temp);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }

  const handleCountryDelete = (name, value) => {
    let temp = selectedCountry.slice();
    let index = temp.findIndex(t=>t.label === value);
    temp.splice(index,1);
    setSelectedCountry(temp);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }

  useEffect(()=>{
    if(props.filterCriteria){
      setSelectedRegion(props.filterCriteria.region || []);
      setSelectedCountry(props.filterCriteria.country || []);
      setMediaTypeName(props.filterCriteria.mediaType
        && props.filterCriteria.mediaType.label 
        ? props.filterCriteria.mediaType.label : ""
      );

      setSelectedPartner(props.filterCriteria.partner 
        ? props.filterCriteria.partner : ""
      );

      setSelectedAssets(props.filterCriteria.asset 
        ? props.filterCriteria.asset : "");

      if(props.filterCriteria.mediaType  
        && props.filterCriteria.mediaType.value) {
          getAssetData(null, null, props.filterCriteria.mediaType.value,)
      }
    }

    if(props.isEditSearch){
      if(props.filterCriteria.region && props.filterCriteria.region.length > 0){
        getCountryData(props.filterCriteria.region[0]);

        if (props.filterCriteria.region[0].label === 'United States') {
          getAssetData(111, 952, props.filterCriteria.mediaType.value);
    
        } else {
          getAssetData(112, 952, props.filterCriteria.mediaType.value);
        }
      }
      
    }
  }, [props.filterCriteria])
 
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        <Grid container alignItems="center" spacing={1}>

          <Grid item xs={4}>
            <MultiSelectDropdown size="small" name="region" id="region" variant="outlined" showLabel={true} lbldropdown="Region" handleChange={handleRegionChange} ddData={regionData ? regionData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedRegions && <ChipsList name="region" size="small" handleDelete={handleRegionDelete} 
              showDelete={true} label="" data={selectedRegions}/>}
          </Grid>
          <Grid item xs={4}>
            <MultiSelectDropdown size="small" name="country"  id="country" variant="outlined" showLabel={true} lbldropdown="Country" handleChange={handleCountryChange} ddData={countryData ? countryData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedCountry && <ChipsList name="country" size="small" handleDelete={handleCountryDelete} 
                showDelete={true} label="" data={selectedCountry}/>}  
          </Grid>
          <Grid item xs={4}>
            <Dropdown value={mediaTypeName} size="small" name="mediaType" id="mediaType" variant="outlined" showLabel={true} lbldropdown="Media Type" handleChange={handleMediaTypeChange} ddData={mediaTypeData ? mediaTypeData : []} />
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <MultiSelectDropdown size="small" value={networkName} name="partner" id="partner" variant="outlined" showLabel={true} lbldropdown="Partner" handleChange={handleNetworkChange} ddData={networkData ? networkData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedPartner && <ChipsList name="partner" size="small" handleDelete={handleNetworksDelete} 
              showDelete={true} label="" data={selectedPartner}/>}
          </Grid>
          <Grid item xs={4}>
            <MultiSelectDropdown size="small" id="asset" name="asset" value={assetName} variant="outlined" showLabel={true} lbldropdown="Asset" handleChange={handleAssetChange} ddData={assetData ? assetData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedAssets && <ChipsList name="asset" size="small" handleDelete={handleAssetsDelete} 
              showDelete={true} label="" data={selectedAssets}/>}
          </Grid>

        </Grid>
      </Box>
    </>
  );

}
export default RateCardFilterStepOne;

