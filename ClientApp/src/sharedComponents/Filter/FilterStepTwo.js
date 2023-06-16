import * as React from 'react';
import ChipsList from '../../sharedComponents/chips/ChipsList';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MultiSelectDropdown from "../../sharedComponents/Dropdown/MulltiSelectDropdown";
import { GetPartnerByType, GetAssetsByInventory, GetEpisodes } from './../../services/common.service';
import * as AppConstants from '../../common/AppConstants';

const useStyles = makeStyles((theme) => ({
    mainClass: {
        '& .MuiPaper-rounded': {
            boxShadow: "none"
        }
    },
    elementContainer:{
        margin: theme.spacing(1),
    },
    chipLabel:{
        display:'flex',
        marginBottom: '5px',
        fontWeight : 500,
        fontSize : 'bold'
    },
    contentHeight: {
        height: 'calc(100vh - 315px)',
        overflowY: "auto",
    }
}));
const FiltersStepTwo = (props) => {
    const classes = useStyles();
    const [selectedNetworkValue, setSelectedNetworkValue] = React.useState([]);
    const [selectedProgramTypeValue, setSelectedProgramTypeValue] = React.useState();
    const [selectedAssetValue, setSelectedAssetValue] = React.useState([]);
    const [selectedEpisodeValue, setSelectedEpisodeValue] = React.useState([]);
    const [networksList, setNetworksList] = React.useState([]);
    const [assetsList, setAssetsList] = React.useState([]);
    const [episodesList, setEpisodesList] = React.useState([]);
    const [filterCriteria, setFilterCriteria] = React.useState(props.filterCriteria);

    const getNetworks = () => {
        GetPartnerByType(AppConstants.PartnerType.Broadcaster).then(data => {
            if (data) {
                let list = data.map((item) => {
                    return { label: item.partnerName, value: item.id }
                });
                setNetworksList(list);
            }
            else console.log("Seasons API is failing");
        });
    }

    const getAssets = (network) => {
        var markettype = filterCriteria.MarketType ? filterCriteria.MarketType?.value : -1;
        var venturize = filterCriteria.Venturize && filterCriteria.Venturize.length === 1 ? filterCriteria.Venturize[0]?.value : -1;
        var mediatype = filterCriteria.MediaType ? filterCriteria.MediaType: [];
        var medias = mediatype?.map(a => a.value).join();
        var networkids = network ? network?.map(a => a.value).join() : '';
        GetAssetsByInventory(filterCriteria.LeagueId, markettype, venturize, medias, networkids).then(data => {
            if (data) {

                let list = data.map((item) => {
                    return { label: item.assetMediaDisplayName, value: item.id }
                });

                let distList = Array.from(new Set(list.map(a => a.value)))
                    .map(id => {
                        return list.find(a => a.value === id)
                    });

                setAssetsList(distList);
            }
            else console.log("GetAssets API is failing");
        });
    }

    const getEpisodes = (assets) => {
        var assetIds = assets.map(a => a.value).join();
        GetEpisodes(assetIds).then(data => {
            if (data) {
                let list = data.map((item) => {
                    return { label: item.episodeName, value: item.id }
                });
                setEpisodesList(list);
            }
            else console.log("Seasons API is failing");
        });
    }

    React.useEffect(() => {
        getNetworks();
        //getAssets();
    }, []);

    React.useEffect(()=>{
        if (props.filterCriteria.AssetType && props.filterCriteria.AssetType.length > 0)
            setSelectedAssetValue(props.filterCriteria.AssetType);

        if (props.filterCriteria.Network && props.filterCriteria.Network.length > 0){
            setSelectedNetworkValue(props.filterCriteria.Network);
            getAssets([...new Set(props.filterCriteria.Network.map(x=>x.id))].join())
        }
        else
            getAssets();

        if (props.filterCriteria.Episode && props.filterCriteria.Episode.length > 0)
            setSelectedEpisodeValue(props.filterCriteria.Episode);
    },[props.filterCriteria]);

    const handleDelete = (name, value) => {
        if(name === 'network'){
            let temp = selectedNetworkValue.slice();
            let index = temp.findIndex(t=>t.label === value);
            temp.splice(index,1);
            setSelectedNetworkValue(temp);
            filterCriteria.Network = temp;
            props.setFilterCriteria(filterCriteria);
        }
        if(name === 'AssetType'){
            let temp = selectedAssetValue.slice();
            let index = temp.findIndex(t=>t.label === value);
            temp.splice(index,1);
            setSelectedAssetValue(temp);
            filterCriteria.AssetType = temp;
            props.setFilterCriteria(filterCriteria);
        }
        if(name === 'episode'){
            let temp = selectedEpisodeValue.slice();
            let index = temp.findIndex(t=>t.label === value);
            temp.splice(index,1);
            setSelectedEpisodeValue(temp);
            filterCriteria.Episode = temp;
            props.setFilterCriteria(filterCriteria);
        }
    }

    const handleChange = (name, value) => {
        if(name === 'network'){
            let temp = selectedNetworkValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index <= -1){
                temp.push(value);
                setSelectedNetworkValue(temp);
            }
            if(temp.length> 0){
                // var stringtemp = temp.map(a => JSON.stringify(a)).join();
                filterCriteria.Network = temp;
                props.setFilterCriteria(filterCriteria);
            }
            getAssets(temp);
        }

        if(name === 'programType') {
            let temp = selectedProgramTypeValue ? selectedProgramTypeValue : [];
            temp.push(value);
            setSelectedProgramTypeValue(temp)
        }

        if(name === 'AssetType') {
            let temp = selectedAssetValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index <= -1){
                temp.push(value);
                // console.log(temp);
                setSelectedAssetValue(temp);
            }
            if(temp.length> 0){
                // var stringtemp = temp.map(a => JSON.stringify(a)).join();
                filterCriteria.AssetType = temp;
                props.setFilterCriteria(filterCriteria);
            }
            console.log(temp);
            getEpisodes(temp);
        }

        if(name === 'episode') {
            let temp = selectedEpisodeValue.slice();
            let index = temp.findIndex(t=>t.value === value.value);
            if(index <= -1){
                temp.push(value);
                // console.log(temp);
                setSelectedEpisodeValue(temp);
            }
            if(temp.length> 0){
                // var stringtemp = temp.map(a => JSON.stringify(a)).join();
                filterCriteria.Episode = temp;
                props.setFilterCriteria(filterCriteria);
            }
        }
        // console.log(filterCriteria);
    }

    return (
        <div className={`${classes.mainClass} ${classes.contentHeight}`}>
            <div className={classes.elementContainer}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={3}>
                            <MultiSelectDropdown size="small" name={'network'} id="networks" variant="outlined" showLabel={true} lbldropdown="Broadcaster"
                            selectValue={''} handleChange={handleChange} ddData={networksList}/>
                        </Grid>
                        {selectedNetworkValue.length >0 && <Grid item md={9}>
                            <ChipsList name="network" size="small" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedNetworkValue}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>

            <div className={classes.elementContainer}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={3}>
                            <MultiSelectDropdown  size="small" name={'AssetType'} id="AssetType" variant="outlined" showLabel={true}
                                lbldropdown="Asset Type" selectValue={''} handleChange={handleChange} ddData={assetsList}/>
                        </Grid>
                        {selectedAssetValue.length >0 && <Grid item md={9}>
                            <ChipsList name="AssetType" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedAssetValue}/>
                        </Grid>}
                    </Grid>
                </Box>
            </div>

            <div className={classes.elementContainer}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item md={3}>
                            <MultiSelectDropdown  size="small" name={'episode'} id="episodes" variant="outlined" showLabel={true} lbldropdown="Episodes" selectValue={''} handleChange={handleChange} ddData={episodesList}/>
                        </Grid>
                        {selectedEpisodeValue.length > 0 && <Grid item md={9}>
                            <ChipsList name="episode" handleDelete={handleDelete} showDelete={true} className="chips" label="" data={selectedEpisodeValue}/>
                            </Grid>}
                     </Grid>
                </Box>
            </div>
        </div>
    );

}
export default FiltersStepTwo;

