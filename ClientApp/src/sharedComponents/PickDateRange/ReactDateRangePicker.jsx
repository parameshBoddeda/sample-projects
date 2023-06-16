import * as React from 'react';
import TextField from '@mui/material/TextField';
import Helper from '../../common/Helper';
import { ToastContainer, toast } from "react-toastify";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from "react-datepicker";
import * as AppLanguage from '../../common/AppLanguage';

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    setMargin: {
        marginRight: theme.spacing(1.5),
    }
}));

function notifyWarning(message) { toast.warning(message) }

const ReactDateRangePicker = (props) => {
    const classes = useStyles();
    const [startDate, setStartDate] = React.useState(props.startDate ? new Date(props.startDate) : new Date());
    const [endDate, setEndDate] = React.useState(props.endDate ? new Date(props.endDate) : new Date());

    React.useEffect(() => {
        setStartDate(new Date(props.startDate));
    }, [props.startDate])

    React.useEffect(() => {

        setEndDate(new Date(props.endDate));
    }, [props.endDate])

    const handleStartDateChange = (value) => {
        // value = Helper.FormatDate(value);
        setStartDate(new Date(value));
        if (props.setStartDate) {
            props.setStartDate(new Date(value));
        }
    }

    const handleEndDateChange = (value) => {
        // value = Helper.FormatDate(value);
        if (!startDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace('____FieldName__', 'start date'));
            return false;
        }
        if (compareDate(startDate, value)) {
            setEndDate(new Date(value));
            if (props.setStartDate) {
                props.setEndDate(new Date(value));
            }
        } else {
            // notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
            //return false;
        }
    }

    const validateDateRange = () => {
        if (compareDate(startDate, endDate)) {
            notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
        } else {
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
                    <DatePicker placeholderText="Start Date" selected={startDate} onChange={(date) => handleStartDateChange(date)} />
                </FormGroup>
                <FormGroup>
                    <DatePicker placeholderText="End Date" selected={endDate} onChange={(date) => handleEndDateChange(date)} />
                </FormGroup>
            </Box>
        </LocalizationProvider>
    );
}

ReactDateRangePicker.displayName = "ReactDateRangePicker";
export default ReactDateRangePicker;