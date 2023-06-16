import  React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  filterClass: {
    height: 'calc(100vh - 238px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
}));
const NonLinearStepper = (props) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const steps = props.stepsTotalSteps;

  useEffect(()=>{
    setActiveStep(props.step);
  },[props.step]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const isSecondLastStep = () => {
    return activeStep === totalSteps() - 2;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? 
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;         
    
    if(props.handleStep) {
      props.handleStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if(props.handleStep) {
      props.handleStep(activeStep -1);
    }
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    if(props.handleStep) {
      props.handleStep(step)
    }
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleSave=()=>{
    props.handleSave();
  }

  const handleApply=()=>{
    props.handleApply();
  }

  return (
    <Box sx={{ width: '100%'}}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box className={props.applyFileCSS ? classes.filterClass : ""}>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>{props.children}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1, pb: 1 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button style={{color: 'red'}} onClick={props.handleClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              {activeStep !== 0 && <Button
                color="inherit"
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>}
              {activeStep === 0 && props.isInventoryDeal && <Button size="small" onClick={props.handleInventoryDealSave} sx={{ mr: 1 }} variant="contained" color="primary">
                Save
              </Button>}
              {activeStep === 0 && <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>}
              {props.handleApply && isSecondLastStep() && <><Button onClick={handleNext} sx={{ mr: 1 }}>
                Save Filter
              </Button>
              <Button size="small" onClick={handleApply} sx={{ mr: 1 }} variant="contained" color="primary">
                Apply
              </Button></>}
              {props.handleSave && isLastStep() && <Button size="small" onClick={handleSave} sx={{ mr: 1 }} variant="contained" color="primary">
                Save
              </Button>}
              {/* {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Save'}
                  </Button>
                ))} */}
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
}

NonLinearStepper.displayName = "StepperComponent";
export default NonLinearStepper;