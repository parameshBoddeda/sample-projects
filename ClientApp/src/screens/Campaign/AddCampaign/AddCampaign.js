import * as React from 'react';
import AppDataContext from '../../../common/AppContext';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import { Box, Paper, Grid, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from "react-toastify";
import Helper from '../../../common/Helper';
import DateRangePicker from '../../../sharedComponents/PickDateRange/PickDateRange';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import { makeStyles } from '@material-ui/core/styles';
import { GetSeason, GetLookupById, GetUsersListByRole } from '../../../services/common.service';
import { SaveCampaign } from '../../../services/campaign.service';
import Backdrop from '@mui/material/Backdrop';
import { ROLE } from '../../../common/AppConstants';
import * as AppLanguage from '../../../common/AppLanguage';

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) } 

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 178px)',
        overflowY: 'auto',
    },
    customTextBox: {
        minWidth: '80% !important',
    },
}));
let temp = {};
const AddCampaign = (props) => {
    const classes = useStyles();

    const { username, leagueId } = React.useContext(AppDataContext);
    
    const [showLoading, setShowLoading] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [categoryList, setCategoryList] = React.useState();
    const [seasonList, setSeasonList] = React.useState();
    
    const [marketTypeList, setMarketTypeList] = React.useState();
    const [plannerList, setPlannerList] = React.useState();
    const [selectedCampaignName, setSelectedCampaignName] = React.useState(props.selectedRow.campaignName);
    const [selectedCampaignShortName, setSelectedCampaignShortName] = React.useState(props.selectedRow.campaignShortName);
    const [selectedSeason, setSelectedSeason] = React.useState(props.selectedRow.seasonName);
    const [selectedCategory, setSelectedCatogory] = React.useState(props.selectedRow.category);
    const [selectedMarketType, setSelectedMarketType] = React.useState(props.selectedRow.marketType);
    const [selectedPlanner, setSelectedPlanner] = React.useState(props.selectedRow.mediaPlanner);
    const [selectedStartDate, setSelectedStartDate] = React.useState(Helper.FormatDate(props.selectedRow.startDate) || null);
    const [selectedEndDate, setSelectedEndDate] = React.useState(Helper.FormatDate(props.selectedRow.endDate) || null);

    const [selectedRowData, setSeletedRowData] = React.useState(props.selectedRow)
    const [Campaign, setCampaignData] = React.useState({
        campaignName: "", campaignShortName: "", seasonId:"", categoryId: "", 
        marketType:"", Planner:"",startDate: "", endDate:""
    });

    const handleBlur = (value) => {
        let data = Campaign;
        if(props.selectedBtn === "edit") {
            setSelectedCampaignName(value);
        }
        data.campaignName = value;
        setCampaignData(data);
    }

    const handleCampaignShortBlur = (value) => {
        let data = Campaign;
        data.campaignShortName = value;
        if(props.selectedBtn === "edit") {
            setSelectedCampaignShortName(value);
        }
        setCampaignData(data);
    }

    const handleChange = (name, value) => {
        let data = Campaign;
        data[name] = value;
        if(props.selectedBtn === "edit") {
            if(name === "seasonId") {
                setSelectedSeason(value.label);
            }
            if(name === "categoryId") {
                setSelectedCatogory(value.label);
            }
            if(name === "marketType") {
                setSelectedMarketType( value.label);
            }

            if(name === "Planner") {
                debugger;
                setSelectedPlanner( value.label);
            }
            
        }
        setCampaignData(data);
    }

    const setStartDate = (value) =>{
        let data = Campaign;
        setSelectedStartDate(Helper.FormatDate(value))
        data.startDate = Helper.FormatDate(value);
        setCampaignData(data);
    }

    const setEndDate = (value) =>{
        let data = Campaign;
        setSelectedEndDate(Helper.FormatDate(value));
        data.endDate = Helper.FormatDate(value);
        setCampaignData(data);
    }

    const validate = () => {
        let errorFound = false;
        if(!Campaign.campaignName) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Campaign Name"));
            errorFound = true;
        }
        if(!Campaign.campaignShortName) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Campaign Short Name"));
            errorFound = true;
        }

        if(!Campaign.seasonId) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Season"));
            errorFound = true;
        }
        if(!Campaign.categoryId) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Category"));
            errorFound = true;
        }
        if(!Campaign.marketType) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Market Type"));
            errorFound = true;
        }
        if(!Campaign.Planner) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Media Planner"));
            errorFound = true;
        }
        if(!Campaign.startDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "Start Date"));
            errorFound = true;
        }
        if(!Campaign.endDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__", "End Date"));
            errorFound = true;
        }

        return errorFound;
    }

    const handleSubmit = () => {
        let errorfound = validate();
        if(!errorfound){

            let params = {
                id: props.recordId,
                iPlanCampaignID: props.CampaignId !== 0 ? props.CampaignId : 'I' + Math.floor(1000 + Math.random() * 9000),
                campaignName: Campaign.campaignName,
                campaignShortName: Campaign.campaignShortName,
                seasonID: Campaign.seasonId.value,
                categoryID: Campaign.categoryId.value,
                marketTypeID: Campaign.marketType.value,
                leagueID: leagueId,
                mediaPlanner: Campaign.Planner.label,
                startDate: Campaign.startDate,
                endDate: Campaign.endDate,
                user: username
            }

            SaveCampaign(params).then(data => {
                if (data) {
                    notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
                    setCampaignData({
                        campaignName: "", campaignShortName: "", seasonId:"", categoryId: "", 
                        marketType:"", Planner:"",startDate: "", endDate:""
                    });
                    setTimeout(()=> {
                        props.refershPage();
                    }, 3000); 
                }
            }).catch(err => {
                console.log(err)
            });

        }
    }

    const loadFormData =() => {
        setShowLoading(true);
        setOpenBackdrop(true);

        GetUsersListByRole(ROLE.CAMPAIGN_PLANNER)
            .then((data) => {
                let mediumData = [];
                data.map((item) => {
                    mediumData.push({
                        label: item.fullName,
                        value: item.loginId,
                        loginId: item.email,
                    });
                });
                setPlannerList(mediumData);
            })
            .catch((err) => console.log(err));       
        
        
        GetSeason(leagueId).then(data => {
            if (data) {
                let list = data.map((item) => {
                    if(item.isActive)
                        return { label: item.seasonName, value: item.seasonId }
                });

                setSeasonList(list);
            }
            else console.log("Seasons API is failing");
            setShowLoading(false);
            setOpenBackdrop(false);
        });

        //Market Type List-
        GetLookupById(110).then((data) => {
            let cList = [];
            if (data) {
                data.map(item => {
                    cList.push({ label: item.lookupText, value: item.lookupId });
                });
                setMarketTypeList(cList);
            }
        }).catch(err => console.log(err));

        // Category List-
        let tempId = 1000;
        GetLookupById(tempId).then((data) => {
            let cList = [];
            if (data) {
                data.map(item => {
                    cList.push({ label: item.lookupText, value: item.lookupId });
                });
                setCategoryList(cList);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
        }).catch(err => console.log(err))

        if(props.selectedBtn === "edit") {
            setCampaignData({
                campaignName: selectedRowData.campaignName, campaignShortName: selectedRowData.campaignShortName, 
                seasonId: {label: selectedRowData.seasonName, value: selectedRowData.seasonID}, 
                categoryId: {label: selectedRowData.category, value: selectedRowData.categoryID}, 
                marketType: {label: selectedRowData.marketType, value: selectedRowData.marketTypeID}, 
                Planner: {label: selectedRowData.mediaPlanner},startDate: Helper.FormatDate(selectedRowData.startDate),
                endDate: Helper.FormatDate(selectedRowData.endDate)
            })
        }

    }

    React.useEffect(() => {
        loadFormData();
    }, []);

        return (
        <Paper elevation={0}>
            <ToastContainer autoClose={3000} />
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader 
                         showIcon={true} hideCheckbox={true} headerText={`${props.selectedBtn === "edit" ? "Edit" : "Add"} Campaign`}>
                            {props.showCloseIcon && <Box display="flex">
                                <IconButton size="small" onClick={props.handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>}
                        </GridHeader>
                    </Box>
                </Grid>
            </Grid>
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item sm={12}>
                                <TextboxField lblName="Campaign Name" textboxData={selectedCampaignName}
                                    size="small" classList={classes.customTextBox}
                                    type="text" handleBlur={handleBlur} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item sm={12}>
                                <TextboxField lblName="Campaign Short Name" textboxData={selectedCampaignShortName}
                                    size="small" classList={classes.customTextBox}
                                    type="text" handleBlur={handleCampaignShortBlur} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Dropdown name="seasonId" handleChange={handleChange} 
                                value={selectedSeason}
                                size="small" id="seasonId" variant="outlined" showLabel={true}
                                lbldropdown="Season" ddData={seasonList} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Dropdown name="categoryId"
                                handleChange={handleChange} size="small" id="categoryId" value={selectedCategory}
                                variant="outlined" showLabel={true} lbldropdown="Category" ddData={categoryList} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Dropdown name="marketType" handleChange={handleChange} value={selectedMarketType}
                                size="small" id="marketType" variant="outlined" showLabel={true} 
                                lbldropdown="Market Type" ddData={marketTypeList} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Dropdown name="Planner" handleChange={handleChange}
                                value={selectedPlanner}
                                size="small" id="Planner" variant="outlined"
                                showLabel={true} lbldropdown="Institutional Media Planner" ddData={plannerList} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item sm={8}>
                                <DateRangePicker startDate={selectedStartDate} 
                                endDate={selectedEndDate} setStartDate={setStartDate} 
                                setEndDate={setEndDate}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box component="div" mt={2}>
                <Grid container xs={12} justifyContent="flex-end">
                    <Button onClick={props.handleClose} color="secondary" 
                        size='small' sx={{ marginRight: '8px' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" 
                        size='small' sx={{ marginRight: '8px' }} color="primary">
                        Save
                    </Button>
                </Grid>
            </Box>
            </Box>
            
            {
                showLoading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <div className={'loader-div'}><div className={'loading'}></div></div>
                </Backdrop>
            }
        </Paper>
    );
}

AddCampaign.displayName = "AddCampaign";
export default AddCampaign;