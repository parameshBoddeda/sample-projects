import * as React from 'react';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import {inventoryDealConstants} from '../../../common/AppConstants';
import AppDataContext from '../../../common/AppContext';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import * as AppConstants from '../../../common/AppConstants';
import InventoryDealUI from './InventoryDealUI';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import { Grid, Button, Typography } from '@mui/material';
import { SaveInventory } from '../../../services/inventory.service';
import { GetLookupById, GetNetworkByRegion, GetAssets, GetRegions, GetCountries, GetUnitSizes, GetUnitTypes, GetMedium, GetSeason } from '../../../services/common.service';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { TimerOutlined } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    fabButton: {
        position: 'absolute !important',
        right: theme.spacing(4),
        bottom: theme.spacing(.5),
        minHeight: '32px !important',
        height: '32px !important',
        width: '32px !important',
    },
    formContainer: {
        maxHeight: 'calc(50vh - 128px)',
        overflowY: "auto",
        marginTop: theme.spacing(1),
    },
    gridContainer: {
        maxHeight: 'calc(100vh - 278px)',
        overflowY: "auto",
    },
    gridContainerWithOutForm: {
        maxHeight: 'calc(100vh - 344px)',
        overflowY: "auto",
    },
}));

const InventoryDealTwo = (props) => {
    const classes = useStyles();
    const { leagueInfo, leagueId, Regions, Venturized, MarketType } = React.useContext(AppDataContext);
    const [showLoading, setShowLoading] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [inventory, setInventory] = React.useState({
        leagueId: leagueId, year: "", region: props.region, availableImpressions: "",
        country: "", mediaType: "", network: "", asset: "",
        quantityFrom: "", quantityTo: "", salesUnitCount: "", salesRight: "",
        insCount: "", insRight: ""
    });

    const [selectedValue, setSelectedValues] = React.useState({
        year: "", region: props.region, availableImpressions: "",
        country: "", mediaType: "", network: "", asset: "",
        quantityFrom: "", quantityTo: "", salesUnitCount: "", salesRight: "",
        insCount: "", insRight: ""
    });

    const [regionData, setRegionData] = React.useState(props.region);
    const [mediaTypeParent, setMediaTypeParent] = React.useState();
    const [countryData, setCountryData] = React.useState([]);
    const [venturizedData, setVenturizedData] = React.useState([]);
    const [mediaTypeData, setMediaTypeData] = React.useState([]);
    const [mediumData, setMediumData] = React.useState([]);
    const [marketTypeData, setMarketTypeData] = React.useState([]);
    const [networkData, setNetworkData] = React.useState([]);
    const [assetData, setAssetData] = React.useState([]);
    const [seasonData, setSeasonData] = React.useState([])
    const [selectedYear, setSelectedYear] = React.useState();
    const [InventoryType, setInventoryTypeData] = React.useState()

    const [venturized, setVenturized] = React.useState(null);
    const [venturizedName, setVenturizedName] = React.useState(null);
    const [marketType, setMarketType] = React.useState(null);
    const [mediaType, setMediaType] = React.useState(null);
    const [selectedInsImpression, setSelectedInsImpression] = React.useState();
    const [selectedQuantyFrom, setSelectedQuantyFrom] = React.useState();
    const [selectedQuantyTo, setSelectedQuantyTo] = React.useState();
    const [selectedSaleCount, setSelectedSaleCount] = React.useState();
    const [selectedInsCount, setSelectedInsCount] = React.useState();
    const [showForm, setShowForm] = React.useState(false);
    const [selectedAsset, setSelectedAsset] = React.useState();
    const [selectedCountry, setSelectedCountry] = React.useState();
    const [selectedNetwork, setSelectedNetwork] = React.useState();
    const [selectedSalesRight, setSelectedSalesRight] = React.useState();
    const [selectedIntRight, setSelectedIntRight] = React.useState();
    const [disabled, setDisabled] = React.useState(false);
    const [disabledToAndFrom, setDisabledToAndFrom] = React.useState(false);

    const handleClose = () => {

    }

    const handleSubmit = () => {
        let params = {
            id: 0,
            inventoryDealId: props.dealId,
            year: inventory.year,
            regionId: inventory.region.value,
            countryId: inventory.country.value,
            mediaTypeId: inventory.mediaType.value,
            networkId: inventory.network.value,
            assetId: inventory.asset.value,
            quantityFrom: inventory.quantityFrom,
            quantityTo: inventory.quantityTo,
            salesUnit: inventory.salesUnitCount,
            salesUnitDesc: inventory.salesRight.value,
            institutionalUnit: inventory.insCount,
            institutionalUnitDesc: inventory.insRight.value,
        }
        SaveInventory(params).then(resp => {
            if (resp) {
                props.refreshPage();
               props.handleClose();
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const handleSalesUnitCountBlur = (value) => {
        let tempInventory = inventory;
        tempInventory.salesUnitCount = value;
        setInventory(tempInventory);
        setSelectedSaleCount(value);
        props.updateInventoryData("salesUnitCount", value);
    }

    const handleInsCountBlur = (value) => {
        let tempInventory = inventory;
        tempInventory.insCount = value;
        setInventory(tempInventory);
        setSelectedInsCount(value);
        props.updateInventoryData("insCount", value);
    }

    const handleQuantityFromBlur = (value) => {
        let tempInventory = inventory;
        tempInventory.quantityFrom = value;
        setInventory(tempInventory);
        setSelectedQuantyFrom(value);
        props.updateInventoryData("quantityFrom", value);
    }

    const handleQuantityToBlur = (value) => {
        let tempInventory = inventory;
        tempInventory.quantityTo = value;
        setInventory(tempInventory);
        setSelectedQuantyTo(value);
        props.updateInventoryData("quantityTo", value);
    }

    // const handleAvailableImpressionsBlur = (value) => {
    //     let tempInventory = inventory;
    //     tempInventory.availableImpressions = value;
    //     setInventory(tempInventory);
    //     setSelectedInsImpression(value);
    //     props.updateInventoryData("availableImpressions", value);
    // }

    const handleChange = (name, value) => {
        let tempInventory = inventory;
        let tempSelectedValue = selectedValue;
        tempSelectedValue[name] = value.label;
        tempInventory[name] = value;
        if(name === "salesRight") {
            setSelectedSalesRight(value.label);
        }

        if(name === "network") {
            setSelectedNetwork(value.label);
        }

        if(name === "insRight") {
            setSelectedIntRight(value.label);
        }
        if(name === "asset") {
            setSelectedAsset(value.label);
        }
        if(name === "country") {
            setSelectedCountry(value.label);
        }

        if(name === "mediaType") {
            setMediaTypeParent(value);
            if(value.value === 101 || value.value === 102) {
                setDisabledToAndFrom(true);
            } else {
                setDisabledToAndFrom(false);
            }
            setSelectedNetwork("");
            tempSelectedValue["network"]  = "";
            tempInventory["network"] = {};
        }
        setInventory(tempInventory);
        setSelectedValues(tempSelectedValue);
        if (name === "year") {
            setSelectedYear(value.label);
        }
        props.updateInventoryData(name, value);
        if(name === "region") {
            getCountryData(value.value);
        }

        if(name === "mediaType") {
            setMediaType(value.value);
            getNetworkData(props.partner.value, props.region.value, value.value);
            getInventoryType(value);
            setSelectedAsset("");
            setSelectedIntRight("");
            setSelectedSalesRight("");
            setSelectedQuantyFrom("");
            setSelectedQuantyTo("");
            props.updateInventoryData("asset", "");
            props.updateInventoryData("salesRight", "");
            props.updateInventoryData("insRight", "");
            props.updateInventoryData("quantityFrom", "");
            props.updateInventoryData("quantityTo", "");
            var selectedMarketType;
            if (props.region.label === 'United States') {
                selectedMarketType = marketTypeData.filter(v => v.label == 'Domestic');
                setMarketType(selectedMarketType[0].value);

            } else {
                selectedMarketType = marketTypeData.filter(v => v.label == 'International');
                setMarketType(selectedMarketType[0].value);
            }

            if (name !== "asset") {
                getAssetData(selectedMarketType[0].value, null, value.value);
            }
        }
    }

    const getInventoryType = (data) => {
        let id = 0;
        if(data.parentId === 100 && data.value !== 103)
            id = 1210;
        else if(data.parentId === 100 && data.value === 103)
            id = 1220;
        else if(data.parentId === 400)
            id = 1225;
        else if(data.parentId === 200 || data.parentId === 150 || data.parentId === 250)
            id = data.value && data.value === 153 && data.parentId === 150 ? 1240 : 1200;
        else if(data.parentId === 300)
            id = 1230;
        else
            id = 1245;

        GetLookupById(id).then((data) => {
            let lookupData = [];
            data.map(item => {
                lookupData.push({ label: item.lookupText, value: item.lookupId });
            });
            setInventoryTypeData(lookupData);
        }).catch(err => console.log(err))
    }

    const getCountryData = (id) => {
        GetCountries(id).then((data) => {
            let countries = [];
            data.map(item => {
                countries.push({ label: item.countryName, value: item.id });
            });
            setCountryData(countries);
        }).catch(err => console.log(err))
    }

    const getAssetData = (_marketType, _venturized, _mediaType) => {
        if (_marketType === null)
            _marketType = marketType;
        if (_venturized === null)
            _venturized = venturized;
        if (_mediaType === null)
            _mediaType = mediaType;

        if (_marketType === null || _venturized === null || _mediaType === null)
            return;
        setShowLoading(true);
        setOpenBackdrop(true);
        GetAssets(leagueId, _marketType, _venturized, _mediaType).then(data => {
            if (data) {

                let list = data.map((item) => {
                    return { label: item.assetDisplayName, value: item.id }
                });

                let distList = Array.from(new Set(list.map(a => a.value)))
                    .map(id => {
                        return list.find(a => a.value === id)
                    });

                    setShowLoading(false);
                    setOpenBackdrop(false);

                    setAssetData(distList);
            }
            else {
                setShowLoading(false);
                setOpenBackdrop(false);
                console.log("GetAssets API is failing");
            }
        });
    }

    const getSeason = () => {
        GetSeason(leagueId).then((data) => {
            let season = [];
            data.map(item => {
                season.push({ label: item.year.toString(), value: item.seasonId });
            });
            setSeasonData(season);
        }).catch(err => console.log(err))
    }

    const getRegionData = () => {
        GetRegions().then((data) => {
            let region = [];
            data.map(item => {
                region.push({ label: item.regionName, value: item.id });
            });
            setRegionData(region);
        }).catch(err => console.log(err))
    }

    const getNetworkData = (partnerId, regionId, mediaTypeId) => {
        GetNetworkByRegion(partnerId, regionId, mediaTypeId).then((data) => {
          let networks = [];
          data.map(item => {
            networks.push({ label: item.networkName, value: item.id });
          });
          setNetworkData(networks);
        }).catch(err => console.log(err))
    }

    const getVenturizedData = () => {
        if (Venturized && Venturized.length > 0) {
            let list = Venturized.map((item) => {
                return { label: item.lookupText, value: item.lookupId }
            });
            setVenturizedData(list);
            let nonVenture = list.filter(x => x.value == 952);
            setVenturized(nonVenture[0].value);
            setVenturizedName(nonVenture[0].label);
        }
    }

    const getMediaTypeData = () => {
        setShowLoading(true);
        setOpenBackdrop(true);
        GetMedium(-1).then(data => {
            if (data) {
                setMediumData(data);
                let list = data.map((item) => {
                    return { label: item.mediumLookupDisplayText, value: item.mediumLookupId, parentId: item.mediumLookupParentId }
                });
                setMediaTypeData(list);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
            else console.log("GetMedium API is failing");
        }).catch((error) => {
            setShowLoading(false);
            setOpenBackdrop(false);
            console.log('Error in GetMedium ', error);
        });
    }

    const getMarketTypeData = () => {
        setShowLoading(false);
        setOpenBackdrop(false);
        if (MarketType && MarketType.length > 0) {
            let list = MarketType.map((item) => {
                return { label: item.lookupText, value: item.lookupId }
            });

            if (props.region) {
                let selectedMarketType;
                if (props.region.label === 'United States') {
                    selectedMarketType = list.filter(v => v.label == 'Domestic');
                    if (selectedMarketType) {
                        setMarketType(selectedMarketType[0].value);
                    }
                } else {
                    selectedMarketType = list.filter(v => v.label == 'International');
                    if (selectedMarketType) {
                        setMarketType(selectedMarketType[0].value);
                    }
                }
                if (selectedMarketType) {
                    getAssetData(selectedMarketType[0].value, null, null);
                }
            }
            setMarketTypeData(list);
            setTimeout(()=>{
                setShowLoading(false);
                setOpenBackdrop(false);

            }, 5000);

        }
    }

    const handleEdit = (ele, name) => {
        props.handleEdit(ele, name);
        setSelectedValues({
            year: ele.seasonYear, region: props.region, availableImpressions: ele.instAvgImpression,
            country: ele.countryName, mediaType: ele.mediaTypeDisplayName, network: ele.networkName,
            asset: ele.assetName, quantityFrom: ele.quantityFrom, quantityTo: ele.quantityTo,
            salesUnitCount: ele.salesUnit, salesRight: ele.salesUnitDescText,
            insCount: ele.institutionalUnit, insRight: ele.institutionalUnitDescText
        });
        setMediaType(ele.mediaTypeId);
        setSelectedCountry(ele.countryName);
        setSelectedNetwork(ele.networkName)
        getMarketTypeData();
        setSelectedAsset(ele.assetName);
        setMediaTypeParent({value: ele.mediaTypeId, label: ele.mediaTypeDisplayName,  parentId: ele.mediaTypeParentId});
        setSelectedYear(ele.seasonYear);
        setSelectedSaleCount(ele.salesUnit);
        setSelectedInsCount(ele.institutionalUnit);
        setSelectedInsImpression(ele.instAvgImpression);
        setSelectedQuantyFrom(ele.quantityFrom);
        setSelectedQuantyTo(ele.quantityTo);
        props.updateInventoryData("year", {label: ele.seasonYear, value: ele.seasonId});
        props.updateInventoryData("availableImpressions", ele.instAvgImpression);
        props.updateInventoryData("country", {label: ele.countryName, value: ele.countryId});
        props.updateInventoryData("mediaType", {value: ele.mediaTypeId, label: ele.mediaTypeDisplayName, parentId: ele.mediaTypeParentId});
        props.updateInventoryData("network", {value: ele.networkId, label: ele.networkName});
        props.updateInventoryData("asset", {value: ele.assetId, label: ele.assetName});
        props.updateInventoryData("salesUnitCount", ele.salesUnit);
        props.updateInventoryData("salesRight", ele.salesUnitDesc && ele.salesUnitDescText ? {value: ele.salesUnitDesc, label: ele.salesUnitDescText} : null);
        props.updateInventoryData("insCount", ele.institutionalUnit);
        props.updateInventoryData("insRight", ele.institutionalUnitDesc && ele.institutionalUnitDescText ? {value: ele.institutionalUnitDesc, label: ele.institutionalUnitDescText} : null);
        props.updateInventoryData("quantityFrom", ele.quantityFrom);
        props.updateInventoryData("quantityTo", ele.quantityTo);
        setSelectedIntRight(ele.institutionalUnitDescText);
        setSelectedSalesRight(ele.salesUnitDescText);
        getNetworkData(props.partner.value, props.region.value, ele.mediaTypeId);
        setShowForm(true);
        setDisabled(true);
        getInventoryType({value: ele.mediaTypeId, label: ele.mediaTypeDisplayName, parentId: ele.mediaTypeParentId});
    }

    const resetForm = () => {
        setSelectedValues({
            year: "", region: props.region, availableImpressions: 0,
            country: "", mediaType: "", network: "", asset: "",
            quantityFrom: 0, quantityTo: 0, salesUnitCount: 0, salesRight: "",
            insCount: 0, insRight: ""
        });
        setSelectedCountry("");
        setSelectedYear("");
        setSelectedAsset("");
        setSelectedSaleCount("");
        setSelectedInsCount("");
        setSelectedInsImpression("");
        setSelectedQuantyFrom("");
        setSelectedQuantyTo("");
        setSelectedIntRight("");
        setSelectedSalesRight("")
        setDisabled(false);
        setMediaTypeParent();

    }

    const handleAdd = () => {
        resetForm();
        setShowForm(true);
        setDisabled(false);
        props.handleAdd();
    }

    React.useEffect(() => {
        //getRegionData();
        getVenturizedData();
        getMediaTypeData();
        getMarketTypeData();
        getSeason();
        if (props.region) {
            getCountryData(props.region.value);
        } else {
            getRegionData();
        }

    }, [leagueId]);

    React.useEffect(() => {
        if(props.resetInventory){
            resetForm();
            setShowForm(false);

        }
    }, [props.resetInventory])

    return (
        <>
            {/* <ToastContainer autoClose={3000} /> */}
            {!showForm && <Box position={"relative"}>
                <Box >
                    <Box className={classes.gridContainer} pl={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }} color="primary">Inventory</Typography>
                    {

                        props.inventories.length > 0
                            && props.inventories.map((ele, index) => {
                            return <InventoryDealUI refreshDealInventoryPage={props.refreshDealInventoryPage} handleEdit={handleEdit} data={ele} index={index} disabled={disabled}/>

                        })

                    }
                     </Box>

                    {
                        props.inventories.length === 0 &&
                        <Typography py={1} px={2} component='p' variant="body2">No record found.</Typography>
                    }

                    <Fab size="small" color="primary" className={classes.fabButton} aria-label="add" onClick={() => handleAdd()}>
                        <AddIcon />
                    </Fab>
                </Box>
            </Box>}
            { showForm && <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} >
                <Grid container alignItems="center" spacing={1.25} mb={1}>

                    <Grid item xs={4}>
                        <Dropdown name="year" handleChange={handleChange} value={selectedValue.year}
                            size="small" id="year" variant="outlined" disabled={disabled}
                            showLabel={true} lbldropdown="Year" ddData={seasonData} />
                    </Grid>
                    <Grid item xs={4}>
                        <Dropdown name="region" handleChange={handleChange} value={selectedValue.region}
                            size="small" id="region" variant="outlined" disabled={true}
                            showLabel={true} lbldropdown="Region" ddData={regionData} />
                    </Grid>
                    <Grid item xs={4}>
                        <Dropdown name="country" handleChange={handleChange} value={selectedCountry}
                            size="small" id="country" variant="outlined" disabled={disabled}
                            showLabel={true} lbldropdown="Country" ddData={countryData} />
                    </Grid>

                </Grid>
                <Grid container alignItems="center" spacing={1.25} mb={1}>

                    <Grid item xs={4}>
                        <Dropdown name="mediaType" handleChange={handleChange} value={selectedValue.mediaType}
                            size="small" id="mediaType" variant="outlined"
                            showLabel={true} lbldropdown="Media Type" ddData={mediaTypeData} disabled={disabled}/>
                    </Grid>
                    {mediaTypeParent && (mediaTypeParent.parentId === inventoryDealConstants.TVParentId || mediaTypeParent.parentId === inventoryDealConstants.RadioParentId) && <Grid item xs={4}>
                        <Dropdown name="network" handleChange={handleChange} value={selectedNetwork}
                            size="small" id="network" variant="outlined"
                            showLabel={true} lbldropdown="Network" ddData={networkData} disabled={disabled}/>
                    </Grid>}
                    <Grid item xs={4}>
                        <Dropdown name="asset" handleChange={handleChange} value={selectedAsset}
                            size="small" id="asset" variant="outlined"
                            showLabel={true} lbldropdown="Asset" ddData={assetData} disabled={disabled}/>
                    </Grid>

                </Grid>                                       { /* Quantity hidden for Digital: 101 and Digital Social Media: 102 */}
                {mediaTypeParent && mediaTypeParent.parentId === 100 && (mediaTypeParent.value === 101 || mediaTypeParent.value === 102 || mediaTypeParent.value === 103) ? "" :
                <Grid container alignItems="center" spacing={1.25} mb={1}>
                    <Grid item xs={4}>
                        <TextboxField lblName="Quantity From" textboxData={selectedQuantyFrom}
                            size="small" fullWidth disabled={disabledToAndFrom ? true : false}
                            type="text" handleBlur={handleQuantityFromBlur}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextboxField lblName="Quantity To" textboxData={selectedQuantyTo} id="quantityTo"
                            size="small" fullWidth disabled={disabledToAndFrom ? true : false}
                            type="text" handleBlur={handleQuantityToBlur}
                        />
                    </Grid>
                    {/* <Grid item xs={4}>
                        {mediaTypeParent && mediaTypeParent.parentId === inventoryDealConstants.DigitalParentId &&
                            <TextboxField lblName="Available Impressions"
                            textboxData={selectedInsImpression}
                            size="small" fullWidth
                            type="text" handleBlur={handleAvailableImpressionsBlur}
                        />}
                    </Grid> */}
                </Grid>}
                <Grid container alignItems="center" spacing={1.25} mb={1}>

                    <Grid item xs={4}>
                        <TextboxField lblName="Sales Unit Count" textboxData={selectedSaleCount}
                            size="small" fullWidth
                            type="text" handleBlur={handleSalesUnitCountBlur}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Dropdown name="salesRight" handleChange={handleChange} value={selectedSalesRight}
                            size="small" id="salesRight" variant="outlined"
                            showLabel={true} lbldropdown="Sales Right" ddData={InventoryType} />
                    </Grid>

                </Grid>
                <Grid container alignItems="center" spacing={1.25} mb={1}>

                    <Grid item xs={4}>
                        <TextboxField lblName="Ins Count" textboxData={selectedInsCount}
                            size="small" fullWidth
                            type="text" handleBlur={handleInsCountBlur}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Dropdown name="insRight" handleChange={handleChange} value={selectedIntRight}
                            size="small" id="insRight" variant="outlined"
                            showLabel={true} lbldropdown="Ins Right" ddData={InventoryType} />
                    </Grid>

                </Grid>
            </Box>}

            {
                showLoading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <div className={'loader-div'}><div className={'loading'}></div></div>
                </Backdrop>
            }

        </>
    );

}
InventoryDealTwo.displayName = "Inventory"
export default InventoryDealTwo;

