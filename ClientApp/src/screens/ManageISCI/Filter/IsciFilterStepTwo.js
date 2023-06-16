import React, { useState, useEffect, useContext } from 'react';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    contentHeight: {
        height: 'calc(100vh - 294px)',
    },
}));

export default function MediaPlanFilterStepTwo(props) {
    const classes = useStyles();
    const [filterName, setFilterName] = React.useState();
    const [description, setDescription] = React.useState("")

    const handleDescriptionChange = (value) => {
        setDescription(value);
        props.setFilterCriteria("description", value);
    }

    const handleFilterName = (value) => {
        setFilterName(value);
        props.setFilterCriteria("name", value);
    }

    useEffect(()=>{
        if(props.filterCriteria){
            setFilterName(props.filterCriteria.name || "" ); 
            setDescription(props.filterCriteria.description || "");
        }    
      }, [props.filterCriteria])

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <TextboxField fullWidth lblName="Filter Name" size="small" textboxData={filterName} handleChange={handleFilterName} />
                </Grid>
                <Grid item xs={9}>
                    <TextboxField fullWidth lblName="Filter Description" size="small" textboxData={description} handleChange={handleDescriptionChange} />
                </Grid>
            </Grid>
        </Box>
    )
}