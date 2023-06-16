// Global Imports - Start
import React, { useState, useEffect, useContext } from 'react';
import { Box, IconButton, Grid, TextField, Button } from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";

// Global Imports - End
// Local Imports - Start
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import * as AppConstants from '../../../common/AppConstants';
import { GetLookupById, GetPartnerByType, GetAssets, GetRegions, GetCountries, GetUnitSizes, GetUnitTypes, GetMedium, GetChannels } from '../../../services/common.service';
import { InsertRateCard } from '../../../services/rate.service';
import AppDataContext from '../../../common/AppContext';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';

// Local Imports - End


if (typeof window !== "undefined") {
  injectStyle();
}
const useStyles = makeStyles((theme) => ({
  radioGroupPadding: {
    paddingBottom: theme.spacing(1),
  },
  contentHeight: {
    height: 'calc(100vh - 176px)',
    overflowY: 'auto',
  },
  Alert: {
    margin: theme.spacing(1),
  },
  spliUnitHeader: {
    backgroundColor: '#f8f8f8'
  },
  units: {
    height: theme.spacing(6),
    marginTop: theme.spacing(1.5),
  },
  unitGrid: {
    height: theme.spacing(24),
    overflowY: 'scroll'
  },
}));
const AddRateCard = (props) => {
  const classes = useStyles();
 
  const { username, leagueInfo, leagueId } = useContext(AppDataContext);
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [venturized, setVenturized] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [marketType, setMarketType] = useState(null);
  const [asset, setAsset] = useState(null);
  const [network, setNetwork] = useState(null);
  const [unitType, setUnitType] = useState(null);
  const [rateType, setRateTye] = useState(null);
  const [daypart, setDaypart] = useState(null);
  const [unitSize, setUnitSize] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [assetName, setAssetName] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [venturizedName, setVenturizedName] = useState(null);
  const [mediaTypeName, setMediaTypeName] = useState(null);
  const [unitTypeName, setUnitTypeName] = useState(null);
  const [rateTypeName, setRateTypeName] = useState(null);
  const [daypartName, setDaypartName] = useState(null);
  const [unitSizeName, setUnitSizeName] = useState(null);
  const [rate, setRate] = useState(null);
  const [validFrom, setValidFrom] = useState(null);

  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [venturizedData, setVenturizedData] = useState([]);
  const [mediaTypeData, setMediaTypeData] = useState([]);
  const [mediumData, setMediumData] = useState([]);
  const [marketTypeData, setMarketTypeData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [unitTypeData, setUnitTypeData] = useState([]);
  const [rateTypeData, setRateTypeData] = useState([]);
  const [daypartData, setDaypartData] = useState([]);
  const [unitSizeData, setUnitSizeData] = useState([]);
  const { Venturized, MarketType, DayPartList } = React.useContext(AppDataContext);

  const [channelName, setChannelName] = useState("");
  const [channelId, setChannelId] = useState(0);
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    getRegionData();
    getVenturizedData();
    getMediaTypeData();
    getNetworkData();
    getRateTypeData();
    getMarketTypeData();
    getDaypartData();
  }, []);

  function notifySuccess(message) { toast.success(message) }
  function notifyWarning(message) { toast.warning(message) }

  const insertRateCard = (obj) => {
    InsertRateCard(obj)
      .then((data) => {
        if (data.data === -1) {
          notifyWarning(data.message);
        } else {
          notifySuccess("Rate Card saved successfully");
          props.setAction("closeAdd");

          if(props.refreshDataFromDB) {
            props.refreshDataFromDB();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //.....Dropdown data handlers - Start
  const getRegionData = () => {
    GetRegions().then((data) => {
      let region = [];
      data.map(item => {
        region.push({ label: item.regionName, value: item.id });
      });
      setRegionData(region);
    }).catch(err => console.log(err))
  }

  const getCountryData = (id) => {
    GetCountries(id).then((data) => {
      let countries = [];
      data.map(item => {
        countries.push({ label: item.countryName, value: item.id });
      });
      setCountryData(countries);
    }).catch(err => console.log(err))
  }

  const getNetworkData = () => {
    GetPartnerByType(AppConstants.PartnerType.Broadcaster).then((data) => {
      let networks = [];
      data.map(item => {
        networks.push({ label: item.partnerName, value: item.id });
      });
      setNetworkData(networks);
    }).catch(err => console.log(err))
  }

  const getChannelData = (id) => {
    let item = mediaTypeData.find(x=> x.value === mediaType);
    let type = item.mediaParentName === "Digital" && item.mediaTypeName === "OTT" ? 'OTT' : item.mediaParentName;

    GetChannels(id, type).then(data => {
      let channels = [];
      data.map(item => {
        channels.push({ label: item.channelName, value: item.id });
      });
      setChannelData(channels);
    }).catch(err => {
      console.log(err);
    })
  }

  const getVenturizedData = () => {
    if (Venturized && Venturized.length > 0) {
      let list = Venturized.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setVenturizedData(list);
      let nonVenture = list.filter(x => x.value === 952);
      setVenturized(nonVenture[0].value);
      setVenturizedName(nonVenture[0].label);
    }
  }

  const getMarketTypeData = () => {
    if (MarketType && MarketType.length > 0) {
      let list = MarketType.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setMarketTypeData(list);
    }
  }

  const getMediaTypeData = () => {
    GetMedium(-1).then(data => {
      if (data) {
        setMediumData(data);
        let list = data.map((item) => {
          return { label: item.mediumLookupDisplayText, value: item.mediumLookupId, mediaParentName: item.mediumLookupParentText, mediaTypeName: item.mediumLookupText }
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

  const getUnitSizes = (id) => {
    GetUnitSizes(id).then((data) => {
      let unitSizes = [];
      data.map(item => {
        unitSizes.push({ label: item.unitSize, value: item.id });
      });
      setUnitSizeData(unitSizes);
    }).catch(err => console.log(err))
  }

  //.....Dropdown data handlers - End

  //Form Input Handlers - Start
  const handleRegionChange = (name, value) => {
    setRegion(value.value);
    setRegionName(value.label);
    if (value.label === 'United States') {
      var selectedMarketType = marketTypeData.filter(v => v.label === 'Domestic');
      setMarketType(selectedMarketType[0].value);

    } else {
      var selectedMarketType = marketTypeData.filter(v => v.label === 'International');
      setMarketType(selectedMarketType[0].value);
    }
    getAssetData(selectedMarketType[0].value, null, null);
    getCountryData(value.value);
  };

  const handleCountryChange = (name, value) => {
    setCountry(value.value);
    setCountryName(value.label);
  };

  const handleVenturizedChange = (name, value) => {
    setVenturized(value.value);
    setVenturizedName(value.label);
    getAssetData(null, value.value, null);
  };

  const handleMediaTypeChange = (name, value) => {
    setMediaType(value.value);
    setMediaTypeName(value.label);
    let nonPrime = DayPartList.find(x => x.lookupText.toUpperCase() === 'NON-PRIME');
    setDaypart(nonPrime.lookupId)
    setDaypartName(nonPrime.lookupText)
    setUnitTypeData([]);
    setUnitSizeData([]);
    setUnitTypeName('');
    setUnitSizeName('');
    setUnitType(null);
    setUnitSize(null);
    getAssetData(null, null, value.value);
    let mediumLst = mediumData.filter(x => x.mediumLookupId === value.value);
    if (mediumLst !== null && mediumLst.length > 0)
      getUnitTypeData(mediumLst[0].mediumLookupId);
  };

  const handleNetworkChange = (name, value) => {
    setNetwork(value.value);
    setNetworkName(value.label);
    getChannelData(value.value);
  };

  const handleAssetChange = (name, value) => {
    setAsset(value.value);
    setAssetName(value.label);
  };

  const handleChannelChange = (name, value) => {
    setChannelId(value.value);
    setChannelName(value.label);
  }

  const handleUnitTypeChange = (name, value) => {
    setUnitSizeName("")
    setUnitType(value.value);
    setUnitTypeName(value.label);
    getUnitSizes(value.value);
  };

  const handleUnitSizeChange = (name, value) => {
    setUnitSize(value.value);
    setUnitSizeName(value.label);
  };

  const handleRateTypeChange = (name, value) => {
    setRateTye(value.value);
    setRateTypeName(value.label);
  };

  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handleValidFromChange = (e) => {
    setValidFrom(e.target.value);
  };
  const handleDaypartChange = (name, value) => {
    setDaypart(value.value);
    setDaypartName(value.label);
  };

  const handleSubmit = (param) => {
    if (param === 'cancel') {
      props.setAction("closeAdd");
    } else if (param === "submit") {
      if (!leagueId) {
        notifyWarning('League Id cannot be undefined');
        return;
      }
      if (!leagueInfo) {
        notifyWarning('Please Select League Name');
        return;
      }
      if (!region) {
        notifyWarning('Please Select Region');
        return;
      }
      if (!regionName) {
        notifyWarning('Please Select Region Name');
        return;
      }
      if (!country) {
        notifyWarning('Please Select Country');
        return;
      }
      if (!countryName) {
        notifyWarning('Please Select Country Name');
        return;
      }
      if (!mediaType) {
        notifyWarning('Please Select MediaType');
        return;
      }
      if (!mediaTypeName) {
        notifyWarning('Please Select MediaType Name');
        return;
      }
      if (!network) {
        notifyWarning('Please Select Network');
        return;
      }
      if (!networkName) {
        notifyWarning('Please Select Partner Name');
        return;
      }
      if (!asset) {
        notifyWarning('Please Select Asset');
        return;
      }
      if (!assetName) {
        notifyWarning('Please Select Asset Name');
        return;
      }
      if (!unitType) {
        notifyWarning('Please Select Unit Type');
        return;
      }
      if (!unitTypeName) {
        notifyWarning('Please Select Unit Type Name');
        return;
      }
      if (!unitSize) {
        notifyWarning('Please Select Unit Size');
        return;
      }
      if (!unitSizeName) {
        notifyWarning('Please Select Unit Size Name');
        return;
      }

      if (!rateType) {
        notifyWarning('Please Select Rate Type');
        return;
      }
      if (!rateTypeName) {
        notifyWarning('Please Select Rate Type Name');
        return;
      }
      if (!daypart) {
        notifyWarning('Please Select Day Part');
        return;
      }
      if (!daypartName) {
        notifyWarning('Please Select Day Part Name');
        return;
      }
      if (!rate) {
        notifyWarning('Please Select Rate');
        return;
      }
      if (!validFrom) {
        notifyWarning('Please Select Date for Valid From');
        return;
      }
      if (rate <= 0) {
        notifyWarning('Rate value cannot be less than or equal to 0');
        return;
      }


      let reqObj = {
        "rateCardMasterId": 0,
        "customerRateId": 0,
        "customerId": 0,
        "leagueId": leagueId,
        "leagueName": leagueInfo,
        "regionId": region,
        "countryId": country,
       
        "regionName": regionName,
        "mediaTypeId": mediaType,
        "mediaTypeName": mediaTypeName,
        "venturizedId": venturized,
        "venturizedName": venturizedName,
        "networkId": network,
        "networkName": networkName,
        "assetId": asset,
        "assetName": assetName,
        "unitTypeId": unitType,
        "unitTypeName": unitTypeName,
        "unitSizeId": unitSize,
        "unitSizeName": unitSizeName,
        "rateTypeId": rateType,
        "rateTypeName": rateTypeName,
        "dayPartId": daypart,
        "dayPartName": daypartName,
        "rate": rate,
        "channelId": channelId,
        "validFrom": validFrom,
        "isLatest": true,
        "createdBy": username,
        "createdDate": new Date(),
      };
      insertRateCard(reqObj)
    }
  }
  //Form Input Handlers - End

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" flexDirection='row' justifyContent="space-between">
              <IconButton title={'Add Rate Card'} size="small" color='secondary'>
                <LocalOfferOutlinedIcon />
              </IconButton>
              <GridHeader hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText={'Add Rate Card'} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        <Grid container alignItems="center" spacing={1}>

          <Grid item xs={4}>
            <Dropdown size="small" id="region" variant="outlined" showLabel={true} lbldropdown="Region" handleChange={handleRegionChange} ddData={regionData ? regionData : []} />
          </Grid>
          <Grid item xs={4}>
            <Dropdown size="small" id="country" variant="outlined" showLabel={true} lbldropdown="Country" handleChange={handleCountryChange} ddData={countryData ? countryData : []} />
          </Grid>
          <Grid item xs={4} style={{ display: "none" }}>
            <Dropdown size="small" id="Venturized" variant="outlined" showLabel={true} lbldropdown="Venturized" handleChange={handleVenturizedChange} ddData={venturizedData ? venturizedData : []} />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Dropdown size="small" id="MediaType" variant="outlined" showLabel={true} lbldropdown="Media Type" handleChange={handleMediaTypeChange} ddData={mediaTypeData ? mediaTypeData : []} />
          </Grid>
          <Grid item xs={4}>
            <Dropdown size="small" id="network" variant="outlined" showLabel={true} lbldropdown="Partner" handleChange={handleNetworkChange} ddData={networkData ? networkData : []} />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <Dropdown value={channelName} size="small" name="channel" id="channel" variant="outlined" showLabel={true} lbldropdown="Channel" handleChange={handleChannelChange} ddData={channelData ? channelData : []} />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <Dropdown size="small" id="asset" variant="outlined" showLabel={true} lbldropdown="Asset" handleChange={handleAssetChange} ddData={assetData ? assetData : []} />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Dropdown size="small" id="unittype" value={unitTypeName} variant="outlined" showLabel={true} lbldropdown="Unit Type" handleChange={handleUnitTypeChange} ddData={unitTypeData ? unitTypeData : []} />
          </Grid>
          <Grid item xs={4}>
            <Dropdown size="small" id="unitsize" value={unitSizeName} variant="outlined" showLabel={true} lbldropdown="Unit Size" handleChange={handleUnitSizeChange} ddData={unitSizeData ? unitSizeData : []} />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Dropdown size="small" id="ratetype" variant="outlined" showLabel={true} lbldropdown="Rate Type" handleChange={handleRateTypeChange} ddData={rateTypeData ? rateTypeData : []} />
          </Grid>
          {
            mediaTypeName === "TV - Game" ?
            <><Grid item xs={4}>
              <Dropdown value={daypartName} size="small" id="daypart" variant="outlined" showLabel={true} lbldropdown="Day Part" handleChange={handleDaypartChange} ddData={daypartData ? daypartData : []} />
            </Grid>
            <Grid item xs={4}></Grid></>: ""
          }
          <Grid item xs={4}>
            <TextField fullWidth id="rate" size="small" variant="outlined"
              type="number" label="Rate"
              InputProps={{
                inputProps: {
                  max: 100, min: 1
                }
              }}
              value={rate} onChange={handleRateChange} />
          </Grid>
          {
            mediaTypeName !== "TV - Game" ? <Grid item xs={4}></Grid> : ""
          }
          <Grid item xs={4}>
            <TextField fullWidth id="validFrom" size="small" variant="outlined"
              type="date" label="Valid From" InputLabelProps={{ shrink: true }}
              value={validFrom} onChange={handleValidFromChange} />
          </Grid>


        </Grid>
        <Box component="div" p={1.5}>
          <Grid container xs={12} justifyContent="flex-end">
            <Button color="secondary" onClick={() => handleSubmit('cancel')} size='small' sx={{ marginRight: '8px' }}>Cancel</Button>
            <Button variant="contained" onClick={() => handleSubmit('submit')} size='small' color="primary">Confirm</Button>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
export default AddRateCard;