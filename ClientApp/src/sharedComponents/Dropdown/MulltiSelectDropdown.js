import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
const useStyled = makeStyles((theme) => ({
    dropdownSpacing: {
        '& .MuiInputBase-input': {
            paddingRight: theme.spacing(3) + 'px !important',
        },
    }
}));
const MultiSelectDropdown = (props) => {
    const classes = useStyled();
    const [tag, setTag] = useState([]);
    const [selected, setSelected] = useState(null);

    const onInputChange = (event, value) => {
        if (!value) {
            return false;
        }
        // setSelected(value.value);
        if (props.handleSelected) {
            props.handleSelected(value);
        }
    }

    const onSelectTag = (event, values) => {
        if (!values) {
            return false;
        }
        if (props.handleChange) {
            props.handleChange(props.name, values);
        }
    }

    useEffect(() => {
        if (props.ddData) { //&& props.ddData.length > 0 -> changed by RK
            setTag(props.ddData);
        }
        //console.log(props.value);
        if (props.value) {
            //console.log(props.value);
            setSelected(props.value);
        }
    }, [props.ddData])

    // useEffect(() => {
    //     setSelected(props.value);
    // }, [props.value])

    return (
        <Autocomplete disableClearable
            disablePortal blurOnSelect={true}
            disabled={props.disabled ? true : false}
            getOptionSelected={(option, value) => option.value === value.value}
            id={props.id ? props.id : "combo-box-demo"}
            onChange={onSelectTag}
            onInputChange={onInputChange}
            options={tag}
            size={props.size}
            value={selected}
            // inputValue={props.multiSelect ? "" : (selected || props.value)}
            className={`${classes.dropdownSpacing} ${props.classList ? props.classList : ""}`}
            fullWidth={props.fullWidth ? props.fullWidth : false}
            renderInput={(params) => <TextField variant={props.variant ? props.variant : 'outlined'} {...params} label={props.showLabel !== false ? props.lbldropdown ? props.lbldropdown : "Dropdown" : null} />}
        />
    );
}

MultiSelectDropdown.displayName = "MultiSelectDropdownComponent";
export default MultiSelectDropdown;