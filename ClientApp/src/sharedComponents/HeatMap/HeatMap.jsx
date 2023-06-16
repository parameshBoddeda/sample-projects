//.....Global Imports Start
import React, { useState, useEffect } from 'react'
import { Paper, Box, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from "react-toastify";

//.....Global Imports End
//.....Local Imports Start
import HeatMapColumn from './HeatMapColumn';
import BreakPosition from "../MediaPlanning/CalendarViewPlanning/BreakPosition";
import DrawerComponent from '../Drawer/DrawerComponent';
import SplitScheduleUnit from '../MediaPlanning/CalendarViewPlanning/SplitScheduleUnit';
import MergeScheduleUnits from '../MediaPlanning/CalendarViewPlanning/MergeScheduleUnits';
import { ChangeUnitCostType } from '../../services/planning.service';
//..Local Imports End

const useStyles = makeStyles(theme => ({
    drawer: {
        '& .MuiDrawer-paper': {
            width: '30%',
            margin: '50px 0 0 0px',
            padding: theme.spacing(2, 1),

        },
    },

}));

function notifyError(msg) { toast.error(msg) }

const HeatMap = (props) => {
    const classes = useStyles();
    const [active, setActive] = useState(false);
    // const [availableCellMap, setAvailableDataMap] = useState({});
    // const [workingCellMap, setWorkingCellMap] = useState({});
    // const [bookedCellMap, setBookedCellMap] = useState({});
    const [show, setShow] = useState(false);
    const [showSplitUnit, setShowSplitUnit] = useState(false);
    const [showMergeUnit, setShowMergeUnit] = useState(false);
    const [selectedScheduleUnit, setSelectedScheduleUnit] = useState(null);
    const [selectedSplitUnit, setSelectedSplitUnit] = useState(null);
    const [selectedMergeUnits, setSelectedMergeUnits] = useState(null);
    const [sameUnitTypeData, setSameUnitTypeData] = useState(null);

    function notifySuccess(message) { toast.success(message) }
    function notifyWarning(message) { toast.warning(message) }

    const handleAvailableState = (item, index) => {
        notifySuccess(`Here is the data ${item}  ${index}`)
    }
    const handleBookedState = (item, index) => {
        notifyWarning(`Here is the data ${item}  ${index}`)
    }
    const callForCellAction = (currentState, item, index) => {
        if (active) {
            //notifyWarning(`Please complete the current action for ${item} at ${index}`);
            return;
        }
        else {
            setActive(true);
            switch (currentState) {
                case 'available':
                    handleAvailableState(item, index);
                    break;
                case 'booked':
                    handleBookedState(item, index);
                    break;
            }
        }
    }
    const createHashMapForCells = (data) => {
        let availableMap = {}, workignMap = {}, bookedMap = {}, result = [];
        // console.log(data)
        if (data) {
            data.map((groupedItem) => {
                result = groupedItem.reduce(function (map, obj) {
                    if (obj?.statusName === 'Initial') {
                        availableMap[obj.scheduleAdUnitId] = obj;
                    } else if (obj?.statusName === 'Working Internal') {
                        workignMap[obj.scheduleAdUnitId] = obj;
                    } else if (obj?.statusName === 'Confirmed') {
                        bookedMap[obj.scheduleAdUnitId] = obj;
                    }
                    return [availableMap, workignMap, bookedMap];
                }, {});
            });
            if (result) {
                //setAvailableDataMap(result[0]);
                // setWorkingCellMap(result[1]);
                // setBookedCellMap(result[3]);
                // console.log(result);
            }
        }
    }
    useEffect(() => {
        createHashMapForCells(props.data)
    }, [props.data]);

    const sortData = (data)=>{
        let sortData = data.sort((a, b) => (a.planName ?? '' < b.planName ?? '') ? -1 : 1).sort((a, b) => (a.scheduleAdUnitId > b.scheduleAdUnitId) ? 1 : -1);
        return sortData;        
    }

    const handleDrawer = (value) => {
        setShow(value);
    }

    const handleSplitUnitDrawer = (value) => {
        setShowSplitUnit(value);
    }

    const handleMergeUnitDrawer = (value) => {
        setShowMergeUnit(value);
    }

    const handleBreakPosition = (scheduleUnit) =>{
        setShow(true);
        setSelectedScheduleUnit(scheduleUnit);
    }

    const handleSplitUnit = (splitUnit) => {
        setShowSplitUnit(true);
        setSelectedSplitUnit(splitUnit);
    }

    const handleMergeUnits = (unit, data) => {
        setSelectedMergeUnits(unit);
        let sameTypeUnits = [];
        if(props.IsCampaignPlanning)
            sameTypeUnits = data.filter(x => x.unitTypeId === unit.unitTypeId && x.unitCostTypeId === 1);
        else
            sameTypeUnits = data.filter(x => x.unitTypeId === unit.unitTypeId);

        setSameUnitTypeData(sameTypeUnits);
        setShowMergeUnit(true);
    }

    const convertUnitCostTypeToBonus = (unit, costTypeId) => {
        ChangeUnitCostType({
            ScheduleAdUnitId: unit.scheduleAdUnitId,
            UnitCostTypeId: costTypeId,
            CampaignOrAdvertiserId: props.selectedCampaignOrAdvertiserId ?? unit.campaignOrAdvertiserId,
            MediaPlanId: props.selectedMediaPlanId ?? unit.mediaPlanId
        }).then(data => {
            if (costTypeId === 4) {
                notifySuccess('Unit Cost Type changed from Paid to Bonus');
            } else if(costTypeId === 2) {
                notifySuccess('Unit Cost Type changed from Bonus to Paid');
            }
            props.RefreshPage();
        }).catch(err => {
            console.log(err);
            notifyError('Something went wrong');
        })
    }

    const handleSaveBreakPosition = (selectedBreakPosition) => {
        setShow(false);
        let obj = selectedScheduleUnit;
        obj.proposedBreakPosition = selectedBreakPosition.id;
        obj.break = selectedBreakPosition.break;
        obj.position = selectedBreakPosition.position;
        obj.comments = selectedBreakPosition.comments;
        props.updateScheduleBreakPostion(obj);
    }

    const handleSaveSplitConfig = () => {
        setShowSplitUnit(false);
        props.RefreshPage();
    }

    const handleSaveMergeConfig = () => {
        setShowMergeUnit(false);
        props.RefreshPage();
    }

    const setActiveStatus = (param)=>{
        setActive(param)
    }
    return (
        <Paper style={{ minWidth: "700px", height: "calc(45vh)", maxHeight: "calc(45vh)", overflowX: "auto", overflowY: "auto" }}>
            <ToastContainer autoClose={3000} />
            <Box display="flex" flex="1">
                {Object.keys(props.data).map((groupName, index) => {
                    let data = sortData(props.data[groupName]);
                    return (
                        <HeatMapColumn {...props}
                            data={props.data[groupName][0]}
                            cells={data}
                            onCellClick={(item) => props.onCellClick(item)}
                            onCellAction={(item, action) => props.onCellAction(item, action)}
                            handleBreakPosition={(item) => handleBreakPosition(item)}
                            handleSplitUnit={(item) => handleSplitUnit(item)}
                            handleMergeUnits={(item) => handleMergeUnits(item, data)}
                            convertUnitCostTypeToBonus={(item, costTypeId) => convertUnitCostTypeToBonus(item, costTypeId)}
                            callForCellAction={callForCellAction} mapActive={active} makeMapActive={(param) => {
                                setActive(param)
                            }}
                        />
                    )
                })}
                {Object.keys(props.data).length === 0 &&
                    <Typography variant="subtitle2" color="secondary" component="div">Please select inventory OR no schedules available for selected criteria.</Typography>
                }
                <DrawerComponent open={show} handleDrawerClose={() => handleDrawer(false)} handleDrawerOpen={() =>handleDrawer(true)}
                    anchor={'right'} className={classes.drawer}>
                    {show && <BreakPosition handleDrawerOpen={()=>handleDrawer(true)}
                        handleClose={()=>handleDrawer(false)}
                        Schedule= {selectedScheduleUnit}
                        IsCampaignPlanning={props.IsCampaignPlanning}
                        handleSave={handleSaveBreakPosition} />}
                </DrawerComponent>
                <DrawerComponent open={showSplitUnit} handleDrawerClose={() => handleSplitUnitDrawer(false)} handleDrawerOpen={() => handleSplitUnitDrawer(true)}
                    anchor={'right'} className={classes.drawer}>
                    {showSplitUnit && <SplitScheduleUnit handleDrawerOpen={()=>handleSplitUnitDrawer(true)}
                        handleClose={()=>handleSplitUnitDrawer(false)}
                        Schedule={selectedSplitUnit}
                        IsCampaignPlanning={props.IsCampaignPlanning}
                        handleSave={handleSaveSplitConfig} />}
               </DrawerComponent>
                <DrawerComponent open={showMergeUnit} handleDrawerClose={() => handleMergeUnitDrawer(false)} handleDrawerOpen={() => handleMergeUnitDrawer(true)}
                    anchor={'right'} className={classes.drawer}>
                     {showMergeUnit && <MergeScheduleUnits handleDrawerOpen={()=>handleMergeUnitDrawer(true)}
                        handleClose={()=>handleMergeUnitDrawer(false)}
                        Schedule={selectedMergeUnits}
                        SameTypeUnits = {sameUnitTypeData}
                        IsCampaignPlanning={props.IsCampaignPlanning}
                        handleSave={handleSaveMergeConfig} />}
                </DrawerComponent>
            </Box>
        </Paper>
    )
}

export default HeatMap;
