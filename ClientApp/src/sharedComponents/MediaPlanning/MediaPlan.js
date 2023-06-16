//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, Paper} from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';

//Global Imports End
//Regional Imports Start
import PlanningConfig from "./PlanningConfig";
import PlanSummaryList from "./PlanSummaryList";
import { GetMediaPlanSummary } from '../../services/planning.service';
import AppDataContext from '../../common/AppContext';
import Helper from "../../common/Helper";
import CalendarViewMediaPlanning from "./CalendarViewPlanning/CalendarViewMediaPlanning";
import AccordionsContainer from "../Accordions/AccordionsContainer";
import DigitalPlanningConfig from "./DigitalPlanningConfig";

//Regional Imports End
const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 266px)',
        overflowY: 'auto',
        //paddingTop: theme.spacing(0.75),
    },
    calendarViewHeight: {
        height: 'calc(60vh - 189px)',
    },
    planConfigViewHeight: {
        height: 'calc(50vh - 156px)',
        overflowY: 'auto',
    },
    planSummaryViewHeight: {
        height: 'calc(50vh - 156px)',
        overflowY: 'auto',
    },
    planSummaryExpandViewHeight: {
        height: 'calc(75vh - 156px)',
        overflowY: 'auto',
    },
    scheduleDrawer: {
        '& .MuiDrawer-paper': {
            width: '50%',
            margin: '50px 0 0 0px',
            padding: theme.spacing(2, 1),
        },
    },
}));


const MediaPlan = (props) => {
    const classes = useStyles();
    const { leagueId, DayPartList } = useContext(AppDataContext);
    const [mediaPlanSummaryList, setMediaPlanSummaryList] = useState([]);
    const [editedMediaPlan, setEditedMediaPlan] = useState(null);
    const [isInventoryFiltered, setIsInventoryFiltered] = useState(false);
    const [IsPureDigital, setIsPureDigital] = useState(false);
    const [IsDigitalPlanning, setIsDigitalPlanning] = useState(false);

    useEffect(() => {
        setIsPureDigital(props.IsPureDigital);
    }, [props.IsPureDigital,props.data]);

    useEffect(() => {
        setIsDigitalPlanning(props.IsDigitalPlanning);
    }, [props.IsDigitalPlanning,props.data]);

    useEffect(()=>{
        if (props.IsInventoryFiltered){
            getMediaplanSummary();
            setIsInventoryFiltered(true);
        }
    }, [props.IsInventoryFiltered]);

    const getMediaplanSummary = () => {
        if (props.DropDownData && props.DropDownData.length > 0) {
            let ids = props.DropDownData.map(x => x.value).join();
            let obj = {
                Ids: ids,
                IsCampaign : props.IsCampaignPlanning,
                StartDate : props.startDate,
                EndDate : props.endDate
            }
            GetMediaPlanSummary(obj).then(data => {
                if (data && data.length > 0) {
                    let finalData = data.map(item =>{
                        item.status = props.DropDownData.find(x => x.value === item.mediaPlanId).planStatus;
                        return item;
                    });

                    let groupedData = Helper.GroupBy(finalData, props.IsCampaignPlanning ? 'campaignOrAdvertiserId' : 'mediaPlanId');
                    setMediaPlanSummaryList(groupedData);
                }
                else
                    setMediaPlanSummaryList([]);
            }).catch(err => {
                console.log(err);
            })
        }
        else
            setMediaPlanSummaryList([]);
    }

    useEffect(() => {
        getMediaplanSummary();
    }, [props.DropDownData]);

    useEffect(() => {
        getMediaplanSummary();
    }, [props.startDate, props.endDate]);

    useEffect(() => {
        if(props.data && props.data.length > 0){
            setEditedMediaPlan(null);         
            setIsInventoryFiltered(true);
        }
    }, [props.data]);

    const setEditMediaPlanSummaryInfo = (planData) =>{
        setEditedMediaPlan(planData);
        if(planData.mediaTypeName === 'Digital' || planData.mediaTypeName === 'Social Media')
            setIsDigitalPlanning(true);
        else
            setIsDigitalPlanning(false);

        setIsInventoryFiltered(true);
    }

    const clearEditMediaPlanData = ()=>{
        setEditedMediaPlan(null);
        props.clearSelectedInventory();
        setIsInventoryFiltered(false);
    }

    const refreshSummary = ()=>{
        setEditedMediaPlan(null);
        getMediaplanSummary();
        props.RefreshFilter();
        setIsInventoryFiltered(false);
    }

    return (
        <Container maxWidth={false} disableGutters>
            <>
                {props.IsCalendarView && <Box className={classes.calendarViewHeight}>
                    <CalendarViewMediaPlanning IsCampaignPlanning={props.IsCampaignPlanning} IsDigitalPlanning={props.IsDigitalPlanning}
                        setShowLoading={props.setShowLoading}
                        startDate={props.startDate} endDate={props.endDate}
                        DropDownData={props.DropDownData} data={props.calendarData}
                        SaveAllMediaPlans={props.SaveAllMediaPlans}
                        IsPureDigital={props.IsPureDigital}
                        refreshSummary={() => refreshSummary()}/>
                </Box>}
                {!props.IsCalendarView && <Box pt={0.25}>
                    <Paper elevation={3}>
                        <AccordionsContainer
                            setClassPosition={true}
                            panelName={"PlanConfiguration"}
                            removePadding={true}
                            expand={isInventoryFiltered}
                            handleExpand={()=> setIsInventoryFiltered(!isInventoryFiltered)}
                            title="Plan Configuration"
                        >
                            <Box className={classes.planConfigViewHeight}>
                                {<PlanningConfig 
                                    data={editedMediaPlan ? null : props.data} startDate={props.startDate} endDate={props.endDate}
                                    setShowLoading={props.setShowLoading}
                                    setOpenBackdrop={props.setOpenBackdrop}
                                    IsCampaignPlanning={props.IsCampaignPlanning}
                                    IsDigitalPlanning={IsDigitalPlanning}
                                    IsPureDigital={IsPureDigital}
                                    DropDownData={props.DropDownData}
                                    setEditedMediaPlan={()=>setEditedMediaPlan(null)}
                                    editedMediaPlanInfo={editedMediaPlan} IsROS={props.IsROS}
                                    DayPartList={DayPartList}
                                    refreshSummary={() => refreshSummary()}
                                    clearEditMediaPlanData={() => clearEditMediaPlanData()}
                                    isDayPartVisible={props.IsDayPartVisible} />}

                                {/* {IsDigitalPlanning && <DigitalPlanningConfig 
                                    data={editedMediaPlan ? null : props.data} startDate={props.startDate} endDate={props.endDate}
                                    setShowLoading={props.setShowLoading}
                                    setOpenBackdrop={props.setOpenBackdrop}
                                    IsCampaignPlanning={props.IsCampaignPlanning}
                                    IsPureDigital={IsPureDigital}
                                    DropDownData={props.DropDownData}
                                    editedMediaPlanInfo={editedMediaPlan}
                                    rateTypeData={rateTypeData}
                                    clearEditMediaPlanData={()=>setEditedMediaPlan(null)}
                                    refreshSummary={() => refreshSummary()}/>} */}
                            </Box>
                        </AccordionsContainer>
                    </Paper>
                    <Paper elevation={3} style={{marginTop : '8px'}}>
                        <AccordionsContainer
                            setClassPosition={true}
                            panelName={"PlanSummary"}
                            removePadding={true}
                            expand={true}
                            title="Plan Summary"
                        >
                            <Box className={isInventoryFiltered ? classes.planSummaryViewHeight : classes.planSummaryExpandViewHeight}>
                                <PlanSummaryList data={mediaPlanSummaryList} IsCampaignPlanning={props.IsCampaignPlanning}
                                    IsDigitalPlanning={props.IsDigitalPlanning}
                                    IsPureDigital={props.IsPureDigital} selectedEditPlan={editedMediaPlan}
                                    editMediaPlan={(inventory) => setEditMediaPlanSummaryInfo(inventory)} />
                            </Box>
                        </AccordionsContainer>
                    </Paper>
                </Box>}
            </>
        </Container>
    )
}

MediaPlan.displayName = "MediaPlan";
export default MediaPlan;