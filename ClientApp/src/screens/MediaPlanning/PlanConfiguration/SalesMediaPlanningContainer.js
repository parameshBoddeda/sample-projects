//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
//Global Imports End

//Regional Imports Start
import AppDataContext from '../../../common/AppContext';
import AccordionHorizontal from '../../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import SubHeader from "../../../sharedComponents/SubHeader/SubHeader";
import { GetCampaignList } from './../../../services/campaign.service';
import { ConfirmCampaignMediaPlan } from '../../../services/planning.service';
import MediaPlan from "../../../sharedComponents/MediaPlanning/MediaPlan";
import InventoryFilter from "../../../sharedComponents/MediaPlanning/InventoryFilter";
import MediaPlansDropdown from "./MediaPlansDropdown";
import { ToastContainer, toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }
function notifyError(msg) { toast.error(msg) }

const SalesMediaPlanningContainer = (props) => {
    const { leagueId } = useContext(AppDataContext);
    const classes = useStyles();
    const [CompaignOriginalRows, setCompaignOriginalRows] = useState([]);
    const [CompaignRows, setCompaignRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false)
    const [expandInventoryFilter, setExpandInventoryFilter] = useState(true);
    const [expandedMediaPlan, setExpandMediaPlan] = useState(true);
    const [showDifferentSizes, setShowDifferentSizes] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [expandCampaignUnitInstructions, setExpandCampaignUnitInstructions] = useState(false);
    const [rowClick, setRowClick] = useState(false);
    const [recordId, setRecordId] = useState();
    const [selectedRow, setSelectedRow] = useState();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [selectedCompaignId, setSelectedCompaignId] = useState();
    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        InventoryFilter: true,
        MediaPlan: true
    });
    const [selectedBtn, setSelectedBtn] = useState();
    const [mediaPlanData, setMediaPlanData] = useState([]);
    const [calendarMediaPlandata, setCalendarMediaPlandata] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [planDropDownData, setPlanDropDownData] = useState([]);
    const [isCalendarView, setIsCalendarView] = useState(false);
    const [isROS, setIsROS] = useState(false);
    const [flag, setFlag] = useState(1);
    const [isDigitalPlanning, setIsDigitalPlanning] = useState(false);
    const [isPureDigital, setIsPureDigital] = useState(false);
    const [refreshFilterResult, setRefreshFilterResult] = useState(false);
    const [isDayPartVisible, setIsDayPartVisible] = useState(false);
    const [isInventoryFiltered, setIsInventoryFiltered] = useState(false);
    const [seasonStartDate, setSeasonStartDate] = useState(null);
    const [seasonEndDate, setSeasonEndDate] = useState(null);

    const handleExpandInventoryFilter = () => {
        setExpandInventoryFilter(!expandInventoryFilter);
        setExpandMediaPlan(true);
        setShowDifferentSizes(!showDifferentSizes);
    }

    const handleExpandMediaPlan = () => {
        setExpandMediaPlan(true);
        setExpandInventoryFilter(!expandInventoryFilter);
        setShowDifferentSizes(!showDifferentSizes);
    }

    const handleMediaPlanDataChange = (invList) =>{
        setFlag(flag + 1);
        setMediaPlanData(invList);
    }

    const handleCalendarMediaPlanDataChange = (invList) => {
        setFlag(flag + 1);
        setCalendarMediaPlandata(invList);
    }

    const getSelectedPlan = (plans) => {
        setPlanDropDownData(plans);
        //console.log('campaing name ', plans);
    }

    const refreshFilter = (val) => {
        setRefreshFilterResult(val);
    }

    const handleInventoryFiltered = ()=>{
        setIsInventoryFiltered(true);
        setTimeout(() => {
            setIsInventoryFiltered(false);
        }, 2000);
    }
    const openLoading=(val)=>{
        setShowLoading(val);
        setOpenBackdrop(val);
    }

    const setSeasonDates = (sDate, eDate) => {
        if (sDate !== seasonStartDate || eDate !== seasonEndDate){
            setSeasonStartDate(sDate);
            setSeasonEndDate(eDate);
            setStartDate(sDate);
            setEndDate(eDate);
        }
    }

    return (
        <Container maxWidth={false} disableGutters className={classes.container}>
            <Grid container>
                <Grid md={12} mb={1}>
                    <MediaPlansDropdown
                        selectedYear ={props.year}
                        selectedPlanIdForFilter={props.selectedPlanIdForFilter}
                        selectedPlanData={props.selectedPlanData}
                        getSelectedPlan={getSelectedPlan}
                        SetView={(value) => setIsCalendarView(value)}
                        //SetSeasonStartDate={(val) => setSeasonStartDate(val)}
                        //SetSeasonEndDate={(val) => setSeasonEndDate(val)}
                        SetSeasonDates={setSeasonDates}
                        IsCalendarView={isCalendarView}
                        IsDigitalPlanning={isDigitalPlanning}
                        IsROS={isROS} IsCampaignPlanning={false}
                    />
                </Grid>
                <Grid container alignItems="flex-start" md={12}>
                    <AccordionHorizontal
                        showDifferentSizes={showDifferentSizes}
                        size={'oneThird'}
                        resize={(expandInventoryFilter && expandedMediaPlan)}
                        accordionTitle={"Inventory Filter"} displayName="Inventory Filter"
                        handleExpand={handleExpandInventoryFilter}
                        Expanded={expandInventoryFilter}>
                        <InventoryFilter
                            notifyWarning={notifyWarning}
                            setShowLoading={openLoading}
                            MediaPlanType="Sales"
                            IsCalendarView={isCalendarView}
                            seasonStartDate={seasonStartDate}
                            seasonEndDate ={seasonEndDate}
                            IsDigitalPlanning={isDigitalPlanning}
                            IsPureDigital={isPureDigital}
                            SetROSflag={(val) => setIsROS(val)}
                            RefreshFilterResult={refreshFilterResult}
                            ResetFilterResultFlag={() => refreshFilter(false)}
                            SetIsDigitalPlanning={(val) => setIsDigitalPlanning(val)}
                            SetIsPureDigital={(val) => setIsPureDigital(val)}
                            SetView={(value) => setIsCalendarView(value)}
                            setMediaPlanData={(data) => {
                                handleMediaPlanDataChange(data)
                            }}
                            setCalendarMediaPlanData={(data) => {
                                handleCalendarMediaPlanDataChange(data)
                            }}
                            handleInventoryFiltered={() => handleInventoryFiltered()}
                            setStartDate={setStartDate} setEndDate={setEndDate} SetIsDayPartVisible={(val) => setIsDayPartVisible(val)}/>
                    </AccordionHorizontal>

                    {
                        AccordionVisiblity.MediaPlan && <AccordionHorizontal
                            showDifferentSizes={showDifferentSizes}
                            size={'twoThird'}
                            resize={(expandInventoryFilter)}
                            Expanded={expandedMediaPlan}
                            handleExpand={handleExpandMediaPlan}
                        >
                            <MediaPlan notifyWarning={notifyWarning} data={mediaPlanData}
                                setShowLoading={openLoading}
                                setOpenBackdrop={openLoading}
                                calendarData={calendarMediaPlandata}
                                SetView={(value) => setIsCalendarView(value)}
                                IsCalendarView={isCalendarView} IsCampaignPlanning={false} IsDigitalPlanning={isDigitalPlanning}
                                IsPureDigital={isPureDigital}
                                startDate={startDate} endDate={endDate}
                                IsROS={isROS} RefreshFilter={() => refreshFilter(true)}
                                clearSelectedInventory={()=>setMediaPlanData([])}
                                DropDownData={planDropDownData} IsInventoryFiltered={isInventoryFiltered}
                                IsDayPartVisible={isDayPartVisible}/>
                        </AccordionHorizontal>
                    }
                </Grid>
                {
                    showLoading && <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                    >
                        <div className={'loader-div'}><div className={'loading'}></div></div>
                    </Backdrop>
                }

            </Grid>
            <ToastContainer autoClose={3000} />
        </Container>
    )
}

SalesMediaPlanningContainer.displayName = "SalesMediaPlanningContainer";
export default SalesMediaPlanningContainer;