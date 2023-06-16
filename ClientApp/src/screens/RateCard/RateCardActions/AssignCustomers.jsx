// Global Imports - Start
import React, { useState,} from 'react';
import { Box, IconButton, Grid, Select, MenuItem, InputLabel, FormControl, TextField, Button } from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { makeStyles } from '@material-ui/core/styles';

import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";

// Global Imports - End
// Local Imports - Start


// Local Imports - End
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';

if (typeof window !== "undefined") {
    injectStyle();
}
const useStyles = makeStyles((theme) => ({
    radioGroupPadding: {
        paddingBottom: theme.spacing(1),
    },
    contentHeight: {
        height: 'calc(100vh - 396px)',
        overflowY: 'auto',
    },
    contentHeightOnlyView: {
        height: 'calc(100vh - 338px)',
        overflowY: 'auto',
    },
    containerWidth: {
        width: '100% !important',
        marginLeft: '0 !important',
    },
    Alert: {
        margin: theme.spacing(1),
    },
    tagIcon: {
        color: 'red',
        marginTop: theme.spacing(-0.25),
        marginLeft: theme.spacing(-0.75),
    },
    addIcon: {
        color: 'blue',
    },
    spliUnitHeader: {
        backgroundColor: '#f8f8f8'
    },
    units: {
        height: theme.spacing(6),
        marginTop: theme.spacing(1.5),
    },
    unitGrid: {
        height: theme.spacing(24),
        overflowY: 'scroll'
    },
    actionBox: {
        position: 'absolute',
        bottom: '0px',
        right: '0px',
    }
}));
const AssignCustomer = (props) => {
    const classes = useStyles();

    const [customers, setCustomers] = useState(null);
    const [customerName, setCustomerName] = useState(null);
    const [baseRate, setBaseRate] = useState(null);
    const [discount, setDiscount] = useState(null);
    const [discountRate, setDiscountRate] = useState(null);
    const [validFrom, setValidFrom] = useState(null);

    //Form Input Handlers - Start
    const handleNetworkChange = (e) => { };
    const handleDiscountPercentChange = (e) => { };
    const handleDiscountRateChange = (e) => { };
    const handleBaseRateChange = (e) => { };
    const handleValidFromChange = (e) => { };

    const handleSubmit = (param) => {
        if (param === 'cancel') {
            props.handleClose();
        } else if (param === "submit") {

        }
    }
    //Form Input Handlers - End

    return (
        <>
            <ToastContainer autoClose={3000} />
            <Box p={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box display="flex" flexDirection='row' justifyContent="space-between">
                            <IconButton title={'Assign Customer'} size="small">
                                <PersonAddIcon className={classes.tagIcon} />
                            </IconButton>
                            <GridHeader hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText={'Assign Customer'} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5}>
                <Grid container spacing={2} alignItems="center" className={classes.containerWidth}>
                    <Grid item xs={6}>
                        <Box px={1}>
                            <FormControl fullWidth>
                                <InputLabel id="customers-simple-select-label">Customers</InputLabel>
                                <Select
                                    labelId="customers-simple-select-label"
                                    label="Customers"
                                    size="small"
                                    id="customers-select"
                                    value={customers}
                                    name={customerName}
                                >
                                    {
                                        props.networkData.map((item, i) => {
                                            return (
                                                <MenuItem
                                                    key={item.value}
                                                    id={item.mediaTypeId}
                                                    name={item.label}
                                                    value={item.value}
                                                    data-name={item.label}
                                                    onClick={(e) => {
                                                        handleNetworkChange(e);
                                                    }}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                        <Box px={1}>
                            <FormControl fullWidth>
                                <TextField id="base-rate" size="small" variant="outlined"
                                    type="number" label="Base Rate"
                                    InputProps={{
                                        inputProps: {
                                            max: 1000, min: 1
                                        }
                                    }}
                                    value={baseRate} onChange={handleBaseRateChange} />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <Box px={1}>
                            <FormControl fullWidth>
                                <TextField id="discount%" size="small" variant="outlined"
                                    type="number" label="Discount %"
                                    InputProps={{
                                        inputProps: {
                                            max: 100, min: 1
                                        }
                                    }}
                                    value={discount} onChange={handleDiscountPercentChange} />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box px={1}>
                            <FormControl fullWidth>
                                <TextField id="discount-rate" size="small" variant="outlined"
                                    type="number" label="Discount Rate"
                                    InputProps={{
                                        inputProps: {
                                            max: 100, min: 1
                                        }
                                    }}
                                    value={discountRate} onChange={handleDiscountRateChange} />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3.5}>
                        <Box px={1}>
                            <TextField id="validFrom" size="small" variant="outlined"
                                type="date"
                                value={validFrom} onChange={handleValidFromChange} />
                        </Box>
                    </Grid>

                </Grid>
                <Box component="div" className={classes.actionBox}>
                    <Grid container xs={12} justifyContent="flex-end">
                        <Button color="secondary" onClick={() => handleSubmit('cancel')} size='small' sx={{ marginRight: '8px' }}>Cancel</Button>
                        <Button variant="contained" onClick={() => handleSubmit('submit')} size='small' color="primary">Confirm</Button>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}
export default AssignCustomer;