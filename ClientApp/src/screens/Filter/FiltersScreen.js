import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FiltersStepOne from './FilterStepOne';
import FiltersStepTwo from './FilterStepTwo';
import FilterStepThree from './FilterStepThree';
import NonLinearStepper from '../../sharedComponents/Stepper/NonLinearStepper';
import DialogTitle from '../../sharedComponents/dialogBox/DialogTitle.js';
import { Box } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        position: 'relative',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
    },
}));

const stepsTotalSteps = ['Select League, Media & Market Type', 'Select Networks, Programs & Episodes', 'Save Filters Optional'];
const FiltersScreen = (props) => {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const handleStep = (nextStep) => {
        setStep(nextStep)
    }
    const handleClose=()=>{
        props.handleFilterClick(false);
    }

    return (
        <Box className={classes.filterContainer}>
            <DialogTitle onClose={handleClose}>Filter - Inventory</DialogTitle>
            <NonLinearStepper handleClose={handleClose} step={step} stepsTotalSteps={stepsTotalSteps} handleStep={handleStep}>
                {step === 0 && <FiltersStepOne/>}
                {step === 1 && <FiltersStepTwo/>}
                {step === 2 && <FilterStepThree/>} 
            </NonLinearStepper>
            
        </Box>
    )

}
export default FiltersScreen;

