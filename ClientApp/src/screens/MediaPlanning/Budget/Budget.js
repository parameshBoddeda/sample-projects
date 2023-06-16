import React, { useContext, useEffect, useState } from "react";
import { TvOutlined } from "@mui/icons-material";
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Paper,
  Grid,
  IconButton,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Helper from "../../../common/Helper";
import {
  GetAssets,
  GetRegions,
  GetMedium,
  GetCountries,
  GetBrands,
  GetLookupById,
} from "../../../services/common.service";
import * as AppLanguage from '../../../common/AppLanguage';

import {
  SaveMediaPlanBudgets,
  GetMediaPlansBudgets,
} from "../../../services/planning.service";
import AppDataContext from "../../../common/AppContext";
import Dropdown from "../../../sharedComponents/Dropdown/Dropdown";
import DateRangePicker from "../../../sharedComponents/PickDateRange/PickDateRange";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import BudgetUI from "./BudgetUI";
import { ToastContainer, toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 189px)",
    overflowY: "auto",
  },
  plannedGridHeight: {
    height: "calc(100vh - 246px)",
    overflowY: "auto",
  },
}));

function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const Budget = (props) => {
  const classes = useStyles();

  const { Regions, Venturized, MarketType } = useContext(AppDataContext);
  const [planName, setPlanName] = React.useState(
    props.data.planName ? props.data.planName : null
  );
  const [planID, setPlanID] = React.useState(
    props.data.id ? props.data.id : null
  );
  const [region, setRegion] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [marketType, setMarketType] = useState(null);
  const [marketTypeData, setMarketTypeData] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [mediaTypeName, setMediaTypeName] = useState(null);
  const [mediumData, setMediumData] = useState([]);
  const [venturizedName, setVenturizedName] = useState(null);
  const [venturizedData, setVenturizedData] = useState([]);
  const [venturized, setVenturized] = useState(null);
  const { username, userId, leagueInfo, leagueId } = useContext(AppDataContext);

  const [asset, setAsset] = useState(null);
  const [assetName, setAssetName] = useState(null);
  const [regionData, setRegionData] = useState([]);

  const [mediaTypeData, setMediaTypeData] = useState([]);

  const [assetData, setAssetData] = useState([]);

  const [countryData, setCountryData] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [country, setCountry] = useState(null);
  const [billData, setBillData] = useState([]);
  const [bill, setBill] = useState(null);
  const [billName, setBillName] = useState(null);
  const [amount, setAmount] = useState(null);

  const [allPlannedBudget, setAllPlannedBudget] = useState([]);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [brandData, setBrandData] = useState([]);
  const [brand, setBrand] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [plannedBudgets, setPlannedBudgets] = useState([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [indexToChange, setIndexToChange] = useState(null);
  const [showForm, setShowForm] = React.useState(false);
  const [comments, setComments] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

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

  const getMediaTypeData = () => {
    GetMedium(-1)
      .then((data) => {
        if (data) {
          setMediumData(data);
          let list = data.map((item) => {
            return {
              label: item.mediumLookupDisplayText,
              value: item.mediumLookupId,
            };
          });
          setMediaTypeData(list);
        } else console.log("GetMedium API is failing");
      })
      .catch((error) => {
        console.log("Error in GetMedium ", error);
      });
  };

  const getAssetData = (_marketType, _venturized, _mediaType) => {
    //debugger;
    if (_marketType === null) _marketType = marketType;
    if (_venturized === null) _venturized = venturized;
    if (_mediaType === null) _mediaType = mediaType;
    if (_marketType === null || _venturized === null || _mediaType === null)
      return;

    GetAssets(leagueId, _marketType, _venturized, _mediaType).then((data) => {
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
    });
  };

  const getVenturizedData = () => {
    if (Venturized && Venturized.length > 0) {
      let list = Venturized.map((item) => {
        return { label: item.lookupText, value: item.lookupId };
      });
      setVenturizedData(list);
      let nonVenture = list.filter((x) => x.value == 952);
      setVenturized(nonVenture[0].value);
      setVenturizedName(nonVenture[0].label);
    }
  };

  const getMarketTypeData = () => {
    if (MarketType && MarketType.length > 0) {
      let list = MarketType.map((item) => {
        return { label: item.lookupText, value: item.lookupId };
      });
      setMarketTypeData(list);
    }
  };

  const getBrandsData = () => {
    GetBrands(props.data.customerId)
      .then((data) => {
        let b = [];
        data.map((item) => {
          b.push({ label: item.product, value: item.id });
        });
        setBrandData(b);
      })
      .catch((err) => console.log(err));
  };

  const getLookupStatus = () => {
    let id = 250;
    GetLookupById(id)
      .then((data) => {
        let bills = [];
        if (data) {
          data.map((item) => {
            bills.push({ label: item.lookupText, value: item.lookupId });
          });
          setBillData(bills);
        }
      })
      .catch((err) => console.log("err", err));
  };

  const getPlannedBudgets = () => {
    props.showLoading(true);
    props.openBackdrop(true);
    GetMediaPlansBudgets(props.data.id)
      .then((data) => {
        if (data) {
          setPlannedBudgets(data);
          props.showLoading(false);
          props.openBackdrop(false);
        }
      })
      .catch((err) => {
        props.showLoading(false);
        props.openBackdrop(false);
      });
  };

  useEffect(() => {
    getRegionData();

    getMediaTypeData();
    getCountryData(-1);
    getMarketTypeData();
    getVenturizedData();
    getBrandsData();
    getLookupStatus();
    getPlannedBudgets();
  }, []);

  useEffect(() => {
    props.callApiToRefreshGridData();
    getPlannedBudgets();
    setShowForm(false);
  }, [props.data.id]);

  //   Change Handlers :::::::::::::::::::::::::::::::::::::::::::::::::::::::\

  //   const handleRegionChange = (name, value) => {
  //     setRegion(value.value);
  //     setRegionName(value.label);
  //     if (value.label === "United States") {
  //       var selectedMarketType = marketTypeData.filter(
  //         (v) => v.label == "Domestic"
  //       );
  //       setMarketType(selectedMarketType[0].value);
  //     } else {
  //       var selectedMarketType = marketTypeData.filter(
  //         (v) => v.label == "International"
  //       );
  //       setMarketType(selectedMarketType[0].value);
  //     }
  //     getAssetData(selectedMarketType[0].value, null, null);
  //   };

  const handleCountryChange = (name, value) => {
    setCountry(value.value);
    setCountryName(value.label);

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
    setAsset(null);
    setAssetName(null);
    getAssetData(selectedMarketType[0].value, null, null);
  };

  const handleMediaTypeChange = (name, value) => {
    setMediaType(value.value);
    setMediaTypeName(value.label);
    setAsset(null);
    setAssetName(null);
    getAssetData(null, null, value.value);
  };

  const handleAssetChange = (name, value) => {
    setAsset(value.value);
    setAssetName(value.label);
  };

  const handleBillChange = (name, value) => {
    console.log("v", value);
    setBill(value.value);
    setBillName(value.label);
  };

  const handleBrandChange = (name, value) => {
    setBrand(value.value);
    setBrandName(value.label);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleAddBudget = () => {
    let plan = {
      planName: planName,

      // "startDate": props.startDate,
      // "endDate": props.endDate,
      billname: billName,
      country: countryName,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      mediatype: mediaTypeName,
      asset: assetName,
      brand: brandName,
      amount: amount,
    };
    console.log(plan);

    let p = [...allPlannedBudget, plan];
    setAllPlannedBudget(p);
    let v = checkValidation();
    sendPlan(v);
  };

  const sendPlan = (v) => {
    if (!v) {
      const data = {
        id: 0,
        mediaPlanId: props.data.id,
        mediaPlanName: props.data.planName,
        // billTypeId: bill,
        // billTypeName: billName,
        countryId: country,
        countryName: countryName,
        mediaTypeId: mediaType,
        mediaTypeName: mediaTypeName,
        assetId: asset,
        assetName: assetName,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        productId: brand ?? 0,
        productName: brandName,
        plannedBudget: amount,
        user: username,
        comment: comments,
      };
      props.showLoading(true);
      props.openBackdrop(true);
      SaveMediaPlanBudgets(data)
        .then((data) => {
          if (data) {
            notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
            getPlannedBudgets();
            resetFormData();
            props.callApiToRefreshGridData();
          }
          props.showLoading(false);
          props.openBackdrop(false);
        })
        .catch((err) => {
          props.showLoading(false);
          props.openBackdrop(false);
          console.log("err", err);
        });
      setShowForm(false);
    }
  };

  const handleEdit = (data) => {
    setIsEdit(true);
    setIndexToChange(data.id);

    setAsset(data.assetId);
    setAssetName(data.assetName);

    // setBill(data.billTypeId);
    // setBillName(data.billTypeName);

    setBrand(data.productId);
    setBrandName(data.productName);

    setMediaType(data.mediaTypeId);
    setMediaTypeName(data.mediaTypeName);
    
    setCountry(data.countryId);
    setCountryName(data.countryName);
    let MarketType;
    if (data.countryName === "United States") {
      MarketType = marketTypeData.find((v) => v.label == "Domestic");
    } else {
      MarketType = marketTypeData.find((v) => v.label == "International");      
    }
    setMarketType(MarketType.value);
    getAssetData(MarketType.value, null, data.mediaTypeId);
    
    setSelectedStartDate(Helper.FormatToIsoDate(data.startDate));

    setSelectedEndDate(Helper.FormatToIsoDate(data.endDate));

    setAmount(data.plannedBudget);
    setComments(data.comment);
  };

  const refreshData = ()=>{
    props.callApiToRefreshGridData();
    getPlannedBudgets();
  }

  const showPlanned = () => {
    if (plannedBudgets.length < 0) {
      return "No records";
    }

    if (plannedBudgets.length > 0) {
      return plannedBudgets.map((item, index) => {
        return (
          <BudgetUI
            data={item}
            handleEdit={handleEdit}
            setShowForm={setShowForm}
            refreshData={refreshData}
          />
        );
      });
    }
  };

  const getTotalBudget = () => {
    if (plannedBudgets.length > 0) {
      let total = [];

      plannedBudgets.forEach((item) => {
        total.push(item.plannedBudget);
      });
      return Helper.ConvertToDollarFormat(total.reduce((a, b) => a + b, 0));
    }
  };

  const setStartDate = (value) => {
    setSelectedStartDate(Helper.FormatToIsoDate(value));
  };

  const setEndDate = (value) => {
    setSelectedEndDate(Helper.FormatToIsoDate(value));
  };

  const checkValidation = () => {
    let error = false;

    if (!countryName) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Country"));
      error = true;
    }
    // if (!billName) {
    //   notifyWarning("Bill Type is required field.");
    //   error = true;
    // }
    if (!assetName) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Asset"));
      error = true;
    }
    if (!amount) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Planned $ Amount"));
      error = true;
    }
    if (!mediaTypeName) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Media Type"));
      error = true;
    }
    if (!selectedStartDate) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Start Date"));
      error = true;
    }

    if (!selectedEndDate) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "End Date"));
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

  const resetFormData = () => {
    setAsset(null);
    setAssetName(null);

    // setBill(null);
    // setBillName(null);

    setBrand(null);
    setBrandName(null);

    setMediaType(null);
    setMediaTypeName(null);

    setCountry(null);
    setCountryName(null);

    setSelectedStartDate(null);

    setSelectedEndDate(null);

    setAmount(null);
    setComments("");
  };

  const handleSubmit = () => {
    setIsEdit(false);
    const d = {
      id: indexToChange,
      mediaPlanId: props.data.id,
      // mediaPlanName: props.data.planName,
      //   billTypeId: bill,
      //  billTypeName: billName,
      countryId: country,
      //  countryName: countryName,
      mediaTypeId: mediaType,
      //  mediaTypeName: mediaTypeName,
      assetId: asset,
      //  assetName: assetName,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      productId: brand ?? 0,
      //  productName: brandName,
      plannedBudget: amount,
      comment: comments,
      user: username,
    };

    SaveMediaPlanBudgets(d)
      .then((d) => {
        if (d) {
          notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
          getPlannedBudgets();
          resetFormData();
          props.callApiToRefreshGridData();
        }
      })
      .catch((err) => {
        setShowLoading(false);
        setOpenBackdrop(false);
        console.log("err", err);
      });

    setShowForm(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
    setIsEdit(false);
    resetFormData();
    setSelectedStartDate(props.seasonStartDate);
    setSelectedEndDate(props.seasonEndDate);

    setMarketType(111);
    setCountry(60);
    setCountryName("United States");

    if (brandData.length > 0) {
      if (brandData.length === 1) {
        setBrandName(brandData[0].label);
        setBrand(brandData[0].value);
      } else {
        let common = brandData.find(
          (item) =>
            item.label.toLowerCase() === props.data.customerName.toLowerCase()
        );

        setBrandName(common.label);
        setBrand(common.value);
      }
    }
  };

  const handleCancel = () => {
    resetFormData();
    setShowForm(false);
    setIsEdit(false);
  };

  const handleComments = (e) => {
    setComments(e.target.value);
  };

  return (
    <Paper elevation={0}>
      <Grid container>
        <Grid item xs={12}>
          <Box p={1}>
            <GridHeader
              hideExpendIcon={props.hideExpendIcon}
              showIcon={true}
              icon={"budget"}
              hideCheckbox={true}
              headerText="Planned $ Amount"
            >
              <Box display="flex" flex="1" justifyContent="flex-end">
                {/* <Button variant="contained" color="inherit" startIcon={<TvOutlined />} onClick={(e) => props.showMediaPlanningContainer(props.data.id)}>
                  Media Planning
                </Button> */}
                {props.showCloseIcon && (
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton size="small" onClick={props.handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </GridHeader>
            <Box>
              <Box component="div" mt={1} display="flex" justifyContent="space-between" >
                <Box component="div" mt={1}>
                  <Typography variant="subtitle2">
                    {" "}
                    {props.data.planName} |{" "}
                    {props.data.startDate
                      ? Helper.FormatDate(props.data.startDate)
                      : ""}
                    {props.data.endDate
                      ? ` | ${Helper.FormatDate(props.data.endDate)}`
                      : ""}
                  </Typography>
                </Box>
              
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={0.5}
                >
                {!showForm &&<IconButton
                    title="Add Planned Amount"
                    size="small"
                    color="primary"
                    onClick={handleShowForm}
                  >
                    <AddCircleOutlinedIcon />
                  </IconButton>}
                </Box>              
              </Box>
              <Divider width="100%" />
              
              {showForm && (
                <Grid container alignItems="center" spacing={1} mt={1}>
                  {/* <Grid item xs={4}>
                <Dropdown
                  size="small"
                  id="region"
                  variant="outlined"
                  showLabel={true}
                  lbldropdown="Region"
                  handleChange={handleRegionChange}
                  ddData={regionData ? regionData : []}
                />
              </Grid> */}

                  {/* <Grid item xs={3}>
                    <Dropdown
                      size="small"
                      id="billData"
                      variant="outlined"
                      showLabel={true}
                      lbldropdown="Bill Type"
                      handleChange={handleBillChange}
                      ddData={billData ? billData : []}
                      value={billName}
                    />
                  </Grid> */}

                  <Grid item xs={3}>
                    <Dropdown
                      size="small"
                      id="country"
                      variant="outlined"
                      showLabel={true}
                      lbldropdown="Country"
                      handleChange={handleCountryChange}
                      value={countryName}
                      ddData={countryData ? countryData : []}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Dropdown
                      size="small"
                      id="MediaType"
                      variant="outlined"
                      showLabel={true}
                      lbldropdown="Media Type"
                      handleChange={handleMediaTypeChange}
                      ddData={mediaTypeData ? mediaTypeData : []}
                      value={mediaTypeName}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Dropdown
                      size="small"
                      id="asset"
                      variant="outlined"
                      showLabel={true}
                      lbldropdown="Asset"
                      handleChange={handleAssetChange}
                      ddData={assetData ? assetData : []}
                      value={assetName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateRangePicker
                      startDate={selectedStartDate}
                      endDate={selectedEndDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Dropdown
                      size="small"
                      id="brand"
                      variant="outlined"
                      showLabel={true}
                      lbldropdown="Brand"
                      handleChange={handleBrandChange}
                      ddData={brandData ? brandData : []}
                      value={brandName}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="amount"
                      size="small"
                      variant="outlined"
                      type="number"
                      label="Planned $ Amount"
                      value={amount}
                      onChange={handleAmount}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="comments"
                      size="small"
                      variant="outlined"
                      type="text"
                      label="Comments"
                      multiline={true}
                      minRows={2}
                      value={comments}
                      onChange={handleComments}
                    />
                  </Grid>
                  <Grid
                    container
                    xs={12}
                    justifyContent="flex-end"
                    marginTop={3}
                  >
                    <Button
                      onClick={handleCancel}
                      color="secondary"
                      size="small"
                      sx={{ marginRight: "8px" }}
                    >
                      Cancel
                    </Button>
                    {isEdit ? (
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ marginRight: "8px" }}
                      >
                        Update
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddBudget}
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ marginRight: "8px" }}
                      >
                        Save
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )}
              
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* {isEdit ? (
        <Grid container xs={12} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSubmit}
            size="small"
            color="primary"
          >
            Save
          </Button>
        </Grid>
      ) : (
        <Grid item xs={8}>
          <IconButton
            title="Add Planned Amount"
            size="small"
            color="primary"
            onClick={handleAddBudget}
          >
            <AddCircleOutlinedIcon />
          </IconButton>
        </Grid>
      )} */}

      <Box className={classes.plannedGridHeight}>
        <Box>{!showForm ? showPlanned() : ""}</Box>
        {!showForm && plannedBudgets.length > 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            justifyContent="center"
            pr={6.25}
          >
            <Typography variant="body1" fontWeight={600}>
              {getTotalBudget()}
            </Typography>
            <Typography variant="caption" fontWeight="medium">
              Total Planned Budget
            </Typography>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </Paper>
  );
};
Budget.displayName = "Budget";
export default Budget;
