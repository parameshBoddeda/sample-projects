import  React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FiltersStepOne from './RateCardFilterStepOne';
import RateCardFilterStepThree from './RateCardFilterStepThree';
import RateCardFilterStepTwo from './RateCardFilterStepTwo';
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

const stepsTotalSteps = ['Select Region, Country, Media Type, Partner & Asset', 'Unit Type, Rate Type, Day Part & Customer', 'Save Filters Optional'];
const FiltersScreen = (props) => {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const [filterCriteria, setFilterCriteria] = React.useState(props.Criteria);;
    const handleStep = (nextStep) => {
        if(filterCriteria.region.length < 1 && 
            filterCriteria.country.length < 1 &&
           !filterCriteria.customer &&
           !filterCriteria.dayPart &&
           filterCriteria.partner.length < 1 &&
           !filterCriteria.mediaType &&
           !filterCriteria.rateType &&
           filterCriteria.asset.length < 1 &&
           filterCriteria.unitType.length < 1
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
           !filterCriteria.customer &&
           !filterCriteria.dayPart &&
           filterCriteria.partner.length < 1 &&
           !filterCriteria.mediaType &&
           !filterCriteria.rateType &&
           filterCriteria.asset.length < 1 &&
           filterCriteria.unitType.length < 1
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
            !filterCriteria.customer &&
            !filterCriteria.dayPart &&
            filterCriteria.partner.length < 1 &&
            !filterCriteria.mediaType &&
            !filterCriteria.rateType &&
            filterCriteria.asset.length < 1 &&
            filterCriteria.unitType.length < 1
        ){
            props.notifyWarning('Please select atleast one criteria.');
            return false;
        }

        props.showLoading(true);
        props.openBackdrop(true);
        let obj ={
            Id: props.Criteria.Id,
            RateCardId: filterCriteria.RateCardId,
            LeagueId: filterCriteria.LeagueId,
            TypeId: filterCriteria.TypeId,
            PrefererJson: JSON.stringify({
                region: filterCriteria.region,
                country: filterCriteria.country,
                customer: filterCriteria.customer,
                dayPart: filterCriteria.dayPart,
                partner: filterCriteria.partner,
                mediaType: filterCriteria.mediaType,
                rateType: filterCriteria.rateType,
                asset: filterCriteria.asset,
                unitType: filterCriteria.unitType
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
                <DialogTitle onClose={handleClose}>Filters - Rate Card</DialogTitle>
                <NonLinearStepper handleClose={handleClose} step={step} 
                    handleInventoryDealSave={handleInventoryDealSave}
                    stepsTotalSteps={stepsTotalSteps} handleStep={handleStep}
                    handleApply={() => handleApply()} handleSave={handleSave}
                >
                    {step === 0 && <FiltersStepOne {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                    {step === 1 && <RateCardFilterStepTwo {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                    {step === 2 && <RateCardFilterStepThree {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                </NonLinearStepper>
                
            </Box>
        </Box>
    )

}
export default FiltersScreen;

