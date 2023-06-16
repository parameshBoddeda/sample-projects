import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FiltersStepOne from './FilterStepOne';
import FiltersStepTwo from './FilterStepTwo';
import FilterStepThree from './FilterStepThree';
import NonLinearStepper from '../../sharedComponents/Stepper/NonLinearStepper';
import DialogTitle from '../../sharedComponents/dialogBox/DialogTitle.js';
import { Box, IconButton } from '@mui/material';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { AddUpdateUserPreferences } from './../../services/common.service';
import { toast } from "react-toastify";

function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        //position: 'relative',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        padding: '10px'
    },
    filterHeader: {
        display:'flex',
        alignItems : 'center',
        justifyContent :'space-between'
    }
}));


const FiltersScreen = (props) => {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const { inventoryPreferences } = props;
    const [filterCriteria, setFilterCriteria] = React.useState(props.Criteria);
    const [stepsNames, setStepsNames] = React.useState(props.stepsNames ?? ['Select Media & Market Type', 'Select Broadcasters, Assets & Episodes', 'Save Filters Optional']);

    const handleStep = (nextStep) => {
        if(props.FilterName === 'Inventory' && nextStep === 1){
            if((filterCriteria.Region === '') || (filterCriteria.Venturize === '')){
                props.notifyWarning('Please fill all the required fields');
                return;
            }else{
                setStep(nextStep)
            }
        }else{
            setStep(nextStep)
        }
    }

    const handleClose=()=>{
        props.handleClose(false);
    }

    const handleApply=()=>{
        props.handleCriteriaChange(filterCriteria, false);
    }

    const handleSave=()=>{
        if( !filterCriteria.name || (filterCriteria.name === '') || (filterCriteria.Name === '')){
            props.notifyWarning('Please fill all the required fields');
            return;
        }
        saveSearchCriteria();
    }

    const saveSearchCriteria = () => {
        const filterNameAlreadyExists = inventoryPreferences.filter((elem) => filterCriteria.name === elem.name && props.Criteria.Id !== elem.id).length > 0;
        if(filterNameAlreadyExists) {
            notifyWarning("Filter with same name already exists");
            return;
        }
        let obj ={
            Id: props.Criteria.Id,
            LeagueId: props.Criteria.LeagueId,
            TypeId: props.Criteria.TypeId,
            PrefererJson: JSON.stringify({
                Region: filterCriteria.Region,
                Country: filterCriteria.Country,
                Venturize: filterCriteria.Venturize,
                MediaType: filterCriteria.MediaType,
                MarketType: filterCriteria.MarketType,
                Season: filterCriteria.Season,
                Network: filterCriteria.Network,
                AssetType: filterCriteria.AssetType,
                Episode: filterCriteria.Episode
            }),
            Name : filterCriteria.name,
            Description : filterCriteria.description,
            IsDefault : true,
            User : ''
        }

        AddUpdateUserPreferences(obj).then((data)=>{
            props.handleCriteriaChange(filterCriteria, true);
            props.notifySuccess('Filter Saved !');
        }).catch((error) =>{
            console.log(error);
        });
    }

    const handleCriteria=(criteria)=>{
        setFilterCriteria(criteria);
    }

    return (
        <Box p={1}>
            <Box className={classes.filterContainer}>
                <Box className={classes.filterHeader}>
                    <DialogTitle onClose={handleClose}>Filters - {props.FilterName}</DialogTitle>
                    <IconButton size="small" title="close" onClick={()=>handleClose()}>
                        <CloseOutlinedIcon ></CloseOutlinedIcon>
                    </IconButton>
                </Box>

                <NonLinearStepper handleClose={props.handleClose} step={step} handleApply={() => handleApply()} handleSave={handleSave} stepsTotalSteps={stepsNames} handleStep={handleStep}>
                    {step === 0 && <FiltersStepOne {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                    {step === 1 && <FiltersStepTwo {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria} />}
                    {step === 2 && <FilterStepThree {...props} filterCriteria={filterCriteria} setFilterCriteria={handleCriteria}/>}
                </NonLinearStepper>
            </Box>
        </Box>
    )

}
export default FiltersScreen;

