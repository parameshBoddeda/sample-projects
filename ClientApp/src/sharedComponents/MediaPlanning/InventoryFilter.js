//Global Imports Start
import React, { useEffect, useState } from "react";
import { Container, Box, Button, FormControlLabel, Checkbox } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import AppDataContext from '../../common/AppContext';
import { GetMedium, GetPartnerByInventory, GetUnitTypes, GetAssets, GetCountriesByRegionIds } from '../../services/common.service';
import Grid from '@mui/material/Grid';
import Dropdown from '../Dropdown/Dropdown';
import MultiSelectDropdown from '../Dropdown/MulltiSelectDropdown';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import DateRangePicker from '../PickDateRange/PickDateRange';
import InventoryListItem from './InventoryListItem';
import { GetInventoryListSearch } from '../../services/campaign.service';
import ChipsList from '..//chips/ChipsList';
import { MEDIA_PARENT_NAMES, PartnerType } from "../../common/AppConstants";
import { GetInventoryAssets } from '../../services/planning.service';
import Helper from "../../common/Helper";
//Global Imports End


const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 254px)',
        overflowY: 'auto',
    },
    date1: {
        '& .MuiInputLabel-root': {
            fontSize: '.75rem',
            transform: 'translate(14px, 6px) scale(1)',
        },
        '& .MuiInputBase-input': {
            padding: theme.spacing(.35, .75),
        },
    },
    selected: {
        background: "#e4ecff"
    },
}));


const InventoryFilter = (props) => {
    const classes = useStyles();
    const { leagueId, Regions, Leagues } = React.useContext(AppDataContext);
    const [mediaTypeList, setMediaTypeList] = useState([]);
    const [regionsList, setRegionsList] = useState([]);
    const [leaguesList, setLeaguesList] = useState([]);
    const [networksList, setNetworksList] = useState([]);
    const [assetList, setAssetsList] = useState([]);
    const [unitTypeList, setUnitTypeList] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState(-1);
    const [selectedMediaTypeName, setSelectedMediaTypeName] = useState(-1);
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedMarketType, setSelectedMarketType] = useState(-1);
    const [selectedVenturize, setSelectedVenturize] = useState(-1);
    const [selectedNetwork, setSelectedNetwork] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState([]);
    const [selectedUnitType, setSelectedUnitType] = useState([]);
    const [inventories, setInventoryList] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState([]);
    const [searchStart, setSearchStart] = useState(false);
    const [dataFound, setDataFound] = useState(true);
    const [flag, setFlag] = useState(1);
    const [isROS, setIsROS] = useState(false);
    const [isTvRadioSelected, setIsTvRadioSelected] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [isDigitalSelected, setIsDigitalSelected] = useState(false);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [chkSelectAll, setChkSelectAll] = useState(false);
    const [showChkSelectAll, setShowChkSelectAll] = useState(false);

    useEffect(() => {
        // getNetworks();
        getMediumTypes();
        // getAssets();
    }, []);
    useEffect(() => {
        getAssets();
        setDefault();
    }, [leagueId]);

    const setDefault=()=>{
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setSelectedMediaType(-1);
        setSelectedMediaTypeName(-1);
        setSelectedRegion([]);
        setSelectedMarketType(-1);
        setSelectedVenturize(-1);
        setSelectedNetwork([]);
        setSelectedAsset([]);
        setSelectedUnitType([]);
        setInventoryList([]);
        setSelectedInventory([]);
        setSearchStart(false);
        setDataFound(true);
        setIsROS(false);
        setIsTvRadioSelected(false);
        setIsDigitalSelected(false)
    }

    useEffect(()=>{
        if(props.RefreshFilterResult){
            if (isSearchClicked){
                setInventoryList([]);
                handleInventorySearch();
            }
            props.ResetFilterResultFlag();
        }
    }, [props.RefreshFilterResult]);

    useEffect(()=>{
        //props.setStartDate(null);
        //props.setEndDate(null);
        setSelectedStartDate(props.seasonStartDate);
        setSelectedEndDate(props.seasonEndDate);
        setInventoryList([]);
        setSelectedInventory([]);
        props.setMediaPlanData([]);
    },[props.seasonStartDate, props.seasonEndDate])

    useEffect(() => {
        //console.log(props.isDomesticOrInternational);
        if (Regions && Regions.length > 0) {
            var newList= [];
            let list = Regions.map((item) => {
                //console.log(item.id);
                if((props.isDomesticOrInternational === 1) && (item.id === 11)){
                    newList.push({ label: item.regionName, value: item.id });
                }
                if((props.isDomesticOrInternational === 2) && (item.id !== 11)){
                    newList.push({ label: item.regionName, value: item.id });
                }
                if((props.isDomesticOrInternational === 3) || (props.isDomesticOrInternational === 0) || !props.isDomesticOrInternational){
                    newList.push({ label: item.regionName, value: item.id });
                }
            });
              setRegionsList(newList);
        }
    }, [Regions, props.isDomesticOrInternational]);

    useEffect(() => {

        if (Leagues && Leagues.length > 0) {
            let list = Leagues.map((item) => {
                return { label: item.leagueName, value: item.id }
            });
            setLeaguesList(list);
        }
    }, [Leagues]);

    useEffect(() => {
        getAssets();
        getNetworks();
    }, [selectedLeague, selectedRegion, selectedCountries, selectedMediaType, selectedNetwork]);

    useEffect(() => {
        props.setStartDate(selectedStartDate);
        props.setEndDate(selectedEndDate);
    }, [selectedStartDate, selectedEndDate]);

    const handleChange = (name, value) => {

        if (name === 'mediatype') {
            setSelectedMediaType(value.value);
            setSelectedMediaTypeName(value.label);
            getUnitTypes(value.value);
            setSelectedUnitType([]);
            let text = value.MediumText;
            let isSelected = ((text === MEDIA_PARENT_NAMES.TV && value.label !== "TV - Virtual signage") || text === MEDIA_PARENT_NAMES.NBA_TV || text === MEDIA_PARENT_NAMES.RADIO);
            setIsTvRadioSelected(isSelected);
            if(text === MEDIA_PARENT_NAMES.DIGITAL && value.label === "Digital") {
                setSelectedCountries([])
                setIsDigitalSelected(true);
            } else {
                setIsDigitalSelected(false);
            }
            if (!isSelected)
                setSelectedNetwork([]);

            if ((text === MEDIA_PARENT_NAMES.TV && value.label === "TV - Game") || (text === MEDIA_PARENT_NAMES.DIGITAL && value.label === "Digital - OTT")) {
                props.SetIsDayPartVisible(true)
            } else {
                props.SetIsDayPartVisible(false)
            }
        }
        if (name === 'leagues') {
            var selectedLeagues = selectedLeague.slice();
            let index = selectedLeagues.findIndex(x => x.value === value.value);
            if (index === -1) {
                selectedLeagues.push(value);
                setSelectedLeague(selectedLeagues);
            }
        }
        if (name === 'region') {
            // setSelectedRegion(value.value);
            var selectedRegions = selectedRegion.slice();
            let index = selectedRegions.findIndex(x => x.value === value.value);
            if (index === -1) {
                selectedRegions.push(value);
                setSelectedRegion(selectedRegions);
                let regionIds = selectedRegions.map(obj => obj.value).join();
                getCountryDataByRegionIds(regionIds);
            }
        }
        if(name === "country") {
            let countries = selectedCountries.slice();
            let index = countries.findIndex(x => x.value === value.value);
            if (index === -1) {
                countries.push(value);
                setSelectedCountries(countries);
            }
        }
        if (name === 'network') {
            // setSelectedNetworkId(value.value);
            var selectedNetworks = selectedNetwork.slice();
            let index = selectedNetworks.findIndex(x => x.value === value.value);
            if (index === -1) {
                selectedNetworks.push(value);
                setSelectedNetwork(selectedNetworks);
            }
        }
        if (name === 'asset') {
            // setSelectedAsset(value.value);
            var selectedAssets = selectedAsset.slice();
            let index = selectedAssets.findIndex(x => x.value === value.value);
            if (index === -1) {
                selectedAssets.push(value);
                setSelectedAsset(selectedAssets);
            }
        }
        if (name === 'unittype') {
            // setSelectedUnitType(value);

            var selectedUnitTypes = selectedUnitType.slice();
            let index = selectedUnitTypes.findIndex(x => x.value === value.value);
            if (index === -1) {
                selectedUnitTypes.push(value);
                setSelectedUnitType(selectedUnitTypes);
            }
        }

        setInventoryList([]);
        setSelectedInventory([]);
        props.setMediaPlanData([]);
    }

    const handleDelete = (name, value) => {
        if (name === 'league') {
            var selectedLeagues = selectedLeague.slice();
            let index = selectedLeagues.findIndex(x => x.label === value)
            selectedLeagues.splice(index, 1);
            setSelectedLeague(selectedLeagues);
        }
        if (name === 'region') {
            var selectedRegions = selectedRegion.slice();
            let index = selectedRegions.findIndex(x => x.label === value)
            selectedRegions.splice(index, 1);
            setSelectedRegion(selectedRegions);
            let regionIds = selectedRegions.map(obj => obj.value).join()
            getCountryDataByRegionIds(regionIds);
        }
        if (name === 'country') {
            var countries = selectedCountries.slice();
            let index = countries.findIndex(x => x.label === value)
            countries.splice(index, 1);
            setSelectedCountries(countries);
        }
        if (name === 'network') {
            var selectedNetworks = selectedNetwork.slice();
            let index = selectedNetworks.findIndex(x => x.label === value)
            selectedNetworks.splice(index, 1);
            setSelectedNetwork(selectedNetworks);
        }
        if (name === 'asset') {
            var selectedAssets = selectedAsset.slice();
            let index = selectedAssets.findIndex(x => x.label === value)
            selectedAssets.splice(index, 1);
            setSelectedAsset(selectedAssets);
        }
        if (name === 'unittype') {
            var selectedUnitTypes = selectedUnitType.slice();
            let index = selectedUnitTypes.findIndex(x => x.label === value)
            selectedUnitTypes.splice(index, 1);
            setSelectedUnitType(selectedUnitTypes);
        }

        setInventoryList([]);
        setSelectedInventory([]);
        props.setMediaPlanData([]);
    }

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
            if(selectedCountries.length) {
                setSelectedCountries(updatedSelectedCountries)
            }
        }).catch(err => console.log(err))
    }

    const getMediumTypes = () => {
        GetMedium(-1).then(data => {
            if (data) {
                let list = data.map((item) => {
                    return { label: item.mediumLookupDisplayText, value: item.mediumLookupId, MediumText: item.mediumLookupParentText }
                });

                setMediaTypeList(list);
            }
            else console.log("GetMedium API is failing");
        }).catch((error) => {
            console.log('Error in GetMedium ', error);
        });
    }

    const getNetworks = () => {        
        let regionIds = selectedRegion.map(obj => obj.value).join();
        GetPartnerByInventory(leagueId, selectedMediaType, regionIds).then(data => {
            if (data && data.length > 0) {
                let list = data.map((item) => {
                    return { label: item.partnerName, value: item.id }
                });
                setNetworksList(list);
            }
            //else console.log("Networks API is failing");
        });
    }

    const getAssets = () => {
        let marketTypeId = -1;

        if (selectedRegion && selectedRegion.length > 0){
            let usRegion = regionsList.find(x => x.label === 'United States');
            if (selectedRegion.length === 1 && selectedRegion.map(obj => obj.value).indexOf(usRegion?.value) !== -1)
                marketTypeId = 111;
            else if (selectedRegion.length >= 1 && selectedRegion.map(obj => obj.value).indexOf(usRegion?.value) === -1)
                marketTypeId = 112;
        }

        let obj={
            MediaTypeId: selectedMediaType || 0,
            LeagueId: !props.IsCampaignPlanning ? leagueId.toString() : (selectedLeague ? selectedLeague.map(x => x.value).join() : '0'),
            RegionId: selectedRegion && selectedRegion.length > 0 ? selectedRegion.map(x => x.value).join() : "0",
            CountryId: selectedCountries && selectedCountries.length > 0 ? selectedCountries.map(x => x.value).join() : "0",
            PartnerId: selectedNetwork && selectedNetwork.length > 0 ? selectedNetwork.map(x => x.value).join() : "0",
        }

        GetInventoryAssets(obj).then(data => {
            if (data) {

                let list = data.map((item) => {
                    return { label: item.assetDisplayName, value: item.id }
                });

                let distList = Array.from(new Set(list.map(a => a.value)))
                    .map(id => {
                        return list.find(a => a.value === id)
                    });

                setAssetsList(distList);
            }
            //else console.log("GetAssets API is failing");
        });
    }
    const getUnitTypes = (mediaid) => {

        GetUnitTypes(mediaid).then(data => {
            if (data) {
                let list = data.map((item) => {
                    return { label: item.unitTypeName, value: item.id }
                });
                setUnitTypeList(list);
            }
            else {
                setUnitTypeList([]);
            }
        });
    }

    const handleSelectAll = (isChecked)=>{
        setSelectedInventory(isChecked ? inventories : []);
        setChkSelectAll(isChecked)
    }

    const handleInventorySearch = () => {
        var err = 0;
        if (!selectedStartDate) {
            props.notifyWarning('Please choose start date');
            err = 1;
        }
        if (!selectedEndDate) {
            props.notifyWarning('Please choose end date');
            err = 1;
        }

        if (!props.IsCampaignPlanning && (!props.seasonStartDate || props.seasonStartDate === '')){
            props.notifyWarning('Please select year from top');
            err = 1;
        }
        else if (!props.IsCampaignPlanning && ((selectedStartDate && new Date(Helper.FormatDate(selectedStartDate)) < new Date(props.seasonStartDate)) || 
            (selectedEndDate && new Date(Helper.FormatDate(selectedEndDate)) > new Date(props.seasonEndDate)))){
            props.notifyWarning('Start and End dates must be between ' + props.seasonStartDate + ' and '+ props.seasonEndDate);
            err = 1;
        }

        if (selectedMediaType === -1) {
            props.notifyWarning('Please choose media type');
            err = 1;
        }
        if (props.IsCampaignPlanning && selectedLeague.length === 0) {
            props.notifyWarning('Please choose leagues');
            err = 1;
        }
        if(isDigitalSelected && selectedCountries.length === 0) {
            props.notifyWarning('Please choose country');
            err = 1;
        }
        if (err === 1) {
            return;
        }
        
        props.setShowLoading(true);
        let text = mediaTypeList.find(x=> x.value === selectedMediaType).label;
        let isDigital = (text === "Digital" || text === "Digital - Social Media" || text === "Digital - CRM");

        if(isDigital)
            props.SetView(false);
        
        setShowChkSelectAll(isDigital && selectedUnitType && selectedUnitType.length === 1);
        setChkSelectAll(false);
        props.SetIsDigitalPlanning(isDigital);
        props.SetIsPureDigital(text === "Digital");
        setInventoryList([]);
        setSearchStart(true);
        props.setMediaPlanData([]);
        setSelectedInventory([]);

        let obj = {
            startdate: selectedStartDate ? selectedStartDate : '',
            enddate: selectedEndDate ? selectedEndDate : '',
            mediaTypeId: selectedMediaType || 0,
            leagueIds: !props.IsCampaignPlanning ? leagueId.toString() :(selectedLeague ? [...new Set(selectedLeague.map(x => x.value))].join() : 0),
            regionId: selectedRegion && selectedRegion.length > 0 ? [...new Set(selectedRegion.map(x => x.value))].join() : "0",
            countryId: selectedCountries && selectedCountries.length > 0 ? [...new Set(selectedCountries.map(x => x.value))].join() : "0",
            partnerId: selectedNetwork && selectedNetwork.length > 0 ? [...new Set(selectedNetwork.map(x => x.value))].join() : "0",
            assetId: selectedAsset && selectedAsset.length > 0 ? [...new Set(selectedAsset.map(x => x.value))].join() : "0",
            unitTypeId: selectedUnitType && selectedUnitType.length > 0 ? [...new Set(selectedUnitType.map(x => x.value))].join() : "0",
            UnitCostTypeId: props.IsCampaignPlanning ? 1 : 2,
            IsCampaignPlanning : props.IsCampaignPlanning,
            IsDigitalPlanning : isDigital
        }

        if(selectedAsset && selectedAsset.length === 1 && selectedAsset[0].label.includes("ROS"))
        {
            setIsROS(true);
            props.SetROSflag(true);
        }
        else
        {
            setIsROS(false);
            props.SetROSflag(false);
        }
        setIsSearchClicked(true);
        GetInventoryListSearch(obj).then(data => {
            setSearchStart(false);
            let invs = [...inventories];
            invs.splice(0, invs.length);
            invs = invs.concat(data);
            setInventoryList(invs);
            setDataFound(invs.length > 0);
            props.handleInventoryFiltered();   
            props.setShowLoading(false);
            if (isDigital && [...new Set(invs.map(x => x.unitTypeName))].length === 1)
                setShowChkSelectAll(true);

        }).catch(err => {
            console.log(err);
            setInventoryList([]);
            setSearchStart(false);
            setDataFound(false);
            props.setShowLoading(false);
        });
    }

    const handleSelectedMediaType=(mediaTypeName)=>{
        const notToShow=['Digital','Digital - Social Media', 'Social Media', 'Digital - CRM'];
        var status = false;
        var val = ''
        if(mediaTypeName){
            val = mediaTypeName;
        }else{
            val = selectedMediaTypeName;
        }
        if(notToShow.indexOf(val) > -1){
            status = true;
        }
        return status;

    }

    const OnInventorySelected = (e, inventory) => {
        let isMediaTypeSelected = handleSelectedMediaType();
        

        //console.log(inventory);
        if (props.IsCalendarView || isMediaTypeSelected) {
            var selectedinvs = [...selectedInventory];
            //console.log(inventory);
            //if (inventory == 'ROS' || inventory == 'Digital') {
            if(inventory === 'Digital'){
                props.setMediaPlanData(selectedinvs);
                props.setCalendarMediaPlanData(selectedinvs);
            }else{
                var index = selectedinvs.findIndex(x => x.inventoryId === inventory.inventoryId && x.unitTypeName === inventory.unitTypeName
                                                        && x.unitSizeName === inventory.unitSizeName
                                                        && x.assetId === inventory.assetId);
                var filteredInventories = selectedinvs.filter(x => x.totalUnits === inventory.totalUnits );
                var filteredInventoriesNew = selectedinvs.filter(x => x.unitTypeName === inventory.unitTypeName );

                if (e.target.checked && index === -1) {
                    if (props.IsCalendarView){
                        selectedinvs.push(inventory);
                        props.setMediaPlanData(selectedinvs);
                        props.setCalendarMediaPlanData(selectedinvs);
                        setSelectedInventory(selectedinvs);
                    }
                    if(!props.IsCalendarView){
                        if(props.IsDigitalPlanning){
                            setFlag(flag + 1);
                            if((filteredInventoriesNew.length > 0) || (selectedinvs.length === 0)){
                                selectedinvs.push(inventory);
                                setSelectedInventory(selectedinvs);
                                if (props.IsDigitalPlanning)
                                    setChkSelectAll(selectedinvs.length === inventories.length);
                                // props.setCalendarMediaPlanData(selectedinvs);
                            }else{
                                props.notifyWarning('Please select the inventories with same unit Type');
                            }
                        }else{
                            setFlag(flag + 1);
                            if((filteredInventories.length > 0) || (selectedinvs.length === 0)){
                                selectedinvs.push(inventory);
                                setSelectedInventory(selectedinvs);
                                props.setCalendarMediaPlanData(selectedinvs);
                                if (props.IsDigitalPlanning)
                                    setChkSelectAll(selectedinvs.length === inventories.length);
                            }else{
                                props.notifyWarning('Please select the inventories with same unit count');
                            }
                        }
                    }
                }
                else if(!e.target.checked && index !== -1){
                    selectedinvs.splice(index, 1);
                    setSelectedInventory(selectedinvs);
                    if(props.IsDigitalPlanning)
                        setChkSelectAll(selectedinvs.length === inventories.length);
                    if (props.IsCalendarView){
                        props.setMediaPlanData(selectedinvs);
                        props.setCalendarMediaPlanData(selectedinvs);
                    }
                }
            }
        }
        else {
            let isROSselected = inventory.assetName.indexOf('ROS') !== -1;
            setIsROS(isROSselected);
            props.SetROSflag(isROSselected);

            setFlag(flag + 1);
            props.setMediaPlanData([inventory]);
            props.setCalendarMediaPlanData([inventory]);
            setSelectedInventory([inventory]);
        }
    }
    return (<React.Fragment>
        <Container maxWidth={false} disableGutters>
            <Box my={1} mx={1}>
                <Typography variant="subtitle2" color="primary">Inventory Filter</Typography>
                </Box>
                <Box className={classes.contentHeight}>
                    <Box p={1}>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        <DateRangePicker startDateLabel={'Start Date*'}
                            endDateLabel={'End Date*'} disablePast={false}
                            startDate={selectedStartDate}
                            endDate={selectedEndDate} setStartDate={setSelectedStartDate}
                            setEndDate={setSelectedEndDate} />
                    </Grid>
                    <Grid item md={12}>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <FormControl fullWidth className="dropdown">
                                    <Dropdown name="mediatype" size="small" SMwidth="400" fullWidth lbldropdown="Media Type*"
                                        ddData={mediaTypeList.length ? mediaTypeList : []}
                                        handleChange={handleChange}
                                        id="mediatype-combo-box"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    {props.IsCampaignPlanning && <><Grid item md={4}>
                        <FormControl fullWidth className="dropdown">
                            <MultiSelectDropdown name="leagues" size="small" SMwidth="400" fullWidth lbldropdown="League*"
                                ddData={leaguesList.length ? leaguesList : []}
                                handleChange={handleChange}
                                id="leagues-combo-box"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={8}>
                        {selectedLeague.length > 0 &&
                            <ChipsList name="league" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedLeague} />
                        }
                    </Grid></>}

                    <Grid item md={4}>
                        <FormControl fullWidth className="dropdown">
                            <MultiSelectDropdown name="region" size="small" SMwidth="400" fullWidth lbldropdown="Region"
                                ddData={regionsList.length ? regionsList : []}
                                handleChange={handleChange}
                                id="region-combo-box"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={8}>
                        {selectedRegion.length > 0 &&
                            <ChipsList name="region" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedRegion} />
                        }
                    </Grid>
                            
                    {
                        (!props.IsCampaignPlanning || isDigitalSelected) && <>
                            <Grid item md={4}>
                                <FormControl fullWidth className="dropdown">
                                <MultiSelectDropdown name="country" size="small" SMwidth="400" fullWidth lbldropdown={"Country"+(isDigitalSelected?'*':'')}
                                    ddData={countryData.length ? countryData : []}
                                    handleChange={handleChange}
                                    id="country-combo-box"
                                />
                                </FormControl>
                            </Grid>
                            <Grid item md={8}>
                            {selectedCountries.length > 0 &&
                                <ChipsList name="country" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedCountries} />
                            }
                            </Grid></>
                    }
                    {isTvRadioSelected &&<> <Grid item md={4}>
                        <FormControl fullWidth className="dropdown">
                            <MultiSelectDropdown name="network" size="small" SMwidth="400" fullWidth lbldropdown="Network"
                                ddData={networksList.length ? networksList : []}
                                handleChange={handleChange}
                                id="network-combo-box"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={8}>
                        {selectedNetwork.length > 0 &&
                            <ChipsList name="network" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedNetwork} />
                        }
                    </Grid></>}
                    <Grid item md={4}>
                        <FormControl fullWidth className="dropdown">
                            <MultiSelectDropdown name="asset" size="small" SMwidth="400" fullWidth lbldropdown="Asset"
                                ddData={assetList.length ? assetList : []}
                                handleChange={handleChange}
                                id={"asset-combo-box"}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={8}>
                        {selectedAsset.length > 0 &&
                            <ChipsList name="asset" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedAsset} />
                        }
                    </Grid>
                    <Grid item md={4}>
                        <FormControl fullWidth className="dropdown">
                            <MultiSelectDropdown name="unittype" size="small" SMwidth="400" fullWidth lbldropdown="Unit Type"
                                ddData={unitTypeList.length ? unitTypeList : []}
                                handleChange={handleChange}
                                id={"unittype-combo-box"}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={8}>
                        {selectedUnitType.length > 0 &&
                            <ChipsList name="unittype" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedUnitType} />
                        }
                    </Grid>


                    <Grid item md={12}>
                        <Button onClick={handleInventorySearch} color="primary" variant="contained">{'Search'}</Button>
                    </Grid>
                </Grid>
                </Box>
                <Box my={1}>
                    <Box display="flex" flex="1" alignItems="center" justifyContent="space-between" >
                        <Typography ml={1} variant="subtitle2" color="primary">Inventory List</Typography>
                        {showChkSelectAll && <FormControlLabel size="small"
                            control={
                                <Checkbox
                                    className={classes.CheckboxPadding}
                                    size="small"
                                    name="chkSelectAll"
                                    checked={chkSelectAll}
                                    onChange={(e) => handleSelectAll(!chkSelectAll)}
                                />
                            }
                            label={<Typography noWrap variant="caption">Select All</Typography>}
                        />}
                    </Box>
                    <Box>
                        {inventories.length > 0 && inventories.map((inventory,index) => {
                            return (<InventoryListItem inventory={inventory} IsCalendarView={props.IsCalendarView} IsROS={isROS}
                                    IsDigitalPlanning={props.IsDigitalPlanning} key={(inventory.inventoryId + index).toString()}
                                    IsPureDigital={props.IsPureDigital} IsCampaignPlanning={props.IsCampaignPlanning} IsSelectAllChecked={chkSelectAll}
                                    setSelectedInventory={OnInventorySelected} selectedInventory={selectedInventory} />)
                        })}

                        {(searchStart) && <Typography mt={1} justifyContent="center" display={'flex'} variant="subtitle2">Searching...</Typography>}
                        {(!searchStart && !dataFound) && <Typography mt={1} justifyContent="center" display={'flex'} variant="subtitle2">No Records Found</Typography>}
                    </Box>
                </Box>
            </Box>
        </Container>
    </React.Fragment>
    )
}

InventoryFilter.displayName = "InventoryFilter";
export default InventoryFilter;