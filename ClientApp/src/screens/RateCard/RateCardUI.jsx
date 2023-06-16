//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  TextField,
  Paper,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
//Global Imports End

//Regional Imports Start
import Helper from "../../common/Helper";
import { InsertRateCard } from "../../services/rate.service";
import AppDataContext from "../../common/AppContext";

//Regional Imports End

function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const useStyles = makeStyles((theme) => ({
  rowContainer: {
    border: "none",
    borderBottom: "1px solid",
    width: "100%",
  },
  container: {
    padding: "16px 0px",
    width: "100%",
  },
  date1: {
    "& .MuiInputLabel-root": {
      fontSize: ".75rem",
      transform: "translate(14px, 6px) scale(1)",
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.35, 0.75),
    },
  },
  selected: {
    background: "#e4ecff",
  },
  rateCardRow: {
    cursor: "pointer",
  },
  updatedRate: {
    color: "#ff6347",
  },
  validFrom: {
    width: "-webkit-fill-available",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const RateCardUI = (props) => {
  let { data, index, view } = props;
  const classes = useStyles();

  //.....Hooks decalaration - Start
  const { username, userId } = useContext(AppDataContext);
  const [rate, setRate] = useState(props.data.rate ? props.data.rate : 0);
  const [changePerc, setChangePerc] = useState(0);
  const [validFrom, setValidFrom] = useState(null);
  const [userAction, setUserAction] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [totalRate, setTotalRate] = useState(0);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
      let newRate = (changePerc * Number(rate)) / 100 + Number(rate);
      if (newRate) {
        setTotalRate(newRate.toFixed(2));
      }
  }, [changePerc]);

  //.....Hooks decalaration - End

  //.....API calls Handlers -Start
  const insertRateCard = (obj) => {
    InsertRateCard(obj)
      .then((data) => {
        notifySuccess("Rate Card saved successfully");
        setIsEditing(false);
        setValidFrom(Helper.FormatDateToYYYYMMDD(new Date()));        
        if(props.refreshDataFromDB){
          props.refreshDataFromDB();
        }
        setChangePerc(0);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const callApiToSaveData = (caller) => {
    if (caller === "updateRate") {
      if (rate < 0) {
        notifyWarning("Rate value cannot be less than or equal to 0");
        return;
      }
      let reqObj = {
        actionType: 1,
        rateCardMasterId: data.rateCardMasterId,
        customerRateId: data.customerRateId,
        customerId: data.customerId,
        leagueId: data.leagueId,
        leagueName: data.leagueName,
        regionId: data.regionId,
        regionName: data.regionName,
        countryId: data.countryId,
        countryName: data.countryName,
        networkId: data.networkId,
        networkName: data.networkName,
        programId: data.programId,
        programName: data.programName,
        unitTypeId: data.unitTypeId,
        unitTypeName: data.unitTypeName,
        unitSizeId: data.unitSizeId,
        unitSizeName: data.unitSizeName,
        rateTypeId: data.rateTypeId,
        rateTypeName: data.rateTypeName,
        dayPartId: data.dayPartId,
        dayPartName: data.dayPartName,
        repeatComment: data.repeatComment,
        notes: data.notes,
        rate: rate,
        validFrom: data.validFrom,
        isLatest: data.isLatest,
        createdBy: username,
        createdDate: data.createdDate,
        updatedBy: username,
        updatedDate: new Date(),
      };

      insertRateCard(reqObj);
    } else if (caller === "increaseRate") {
      if (totalRate < 1) {
        notifyWarning("Rate value cannot be less than 1");
        return;
      }
      if (validFrom === null) {
        notifyWarning("Please select the Valid From Date");
        return;
      }
      let reqObj = {
        actionType: 2,
        rateCardMasterId: data.rateCardMasterId,
        customerRateId: data.customerRateId,
        customerId: data.customerId,
        leagueId: data.leagueId,
        leagueName: data.leagueName,
        regionId: data.regionId,
        regionName: data.regionName,
        countryId: data.countryId,
        countryName: data.countryName,
        networkId: data.networkId,
        networkName: data.networkName,
        programId: data.programId,
        programName: data.programName,
        unitTypeId: data.unitTypeId,
        unitTypeName: data.unitTypeName,
        unitSizeId: data.unitSizeId,
        unitSizeName: data.unitSizeName,
        rateTypeId: data.rateTypeId,
        rateTypeName: data.rateTypeName,
        dayPartId: data.dayPartId,
        dayPartName: data.dayPartName,
        repeatComment: data.repeatComment,
        notes: data.notes,
        rate: totalRate,
        validFrom: validFrom,
        changePerc: changePerc,
        isLatest: data.isLatest,
        createdBy: username,
        createdDate: data.createdDate,
        updatedBy: username,
        updatedDate: new Date(),
      };
      insertRateCard(reqObj);
    }
  };
  //.....API calls Handlers -End
  //.....UI Change Handlers - Start

  const handleClick = (index, rateCardMasterId, caller) => {
    setCurrentId(rateCardMasterId);
    if (caller === "updateRate") {
      setUserAction("updateRate");
      setRate(props.data.rate);
      setTotalRate(props.data.rate);
      setIsEditing(true);
      return;
    } else if (caller === "increaseRate") {
      setValidFrom(Helper.FormatDateToYYYYMMDD(new Date()));
      setRate(props.data.rate);
      setTotalRate(props.data.rate);
      setUserAction("increaseRate");
      setIsEditing(true);
      return;
    }
  };

  const handleRateActions = (caller) => {
    if (caller === "cancel") {
      setIsEditing(false);
      setValidFrom(null);
      setRate(props.data.rate);
      setChangePerc(0);
      return;
    } else if (caller === "save" && userAction === "updateRate") {
      callApiToSaveData("updateRate");
    } else if (caller === "save" && userAction === "increaseRate") {
      callApiToSaveData("increaseRate");
    }
  };

  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handleValidFromChange = (e) => {
    setValidFrom(e.target.value);
  };

  const handleChangePerc = (e) => {
    setChangePerc(e.target.value);
  };

  const handleTotalRateChange = (e) => {
    setTotalRate(e.target.value);
  };
  //.....UI Change Handlers - End

  return (
    <React.Fragment>
      <Grid
        className={`${classes.rateCardRow} ${
          data.id &&
          props.selectedInventoryId &&
          data.id === props.selectedInventoryId
            ? classes.selected
            : ""
        }`}
        key={`Grid${index}`}
        item
        xs={12}
      >
        <Box px={1}>
          <Grid container alignItems="center">
            <Grid item xs={props.view ? 11.75 : 11.5} onClick={() => {}}>
              <Grid container>
                <Grid item xs={props.view ? 1 : 2}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Customer</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.customerName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={props.view ? 1.55 : 3.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">
                        League | Region | Country
                      </Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2">
                        {data.leagueName ? data.leagueName : ""}
                        {data.regionName ? ` | ${data.regionName}` : ""}
                        {data.countryName ? ` | ${data.countryName}` : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={props.view ? 1.2 : 2}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Partner</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.networkName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1 : 1.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Channel</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        noWrap
                        title={data.channelName}
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.channelName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1 : 1.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Asset</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        noWrap
                        title={data.assetName}
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.assetName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1.15 : 2.5}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">
                        Prime / Non-Prime
                      </Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2">
                        {data.dayPartName ? data.dayPartName : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1.3 : 3}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">
                        Unit Type | Unit Size
                      </Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2">
                        {data.unitTypeName ? data.unitTypeName : ""}
                        {data.unitSizeName ? ` | ${data.unitSizeName}` : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={
                    isEditing && userAction === "increaseRate"
                      ? props.view
                        ? 0.75
                        : 1.75
                      : props.view
                      ? 1
                      : 2.25
                  }
                >
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Rate Type</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2">
                        {data.rateTypeName ? data.rateTypeName : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={
                    isEditing && userAction === "increaseRate"
                      ? props.view
                        ? 1.8
                        : 4
                      : props.view
                      ? 1
                      : 2.5
                  }
                >
                  <Box
                    display="flex"
                    flexDirection={
                      isEditing && userAction === "increaseRate"
                        ? "row"
                        : "column"
                    }
                    justifyContent={
                      isEditing && userAction === "increaseRate"
                        ? "start"
                        : "space-between"
                    }
                  >
                    {isEditing && userAction === "updateRate" ? (
                      <>
                        <Box component="div">
                          <TextField
                            id="rate"
                            size="small"
                            variant="standard"
                            type="number"
                            label="Rate"
                            InputProps={{
                              inputProps: {
                                max: 10000000,
                                min: 1,
                              },
                            }}
                            value={rate}
                            onChange={handleRateChange}
                          />
                        </Box>
                      </>
                    ) : isEditing && userAction === "increaseRate" ? (
                      <>
                        <Box component="div">
                          <TextField
                            id="changePerc"
                            size="small"
                            variant="standard"
                            type="number"
                            label="Change (%)"
                            InputProps={{
                              inputProps: {
                                max: 100,
                                min: -100,
                              },
                            }}
                            value={changePerc}
                            onChange={handleChangePerc}
                          />
                        </Box>
                        <Box>
                          <Box
                            component="div"
                            display="flex"
                            alignItems="flex-end"
                          >
                            <Typography
                              variant="subtitle2"
                              component="div"
                              display="flex"
                              alignItems="center"
                            >
                              {" "}
                              <Box component="span">*&nbsp;</Box>
                              <Box component="span">
                                {data.rate ? data.rate : ""}&nbsp;
                              </Box>
                              <Box component="span">=</Box>
                            </Typography>
                            &nbsp;
                            <TextField
                              id="totalRate"
                              size="small"
                              variant="standard"
                              label="Rate"
                              type="number"
                              InputProps={{
                                inputProps: {
                                  max: 10000000,
                                  min: 1,
                                },
                              }}
                              value={totalRate}
                              onChange={handleTotalRateChange}
                            />
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box component="div">
                          <Typography variant="caption">Rate</Typography>
                        </Box>
                        <Box component="div">
                          <Typography variant="subtitle2">
                            {data.rate
                              ? Helper.ConvertToDollarFormat(data.rate)
                              : ""}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={
                    isEditing && userAction === "increaseRate"
                      ? props.view
                        ? 1.25
                        : 3
                      : props.view
                      ? 1.25
                      : 2
                  }
                >
                  <Box display="flex" flexDirection="column" pl={1}>
                    {isEditing && userAction === "increaseRate" ? (
                      <>
                        <Box component="div">
                          <TextField
                            className={classes.validFrom}
                            id="validFrom"
                            size="small"
                            variant="standard"
                            type="date"
                            label="Valid From"
                            InputLabelProps={{ shrink: true }}
                            value={validFrom}
                            onChange={handleValidFromChange}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box component="div">
                          <Typography variant="caption">Valid From</Typography>
                        </Box>
                        <Box component="div">
                          <Typography variant="subtitle2">
                            {data.validFrom
                              ? Helper.FormatDate(data.validFrom)
                              : ""}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {data.customerId === 0 && (
              <Grid
                xs={props.view ? 0.25 : 0.5}
                key={`GridAction${index}`}
                container
                alignItems="center"
                justifyContent="flex-end"
              >
                <Box
                  display="flex"
                  flexDirection={"column"}
                  justifyContent="space-between"
                >
                  {!isEditing ? (
                    <>
                      <IconButton
                        title="Update Rate"
                        size="small"
                        onClick={() =>
                          handleClick(
                            index,
                            data.rateCardMasterId,
                            "updateRate"
                          )
                        }
                      >
                        <CurrencyExchangeIcon />
                      </IconButton>
                      <IconButton
                        title="Increase Base Rate"
                        size="small"
                        onClick={() => {
                          handleClick(
                            index,
                            data.rateCardMasterId,
                            "increaseRate"
                          );
                        }}
                      >
                        <FileUploadOutlinedIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        title="Save Change"
                        size="small"
                        onClick={() => handleRateActions("save")}
                      >
                        <SaveOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        title="Cancel Change"
                        size="small"
                        onClick={() => handleRateActions("cancel")}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

export default RateCardUI;
