import React, { useContext, useEffect, useState } from "react";
import AppDataContext from "../../../../common/AppContext";
import {
  Divider,
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Backdrop,
} from "@mui/material";
import Helper from "../../../../common/Helper";
import { ToastContainer, toast } from "react-toastify";
import {
  GetAssets,
  GetAssetsParent,
  GetRegions,
  GetMedium,
  GetCountries,
  GetBrands,
  GetLookupById,
  GetPartnerByType,
  GetCountriesByRegionIds,
  GetPartnerByInventory
} from "../../../../services/common.service";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import MultiSelectDropdown from "../../../../sharedComponents/Dropdown/MulltiSelectDropdown";
import ChipsList from "../../../../sharedComponents/chips/ChipsList";
import DateRangePicker from "../../../../sharedComponents/PickDateRange/PickDateRange";
import CopyScheduleApply from "./CopyScheduleApply";
import { makeStyles } from "@material-ui/core/styles";
// import {
//   UpdateTraffickingData,
//   FilterScheduleData,
//   SaveTraffickingScheduleCopyData,
// } from "../../../../services/planning.service";

import {
  FilterScheduleData,
  SaveCopyPlanScheduleData,
} from "../../../../services/planning.service";
import CircularProgress from "@mui/material/CircularProgress";
function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(50vh - 146px)",
    overflowY: "auto",
  },
  unassignedContent: {
    height: "calc(100vh - 230px)",
    overflowY: "auto",
    marginLeft: theme.spacing(0.1),
  },
  half: {
    height: "calc(50vh - 136px)",
    overflowY: "auto",
    marginLeft: theme.spacing(0.1),
  },
  dropdownWidth: {
    width: theme.spacing(31.25),
  },
  filteredList: {
    overflowY: "auto",
  },
}));

const CopyScheduleFilterContainer = (props) => {
  const classes = useStyles();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [region, setRegion] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [country, setCountry] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [networkName, setNetworkName] = useState(null);
  const [network, setNetwork] = useState(null);
  const [networkList, setNetworkList] = useState([]);
  const [asset, setAsset] = useState(null);
  const [assetName, setAssetName] = useState(null);

  const [assetData, setAssetData] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [venturized, setVenturized] = useState(null);
  const [venturizedName, setVenturizedName] = useState(null);
  const [venturizedData, setVenturizedData] = useState([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const [filteredOriginalScheduleData, setFilteredOriginalScheduleData] =
    useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [statusValue, setStatusValue] = useState(2);
  const [statusName, setStatusName] = useState("All");
  const [filterStatus, setFilterStatus] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [priorityUnits, setPriorityUnits] = React.useState([]);

  const {
    username,
    userId,
    leagueInfo,
    leagueId,
    Regions,
    Venturized,
    MarketType,
  } = useContext(AppDataContext);

  // useEffect(() => {
  //   if (props.ros) {
  //     setRegionList([{ label: "United States", value: 11 }]);

  //     setSelectedCountries([{ label: "United States", value: 60 }]);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (props.mediaTypeId && props.ros) {
  //     GetAssetsParent(leagueId, 111, venturized, props.mediaTypeId).then(
  //       (data) => {
  //         if (data) {
  //           let a = data.find((item) => item.assetMasterId === 22);

  //           setAssetList([
  //             { label: a.assetMediaDisplayName, value: a.assetMasterId },
  //           ]);
  //         }
  //       }
  //     );
  //     getNetworkData(props.mediaTypeId,11)
  //   }
  // }, [props.mediaTypeId]);

  //   Get Data ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const getRegionData = () => {
    GetRegions()
      .then((data) => {
        let region = [];
        data.map((item) => {
          region.push({ label: item.regionName, value: item.id });
        });
        setRegionData(region);
      })
      .catch((err) => console.log(err));
  };

  const getCountryData = (ids) => {
    GetCountriesByRegionIds(ids)
      .then((data) => {
        let countries = [],
          updatedSelectedCountries = [];
        data.map((item) => {
          countries.push({ label: item.countryName, value: item.id });
          if (selectedCountries.length) {
            selectedCountries.forEach((elem) => {
              if (elem.value === item.id) {
                updatedSelectedCountries.push({
                  label: item.countryName,
                  value: item.id,
                });
              }
            });
          }
        });
        setCountryData(countries);
        if (selectedCountries.length) {
          setSelectedCountries(updatedSelectedCountries);
        }
      })
      .catch((err) => console.log(err));
  };

  

  // const getNetworkData = () => {
  //   GetPartnerByType(503)
  //     .then((data) => {
  //       let cList = [];
  //       if (data) {
  //         data.map((item) => {
  //           cList.push({ label: item.partnerName, value: item.id });
  //         });
  //         setNetworkData(cList);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getNetworkData = (selectedMediaType, regionId) => {
    
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
  setNetwork(null);
    setNetworkName(null);
    setNetworkList([])
}

useEffect(()=>{
  if(regionList.length===0){
    setNetworkData([])
    setNetworkName(null)
    setNetworkList([])
    setAssetData([]);
    setAssetName(null)
    setAssetList([])
    return
  }
  if(regionList.length>0){
    let mapped = regionList.map(item=>item.value)
    getNetworkData(props.mediaTypeId,mapped)
  
  }
},[regionList])

  const getAssetData = (leagueId, _marketType, _venturized, _mediaType) => {
    //debugger;

    console.log("venturized", venturized);
    // if (_marketType === null) _marketType = marketType;
    // if (_venturized === null) _venturized = venturized;
    // if (_mediaType === null) _mediaType = mediaType;

    // if (_marketType === null || _venturized === null || _mediaType === null)
    //   return;

    GetAssets(leagueId, _marketType, _venturized, _mediaType).then((data) => {
      if (data) {
        let list = data.map((item) => {
          return { label: item.assetMediaDisplayName, value: item.id };
        });

        let distList = Array.from(new Set(list.map((a) => a.value))).map(
          (id) => {
            return list.find((a) => a.value === id);
          }
        );

        setAssetData(distList);
      } else console.log("GetAssets API is failing");
    });
  };

  const getAssetParentData = (
    leagueId,
    _marketType,
    _venturized,
    _mediaType
  ) => {
    //debugger;

    console.log("venturized", venturized);
    // if (_marketType === null) _marketType = marketType;
    // if (_venturized === null) _venturized = venturized;
    // if (_mediaType === null) _mediaType = mediaType;

    // if (_marketType === null || _venturized === null || _mediaType === null)
    //   return;

    GetAssetsParent(leagueId, _marketType, _venturized, _mediaType).then(
      (data) => {
        if (data) {
          let list = data.map((item) => {
            return { label: item.assetMediaDisplayName, value: item.id };
          });

          let distList = Array.from(new Set(list.map((a) => a.value))).map(
            (id) => {
              return list.find((a) => a.value === id);
            }
          );

          setAssetData(distList);
        } else console.log("GetAssets API is failing");
      }
    );
  };

  const getVenturizedData = () => {
    if (Venturized && Venturized.length > 0) {
      let list = Venturized.map((item) => {
        return { label: item.lookupText, value: item.lookupId };
      });
      setVenturizedData(list);
      let nonVenture = list.filter((x) => x.value == 952);
      console.log("nonventure", nonVenture);
      setVenturized(nonVenture[0].value);
      setVenturizedName(nonVenture[0].label);
    }
  };

  useEffect(() => {
    getRegionData();

    // getMediaTypeData();
    // getCountryData(-1);
    // getNetworkData();
    // getAssetData();
    // getMarketTypeData();
    getVenturizedData();
    // getBrandsData();
    // getLookupStatus();
    // getPlannedBudgets();
  }, []);

  // change handlers ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const setStartDate = (value) => {
    setSelectedStartDate(Helper.FormatToIsoDate(value));
  };

  const setEndDate = (value) => {
    setSelectedEndDate(Helper.FormatToIsoDate(value));
  };

  // useEffect(() => {
  //   if (regionList.length > 0) {
  //     let rl = regionList.map((r) => r.value).join();
  //     setSelectedCountries([])
  //     getCountryData(rl);
  //   }
  // }, [regionList]);


  

  const handleRegionChange = (name, value) => {
    if (regionList.length > 0 && regionList[0].label == "United States") {
      notifyWarning("Cannot select internationals with US");
      return;
    } else if (regionList.length > 0 && value.label == "United States") {
      notifyWarning("Cannot select US with internationals");
      return;
    } else {
      setRegion(value.value);
      setRegionName(value.label);

      let temp = regionList.slice();
      let index = temp.findIndex((t) => t.value === value.value);
      if (index == -1) {
        temp.push(value);
        setRegionList(temp);
        let regionIds = temp.map((obj) => obj.value).join();
        getCountryData(regionIds);
      }

      if (value.label == "United States") {
        //getAssetData(leagueId, 111, venturized, props.mediaTypeId);
        getAssetParentData(leagueId, 111, venturized, props.mediaTypeId);
        // getAssetData(leagueId, 111, 952, -1);
      } else {
        //getAssetData(leagueId, 112, venturized, props.mediaTypeId);
        getAssetParentData(leagueId, 112, venturized, props.mediaTypeId);
        // getAssetData(leagueId, 112, 952, -1);
      }
    }
  };

  const handleCountryChange = (name, value) => {
    // setCountry(value.value);
    // setCountryName(value.label);
    let temp = selectedCountries.slice();
    let index = temp.findIndex((t) => t.value === value.value);
    if (index == -1) {
      temp.push(value);
      setSelectedCountries(temp);
    }
  };

  const handleNetworkChange = (name, value) => {
    setNetwork(value.value);
    setNetworkName(value.label);
    let temp = networkList.slice();
    let index = temp.findIndex((t) => t.value === value.value);
    if (index == -1) {
      temp.push(value);
      setNetworkList(temp);
    }
  };

  const handleAssetChange = (name, value) => {
    setAsset(value.value);
    setAssetName(value.label);
    let temp = assetList.slice();
    let index = temp.findIndex((t) => t.value === value.value);
    if (index == -1) {
      temp.push(value);
      setAssetList(temp);
    }
  };

  const handleDelete = (name, value) => {
    if (name === "country") {
      let temp = selectedCountries.slice();
      let index = temp.findIndex((t) => t.label === value);
      temp.splice(index, 1);
      setSelectedCountries(temp);
    }

    if (name === "region") {
      let temp = regionList.slice();
      console.log("temp: ", temp);
      console.log("value: ", value);
      let index = temp.findIndex((t) => t.label === value);
      temp.splice(index, 1);
      setRegionList(temp);
      let regionIds = temp.map((obj) => obj.value).join();
      getCountryData(regionIds);
    }

    if (name === "partner") {
      let temp = networkList.slice();
      let index = temp.findIndex((t) => t.value === value);
      temp.splice(index, 1);
      setNetworkList(temp);
    }

    if (name === "asset") {
      let temp = assetList.slice();
      let index = temp.findIndex((t) => t.value === value);
      temp.splice(index, 1);
      setAssetList(temp);
    }
  };

  const handleSelected = (items) => {
    let arr = [];

    items.forEach((item) => {
      if (item?.isChecked) {
        arr.push(item.scheduleId);
      }
    });
    let alls = [...allSchedules, ...arr];
    let a = [...new Set(alls)];
    setAllSchedules(a);
  };

  // useEffect(() => {
  //   if (regionList.length === 0) {
  //     setAssetData([]);
  //   }
  // }, [regionList]);

  useEffect(() => {
    if (props.sourceUnits.length > 0) {
     if(props.ros){
       let arr = []
        props.sourceUnits.forEach((unit) => {
        if (unit.priority !== null) {
         unit.scheduleAdUnitIds.split(',').forEach(r=>{
            arr.push({
              adUnitId: Number(r),
              priority: unit.priority,
            }) 
           })
        }
      });

     
      setPriorityUnits(arr);
      return
     }
     
    
    
      let filteredUnits = props.sourceUnits.map((unit) => {
        if (unit.priority !== null) {
          return {
            adUnitId: unit.adUnitId,
            priority: unit.priority,
          };
        }
      });

      setPriorityUnits(filteredUnits);
    }
  }, [props.sourceUnits]);

 

  const handleFilter = () => {
    let v = checkValidation();
   
    if (!v && priorityUnits.length > 0) {
      let mappedCountry = selectedCountries.map((c) => c.value);
      let mappedPartner = networkList.map((p) => p.value);
      let mappedAsset = assetList.map((a) => a.value);
      let mappedRegion = regionList.map((r) => r.value);
      let mappedPriority = priorityUnits.filter((item) => {
        if (item) {
          return item;
        }
      });

      let params = {
        planType: props.planTypeValue,
        sourceScheduleId: props.selectedScheduleId,
        sourceScheduleAdUnitIds: mappedPriority,
        startDate: new Date(selectedStartDate),
        endDate: new Date(selectedEndDate),
        leagueId: leagueId,
        regionIds: mappedRegion.length > 0 ? mappedRegion.join() : "0",
        countryIds: mappedCountry.length > 0 ? mappedCountry.join() : "0",
        partnerIds: mappedPartner.length > 0 ? mappedPartner.join() : "0",
        assetIds: mappedAsset.length > 0 ? mappedAsset.join() : "0",
        isROS: props.ros ? true : false,
      };

      setShowLoading(true);
      setOpenBackdrop(true);
      FilterScheduleData(params)
        .then((resp) => {
          setShowLoading(false);
          setOpenBackdrop(false);
         
          if(resp.length===0){
            setFilteredScheduleData([]);
            notifyWarning("Data not found")
            return
          }
          setFilteredScheduleData(resp);
          setFilteredOriginalScheduleData(resp);
          setStatusValue(2);
          setStatusName("All");
          setAllSchedules([]);
          // if (resp.length > 0) {
          //   notifySuccess("Data updated successfully..!");
          // } else {
          //   notifyWarning("No data found");
          // }
        })
        .catch((ex) => {
          setShowLoading(false);
          setOpenBackdrop(false);
          notifyWarning("Server error.");
        });
    }
  };

  const getFilteredList = () => {
    return (
      <CopyScheduleApply
        fullView={props.fullView}
        filteredScheduleData={filteredScheduleData}
        handleSelected={handleSelected}
        setFilteredScheduleData={setFilteredScheduleData}
        status={statusValue}
      />
    );
  };

  const handleStatusChange = (name, value) => {
    setStatusValue(value.value);
    setStatusName(value.label);

    // if (value.value == 0) {
    //   let cloned = [...filteredOriginalScheduleData];
    //   let mapped = cloned.filter((item) => item.status == 0);
    //   setFilteredScheduleData(mapped);
    // } else if (value.value == 1) {
    //   let cloned = [...filteredOriginalScheduleData];
    //   let mapped = cloned.filter((item) => item.status == 1);
    //   setFilteredScheduleData(mapped);
    // } else if (value.value == -1) {
    //   let cloned = [...filteredOriginalScheduleData];
    //   let mapped = cloned.filter((item) => item.status == -1);
    //   setFilteredScheduleData(mapped);
    // } else {
    //   let cloned = [...filteredOriginalScheduleData];
    //   setFilteredScheduleData(cloned);
    // }
  };

  const checkValidation = () => {
    let error = false;

    if (regionList.length === 0) {
      notifyWarning("Region is required field.");
      error = true;
    }

    if (!selectedStartDate) {
      notifyWarning("Start Date is required field.");
      error = true;
    }

    if (!selectedEndDate) {
      notifyWarning("End Date is required field.");
      error = true;
    }

    if (
      new Date(selectedStartDate) < new Date(props.minimumStartDate) ||
      new Date(selectedEndDate) > new Date(props.maximumEndDate)
    ) {
      notifyWarning(
        "Start date and End Date must be between Campaign start and end date"
      );
      error = true;
    }

    if (
      priorityUnits.length === 0 ||
      priorityUnits.every((p) => p === undefined)
    ) {
      notifyWarning("Please select planned units");
      error = true;
    }
    /* Comment is not mandatory field
    if (!comments) {
      notifyWarning("Comments is required field.");
      error = true;
    }
    */
    return error;
  };

  const handleApply = () => {
    let v = checkValidation();

    if (!v && priorityUnits.length > 0) {
      let params = {
        planType: props.planTypeValue,
        sourceScheduleId: props.selectedScheduleId,
        destinationScheduleIds: allSchedules.join(),
        sourceScheduleAdUnitIds: priorityUnits,
        user: username,
        isROS: props.ros ? true : false,
      };

      props.setShowLoading(true);
      props.setOpenBackdrop(true);
      SaveCopyPlanScheduleData(params)
        .then((resp) => {
          notifySuccess("Data saved successfully..!");
          setStatusValue(2);
          setStatusName("All");
          setAllSchedules([]);
          props.setShowLoading(false);
          props.setOpenBackdrop(false);
        })
        .catch((ex) => {
          notifyWarning("Server error.");
        });
    }
  };

  const handleCancel = () => {
    let data = filteredScheduleData.map((item) => {
      return { ...item, isChecked: false };
    });
    handleSelected(data);

    setFilteredScheduleData(data);
    setStatusValue(2);
    setStatusName("All");
    setAllSchedules([]);
  };
  // useEffect(() => {
  //   if (props.sourceUnits.length === 0) {
  //     setFilteredScheduleData([]);
  //     setFilteredOriginalScheduleData([]);
  //     return;
  //   }
  //   if (
  //     props.sourceUnits.length > 0 &&
  //     selectedStartDate &&
  //     selectedEndDate &&
  //     regionList.length > 0
  //   ) {
  //     let mappedCountry = selectedCountries.map((c) => c.value);
  //     let mappedPartner = networkList.map((p) => p.value);
  //     let mappedAsset = assetList.map((a) => a.value);
  //     let mappedRegion = regionList.map((r) => r.value);
  //     let params = {
  //       planType: 1,
  //       sourceScheduleId: props.selectedScheduleId,
  //       sourceScheduleAdUnitIds:
  //         props.sourceUnits.length > 0 ? props.sourceUnits.join() : "0",
  //       startDate: new Date(selectedStartDate),
  //       endDate: new Date(selectedEndDate),
  //       leagueId: leagueId,
  //       regionIds: mappedRegion.length > 0 ? mappedRegion.join() : "0",
  //       countryIds: mappedCountry.length > 0 ? mappedCountry.join() : "0",
  //       partnerIds: mappedPartner.length > 0 ? mappedPartner.join() : "0",
  //       assetIds: mappedAsset.length > 0 ? mappedAsset.join() : "0",
  //     };

  //     console.log("params", params);
  //     setShowLoading(true);
  //     setOpenBackdrop(true);
  //     FilterScheduleData(params)
  //       .then((resp) => {
  //         console.log("resp", resp);
  //         setFilteredScheduleData(resp);
  //         setFilteredOriginalScheduleData(resp);
  //         setShowLoading(false);
  //         setOpenBackdrop(false);
  //         // if (resp.length > 0) {
  //         //   notifySuccess("Data updated successfully..!");
  //         // } else {
  //         //   notifyWarning("No data found");
  //         // }
  //       })
  //       .catch((ex) => {
  //         setShowLoading(false);
  //         setOpenBackdrop(false);
  //         notifyWarning("Server error.");
  //       });
  //   }
  // }, [props.sourceUnits]);

  

  return (
    <>
      {/* <Box display="flex" alignItems="center" px={1} pt={1} pb={0.5}>
        <Typography variant="body2" color="primary" fontWeight="medium">
          Copy
        </Typography>
      </Box> */}
      <Box
      // className={
      //   props.fullView
      //     ? classes.unassignedContentHalf
      //     : classes.unassignedContent
      // }
      >
        <Grid container>
          <Grid item xs={4}>
            <Box pb={1} px={2} className={props.fullView ? classes.half : ""}>
              <Box pb={2}>
                {props.selectedScheduleData != null &&
                  props.selectedScheduleData !== undefined && (
                    <Typography
                      color="primary"
                      variant="caption"
                      fontWeight="medium"
                    >
                      {`
                 ${props.mediaTypeId === 151 ? "Game" : "Non-Game"}  |
                ${
                  props.selectedScheduleData.networkName
                    ? props.selectedScheduleData.networkName
                    : "-"
                } |
                ${
                  props.selectedScheduleData.estDate
                    ? Helper.FormatDate(props.selectedScheduleData.estDate)
                    : "-"
                } |

                          ${
                            props.selectedScheduleData.id
                              ? props.selectedScheduleData.id
                              : "-"
                          } |
                          ${
                            props.selectedScheduleData.episodeName
                              ? props.selectedScheduleData.episodeName
                              : "-"
                          }
                       `}
                    </Typography>
                  )}
              </Box>

              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12}>
                  <DateRangePicker
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={6}>
                      <MultiSelectDropdown
                        size="small"
                        id="region"
                        variant="outlined"
                        // showLabel={true}
                        lbldropdown="Region"
                        handleChange={handleRegionChange}
                        ddData={regionData.length ? regionData : []}
                        // disabled={props.ros ? true : false}
                      />
                    </Grid>
                    {regionList.length > 0 && (
                      <Grid item xs={6}>
                        <ChipsList
                          name="region"
                          handleDelete={handleDelete}
                          showDelete={true}
                          className="chips"
                          label=""
                          data={regionList}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={6}>
                      <MultiSelectDropdown
                        size="small"
                        id="country"
                        name="country"
                        variant="outlined"
                        showLabel={true}
                        lbldropdown="Country"
                        handleChange={handleCountryChange}
                        ddData={countryData.length ? countryData : []}
                        // disabled={props.ros ? true : false}
                      />
                    </Grid>
                    {selectedCountries.length > 0 && (
                      <Grid item xs={6}>
                        <ChipsList
                          name="country"
                          handleDelete={handleDelete}
                          showDelete={true}
                          className="chips"
                          label=""
                          data={selectedCountries}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={6}>
                      <MultiSelectDropdown
                        name="partner"
                        handleChange={handleNetworkChange}
                        value={networkName}
                        size="small"
                        id="partner"
                        variant="outlined"
                        showLabel={true}
                        lbldropdown="Partner"
                        ddData={networkData}
                      />
                    </Grid>
                    {networkList.length > 0 && (
                      <Grid item xs={6}>
                        <ChipsList
                          name="partner"
                          handleDelete={handleDelete}
                          showDelete={true}
                          className="chips"
                          label=""
                          data={networkList}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={6}>
                      <MultiSelectDropdown
                        size="small"
                        id="asset"
                        name="asset"
                        variant="outlined"
                        showLabel={true}
                        lbldropdown="Asset"
                        handleChange={handleAssetChange}
                        ddData={assetData ? assetData : []}
                        value={assetName}
                        // disabled={props.ros ? true : false}
                      />
                    </Grid>
                    {assetList.length > 0 && (
                      <Grid item xs={6}>
                        <ChipsList
                          name="asset"
                          handleDelete={handleDelete}
                          showDelete={true}
                          className="chips"
                          label=""
                          data={assetList}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12} justifyContent="flex-start">
                  <Button
                    size="small"
                    onClick={handleFilter}
                    color="primary"
                    variant="contained"
                    disabled={filterStatus}
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid
                container
                xs={12}
                display="flex"
                justifyContent="flex-end"
                mt={1}
              >
                <Dropdown
                  size="small"
                  name="status"
                  classList={classes.dropdownWidth}
                  lbldropdown="Inventory Indicator"
                  value={statusName}
                  ddData={[
                    {
                      label: "All",
                      value: 2,
                    },
                    {
                      label: "Less",
                      value: -1,
                    },
                    {
                      label: "Matched",
                      value: 0,
                    },
                    {
                      label: "More",
                      value: 1,
                    },
                  ]}
                  handleChange={handleStatusChange}
                />
              </Grid>

              <Grid item xs={12} className={classes.filteredList}>
                  {getFilteredList()}
              </Grid>

              <Grid
                container
                xs={12}
                marginTop={1}
                marginBottom={1}
                pr={2}
                pb={1}
                justifyContent="flex-end"
                onClick={handleCancel}
              >
                <Button size="small" color="secondary">
                  Cancel
                </Button>

                <Button
                  size="small"
                  onClick={handleApply}
                  color="primary"
                  variant="contained"
                  disabled={allSchedules.length > 0 ? false : true}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
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
};

export default CopyScheduleFilterContainer;
