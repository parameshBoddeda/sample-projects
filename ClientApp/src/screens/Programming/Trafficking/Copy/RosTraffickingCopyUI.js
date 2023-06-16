import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Divider,
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Checkbox,
  Paper,
} from "@mui/material";
import Helper from "../../../../common/Helper";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  UpdateTraffickingData,
  FilterTraffickingData,
  SaveTraffickingScheduleCopyData,
} from "../../../../services/trafficking.service";
import AppDataContext from "../../../../common/AppContext";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import MultiSelectDropdown from "../../../../sharedComponents/Dropdown/MulltiSelectDropdown";
import DrawerComponent from "../../../../sharedComponents/Drawer/DrawerComponent";
import Toolbar from "@mui/material/Toolbar";

import ConfrimDialog from "../../../../sharedComponents/Dialog/ConfirmDialog";
import DateRangePicker from "../../../../sharedComponents/PickDateRange/PickDateRange";
import {
  GetAssets,
  GetRegions,
  GetMedium,
  GetCountries,
  GetBrands,
  GetLookupById,
  GetPartnerByType,
  GetPartnerByInventory,
  GetAssetsParent
} from "../../../../services/common.service";
import ChipsList from "../../../../sharedComponents/chips/ChipsList";
import RosCopyFilteredList from "./RosCopyFilteredList";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}
/*#ecfffb green*/
/*#feefea orange*/
/*#00c691 chip Green*/
/*#f99070 chip orange*/
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
  unassignedContentHalf: {
    // height: "calc(50vh - 162px)",
    // overflowY: "auto",
    marginLeft: theme.spacing(0.1),
  },
  filteredListTable: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(0.75),
    },
  },

  filteredList:{ 
     overflowY: 'auto',
 
   },
  full: {},
  half: {
    maxHeight: 'calc(100vh - 540px)',
    overflowY: 'auto',
  },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
}));

const RosTraffickingCopyUI = (props) => {
  const classes = useStyles();

  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const [region, setRegion] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [regionData, setRegionData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [country, setCountry] = useState(null);
  const [networkData, setNetworkData] = useState([]);
  const [networkName, setNetworkName] = useState(null);
  const [network, setNetwork] = useState(null);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [asset, setAsset] = useState(null);
  const [assetName, setAssetName] = useState(null);

  const [assetData, setAssetData] = useState([]);
  const {
    username,
    userId,
    leagueInfo,
    leagueId,
    Regions,
    Venturized,
    MarketType,
  } = useContext(AppDataContext);

  const [marketType, setMarketType] = useState(null);

  const [mediaType, setMediaType] = useState(null);
  const [marketTypeData, setMarketTypeData] = useState([]);
  const [venturizedName, setVenturizedName] = useState(null);
  const [venturizedData, setVenturizedData] = useState([]);
  const [venturized, setVenturized] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [networkList, setNetworkList] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const [filteredOriginalScheduleData, setFilteredOriginalScheduleData] =
    useState([]);
  const [statusValue, setStatusValue] = useState(null);
  const [statusName, setStatusName] = useState(null);
  const [allChecked, setAllChecked] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [checkedIsci, setCheckedIsci] = useState(false);
  const [checkedDate, setCheckedDate] = useState(false);
  const [regionList, setRegionList] = useState([]);
  const [previousSchedule, setPreviousSchedule] = useState("");

  const setStartDate = (value) => {
    setSelectedStartDate(Helper.FormatToIsoDate(value));
  };

  const setEndDate = (value) => {
    setSelectedEndDate(Helper.FormatToIsoDate(value));
  };

  useEffect(() => {
    setSelectedStartDate(Helper.FormatToIsoDate(props.startDate));
    setSelectedEndDate(Helper.FormatToIsoDate(props.endDate));

    if (props.currentData) {
      if (props.currentScheduleAdUnit !== previousSchedule) {
        setFilteredScheduleData([]);
        setCheckedIsci(false);
        setCheckedDate(false);
      }
    }
  }, [props.currentScheduleAdUnit]);

 

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

  const getCountryData = (id) => {
    GetCountries(id)
      .then((data) => {
        let countries = [];
        data.map((item) => {
          countries.push({ label: item.countryName, value: item.id });
        });
        setCountryData(countries);
      })
      .catch((err) => console.log(err));
  };

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
  if(region){
    getNetworkData(props.selectedScheduleData.mediaTypeId,region)
  
  }
},[region])



  const getAssetData = (_marketType, _venturized, _mediaType) => {

    if (_marketType === null) _marketType = marketType;
    if (_venturized === null) _venturized = venturized;
    // if (_mediaType === null) _mediaType = mediaType;

    if (_marketType === null || _venturized === null||_mediaType===null)
      return;

    GetAssetsParent(leagueId, _marketType, _venturized, _mediaType).then(
      (data) => {
        if (data) {
          let list = data.map((item) => {
            return { label: item.assetDisplayName, value: item.id };
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

  useEffect(() => {
    getRegionData();
    // getCountryData(-1);
    // getNetworkData(props.selectedScheduleData.mediaTypeId,11)
    getMarketTypeData();
    getVenturizedData();
  }, []);

  const getMarketTypeData = () => {
    if (MarketType && MarketType.length > 0) {
      let list = MarketType.map((item) => {
        return { label: item.lookupText, value: item.lookupId }
      });
      setMarketTypeData(list);
    }
  }

  // Change Handlers :::::::::::::::::::::::::::::::::::::::::::::::::::::::\

  const handleRegionChange = (name, value) => {
    setRegion(value.value);
    setRegionName(value.label);
    setRegionList(value.label);
    setCountry(null);
    setCountryName(null);
    setCountryList([]);
    setAsset(null)
    setAssetName(null)
    setAssetList([])
    setAssetData([])
    getCountryData(value.value);
      if (value.label === "United States") {
        var selectedMarketType = marketTypeData.filter(
          (v) => v.label == "Domestic"
        );
        setMarketType(selectedMarketType[0].value);
      } else {
        var selectedMarketType = marketTypeData.filter(
          (v) => v.label == "International"
        );
        setMarketType(selectedMarketType[0].value);
      }

      getNetworkData(props.selectedScheduleData.mediaTypeId,value.value);
      getAssetData(selectedMarketType[0].value, null, props.selectedScheduleData.mediaTypeId);
  };

  const handleCountryChange = (name, value) => {
    setCountry(value.value);
    setCountryName(value.label);
    console.log(value);

    let temp = countryList.slice();
    let index = temp.findIndex((t) => t.value === value.value);
    if (index == -1) {
      temp.push(value);
      setCountryList(temp);
    }

    if (value.label === "United States") {
      var selectedMarketType = marketTypeData.filter(
        (v) => v.label == "Domestic"
      );
      setMarketType(selectedMarketType[0].value);
    } else {
      var selectedMarketType = marketTypeData.filter(
        (v) => v.label == "International"
      );
      setMarketType(selectedMarketType[0].value);
    }
    getAssetData(selectedMarketType[0].value, null, props.selectedScheduleData.mediaTypeId);
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
      let temp = countryList.slice();
      let index = temp.findIndex((t) => t.value === value);
      temp.splice(index, 1);
      setCountryList(temp);
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

  const handleFilter = () => {
    let v = checkValidation();
    if (!v) {
      let mappedCountry = countryList.map((c) => c.value);
      let mappedPartner = networkList.map((p) => p.value);
      let mappedAsset = assetList.map((a) => a.value);
      //let mappedRegion = regionList.map((r) => r.value);
      setPreviousSchedule(props.currentScheduleAdUnit);
      let params = {
        scheduleAdUnitId: props.currentScheduleAdUnit,
        scheduleId: props.selectedScheduleId,

        //   user: username,

        startDate: new Date(selectedStartDate),
        endDate: new Date(selectedEndDate),
        region: region,
        country: mappedCountry.length > 0 ? mappedCountry.join() : "0",
        partner: mappedPartner.length > 0 ? mappedPartner.join() : "0",
        asset: mappedAsset.length > 0 ? mappedAsset.join() : "0",
        isROS: true,
      };

      setShowLoading(true);
      setOpenBackdrop(true);
      FilterTraffickingData(params)
        .then((resp) => {
          setShowLoading(false);
          setOpenBackdrop(false);
          if (resp.length === 0) {
            notifyWarning("No data found");
          }
          setFilteredScheduleData(resp);
          setFilteredOriginalScheduleData(resp);
        })
        .catch((ex) => {
          setShowLoading(false);
          setOpenBackdrop(false);
          notifyWarning("Server error.");
        });
    }
  };

  const handleSelected = (items) => {
    let arr = [];
    items.forEach((item) => {
      if (item?.isChecked) {
        arr.push(item.scheduleId);
      }
    });

    setAllSchedules(arr);
    // let selectedSchedules = [];
    // items.forEach((v, i) => {
    //   if (v === true) {
    //     selectedSchedules.push(i);
    //   }
    // });

    // console.log(selectedSchedules);
    // let arr = [];

    // filteredScheduleData.forEach((item, index) => {
    //   selectedSchedules.forEach((v, i) => {
    //     if (v === index) {
    //       arr.push(item.scheduleId);
    //     }
    //   });
    // });
  };

  const getFilteredList = () => {
    return (
      <RosCopyFilteredList
        fullView={props.fullView}
        filteredScheduleData={filteredScheduleData}
        handleSelected={handleSelected}
        setFilteredScheduleData={setFilteredScheduleData}
      />
    );
  };

  const resetFormData = () => {
    setAsset(null);
    setAssetName(null);

    setRegion(null);
    setRegionName(null);

    setNetwork(null);
    setNetworkName(null);

    setCountry(null);
    setCountryName(null);

    setSelectedStartDate(null);

    setSelectedEndDate(null);
    setCountryList([]);
    setNetworkList([]);
    setAssetList([]);
    setFilteredScheduleData([]);
    setStatusName(null);
    setStatusValue(null);
  };

  const handleStatusChange = (name, value) => {
    setStatusValue(value.value);
    setStatusName(value.label);

    if (value.value == 0) {
      let cloned = [...filteredOriginalScheduleData];
      let mapped = cloned.filter((item) => item.status == 0);
      setFilteredScheduleData(mapped);
    } else if (value.value === 1) {
      let cloned = [...filteredOriginalScheduleData];
      let mapped = cloned.filter((item) => item.status == 1);
      setFilteredScheduleData(mapped);
    } else if (value.value === 2) {
      let cloned = [...filteredOriginalScheduleData];
      let mapped = cloned.filter((item) => item.status == 2);
      setFilteredScheduleData(mapped);
    } else if (value.value === -1) {
      let cloned = [...filteredOriginalScheduleData];
      let mapped = cloned.filter((item) => item.status == -1);
      setFilteredScheduleData(cloned);
    }
  };

  const checkValidation = () => {
    let error = false;

    if (!region) {
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

    if (!(checkedIsci || checkedDate) && props.currentScheduleAdUnit !== -1) {
      notifyWarning("Please select ISCI or date range");
      error = true;
    }

    return error;
  };

  const handleApply = () => {
    let v = checkValidation();
    if (!v) {
      let params = {
        sourceScheduleId: props.selectedScheduleId,
        sourceScheduleAdUnitId: props.currentScheduleAdUnit,
        user: username,
        isROS: true,
        isISCICopy: checkedIsci,
        isBreakCopy: false,
        isDateCopy: checkedDate,

        destinationScheduleIds: allSchedules.join(),
      };
      setShowLoading(true);
      setOpenBackdrop(true);

      SaveTraffickingScheduleCopyData(params)
        .then((resp) => {
          setShowLoading(false);
          setOpenBackdrop(false);
          notifySuccess("Data saved successfully..!");
        })
        .catch((ex) => {
          setShowLoading(false);
          setOpenBackdrop(false);
          notifyWarning("Server error.");
        });
    }
  };

  const handleIsciCheck = (e) => {
    setCheckedIsci(e.target.checked);
  };

  const handleDateCheck = (e) => {
    setCheckedDate(e.target.checked);
  };

  const handleCancel = () => {
    let data = filteredScheduleData.map((item) => {
      return { ...item, isChecked: false };
    });
    handleSelected(data);

    setFilteredScheduleData(data);
  };


  return (
    <>
      
      <Box
        className={
          props.fullView
            ? classes.unassignedContentHalf
            : classes.unassignedContent
        }
      >
        <Grid container>
          <Grid item xs={5}>
            
            <Box pb={1} px={2}>
              <Box pb={2}>
                {props.selectedScheduleData != null &&
                  props.selectedScheduleData !== undefined && (
                    <Typography color="primary" variant="caption" ml={2}>
                      {`
                        ${"ROS"} | 
                        ${
                          props.selectedScheduleData.networkName
                            ? props.selectedScheduleData.networkName
                            : "-"
                        } | 
                        ${
                          props.selectedScheduleData.estDate
                            ? Helper.FormatDate(
                                props.selectedScheduleData.estDate
                              )
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
              <Box className={!props.fullView ? classes.full : classes.half}>
              {props.currentScheduleAdUnit !== -1 ? (
                <Box mb={2}>
                  <TableContainer
                    square
                    component={Paper}
                    className={classes.filteredListTable}
                  >
                    <Table stickyHeader size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="caption" fontWeight="medium">
                              ISCI
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" fontWeight="medium">
                              Date-Range
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="caption" fontWeight="medium">
                              Advertiser/Compaign
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          // key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Box display="flex" alignItems="center">
                              <Checkbox
                                size="small"
                                className={classes.checkboxPadding}
                                onChange={(e) => handleIsciCheck(e)}
                                checked={checkedIsci}
                              />
                              <Typography variant="caption">
                                {props.currentSelectedIsci
                                  ? props.currentSelectedIsci.label
                                  : ""}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Checkbox
                                size="small"
                                className={classes.checkboxPadding}
                                onChange={(e) => handleDateCheck(e)}
                                checked={checkedDate}
                              />
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="caption">
                              {props.currentData
                                ? props.currentData.campaignOrAdvertiserName
                                : ""}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                ""
              )}
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
                      <Dropdown
                        size="small"
                        id="region"
                        variant="outlined"
                        showLabel={true}
                        lbldropdown="Region"
                        value={regionName}
                        handleChange={handleRegionChange}
                        ddData={regionData ? regionData : []}
                      />
                    </Grid>
                    
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
                        value={countryName}
                        ddData={countryData ? countryData : []}
                      />
                    </Grid>
                    {countryList.length > 0 && (
                      <Grid item xs={6}>
                        <ChipsList
                          name="country"
                          handleDelete={handleDelete}
                          showDelete={true}
                          className="chips"
                          label=""
                          data={countryList}
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
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={7}>
            <Grid
              item
              xs={4}
              display="flex"
              justifyContent="flex-end"
              ml={62}
              mt={1}
            >
              <Dropdown
                size="small"
                name="status"
                fullWidth
                lbldropdown="Status"
                value={statusName}
                ddData={[
                  {
                    label: "All",
                    value: -1,
                  },
                  {
                    label: "Ready",
                    value: 1,
                  },
                  {
                    label: "Not Ready",
                    value: 0,
                  },
                  {
                    label: "Trafficked",
                    value: 2,
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
      </Box>

      {/* 
      <Divider sx={{ width: "100%" }} /> */}
      {showLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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

RosTraffickingCopyUI.displayName = "RosTraffickingCopyUI";
export default RosTraffickingCopyUI;
