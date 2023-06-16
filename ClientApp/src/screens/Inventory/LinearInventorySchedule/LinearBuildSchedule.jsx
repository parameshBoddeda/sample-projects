import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from "react-toastify";
import AppDataContext from '../../../common/AppContext';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import ScheduleContainer from '../InventorySchedule/ScheduleContainer';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import MultiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import { Box, IconButton, Grid, FormControl, Radio, RadioGroup, FormControlLabel, Button, TextField, Autocomplete } from '@mui/material';
import PickDate from '../../../sharedComponents/PickDate/PickDate';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';
import * as AppConstants from '../../../common/AppConstants';
import TimePicker from '../../../sharedComponents/TimePicker/TimePicker';
import Helper from '../../../common/Helper';
import { GenerateScheduleswithInventory,  GetEpisodesList,
} from "../../../services/inventory.service";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
const useStyled = makeStyles((theme) => ({
    radioGroupPadding: {
        paddingBottom: theme.spacing(.75),
        marginRight: '0 !important',
        '& .MuiFormControlLabel-label': {
            width: "100%",
        },
    },
    // contentHeight: {
    //     height: 'calc(50vh - 86px)',
    //     // overflowY: 'auto',
    // },
    Alert: {
        margin: theme.spacing(1),
    },
    endAfterContainer: {
        marginRight: '0 !important',
        '& .MuiFormControlLabel-label': {
            width: "100%",
        },
    }
}));


function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
function notifyError() { toast.error("Opps there was an error. Please retry..!")  }

const LinearBuildSchedule = (props) => {
    const classes = useStyled();
    
    const { username, userId, frequencyData, daysListData, episodesData } = useContext(AppDataContext);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [linearBuildSchedule, setlinearBuildSchedule] = useState({
        networkId: "",
        startDate: props.seasonStartDate,
        endDate: props.seasonEndDate,
        endAfter: 0,
        EstAirTime: "07:30",
        frequencyId: "",
        daysId: "",
        episodeName: "",
        assetId: 0
    });
    const [errorList, setError] = useState({
        networkId: "",
        startDate: "",
        endDate: "",
        endAfter: "",
        EstAirTime: "",
        Frequency: "",
        daysList: [],
        episodeName: "",
        assetId:""
    });
    const [radioClick, setRadioClick] = useState(AppConstants.Inventory.endDate);
    const [Frequency, setFrequency] = useState();
    const [DaysList, setDaysList] = useState();
    const [showLoading, setShowLoading] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [episodesNames,setEpisodesNames] =useState([]);

    const handleClose = () => {
        if (props.handleClose) {
            props.handleClose();
        }
    }

    const handleRadioClick = (event) => {
        setRadioClick(event.target.name);
        let buildSchedule = linearBuildSchedule;
        setlinearBuildSchedule(buildSchedule);
    }

    const handleAirTimeChange = value => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.EstAirTime = value;
        setlinearBuildSchedule(buildSchedule);
    }

    const handleAirTimeBlur = (value) => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.EstAirTime = value;
        setlinearBuildSchedule(buildSchedule);
    }

    const checkDate = (startDate, endDate) => {
        if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
            return true;
        } else {
            return false;
        }
    }

    const setEndDate = (date) => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.endDate = Helper.FormatDate(date);
        buildSchedule.endAfter = 0;
        setlinearBuildSchedule(buildSchedule);
    }

    const handleEndAfterBlur = (value) => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.endDate = null;
        buildSchedule.endAfter = value;
        setlinearBuildSchedule(buildSchedule);
    }

    const handleEpisodeNameChange = (value) => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.episodeName = value;
        //buildSchedule.assetId = props.data.assetId;
        setlinearBuildSchedule(buildSchedule);
    }
    // const handleEpisodeNameBlur = (value) => {
    //     let buildSchedule = linearBuildSchedule;
    //     buildSchedule.episodeName = value;
    //     buildSchedule.assetId = props.data.assetId;
    //     setlinearBuildSchedule(buildSchedule);
    // }

    const setStartDate = (date) => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.startDate = Helper.FormatDate(date);
        setlinearBuildSchedule(buildSchedule);
    }

    const addDays = (date, days) => {
        const copy = new Date(date).getTime();
        copy.setDate(new Date(copy.getDate()) + days);
        return copy;
      };

    const handleFrequencyChange = (name, value) => {
        setFrequency(value.value);
        let buildSchedule = linearBuildSchedule;
        buildSchedule.frequencyId = value.value;
        setDaysList([]);
        buildSchedule.daysList = [];
        setlinearBuildSchedule(buildSchedule);
    }

    const handleNetworkChange = (name, value) => {
        let buildSchedule = linearBuildSchedule;
        buildSchedule.networkId = value.value;
        setlinearBuildSchedule(buildSchedule);
    }

    const handleDaysChange = (name, value) => {
        let buildSchedule = DaysList ? [...DaysList] : [];
        let bool = false;
        buildSchedule.forEach(day => {
            if (day.key === value.value && !bool) {
                bool = true;
            }
        });
        if (!bool) {
            buildSchedule.push({ key: value.value, label: value.label });
            setDaysList(buildSchedule);
            let buildScheduleObj = linearBuildSchedule;
            buildScheduleObj.daysList = buildSchedule;
            setlinearBuildSchedule(buildScheduleObj);
        }
    }

    const handleChipsDelete = (chips, value) => {
        let buildScheduleObj = DaysList ? [...DaysList] : [];
        buildScheduleObj = buildScheduleObj.filter(ele => ele.label !== value);
        setDaysList(buildScheduleObj);
    }

    const validate = (linearBuildSchedule) => {
        let buildScheduleErr = false;

        if (!linearBuildSchedule.user) {
            notifyWarning(AppConstants.Inventory.sysError);
            buildScheduleErr = true;
        }

        if (!linearBuildSchedule.inventoryId) {
            notifyWarning(AppConstants.Inventory.dealId);
            buildScheduleErr = true;
        }

        //if (!linearBuildSchedule.networkId) {
        //    notifyWarning(AppConstants.Inventory.networkId);
        //    buildScheduleErr = true;
        //}

        if (!Helper.FormatToIsoDate(linearBuildSchedule.startDate)) {
            notifyWarning(AppConstants.Inventory.StartDate);
            buildScheduleErr = true;
        }

        if (radioClick === AppConstants.Inventory.endDate) {
            if (!Helper.FormatToIsoDate(linearBuildSchedule.endDate)) {
                notifyWarning(AppConstants.Inventory.EndDate);
                buildScheduleErr = true;
            }


            if (checkDate(Helper.FormatToIsoDate(linearBuildSchedule.startDate), Helper.FormatToIsoDate(linearBuildSchedule.endDate))) {
                notifyWarning(AppConstants.Inventory.invalidEndDate);
                buildScheduleErr = true;
            }

        }

        // if ((Helper.FormatToIsoDate(linearBuildSchedule.startDate)) > Helper.FormatToIsoDate(linearBuildSchedule.endDate)) {
        //     notifyWarning(AppConstants.Inventory.ValidateStartDateLessThanEndDate)
        //     buildScheduleErr = true;
        // }

        if ((Helper.FormatToIsoDate(linearBuildSchedule.startDate) < Helper.FormatToIsoDate(props.seasonStartDate)) || (Helper.FormatToIsoDate(linearBuildSchedule.endDate) > Helper.FormatToIsoDate(props.seasonEndDate))) {
            notifyWarning(AppConstants.Inventory.StartDateEndDateFallsBetweenSeasonStartDateAndEndDate)
            buildScheduleErr = true;
        }

        if (radioClick === AppConstants.Inventory.endAfter) {
            if (!linearBuildSchedule.endAfter) {
                notifyWarning(AppConstants.Inventory.EndAfter);
                buildScheduleErr = true;
            }
        }
        if (radioClick === AppConstants.Inventory.endAfter)
        {
            if (linearBuildSchedule.endAfter) {
         
                let newStartDate = new Date(linearBuildSchedule.startDate);

                let endAfterDate = '';
                if (linearBuildSchedule.frequencyId === AppConstants.Inventory.dailyId) 
                {
                     endAfterDate = Number(linearBuildSchedule.endAfter);  
                }
                if (linearBuildSchedule.frequencyId === AppConstants.Inventory.weeklyId) 
                {
                     endAfterDate = Number(linearBuildSchedule.endAfter) * 7;  
                }
                if (linearBuildSchedule.frequencyId === AppConstants.Inventory.monthlyId) 
                {
                     endAfterDate = Number(linearBuildSchedule.endAfter) * 30;  
                }
                
                let result = newStartDate.setDate(newStartDate.getDate() + endAfterDate);
                
                //console.log(new Date(result))
                if(new Date(result) > new Date(props.seasonEndDate))
                {
                    notifyWarning(AppConstants.Inventory.EndAfterCheck);
                    buildScheduleErr = true;
                }
               
            }
        }
     

        if (!linearBuildSchedule.EstAirTime) {
            notifyWarning(AppConstants.Inventory.EstAirTime);
            buildScheduleErr = true;
        }

        if (!linearBuildSchedule.frequencyId) {
            notifyWarning(AppConstants.Inventory.Frequency);
            buildScheduleErr = true;
        }

        if (linearBuildSchedule.frequencyId === AppConstants.Inventory.weeklyId) {
            if (linearBuildSchedule.daysList.length < 1) {
                notifyWarning(AppConstants.Inventory.Days);
                buildScheduleErr = true;
            } else {
                let days = "";
                linearBuildSchedule.daysList.map(scheduleDay => {
                    days = days === "" ? scheduleDay.key.toString() : (`${days}, ${scheduleDay.key}`).toString();
                });

                linearBuildSchedule.daysId = days;
            }
        }

        if (buildScheduleErr) {
            return false;
        } else {
            return true;
        }
    }

    const handleClick = () => {
        linearBuildSchedule.inventoryId = props.InventoryId;
        linearBuildSchedule.user = username;

        if (validate(linearBuildSchedule) === false) {
            return false;
        } else {

            if(radioClick === AppConstants.Inventory.endDate) {
                linearBuildSchedule.endAfter = 0;
            }

            if(radioClick === AppConstants.Inventory.endAfter) {
                linearBuildSchedule.endDate = null;
            }
            delete linearBuildSchedule.daysList;
            setShowLoading(true);
            setOpenBackdrop(true);
            GenerateScheduleswithInventory(linearBuildSchedule).then(res => {
                props.notifySuccess("Schedule generated successfully.");
                setShowLoading(false);
                setOpenBackdrop(false);
                if (props.successClose) {
                    props.successClose();
                }
            }).catch(err => {
                console.log("Error => ", err);
                setShowLoading(false);
                setOpenBackdrop(false);
                return false;
            });
        }
    }

    const handleSelected = () => {

    }

    useEffect(() => {
        //handleNetworkChange('', props.InventoryData.networkId);
        let buildSchedule = linearBuildSchedule;
        buildSchedule.networkId = props.InventoryData.networkId;
        setlinearBuildSchedule(buildSchedule);

        setEpisodesNames(episodesData);
    }, [])

    const handleBackdropClose = () => setOpenBackdrop(false);

  

    return (
        <>
            <ToastContainer autoClose={3000} />
            {!props.rowClick && <><Box p={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <GridHeader showIcon={true} hideExpendIcon={props.hideExpendIcon} fullwidth={true} hideCheckbox={true} headerText="Generate Schedule">
                            {props.showCloseIcon && <Box display="flex">
                                <IconButton size="small"  href="#rowFocus" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>}
                        </GridHeader>
                    </Grid>
                </Grid>
            </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <Dropdown handleSelected={handleSelected} disabled={true} size="small" id="network" variant="outlined"
                                        value={props.InventoryData.networkCode}
                                        showLabel={true} lbldropdown="Network" handleChange={handleNetworkChange}
                                        ddData={[]} />
                                </Grid>
                                <Grid item xs={8}>
                                    <Box p={1} display="flex" alignItems="center">
                                        <Typography variant="caption">Asset: </Typography>
                                        <Typography variant="subtitle2" pl={1}>{props.ProgramName ? props.ProgramName : ""}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                    <PickDate setDefaultValue={true} initialValue={props.seasonStartDate} size="small" setDate={setStartDate} label="Start Date" />
                                    </Grid>
                                    <Grid item xs={12}>
                                    {/* <TextboxField lblName="Episode Name" 
                                    handleChange={handleEpisodeNameChange}
                                    textboxData={""}
                                    size="small" 
                                    type="text"  
                                    // handleBlur={handleEpisodeNameBlur}

                                    /> */}
                                     <Autocomplete
                          size="small"
                          open={open}
                          freeSolo
                          fullWidth
                          onOpen={() => {
                            if (inputValue.length > 1) {
                              setOpen(true);
                            }
                          }}
                          // sx={{ width: 80 }}
                          onClose={() => setOpen(false)}
                          inputValue={inputValue}
                          onInputChange={(e, value, reason) => {
                            setInputValue(value);
                            let buildSchedule = linearBuildSchedule;
                            buildSchedule.episodeName = value;
                         
                            setlinearBuildSchedule(buildSchedule);

                            if (!value) {
                              setOpen(false);
                            }
                          }}
                          options={episodesNames}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Episode Name"
                              variant="outlined"
                              size="small"
                              fullWidth
                              // value={episodeName}
                              // onChange={handleEpisodeNameChange}
                            />
                          )}
                        />
                                    </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={4.5}>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={radioClick}
                                            onChange={handleRadioClick}
                                        >
                                            <FormControlLabel className={classes.radioGroupPadding} name="endDate" value="End Date" control={<Radio checked={radioClick === "endDate"} />} label={<PickDate size="small" fullWidth={true} setDefaultValue={true} initialValue={props.seasonEndDate} setDate={setEndDate} disabled={radioClick === "endAfter"} label="End Date" />} />
                                            <FormControlLabel className={classes.endAfterContainer} name="endAfter" value="End After" control={<Radio checked={radioClick === "endAfter"} />} label={<TextboxField fullWidth={true} disabled={radioClick === "endDate"} size="small" lblName="End After " type="number" handleBlur={handleEndAfterBlur} />} />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <TimePicker defaultValue={linearBuildSchedule.EstAirTime} size="small" fullWidth textboxData={linearBuildSchedule.EstAirTime} lblName="AirTime" handleBlur={handleAirTimeBlur} handleChange={handleAirTimeChange} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Dropdown handleSelected={handleSelected} size="small" id="frequency" variant="outlined" showLabel={true} lbldropdown="Frequency" handleChange={handleFrequencyChange} ddData={frequencyData} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {Frequency === AppConstants.Inventory.weeklyId && <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <MultiSelectDropdown handleSelected={handleSelected} size="small" id="days" variant="outlined" showLabel={true} lbldropdown="Day(s)" handleChange={handleDaysChange} ddData={daysListData} />
                                </Grid>
                                <Grid item sm={8}>
                                    {
                                        DaysList && DaysList.length > 0 &&
                                        <ChipsList handleDelete={handleChipsDelete} name="days" showDelete={true} className="chips" label="Selected Day(s)" data={DaysList} />
                                    }

                                </Grid>
                            </Grid>
                        </Grid>}
                    </Grid>
                    <Box component="div" mt={2}>
                        <Grid container xs={12} justifyContent="flex-end">
                            <Button color="secondary"  href="#rowFocus" onClick={handleClose} size='small' sx={{ marginRight: '8px' }}>Cancel</Button>
                            <Button variant="contained"  href="#rowFocus" onClick={handleClick} size='small' color="primary">Generate</Button>
                        </Grid>
                    </Box>
                </Box></>}
                {showLoading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <div className={'loader-div'}><div className={'loading'}></div></div>
                </Backdrop>}

            {props.rows && <ScheduleContainer isLinearBuildSchedule={true}
                recordCount={props.recordCount} hideIcons={props.rowClick ? false : true}
                view={false} setFilterData={props.setFilterData} rowClick={!props.rowClick ? false : true}
                rows={props.rows} originalData={props.originalData} hideActionIcon={true}
                isShowDaysSelector={Frequency === AppConstants.Inventory.weeklyId} refreshDataFromDB={props.refreshDataFromDB}
                seasonStartDate={props.seasonStartDate}  seasonEndDate={props.seasonEndDate}
            />}

        </>
    );
}

LinearBuildSchedule.displayName = "LinearBuildSchedule";
export default LinearBuildSchedule;