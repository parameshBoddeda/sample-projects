import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import clsx from 'clsx';
import './SelectDropdown.css'

const styles = makeStyles((theme) => ({
  root: {    
    padding: theme.spacing(2),    
  }
}));

const SelectDropdown = (props) => {
  const classes = styles();
  const handleChange = (event) => {
    props.handleChange(event.target.value);
  };

  const getName = (ele)=>{
    if (ele.label === '2K League') return 'TWOK';
    if (ele.label === 'G-League' || ele.label === 'G League') return 'GLEAGUE';
    if (ele.label === 'Jr. NBA') return 'JRNBA';
    
    return ele.label;
  }

  return (
    <Box>
      <FormControl className={props.className} fullWidth={props.fullwidth ? props.fullwidth : null}>
        <InputLabel  id="demo-simple-select-label">{props.label ? props.label : ''}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.selectValue ? props.selectValue : ""}
          onChange={handleChange}
        >
        {
            props.data.map((ele, index) => {
              return <MenuItem key={index} value={ele.value}>{props.showImages ? <img className={clsx(`${getName(ele)}_Logo`, classes.root)} alt={""}/> : ''}{ele.label}</MenuItem>
            })
        }
        </Select>
      </FormControl>
    </Box>
  );
}

SelectDropdown.displayName = "SelectDropdownComponent";
export default SelectDropdown;