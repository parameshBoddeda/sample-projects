import React, { useState } from "react";
import { Box, Grid, IconButton, Button, Typography, Divider } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Helper from '../../../common/Helper';
import APIURLConstants from '../../../common/ApiURLConstants';

const useStyles = makeStyles(theme => ({
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
    },
}));
const CampaignUnitUI = (props) => {
    const classes = useStyles();
    const ele = props.data;
    const index = props.index;

    const handleEdit = (ele, name) => {
        props.handleEdit(ele, name)
    }

    const handleImageClick = (path)=>{
        return window.location.protocol +"//"+ window.location.hostname + (window.location.port ? ":" + window.location.port : '') + "/InsImages/" + path;
    }

    const downloadFile = (record) => {
        let url = APIURLConstants.DOWNLOAD_INSTRUCTION_FILE(record.campaignId, record.id);
        
        fetch(url,
        {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
        }).then(response => response.blob()).then(response =>  {
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(response);
            link.download = record.fileName;
            link.click();    
        })
    }

    return (
        <>
        <Grid key={`grid-${index}`}>
            <Box px={1}>
                <Grid container>
                    <Grid item xs={11.5}>
                        <Grid container spacing={1} marginTop={0}>
                            <Grid item xs={3.5}>
                                <Box display="flex" flexDirection="column">
                                    <Box display="flex" alignItems="center">
                                        <Box component="div" display="flex" flexDirection="column">
                                            <Typography variant="caption">Start Date</Typography>
                                            <Typography variant="subtitle2">
                                                {Helper.FormatDate(ele.startDate)}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" flexDirection="column">
                                            <Box mr={.5} ml={.5}>|</Box>
                                            <Box mr={.5} ml={.5}>|</Box>
                                        </Box>
                                        <Box component="div" display="flex" flexDirection="column">
                                            <Typography variant="caption">End Date</Typography>
                                            <Typography variant="subtitle2">
                                                {Helper.FormatDate(ele.endDate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Episode Name</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2">{ele.episodeName}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Unit Type</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2">{ele.unitTypeName}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Instructions</Typography>
                                    </Box>
                                    <Box component="div" >
                                        <Typography variant="subtitle2">{ele.unitInstructions}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box display="flex" flexDirection="column">
                                    <Box component="div">
                                        <Typography variant="caption">Graphics</Typography>
                                    </Box>
                                    <Box component="div" >
                                            {ele.fileName && <a href={handleImageClick(ele.fileName)} target="_blank">{ele.fileName}</a>}
                                            {!ele.fileName && <Typography title={ele.fileName || "-"} noWrap variant="subtitle2">{ele.fileName || "-"}</Typography>}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={.5}>
                        <Box key={`GridAction${index}`} display="flex" flexDirection='column' justifyContent="space-between">

                            <IconButton title="Edit Campaign Unit Instructions" className={`${classes.iconColor} 
                                    ${props.selectedReacordId === ele.id
                                    ? classes.selectedbtn : ''}`} size="small"
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

CampaignUnitUI.displayName = "CampaignUnitUI";
export default CampaignUnitUI;