import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FiltersStepOne from './FilterStepOne';
import FiltersStepTwo from './FilterStepTwo';
import NonLinearStepper from '../../../sharedComponents/Stepper/NonLinearStepper';
import DialogTitle from '../../../sharedComponents/dialogBox/DialogTitle.js';
import { Box } from '@mui/material';
import { AddUpdateUserPreferences } from '../../../services/common.service';
import * as AppLanguage from '../../../common/AppLanguage';

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        position: 'relative',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
    },
}));

const stepsTotalSteps = ['Select Date Range,Region,Asset', 'Save Filters Optional'];
const FiltersScreen = (props) => {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const [filterCriteria, setFilterCriteria] = React.useState(props.Criteria);
    const handleStep = (nextStep) => {
        if(filterCriteria.region.length < 1 && 
            filterCriteria.country.length < 1 &&
           !filterCriteria.mediaType &&
           !filterCriteria.startDate && !filterCriteria.endDate && 
           filterCriteria.asset.length < 1
        ) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'atleast one criteria'));
            return false;
        }
        
        if(filterCriteria.endDate < filterCriteria.startDate )
        {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
            return false;
        }
        setStep(nextStep)
    }
    const handleClose = () => {
        props.handleFilterCloseClick(false);
    }

    const handleApply = () => {
        if(filterCriteria.region.length < 1 && 
            filterCriteria.country.length < 1 &&
           !filterCriteria.mediaType &&
           !filterCriteria.startDate && !filterCriteria.endDate && 
           filterCriteria.asset.length < 1) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'atleast one criteria'));
            return false;
        }
      
        if(filterCriteria.endDate < filterCriteria.startDate )
        {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
            return false;
        }
        props.handleCriteriaChange(filterCriteria, false);
    }

    const handleSave = () => {
        saveSearchCriteria();
    }

    const saveSearchCriteria = () => {
        if (!filterCriteria.name) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Require_Text_Field_validation.replace('__FieldName__', 'Name'));
            return false;
        }

        if(filterCriteria.region.length < 1 && 
            filterCriteria.country.length < 1 &&
           !filterCriteria.mediaType &&
           !filterCriteria.startDate && !filterCriteria.endDate && 
           filterCriteria.asset.length < 1
        ) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'atleast one criteria'));
            return false;
        }

        
        if(filterCriteria.endDate < filterCriteria.startDate )
        {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Date_Validation);
            return false;
        }
        props.showLoading(true);
        props.openBackdrop(true);
        let obj = {
            Id: props.Criteria.Id,
            LeagueId: filterCriteria.LeagueId,
            TypeId: filterCriteria.TypeId,
            PrefererJson: JSON.stringify({
                region: filterCriteria.region,
                country: filterCriteria.country,
                mediaType: filterCriteria.mediaType,
                asset: filterCriteria.asset,
                startDate: filterCriteria.startDate,
                endDate: filterCriteria.endDate,
                days: filterCriteria.days
            }),  
            Name: filterCriteria.name,
            Description: filterCriteria.description,
            IsDefault: true,
            User: filterCriteria.user
        }

        AddUpdateUserPreferences(obj).then((data) => {
            if (data.message) {
                props.notifyWarning(AppLanguage.APP_MESSAGE.Server_Error);
            } else {
                let test = data;
                props.notifySuccess(AppLanguage.APP_MESSAGE.Filter_Save);
                props.handleCriteriaChange(filterCriteria, true);
            }
        }).catch((error) => {
            props.showLoading(false);
            props.openBackdrop(false);
            console.log(error);
        });
    }

    const handleCriteria = (name, value) => {
        const tempFilterCriteria = filterCriteria || {};
        tempFilterCriteria[name] = value
        setFilterCriteria(tempFilterCriteria);
    }

    const handleInventoryDealSave = () => {

    }

    return (
        <Box p={1}>
            <Box className={classes.filterContainer}>
                <DialogTitle onClose={handleClose}>Filters - Digital Media Planning</DialogTitle>
                <NonLinearStepper handleClose={handleClose} step={step}
                    handleInventoryDealSave={handleInventoryDealSave}
                    stepsTotalSteps={stepsTotalSteps} handleStep={handleStep}
                    handleApply={() => handleApply()} handleSave={handleSave}
                >
                    {step === 0 && <FiltersStepOne {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria} seasonStartDateDefault = {props.seasonStartDateDefault} seasonEndDateDefault = {props.seasonEndDateDefault} edit = {props.edit}/>}
                    {step === 1 && <FiltersStepTwo {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria} />}
                </NonLinearStepper>

            </Box>
        </Box>
    )

}
export default FiltersScreen;

