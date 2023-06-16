import { makeStyles } from '@material-ui/core/styles';
import GridHeader from "../../sharedComponents/GridHeader/GridHeader";
import AppDataContext from '../../common/AppContext';
import { Box, Button, FormControl, FormControlLabel, Grid, IconButton, Radio, RadioGroup, TextField, Typography, Paper } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import DateRangePicker from '../../sharedComponents/PickDateRange/PickDateRange';
import Helper from '../../common/Helper';
import { WithContext as ReactTags } from 'react-tag-input';
import { GetMedium, GetMediaType, InsUpdISCIinfo, GetBrands, GetPartnerByType } from '../../services/common.service';
import { GetCampaignList, GetCampaignListByMarketType } from '../../services/campaign.service';
import { toast } from "react-toastify";
import * as AppConstants from '../../common/AppConstants';
import CloseIcon from "@mui/icons-material/Close";
import './AddEditISCI.css';
import PickDate from '../../sharedComponents/PickDate/PickDate';
import * as AppLanguage from '../../common/AppLanguage';


function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }

const useStyles = makeStyles((theme) => ({
    isciPageContainer: {
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        padding: '10px'
    },

    contentHeight: {
        height: 'calc(100vh - 170px)',
        overflowY: 'auto',
    },
    isciPageHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}));

const AddEditISCI = (props) => {
    const KeyCodes = {
        comma: 188,
        enter: 13
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    const classes = useStyles();

    const [selectedRadioType, setSelectedRadioType] = useState("sales")
    const [selectedMarketType, setSelectedMarketType] = useState(null)
    const [selectedMediaType, setSelectedMediaType] = useState(null)
    const [mediaTypeData, setMediaTypeData] = useState([])
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(null);
    const [runningTime, setRunningTime] = useState("00:30")
    const [selectedAdvertiser, setSelectedAdvertiser] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [advertiserList, setAdvertiserList] = useState([])
    const [brandsList, setBrandsList] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [campaignList, setCampaignList] = useState([]);
    const [isci, setISCI] = useState(null);
    const [houseId, setHouseId] = useState(null);
    const [title, setTitle] = useState(null);
    const [contentLink, setContentLink] = useState(null);
    const [comments, setComments] = useState(null);
    const { leagueId, MarketType, username } = useContext(AppDataContext);
 
    const [tags, setTags] = useState([]);

    useEffect(() => {
        props.setShowLoading(true);
        props.setOpenBackdrop(true);
        if (props.editData?.typeName) {
            var typename = props.editData.typeName.toLowerCase();
            var objMarket = { label: props.editData.marketTypeName, value: props.editData.marketTypeId };
            var objMedia = { label: props.editData.mediaTypeName, value: props.editData.mediaTypeId };
            var objBrand = props.editData.productName ? { label: props.editData.productName, value: props.editData.productId }:null;
            setSelectedMarketType(objMarket);
            setSelectedRadioType(typename);
            setSelectedMediaType(objMedia);
            setSelectedStartDate(props.editData.flightStartDate);
            setSelectedEndDate(props.editData.flightEndDate);
            setSelectedDeliveryDate(Helper.FormatToIsoDate(props.editData.deliveryDate));
            setRunningTime(props.editData.runningTime);
            var objCampAd = { label: props.editData.campaignOrAdvertiserName, value: props.editData.campaignOrAdvertiserId };
            if (typename == 'institutional') {
                setSelectedCampaign(objCampAd);
                var catArr = props.editData.categoryName ? props.editData.categoryName.split(',') : [];
                var tagscreated = catArr.map(x => {
                    return { id: x, text: x };
                })
                setTags(tagscreated);
                getCampaignList(objMarket);
            } else {
                setSelectedAdvertiser(objCampAd);
                setSelectedBrand(objBrand);
                getBrandsData(objCampAd)
            }
            setISCI(props.editData.isci);
            setHouseId(props.editData.houseId);
            setTitle(props.editData.title);
            setContentLink(props.editData.contentLink);
            setComments(props.editData.comment);
        }
        // setTimeout(() => {
        // }, 3000);
    }, [props.editData]);

    const getPartnerByType = () => {
        GetPartnerByType(AppConstants.PartnerType.Licensee_Sponsor).then((data) => {
            let customer = [];
            data.map(item => {
                customer.push({ label: item.partnerName, value: item.id });
            });
            setAdvertiserList(customer);
        }).catch(err => console.log(err))
    }

    const getMedium = () => {
        GetMediaType(-1).then((data) => {
            if (data) {
                 let list = data.map((item) => {
                     return { label: item.mediumLookupText, value: item.mediumLookupId, parentId: item.mediumLookupParentId }
                 });
                 let filteredMediaType = list.filter(
                     (mediaType) => ((mediaType.value === 150) || (mediaType.value === 200))
                 );
                 setMediaTypeData(filteredMediaType);
             }
         }).catch(err => console.log(err))
    }

    const getCampaignList = (marketTypeID) => {
        GetCampaignList(leagueId).then(Campaigns => {
            let list = Campaigns.map((item) => {
                return { label: item.campaignName, value: item.id, year: item.year, campaignOrAdvertiserId: item.id , marketTypeID: item.marketTypeID }
            });
         
               let  filteredCampaignList = list.filter(
                    (item) => (item.marketTypeID == marketTypeID.value))
                   
            setCampaignList(filteredCampaignList);    
         }).catch(err => console.log(err))
    }

    useEffect(() => {
        getPartnerByType();
        getMedium();
     
        props.setShowLoading(false);
        props.setOpenBackdrop(false);
    }, [leagueId])

    const setStartDate = (value) => {
        setSelectedStartDate(Helper.FormatDate(value));
    }

    const setEndDate = (value) => {
        setSelectedEndDate(Helper.FormatDate(value));
    }

    const setDeliveryDate = (value) => {
        setSelectedDeliveryDate(Helper.FormatToIsoDate(value));
    }

    const handleClose = () => {
        props.handleClose(false);
    }

    const handleRadioTypeClick = (e) => {
        if (e.target.value === "institutional") {
            setISCI('')
            setTags([])
            setSelectedAdvertiser(null)
        }
        if (e.target.value === "sales") {
            setSelectedCampaign(null)
        }
        setSelectedRadioType(e.target.value)
    }

    const handleDropdownChange = (name, value) => {
        if (name === "marketType") {
            setSelectedMarketType(value)
            getCampaignList(value)
        }
        if (name === "mediaType") {
            setSelectedMediaType(value)
        }
        if (name === "campaign") {
            setSelectedCampaign(value)
        }
        if (name === "advertiser") {
            setSelectedAdvertiser(value)
            setSelectedBrand();
            getBrandsData(value)
        }
        if (name === "brands") {
            setSelectedBrand(value)
        }
    }

    const getBrandsData = (value) => {
        GetBrands(value.value).then((data) => {
            let b = [];
            data.map((item) => {
                b.push({ label: item.product, value: item.id });
            });
            setBrandsList(b);
        })
            .catch((err) =>
                console.log(err)
            );
    };

    const handleTextChange = (e, key) => {
        if (key === "ISCI") {
            setISCI(e.target.value)
        }
        if (key === "Title") {
            setTitle(e.target.value)
        }
        if (key === "Running Time") {
            let positiveNumberRegex = /[^0-9]/g;  //allow only positive numbers
            let value = e.target.value.replace(positiveNumberRegex, "");

            let addAutomaticColonRegex = /([^:]{2}(?!:))/g;
            value = value.replace(addAutomaticColonRegex, "$1:")   // add colon automatically after 2nd character in string

            value = value.split(":", 2).join(":")  // discard extra colons in string and allow only single colon
            setRunningTime(value)
        }
        if (key === "House ID") {
            setHouseId(e.target.value)
        }
        if (key === "Content Link") {
            setContentLink(e.target.value)
        }
        if (key === "Comments") {
            setComments(e.target.value)
        }
    }

    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        setTags([...tags, tag]);
    };

    const handleTagClick = (index) => {
        console.log('The tag at index ' + index + ' was clicked');
    }

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };

    const validate = () => {
        let isFormValid = true;
        if (selectedMarketType === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Market Type"));
            isFormValid = false;
        }
        if (selectedMediaType === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Media Type"));
            isFormValid = false;
        }
        if (selectedRadioType === "sales" && (isci == null || isci === "")) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "ISCI"));
            isFormValid = false;
        }
        if (title === null || title === "") {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Title"));
            isFormValid = false;
        }
        if (runningTime === null || runningTime === "") {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Running time") + " Default is 00:30");
            isFormValid = false;
        }
        if (selectedRadioType === "sales" && selectedAdvertiser === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Advertiser"));
            isFormValid = false;
        }
        if (selectedRadioType === "institutional" && selectedCampaign === null) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Campaign"));
            isFormValid = false;
        }
        return isFormValid;
    }

    const handleSubmit = () => {
        let isFormValid = validate();
        if (isFormValid) {
            props.setShowLoading(true);
            props.setOpenBackdrop(true);
            const formObj = {
                "id": props.formType === "Add" ? 0 : props.editData?.id, // for edit need to pass isci id
                "marketTypeID": selectedMarketType.value,
                "leagueID": leagueId,
                "isci": selectedRadioType === "sales" ? isci : "",
                "title": title,
                "campaignOrAdvertiserId": selectedRadioType === "sales" ? selectedAdvertiser.value : selectedCampaign.value,
                "mediaTypeId": selectedMediaType.value,
                "mediaTypeParentId": selectedMediaType?.parentId,
                "productId": selectedBrand ? selectedBrand.value : 0,
                "type": selectedRadioType === "sales" ? 1301 : 1302,
                "houseId": houseId ? houseId : "",
                "category": tags.length ? tags.map((elem) => elem.text).join(",") : "",
                "flightStartDate": selectedStartDate ? new Date(Helper.FormatToIsoDate(selectedStartDate)) : null,
                "flightEndDate": selectedEndDate ? new Date(Helper.FormatToIsoDate(selectedEndDate)) : null,
                "runningTime": runningTime,
                "comment": comments ? comments : "",
                "contentLink": contentLink ? contentLink : "",
                "createdBy": username,
                "deliveryDate": selectedDeliveryDate ? new Date(Helper.FormatToIsoDate(selectedDeliveryDate)) : null
            }
            props.handleSubmit(formObj, props.isEdit);
        }
    }

    return (
        <>

            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader
                            view={props.view}
                            showIcon={true}
                            icon={"ISCI"}
                            hideCheckbox={true}
                            headerText={`${props.formType} ISCI`}
                        >
                            <Box display="flex">
                                <IconButton size="small" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </GridHeader>
                    </Box>
                </Grid>
            </Grid>

            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>

                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 3 : 9}>
                                <FormControl size="small" >
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={selectedRadioType}
                                        onChange={handleRadioTypeClick}
                                    >
                                        <FormControlLabel value="sales" control={<Radio disabled={props.isEdit} checked={selectedRadioType === "sales"} value="sales" size="small" />} label="Sales" />
                                        <FormControlLabel value="institutional" control={<Radio disabled={props.isEdit} checked={selectedRadioType === "institutional"} value="institutional" size="small" />} label="Institutional" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 2 : 3}>
                                <Dropdown name="marketType"  disabled={props.isEdit}  required handleChange={handleDropdownChange}
                                    value={selectedMarketType && selectedMarketType.label ? selectedMarketType.label : ""}
                                    size="small" id="marketType" variant="outlined" showLabel={true}
                                    lbldropdown="Market Type *" ddData={MarketType.length ? MarketType : []}
                                />
                            </Grid>

                            <Grid item xs={props.view ? 2 : 3}>
                                <Dropdown name="mediaType" disabled={props.isEdit} required handleChange={handleDropdownChange}
                                    value={selectedMediaType && selectedMediaType.label ? selectedMediaType.label : ""}
                                    size="small" id="mediaType" variant="outlined" showLabel={true}
                                    lbldropdown="Media Type *" ddData={mediaTypeData.length ? mediaTypeData : []}
                                />
                            </Grid>

                            <Grid item xs={props.view ? 2 : 3}>
                                <FormControl required fullWidth>
                                    <TextField
                                        required
                                        disabled={(selectedRadioType === "institutional") || (props.isEdit)}
                                        onChange={(e) => handleTextChange(e, "ISCI")}
                                        label="ISCI"
                                        value={isci}
                                        size="small" id="isci" variant="outlined"
                                    />
                                </FormControl>
                            </Grid>

                        </Grid>

                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 6 : 9}>
                                <FormControl required fullWidth variant="outlined" margin="dense">
                                    <TextField
                                        required
                                        onChange={(e) => handleTextChange(e, "Title")}
                                        label="Title"
                                        value={title}
                                        size="small" id="title" variant="outlined"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 4 : 6}>
                                <DateRangePicker
                                    startDateLabel="Flight Start"
                                    endDateLabel="Flight End"
                                    startDate={selectedStartDate}
                                    endDate={selectedEndDate}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                />                                
                            </Grid>
                            <Grid item xs={props.view ? 2 : 3}>
                            <PickDate
                                value={selectedDeliveryDate}
                                setDate={setDeliveryDate}
                                size="small" 
                                label="Delivery Date"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                        <Grid item xs={props.view ? 2 : 3}>
                                <FormControl required fullWidth variant="outlined">
                                    <TextField
                                        required
                                        onChange={(e) => handleTextChange(e, "Running Time")}
                                        label="Running Time"
                                        value={runningTime}
                                        placeholder="mm:ss"
                                        size="small" id="title" variant="outlined"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={props.view ? 4 : 6}>
                                <FormControl required fullWidth variant="outlined">
                                    <TextField
                                        onChange={(e) => handleTextChange(e, "House ID")}
                                        label="House ID"
                                        value={houseId}
                                        size="small" id="title" variant="outlined"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        </Grid>

                    {/* <Grid item xs={12}>
                        <Grid container spacing={1}>
                        <Grid item xs={props.view ? 4 : 6}>
                                <DateRangePicker
                                    startDateLabel="Delivery Date"
                                    endDateLabel="Delivery Date"
                                    startDate={selectedStartDate}
                                    endDate={selectedEndDate}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                />
                            </Grid>
                        </Grid>

                    </Grid> */}

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 3 : 4.5}>
                                <Dropdown name="advertiser" required handleChange={handleDropdownChange}
                                    value={selectedAdvertiser} fullWidth
                                    placeholder="Select Advertiser"
                                    disabled={selectedRadioType === "institutional"}
                                    size="small" id="advertiser" variant="outlined" showLabel={true}
                                    lbldropdown="Advertiser *" ddData={advertiserList.length ? advertiserList : []}
                                />
                            </Grid>
                            <Grid item xs={props.view ? 3 : 4.5}>
                                <Dropdown name="campaign" required handleChange={handleDropdownChange}
                                    value={selectedCampaign} fullWidth
                                    placeholder={"Select Campaign"}
                                    disabled={selectedRadioType === "sales"}
                                    size="small" id="campaign" variant="outlined" showLabel={true}
                                    lbldropdown="Campaign *" ddData={campaignList.length  ? campaignList : []}
                                />
                            </Grid>
                            
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                        <Grid item xs={props.view ? 6 : 9}>
                                {
                                    selectedRadioType === "sales" ?
                                        <Dropdown name="brands" required handleChange={handleDropdownChange}
                                            value={selectedBrand} fullWidth
                                            placeholder="Select Brands"
                                            size="small" id="brands" variant="outlined" showLabel={true}
                                            lbldropdown="Brands" ddData={brandsList.length ? brandsList : []}
                                        />
                                        :
                                        <div>
                                            <ReactTags
                                                tags={tags}
                                                delimiters={delimiters}
                                                handleDelete={handleDelete}
                                                handleAddition={handleAddition}
                                                handleDrag={handleDrag}
                                                handleTagClick={handleTagClick}
                                                inputFieldPosition="top"
                                                autocomplete
                                                fullWidth
                                                autofocus={false}
                                                placeholder="Add Categories"
                                            />
                                        </div>

                                }
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 6 : 9}>
                                <TextField
                                    onChange={(e) => handleTextChange(e, "Content Link")}
                                    label="Content Link"
                                    fullWidth
                                    value={contentLink}
                                    size="small" id="title" variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={props.view ? 6 : 9}>
                                <FormControl fullWidth variant="outlined" margin="dense">
                                    <TextField
                                        multiline={true}
                                        minRows={3}
                                        onChange={(e) => handleTextChange(e, "Comments")}
                                        label="Comments"
                                        value={comments}
                                        size="small" id="title" variant="outlined"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid mt={2} container xs={12} justifyContent="flex-end">
                    <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                        <Button onClick={handleClose} color="secondary" size='small'>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" size='small' color="primary" >
                            Save
                        </Button>
                    </Box>
                </Grid>
            </Box>
        </>
    )
}

export default AddEditISCI;