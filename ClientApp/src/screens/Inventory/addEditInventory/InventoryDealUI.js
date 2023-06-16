import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, IconButton, Button, Typography, Divider } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Helper from '../../../common/Helper';
import { DeleteInventory } from "../../../../src/services/inventory.service";
import ConfrimDialog from "../../../sharedComponents/Dialog/ConfirmDialog";
import { toast } from "react-toastify";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const useStyles = makeStyles(theme => ({
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
    },
}));

function notifyWarning(message) {
    toast.warning(message);
}
function notifySuccess(message) {
    toast.success(message);
}
function notifyError(message) {
    toast.error(message);
}

const InventoryDealUI = (props) => {
    const classes = useStyles();
    const ele = props.data;
    const index = props.index;
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteInventoryId, setDeleteInventoryId] = useState(null);

    const handleEdit = (ele, name) => {
        props.handleEdit(ele, name)
    }

    const handleDialogDeleteCancel = () => {
        setDeleteInventoryId(null);
        setOpenDeleteDialog(false);

    };
    const handleDialogDeleteOpen = (index, _inventoryId) => {
        setDeleteInventoryId(_inventoryId);
        setOpenDeleteDialog(true);
    };
    const handleDeleteInventoryActions = (caller) => {
        let obj = {}
        obj.inventoryId = deleteInventoryId;
        DeleteInventory(obj)
            .then((data) => {
                if (data.status === false) {
                    notifyError("Can not delete inventory");
                    setOpenDeleteDialog(false);
                }
                else {
                    notifySuccess("Inventory deleted successfully");
                    setOpenDeleteDialog(false);
                    props.refreshDealInventoryPage();
                }
                
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            {
                openDeleteDialog ?
                    <ConfrimDialog
                        open={openDeleteDialog}
                        title={"Delete Inventory"}
                        description={
                            "Are you sure, You want to delete Inventory?"
                        }
                        ok={"OK"}
                        cancel={"Cancel"}
                        handleDialogOk={() =>
                            handleDeleteInventoryActions("deleteInventory")
                        }
                        handleDialogCancel={handleDialogDeleteCancel}
                    ></ConfrimDialog>
                    : ""
            }
        <Grid key={`grid-${index}`}>
            <Box px={1}>
                <Grid container>
                    <Grid item xs={11}>
                        <Grid container spacing={1} marginTop={0}>
                            <Grid item xs={2.75}>
                                    <Box display="flex" alignItems="center" pr={1}>
                                        <Box component="div" display="flex" flexDirection="column" width="50%">
                                            <Typography variant="caption">Region</Typography>
                                            <Typography variant="subtitle2" noWrap title={ele.regionName}>
                                                {ele.regionName || "-"}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" flexDirection="column">
                                            <Box mr={.5} ml={.5}>|</Box>
                                            <Box mr={.5} ml={.5}>|</Box>
                                        </Box>
                                        <Box component="div" display="flex" flexDirection="column"  width="50%">
                                            <Typography variant="caption">Country</Typography>
                                            <Typography variant="subtitle2" noWrap title={ele.countryName}>
                                                {ele.countryName || "-"}
                                            </Typography>
                                        </Box>
                                    </Box>
                            </Grid>
                            <Grid item xs={1.75}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Media Type</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap title={ele.mediaTypeName}>{ele.mediaTypeName || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={2.25}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Network</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap title={ele.networkName}>{ele.networkName || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={2.25}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Asset</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap title={ele.assetName}>{ele.assetName || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={3}>
                                {ele.mediaTypeParentId === 100 && (ele.mediaTypeId === 101 || ele.mediaTypeId === 102 || ele.mediaTypeId === 103) ? "" :
                                <Box display="flex" alignItems="center">
                                    <Box component="div" display="flex" flexDirection="column">
                                        <Typography variant="caption">Quantity From</Typography>
                                        <Typography variant="subtitle2" noWrap>
                                            {ele.quantityFrom || "-"}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column">
                                        <Box mr={.5} ml={.5}>|</Box>
                                        <Box mr={.5} ml={.5}>|</Box>
                                    </Box>
                                    <Box component="div" display="flex" flexDirection="column">
                                        <Typography variant="caption">To</Typography>
                                        <Typography variant="subtitle2" noWrap>
                                            {ele.quantityTo || "-"}
                                        </Typography>
                                    </Box>
                                </Box>}
                            </Grid>
                            <Grid item xs={1}>
                                <Box display="flex" alignItems="center">
                                    <Box component="div" display="flex" flexDirection="column">
                                        <Typography variant="caption">Year</Typography>
                                        <Typography variant="subtitle2" noWrap>
                                            {ele.seasonYear}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={2.75}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Sales Unit Count</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap>{ele.salesUnit || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={1.75}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Sales Right</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap title={ele.salesUnitDescText}>{ele.salesUnitDescText || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={1.75}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Ins Count</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap>{ele.institutionalUnit || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Ins Right</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap title={ele.institutionalUnitDescText}>{ele.institutionalUnitDescText || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            {ele.instAvgImpression ? <Grid item xs={2.75}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Available Impressions</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2" noWrap>{ele.instAvgImpression || "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid> : ""
                            }

                        </Grid>
                        </Grid>
                        <Grid item xs={.5}>
                            <Box key={`GridAction${index}`} display="flex" flexDirection='column' justifyContent="space-between">
                                {ele.isInUse === false ? 
                                <IconButton title="Delete Inventory" size="small"
                                    onClick={() => handleDialogDeleteOpen(index, ele.inventoryId)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                                 : <></>}
                            </Box>
                        </Grid>
                    <Grid item xs={.5}>
                        <Box key={`GridAction${index}`} display="flex" flexDirection='column' justifyContent="space-between">

                            <IconButton title="Edit"  size="small"
                                onClick={() => handleEdit(ele, "edit")}>
                                <CreateOutlinedIcon />
                            </IconButton>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        <Divider sx={{ width: '100%' }} />
        </>
    )
}

InventoryDealUI.displayName = "InventoryDealUI";
export default InventoryDealUI;