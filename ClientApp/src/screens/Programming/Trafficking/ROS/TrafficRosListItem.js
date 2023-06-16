import React, { useEffect, useState } from "react";
import Helper from "../../../../common/Helper";
import AppDataContext from "../../../../common/AppContext";
import { Box, Grid, Typography, IconButton, Backdrop } from "@mui/material";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import DateRangePicker from "../../../../sharedComponents/PickDateRange/PickDateRange";
import { UpdateTraffickingData } from "../../../../services/trafficking.service";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CallSplitOutlinedIcon from "@mui/icons-material/CallSplitOutlined";
import CallMergeOutlinedIcon from "@mui/icons-material/CallMergeOutlined";
import RedCircle from "../../../../sharedComponents/customIcons/RedCircle";
import CircleIcon from '@mui/icons-material/Circle';



function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}

const TrafficRosListItem = (props) => {
  const { data, index } = props;

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedIsci, setSelectedIsci] = useState({
    id: "",
    label: "",
    title: "",
  });
  const [isciDropdown, setIsciDropdown] = useState();
  const [adId, setAdid] = useState(data.adId);
  const { username } = React.useContext(AppDataContext);
  const [isDateChanged, setIsDateChanged] = useState(false);
  const [isIsciChanged, setIsIsciChanged] = useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const setStartDate = (value) => {
    setSelectedStartDate(Helper.FormatToIsoDate(value));
    setIsDateChanged(true);
  };

  const setEndDate = (value) => {
    setSelectedEndDate(Helper.FormatToIsoDate(value));
    setIsDateChanged(true);
  };

  // useEffect(() => {
  //   if (selectedStartDate && selectedEndDate) {
  //     handleDateChange();
  //   }
  // }, [selectedStartDate, selectedEndDate]);

  const handleChange = (name, value, data) => {
    setSelectedIsci(value);
    setAdid(value.value);
    setIsIsciChanged(true);

    // let params = {
    //   scheduleAdUnitId: data.scheduleAdUnitId,
    //   scheduleId: data.scheduleId,

    //   user: username,
    //   adId: value.value,
    //   isROS: true,
    //   iSCIStartDate: selectedStartDate,
    //   iSCIEndDate: selectedEndDate,
    // };
    // if (adId && selectedStartDate && selectedEndDate) {
    //   UpdateTraffickingData(params)
    //     .then((resp) => {
    //       if (resp) {
    //         notifySuccess("Data saved successfully..!");
    //       } else {
    //         notifyWarning("Unable to save.");
    //       }
    //     })
    //     .catch((ex) => {
    //       notifyWarning("Server error.");
    //     });
    // }
  };

  const handleDateChange = () => {
    let params = {
      scheduleAdUnitId: data.scheduleAdUnitId,
      scheduleId: data.scheduleId,

      user: username,
      adId: adId,
      isROS: true,
      iSCIStartDate: selectedStartDate,
      iSCIEndDate: selectedEndDate,
    };

    UpdateTraffickingData(params)
      .then((resp) => {
        if (resp) {
          props.getScheduleAdUnit(props.scheduleId);
          notifySuccess("Data saved successfully..!");
        } else {
          notifyWarning("Unable to save.");
        }
      })
      .catch((ex) => {
        notifyWarning("Server error.");
      });
  };

  const handleIsciChange = () => {
    let params = {
      scheduleAdUnitId: data.scheduleAdUnitId,
      scheduleId: data.scheduleId,

      user: username,
      adId: adId,
      isROS: true,
      iSCIStartDate: selectedStartDate,
      iSCIEndDate: selectedEndDate,
    };
    setShowLoading(true);
    setOpenBackdrop(true);
    UpdateTraffickingData(params)
      .then((resp) => {
        if (resp) {
          setShowLoading(false);
          setOpenBackdrop(false);
          props.getScheduleAdUnit(props.scheduleId);
          notifySuccess("Data saved successfully..!");
        } else {
          setShowLoading(false);
          setOpenBackdrop(false);
          notifyWarning("Unable to save.");
        }
      })
      .catch((ex) => {
        setShowLoading(false);
        setOpenBackdrop(false);
        notifyWarning("Server error.");
      });
  };

  useEffect(() => {
    if (isDateChanged && adId) {
      handleDateChange();
    }

    setIsDateChanged(false);
  }, [isDateChanged]);

  useEffect(() => {
    if (isIsciChanged && selectedStartDate && selectedEndDate) {
      handleIsciChange();
    }

    setIsIsciChanged(false);
  }, [isIsciChanged]);

  useEffect(() => {
    if (data.adId) {
      setSelectedIsci({
        label: data.adISCI,
        value: data.id,
        title: data.adTitle,
      });
      setAdid(data.adId);
      console.log(Helper.FormatToIsoDate(data.adStartDate));

      if (data.adStartDate) {
        setSelectedStartDate(Helper.FormatToIsoDate(data.adStartDate));
      }

      if (data.adEndDate) {
        setSelectedEndDate(Helper.FormatToIsoDate(data.adEndDate));
      }
    }
  }, [data.adId]);

  useEffect(() => {
    let tempIsciList = [];
    if (data.isciInfo) {
      data.isciInfo.map((ele) => {
        tempIsciList.push({ value: ele.id, label: ele.isci, title: ele.title });
      });
    }

    setIsciDropdown(tempIsciList);
  }, [data.isciInfo]);

  const checkIsciDate = (id, data) => {
    if (
      selectedIsci.title === null ||
      selectedStartDate === null ||
      selectedEndDate == null
    ) {
      notifyWarning("Please select ISCI and date range");
      return;
    } else {
      props.handleCopyClick(id, data, selectedIsci);
    }
  };

 

  const checkDateRange = () => {
  
    if (props.data.planEndDate === null && props.data.planEndDate == null) {
      return true;
    }
    if (
      props.selectedScheduleData.estDate >= props.data.planStartDate &&
      props.selectedScheduleData.estDate <= props.data.planEndDate
    ) {
      return true;
    } else return false;
  };
  return (
    <>
      <ToastContainer autoClose={3000} />
      <Grid item xs={12}>
        <Grid
          container
          spacing={1}
          marginTop={0}
          alignItems="flex-end"
          key={`row-${index}`}
        >
          <Grid item xs={1}>
            <Box display="flex" flexDirection="column" pl={1.5}>
              <Box component="div">
                <Typography variant="caption">ISCI</Typography>
              </Box>
              <Box component="div">
                {!props.isTrafficked ? (
                  <Dropdown
                    value={selectedIsci.label}
                    name={`ddlISCI-${index}`}
                    variant={"standard"}
                    showLabel={false}
                    id={`ddlISCI-${index}`}
                    ddData={isciDropdown}
                    handleChange={(name, value) =>
                      handleChange(name, value, data)
                    }
                    size="small"
                    disabled={checkDateRange() ? false : true}
                  />
                ) : (
                  <Typography variant="subtitle2" noWrap title={selectedIsci.label}>
                    {selectedIsci.label || "-"}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1.15}>
            <Box display="flex" flexDirection="column">
              <Box component="div">
                <Typography variant="caption">Title</Typography>
              </Box>
              <Box component="div">
                <Typography variant="subtitle2" title={data.adTitle} noWrap>
                  {data.adTitle || selectedIsci.title || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2}>
            {!props.isTrafficked ? (
              <DateRangePicker
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                standard="standard"
                disabled={checkDateRange() ? false : true}
              />
            ) : (
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">StartDate | EndDate</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {selectedStartDate
                      ? Helper.FormatDate(selectedStartDate)
                      : "-"}{" "}
                    |{" "}
                    {selectedEndDate ? Helper.FormatDate(selectedEndDate) : "-"}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={1.8}>
            <Box display="flex" flexDirection="column">
              <Box component="div">
                <Typography variant="caption">Advertiser/Campaign</Typography>
              </Box>
              <Box  component="div" display="flex">
              {checkDateRange() ? "" : <RedCircle />}
                <Typography
                  variant="subtitle2"
                  noWrap
                  title={data.campaignOrAdvertiserName}
                  ml={1}
                >
                  {data.campaignOrAdvertiserName || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={0.75}>
            <Box display="flex" flexDirection="column">
              <Box component="div">
                <Typography variant="caption">Count (%)</Typography>
              </Box>
              <Box component="div">
                <Typography variant="subtitle2" noWrap title={data.countPerc}>
                  {data.countPerc || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={0.75}>
            <Box display="flex" flexDirection="column">
              <Box component="div">
                <Typography variant="caption">Unit Size</Typography>
              </Box>
              <Box component="div">
                <Typography variant="subtitle2" noWrap>
                  {data.unitSize || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Box display="flex" flexDirection="column">
              <Box component="div">
                <Typography variant="caption">Unit Type</Typography>
              </Box>
              <Box component="div">
                <Typography variant="subtitle2" noWrap>
                  {data.unitTypeName || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={2.3}>
            <Box display="flex" flexDirection="column">
              <Box component="div">
                <Typography variant="caption">
                  Proposed ISCI | Start Date | End Date
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="subtitle2" noWrap>
                  {data.proposedAdTitle || "-"} |
                  {Helper.FormatDate(data.proposedAdStartDate) || "-"}|
                  {Helper.FormatDate(data.proposedAdEndDate) || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={0.8}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Status</Typography>
                </Box>
                <Box component="div">
                
                    {props.data.status===1354? <CircleIcon style={{ color: '#499e3a' }} fontSize="small" />:props.data.status===1353?<CircleIcon style={{ color: '#fcba03' }} fontSize="small" />:props.data.status===1355?<CircleIcon style={{color: '#8adbde' }} fontSize="small" />:''}
                 
                </Box>
              </Box>
            </Grid>

          <Grid item xs={0.35}>
            <IconButton title="Copy" size="small" disabled={checkDateRange() ? false : true}>
              <ContentCopyIcon
                onClick={() => {
                  checkIsciDate(props.data.scheduleAdUnitId, props.data);
                }}
              />
            </IconButton>
          </Grid>
          {/*props.data.marketTypeId === 112 && <> <Grid item xs={0.35}>
            <IconButton size="small">
              <CallSplitOutlinedIcon title="Split"               
                onClick={() => {
                  props.handleSplitUnit(props.data);
                }}
              />
            </IconButton>
          </Grid>
          <Grid item xs={0.35}>
            <IconButton size="small">
              <CallMergeOutlinedIcon title="Merge"      
                onClick={() => {
                  props.handleMergeUnits(props.data);
                }}
              />
            </IconButton>
          </Grid>
              </>*/}
        </Grid>
      </Grid>
      {showLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <div className={"loader-div"}>
            <div className={"loading"}></div>
          </div>
        </Backdrop>
      )}
    </>
  );
};

export default TrafficRosListItem;
