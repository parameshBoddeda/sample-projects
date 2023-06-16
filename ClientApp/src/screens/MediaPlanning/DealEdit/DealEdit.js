import React, { useState, useEffect, useContext } from 'react';
import Helper from '../../../common/Helper';
import * as AppConstants from '../../../common/AppConstants';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import { ToastContainer, toast } from "react-toastify";
import { Box, Paper, Grid, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DateRangePicker from '../../../sharedComponents/PickDateRange/PickDateRange';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import { TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { SaveAdditionalDealInfo } from './../../../services/planning.service';
import AppDataContext from '../../../common/AppContext';
const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 195px)',
        overflowY: 'auto',
    },
}));
function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
function notifyError() { toast.error("Opps there was an error. Please retry..!") }

const DealEdit = (props) => {
    const classes = useStyles();
    // const [dealData, setDealData] = React.useState({
    //     salesperson: "", billtype: "", billby: "", comment: "", startDate: "", endDate: ""
    // })

    const [dealData, setDealData] = useState(props.additionalDealInfoData ? props.additionalDealInfoData : {});
    const { username, userId } = useContext(AppDataContext);
    const [insertedDealId, setInsertedDealId] = useState();

    useEffect(() => {
 
        if (props.additionalDealInfoData)
            setDealData(props.additionalDealInfoData)
        else
            setDealData({
                'comments': ''
            })
    }, [props.additionalDealInfoData])

    // const [additionalDealInfoData, setadditionalDealInfoData] = useState(props.additionalDealInfoData ? props.additionalDealInfoData : []);

    const handleCommentChange = (event) => {
        let Deal = { ...dealData };
        Deal['comments'] = event.target.value;
        setDealData(Deal);
    }

    const handleBillByChange = (name, value) => {
        let Deal = { ...dealData };
        Deal['billById'] = value.value;
        Deal['billBy'] = value.label;
        setDealData(Deal);
    }
    const handleSoldByChange = (name, value) => {
        let Deal = { ...dealData };
        Deal['soldBy'] = value.label;
        Deal['soldById'] = value.value;
        setDealData(Deal);
    }

    const validate = () => {
        let dealErr = false;

        if (!dealData.billBy) {
            notifyWarning(AppConstants.Deal.billbyId);
            dealErr = true;
        }
        if (!dealData.soldBy) {
            notifyWarning(AppConstants.Deal.soldbyId);
            dealErr = true;
        }
        if (!dealData.comments) {
            notifyWarning(AppConstants.Deal.comments);
            dealErr = true;
        }

        return dealErr;
    }
    const handleSave = () => {
        let isValid = validate();
        if(isValid) {
            return false;
        } else {
            dealData.user = username;
            if (props.additionalDealInfoData?.id != undefined ) {
          
             dealData.id = props.additionalDealInfoData.id;
            }
            else
            {
                if(insertedDealId != undefined)
                {
                    dealData.id = insertedDealId;
                }
                    
                else
                {
                    dealData.id = 0;
                }
                    
            }
            dealData.gmpDealID= props.selectedDealId;
            // console.log("dealData");
            // console.log(dealData);
            let dbAdditionalData = 
            {
                "Id": dealData.id,
                "GMPDealID": dealData.gmpDealID,
                "BillById": dealData.billById,
                "SoldById": dealData.soldById,
                "Comments": dealData.comments,
                "User": dealData.user

            }
            props.showLoading(true);
            props.openBackdrop(true);
            SaveAdditionalDealInfo(dbAdditionalData).then(res => {
                props.showLoading(false);
                props.openBackdrop(false);
                if (res) {
                            setInsertedDealId(res)
                            notifySuccess('Data saved successfully..!')
                        }
                if (props.successClose) {
                    props.successClose();
                }
            }).catch(err => {
                console.log("Error => ", err);
                props.showLoading(false);
                props.openBackdrop(false);
                return false;
                
            });
          
         
        }
     
    }
    return (
        <Paper elevation={0}>
            <ToastContainer autoClose={3000} />
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader hideExpendIcon={props.hideExpendIcon} showIcon={true} icon={"deal"} hideCheckbox={true} headerText="Additional Deal Information">
                        </GridHeader>
                    </Box>
                </Grid>
            </Grid>
            <Box className={classes.contentHeight} display="flex" flexDirection="column" justifyContent="space-between" p={1.5} >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Dropdown size="small" id="billby"
                                    handleChange={handleBillByChange} variant="outlined"
                                    showLabel={true} lbldropdown="Bill By"
                                    ddData={props.billBy ? props.billBy : []}
                                    value={dealData?.billBy}
                                    name="billBy"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Dropdown size="small" id="soldby"
                                    handleChange={handleSoldByChange}
                                    variant="outlined" showLabel={true}
                                    lbldropdown="Sold By"
                                    ddData={props.SoldBy ? props.SoldBy : []}
                                    value={dealData?.soldBy}
                                    name="soldBy"

                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Comments"
                            multiline
                            rows={3}
                            onChange={handleCommentChange}
                            fullWidth
                            variant="outlined"
                            value={dealData?.comments}
                            name="Comments"
                        />
                    </Grid>
                </Grid>
                <Box component="div" mt={2}>
                    <Grid container xs={12} justifyContent="flex-end" >
                        <Button onClick={props.handleClose} color="secondary" size='small' sx={{ marginRight: '8px' }}>Cancel</Button>
                        <Button onClick={handleSave} variant="contained" size='small' color="primary">Save</Button>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}

DealEdit.displayName = "DealEdit";
export default DealEdit;