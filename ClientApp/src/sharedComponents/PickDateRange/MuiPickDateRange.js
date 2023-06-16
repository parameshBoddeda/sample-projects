import * as React from 'react';
import TextField from '@mui/material/TextField';
import Helper from '../../common/Helper';
import { ToastContainer, toast } from "react-toastify";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@mui/material';
import * as AppLanguage from '../../common/AppLanguage';

const useStyles = makeStyles((theme) => ({
  setMargin: {
    marginRight: theme.spacing(1.5),
  }
}));

function notifyWarning(message) { toast.warning(message) }

const PickDateRange = (props) => {
  const classes = useStyles();
  const [startDate, setStartDate] = React.useState(props.startDate ? props.startDate : null);
  const [endDate, setEndDate] = React.useState( props.endDate ? props.endDate : null);

  React.useEffect(() => {
    setStartDate(props.startDate);
  }, [props.startDate])

  React.useEffect(() => {
    setEndDate(props.endDate);
  }, [props.endDate])

  const handleStartDateChange = (value) => {
    value = Helper.FormatDate(value);
    setStartDate(value);
    if (props.setStartDate) {
      props.setStartDate(value);
    }
  }

  const handleEndDateChange = (value) => {
    value = Helper.FormatDate(value);
    if(!startDate) {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace('__FieldName__', 'start date'));
      return false;
    }
    if (compareDate(startDate, value)) {
      setEndDate(value);
      if (props.setStartDate) {
        props.setEndDate(value);
      }
    } else {
     // notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
      //return false;
    }
  }

  const validateDateRange = () => {
    if (!compareDate(startDate, endDate)) {
      notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
    }else{
      console.log("in else")
    }
  }
  const compareDate = (startDate, endDate) => {
    if (new Date(startDate) <= new Date(endDate)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer autoClose={3000} />
      <Box display="flex">
        <FormGroup className={classes.setMargin}>
          <DatePicker disablePast={props.disablePast ?? false} size="small"
            label={props.startDateLabel || "Start Date"}
            value={startDate}
            onChange={(newValue) => {
              handleStartDateChange(newValue);
            }}
            renderInput={(params) => <TextField variant={props.standard?"standard":"outlined"} size="small" {...params} />} />
        </FormGroup>
        <FormGroup>
          <DatePicker disablePast={props.disablePast ?? false} size="small"
            label={props.endDateLabel || "End Date"}
            value={endDate}
            onChange={(newValue) => {
              handleEndDateChange(newValue);
            }}
            renderInput={(params) => <TextField  variant={props.standard?"standard":"outlined"} onBlur={validateDateRange} size="small" {...params} />}
          />
        </FormGroup>
      </Box>
    </LocalizationProvider>
  );
}

PickDateRange.displayName = "DateRangePicker";
export default PickDateRange;