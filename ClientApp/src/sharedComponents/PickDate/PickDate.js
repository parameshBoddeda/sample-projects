import * as React from 'react';
import TextField from '@mui/material/TextField';
import Helper from '../../common/Helper';

const PickDate = (props) => {
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    if (props.setDefaultValue === true) {
      if (!value && props.initialValue !== "") {
        setValue(Helper.FormatDateToYYYYMMDD(props.initialValue));
      }
    }
  }, [props.initialValue]);

  return (
    <>
      <TextField fullWidth className={props.classList ? props.classList : ''}
        size={props.size}
        variant={props.variant ? props.variant : 'outlined'}
        type="date"
        label={props.showLabel !== false ? props.label ? props.label : "Label" : null}
        InputLabelProps={{ shrink: true }}
        disabled={props.disabled ? props.disabled : null}
        value={props.value ? props.value : value}
        onChange={(e) => {
          setValue(e.target.value ? e.target.value : null);
          if (props.setDate) {
            props.setDate(e.target.value ? e.target.value : null);
          }
        }} />
    </>
  );
}

PickDate.displayName = "DatePickerComponent";
export default PickDate;