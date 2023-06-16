import * as React from 'react';
import AppDataContext from '../../../common/AppContext';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import UploadImage from '../../../sharedComponents/UploadImage/UploadImage';
import { Box, Paper, Grid, IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from "react-toastify";
import Helper from '../../../common/Helper';
import DateRangePicker from '../../../sharedComponents/PickDateRange/PickDateRange';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import { makeStyles } from '@material-ui/core/styles';
import { AddUpdateCampignUnit, GetCampaignUnitList, GetEpisodesByStartDateAndEndDate } from '../../../services/campaign.service';
import { GetEpisodes, GetLookupById } from '../../../services/common.service';
import * as AppConstants from '../../../common/AppConstants';
import CampaignUnitUI from './CampaignUnitUI';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import uploadFileToBlob from '../../../services/AzureStorage';
import CampaignUnitReportViewer from './CampaignUnitReportViewer';
import {  GetReportUrl } from "../../../services/common.service";
import * as AppLanguage from '../../../common/AppLanguage';

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 204px)',
        overflowY: 'auto',
    },
    minContentHeight: {
        minHeight: '40px',
    },
    contentHeightWithForm: {
        height: 'calc(100vh - 465px)',
        overflowY: 'auto',
    },
    fabButton: {
        position: 'absolute !important',
        right: theme.spacing(4),
        bottom: theme.spacing(.5),
        minHeight: '32px !important',
        height: '32px !important',
        width: '32px !important',
    },
    setMargin: {
        marginTop: theme.spacing(3.2),
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
    },
}));
const CampaignUnitInstructions = (props) => {
    const classes = useStyles();
    
    const { username } = React.useContext(AppDataContext);
    const [selectedUnitType, setSelectedUnitType] = React.useState();
    const [selectedUnitTypeId, setSelectedUnitTypeId] = React.useState(-1);
    const [selectedEpisodes, setSelectedEpisodes] = React.useState(null);
    const [selectedReacordId, setSelectedReacordId] = React.useState(0);
    const [selectedStartDate, setSelectedStartDate] = React.useState([]);
    const [selectedEndDate, setSelectedEndDate] = React.useState([]);
    const [selectedInstructions, setSelectedInstructions] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState();
    const [CampaignUnitInstructions, setCampaignUnitInstructions] = React.useState({
        startDate: null, endDate: null, episodes:"", Instructions: "", unitType: "", fileDetails: ""
    });
    const [unitType, setUnitType] = React.useState([]);
    const [episodes, setEpisodes] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [CampaignUnitInstructionsList, setCampaignUnitInstructionsList] = React.useState([]);

    const [showLoading, setShowLoading] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [flag, setFlag] = React.useState(0);
    const [reportUrl, setReportUrl] =  React.useState("");
    const { leagueId } = React.useContext(AppDataContext);
 


    
    
    React.useEffect(() => {
        if (selectedStartDate && selectedEndDate && props.recordId > 0 && selectedUnitTypeId>0) {
            setEpisodes([]);
            getEpisodes(selectedStartDate, selectedEndDate, props.recordId, selectedUnitTypeId, (selectedReacordId || -1));
        }

     
    }, [selectedStartDate, selectedEndDate, props.recordId])

    

    const getEpisodes=(startDate, endDate, campaignOrAdvertiserId, campaignUnitTypeId, campaignUnitInstructionId )=>{
        GetEpisodesByStartDateAndEndDate(startDate, endDate, campaignOrAdvertiserId, campaignUnitTypeId, campaignUnitInstructionId).then(data => {
            var episodeData = data.map(function(episode,k){
                return {label:episode.episodeName, value: episode.gameId.toString()};
            });
            console.log(episodeData);
            setEpisodes(episodeData);
            if(flag == 1){
                setSelectedEpisodes(null);
                let data = CampaignUnitInstructions;
                data.episode = "";            
                setCampaignUnitInstructions(data);
            }else{
                setFlag(1);
            }
        });
    };

    const validate = () => {
        let errorFound = false;
        CampaignUnitInstructions.Instructions = CampaignUnitInstructions.Instructions.trim();
        if (!CampaignUnitInstructions.startDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Start Date"));
            errorFound = true;
        }
        if (!CampaignUnitInstructions.endDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","End Date"));
            errorFound = true;
        }
        if (!CampaignUnitInstructions.unitType) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Unit Type"));
            errorFound = true;
        }
        if (!CampaignUnitInstructions.Instructions) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Instructions"));
            errorFound = true;
        }
        return errorFound;
    }

    const setStartDate = (value) => {
        let data = CampaignUnitInstructions;
        data.startDate = Helper.FormatDate(value);
        setSelectedStartDate(Helper.FormatDate(value));
        setCampaignUnitInstructions(data);
    }

    const setEndDate = (value) => {
        let data = CampaignUnitInstructions;
        data.endDate = Helper.FormatDate(value);
        setSelectedEndDate(Helper.FormatDate(value));
        setCampaignUnitInstructions(data);
    }


    const handleBlur = (value) => {
        let data = CampaignUnitInstructions;
        data.Instructions = value;
        setSelectedInstructions(value)
        setCampaignUnitInstructions(data);
    }

    const handleChange = (name, value) => {
        let data = CampaignUnitInstructions;
        data[name] = value;
        if(name == 'episodes'){            
            setSelectedEpisodes(value.label);
        }
        if(name == 'unitType'){
            setSelectedUnitType(value.label);
            setSelectedUnitTypeId(value.value);
            //need to load episode based on unit type
            getEpisodes(selectedStartDate, selectedEndDate, props.recordId, value.value, (selectedReacordId || -1));
        }
        setCampaignUnitInstructions(data);
    }

    const handleFileNameChange = (file) => {
        setSelectedFile(file.name);
        let data = CampaignUnitInstructions;
        data.fileDetails = file;
        setCampaignUnitInstructions(data);
    }

    const handleSubmit = () => {
        let errorfound = validate();
        if (!errorfound) {
            setShowLoading(true);
            setOpenBackdrop(true);
            //uploadFileToBlob(CampaignUnitInstructions.fileDetails);

            let formData = new FormData();
            formData.append('id', selectedReacordId || 0);
            formData.append('CampaignID', props.recordId);
            formData.append('GameID', CampaignUnitInstructions.episodes === undefined? null : CampaignUnitInstructions.episodes?.value.toString());
            formData.append('UnitTypeID', CampaignUnitInstructions.unitType.value);
            formData.append('UnitInstructions', CampaignUnitInstructions.Instructions);
            formData.append('StartDate', CampaignUnitInstructions.startDate);
            formData.append('EndDate', CampaignUnitInstructions.endDate);
            if (CampaignUnitInstructions.fileDetails) {
                formData.append('ImageFile', CampaignUnitInstructions.fileDetails);
            }
            formData.append('User', username);
            AddUpdateCampignUnit(formData).then(data => {
                if (data) {
                    notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
                    setCampaignUnitInstructions({
                        startDate: null, endDate: null, episode: "", Instructions: "", unitType: "", fileDetails: ""
                    });
                    setShowForm(false);
                    setShowLoading(false);
                    setOpenBackdrop(false);
                    setFlag(0);
                    resetForm();

                    getCampaignUnitList();
                    if (props.refreshCampaignList) {
                        props.refreshCampaignList();
                    }
                }
            }).catch(err => {
                setShowLoading(false);
                setOpenBackdrop(false);
                console.log(err);
            });
        }
    }

    const getCampaignUnitList = () => {
        setShowLoading(true);
        setOpenBackdrop(true);
        GetCampaignUnitList(props.recordId).then((data) => {
            if (data) {
                setCampaignUnitInstructionsList(data);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
        })
    }

    const handleEdit = (data, name) => {
        let dataToEdit = {};
        setSelectedReacordId(data.id);
        dataToEdit["unitType"] = { value: data.unitTypeID, label: data.unitTypeName };
        dataToEdit["episodes"] = { value: data.gameID, label: data.episodeName };
        dataToEdit["Instructions"] = data.unitInstructions;
        dataToEdit["startDate"] = Helper.FormatDate(data.startDate);
        dataToEdit["endDate"] = Helper.FormatDate(data.endDate);
        setCampaignUnitInstructions(dataToEdit);
        setSelectedFile(data.fileName);
        setSelectedEpisodes(data.episodeName);
        setSelectedUnitType(data.unitTypeName);
        setSelectedUnitTypeId(data.unitTypeID);
        setSelectedStartDate(Helper.FormatDate(data.startDate));
        setSelectedEndDate(Helper.FormatDate(data.endDate));
        setSelectedInstructions(data.unitInstructions);
        setShowForm(true);
    }

    const handleAdd = (id, name) => {
        setShowForm(true);
        setSelectedStartDate(Helper.FormatDate(props.selectedCampaignData.startDate))
        setSelectedEndDate(Helper.FormatDate(props.selectedCampaignData.endDate))
        let data = {
            startDate: Helper.FormatDate(props.selectedCampaignData.startDate), endDate: Helper.FormatDate(props.selectedCampaignData.endDate), episode: "", Instructions: "", unitType: "", fileDetails: ""
        }
        setCampaignUnitInstructions(data);
        // resetForm();
    }

  

    const handleClose = () => {
        setShowForm(false);
        setCampaignUnitInstructions({
            startDate: null, endDate: null, episode: "", Instructions: "", unitType: "", fileDetails: ""
        });
        // setShowForm(false);
        resetForm();
    }

    const handleReport = ()=>{
        GetReportUrl("ReportUrls", "campaignUnitInstructionsUrl").then(data => {
           
            setReportUrl(data);

        }).catch(err => {
            console.log(err);
        })
    }

    const resetForm = () => {
        setSelectedReacordId("")
        setSelectedUnitType(null);
        setSelectedUnitTypeId(-1);
        setSelectedEpisodes(null);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setSelectedInstructions("");
        setSelectedFile("");
        setFlag(0);
        setEpisodes([]);
    }

    const getCampaignUnitType = () => {
        GetLookupById(AppConstants.LOOKUP_VALUE.Campaign_Unit_Type).then((data) => {
            let cList = [];
            if (data) {
                data.map(item => {
                    cList.push({ label: item.lookupText, value: item.lookupId });
                });
                setUnitType(cList);
            }
        }).catch(err => console.log(err))

    }

    React.useEffect(() => {
        if (props.recordId) {
            getCampaignUnitType();
            getCampaignUnitList();
            setShowForm(false);
            if(selectedStartDate && selectedEndDate){
                handleReport()      
             }
          
        }
    }, [props.recordId])

  


  

    return (
        <Paper elevation={0}>
            <ToastContainer autoClose={3000} />
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader icon={"campaignUnit"} hideExpendIcon={true}
                            showIcon={true} hideCheckbox={true}
                            headerText="Campaign Unit Instructions">
                            {
                                props.showCloseIcon && <Box display="flex">
                                    <IconButton size="small" onClick={props.handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            }
                        </GridHeader>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                {!showForm && <Box position={"relative"}>
                    <Box className={CampaignUnitInstructionsList.length > 0 ? showForm
                        ? classes.contentHeightWithForm : classes.contentHeight : classes.minContentHeight} >
                        {
                            CampaignUnitInstructionsList.length > 0
                            && CampaignUnitInstructionsList.map((ele, index) => {
                                return <CampaignUnitUI selectedReacordId={selectedReacordId} handleEdit={handleEdit} data={ele} index={index} />

                            })
                        }

                        {
                            CampaignUnitInstructionsList.length === 0 &&
                            <Typography py={1} px={2} component='p' variant="body2">No record found.</Typography>
                        }

                        <Fab size="small" color="primary" className={classes.fabButton} aria-label="add" onClick={() => handleAdd(0, "add")}>
                            <AddIcon />
                        </Fab>
                    </Box>
                   
                </Box>
                }

                {showForm && <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.setMargin}>
                    <Grid container spacing={1.25}>
                        <Grid item xs={8}>
                            <DateRangePicker
                                startDate={selectedStartDate}
                                endDate={selectedEndDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Dropdown name="unitType" handleChange={handleChange} value={selectedUnitType}
                                size="small" id="unitType" variant="outlined"
                                showLabel={true} lbldropdown="Unit Type" ddData={unitType} />
                        </Grid>
                        <Grid item xs={8}>
                            <Dropdown name="episodes" handleChange={handleChange} value={selectedEpisodes}
                                size="small" id="episodes" variant="outlined"
                                showLabel={true} lbldropdown="Episodes" ddData={episodes} />
                        </Grid>
                        <Grid item xs={8}>
                            <TextboxField lblName="Instructions" textboxData={selectedInstructions}
                                size="small" fullWidth multiline
                                maxRows={3}
                                type="text" handleBlur={handleBlur} /> 
                        </Grid>
                        <Grid item xs={8}>
                            <UploadImage handleFileNameChange={handleFileNameChange} />
                            {selectedFile && <Typography variant="subtitle2">File: {selectedFile}</Typography>}
                        </Grid>
                    </Grid>
                    <Grid container xs={12} justifyContent="flex-end">
                        <Button onClick={handleClose} color="secondary" size='small'
                            sx={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" size='small'
                            color="primary" sx={{ marginRight: '8px' }}>
                            Save
                        </Button>
                        <Button onClick={handleReport} variant="contained" size='small'
                            color="primary" sx={{ marginRight: '8px' }}>
                            Refresh Report
                        </Button>
                    </Grid>
                    <CampaignUnitReportViewer hideExpandIcon={true} leagueId={leagueId} url={reportUrl} campaignId={props.recordId}
                         startDate={selectedStartDate} endDate={selectedEndDate}
                                />
                </Box>}
               
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

CampaignUnitInstructions.displayName = "CampaignUnitInstructions";
export default CampaignUnitInstructions;