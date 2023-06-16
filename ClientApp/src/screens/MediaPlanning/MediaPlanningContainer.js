//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//Global Imports End

//Regional Imports Start
import MediaGrid from './MediaGrid';
import AppDataContext from '../../common/AppContext';
import Helper from '../../common/Helper';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import Budget from "./Budget/Budget";
import DealEdit from './DealEdit/DealEdit';
import { GetMediaPlans } from './../../services/planning.service';
import PlanningGrid from "./Planning/PlanningGrid";
import SoldByDataList from '../../static/SoldBy.json';
import AddPlan from "./Planning/AddPlan";
import { ToastContainer, toast } from "react-toastify";
import SalesMediaPlanningContainer from "./PlanConfiguration/SalesMediaPlanningContainer";

function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
const MediaPlanningContainer = (props) => {
    const classes = useStyles();
    const [selectedPlanIdForFilter, setSelectedPlanIdForFilter] = useState(props.selectedPlanIdForFilter);
    const [applyChanges, setApplyChanges] = useState(false);
    
    return (
        <React.Fragment>
            {!props.hideHeader && <SubHeader headerText={"MEDIA PLANNING"}></SubHeader>}
            
            <Container maxWidth={false} disableGutters>
                <SalesMediaPlanningContainer {...props}  />
            </Container>
        </React.Fragment>
    )
}

MediaPlanningContainer.displayName = "MediaPlanningContainer";
export default MediaPlanningContainer;