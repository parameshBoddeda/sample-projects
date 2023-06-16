import React, { useEffect, useState } from "react";
import { Typography, Grid, Container, Button, Box } from "@mui/material";
import { toast } from "react-toastify";

import Dropdown from "../../Dropdown/Dropdown";
import { GetNetworkBreakPositions } from '../../../services/common.service';
import { GetCampaignUnitList } from '../../../services/campaign.service';
import TextboxField from "../../TextboxField/TextboxField";

function notifyWarning(message) { toast.warning(message) }

const BreakPosition = (props)=>{

    const [orgBreakPositionData, setOrgBreakPositionData] = useState([]);
    const [breakPostionData, setBreakPostionData] = useState([]);
    const [selectedBreakPostion, setselectedBreakPostion] = useState(null);
    const [instructionDetails, setInstructionDetails] = useState(null);
    const [comments, setComment] = useState('');

   
    useEffect(() => {

        if (props.Schedule.leagueId && props.Schedule.marketTypeId){
            let obj={};
            if (props.Schedule.unitTypeName.toUpperCase() === 'COURTSIDE SIGNAGE')
                obj = {
                    LeagueId: props.Schedule.marketTypeId !== 112 ? props.Schedule.leagueId : -1,
                    MarketTypeId: props.Schedule.marketTypeId,
                    NetworkId: props.Schedule.marketTypeId !== 112 ? props.Schedule.partnerId : -1,
                    UnitTypeId: props.Schedule.unitTypeId
                }
            else if (props.Schedule.unitTypeName.toUpperCase() !== 'VIRTUAL SIGNAGE')
                obj = {
                    LeagueId: props.Schedule.marketTypeId !== 112 ? props.Schedule.leagueId : -1,
                    MarketTypeId: props.Schedule.marketTypeId,
                    NetworkId: props.Schedule.marketTypeId !== 112 ? props.Schedule.partnerId : -1,
                    UnitTypeId: -1
                }            
            else
                obj = {
                    LeagueId: -1,
                    MarketTypeId: props.Schedule.marketTypeId,
                    NetworkId:  -1,
                    UnitTypeId: props.Schedule.unitTypeId
                }
            
            GetNetworkBreakPositions(obj).then((data) => {
                setOrgBreakPositionData(data);
                let breakPositions = [];
                data.map(item => {
                    breakPositions.push({ label: item.breakPosition, value: item.id, break: item.break, position : item.position });
                });
                setBreakPostionData(breakPositions);
                if (props.Schedule.proposedBreakPosition){
                    let selectVal = breakPositions.find(x => x.value === props.Schedule.proposedBreakPosition);
                    setselectedBreakPostion(selectVal);
                    setComment(props.Schedule?.comments || '');

                }
                if(props.Schedule.comments){
                    setComment(props.Schedule?.comments);
                }
            }).catch(err => console.log(err))
        }        
    }, [props.Schedule]);

    useEffect(()=>{
        if (props.IsCampaignPlanning && props.Schedule && 
            (props.Schedule.unitTypeName === 'Live Read' || props.Schedule.unitTypeName === 'Crawls' || props.Schedule.unitTypeName === 'Crawl'))
        {
            GetCampaignUnitList(props.Schedule.campaignOrAdvertiserId).then(data=>{
                let details = data.find(x => x.unitTypeName === props.Schedule.unitTypeName && ((x.gameID === props.Schedule.gameId) || (x.gameID === props.Schedule?.scheduleId.toString())));
                if(details)
                    setInstructionDetails(details);
            }).catch(err => console.log(err))
        }
    }, [props.IsCampaignPlanning]);

    const handleChange = (value)=>{        
        setselectedBreakPostion(value);
    }

    const handleClose = () =>{
        props.handleClose();
    }

    const handleSave =()=>{
        if(props.Schedule?.unitTypeName.toUpperCase() === 'COURTSIDE SIGNAGE'){
             if(selectedBreakPostion===null&&comments===''){
                notifyWarning('Please enter comment or select break and position.')
                return
             }
           
             if(selectedBreakPostion){
                let obj = orgBreakPositionData.find(x=> x.breakPosition === selectedBreakPostion);
                obj.comments = comments;
                props.handleSave(obj);
                return
             }

             if(comments&&!selectedBreakPostion){
                 let obj={};
                 obj.comments = comments;
                 props.handleSave(obj);
                 return
                 
             }
        }
      if(selectedBreakPostion)
        {
            let obj = orgBreakPositionData.find(x=> x.breakPosition === selectedBreakPostion);
            obj.comments = comments;
            props.handleSave(obj);
        }
        else{
            notifyWarning('Please select break and position.')
        }
    }

    const handleImageClick = (fileName) => {
        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : '') + "/InsImages/" + fileName;
    }

    const handleCommentChange=(value)=>{
        setComment(value);
    }

    return (
        <Container maxWidth={false} disableGutters>
            <Grid container my={2}>
                <Grid item xs={12} mb={1.5} display="flex" >
                    <Typography color="primary" variant="h6">Break &amp; Position</Typography>
                </Grid>
                <Grid item xs={12} mb={1.5} >
                    <Dropdown size="small" id="BreakPostion" 
                        variant="outlined" showLabel={true} 
                        lbldropdown="Break - Position" 
                        value={selectedBreakPostion} 
                        handleSelected={handleChange} ddData={breakPostionData} />
                </Grid>
                {props.IsCampaignPlanning && (props.Schedule?.unitTypeName.toUpperCase() === 'COURTSIDE SIGNAGE') && <Grid item xs={12} mb={1.5}>
                    <TextboxField fullWidth={true} lblName="Comment" multiline={true} size="large" textboxData={comments} handleChange={handleCommentChange}/>
                </Grid>}

                {props.IsCampaignPlanning && instructionDetails && <>
                    <Grid item xs={12} mb={1.5}>
                        <Typography color="primary" variant="subtitle2">Instructions:</Typography>
                    </Grid>
                    <Grid item xs={12} mb={1.5}>
                        <Typography variant="body2">{instructionDetails.unitInstructions}</Typography>
                    </Grid>
                    {instructionDetails.fileName && <Grid item xs={12} mb={1.5}>
                        <a href={handleImageClick(instructionDetails.fileName)} target="_blank">{instructionDetails.fileName}</a>
                    </Grid>}
                </>}
                <Grid item xs={12} pb={1} pt={3}>
                    <Box px={1} display="flex" flex="1" alignItems="center" justifyContent="flex-end">
                        <Button onClick={handleClose} color="secondary">{'Cancel'}</Button>
                        <Button onClick={handleSave} color="primary" variant="contained">{'Save'}</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default BreakPosition;