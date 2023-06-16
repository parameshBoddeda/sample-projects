import React, { useState, useEffect, useContext } from 'react';

import ChipsList from '../../../sharedComponents/chips/ChipsList';
import * as AppConstants from '../../../common/AppConstants';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { Grid, Box, Button, Typography, Paper, Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AppDataContext from '../../../common/AppContext';
import PickDateRange from '../../../sharedComponents/PickDateRange/PickDateRange';
import { ToastContainer, toast } from "react-toastify";
import MulltiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown'
import {
  GetNetworkByRegion,
  GetPartnerByType,
  GetAssets,
    GetAssetsParent,
    GetAssetsByInventoryPlanning,
  GetRegions,
  GetCountries,
  GetMedium,
    GetPartnerByInventory,
    GetPartnerByInventoryPlanning,
    GetLookupById,
    GetReportUrl,
}
  from '../../../services/common.service';
import Backdrop from "@mui/material/Backdrop";
import DrawerComponent from '../../../sharedComponents/Drawer/DrawerComponent';
import TraffickLetterViewer from './TraffickLetterViewer';
import {
    GenerateTrafficLetter, MarkAsTrafficked,
    GetRevisionNumber,
    GetTraffickedPartner,
    GetTraffickedAsset
} from '../../../services/trafficking.service';
import TraffickStatusUI from './TraffickStatusUI';
import Helper from '../../../common/Helper'
import axios from 'axios';


function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  contentAreaAppBar: {
      display: "flex",
      justifyContent: 'space-between',
      padding: '5px 25px',
      alignItems: 'center',
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: "40%",
      // height: 'calc(100vh - 150px)',
      overflow: "hidden",
      // margin: "130px 16px 0 0px",
      // padding: theme.spacing(2, 1),
    },
  }
}));

const TraffickLetterUI = (props) => {
  const classes = useStyles();
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const { leagueId, Venturized, MarketType } = useContext(AppDataContext);
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
  const [revision, setRevision] = useState(null);
  const [revisionMax, setRevisionMax] = useState(null);
  const [revisionName, setRevisionName] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [revisionData, setRevisionData] = useState([]);
  const [mediaTypeData, setMediaTypeData] = useState([
    {label: "TV", value: 150},
    {label: "Radio", value: 200}
  ]);
  const [mediumData, setMediumData] = useState([]);
  const [marketTypeData, setMarketTypeData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const { username } = React.useContext(AppDataContext);
  const [selectedRegions, setSelectedRegion] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [traffickLetterParams, setTraffickLetterParams] = useState();
  const [showTraffickLetterPreview, setShowTraffickLetterPreview] = useState(false);
  const [scheduleIds, setscheduleIds] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState([]);
  const [failedObj, setFailedObj] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    getRegionData();
    getVenturizedData();
    // getPartnerData();
      getMarketTypeData();
      getGetRevisionLookupData();
  }, []);

  const getVenturizedData = () => {
    if (Venturized && Venturized.length > 0) {
      let list = Venturized.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      let nonVenture = list.filter(x => x.value == 952);
      setVenturized(nonVenture[0].value);
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
  // const getPartnerData = () => {
  //   GetPartnerByType(AppConstants.PartnerType.Broadcaster).then((data) => {
  //     let networks = [];
  //     data.map(item => {
  //       networks.push({ label: item.partnerName, value: item.id });
  //     });
  //     setPartnerData(networks);
  //   }).catch(err => console.log(err))
  // }
  const getMarketTypeData = () => {
    if (MarketType && MarketType.length > 0) {
      let list = MarketType.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setMarketTypeData(list);
    }
    }

    const getGetRevisionLookupData = () => {
        GetLookupById(1750).then((data) => {
            let revisions = [];
            data.map(item => {
                revisions.push({ label: item.lookupText, value: item.lookupId });
            });
            setRevisionData(revisions);

            let revision = data[0];
            setRevision(revision.lookupId);
            setRevisionName(revision.lookupText)

        });
        //if (MarketType && MarketType.length > 0) {
        //    let list = MarketType.map((item) => {
        //        return { label: item.lookupText, value: item.lookupId }
        //    });
        //    setMarketTypeData(list);
        //}
    }
  

  const getAssetData = (_marketType, _venturized, _mediaType, _partnerId) => {
    if (_marketType === null)
      _marketType = marketType;
    if (_venturized === null)
      _venturized = venturized;
    if (_mediaType === null)
          _mediaType = mediaType;
    if (_partnerId === null)
        _partnerId = partner;

    if (_marketType === null || _venturized === null || _mediaType === null)
      return;

      GetAssetsByInventoryPlanning(leagueId, _marketType, _venturized, _mediaType, _partnerId).then(data => {
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

    const handleStartDateChange = (val) => {
        setStartDate(val);
        //var obj = {};
        //obj["startDate"] = val;
        //getRevision(obj);
    }
    const handleEndDateChange = (val) => {
        setEndDate(val);
        //var obj = {};
        //obj["endDate"] = val;
        //getRevision(obj);
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
    getCountryData(value);
    setCountryName();
    setCountry();
      //var obj = {};
      //obj["region"] = value.value;
      //getRevision(obj);
  };

  const handleCountryChange = (name, value) => {
      setCountry(value.value);
      setCountryName(value.label);
      //var obj = {};
      //obj["country"] = value.value;
      //getRevision(obj);
  };

  const handleMediaTypeChange = (name, value) => {
    setMediaType(value.value);
    setMediaTypeName(value.label);
      //getAssetData(null, null, value.value, null);
      //var obj = {};
      //obj["mediaType"] = value.value;
      //getRevision(obj);
  };
  const handleNetworkChange = (name, value) => {
    setNetwork(value.value);
    setNetworkName(value.label);
    let temp = selectedNetwork.slice();
    let index = temp.findIndex(t => t.value === value.value);
    if (index <= -1) {
      temp.push(value);
      setSelectedNetwork(temp);
    }
  };
  const handlePartnerChange = (name, value) => {
    setPartner(value.value);
      setPartnerName(value.label);
      //getAssetData(null, null, null, value.value);
    // getNetworkData(value, region, mediaType);
      //var obj = {};
      //obj["partner"] = value.value;
      //getRevision(obj);
    }

    const handleRevisionChange = (name, value) => {
        setRevision(value.value);
        setRevisionName(value.label);
       
        // getNetworkData(value, region, mediaType);
    }

  const handleAssetChange = (name, value) => {
    setAsset(value.value);
    setAssetName(value.label);
    let temp = selectedAsset.slice();
    let index = temp.findIndex(t => t.value === value.value);
    if (index <= -1) {
      temp.push(value);
      setSelectedAsset(temp);
      }
      //var obj = {};
      //obj["asset"] = value.value;
      //getRevision(obj);
  };

  const handleRegionDelete = (name, value) => {
    let temp = selectedRegions.slice();
    let tempSelectedCountry = selectedCountry.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedRegion(temp);
    let tempCountry = tempSelectedCountry.filter(ele => ele.regionId !== value);
    setSelectedCountry(tempCountry);
  }

  const handleCountryDelete = (name, value) => {
    let temp = selectedCountry.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedCountry(temp);
  }

  const handleNetworkDelete = (name, value) => {
    let temp = selectedNetwork.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedNetwork(temp);
  }

  const handleAssetDelete = (name, value) => {
    let temp = selectedAsset.slice();
    let index = temp.findIndex(t => t.label === value);
    temp.splice(index, 1);
    setSelectedAsset(temp);
  }
  
  
  const handleGenerate = (isGenerate) => {
    setShowTraffickLetterPreview(false);
    let obj = {};
    if(startDate){
      obj["startDate"] = startDate;
    } else {
      notifyWarning("Please select Start Date.");
      return false;
    }
    if(endDate){
      obj["endDate"] = endDate;
    } else {
      notifyWarning("Please select End Date.");
      return false
    }
    if(region){
      obj["region"] = region;
    } else {
      notifyWarning("Please Select Region.");
      return false;
    }
    if(country){
      obj["country"] = country;
    }else {
      notifyWarning("Please Select Country.");
      return false;
    }
    if(mediaType){
      obj["mediaType"] = mediaType;
    } else {
      notifyWarning("Please Select Media Type.");
      return false
    }
    if(partner){
      obj["partner"] = partner;
    } else {
      notifyWarning("Please Select Partner.");
      return false
    }
    if(selectedNetwork.length > 0){
      obj["network"] = selectedNetwork;
    }
      if (selectedAsset.length > 0){
      obj["asset"] = selectedAsset;
      } else {
          let tempAsset = [];
          tempAsset.push({ value: -1 });
          obj["asset"] = tempAsset;

    }

    let networkIds = "";
    if(obj.network && obj.network.length > 0) {
      obj.network.map(ele => {
        if(networkIds !== "") {
          networkIds = networkIds + "," + ele.value;
        } else {
          networkIds = ele.value.toString();
        }
      });
    }

    let params = {
      startDate: obj.startDate,
      endDate: obj.endDate,
      regionId: obj.region ? obj.region.toString() : "",
      countryId: obj.country ? obj.country.toString() : "",
      partnerId: obj.partner ? obj.partner.toString() : "",
      networkId: networkIds.toString(),
      assetId: obj.asset,
      user: username,
      mediaType: obj.mediaType.toString()

  }
  setTraffickLetterParams(params);
  setShowTraffickLetterPreview(true);
  }


  const handleMarkAsTrafficked = (date) => {
    let obj = {};
    if (startDate) {
      obj["startDate"] = startDate;
    } else {
      notifyWarning("Please select Start Date.");
      return false;
    }
    if (endDate) {
      obj["endDate"] = endDate;
    } else {
      notifyWarning("Please select End Date.");
      return false
    }
    if (region) {
      obj["region"] = region;
    } else {
      notifyWarning("Please Select Region.");
      return false;
    }
    if (country) {
      obj["country"] = country;
    } else {
      notifyWarning("Please Select Country.");
      return false;
    }
    if (mediaType) {
      obj["mediaType"] = mediaType;
    } else {
      notifyWarning("Please Select Media Type.");
      return false
    }
    if (partner) {
      obj["partner"] = partner;
    } else {
      notifyWarning("Please select Partner.");
      return false
    }
    if (selectedNetwork.length > 0) {
      obj["network"] = selectedNetwork;
    }
      if (selectedAsset.length > 0) {
      obj["asset"] = selectedAsset;
    } else {
          obj["asset"] = null;
      //notifyWarning("Please select Asset.");
      //return false
      }
    if (revision) {
        obj["revision"] = revision;
    } else {
        obj["revision"] = null;
        notifyWarning("Please select RevisionNumber.");
       return false
    }

    let networkIds = "";
    if (obj.network && obj.network.length > 0) {
      obj.network.map(ele => {
        if (networkIds !== "") {
          networkIds = networkIds + "," + ele.value;
        } else {
          networkIds = ele.value.toString();
        }
      });
    }

    let assetIds = "";
      if (obj.asset && obj.asset.length > 0) {
          obj.asset.map(ele => {
              if (assetIds !== "") {
                  assetIds = assetIds + "," + ele.value;
              } else {
                  assetIds = ele.value.toString();
              }
          });
      }
      else {
          assetIds = "-1";
      }

    let params = {
      startDate: obj.startDate,
      endDate: obj.endDate,
      regionId: obj.region ? obj.region.toString() : "",
      countryId: obj.country ? obj.country.toString() : "",
      partnerId: obj.partner ? obj.partner.toString() : "",
      networkId: networkIds.toString(),
      assetId: assetIds.toString(),
      user: username,
      mediaType: obj.mediaType.toString(),
      revisionNumber: obj.revision.toString()

    }

    setShowLoading(true);
    setOpenBackdrop(true);
    MarkAsTrafficked(params).then(data => {
        setRevisionMax(revisionName);
      if(data.data) {
        setFailedObj(JSON.parse(data.data));
        setShowDrawer(true);
      }
      if (data.status) {
        if(!data.data){
          notifySuccess("Schedules marked as trafficked successfully.");
          
        } else {
          notifyWarning("Schedules are not ready for trafficking. Please refer the schedule list.");
        }
        
      } else {
        notifyWarning("Schedules are not ready for trafficking. Please refer the schedule list.");
        
      }
      props.refreshPage(true);
      setShowLoading(false);
      setOpenBackdrop(false);
    }).catch(err => {
      console.log("Error ", err);
      setShowLoading(false);
      setOpenBackdrop(false);
    });
    }


    const getRevision = () => {
        let obj = {};
        obj["leagueId"] = leagueId;
        if (startDate) {
            obj["startDate"] = startDate;
        } else {
            return false;
        }
        if (endDate) {
            obj["endDate"] = endDate;
        } else {
            return false
        }
        if (region) {
            obj["region"] = region;
        } else {
            return false;
        }
        if (country) {
            obj["country"] = country;
        } else {
            return false;
        }
        if (mediaType) {
            obj["mediaType"] = mediaType;
        } else {
            return false
        }
        if (partner) {
            obj["partner"] = partner;
        } else {
            return false
        }

        if (selectedAsset.length > 0) {
            obj["asset"] = selectedAsset;
        } else {
            obj["asset"] = null;
        }

        let assetIds = "";
        if (obj.asset && obj.asset.length > 0) {
            obj.asset.map(ele => {
                if (assetIds !== "") {
                    assetIds = assetIds + "," + ele.value;
                } else {
                    assetIds = ele.value.toString();
                }
            });
        }
        else {
            assetIds = "-1";
        }

        let params = {
            legaueId: obj.leagueId,
            startDate: obj.startDate,
            endDate: obj.endDate,
            regionId: obj.region ? obj.region.toString() : "",
            countryId: obj.country ? obj.country.toString() : "",
            partnerId: obj.partner ? obj.partner.toString() : "",
            assetId: assetIds.toString(),
            mediaType: obj.mediaType.toString()

        }
        setShowLoading(true);
        setOpenBackdrop(true);

        GetRevisionNumber(params).then((data) => {
            let revisions = [];
            data.map(item => {
             
                revisions.push({ label: item.lookupText, value: item.lookupId });
                setRevision(item.lookupId);
                setRevisionMax(item.lookupText);
                setRevisionName(item.lookupText)
            });

            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            console.log("Error ", err);
            setShowLoading(false);
            setOpenBackdrop(false);
        });
    }

    const getPartnerData = () => {
        let obj = {};
        
        obj["leagueId"] = leagueId;
        if (startDate) {
            obj["startDate"] = startDate;
        } else {
            return false;
        }
        if (endDate) {
            obj["endDate"] = endDate;
        } else {
            return false
        }
        if (region) {
            obj["region"] = region;
        } else {
            return false;
        }
        if (country) {
            obj["country"] = country;
        } else {
            return false;
        }
        if (mediaType) {
            obj["mediaType"] = mediaType;
        } else {
            return false
        }

        if (selectedAsset.length > 0) {
            obj["asset"] = selectedAsset;
        } else {
            obj["asset"] = null;
        }

        let assetIds = "";
        if (obj.asset && obj.asset.length > 0) {
            obj.asset.map(ele => {
                if (assetIds !== "") {
                    assetIds = assetIds + "," + ele.value;
                } else {
                    assetIds = ele.value.toString();
                }
            });
        }
        else {
            assetIds = "-1";
        }

        let params = {
            leagueId: obj.leagueId,
            startDate: obj.startDate,
            endDate: obj.endDate,
            regionId: obj.region ? obj.region.toString() : "",
            countryId: obj.country ? obj.country.toString() : "",
            mediaType: obj.mediaType.toString(),
            assetId: assetIds.toString(),
        }
        setShowLoading(true);
        setOpenBackdrop(true);

        GetTraffickedPartner(params).then((data) => {
            let partners = [];
            data.forEach(item => {
                partners.push({ label: item.partnerName, value: item.id });
            });
            setPartnerData(partners);
            setPartnerName(null)
            setPartner(null)
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            console.log("Error ", err);
            setShowLoading(false);
            setOpenBackdrop(false);
        });
    }

    const getAsset = () => {
        let obj = {};
        obj["leagueId"] = leagueId;
        if (startDate) {
            obj["startDate"] = startDate;
        } else {
            return false;
        }
        if (endDate) {
            obj["endDate"] = endDate;
        } else {
            return false
        }
        if (region) {
            obj["region"] = region;
        } else {
            return false;
        }
        if (country) {
            obj["country"] = country;
        } else {
            return false;
        }
        if (mediaType) {
            obj["mediaType"] = mediaType;
        } else {
            return false
        }
        if (partner) {
            obj["partner"] = partner;
        } else {
            return false
        }

        let params = {
            legaueId: obj.leagueId,
            startDate: obj.startDate,
            endDate: obj.endDate,
            regionId: obj.region ? obj.region.toString() : "",
            countryId: obj.country ? obj.country.toString() : "",
            partnerId: obj.partner ? obj.partner.toString() : "",
            mediaType: obj.mediaType.toString()

        }
        setShowLoading(true);
        setOpenBackdrop(true);

        GetTraffickedAsset(params).then((data) => {
            let list = data.map((item) => {
                return { label: item.assetDisplayName, value: item.id }
            });

            let distList = Array.from(new Set(list.map(a => a.value)))
                .map(id => {
                    return list.find(a => a.value === id)
                });

            setAssetData(distList);

            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            console.log("Error ", err);
            setShowLoading(false);
            setOpenBackdrop(false);
        });

        
    }
   
    const handleDownload = () => {
     
      GetReportUrl("ReportUrls", "downloadTraffickLetterUrl").then(data => {
      
  
        let obj = {};
        if (startDate) {
          obj["startDate"] = startDate;
        } else {
          notifyWarning("Please select Start Date.");
          return false;
        }
        if (endDate) {
          obj["endDate"] = endDate;
        } else {
          notifyWarning("Please select End Date.");
          return false;
        }
        if (region) {
          obj["region"] = region;
        } else {
          notifyWarning("Please Select Region.");
          return false;
        }
        if (country) {
          obj["country"] = country;
        } else {
          notifyWarning("Please Select Country.");
          return false;
        }
        if (mediaType) {
          obj["mediaType"] = mediaType;
        } else {
          notifyWarning("Please Select Media Type.");
          return false;
        }
        if (partner) {
          obj["partner"] = partner;
        } else {
          notifyWarning("Please Select Partner.");
          return false;
        }
        if (selectedNetwork.length > 0) {
          obj["network"] = selectedNetwork;
        }
        if (selectedAsset.length > 0) {
          obj["asset"] = selectedAsset;
        } else {
          let tempAsset = [];
          tempAsset.push({ value: -1 });
          obj["asset"] = tempAsset;
        }
    
        let networkIds = "";
        if (obj.network && obj.network.length > 0) {
          obj.network.map((ele) => {
            if (networkIds !== "") {
              networkIds = networkIds + "," + ele.value;
            } else {
              networkIds = ele.value.toString();
            }
          });
        }
  
        let assetIds = "";
        if (obj.asset && obj.asset.length > 0) {
          obj.asset.map((ele) => {
            if (assetIds !== "") {
              assetIds = assetIds + "," + ele.value;
            } else {
              assetIds = ele.value.toString();
            }
          });
        } else {
          assetIds = "-1";
        }
       

       
  
         
        let today = Helper.FormatDateToMMDDYYYY(obj.startDate)
        let fileName = `${countryName.replace(/\s+/g, '')}_${today.replaceAll('/','_')}_thru_ufn${revisionMax===null||revisionMax==="0"?'':`_R${revisionMax}`}`
      
        
  
        let downloadurl = data.replace("<__partnerId__>", obj.partner.toString())
        .replace("<__countryId__>", obj.country.toString())                
        .replace("<__startDate__>", Helper.FormatToIsoDate(obj.startDate))
        .replace("<__endDate__>", Helper.FormatToIsoDate( obj.endDate))
        .replace("<__assetId__>", assetIds)
        .replace("<__Folder__>", regionName)
        .replace("<__FileName__>", `${fileName}.xlsx`)
        .replace("<__DefaultFolder__>","IntTraffickLetter")

        
        
        // if(selectedAsset.length > 0){
        //   selectedAsset.map(ele => {
        //     downloadurl = downloadurl + '&AssetId=' + ele.value;
           
        //   });
        // }

        
        fetch(downloadurl)
        notifySuccess("File download process initiated. Please validate after 5 minutes.")

     
      }).catch(err => {
        console.log(err);
      })
    };

  const getNetworkData = (selectedMediaType, regionId) => {
    
    if(selectedMediaType===null||regionId===null) return

  setShowLoading(true);
  setOpenBackdrop(true);

//   GetPartnerByInventory(leagueId, selectedMediaType, regionId).then(data => {
//     if (data && data.length > 0) {
//         let list = data.map((item) => {
//             return { label: item.partnerName, value: item.id }
//         });
//         setPartnerData(list);
//         setShowLoading(false);
//         setOpenBackdrop(false);
//     }
//     else {
//       setShowLoading(false);
//       setOpenBackdrop(false);
//       console.log("Networks API is failing")
//     };
// });

  GetPartnerByInventoryPlanning(leagueId, selectedMediaType, regionId ).then((data) => {
    let networks = [];
    data.forEach(item => {
      networks.push({ label: item.partnerName, value: item.id });
    });
    setPartnerData(networks);
    setShowLoading(false);
    setOpenBackdrop(false);
  }).catch(err => {
    console.log(err);
    setShowLoading(false);
    setOpenBackdrop(false);
  })
  setPartnerName(null)
  setPartner(null)
}


  const handleClose = () => {
    setShowTraffickLetterPreview(false);
    
  }

  const handleOk = () => {
    setShowTraffickLetterPreview(false);
  }

  const handleDrawerStatus = (value) => {
    setShowDrawer(value);
  }

  //useEffect(()=>{
  //  if(region){
  //    getNetworkData(mediaType,region)
  
  //  }
  //}, [region, mediaType])

    useEffect(() => {
        if (startDate && endDate && region && country && mediaType && partner) {
      
            getRevision()

        }
    }, [startDate, endDate, region, country, mediaType, partner, asset])

    useEffect(() => {
        if (startDate && endDate && region && country && mediaType) {

            getPartnerData()

        }
    }, [startDate, endDate, region, country, mediaType])

    useEffect(() => {
        if (startDate && endDate && region && country && mediaType && partner) {

            getAsset()

        }
    }, [startDate, endDate, region, country, mediaType, partner])

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <Grid item xs={12} >
        <Grid container>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" pl={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: '500' }} color="primary">{'Traffic Letter (Filter)'}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
              <Grid container alignItems="center" spacing={1}>

                <Grid item xs={8}>
                  <PickDateRange startDate={startDate} endDate={endDate}
                    setStartDate={handleStartDateChange} setEndDate={handleEndDateChange}
                  />

                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                  <Dropdown value={regionName} size="small" name="region" id="region" variant="outlined" showLabel={true} lbldropdown="Region" handleChange={handleRegionChange} ddData={regionData ? regionData : []} />
                </Grid>
                <Grid item xs={8}>
                </Grid>
                <Grid item xs={4}>
                  <Dropdown value={countryName} size="small" name="country" id="country" variant="outlined" showLabel={true} lbldropdown="Country" handleChange={handleCountryChange} ddData={countryData ? countryData : []} />
                </Grid>
                <Grid item xs={8}>
                </Grid>
                <Grid item xs={4}>
                  <Dropdown value={mediaTypeName} size="small" name="mediaType" id="mediaType" variant="outlined" showLabel={true} lbldropdown="Media Type" handleChange={handleMediaTypeChange} ddData={mediaTypeData ? mediaTypeData : []} />
                </Grid>

                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                  <Dropdown size="small" value={partnerName} name="partner" id="partner" variant="outlined" showLabel={true} lbldropdown="Partner" handleChange={handlePartnerChange} ddData={partnerData ? partnerData : []} />
                </Grid>
                {/* <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                  <MulltiSelectDropdown size="small" value={networkName} name="network" id="network" variant="outlined" showLabel={true} lbldropdown="Network" handleChange={handleNetworkChange} ddData={networkData ? networkData : []} />
                </Grid> */}
                <Grid item xs={8}>
                  {selectedNetwork && <ChipsList name="networkChip" size="small" handleDelete={handleNetworkDelete}
                    showDelete={true} label="" data={selectedNetwork} />}
                </Grid>
                <Grid item xs={4}>
                  <MulltiSelectDropdown size="small" id="asset" name="asset" value={assetName} variant="outlined" showLabel={true} lbldropdown="Asset" handleChange={handleAssetChange} ddData={assetData ? assetData : []} />
                </Grid>
                <Grid item xs={8}>
                    {selectedAsset && <ChipsList name="assetChip" size="small" handleDelete={handleAssetDelete}
                    showDelete={true} label="" data={selectedAsset} />}
                              </Grid>
                
                <Grid item xs={4}>
                        <Dropdown size="small" value={revisionName} name="revisionnuber" id="revisionnumber" variant="outlined" showLabel={true} lbldropdown="RevisionNumber"
                                      handleChange={handleRevisionChange} ddData={revisionData ? revisionData : []} />
                </Grid>
                <Grid item xs={4}>
                    {/*  <Button onClick={() => handleGetRevision()} variant="contained" color="primary" style={{ marginBottom: '0px' }}>*/}
                    {/*             Get Revisionnumber*/}
                    {/*</Button>*/}
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>                    
                    <Button onClick={(date) => handleMarkAsTrafficked(date)} variant="contained" color="primary" style={{ marginBottom: '40px' }}>
                      Mark as Trafficked
                    </Button>
                    <Button onClick={() => handleGenerate(true)} variant="contained" color="primary" style={{ marginBottom: '40px' }}>
                     Preview
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="contained"
                      color="primary"
                      style={{ marginBottom: "40px" }}
                    >
                      Download
                    </Button>
                  </Stack>
                </Grid>

              </Grid>
            </Box>
          </Grid>

          <Grid item xs={6}>
            {showTraffickLetterPreview && <>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle1" sx={{ fontWeight: '500' }} color="primary">{'Traffic Letter (Preview)'}</Typography>
                  
              </Box>
              <TraffickLetterViewer setShowLoading={bool => setShowLoading(bool)} setOpenBackdrop={(bool) => setOpenBackdrop(bool)} isMultiple={true} traffickLetterParams={traffickLetterParams} scheduleIds={scheduleIds}/>
              <Box component="div" mt={1} pr={1} display='flex' justifyContent={"flex-end"}>
                  <Button onClick={handleOk} variant="contained" size='small' color="primary">OK</Button>
              </Box>
            </>}
          </Grid>

        </Grid>
      </Grid>

      {showLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <div className={'loader-div'}><div className={'loading'}></div></div>
        </Backdrop>
      )}

      { showDrawer && failedObj && failedObj.length > 0 ? <>       

        <DrawerComponent
          open={showDrawer}
          handleDrawerClose={() => handleDrawerStatus(false)}
          handleDrawerOpen={() => handleDrawerStatus(true)}
          anchor={"right"}
          className={classes.drawer}
        >
          <>
            <div className={classes.toolbar} />
            <TraffickStatusUI data={failedObj} handleClose={() => handleDrawerStatus(false)} />
          </>
        </DrawerComponent>


      </> : ""}

    </React.Fragment>
  );
}

TraffickLetterUI.displayName = "TraffickLetterUI";
export default TraffickLetterUI;
