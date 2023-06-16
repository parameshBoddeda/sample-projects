import React, { useState, useEffect, useContext } from 'react';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import { ToastContainer, toast } from "react-toastify";
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import MulltiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import * as AppConstants from '../../../common/AppConstants';
import {Box,Paper,Grid,Button,  Backdrop, } from '@mui/material';
import {
  GetLookupById,
  GetPartnerByType,
  GetAssets,
  GetRegions,
  GetCountries,
  GetUnitSizes,
  GetUnitTypes,
  GetMedium,
  GetPartnerByInventory,
  GetAssetsParent,
}
  from '../../../services/common.service';
import AppDataContext from '../../../common/AppContext';
import PickDateRange from '../../../sharedComponents/PickDateRange/PickDateRange';


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
const ProgrammingFiltersStepOne = (props) => {
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

  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [venturizedData, setVenturizedData] = useState([]);
  const [mediaTypeData, setMediaTypeData] = useState([
    {label: "TV", value: 150},
    {label: "Radio", value: 200}
  ]);
  const [mediumData, setMediumData] = useState([]);
  const [marketTypeData, setMarketTypeData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const [selectedRegions, setSelectedRegion] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  useEffect(() => {
    getRegionData();
    getVenturizedData();
    if(props.isSchedulePlan){
      getMediaTypeData();
    }
    // getPartnerData();
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
        countries.push({ label: item.countryName, value: item.id, region: region.label });
      });
      setCountryData(countries);
    }).catch(err => console.log(err))
  }

  // const getPartnerData = () => {
  //   GetPartnerByType(AppConstants.PartnerType.Broadcaster).then((data) => {
  //     let networks = [];
  //     data.map(item => {
  //       networks.push({ label: item.partnerName, value: item.id });
  //     });
  //     setNetworkData(networks);
  //   }).catch(err => console.log(err))
  // }

  const getPartnerData = (selectedMediaType, regionId) => {
    
    if(selectedMediaType===null||regionId===null) return

  setShowLoading(true);
  setOpenBackdrop(true);


  GetPartnerByInventory(leagueId, selectedMediaType, regionId ).then((data) => {
    let networks = [];
    data.forEach(item => {
      networks.push({ label: item.partnerName, value: item.id });
    });
    setNetworkData(networks);
    setShowLoading(false);
    setOpenBackdrop(false);
  }).catch(err => {
    console.log(err);
    setShowLoading(false);
    setOpenBackdrop(false);
  })

}

useEffect(()=>{
  if(selectedRegions.length===0){
    setNetworkData([])
    return
  }
  if(selectedRegions.length>0){
    let mapped = selectedRegions.map(item=>item.value)
    getPartnerData(mediaType,mapped)
  
  }
},[selectedRegions,mediaType]);

useEffect(()=>{
  if(props.isEditSearches){
    if(props.filterCriteria && props.filterCriteria.region && props.filterCriteria.region.length>0){
      let mapped = props.filterCriteria.region.map(item=>item.value);
      if(props.filterCriteria.mediaType && props.filterCriteria.mediaType.value){
        getPartnerData(props.filterCriteria.mediaType.value, mapped);
      }
    }
    if(props.filterCriteria.region && props.filterCriteria.region.length > 0){
      getCountryData(props.filterCriteria.region[0]);
    }    

    setMarketType(112);
    setVenturized(952);

    if(props.filterCriteria.mediaType && props.filterCriteria.mediaType.value){
      getAssetData(112, 952, props.filterCriteria.mediaType.value);
    }
  }
}, [props.isEditSearches])



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

      if(!props.isSchedulePlan){

        GetAssetsParent(leagueId, _marketType, _venturized, _mediaType).then(data => {
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

      } else {

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

      
  }
  
  const handleRegionChange = (name, value) => {
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
  const handleNetworkChange = (name, value) => {
    setNetwork(value.value);
    setNetworkName(value.label);
    let temp = selectedNetworks.slice();
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedNetworks(temp);
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
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedRegion(temp);
    let tempCountry = tempSelectedCountry.filter(ele => ele.region !== value);
    setSelectedCountry(tempCountry);
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
      props.setFilterCriteria("country", tempCountry);
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

  useEffect(() => {
    if (props.filterCriteria) {
      setSelectedRegion(props.filterCriteria.region || []);
      setSelectedCountry(props.filterCriteria.country || []);
      setMediaTypeName(props.filterCriteria.mediaType
        && props.filterCriteria.mediaType.label
        ? props.filterCriteria.mediaType.label : ""
      );
      setStartDate(props.filterCriteria.startDate || null);
      setEndDate(props.filterCriteria.endDate || null);

      setSelectedNetworks(props.filterCriteria.network
        && props.filterCriteria.network
        ? props.filterCriteria.network : ""
      );

      setSelectedAssets(props.filterCriteria.asset
        && props.filterCriteria.asset
        ? props.filterCriteria.asset : "");

      if (props.filterCriteria.mediaType
        && props.filterCriteria.mediaType.value) {
        getAssetData(null, null, props.filterCriteria.mediaType.value)
      }
    }

  }, [props.filterCriteria]);

  const handleGenerate = (data) => {
    
  }

  const handleEndDateChange = (value) => {
    setEndDate(value);
    if(props.setFilterCriteria) {
      props.setFilterCriteria("endDate", value);
    }
  }

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if(props.setFilterCriteria) {
      props.setFilterCriteria("startDate", value);
    }
  }

  const handleNetworksDelete = (name, value) => {
    let temp = selectedNetworks.slice();    
    let index = temp.findIndex(t=>t.label === value);
    temp.splice(index,1);
    setSelectedNetworks(temp);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
    //props.getSelectedCampaign(temp);
  }

  const handleAssetsDelete = (name, value) => {
    let temp = selectedAssets.slice();    
    let index = temp.findIndex(t=>t.label === value);
    temp.splice(index,1);
    setSelectedAssets(temp);
    if(props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
    //props.getSelectedCampaign(temp);
  }





  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        <Grid container alignItems="center" spacing={1}>

          <Grid item xs={8}>
            <PickDateRange startDate={startDate} endDate={endDate}
              setStartDate={handleStartDateChange} setEndDate={handleEndDateChange}
            />

          </Grid>
          <Grid item xs={4}></Grid>

          <Grid item xs={4}>
            <MulltiSelectDropdown size="small" name="region" id="region" variant="outlined" showLabel={true} lbldropdown="Region" handleChange={handleRegionChange} ddData={regionData ? regionData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedRegions && <ChipsList name="region" size="small" handleDelete={handleRegionDelete}
              showDelete={true} label="" data={selectedRegions} />}
          </Grid>
          <Grid item xs={4}>
            <MulltiSelectDropdown size="small" name="country" id="country" variant="outlined" showLabel={true} lbldropdown="Country" handleChange={handleCountryChange} ddData={countryData ? countryData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedCountry && <ChipsList name="country" size="small" handleDelete={handleCountryDelete}
              showDelete={true} label="" data={selectedCountry} />}
          </Grid>
          <Grid item xs={4}>
            <Dropdown value={mediaTypeName} size="small" name="mediaType" id="mediaType" variant="outlined" showLabel={true} lbldropdown="Media Type" handleChange={handleMediaTypeChange} ddData={mediaTypeData ? mediaTypeData : []} />
          </Grid>

          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <MulltiSelectDropdown size="small" value={networkName} name="network" id="partner" variant="outlined" showLabel={true} lbldropdown="Network" handleChange={handleNetworkChange} ddData={networkData ? networkData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedNetworks && <ChipsList name="network" size="small" handleDelete={handleNetworksDelete} 
              showDelete={true} label="" data={selectedNetworks}/>}
          </Grid>
          <Grid item xs={4}>
            <MulltiSelectDropdown size="small" id="asset" name="asset" value={assetName} variant="outlined" showLabel={true} lbldropdown="Asset" handleChange={handleAssetChange} ddData={assetData ? assetData : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedAssets && <ChipsList name="asset" size="small" handleDelete={handleAssetsDelete} 
              showDelete={true} label="" data={selectedAssets}/>}
          </Grid>

        </Grid>
      </Box>

      {showLoading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={openBackdrop}
        >
          <div className={"loader-div"}>
            <div className={"loading"}></div>
          </div>
        </Backdrop>
      )}
    </>
  );

}
export default ProgrammingFiltersStepOne;

