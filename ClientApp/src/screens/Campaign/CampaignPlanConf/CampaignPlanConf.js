import * as React from 'react';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import CloseIcon from '@mui/icons-material/Close';
import { Box, Paper, Grid, IconButton, Button } from '@mui/material';
import { TextField } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import DateRangePicker from '../../../sharedComponents/PickDateRange/PickDateRange';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import { makeStyles } from '@material-ui/core/styles';
import * as AppLanguage from '../../../common/AppLanguage';

function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles(theme => ({

    customTextBox: {
        minWidth: '66% !important',
    },
}));

const CampaignPlanConf = (props) => {
    const classes = useStyles();
    const [CampaignPlanConf, setCampaignPlanConf] = React.useState({
        mediaPlanName: "", campaignAE: "", status: "", Comments: ""
    });
    const handleCommentChange = (value) => {
        let data = CampaignPlanConf;
        data.Comments = value;
        setCampaignPlanConf(data);
    }

    const handleChange = (name, value) => {
        let data = CampaignPlanConf;
        data[name] = value;
        setCampaignPlanConf(data);
    }

    const handleBlur = (value) => {
        let data = CampaignPlanConf;
        data.mediaPlanName = value;
        setCampaignPlanConf(data);
    }

    const validate = () => {
        let errorFound = false;
        if (!CampaignPlanConf.mediaPlanName) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Media Plan Name"));
            errorFound = true;
        }
        if (!CampaignPlanConf.campaignAE) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Campaign AE"));
            errorFound = true;
        }
        if (!CampaignPlanConf.status) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Status"));
            errorFound = true;
        }
        if (!CampaignPlanConf.Comments) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace("__FieldName__","Comments"));
            errorFound = true;
        }
    }

    const handleSubmit = () => {

        let errorFound = validate();
        if (!errorFound) {

        }

    }

    return (
        <Paper elevation={0}>
            <ToastContainer autoClose={3000} />
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader
                            showIcon={true} icon={"campaignPlanConf"} hideCheckbox={true} 
                            headerText="Campaign Plan Configuration"
                        >
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
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item sm={12}>
                                <TextboxField lblName="Media Plan Name" textboxData={""}
                                    size="small" key={"txtprime"} classList={classes.customTextBox}
                                    type="text" handleBlur={handleBlur} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Dropdown name="campaignAE" handleChange={handleChange} 
                                size="small" id="campaignAE" variant="outlined" showLabel={true} 
                                lbldropdown="CampainAE" ddData={[]} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item sm={8}>
                                <DateRangePicker />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <Dropdown name="status" handleChange={handleChange} 
                                size="small" id="status" variant="outlined" showLabel={true} 
                                lbldropdown="Status" ddData={[]} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Comments"
                                    multiline
                                    rows={3}
                                    onBlur={handleCommentChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box component="div" mt={2}>
                <Grid container xs={12} justifyContent="flex-end">
                    <Button onClick={props.handleClose} color="secondary" size='small' 
                        sx={{ marginRight: '8px' }}>
                            Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" size='small' 
                    sx={{ marginRight: '8px' }} color="primary">
                        Save
                    </Button>
                </Grid>
            </Box>
        </Paper>
    )
}
CampaignPlanConf.displayName = "CampaignPlanConf";
export default CampaignPlanConf;