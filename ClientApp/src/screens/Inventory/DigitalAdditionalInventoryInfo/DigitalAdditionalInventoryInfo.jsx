import React, { useState, useEffect, useContext } from 'react';
import Helper from '../../../common/Helper';
import * as AppConstants from '../../../common/AppConstants';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import { ToastContainer, toast } from "react-toastify";
import { Box, Paper, Grid, IconButton, Button } from '@mui/material';
import { FormControl, Radio, RadioGroup, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TextField } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AppDataContext from '../../../common/AppContext';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import TvIcon from '@mui/icons-material/Tv';
import { SaveDigitalAdditionalInventoryInfo } from "../../../services/inventory.service";
import validator from 'validator';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';


const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 178px)',
        overflowY: 'auto',
    },
    alignCenter: {
        alignItems: 'center',
    },
    tableContainer: {
        '& .MuiTable-root': {
            '& .MuiTableRow-root': {
                '& .MuiTableCell-head': {
                    background: '#f8f8f8',
                    color: '#464e5b',
                },
            },
        },
    },
}));
function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
function notifyError() { toast.error("Opps there was an error. Please retry..!") }

const DigitalAdditionalInventoryInfo = (props) => {
    let rows = props.digitalAssetAdUnitMappingDetails?.digitalAssetAdUnitMapping ? props.digitalAssetAdUnitMappingDetails?.digitalAssetAdUnitMapping : [];
    let adunitUniqueSizes = props.digitalAssetAdUnitMappingDetails?.adunitUniqueSizes ? props.digitalAssetAdUnitMappingDetails?.adunitUniqueSizes : "";
    const classes = useStyles();

    const [GAMAdServed, setGAMAdServed] = useState(AppConstants.Inventory.Yes);
    const [type, setType] = useState(AppConstants.Inventory.App);
    const [notes, setNotes] = useState("");
   // const [adUnitSizes, setAdUnitSizes] = useState(AppConstants.Inventory.AdUnitSizes);
    const [siteURL, setSiteURL] = useState("");
    const [digiAddInvInfoData, setDigiAddInvInfoData] = useState(props.digiAddInvInfoData ? props.digiAddInvInfoData : {});
    const [insertedDigitalInvInfoId, setInsertedDigitalInvInfoId] = useState();
    const { username, userId } = useContext(AppDataContext);
    const [typeData, setTypeData] = useState([]);
    const [gamServerdData, setGamServedData] = useState([]);

    useEffect(() => {

        if (props.digiAddInvInfoData?.type) {
            var data = props.digiAddInvInfoData?.type;
            if (data == 'Both') {
                data = "App,Web";
            }
            var splitData = data.split(',');
            setTypeData(splitData);
        }
        else {
            setTypeData(['Web']);
        }
     
    }, [props.digiAddInvInfoData])


    useEffect(() => {

        if (props.digiAddInvInfoData)
            setDigiAddInvInfoData(props.digiAddInvInfoData)
        else
            setDigiAddInvInfoData({
                'notes': '',
                'siteURL': ''
            })
    }, [props.additionalDealInfoData])

    const handleClose = () => {
        if (props.handleClose) {
            props.handleClose();
        }
    }
    const handleGAMRadioClick = (event) => {
        let DigitalAddInvInfo = { ...digiAddInvInfoData };
        DigitalAddInvInfo['isGamServed'] = event.target.value;
        setGamServedData(event.target.value);
        setDigiAddInvInfoData(DigitalAddInvInfo);
        //setGAMAdServed(event.target.name);
    }
    const handleTypeCheckboxClick = (event) => {
        let DigitalAddInvInfo = { ...digiAddInvInfoData };
        DigitalAddInvInfo['type'] = event.target.value;
        setDigiAddInvInfoData(DigitalAddInvInfo);
        var selectedTypeData = typeData;
        var selectedValue = event.target.value;
        if (selectedTypeData.indexOf(selectedValue) == -1) {
            selectedTypeData.push(selectedValue);
        } else {
            selectedTypeData.splice(selectedTypeData.indexOf(selectedValue), 1);
        }
        setTypeData(selectedTypeData);
        
    }
    const handleNotesChange = (event) => {
        let DigitalAddInvInfo = { ...digiAddInvInfoData };
        DigitalAddInvInfo['notes'] = event.target.value;
        setDigiAddInvInfoData(DigitalAddInvInfo);
    }
    const handleSiteURLChange = (event) => {
        let DigitalAddInvInfo = { ...digiAddInvInfoData };
        DigitalAddInvInfo['siteURL'] = event.target.value;
        setDigiAddInvInfoData(DigitalAddInvInfo);
    }

    const validate = () => {
        let digiInvInfoErr = false;

            if (digiAddInvInfoData.siteURL.length > 0) {
            if (!validator.isURL(digiAddInvInfoData.siteURL)) {
                notifyWarning('SiteURL is Not Valid URL')
                digiInvInfoErr = true;
            }
        }
        return digiInvInfoErr;
    }
    const handleSave = () => {
        let isValid = validate();
        if (isValid) {
            return false;
        } else {
            digiAddInvInfoData.user = username;
            if (props.digiAddInvInfoData?.id != undefined) {

                digiAddInvInfoData.id = props.digiAddInvInfoData.id;
            }
            else {
                if (insertedDigitalInvInfoId != undefined) {
                    digiAddInvInfoData.id = insertedDigitalInvInfoId;
                }

                else {
                    digiAddInvInfoData.id = 0;
                }

            }

            let dbDigiAddInvInfoData =
            {
                "Id": digiAddInvInfoData.id,
                "InventoryId": props.InventoryId,
                "Type": typeData.length == 2 ? 'Both' : typeData.join(),
                "SiteURL": digiAddInvInfoData.siteURL,
                "IsGamServed": digiAddInvInfoData?.isGamServed ? digiAddInvInfoData?.isGamServed : "Y",
                "UniqueSizes": adunitUniqueSizes,
                "Notes": digiAddInvInfoData.notes,
                "User": digiAddInvInfoData.user

            }
            SaveDigitalAdditionalInventoryInfo(dbDigiAddInvInfoData).then(res => {
                if (res) {
                    setInsertedDigitalInvInfoId(res)
                    notifySuccess('Data saved successfully..!')
                }
                if (props.successClose) {
                    props.successClose();
                }
            }).catch(err => {
                console.log("Error => ", err);
                return false;
            });


        }

    }

    const isTypeChecked = (val) => {
        var type = typeData;
        console.log(typeData);
        if (type.indexOf(val) > -1) {
            return true
        }
        return false;
    }


    return (
        <Paper elevation={0}>
            <ToastContainer autoClose={3000} />
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader hideExpendIcon={props.hideExpendIcon} fullwidth={true} showIcon={true} icon={"deal"} hideCheckbox={true} headerText="Additional Inventory Info">
                            {props.showCloseIcon && <Box display="flex">
                                <IconButton  href="#rowFocus" size="small" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>}
                        </GridHeader>
                    </Box>
                </Grid>

            </Grid>
            <Box className={classes.contentHeight} display="flex" flexDirection="column" justifyContent="space-between" p={1.5} >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Box display="flex">
                            <Typography mr={2} variant="subtitle2">Asset: </Typography>
                            <Typography variant="subtitle2" >{props.ProgramName ? props.ProgramName : ""}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl>
                            <FormGroup row className={classes.alignCenter}
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={digiAddInvInfoData?.type}
                                onChange={handleTypeCheckboxClick}
                            >
                                <Typography variant="subtitle2" mr={2}>Type: </Typography>
                                <FormControlLabel name="app" value="App" control={<Checkbox defaultChecked size="small" checked={isTypeChecked("App")} />} label="App" />
                                <FormControlLabel name="web" value="Web" control={<Checkbox size='small' checked={isTypeChecked("Web")} />} label="Web" />

                            </FormGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Site URL"
                            multiline
                            rows={1}
                            onChange={handleSiteURLChange}
                            fullWidth
                            variant="outlined"
                            value={digiAddInvInfoData?.siteURL}
                            name="siteUrl"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <RadioGroup row className={classes.alignCenter}
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value='Y'
                                onChange={handleGAMRadioClick}
                            >
                                <Typography variant="subtitle2" mr={2}>GAM Ad Served: </Typography>
                                <FormControlLabel name="yes" value="Y" control={<Radio size='small' checked={digiAddInvInfoData.isGamServed ? (digiAddInvInfoData.isGamServed == "Y") : true} />} label="Yes" />
                                <FormControlLabel name="no" value="N" control={<Radio size='small' checked={digiAddInvInfoData.isGamServed == "N"} />} label="No" />


                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box my={1.5}>
                            <TableContainer square elevation={0} component={Paper} className={classes.tableContainer}>
                                <Table stickyHeader size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Unit Id</TableCell>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Unit Size</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.length > 0 && rows.map((val, key) => {
                                            return (
                                                <TableRow
                                                    key={key}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell>{val.adUnitId}</TableCell>
                                                    <TableCell>{val.code}</TableCell>
                                                    <TableCell>{val.sizes}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                       
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" mb={1}>
                            <Typography variant="subtitle2" mr={2}>Ad Units Sizes: </Typography>
                            <Typography variant="subtitle2">{adunitUniqueSizes}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Notes"
                            multiline
                            rows={1}
                            onChange={handleNotesChange}
                            fullWidth
                            variant="outlined"
                            value={digiAddInvInfoData?.notes}
                            name="Notes"
                            size='small'
                        />
                    </Grid>
                </Grid>
                <Box component="div" mt={2}>
                    <Grid container xs={12} justifyContent="flex-end" >
                        <Button onClick={props.handleClose} color="secondary" size='small' sx={{ marginRight: '8px' }}>Cancel</Button>
                        <Button variant="contained" size='small' color="primary" onClick={handleSave}>Save</Button>

                    </Grid>
                </Box>
            </Box>
        </Paper>

    );
}

DigitalAdditionalInventoryInfo.displayName = "DigitalAdditionalInventoryInfo";
export default DigitalAdditionalInventoryInfo;