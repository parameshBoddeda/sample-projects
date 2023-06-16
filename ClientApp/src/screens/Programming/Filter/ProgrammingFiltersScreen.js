import  React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FiltersStepOne from './ProgrammingFilterStepOne';
import FiltersStepTwo from './ProgrammingFilterStepTwo';
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

const stepsTotalSteps = ['Select Region, Country, Media Type, Partner, Asset', 'Save Filters Optional'];
const ProgrammingFiltersScreen = (props) => {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const [filterCriteria, setFilterCriteria] = React.useState(props.Criteria);;
    const handleStep = (nextStep) => {
        if(filterCriteria.region.length < 1 && 
            filterCriteria.country.length < 1 &&
           filterCriteria.network.length < 1  &&
           !filterCriteria.mediaType &&
           !filterCriteria.startDate && !filterCriteria.endDate && 
           filterCriteria.asset.length < 1
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
        if(filterCriteria.region.length < 1 && 
            filterCriteria.country.length < 1 &&
           filterCriteria.network.length < 1  &&
           !filterCriteria.mediaType &&
           !filterCriteria.startDate && !filterCriteria.endDate && 
           filterCriteria.asset.length < 1
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

        if(filterCriteria.region.length < 1 && 
             filterCriteria.country.length < 1 &&
            filterCriteria.network.length < 1  &&
            !filterCriteria.mediaType &&
            !filterCriteria.startDate && !filterCriteria.endDate && 
            filterCriteria.asset.length < 1
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
                region: filterCriteria.region,
                country: filterCriteria.country,
                network: filterCriteria.network,
                mediaType: filterCriteria.mediaType,
                asset: filterCriteria.asset,
                startDate: filterCriteria.startDate,
                endDate: filterCriteria.endDate,
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
                props.notifySuccess('Filter Saved !');
                props.handleCriteriaChange(filterCriteria, true);
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
                <DialogTitle onClose={handleClose}>Filters - {`${!props.isSchedulePlan ? 'Schedule/Trafficking' : 'Plan Schedules'}`}</DialogTitle>
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
export default ProgrammingFiltersScreen;

