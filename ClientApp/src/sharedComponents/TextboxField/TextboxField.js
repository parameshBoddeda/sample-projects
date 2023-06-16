import React from 'react';
import TextField from '@mui/material/TextField';

const TextboxField = (props) => {
    const [value, setValue] = React.useState(props.textboxData);
    const handleChange = (event) => {
        if(props.type === "number" && event.target.value < 1) {
            setValue("");
        } else {
            setValue(event.target.value);
            if(props.handleChange) {
                props.handleChange(event.target.value);
            }
        }        
    }

    const handleBlur = (event) => {
        if(props.type === "number" && event.target.value < 1) {
            setValue(0);
        } else {
            if(props.handleBlur){
                props.handleBlur(event.target.value);
            }
        }
    }

    React.useEffect(() => {
        setValue(props.textboxData);
    },[props.textboxData])

    return (
        <>
            <TextField variant={props.variant ? props.variant : 'outlined'}
                id={props.id ? props.id : "outlined-name"}
                disabled={props.disabled ? props.disabled : null}
                label={props.lblName ? props.lblName : ""}
                autoComplete="off" 
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                type={props.type ? props.type : "text"}
                size={props.size ? props.size : ''}
                fullWidth={props.fullWidth ? props.fullWidth : false}
                className={props.classList ? props.classList : ''}
                multiline={props.multiline ?? false}
                rows={props.multiline ? props.rows??2 : 1}
            />
        </>
    )
}

TextboxField.displayName = "TextboxFieldComponent";
export default TextboxField;