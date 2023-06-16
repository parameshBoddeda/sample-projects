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
import CampaignDropdown from "./CampaignDropdown";
import { ToastContainer, toast } from "react-toastify";
import * as AppLanguage from '../../../common/AppLanguage';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
function notifyWarning(message) { toast.warning(message) }
function notifySuccess(message) { toast.success(message) }
function notifyError(msg) { toast.error(msg) }

const CampaignMediaPlanningContainer = (props) => {
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
    const [campaignDropDownData, setCampaignDropDownData] = useState([]);
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
    const [isDomesticOrInternational, setDomesticOrInternational] = useState(null);

    useEffect(() => {
        if (campaignDropDownData && campaignDropDownData.length > 0 && props.SaveAllMediaPlans) {

            let ids = campaignDropDownData.map(x => x.value).join();
            let obj = {
                Ids: ids
            }
            ConfirmCampaignMediaPlan(obj).then(data => {
                notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
            }).catch(err => {
                console.log(err);
                notifyError(AppLanguage.APP_MESSAGE.API_Error);
            })

            props.ResetApplyStatus();
        }
    }, [props.SaveAllMediaPlans]);

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

    const handleMediaPlanDataChange = (invList) => {
        setFlag(flag + 1);
        setMediaPlanData(invList);
    }
    const handleCalendarMediaPlanDataChange = (invList) => {
        setFlag(flag + 1);
        setCalendarMediaPlandata(invList);
    }

    const handleOpenMediaPlan = () => {
        setobjAccordionVisiblity({
            InventoryFilter: true,
            MediaPlan: true,
        });
        setExpandInventoryFilter(true);
        setExpandMediaPlan(true);
        setShowDifferentSizes(true);
    }

    const getSelectedCampaign = (campaigns) => {
        setCampaignDropDownData(campaigns);

        if(campaigns){
            var marketTypeIds = [...new Set(campaigns.map(x => x.marketType))];
            if((marketTypeIds.indexOf(113) !== -1) || ((marketTypeIds.indexOf(112) !== -1) && marketTypeIds.indexOf(111) !== -1)){
                setDomesticOrInternational(3);
            }else if(marketTypeIds.indexOf(111) !== -1){
                setDomesticOrInternational(1);
            }else if(marketTypeIds.indexOf(112) !== -1){
                setDomesticOrInternational(2);
            }
        }
        //console.log('campaing name ', campaigns);
    }

    const refreshFilter = (val) => {
        setRefreshFilterResult(val);
    }

    const handleInventoryFiltered = () => {
        setIsInventoryFiltered(true);
        setTimeout(() => {
            setIsInventoryFiltered(false);
        }, 2000);
    }

    const setLoading = (val) => {
        setShowLoading(val);
        setOpenBackdrop(val);
    }

    const setSeasonDates = (sDate, eDate) => {
        if (sDate !== seasonStartDate || eDate !== seasonEndDate) {
            setSeasonStartDate(sDate);
            setSeasonEndDate(eDate);
            setStartDate(sDate);
            setEndDate(eDate);
        }
    }

    return (
        <Container maxWidth={false}
            disableGutters className={classes.container}>
            <Grid container>
                <Grid md={12} mb={1}>
                    <CampaignDropdown
                        selectedCampaignIdForFilter={props.selectedCampaignIdForFilter}
                        CompaignOriginalRows={props.CompaignOriginalRows}
                        getSelectedCampaign={getSelectedCampaign}
                        SetView={(value) => setIsCalendarView(value)}
                        IsCalendarView={isCalendarView}
                        IsDigitalPlanning={isDigitalPlanning}
                        IsROS={isROS} IsCampaignPlanning={true}
                        // SetSeasonStartDate={(val) => setSeasonStartDate(val)}
                        // SetSeasonEndDate={(val) => setSeasonEndDate(val)}
                        SetSeasonDates={setSeasonDates}
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
                        {/* <button onClick={()=>handleOpenMediaPlan()}>Open Media Plan</button> */}
                        <InventoryFilter
                            setShowLoading={setLoading}
                            notifyWarning={notifyWarning}
                            IsCampaignPlanning={true}
                            seasonStartDate={seasonStartDate}
                            seasonEndDate ={seasonEndDate}
                            IsCalendarView={isCalendarView}
                            IsDigitalPlanning={isDigitalPlanning}
                            IsPureDigital={isPureDigital}
                            isDomesticOrInternational={isDomesticOrInternational}
                            SetROSflag={(val) => setIsROS(val)}
                            SetIsDigitalPlanning={(val) => setIsDigitalPlanning(val)}
                            SetIsPureDigital={(val) => setIsPureDigital(val)}
                            RefreshFilterResult={refreshFilterResult}
                            ResetFilterResultFlag={() => refreshFilter(false)}
                            SetView={(value) => setIsCalendarView(value)}
                            setMediaPlanData={(data) => {
                                handleMediaPlanDataChange(data)
                            }}
                            setCalendarMediaPlanData={(data) => {
                                handleCalendarMediaPlanDataChange(data)
                            }}
                            handleInventoryFiltered={() => handleInventoryFiltered()}
                            setStartDate={setStartDate} setEndDate={setEndDate} SetIsDayPartVisible={(val) => setIsDayPartVisible(val)} />
                    </AccordionHorizontal>

                    {
                        AccordionVisiblity.MediaPlan && <AccordionHorizontal
                            showDifferentSizes={showDifferentSizes}
                            size={'twoThird'}
                            resize={(expandInventoryFilter)} displayName="Media Plan (TV)"
                            accordionTitle={"Media Plan (TV)"} Expanded={expandedMediaPlan}
                            handleExpand={handleExpandMediaPlan}
                        >
                            <MediaPlan notifyWarning={notifyWarning} data={mediaPlanData}
                                setShowLoading={setLoading}
                                setOpenBackdrop={setOpenBackdrop}
                                calendarData={calendarMediaPlandata}
                                SetView={(value) => setIsCalendarView(value)}
                                IsCalendarView={isCalendarView} IsCampaignPlanning={true}
                                IsDigitalPlanning={isDigitalPlanning} IsPureDigital={isPureDigital}
                                startDate={startDate} endDate={endDate}
                                DropDownData={campaignDropDownData} IsROS={isROS}
                                RefreshFilter={() => refreshFilter(true)}
                                clearSelectedInventory={() => setMediaPlanData([])}
                                SaveAllMediaPlans={props.SaveAllMediaPlans} IsInventoryFiltered={isInventoryFiltered}
                                IsDayPartVisible={isDayPartVisible} />
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

CampaignMediaPlanningContainer.displayName = "CampaignMediaPlanningContainer";
export default CampaignMediaPlanningContainer;