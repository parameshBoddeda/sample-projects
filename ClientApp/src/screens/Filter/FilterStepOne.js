import * as React from 'react';
import ChipsList from '../../sharedComponents/chips/ChipsList';
import PickDateRange from '../../sharedComponents/PickDateRange/PickDateRange';
import Dropdown from '../../sharedComponents/Dropdown/Dropdown'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const dummyData = require('../../static/dummyData.json');

const leagues = dummyData.leagues.data;
const mediaTypes = dummyData.mediaType.data;

const useStyles = makeStyles((theme) => ({
    filterPopup: {
        '& .label': {
            fontWeight: 'bolder'
        },

        '& label.MuiFormLabel-colorPrimary': {
            fontWeight: 'bolder'            
        },

        '& label.MuiInputLabel-formControl': {
            fontWeight: 'normal'
        },
         
        '& .eleContainer': {
            padding: theme.spacing(1.5),
            '& .dropdown': {
                width: '90%',
                '& label:first-child': {
                    marginBottom: theme.spacing(1.5)
                }
            },
            '& .MuiPaper-rounded': {
                boxShadow: 'none'
            },
            '& .dateRange': {
                '& label:first-child': {
                    marginBottom: theme.spacing(1.5)
                }
            } 
        }



    }
}));
const FiltersStepOne = (props) => {
    const classes = useStyles();
    const [selectedMarketTypeValue, setSelectedMarketTypeValue] = React.useState();
    const [selectedRegionValue, setSelectedRegionValue] = React.useState();
    const [selectedCountryValue, setSelectedCountryValue] = React.useState();
    const [selectedSeasonName, setSelectedSeasonName] = React.useState();

    const handleChange = (name, value) => {
        if(name === 'marketType'){
            setSelectedMarketTypeValue(value.value);
        }
        if(name === 'seasonname'){
            setSelectedSeasonName(value.value);
        }
           
        if(name === 'region') {
            setSelectedRegionValue(value.value)
        }

        if(name === 'country') {
            setSelectedCountryValue(value.value)
        }

    }

    return (
        <div className={classes.filterPopup}>
            {/* <div className='eleContainer'>
                <ChipsList className="chips" label="Leagues" data={leagues}/>
            </div> */}

            <div className='eleContainer'>
                <ChipsList className="chips" label="Media Type" data={mediaTypes}/>
            </div>

            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <FormControl className="dropdown">
                                <FormLabel>{"Season"}</FormLabel>
                                <Dropdown name="seasonname" SMwidth="400" size="small" fullWidth lbldropdown="Season Name" selectValue={selectedSeasonName} ddData={[
                                    {
                                        "label":"Season1",
                                        "value":"Season1"
                                    },
                                    {
                                        "label":"Season2",
                                        "value":"Season2"
                                    }
                                ]} handleChange={handleChange}/>
                            </FormControl>
                        </Grid>
                        
                    </Grid>
                    </Box>
            </div>
            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <FormControl className="dropdown">
                                <FormLabel>{"Market Type"}</FormLabel>
                                <Dropdown name="marketType" SMwidth="400" size="small" fullWidth lbldropdown="Market Type" selectValue={selectedMarketTypeValue} ddData={[
                                    {
                                        "label":"International",
                                        "value":"international"
                                    },
                                    {
                                        "label":"Domestic",
                                        "value":"domestic"
                                    }
                                ]} handleChange={handleChange}/>
                            </FormControl>
                        </Grid>
                        { selectedMarketTypeValue && selectedMarketTypeValue === 'international' ? <React.Fragment>

                            <Grid item md={4}>
                                <FormControl className="dropdown">
                                    <FormLabel>{"Region"}</FormLabel>            
                                    <Dropdown name="region" SMwidth="600" fullWidth lbldropdown="Region" selectValue={selectedRegionValue} ddData={[
                                        {
                                            "label":"International",
                                            "value":"international"
                                        },
                                        {
                                            "label":"Domestic",
                                            "value":"domestic"
                                        }
                                    ]} handleChange={handleChange}/>
                                </FormControl>
                            </Grid>
                            <Grid item md={4}>
                                <FormControl className="dropdown">
                                    <FormLabel>{"Country"}</FormLabel>            
                                    <Dropdown SMwidth="400" name="country" fullWidth lbldropdown="Country" selectValue={selectedCountryValue} ddData={[
                                        {
                                            "label":"International",
                                            "value":"international"
                                        },
                                        {
                                            "label":"Domestic",
                                            "value":"domestic"
                                        }
                                    ]} handleChange={handleChange}/>
                                </FormControl>
                            </Grid>
                        </React.Fragment> : null
                        }
                    </Grid>
                    </Box>
            </div>
            <div className='eleContainer dateRange'>
                <FormControl className="dateRange">
                    <FormLabel>{"Date Range"}</FormLabel>
                    <PickDateRange/>
                </FormControl> 
            </div>
        </div>
    );

}
export default FiltersStepOne;

