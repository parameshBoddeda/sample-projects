import  React, {useContext} from 'react';
import ChipsList from '../../sharedComponents/chips/ChipsList';
import Dropdown from '../../sharedComponents/Dropdown/Dropdown'
import MultiSelectDropdown from "../../sharedComponents/Dropdown/MulltiSelectDropdown";
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppDataContext from '../../common/AppContext';
import { GetSeason, GetMedium, GetCountries } from './../../services/common.service';
import { GetCountriesByRegionIds } from '../../services/common.service';

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
            margin: theme.spacing(1),
            '& .dropdown': {
                width: '90%',
                '& label:first-child': {
                }
            },
            '& .MuiPaper-rounded': {
                boxShadow: 'none'
            },
            '& .dateRange': {
                '& label:first-child': {
                }
            }
        }
    },
    contentHeight: {
        height: 'calc(100vh - 315px)',
        overflowY: "auto",
    },
}));

const FiltersStepOne = (props) => {
    const classes = useStyles();
    const { Regions, Venturized, MarketType } = React.useContext(AppDataContext);
    const [selectedMarketTypeValue, setSelectedMarketTypeValue] = React.useState(props.filterCriteria?.MarketType || '');
    const [selectedRegionValue, setSelectedRegionValue] = React.useState(props.filterCriteria?.Region || '');
    const [selectedVenturizedValue, setSelectedVenturizedValue] = React.useState(props.filterCriteria?.Venturize || []);
    const [selectedSeasonName, setSelectedSeasonName] = React.useState(props.filterCriteria?.Season || '');
    const [selectedMediaType, setSelectedMediaType] = React.useState(props.filterCriteria?.MediaType || []);
    const [selectedCountry, setSelectedCountry] = React.useState(props.filterCriteria?.Country || '');
    const [regionsList, setRegionsList] = React.useState([]);
    const [venturizedList, setVenturizedList] = React.useState([]);
    const [marketTypeList, setMarketTypeList] = React.useState([]);
    const [seasonList, setSeasonList] = React.useState([]);
    const [mediaTypeList, setMediaTypeList] = React.useState([]);
    const [filterCriteria, setFilterCriteria] = React.useState(props.filterCriteria);
    const [country, setCountry] = React.useState(null);
    const [countryName, setCountryName] = React.useState(null);
    const [countryData, setCountryData] = React.useState([]);
    const [flag, setFlag] = React.useState(false);
    const [selectedRegions, setSelectedRegions] = React.useState(props.filterCriteria?.Region || []);
    const [selectedCountries, setSelectedCountries] = React.useState(props.filterCriteria?.Country ||[]);
    const { leagueId } = useContext(AppDataContext);
    React.useEffect(()=>{
        if(Regions && Regions.length > 0){
            let list = Regions.map((item) =>{
                return { label: item.regionName, value : item.id }
            });
            setRegionsList(list);

        }
    },[Regions]);

    React.useEffect(()=>{

        if(selectedRegionValue.length && !flag){
            let regionIds = selectedRegionValue.map(obj => obj.value).join()
            getCountryDataByRegionIds(regionIds)
        }
    },[selectedRegionValue]);

    React.useEffect(()=>{
        if(filterCriteria.MediaType){
            var selectedMedia = filterCriteria.MediaType;
            setSelectedMediaType(selectedMedia);
        }
    },[filterCriteria]);

    React.useEffect(()=>{
        if(Venturized && (Venturized.length > 0)){
            let list = Venturized.map((item) =>{
                return { label: item.lookupText, value : item.lookupId }
            });
            if(filterCriteria.Venturize){
                setSelectedVenturizedValue(filterCriteria.Venturize);
            }else{

            }

            setVenturizedList(list);
        }
    },[Venturized]);

    React.useEffect(()=>{
        if(MarketType && MarketType.length > 0){
            let list = MarketType.map((item) =>{
                return { label: item.lookupText, value : item.lookupId }
            });
            setMarketTypeList(list);
        }
    },[MarketType]);

    const getSeasonData = () => {
        GetSeason(leagueId).then(data => {
            if (data) {
                let list = data.map((item) => {
                    return { label: item.seasonName, value: item.seasonId }
                });
                setSeasonList(list);
            }
            else console.log("Seasons API is failing");
        });
    }

    const getMediumTypes = () => {
        GetMedium(-1).then(data => {
            if (data) {
                let list = data.map((item) => {
                    return { label: item.mediumLookupDisplayText, value: item.mediumLookupId }
                });
                setMediaTypeList(list);
            }
            else console.log("GetMedium API is failing");
        }).catch((error)=>{
            console.log('Error in GetMedium ', error);
        });
    }
    const getCountryData = (id) => {
        GetCountries(id).then((data) => {
            let countries = [];
            data.map(item => {
                countries.push({ label: item.countryName, value: item.id });
            });
            setCountryData(countries);
            if(!flag){
                setSelectedCountry(props.filterCriteria?.Country || '');
                setFlag(true);
            }
        }).catch(err => console.log(err))
    }

    const handleCountryChange = (name, value) => {
        setCountry(value.value);
        setCountryName(value.label);
    };
    React.useEffect(()=>{
        getSeasonData();
        getMediumTypes();
    },[]);

    const getCountryDataByRegionIds = (ids) => {
        GetCountriesByRegionIds(ids).then((data) => {
            let countries = [], updatedSelectedCountries = [];
            data.map((item) => {
                countries.push({ label: item.countryName, value: item.id });
                if(selectedCountries.length) {
                    selectedCountries.forEach(elem => {
                        if(elem.value === item.id) {
                            updatedSelectedCountries.push({ label: item.countryName, value: item.id });
                        }
                    })
                }
            });
            setCountryData(countries);
            if(selectedCountry.length || selectedCountries.length) {
                setSelectedCountries(updatedSelectedCountries)
            }
        }).catch(err => console.log(err))
    }

    const handleChange = (name, value) => {
        if(name === 'marketType'){
            setSelectedMarketTypeValue(value.value);
            console.log(filterCriteria);
        }

        if(name === 'seasonname'){
            setSelectedSeasonName(value);
            filterCriteria.Season = (value);
            props.setFilterCriteria(filterCriteria);
        }

        if(name === 'mediatype') {
            let temp = selectedMediaType.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index <= -1){
                temp.push(value);
                setSelectedMediaType(temp);
            }
            if(temp.length> 0){
                filterCriteria.MediaType = temp;
                props.setFilterCriteria(filterCriteria);
            }
            console.log(filterCriteria);
        }

        if(name === 'region') {
            console.log(selectedRegions)
            var regions = selectedRegions.slice();
            let index = regions.findIndex(x => x.value === value.value);
            if (index === -1) {
                regions.push(value);
                setSelectedRegions(regions);
                let regionIds = regions.map(obj => obj.value).join()
                getCountryDataByRegionIds(regionIds)
                filterCriteria.Region = regions;
            }

            if(value.label === 'United States'){

                let selectedMarketType = marketTypeList.filter(v=>v.label === 'Domestic');
                filterCriteria.MarketType = (selectedMarketType[0]);
            }else{
                let selectedMarketType = marketTypeList.filter(v=>v.label === 'International');
                filterCriteria.MarketType = (selectedMarketType[0]);
            }

            props.setFilterCriteria(filterCriteria);
        }

        if(name === 'country'){
            let countries = selectedCountries.slice();
            let index = countries.findIndex(x => x.value === value.value);
            if (index === -1) {
                countries.push(value);
                filterCriteria.Country = countries;
                setSelectedCountries(countries);
                props.setFilterCriteria(filterCriteria);
            }
        }

        if (name === 'Venturized') {            
            let temp = selectedVenturizedValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index <= -1){
                temp.push(value);
                setSelectedVenturizedValue(temp);
            }
            if(temp.length> 0){
                filterCriteria.Venturize = temp;
                props.setFilterCriteria(filterCriteria);
            }
        }
        console.log(filterCriteria);
    }

    const handleDelete = (name, value) => {
        if(name === 'mediatype'){
            let temp = selectedMediaType.slice();
            let index = temp.findIndex(t=>t.label === value);
            temp.splice(index,1);
            setSelectedMediaType(temp);
            filterCriteria.MediaType = temp;
            props.setFilterCriteria(filterCriteria);
        }
        if(name === 'Venturized'){
            let temp = selectedVenturizedValue.slice();
            let index = temp.findIndex(t=>t.label === value);
            temp.splice(index,1);
            setSelectedVenturizedValue(temp);
            filterCriteria.Venturize = temp;
            props.setFilterCriteria(filterCriteria);
        }
        if (name === 'region') {
            var regions = selectedRegions.slice();
            let index = regions.findIndex(x => x.label === value)
            regions.splice(index, 1);
            setSelectedRegions(regions);
            let regionIds = regions.map(obj => obj.value).join()
            getCountryDataByRegionIds(regionIds);
            filterCriteria.Region = regions;
            props.setFilterCriteria(filterCriteria);
        }
        if (name === 'country') {
            var countries = selectedCountries.slice();
            let index = countries.findIndex(x => x.label === value)
            countries.splice(index, 1);
            setSelectedCountries(countries);
            filterCriteria.Country = countries;
            props.setFilterCriteria(filterCriteria);
        }
    }

    return (
        <div className={`${classes.filterPopup} ${classes.contentHeight}`}>
            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <MultiSelectDropdown name="Venturized" SMwidth="600" fullWidth lbldropdown="Media Category*"
                                ddData={venturizedList && venturizedList.length ? venturizedList : []}
                                handleChange={handleChange}  size="small"
                            />
                        </Grid>
                        {selectedVenturizedValue.length > 0 && <Grid item md={8}>
                            <ChipsList name="Venturized" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedVenturizedValue}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>
            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <MultiSelectDropdown name="region" SMwidth="600" fullWidth lbldropdown="Region*"
                                ddData={regionsList && regionsList.length ? regionsList : []}
                                handleChange={handleChange} size="small"
                            />
                        </Grid>
                         {selectedRegions.length > 0 && <Grid item md={8}>
                            <ChipsList name="region" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedRegions}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>
            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                           
                                <MultiSelectDropdown size="small" id="country" variant="outlined"
                                showLabel={true}
                                name='country'
                                lbldropdown="Country"
                                handleChange={handleChange}
                                ddData={countryData ? countryData : []}
                            />
                        </Grid>
                        {selectedCountries.length > 0 && <Grid item md={8}>
                            <ChipsList name="country" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedCountries}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>
            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                                <MultiSelectDropdown name="mediatype" SMwidth="400" fullWidth lbldropdown="Media Type"
                                    ddData={mediaTypeList.length ? mediaTypeList : []}
                                    handleChange={handleChange}  size="small"
                                />
                        </Grid>
                        {selectedMediaType.length >0 && <Grid item md={8}>
                            <ChipsList name="mediatype" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedMediaType}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>
            <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                                <Dropdown name="seasonname" SMwidth="400" fullWidth lbldropdown="Season Name"
                                    value={selectedSeasonName}  size="small"
                                    ddData={seasonList.length ? seasonList : []}
                                    handleChange={handleChange}/>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            {/* <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <FormControl className="dropdown">
                                <FormLabel>{"Season"}</FormLabel>
                                <Dropdown name="seasonname" SMwidth="400" fullWidth lbldropdown="Season Name" value={selectedSeasonName}
                                    ddData={seasonList.length ? seasonList : []} handleChange={handleChange}/>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            {/* <div className='eleContainer dropdown'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <FormControl className="dropdown">
                                <FormLabel>{"Market Type"}</FormLabel>
                                <Dropdown name="marketType" SMwidth="400" fullWidth lbldropdown="Market Type" selectValue={selectedMarketTypeValue} ddData={[
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
                                    <FormLabel>{"Country"}</FormLabel>
                                    <Dropdown SMwidth="400" name="country" fullWidth lbldropdown="Country" selectValue={selectedCountryValue}
                                        ddData={countriesList.length > 0? countriesList : [{ label: 'All', value: '' }]} handleChange={handleChange}/>
                                </FormControl>
                            </Grid>
                        </React.Fragment> : null
                        }
                    </Grid>
                    </Box>
            </div> */}
        </div>
    );

}
export default FiltersStepOne;

