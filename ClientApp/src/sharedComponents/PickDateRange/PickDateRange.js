import * as React from 'react';
import TextField from '@mui/material/TextField';
import Helper from '../../common/Helper';
import { ToastContainer, toast } from "react-toastify";
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@mui/material';
import * as AppLanguage  from '../../common/AppLanguage';

const useStyles = makeStyles((theme) => ({
  setMargin: {
    marginRight: theme.spacing(1),
  },
  textBoxFullWidth: {
    width: "calc(50% - 4px)"
  }
}));

function notifyWarning(message) { toast.warning(message) }

const PickDateRange = (props) => {
  const classes = useStyles();
  const [startDate, setStartDate] = React.useState(props.startDate ? Helper.FormatDateToYYYYMMDD(props.startDate) : null);
  const [endDate, setEndDate] = React.useState(props.endDate ? Helper.FormatDateToYYYYMMDD(props.endDate) : null);

  React.useEffect(() => {
    setStartDate(Helper.FormatDateToYYYYMMDD(props.startDate));
  }, [props.startDate])

  React.useEffect(() => {
    setEndDate(Helper.FormatDateToYYYYMMDD(props.endDate));
  }, [props.endDate])

  const handleStartDateChange = (e) => {
    let value = e.target.value;
    if(value){
      if(compareDate(value, Helper.FormatDateToYYYYMMDD('9999-12-31'))){
        setStartDate(value);
      }
    } else {
      setStartDate(null);
    }    
  }

  const handleEndDateChange = (e) => {
    let value = e.target.value;
    if(value){
      if(compareDate(value, Helper.FormatDateToYYYYMMDD('9999-12-31'))){
        setEndDate(value);
      }
    }else {
      setEndDate(null);
    }
  }

  const handleStartDateBlur = (event) => {
    let value = event.target.value;
    if (props.setStartDate) {
      props.setStartDate(value);
    }

    if (endDate) {
      if (!compareDate(value, endDate)) {
        notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
        setEndDate("");
        if (props.setEndDate) {
          props.setEndDate(null);
        }
        return false;
      }
    }
  }

  const handleEndDateBlur = (event) => {
    let value = event.target.value;
    if (startDate) {
      if (!compareDate(startDate, value)) {
        notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
        setEndDate("");
        if (props.setEndDate) {
          props.setEndDate(null);
        }
        return false;
      } else {
        if (props.setEndDate) {
          props.setEndDate(value);
        }
      }
    } else {
      notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace('__FieldName__', "start date."));
      if (props.setEndDate) {
        props.setEndDate(value);
      }
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
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex">
        <FormGroup className={`${classes.setMargin} ${classes.textBoxFullWidth}`}>
          <TextField fullWidth id="startDate" variant={props.standard ? "standard" : "outlined"}
            disablePast={props.disablePast ?? false}
            disabled={props.disabled ? true : false}
            size="small"
            type="date"
            label={props.startDateLabel || "Start Date"}
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onBlur={handleStartDateBlur}
            onChange={handleStartDateChange} />
        </FormGroup>

        <FormGroup className={`${classes.textBoxFullWidth}`}>
          <TextField fullWidth disablePast={props.disablePast ?? false} disabled={props.disabled ? true : false}
            variant={props.standard ? "standard" : "outlined"} size="small"
            type="date" label={props.endDateLabel || "End Date"} InputLabelProps={{ shrink: true }}
            value={endDate} onChange={handleEndDateChange} onBlur={handleEndDateBlur} />
        </FormGroup>
      </Box>
    </>
  );
}

PickDateRange.displayName = "DateRangePicker";
export default PickDateRange;