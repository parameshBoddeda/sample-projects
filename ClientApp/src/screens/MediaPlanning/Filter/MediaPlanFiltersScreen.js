import  React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FiltersStepOne from './MediaPlanFilterStepOne';
import FiltersStepTwo from './MediaPlanFilterStepTwo';
import NonLinearStepper from '../../../sharedComponents/Stepper/NonLinearStepper';
import DialogTitle from '../../../sharedComponents/dialogBox/DialogTitle.js';
import { Box } from '@mui/material';
import { AddUpdateUserPreferences } from '../../../services/common.service';

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        position: 'relative',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
    },
}));

const stepsTotalSteps = ['Select Market Type, Customer and Year', 'Save Filters Optional'];
const MediaPlanFiltersScreen = (props) => {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const [filterCriteria, setFilterCriteria] = React.useState(props.Criteria);;
    const handleStep = (nextStep) => {
        if(
            filterCriteria.customer.length < 1 &&
            !filterCriteria.year &&
            !filterCriteria.marketType
        ){
            props.notifyWarning('Please select atleast one criteria.');
            return false;
        }
        setStep(nextStep)
    }
    const handleClose=()=>{
        props.handleFilterCloseClick(false);
    }

    const handleApply=()=>{
        if(
            filterCriteria.customer.length < 1 &&
            !filterCriteria.year &&
            !filterCriteria.marketType
        ){
            props.notifyWarning('Please select atleast one criteria.');
            return false;
        }
        props.handleCriteriaChange(filterCriteria, false);
    }

    const handleSave=()=>{
        saveSearchCriteria();              
    }

    const saveSearchCriteria = () => {
        if(!filterCriteria.name){
            props.notifyWarning('Name is a required field.');
            return false;
        }

        if(
            filterCriteria.customer.length < 1 &&
            !filterCriteria.year &&
            !filterCriteria.marketType
        ){
            props.notifyWarning('Please select atleast one criteria.');
            return false;
        }

        props.showLoading(true);
        props.openBackdrop(true);
        let obj ={
            Id: props.Criteria.Id,
            LeagueId: filterCriteria.LeagueId,
            TypeId: filterCriteria.TypeId,
            PrefererJson: JSON.stringify({
                customer: filterCriteria.customer,
                year: filterCriteria.year,
                marketType: filterCriteria.marketType
            }),            
            Name : filterCriteria.name,
            Description : filterCriteria.description,
            IsDefault : true,
            User : filterCriteria.user
        }

        AddUpdateUserPreferences(obj).then((data)=>{
            if(data.message) {
                props.notifyWarning('Server error.');
            } else {
                let test = data;
                props.handleCriteriaChange(filterCriteria, true);  
                props.notifySuccess('Filter Saved !');
            }
        }).catch((error) =>{
            props.showLoading(false);
            props.openBackdrop(false);
            console.log(error);
        });
    }

    const handleCriteria=(name, value)=>{
        const tempFilterCriteria = filterCriteria || {};
        tempFilterCriteria[name] = value
        setFilterCriteria(tempFilterCriteria);
    }

    const handleInventoryDealSave = () => {
        
    }

    return (
        <Box p={1}>
            <Box className={classes.filterContainer}>
                <DialogTitle onClose={handleClose}>Filters - Sponsorship Deal</DialogTitle>
                <NonLinearStepper handleClose={handleClose} step={step} 
                    handleInventoryDealSave={handleInventoryDealSave}
                    stepsTotalSteps={stepsTotalSteps} handleStep={handleStep}
                    handleApply={() => handleApply()} handleSave={handleSave}
                >
                    {step === 0 && <FiltersStepOne {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                    {step === 1 && <FiltersStepTwo {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                </NonLinearStepper>
                
            </Box>
        </Box>
    )

}
export default MediaPlanFiltersScreen;

