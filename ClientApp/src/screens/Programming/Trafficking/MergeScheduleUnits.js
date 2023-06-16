//Call API common.services -> GetUnitSizes method to get all the sizes.
//Schedule contains the UnitTypeId
//Merge should not exceed the maximum value of the Unit Sizes
import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Container, Grid, Typography } from "@mui/material";
import { toast } from "react-toastify";

import { GetUnitSizes } from '../../../services/common.service';
import { MergeScheduleUnits as MergeScheduleUnitsAPI } from '../../../services/planning.service';

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }

const MergeScheduleUnits = (props) => {
    const [unitSizesData, setUnitSizesData] = useState([]);
    const [selectedScheduleUnits, setSelectedScheduleUnits] = useState([]);

    useEffect(() => {
        if (props.Schedule) {
            GetUnitSizes(props.Schedule.unitTypeId).then(data => {
                if (data.length > 0)
                    setUnitSizesData(data);
            }).catch(err => {
                console.log(err);
            })

            setSelectedScheduleUnits([{ scheduleAdUnitId: props.Schedule.scheduleAdUnitId, Size: props.Schedule.unitSize }]);
        }
    }, [props.Schedule]);

    const handleClose = () => {
        props.handleClose();
    }

    const handleSave = () => {
        let finalSize = selectedScheduleUnits.map(unit => parseInt(unit.Size)).reduce((prev, curr) => prev + curr, 0);
        let isUnitSizeThere = unitSizesData.find(x => parseInt(x.unitSize) === finalSize);
        if (!isUnitSizeThere) {
            let availSizes = unitSizesData.map(x => parseInt(x.unitSize)).join();
            notifyWarning('Unit Size not exist. Available unit Sizes are ' + availSizes);
            return false;
        }

        let obj = {
            ScheduleUnitIds: selectedScheduleUnits.map(unit => unit.scheduleAdUnitId).join(),
            UnitTypeId: props.Schedule.unitTypeId,
            UnitSizeId: isUnitSizeThere.id,
            UnitCostTypeId: props.Schedule.unitCostTypeId
        }

        //call API
        MergeScheduleUnitsAPI(obj).then(data => {
            notifySuccess('Selected Units are merged successfully');
            props.handleSave();
        }).catch(err => {
            console.log(err);
        })
    }

    const isSelected = (unitId)=>{
        return selectedScheduleUnits.map(x => x.scheduleAdUnitId).indexOf(unitId) !== -1
    }

    const handleChange =(e, unit)=>{
        let unitIds = [...selectedScheduleUnits];
        if (!e.target.checked && selectedScheduleUnits.map(x => x.scheduleAdUnitId).indexOf(unit.scheduleAdUnitId) !== -1){
            let index = unitIds.findIndex(y => y.scheduleAdUnitId === unit.scheduleAdUnitId);
            unitIds.splice(index, 1);
        }
        else if (e.target.checked){
            unitIds.push({ scheduleAdUnitId: unit.scheduleAdUnitId , Size : unit.unitSize});
        }

        setSelectedScheduleUnits(unitIds);
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Grid container my={2}>
                <Grid item xs={12} mb={1.5} display="flex">
                    <Typography color="primary" variant="h6">Merge Cells</Typography>
                </Grid>
                <Grid item xs={2} mb={1.5}>
                    <Typography color="default" variant="h6">{props.Schedule?.unitSize} Sec</Typography>
                </Grid>
                <Grid item xs={4} mb={1.5}>
                    <Typography color="default" variant="h6">{props.Schedule?.unitTypeName}</Typography>
                </Grid>
                <Grid item xs={6} mb={1.5}>
                    <Typography color="default" variant="h6">{props.Schedule?.planName}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1.5} ml={2} mr={2}>
                        <Grid item xs={1} bgcolor="#d3d3d3"></Grid>
                        <Grid item xs={6} bgcolor="#d3d3d3">
                            <Typography variant="body2">Campaign/Advertiser</Typography>
                        </Grid>
                        <Grid item xs={2} bgcolor="#d3d3d3">
                            <Typography variant="body2">Unit Size</Typography>
                        </Grid>
                        <Grid item xs={3} bgcolor="#d3d3d3">
                            <Typography variant="body2">Unit Type</Typography>
                        </Grid>
                        {props.SameTypeUnits.length >0 && props.SameTypeUnits.map(unit => {
                            return (<>
                                <Grid item xs={1}>
                                    <Checkbox checked={isSelected(unit.scheduleAdUnitId)} size="small"
                                        disabled={unit.scheduleAdUnitId === props.Schedule.scheduleAdUnitId}
                                        onChange={(e) => handleChange(e, unit)} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">{unit.campaignOrAdvertiserName ?? '-'}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="body2">{unit.unitSize}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{unit.unitTypeName}</Typography>
                                </Grid>
                            </>)
                        })}
                        <Grid item xs={1}></Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Total</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body2">{selectedScheduleUnits.map(unit => parseInt(unit.Size)).reduce((prev, curr) => prev + curr, 0)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} pb={1} pt={3}>
                    <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                        <Button sx={{ textTransform: "none" }} onClick={handleClose} color="secondary">{'Cancel'}</Button>
                        <Button sx={{ textTransform: "none", marginLeft: "15px" }} onClick={handleSave} color="primary" variant="contained">{'Apply'}</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default MergeScheduleUnits;