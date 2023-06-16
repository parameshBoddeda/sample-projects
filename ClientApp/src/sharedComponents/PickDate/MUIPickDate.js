import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PickDate = (props) => {
  PickDate.displayName = "CustomDatePicker";
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    if(props.setDefaultValue === true) {
      if (!value && props.initialValue !== "") {
        setValue(props.initialValue);
      }
    }
}, [props.initialValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker className={props.classList ? props.classList : ''}        
        label={props.showLabel !== false ? props.label ? props.label : "Label" : null}
        value={props.value ? props.value : value}
        disablePast={props.disablePast === true ? props.disablePast : null}
        disabled={props.disabled ? props.disabled : null}
        onChange={(newValue) => {
          setValue(newValue);
          if(props.setDate) {
            props.setDate(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField size={props.size} variant={props.variant ? props.variant : 'outlined'} {...params} />
        )}
      />
    </LocalizationProvider>
  );
}

PickDate.displayName = "DatePickerComponent";
export default PickDate;