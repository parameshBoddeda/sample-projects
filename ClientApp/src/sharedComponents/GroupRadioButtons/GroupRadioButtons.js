import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
const dummyData = require('../../static/dummyData.json')

const useStyled = makeStyles((theme) => ({
    label: {
        fontWeight: "bolder"
    }
}));
const GroupRadioButtons = (props) => {
    const classes = useStyled();
    const [value, setValue] = React.useState('');
    const handleRadioChange = (event) => {
        setValue(event.target.value);
        if(props.handleRadioChange) {
            props.handleRadioChange(event.target.value);
        }
    };
    let options = props.options ? props.options : dummyData.RadioButtons;
    return (
        <FormControl>
        <FormLabel id="radio-buttons-group-label">{props.label ? props.label : "Default"}</FormLabel>
        <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue={options.defaultValue}
            name="radio-buttons-group"
            onChange={handleRadioChange}
        >
            { options.data.map((value, index) => {
                return <FormControlLabel className={classes.label} value={value} key={`radio-${value}-${index}`} control={<Radio />} label={value} />
            })}
            
        </RadioGroup>
        </FormControl>
    );
}

GroupRadioButtons.displayName = "GroupRadioButtonsComponent";
export default GroupRadioButtons;