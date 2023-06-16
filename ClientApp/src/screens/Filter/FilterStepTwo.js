import * as React from 'react';
import ChipsList from '../../sharedComponents/chips/ChipsList';
import { makeStyles } from '@material-ui/core/styles';
import MultipleSelect from '../../sharedComponents/MultipleSelect/MultipleSelect';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextboxField from '../../sharedComponents/TextboxField/TextboxField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Autocomplete from '../../sharedComponents/Dropdown/Dropdown.js';
import TextField from '@mui/material/TextField';
import MultiSelectDropdown from "../../sharedComponents/Dropdown/MulltiSelectDropdown";

const useStyles = makeStyles((theme) => ({
    mainClass: {
        '& .MuiPaper-rounded': {
            boxShadow: "none"
        }
    },
    elementContainer:{
        margin: '10px 0px'
    },
    chipLabel:{
        display:'flex',
        marginBottom: '5px'
    }
}));
const FiltersStepTwo = (props) => {
    const classes = useStyles();
    const [selectedNetworkValue, setSelectedNetworkValue] = React.useState([]);
    const [selectedProgramTypeValue, setSelectedProgramTypeValue] = React.useState();
    const [selectedProgramValue, setSelectedProgramValue] = React.useState([]);
    const [selectedEpisodeValue, setSelectedEpisodeValue] = React.useState([]);
    const [selectedUnitType, setSelectedUnitType] = React.useState();
    const [selectedUnitCostType, setselectedUnitCostType] = React.useState();
    const [unitSize, setUnitSize] = React.useState();

    const networks = [
        { label: 'Network1', value: 'Network1' },
        { label: 'Network2',  value: 'Network2' },
        { label: 'Network3', value: 'Network3' },
        { label: 'Network4', value: 'Network4' },
        { label: 'Network5', value: 'Network5' },
    ];
    const episodes = [
        { label: 'Episode1', value: 'Episode1' },
        { label: 'Episode2', value: 'Episode2' },
        { label: 'Episode3', value: 'Episode3' },
        { label: 'Episode4', value: 'Episode4' },
        { label: 'Episode5', value: 'Episode5' },
    ];
    const programs = [
        { label: 'Program1', value: 'Program1' },
        { label: 'Program2', value: 'Program2' },
        { label: 'Program3', value: 'Program3' },
        { label: 'Program4', value: 'Program4' },
        { label: 'Program5', value: 'Program5' },
    ]
    const handleDelete = (name, value) => {
        if(name === 'network'){
            let temp = selectedNetworkValue.slice();
            let index = temp.findIndex(t=>t.value === value);
            temp.splice(index,1);
            setSelectedNetworkValue(temp);
        }
        if(name === 'program'){
            let temp = selectedProgramValue.slice();
            let index = temp.findIndex(t=>t.value === value);
            temp.splice(index,1);
            setSelectedProgramValue(temp);
        }
        if(name === 'episode'){
            let temp = selectedEpisodeValue.slice();
            let index = temp.findIndex(t=>t.value === value);
            temp.splice(index,1);
            setSelectedEpisodeValue(temp);
        }
    }
    const handleChange = (name, value) => {
        if(name === 'network'){
            let temp = selectedNetworkValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index == -1){
                temp.push(value);
                setSelectedNetworkValue(temp);
            }
        }

        if(name === 'programType') {
            let temp = selectedProgramTypeValue ? selectedProgramTypeValue : [];
            temp.push(value);
            setSelectedProgramTypeValue(temp)
        }

        if(name === 'program') {
            let temp = selectedProgramValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index == -1){
                temp.push(value);
                // console.log(temp);
                setSelectedProgramValue(temp);
            }
        }

        if(name === 'episode') {
            let temp = selectedEpisodeValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index == -1){
                temp.push(value);
                // console.log(temp);
                setSelectedEpisodeValue(temp);
            }
        }
    }

    const handleUnitTypeChange = (name, value) => {
        setSelectedUnitType(value);
    }

    const handleUnitCostTypeChange = (name, value) => {
        setselectedUnitCostType(value);
    }

    const handleUnitSize = (val) => {
        setUnitSize(val);
    }

    return (
        <div className={classes.mainClass}>
            <div className={classes.elementContainer}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                        <MultiSelectDropdown name={'network'} id="networks"  size="small" variant="outlined" showLabel={true} lbldropdown="Networks" selectValue={''} handleChange={handleChange} ddData={networks}/>
                            {/* <MultipleSelect label="Network" name="network" handleChange={handleChange} ddData={["Network 1", "Network 2", "Network 3", "Network 4"]}/> */}
                        </Grid>
                        {selectedNetworkValue.length >0 && <Grid item md={6}>
                            <FormLabel className={classes.chipLabel}>{"Selected Networks"}</FormLabel>
                            <ChipsList name="network" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedNetworkValue}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>

            {/* <div className='eleContainer'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                    <Grid item md={6}>
                        <MultipleSelect label="Program Type"  name="programType" handleChange={handleChange} ddData={["Program Type 1", "Program Type 2", "Program Type 3", "Program Type 4"]}/>
                    </Grid>
                        {selectedProgramTypeValue && <Grid item md={6}><ChipsList showDelete={true} className="chips" label="" data={selectedProgramTypeValue}/></Grid>}
                    </Grid>
                </Box>
            </div> */}

            <div className={classes.elementContainer}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={6} spacing={6}>
                        <MultiSelectDropdown name={'program'} id="programs" size="small" variant="outlined" showLabel={true} lbldropdown="Programs" selectValue={''} handleChange={handleChange} ddData={programs}/>
                            {/* <MultipleSelect label="Program"  name="program" handleChange={handleChange} ddData={["Program 1", "Program 2", "Program 3", "Program 4"]}/> */}
                        </Grid>
                        {selectedProgramValue.length >0 && <Grid item md={6}>
                            <FormLabel className={classes.chipLabel}>{"Selected Programs"}</FormLabel>
                            <ChipsList name="program" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedProgramValue}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>

            <div className={classes.elementContainer}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <MultiSelectDropdown name={'episode'} id="episodes" size="small" variant="outlined" showLabel={true} lbldropdown="Episodes" selectValue={''} handleChange={handleChange} ddData={episodes}/>
                        </Grid>
                        {selectedEpisodeValue.length > 0 && <Grid item md={6}>
                            <FormLabel className={classes.chipLabel}>{"Selected Episodes"}</FormLabel>
                            <ChipsList name="episode" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedEpisodeValue}/>
                            </Grid>}
                     </Grid>
                </Box>
            </div>

            {/* <div className='eleContainer' style={{marginLeft: "10px"}}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <FormControl className="dropdown">
                                <FormLabel style={{fontWeight: 'bolder'}}>{"Unit"}</FormLabel>
                            </FormControl>
                            <Dropdown name="UnitType" SMwidth="400" fullWidth lbldropdown="Unit Type" selectValue={selectedUnitType} ddData={[
                                {
                                    "label":"Billboard 1",
                                    "value":"billboard1"
                                },
                                {
                                    "label":"Billboard2",
                                    "value":"billboard 2"
                                }
                            ]} handleChange={handleUnitTypeChange}/>

                        </Grid>
                        <Grid item md={4}>
                        <FormControl className="dropdown">
                                <FormLabel></FormLabel>
                            </FormControl>
                            <Dropdown name="UnitCostType" SMwidth="400" fullWidth lbldropdown="Unit Cost Type" selectValue={selectedUnitCostType} ddData={[
                                    {
                                        "label":"Billboard 1",
                                        "value":"billboard1"
                                    },
                                    {
                                        "label":"Billboard2",
                                        "value":"billboard 2"
                                    }
                                ]} handleChange={handleUnitCostTypeChange}/>
                        </Grid>
                        <Grid item md={4}>
                        <FormControl className="dropdown">
                                <FormLabel></FormLabel>
                            </FormControl>
                            <TextboxField  lblName="Unit Size" handleChange={handleUnitSize}/>
                        </Grid>
                    </Grid>
                </Box>
            </div> */}
        </div>
    );

}
export default FiltersStepTwo;

