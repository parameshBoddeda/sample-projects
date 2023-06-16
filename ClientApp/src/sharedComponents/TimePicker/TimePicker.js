import * as React from 'react';
import TextField from '@mui/material/TextField';

const TimePicker = (props) => {
    const handleChange = (event) => {
        if(props.handleChange) {
            props.handleChange(event.target.value);
        }
    };

    const handleBlur = (event) => {
        if(props.handleBlur){
            props.handleBlur(event.target.value);
        }
    }
  return (
    <>      
      <TextField
        id="time"
        label={props.lblName}
        type="time"
        fullWidth
        size={props.size ? props.size : "medium"}
        defaultValue={props.defaultValue}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </>
  );
}

TimePicker.displayName = "TimePicker";
export default TimePicker;