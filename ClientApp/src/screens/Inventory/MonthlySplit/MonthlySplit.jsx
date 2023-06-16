import React, { useState, useEffect, useContext } from "react";
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import {
  Box,
  IconButton,
  Grid,
  Button,
  Paper,
  Divider,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import TextboxField from "../../../sharedComponents/TextboxField/TextboxField";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import { injectStyle } from "react-toastify/dist/inject-style";
import CloseIcon from "@mui/icons-material/Close";
import {
  GetMonthlySchedule,
  InsertMonthlySchedule,
} from "../../../services/inventory.service";
import AppDataContext from "../../../common/AppContext";

if (typeof window !== "undefined") {
  injectStyle();
}

function notifyWarning(message) {
  toast.warning(message);
}
function notifySuccess(message) {
  toast.success(message);
}
const monthList = [
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
];

const monthListValues = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 330px)",
    overflowY: "auto",
  },
  containerWidth: {
    width: "100% !important",
    marginLeft: "0 !important",
  },
  Alert: {
    margin: theme.spacing(1),
  },
  spliUnitHeader: {
    backgroundColor: "#f8f8f8",
  },
  units: {
    height: theme.spacing(3),
    marginTop: theme.spacing(1.5),
  },
  border: {
    borderBottom: "1px solid #e9e9e9",
  },
  customTextBox: {
    "& .MuiInputBase-root": {
      fontSize: "0.75rem !important",
    },
    "& .MuiInputBase-input": {
      width: theme.spacing(7.5),
      padding: theme.spacing(0.5, 0.75) + "!important",
    },
  },
}));

const MonthlySplit = (props) => {
  const classes = useStyles();
  const [totalRecords, setTotalRecords] = useState(0);
  const { username, userId } = useContext(AppDataContext);
  const [monthlyTotal, setMonthlyTotal] = useState({
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  });
  const [monthlyRecords, setMonthlyRecords] = useState({
    January: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    February: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    March: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    April: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    May: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    June: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    July: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    August: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    September: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    October: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    November: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
    December: { prime: 0, nonPrime: 0, actualPrime: 0, actualNonPrime: 0 },
  });

  function notify(msgType, message) {
    if (msgType === "success") toast.success(message);
    else if (msgType === "warning") toast.warning(message);
    else toast.error("Opps there was an error. Please retry..!");
  }

  const handleChange = (e, name, month) => {
    //debugger;

    if (e.target.value < 0) {
      return;
    }

    let total = 0;
    monthList.forEach((month) => {
        total +=
            (Number(monthlyRecords[`${month}`].actualPrime) + Number(monthlyRecords[`${month}`].prime)) +
            (Number(monthlyRecords[`${month}`].actualNonPrime)+ Number(monthlyRecords[`${month}`].nonPrime));
        //(monthlyRecords[`${month}`].actualPrime > 0
        //  ? Number(monthlyRecords[`${month}`].actualPrime)
        //  : Number(monthlyRecords[`${month}`].prime)) +
        //(monthlyRecords[`${month}`].actualNonPrime > 0
        //  ? Number(monthlyRecords[`${month}`].actualNonPrime)
        //  : Number(monthlyRecords[`${month}`].nonPrime));

      // total +=
      //   Number(monthlyData[`${month}`].prime) +
      //   Number(monthlyData[`${month}`].nonPrime);
    });

    const textboxValue = { ...monthlyRecords };
    if (name === "prime") {
      textboxValue[`${month}`] = {
        [`${name}`]: e.target.value,
        nonPrime: textboxValue[`${month}`].nonPrime,

        actualPrime: textboxValue[`${month}`].actualPrime,

        actualNonPrime: textboxValue[`${month}`].actualNonPrime,
      };
    } else {
      textboxValue[`${month}`] = {
        [`${name}`]: e.target.value,
        prime: textboxValue[`${month}`].prime,
        actualPrime: textboxValue[`${month}`].actualPrime,
        actualNonPrime: textboxValue[`${month}`].actualNonPrime,
      };
    }

    let isValid = calculateTotal(textboxValue);

    if (isValid) {
      setMonthlyRecords(textboxValue);
      calculateMonthlyTotal(textboxValue);
    }
  };

  const calculateTotal = (monthlyData) => {
    let total = 0;
    monthList.forEach((month) => {
        total +=
            (Number(monthlyData[`${month}`].actualPrime) + Number(monthlyData[`${month}`].prime)) +
            (Number(monthlyData[`${month}`].actualNonPrime) + Number(monthlyData[`${month}`].nonPrime));
        //(monthlyData[`${month}`].actualPrime > 0
        //  ? Number(monthlyData[`${month}`].actualPrime)
        //  : Number(monthlyData[`${month}`].prime)) +
        //(monthlyData[`${month}`].actualNonPrime > 0
        //  ? Number(monthlyData[`${month}`].actualNonPrime)
        //  : Number(monthlyData[`${month}`].nonPrime));

      // total +=
      //   Number(monthlyData[`${month}`].prime) +
      //   Number(monthlyData[`${month}`].nonPrime);
    });

    //if (total <= props.projectedQuantity) {
      setTotalRecords(total);
      return true;
    //} else {
    //  notifyWarning("Total should not be greater than projected count.");
    //  return false;
    //}
  };

  const calculateMonthlyTotal = (monthlyData) => {
    let totalObj = {};
    monthList.forEach((month) => {
      totalObj[`${month}`] =
        ( Number(monthlyData[`${month}`].actualPrime) + Number(monthlyData[`${month}`].prime)) +
        ( Number(monthlyData[`${month}`].actualNonPrime) + Number(monthlyData[`${month}`].nonPrime));

        //(monthlyData[`${month}`].actualPrime > 0
        //    ? Number(monthlyData[`${month}`].actualPrime)
        //    : Number(monthlyData[`${month}`].prime)) +
        //    (monthlyData[`${month}`].actualNonPrime > 0
        //        ? Number(monthlyData[`${month}`].actualNonPrime)
        //        : Number(monthlyData[`${month}`].nonPrime));

    });
    setMonthlyTotal(totalObj);
  };

  const getMonthlyScheduleForInsert = () => {
    var monthlySchedule = [];

    monthList.forEach((month, index) => {
      var monthObj = monthlyRecords[`${month}`];

      var obj = {};
      obj.id = -1;
      obj.inventoryId = props.inventoryId;
      obj.month = monthListValues[index];
      obj.dayPartId = 851;
      //obj.dayPartValue =
      //  monthObj.actualPrime > 0
      //    ? Number(monthObj.actualPrime)
      //    : Number(monthObj.prime);

      obj.dayPartValue = Number(monthObj.prime);
      
      obj.actualScheduleCount = monthObj.actualPrime;
      obj.CreatedBy = username;
      monthlySchedule.push(obj);

      obj = {};
      obj.id = -1;
      obj.inventoryId = props.inventoryId;
      obj.month = monthListValues[index];
      obj.dayPartId = 852;
      //obj.dayPartValue =
      //  monthObj.actualNonPrime > 0
      //    ? Number(monthObj.actualNonPrime)
      //          : Number(monthObj.nonPrime);

      obj.dayPartValue = Number(monthObj.nonPrime);
      obj.actualScheduleCount = monthObj.actualNonPrime;
      obj.CreatedBy = username;
      monthlySchedule.push(obj);
    });

    return monthlySchedule;
  };

  const handleConfirm = () => {
    let isValid = calculateTotal(monthlyRecords);
    if (isValid) {
      var data = getMonthlyScheduleForInsert();

      InsertMonthlySchedule(data)
        .then((data) => {
          notifySuccess("Data saved successfully..!");
        })
        .catch((err) => console.log(err));
    } else {
      notifyWarning("Total should not be greater than projeted count.");
      return false;
    }
  };
  const handleClose = () => {
    if (props.handleClose) {
      props.handleClose();
    }
  };

  const putMonthlyData = (monthlyData) => {
    const textboxValue = { ...monthlyRecords };

    //debugger;
    monthList.forEach((month, index) => {
      var primeValue = 0,
        nonPrimeValue = 0,
        actualNonPrimeValue = 0,
        actualPrimeValue = 0;
      if (monthlyData != null && monthlyData.length > 0) {
        var arrMonthData = monthlyData.filter(
          (x) => x.month == monthListValues[index]
        );

        //console.log(objMonthData);
        if (arrMonthData.length > 0) {
          var objMonthData = arrMonthData[0];

          if (
            objMonthData.monthlyScheduleItems != null &&
            objMonthData.monthlyScheduleItems.some((x) => x.dayPartId == 851)
          ) {
            primeValue = objMonthData.monthlyScheduleItems.filter(
              (x) => x.dayPartId == 851
            )[0].dayPartValue;
            actualPrimeValue = objMonthData.monthlyScheduleItems.filter(
              (x) => x.dayPartId == 851
            )[0].actualScheduleCount;
            textboxValue[`${month}`] = {
              prime: Number(primeValue ? primeValue : 0),
              actualPrime: Number(actualPrimeValue ? actualPrimeValue : 0),
              nonPrime: Number(textboxValue[`${month}`].nonPrime),
              actualNonPrime: Number(textboxValue[`${month}`].actualNonPrime),
            };
          }

          if (
            objMonthData.monthlyScheduleItems != null &&
            objMonthData.monthlyScheduleItems.some((x) => x.dayPartId == 851)
          ) {
            nonPrimeValue = objMonthData.monthlyScheduleItems.filter(
              (x) => x.dayPartId == 852
            )[0].dayPartValue;
            actualNonPrimeValue = objMonthData.monthlyScheduleItems.filter(
              (x) => x.dayPartId == 852
            )[0].actualScheduleCount;
            textboxValue[`${month}`] = {
              nonPrime: Number(nonPrimeValue ? nonPrimeValue : 0),
              actualNonPrime: Number(
                actualNonPrimeValue ? actualNonPrimeValue : 0
              ),
              prime: Number(textboxValue[`${month}`].prime),
              actualPrime: Number(textboxValue[`${month}`].actualPrime),
            };
          }
        }
      }
    });

    calculateMonthlyTotal(textboxValue);
    setMonthlyRecords(textboxValue);
    let total = 0;
    monthList.forEach((month) => {
      total +=
        //(textboxValue[`${month}`].actualPrime > 0
        //  ? Number(textboxValue[`${month}`].actualPrime)
        //  : Number(textboxValue[`${month}`].prime)) +
        //(textboxValue[`${month}`].actualNonPrime > 0
        //  ? Number(textboxValue[`${month}`].actualNonPrime)
        //  : Number(textboxValue[`${month}`].nonPrime));
          ( Number(textboxValue[`${month}`].actualPrime) + Number(textboxValue[`${month}`].prime)) +
          ( Number(textboxValue[`${month}`].actualNonPrime) + Number(textboxValue[`${month}`].nonPrime));
    });

    setTotalRecords(total);
  };

  const getMonthlySchedules = (Id) => {
    //debugger;
    GetMonthlySchedule(Id)
      .then((data) => {
        //console.log(data);
        putMonthlyData(data);
        //setMonthlySchedule(data);
      })
      .catch((err) => console.log(err));
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

  useEffect(() => {
    getMonthlySchedules(props.inventoryId);
  }, [props.inventoryId]);

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12}>
            <Box p={1}>
              <GridHeader
                showIcon={true}
                icon={"monthlySplit"}
                hideCheckbox={true}
                headerText="Monthly Split"
              >
                <Box display="flex">
                  <IconButton size="small" onClick={handleClose}  href="#rowFocus">
                    <CloseIcon />
                  </IconButton>
                </Box>
              </GridHeader>
            </Box>
          </Grid>
        </Grid>
        <Grid container className={classes.containerWidth}>
          <Grid item xs={6}>
            <Box px={1} py={0.5}>
              <Typography
                variant="caption"
                fontWeight="medium"
                color="secondary"
              >
                Remaining Count:
                {Number(props.projectedQuantity) - Number(totalRecords)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} className={classes.units}>
            <Box display="flex" justifyContent="flex-end" pr={1.5}>
              <Typography fontWeight={"medium"} variant="caption">
                Projected Count: {props.projectedQuantity}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Grid container alignItems="center">
            <Grid item xs={1.2} className={classes.spliUnitHeader}>
              <Box p={0.5} pl={1}>
                <Typography variant="caption" fontWeight="medium" fontSize={11}>
                  Month
                </Typography>
              </Box>
            </Grid>
            {/* <Grid item xs={2} className={classes.spliUnitHeader}>
              <Box p={1}>
                <Typography variant="caption" fontWeight="medium">
                  Actual Prime
                </Typography>
              </Box>
            </Grid> */}
            <Grid item xs={2} className={classes.spliUnitHeader}>
              <Box p={0.5}>
                <Typography variant="caption" fontWeight="medium" fontSize={11}>
                  Prospects Prime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2} className={classes.spliUnitHeader}>
              <Box p={0.5}>
                <Typography variant="caption" fontWeight="medium" fontSize={11}>
                  Actual Prime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.spliUnitHeader}>
              <Box p={0.5}>
                <Typography variant="caption" fontWeight="medium" fontSize={11}>
                  Prospects Non-Prime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.spliUnitHeader}>
              <Box p={0.5}>
                <Typography variant="caption" fontWeight="medium" fontSize={11}>
                  Actual Non-Prime
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={0.8} className={classes.spliUnitHeader}>
              <Box p={0.5}>
                <Typography variant="caption" fontWeight="medium" fontSize={11}>
                  Total
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.contentHeight}>
            <Grid container className={classes.containerWidth}>
              {monthList.map((month, index) => {
                if (month)
                  return (
                    <Grid container className={classes.border}>
                      <Grid item xs={1.2}>
                        <Box px={1} py={0.5}>
                          <Typography variant="caption" key={"month" + index}>
                            {month}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={2}>
                        <Box px={2} py={0.5}>
                          {/* <TextboxField
                            classList={classes.customTextBox}
                            textboxData={monthlyRecords[`${month}`].prime}
                            size="small"
                            key={"txtprime" + index}
                            type="number"
                            handleBlur={(event) =>
                              handleBlur(event, "prime", month)
                            }
                          /> */}

                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type="number"
                            size="small"
                            onKeyDown={blockInvalidChar}
                            InputLabelProps={{ shrink: true }}
                            value={monthlyRecords[`${month}`].prime}
                            onChange={(event) =>
                              handleChange(event, "prime", month)
                            }
                            className={classes.customTextBox}
                            // disabled={
                            //   monthlyRecords[`${month}`].actualPrime > 0 ||
                            //   monthlyRecords[`${month}`].actualNonPrime > 0
                            //     ? true
                            //     : false
                            // }
                            // onBlur={(event) =>
                            //   handleBlur(event, "prime", month)
                            // }
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={2}>
                        <Box px={1} py={0.5} pr={12}>
                          <Typography
                            variant="caption"
                            key={"month" + index}
                            justifyContent="center"
                          >
                            {monthlyRecords[`${month}`].actualPrime > 0
                              ? monthlyRecords[`${month}`].actualPrime
                              : ""}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={3}>
                        <Box px={1} py={0.5}>
                          {/* <TextboxField
                            classList={classes.customTextBox}
                            key={"txtnonprime" + index}
                            size="small"
                            textboxData={monthlyRecords[`${month}`].nonPrime}
                            type="number"
                            handleBlur={(value) =>
                              handleBlur(value, "nonPrime", month)
                            }
                          /> */}

                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type="number"
                            size="small"
                            onKeyDown={blockInvalidChar}
                            InputLabelProps={{ shrink: true }}
                            value={monthlyRecords[`${month}`].nonPrime}
                            onChange={(event) =>
                              handleChange(event, "nonPrime", month)
                            }
                            className={classes.customTextBox}
                            // disabled={
                            //   monthlyRecords[`${month}`].actualPrime > 0 ||
                            //   monthlyRecords[`${month}`].actualNonPrime > 0
                            //     ? true
                            //     : false
                            // }
                            // onBlur={(event) =>
                            //   handleBlur(event, "prime", month)
                            // }
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={3} display="flex" justifyContent="center">
                        <Box px={1} py={0.5} pr={12}>
                          <Typography variant="caption" key={"month" + index}>
                            {monthlyRecords[`${month}`].actualNonPrime > 0
                              ? monthlyRecords[`${month}`].actualNonPrime
                              : ""}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={0.8}>
                        <Box px={1} py={0.5}>
                          <Typography variant="caption">
                            {monthlyTotal[`${month}`]}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  );
              })}
            </Grid>
          </Box>
          <Grid container className={classes.containerWidth}>
            <Grid item xs={11}>
              <Box px={1} py={0.5}>
                <Typography variant="caption" fontWeight="medium">
                  Total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={1} justifyContent="flex-end">
              <Box px={1} py={0.5}>
                <Typography variant="caption">{totalRecords}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ width: "100%" }} />
        </Box>

        {!props.onlyViewSplit && (
          <Box component="div" p={1.5}>
            <Grid container xs={12} justifyContent="flex-end">
              <Button  href="#rowFocus"
                color="secondary"
                onClick={handleClose}
                size="small"
                sx={{ marginRight: "8px" }}
              >
                Cancel
              </Button>
              <Button  href="#rowFocus"
                variant="contained"
                onClick={handleConfirm}
                size="small"
                color="primary"
              >
                Confirm
              </Button>
            </Grid>
          </Box>
        )}
      </Paper>
    </>
  );
};
MonthlySplit.displayName = "MonthlySplitComponent";
export default MonthlySplit;
