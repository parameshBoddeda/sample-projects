//Call API common.services -> GetUnitSizes method to get all the sizes.
//Schedule contains the UnitTypeId
//Split unit into multiple should be equal the current

import React, { useEffect, useState } from "react";
import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import { toast } from "react-toastify";

import { GetUnitSizes } from '../../../services/common.service';
import { SplitScheduleUnit as SplitScheduleUnitAPI } from '../../../services/planning.service';
import TextboxField from "../../TextboxField/TextboxField";
import * as AppLanguage from '../../../common/AppLanguage';

function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }

const SplitScheduleUnit = (props) => {
    const [unitSizesData, setUnitSizesData] = useState([]);
    const [enteredCount, setEnteredCount] = useState([]);

    useEffect(() => {
        if (props.Schedule){
            GetUnitSizes(props.Schedule.unitTypeId).then(data => {
                if (data.length > 0)
                    setUnitSizesData(data);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [props.Schedule]);

    const handleClose = () => {
        props.handleClose();
    }

    const handleSave = () => {
        let orgSize = props.Schedule?.unitSize;
        let finalSize = enteredCount.map(size => size.Sumsize).reduce((prev, curr) => prev + curr, 0);
        if(orgSize !== finalSize)
        {
            notifyWarning( AppLanguage.APP_MESSAGE.Split_Unit_Validation.replace('__value__', orgSize));
            return false;
        }

        let objList = [];
        enteredCount.forEach(size => {
            let obj ={
                ScheduleId: props.Schedule.scheduleId,
                ScheduleUnitIds: props.Schedule.scheduleAdUnitId.toString(),
                InventoryId : props.Schedule.inventoryId,
                UnitTypeId : size.UnitTypeId,
                UnitSizeId: size.SizeId,
                UnitCostTypeId: props.Schedule.unitCostTypeId,
                Count : parseInt(size.Count)
            }
            objList.push(obj); 
        })

        //call API
        SplitScheduleUnitAPI(objList).then(data => {
            notifySuccess(AppLanguage.APP_MESSAGE.Split_Schedule_Unit);
            props.handleSave();
        }).catch(err => {
            console.log(err);
        })
    }

    const handleCountChanage = (size, val)=>{
        let countArr = enteredCount;
        countArr[size.unitSize] = {Count : val, Sumsize : val * size.unitSize, UnitTypeId : size.unitTypeId, SizeId : size.id };
        setEnteredCount(countArr);
    }

    const getEnteredCount = (size)=>{
        let countArr = enteredCount;
        let val = countArr[size]?.Count;
        return val ?? 0;
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Grid container my={2}>
                <Grid item xs={12} mb={1.5} display="flex">
                    <Typography color="primary" variant="h6">Split Cell</Typography>
                    <Divider></Divider>
                </Grid>
                <Grid item xs={3} mb={1.5}>
                    <Typography color="default" variant="h6">{props.Schedule?.unitSize} Sec</Typography>
                </Grid>
                <Grid item xs={9} mb={1.5}>
                    <Typography color="default" variant="h6">{props.Schedule?.unitTypeName}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={0.5} ml={2} mr={2}>
                        <Grid item xs={6} bgcolor="#d3d3d3">
                            <Typography variant="body2">Unit Size</Typography>
                        </Grid>
                        <Grid item xs={3} bgcolor="#d3d3d3">
                            <Typography variant="body2">Count</Typography>
                        </Grid>
                        {unitSizesData.filter(x => x.unitSize < props.Schedule?.unitSize).map(size =>{
                            return(<>
                                <Grid item xs={6}>
                                    <Typography variant="body2">{size.unitSize}</Typography> 
                                </Grid>
                                <Grid item xs={3}>
                                    <TextboxField fullWidth size="small" textboxData={()=>getEnteredCount(size.unitSize)} handleChange={(e)=>handleCountChanage(size,e)} />
                                </Grid>
                            </>)
                        })}
                    </Grid>
                </Grid>
                <Grid item xs={12} pb={1} pt={3}>
                    <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                        <Button sx={{ textTransform: "none" }} onClick={handleClose} color="secondary">{'Cancel'}</Button>
                        <Button sx={{ textTransform: "none", marginLeft: "15px" }} onClick={()=>handleSave()} color="primary" variant="contained">{'Apply'}</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SplitScheduleUnit;