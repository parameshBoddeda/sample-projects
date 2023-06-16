import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MediaAccordion from  './MediaAccordion'
import Divider from '@mui/material/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

    selected: {
        background: "#e4ecff"
    },
    dealRow: {
        cursor: "pointer"
    },
    iconColor: {
        color: '#424242 !important',
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
    },
    accordionContainer: {
        '& .MuiAccordionDetails-root': {
            padding: theme.spacing(0),
        },
    },
}));

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const MediaUI = (props) => {
    const classes = useStyles();

    const handleDealEditClick = (dealId, btnName) => {
        if (props.handleDealEditClick) {
            props.handleDealEditClick(dealId, btnName);
        }
    }

    const handlebudgetClick = (dealId, index) => {
        if (props.isEditing) {
            return false;
        }
        if (props.handlebudgetClick) {
            props.handlebudgetClick(dealId, index);
        }
    }

    const handleShowPlanningClick = (amount, dealId, year, startDate, endDate, inventoryId, seasonStartDate, seasonEndDate, eleData) => {
        if(props.handleShowPlanning) {
            props.handleShowPlanning(amount, dealId, year, startDate, endDate, inventoryId, seasonStartDate, seasonEndDate, eleData);
        }
    }

    return (
        <React.Fragment>
            {props.data && <Grid key={`Grid${props.index}`} item xs={12}>
                <MediaAccordion selectedDealId={props.selectedDealId} selectedInventoryId={props.selectedInventoryId}
                selectedBtn={props.selectedBtn} view={props.view}
                selectedBudgetIndex={props.selectedBudgetIndex}
                handleDealEditClick={handleDealEditClick} handleShowPlanning={handleShowPlanningClick}
                handlebudgetClick={handlebudgetClick} 
                handleExpandDetail={props.handleExpandDetail} expandDetail={props.expandDetail}
                data={props.data} className={classes.accordionContainer}/>
            </Grid>}
        </React.Fragment>
    );
}

MediaUI.displayName = "MediaUI";
export default MediaUI;
