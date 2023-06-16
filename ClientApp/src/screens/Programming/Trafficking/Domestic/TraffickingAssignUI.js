import React, { useContext, useEffect, useRef, useState } from "react";
import { Divider, Box, Grid, Typography } from "@mui/material";
import Helper from "../../../../common/Helper";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import { TextField } from "@material-ui/core";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {
  GetNetworkBreakAndPosition,
  UpdateTraffickingData,
  UpdateTraffickingStatus,
} from "../../../../services/trafficking.service";
import AppDataContext from "../../../../common/AppContext";
import Dropdown from "../../../../sharedComponents/Dropdown/Dropdown";
import {
  Checkbox,
  IconButton,
  Chip,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchComponent from "../../../../sharedComponents/SearchComponent/SearchComponent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AssignedUI from "./AssignedUI";
import ConfrimDialog from "../../../../sharedComponents/Dialog/ConfirmDialog";
import { id } from "date-fns/locale";
import CircleIcon from "@mui/icons-material/Circle";
import {  GetLookupById } from '../../../../services/common.service';


const label = { inputProps: { "aria-label": "Checkbox demo" } };
function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}
/*#ecfffb green*/
/*#feefea orange*/
/*#00c691 chip Green*/
/*#f99070 chip orange*/
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: "#e4edfc",
  },
  filterWidget: {
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(1),
  },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
  rowBackground: {
    "&:nth-child(even)": {
      background: "#F0F7FF",
      "& .MuiChip-root": {
        background: "#1D428A",
        color: "#fff",
      },
    },
    "&:nth-child(odd)": {
      background: "#FFF",
      "& .MuiChip-root": {
        background: "#1D428A",
        color: "#fff",
      },
    },
  },
  borderRight: {
    borderRight: "1px solid #ccc",
  },
  fabButton: {
    margin: theme.spacing(1) + "px !important",
    marginTop: theme.spacing(1) + "px !important",
    marginBottom: theme.spacing(1) + "px !important",
    minHeight: "25px !important",
    height: "25px !important",
    width: "25px !important",
  },
  textField: {
    width: "120px",
  },
  showBySpacing: {
    minWidth: "125px",
    marginLeft: theme.spacing(1),
    "& .MuiInputBase-input": {
      paddingRight: theme.spacing(0) + "px !important",
    },
  },
  halfContentHeight: {
    height: "calc(50vh - 216px)",
  },
  fullHeightTrafficking: {
    height: "calc(100vh - 328px)",
  },
  showOverflow: {
    overflowY: "auto",
  },
}));

const TraffickingAssignUI = (props) => {
  const classes = useStyles();

  const { leagueId } = React.useContext(AppDataContext);
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedFilterValue, setSelectedFilterValue] = useState(1);

  const [selectedIndex, setSelectedIndex] = useState([]);
  const [showAddRow, setShowAddRow] = useState(false);
  const [showEditRow, setShowEditRow] = useState(false);
  const [selectedData, setSeletedData] = React.useState({ id: "" });
  const [selectedPosition, setSelectedPosition] = React.useState();
  const [selectedBreak, setSelectedBreak] = React.useState();

  const [dragPosition, setDragPosition] = React.useState();
  const [dragOverposition, setDragOverPosition] = React.useState();
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const trafficDragItem = useRef();
  const trafficDragOverItem = useRef();
  const [dragItem, setDragItem] = useState({});
  const [dragOverItem, setDragOverItem] = useState({});
  const [currentBreakValue, setCurrentBreakValue] = useState();
  const [currentPositionValue, setCurrentPositionValue] = useState();
  const [breakValue, setBreakValue] = useState("");
  const [position, setPosition] = useState("");
  const [scheduleAdUnitId, setScheduleAdUnitId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [data, setData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [drop, setDrop] = useState(false);
  const [itemToMove, setItemToMove] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const { username, userId } = useContext(AppDataContext);
  const [checkSend, setCheckSend] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  const [assignedDrop, setAssignedDrop] = useState(false);
  const [dragBreak, setDragBreak] = useState(null);
  const [openTraffickedDialog, setOpenTraffickedDialog] = useState(false);
  const [dragPositionValue, setDragPositionValue] = useState(null);
  const [dragIsci, setDragIsci] = useState(null);

  const [dragOverBreak, setDragOverBreak] = useState(null);
  const [dragOverPositionValue, setDragOverPositionValue] = useState(null);
  const [dragScheduleId, setDragScheduleId] = useState(null);
  const [dragOverScheduleId, setDragOverScheduleId] = useState(null);
  const [dragOverIsci, setDragOverIsci] = useState(null);

  const [dragScheduleAdUnitId, setDragScheduleAdUnitId] = useState(null);
  const [dragOverScheduleAdUnitId, setDragOverScheduleAdUnitId] =
    useState(null);
  const [currentIsci, setCurrentIsci] = useState(null);
  const [currentElePosition, setCurrentElePosition] = useState(0);
  const [revisionData,setRevisionData] = useState([])
  const [revisionValue,setRevisionValue] = useState(null)
  const [revisionName,setRevisionName] = useState('')


  const saveTraffickingData = (obj, message) => {
    setShowLoading(true);
    setOpenBackdrop(true);

    UpdateTraffickingData(obj)
      .then((resp) => {
        if (resp) {
          setShowLoading(false);
          setOpenBackdrop(false);
          if (message) {
            notifySuccess("Data saved successfully..!");
          }
        } else {
          setShowLoading(false);
          setOpenBackdrop(false);
          if (message) {
            notifyWarning("Unable to save.");
          }
        }
      })
      .catch((ex) => {
        setShowLoading(false);
        setOpenBackdrop(false);
        notifyWarning("Server error.");
      });
  };

  useEffect(() => {
    if (props.checkSend && assignedDrop) {
      const data = {
        scheduleAdUnitId: scheduleAdUnitId,
        scheduleId: scheduleId,
        break: breakValue,

        position: position,
        assigned: 1,
        user: username,
        adId: currentIsci,
      };

      saveTraffickingData(data, true);
      props.setCheckSend(false);
      setAssignedDrop(false);
    }
  }, [props.checkSend, isDragged, assignedDrop]);

  const handleDialogOK = () => {
    setDrop(true);
    setOpenDialog(false);
    refreshUnassignedData();
  };

  const handleDialogCancel = () => {
    setOpenDialog(false);
  };

  const handleReplacedData = (item) => {
    const replacedData = {
      scheduleAdUnitId: item.traffickingRecord.scheduleAdUnitId,
      scheduleId: item.traffickingRecord.scheduleId,
      break: null,
      user: username,
      position: null,
      assigned: 0,
      adId: item.adId,
    };
    saveTraffickingData(replacedData, false);
  };

  const handleAssigneddDraggedItem = (adUnitId, id, br, pos, currentIsci) => {
    const dragged = {
      scheduleAdUnitId: adUnitId,
      scheduleId: id,
      break: br,

      position: pos,
      assigned: 1,
      user: username,
      adId: currentIsci,
    };

    saveTraffickingData(dragged, false);
  };

  useEffect(() => {
    if (isDragged) {
      handleAssigneddDraggedItem(
        dragScheduleAdUnitId,
        dragScheduleId,
        dragOverBreak,
        dragOverPositionValue,
        dragIsci
      );
      if (dragOverScheduleAdUnitId && dragOverScheduleId) {
        handleAssigneddDraggedItem(
          dragOverScheduleAdUnitId,
          dragOverScheduleId,
          dragBreak,
          dragPositionValue,
          dragOverIsci
        );
      }
    }
    setIsDragged(false);
  }, [isDragged]);

  const handleDrop = () => {
    let mapped = props.networkBreakAndPosition.map((item, index) => {
      if (index == dragOverIndex) {
        if (item.traffickingRecord !== undefined) {
          setItemToMove(item);

          setBreakValue(item.break);
          setPosition(item.position);
          setScheduleAdUnitId(
            props.unassignedDraggedItem?.item?.scheduleAdUnitId
          );
          setScheduleId(props.unassignedDraggedItem?.item?.scheduleId);

          return {
            ...item,
            traffickingRecord: props.unassignedDraggedItem.item,
          };
        }
      }
      return item;
    });

    props.setOrgNetworkBreakAndPosition(mapped);

    props.setNetworkBreakAndPosition(mapped);
    props.setCheckSend(true);
    setAssignedDrop(true);
  };

  const handleDroppedData = () => {
    if (itemToMove) {
      if (Object.keys(itemToMove.traffickingRecord).length !== 0) {
        setCurrentIsci(itemToMove.traffickingRecord.adId);
        if (itemToMove.traffickingRecord.costTypeName == "Paid") {
          const copiedData = [...props.schedulePaidAd];

          const newCopiedData = [...copiedData, itemToMove.traffickingRecord];

          const removeBreakPositions = newCopiedData.map((item, index) => {
            let newItem = { ...item, break: null, position: null };
            return newItem;
          });
          props.setSchedulePaidAd(removeBreakPositions);
        } else if (
          itemToMove.traffickingRecord.costTypeName == "Institutional"
        ) {
          const copiedData = [...props.scheduleInstAd];

          const newCopiedData = [...copiedData, itemToMove.traffickingRecord];
          const removeBreakPositions = newCopiedData.map((item, index) => {
            let newItem = { ...item, break: null, position: null };
            return newItem;
          });
          props.setScheduleInstAd(removeBreakPositions);
        } else if (itemToMove.traffickingRecord.costTypeName == "Billboard") {
          const copiedData = [...props.scheduleBillboardAd];

          const newCopiedData = [...copiedData, itemToMove.traffickingRecord];
          const removeBreakPositions = newCopiedData.map((item, index) => {
            let newItem = { ...item, break: null, position: null };
            return newItem;
          });
          props.setScheduleBillboardAd(removeBreakPositions);
        }
        handleReplacedData(itemToMove);
      }
    }
  };

  useEffect(() => {
    if (drop) {
      handleDrop();
      handleDroppedData();
      // setDragItem({});
      // setDragOverItem({});
      // props.setUnassignedDraggedItem({});
    }
    setDrop(false);
  }, [drop]);

  const getNetworkBreakAndPosition = (networkId, marketTypeId) => {
    // setShowLoading(true);
    // setOpenBackdrop(true);

    GetNetworkBreakAndPosition(leagueId, networkId, marketTypeId)
      .then((resp) => {
        let respData = [];
        if (resp.length > 0) {
          resp.map((ele, index) => {
            let tr = props.scheduleAssigned.find(
              (data, index) =>
                data.break === ele.break && data.position === ele.position
            );
            ele.traffickingRecord = tr || undefined;

            respData.push(ele);
          });
          if (props.scheduleAssigned.length > 0) {
            props.scheduleAssigned.map((ele, index) => {
              let isMatch = false;
              respData.map((respEle, respIndex) => {
                if (
                  ele.break === respEle.break &&
                  ele.position === respEle.position &&
                  !isMatch
                ) {
                  isMatch = true;
                }
              });
              if (!isMatch) {
                let finalObj = ele;
                finalObj.traffickingRecord = ele || undefined;
                respData.push(finalObj);
              }
            });
          }
        } else {
          if (props.scheduleAssigned.length > 0) {
            let data = [];
            props.scheduleAssigned.map((ele) => {
              let tempObj = ele;
              tempObj.traffickingRecord = ele;
              data.push(tempObj);
            });
            respData = data;
          }
        }
        respData = respData.sort((eleF, eleS) => {
          return eleF.break - eleS.break;
        });
        props.setNetworkBreakAndPosition(respData);
        props.setOrgNetworkBreakAndPosition(respData);
        // setShowLoading(false);
        // setOpenBackdrop(false);
      })
      .catch((err) => {
        notifyWarning("Server error.");
        // setShowLoading(false);
        // setOpenBackdrop(false);
        console.log(err);
      });
  };

useEffect(()=>{
 
  let traffickRecord = props.orgNetworkBreakAndPosition?.find(item=> item.traffickingRecord !== undefined)
  if(traffickRecord){
  
      
      let info = {value: 3, label: 'Assigned'}
      handleSelectOnChange(null,info)
    
  }
 
},[props.orgNetworkBreakAndPosition])



  const saveTrafficking = (checked) => {
    let params = {
      id: props.selectedScheduleId,
      user: username,
      isTrafficked: checked,
      revisionNumber:String(revisionValue)
    };
    UpdateTraffickingStatus(params)
      .then((resp) => {
        if (resp) {
          if (props.refreshPage) {
            props.refreshPage(checked);
          }
          props.setIsTrafficked(checked);
          notifySuccess("Data saved successfully..!");
        } else {
          notifyWarning("Unable to save.");
        }
      })
      .catch((ex) => {
        notifyWarning("Server error.");
      });
  };

  const handleTraffickedOK = () => {
    saveTrafficking(true);
    setOpenTraffickedDialog(false);
    setDragItem({});
    setDragOverItem({});
    props.setUnassignedDraggedItem({});
  };

  const handleTraffickedCancel = () => {
    props.setIsTrafficked(false);
    setOpenTraffickedDialog(false);
  };

  const setIsci = (scheduleAdUnitId, value) => {
    let tempBreakAndPositionData = props.networkBreakAndPosition;
    tempBreakAndPositionData.map((ele) => {
      if (ele.scheduleAdUnitId === scheduleAdUnitId) {
        ele.adId = value.value ? value.value : null;
      }
    });
    props.setNetworkBreakAndPosition(tempBreakAndPositionData);
  };

  const handleTraffickingChange = (e) => {
    if (e.target.checked) {
      let matchFound = false;
      let confirmed = false;

      if (
        props.schedulePaidAd.length > 0 ||
        props.scheduleInstAd.length > 0 ||
        props.scheduleBillboardAd.length > 0
      ) {
        notifyWarning("Please assign all units and ISCI before trafficking");
        return;
      }

      let tempBreakAndPositionData = [...props.networkBreakAndPosition];
      if (tempBreakAndPositionData.length < 1) {
        return false;
      }

      let newBreakPositions = tempBreakAndPositionData.filter(
        (item) => item.traffickingRecord !== undefined
      );
      let checkIsciBreak = newBreakPositions.every((item) => {
        return item.traffickingRecord.adId && item.break;
      });

      let pendingConfirm = newBreakPositions.every((item) => {
        return item.traffickingRecord.status !== 1353;
      });

      if (!checkIsciBreak) {
        notifyWarning("Please assign ISCI to all units.");
        return;
      }

      if (!pendingConfirm) {
        notifyWarning("Please confirm plan of all schedule units.");
        return;
      }

      // tempBreakAndPositionData.forEach((ele) => {
      //   if (ele.traffickingRecord) {
      //     if (!ele.traffickingRecord.adId && !matchFound) {
      //       matchFound = true;
      //     }
      //   }
      //   else{
      //     matchFound = true;
      //   }
      // });

      // tempBreakAndPositionData.forEach((ele) => {
      //   if (ele.traffickingRecord) {
      //     if (ele.traffickingRecord.status === 1353 && !confirmed) {
      //       confirmed = true;
      //     }
      //   }
      //   else{
      //     matchFound = true;
      //   }
      // });

      // if (matchFound) {
      //   notifyWarning("Please Assign ISCI to all units.");
      //   return;
      //   setOpenTraffickedDialog(true);
      // }
      // // if (confirmed) {
      //   notifyWarning("Please confirm plan of all units of the schedule.");
      //   return;
      // }

      saveTrafficking(e.target.checked);
    } else {
      saveTrafficking(e.target.checked);
    }
  };

  const setFilterData = (filterData) => {};

  const handleEditClick = (ele, position) => {
    if (!showAddRow && !showEditRow) {
      setSeletedData(ele);
      setSelectedBreak(ele.break);
      setCurrentElePosition(position);
      setSelectedPosition(ele.position);
      setShowEditRow(true);
      setCurrentBreakValue(ele.break);
      setCurrentPositionValue(ele.position);
    } else {
      notifyWarning("Already open in edit mode.");
    }
  };

  useEffect(() => {
    if (showEditRow && props.showAddRow) {
      notifyWarning("Already open in edit mode.");
      props.updateShowAddRow(false);
      return false;
    }
    if (props.showAddRow) {
      setShowAddRow(true);
      setSeletedData();
      setShowEditRow(false);
    }
  }, [props.showAddRow]);

  const handleSaveClick = () => {
    if (!selectedBreak) {
      notifyWarning("Please add Break");
      return false;
    }

   
    let breakPosition = props.networkBreakAndPosition.find(item=>item.break===selectedBreak&&item.position.toLowerCase()===selectedPosition.toLowerCase())
   
     if(breakPosition){
      notifyWarning("Break-Position already exists");
      return;
     }
    let tempBreakAndPositionData = props.networkBreakAndPosition;
    if (showAddRow) {
      tempBreakAndPositionData.push({
        newRow: true,
        position: selectedPosition,
        break: selectedBreak,
        id: Math.random() * 100 + 1,
      });
    } else if (!showAddRow && !selectedData.traffickingRecord) {
      let mapped = tempBreakAndPositionData.map((ele, index) => {
        if (index === currentElePosition) {
          return { ...ele, break: selectedBreak, position: selectedPosition };
        }

        return ele;
      });

      tempBreakAndPositionData = mapped.sort((eleF, eleS) => {
        return eleF.break - eleS.break;
      });

      props.setNetworkBreakAndPosition(tempBreakAndPositionData);

      setShowAddRow(false);
      setShowEditRow(false);
      return;
    } else {
      tempBreakAndPositionData.map((ele, index) => {
        if (
          ele &&
          ele.scheduleAdUnitId &&
          ele.scheduleAdUnitId === selectedData.scheduleAdUnitId
        ) {
          tempBreakAndPositionData[index].break = selectedBreak;
          tempBreakAndPositionData[index].position = selectedPosition;
        }

        if (ele && ele.id && ele.id === selectedData.id) {
          tempBreakAndPositionData[index].break = selectedBreak;
          tempBreakAndPositionData[index].position = selectedPosition;
        }
      });

      const data = {
        scheduleAdUnitId: selectedData.traffickingRecord.scheduleAdUnitId,
        scheduleId: selectedData.traffickingRecord.scheduleId,
        break: selectedBreak,

        position: selectedPosition,
        assigned: 1,
        user: username,
        adId: selectedData.adId,
      };

      saveTraffickingData(data, true);
    }

    tempBreakAndPositionData = tempBreakAndPositionData.sort((eleF, eleS) => {
      return eleF.break - eleS.break;
    });

    props.setNetworkBreakAndPosition(tempBreakAndPositionData);
    props.updateShowAddRow(false);
    setShowAddRow(false);
    setSelectedBreak();
    setSelectedPosition();
    setSeletedData({ id: "" });
    setShowEditRow(false);
    setCurrentBreakValue();
    setCurrentPositionValue();
  };

  const handleCloseClick = () => {
    props.updateShowAddRow(false);
    setShowAddRow(false);
    setShowEditRow(false);

    // let tempData = props.networkBreakAndPosition;

    // tempData.map((ele, index) => {
    //   if (ele.scheduleAdUnitId === selectedData.scheduleAdUnitId) {
    //     tempData[index].break = currentBreakValue;
    //     tempData[index].position = currentPositionValue;
    //   }
    // });
    // props.setNetworkBreakAndPosition(tempData);
    // let orgTemp = props.orgNetworkBreakAndPosition;
    // orgTemp.map((ele, index) => {
    //   if (ele.scheduleAdUnitId === selectedData.scheduleAdUnitId) {
    //     orgTemp[index].break = currentBreakValue;
    //     orgTemp[index].position = currentPositionValue;
    //   }
    // });
    // props.setOrgNetworkBreakAndPosition(orgTemp);
    setSelectedBreak(null);
    setSelectedPosition(null);
    setSeletedData(null);
    setShowEditRow(false);
    setCurrentBreakValue(null);
    setCurrentPositionValue(null);
  };

  const handleChange = (e, id) => {
    let tempSelectedIndex = [...selectedIndex];
    if (e.target.checked) {
      tempSelectedIndex.push(id);
    } else {
      tempSelectedIndex = tempSelectedIndex.filter(function (
        value,
        index,
        arr
      ) {
        return value !== id;
      });
    }

    setSelectedIndex(tempSelectedIndex);
    let selectAll = false;
    if (props.networkBreakAndPosition.length === tempSelectedIndex.length) {
      selectAll = true;
    }

    props.handleSelectAll(selectAll);
  };

  React.useEffect(() => {
    
    getNetworkBreakAndPosition(
      props.selectedScheduleData.networkId,
      props.selectedScheduleData.marketTypeId
    );
    getRevisionData()

    
  
  }, [props.selectedScheduleId]);

  useEffect(()=>{
if(revisionData.length>0){
  let rname = props.selectedScheduleData.revisionNumber===null?"1":props.selectedScheduleData.revisionNumber;
 
  let rvalue = revisionData.find(data=>data.label===rname)

   setRevisionName(rname)
   setRevisionValue(rvalue.value)
}
  },[revisionData])

  useEffect(() => {
    if (props.isSelectAll) {
      if (props.networkBreakAndPosition.length > 0) {
        let tempSelectedIndex = [];

        props.networkBreakAndPosition.map((ele, i) => {
          tempSelectedIndex.push(
            ele?.traffickingRecord?.scheduleAdUnitId || ele?.id
          );
        });
        setSelectedIndex(tempSelectedIndex);
      }
    } else {
      setSelectedIndex([]);
    }
  }, [props.isSelectAll]);

  const refreshUnassignedData = () => {
    if (
      props.unassignedDraggedItem.item.costTypeName === "Paid" &&
      props.unassignedDraggedItem.item.unitTypeName !== "Billboard"
    ) {
      const copiedData = [...props.schedulePaidAd];
      const filtered = copiedData.filter(
        (data) =>
          props.unassignedDraggedItem.item.scheduleAdUnitId !==
          data.scheduleAdUnitId
      );
      const newCopiedData = [...filtered];
      props.setSchedulePaidAd(newCopiedData);
    }
    if (
      props.unassignedDraggedItem.item.costTypeName === "Institutional" &&
      props.unassignedDraggedItem.item.unitTypeName !== "Billboard"
    ) {
      const copiedData = [...props.scheduleInstAd];
      const filtered = copiedData.filter(
        (data) =>
          props.unassignedDraggedItem.item.scheduleAdUnitId !==
          data.scheduleAdUnitId
      );
      const newCopiedData = [...filtered];
      props.setScheduleInstAd(newCopiedData);
    }
    if (
      props.unassignedDraggedItem.item.costTypeName === "Billboard" ||
      props.unassignedDraggedItem.item.unitTypeName === "Billboard"
    ) {
      const copiedData = [...props.scheduleBillboardAd];
      const filtered = copiedData.filter(
        (data) =>
          props.unassignedDraggedItem.item.scheduleAdUnitId !==
          data.scheduleAdUnitId
      );
      const newCopiedData = [...filtered];
      props.setScheduleBillboardAd(newCopiedData);
    }
    setDragItem({});
    setDragOverItem({});
  };

  const handleSelectOnChange = (name, value) => {
    setSelectedFilter(value.label);
    setSelectedFilterValue(value.value);
    applyFilter(value.value);
  };

  const handlePositionBlur = (event) => {
    setSelectedPosition(event.target.value);
  };

  const handleBreakBlur = (event) => {
    setSelectedBreak(event.target.value);
  };

  const applyFilter = (value) => {
    if (value === 1) {
      props.setNetworkBreakAndPosition(props.orgNetworkBreakAndPosition);
    }

    if (value === 2) {
      if (selectedIndex.length > 0) {
        let filterArr = props.orgNetworkBreakAndPosition.filter((ele) => {
          return selectedIndex.includes(
            ele?.traffickingRecord?.scheduleAdUnitId || ele?.id
          );
        });

        props.setNetworkBreakAndPosition(filterArr);
      } else {
        props.setNetworkBreakAndPosition([]);
      }
    }

    if (value === 3) {
      let filterArr = props.orgNetworkBreakAndPosition.filter((ele) => {
        return ele.traffickingRecord !== undefined;
      });
      props.setNetworkBreakAndPosition(filterArr);
    }

    if (value === 4) {
      let filterArr = props.orgNetworkBreakAndPosition.filter((ele) => {
        return ele.traffickingRecord === undefined;
      });
      props.setNetworkBreakAndPosition(filterArr);
    }
  };

  const handleTrafficDragStart = (e, position, item) => {
    if (props.isTrafficked) {
      return false;
    }
    trafficDragItem.current = position;
    setDragItem(item);
    props.getAssignedData(item);
  };

  const handleTrafficDragEnter = (e, position, item) => {
    if (props.isTrafficked) {
      return false;
    }
    trafficDragOverItem.current = position;
    setDragOverItem(item);
  };

  const handleTraffickingDrop = () => {
    if (props.isTrafficked) {
      return false;
    }

    if (props.unassignedDraggedItem.item) {
      // const copyListItems = [...props.traffickingData];

      const droppedOverItem = props.networkBreakAndPosition.find(
        (item, index) => {
          if (index == dragOverIndex) {
            if (item.traffickingRecord !== undefined) {
              setItemToMove(item);
              return item;
            }
          }
        }
      );

      if (droppedOverItem) {
        if ("traffickingRecord" in droppedOverItem) {
          setOpenDialog(true);
          return;
        }
      } else if (!droppedOverItem) {
        let mapped = props.networkBreakAndPosition.map((item, index) => {
          if (index == dragOverIndex) {
            setBreakValue(item.break);
            setPosition(item.position);
            setScheduleAdUnitId(
              props.unassignedDraggedItem?.item?.scheduleAdUnitId
            );
            setScheduleId(props.unassignedDraggedItem?.item?.scheduleId);
            setCurrentIsci(props.unassignedDraggedItem?.item?.adId);
            return {
              ...item,
              traffickingRecord: props.unassignedDraggedItem.item,
            };
          }
          return item;
        });

        props.setOrgNetworkBreakAndPosition(mapped);

        props.setNetworkBreakAndPosition(mapped);
        props.setAssignedDraggedItem({});
        props.setUnassignedDraggedItem({});
        refreshUnassignedData();
        props.setCheckSend(true);
        setAssignedDrop(true);
      }
    } else if (dragOverItem) {
      if (
        Object.keys(dragItem).length !== 0 &&
        Object.keys(dragOverItem).length !== 0
      ) {
        console.log("swap case");
        let mapped = props.networkBreakAndPosition.map((item, index) => {
          if (index == trafficDragOverItem.current) {
            setDragOverPositionValue(item.position);
            setDragOverBreak(item.break);
            setDragOverScheduleAdUnitId(dragOverItem.scheduleAdUnitId);
            setDragOverScheduleId(dragOverItem.scheduleId);
            setDragOverIsci(dragOverItem.adId);
            return { ...item, traffickingRecord: dragItem };
          } else if (index == trafficDragItem.current) {
            setDragPositionValue(item.position);
            setDragBreak(item.break);
            setDragScheduleId(dragItem.scheduleId);
            setDragScheduleAdUnitId(dragItem.scheduleAdUnitId);
            setDragIsci(dragItem.adId);

            return { ...item, traffickingRecord: dragOverItem };
          } else {
            return item;
          }
        });
        setIsDragged(true);
        trafficDragItem.current = null;
        trafficDragOverItem.current = null;
        props.setOrgNetworkBreakAndPosition(mapped);
        props.setNetworkBreakAndPosition(mapped);
      }
    } else if (Object.keys(dragItem).length !== 0 && !dragOverItem) {
      {
        let mapped = props.networkBreakAndPosition.map((item, index) => {
          if (index == trafficDragOverItem.current) {
            setDragOverPositionValue(item.position);
            setDragOverBreak(item.break);
            setDragScheduleId(dragItem.scheduleId);
            setDragScheduleAdUnitId(dragItem.scheduleAdUnitId);
            setDragIsci(dragItem.adId);

            return { ...item, traffickingRecord: dragItem };
          } else if (index == trafficDragItem.current) {
            // setDragPositionValue(item.position);
            // setDragBreak(item.break);
            // setDragScheduleId(dragItem.scheduleId);
            // setDragScheduleAdUnitId(dragItem.scheduleAdUnitId);

            return { ...item, traffickingRecord: undefined };
          } else {
            return item;
          }
        });
        setIsDragged(true);
        trafficDragItem.current = null;
        trafficDragOverItem.current = null;
        props.setOrgNetworkBreakAndPosition(mapped);
        props.setNetworkBreakAndPosition(mapped);
      }
    }
    setDragItem({});
    setDragOverItem({});
  };

  useEffect(() => {
    if (props.unassignedDraggedItem) {
      getNetworkBreakAndPosition(
        props.selectedScheduleData.networkId,
        props.selectedScheduleData.marketTypeId
      );
    }
  }, [props.traffickingData]);

  useEffect(() => {
    getNetworkBreakAndPosition(
      props.selectedScheduleData.networkId,
      props.selectedScheduleData.marketTypeId
    );

  }, [props.scheduleAssigned]);

  const checkDateRange = () => {
    let campaign =
      props.networkBreakAndPosition.length > 0 &&
      props.networkBreakAndPosition.filter(
        (unit) => unit.planEndDate !== null && unit.planStartDate !== null
      );

    if (campaign.length > 0) {
      let range = campaign.every(
        (item) =>
          props.selectedScheduleData.estDate >= item.planStartDate &&
          props.selectedScheduleData.estDate <= item.planEndDate
      );
      return !range;
    }
  };

  const checkTraffickingDisabled = () => {
    if (props.selectedScheduleData.isReady === 0) {
      return true;
    } else {
      checkDateRange();
    }
  };

  const getRevisionData = () => {
    GetLookupById(1750).then((data) => {
     
        let revisionList = [];
        if (data) {
            data.map(item => {
              revisionList.push({ label: item.lookupText, value: item.lookupId });
            });
            setRevisionData(revisionList);
        }
    }).catch(err => console.log(err))

}

const handleRevisionChange = (name, value) => {
 
  setRevisionName(value.label);


  setRevisionValue(value.value)

};




  return (
    <>
      <ToastContainer autoClose={3000} />
      <ConfrimDialog
        open={openDialog}
        title={"Notification"}
        description={"Are you sure you want to replace current item?"}
        ok={"OK"}
        cancel={"Cancel"}
        handleDialogOk={() => handleDialogOK()}
        handleDialogCancel={() => handleDialogCancel()}
      ></ConfrimDialog>

      <ConfrimDialog
        open={openTraffickedDialog}
        title={"Notification"}
        description={
          "Some or all ISCI are blank, Do you still want to confirm trafficking?"
        }
        ok={"Yes"}
        cancel={"No"}
        handleDialogOk={() => handleTraffickedOK()}
        handleDialogCancel={() => handleTraffickedCancel()}
      ></ConfrimDialog>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        pr={2}
        className={classes.filterWidget}
      >
        <Box display="flex">
          {props.isTrafficked && (
            <IconButton
              title="Generate Traffic Letter"
              size="small"
              onClick={() => {
                if (props.isTrafficked) {
                  props.showTraffickLetter(props.selectedScheduleData);
                }
              }}
            >
              <MarkunreadOutlinedIcon size="small" />
            </IconButton>
          )}
        </Box>
        <Box display="flex">
          <SearchComponent
            setFilterData={setFilterData}
            jsonData={props.networkBreakAndPosition}
            originalData={props.orgNetworkBreakAndPosition}
          />
        </Box>
        <Box display="flex">
          <IconButton
            title="Refresh Page"
            size="small"
            onClick={props.handleRefresh}
          >
            <RefreshOutlinedIcon />
          </IconButton>
          {/* <IconButton size="small">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
          <IconButton size="small">
            <DownloadIcon />
          </IconButton>
          <IconButton size="small">
            <ContentCopyIcon />
          </IconButton> */}
        </Box>
      </Box>
      <Grid item xs={12} className={classes.header}>
        <Grid container alignItems="center">
          <Grid container marginTop={0}>
            <Grid item xs={4}>
              <Typography color="primary" variant="caption" ml={2}>
                {`
                   
                  ${
                    props.selectedScheduleData.networkName
                      ? props.selectedScheduleData.networkName
                      : "-"
                  } | 
                  ${
                    props.selectedScheduleData.estDate
                      ? Helper.FormatDate(props.selectedScheduleData.estDate)
                      : "-"
                  } | 
                  ${
                    props.selectedScheduleData.id
                      ? props.selectedScheduleData.id
                      : "-"
                  } | 
                  ${
                    props.selectedScheduleData.episodeName
                      ? props.selectedScheduleData.episodeName
                      : "-"
                  }
               `}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                pr={2}
              >
                <Box display="flex" flex="1" alignItems="center">
                  <Box
                    pr={2}
                    component="div"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <CircleIcon style={{ color: "#8adbde" }} fontSize="small" />
                    &nbsp;&nbsp;
                    <Typography variant="caption">Trafficked</Typography>
                  </Box>
                  <Box
                    pr={2}
                    component="div"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <CircleIcon style={{ color: "#fcba03" }} fontSize="small" />
                    &nbsp;&nbsp;
                    <Typography variant="caption">Pending Confirm</Typography>
                  </Box>
                  <Box
                    pr={2}
                    component="div"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <CircleIcon style={{ color: "#499e3a" }} fontSize="small" />
                    &nbsp;&nbsp;
                    <Typography variant="caption">Confirmed</Typography>
                  </Box>
                </Box>
                <Box display="flex">
                  <FormControlLabel
                    size="small"
                    label={
                      <Typography
                        color="primary"
                        fontWeight="medium"
                        variant="caption"
                      >
                        Trafficked
                      </Typography>
                    }
                    control={
                      <Checkbox
                        onChange={handleTraffickingChange}
                        size="small"
                        checked={props.isTrafficked}
                        className={classes.checkboxPadding}
                        disabled={checkTraffickingDisabled() ? true : false}
                      />
                    }
                  />
                </Box>

                <Box display="flex" alignItems="center">
                  <FormControlLabel
                    variant="standard"
                    size="small"
                    labelPlacement="start"
                    label={
                      <Typography
                        color="primary"
                        fontWeight="medium"
                        variant="caption"
                      >
                        Revision Number:{" "}
                      </Typography>
                    }
                    control={
                      <Dropdown
                        classList={classes.showBySpacing}
                        name="revision"
                        handleChange={handleRevisionChange}
                        size="small"
                        id="categoryId"
                        value={revisionName}
                        variant="standard"
                        showLabel={false}
                        lbldropdown=""
                        ddData={revisionData}
                        disabled={props.isTrafficked?true:false}
                      />
                    }
                  />
                </Box>

                <Box display="flex" alignItems="center">
                  <FormControlLabel
                    variant="standard"
                    size="small"
                    labelPlacement="start"
                    label={
                      <Typography
                        color="primary"
                        fontWeight="medium"
                        variant="caption"
                      >
                        Show By:{" "}
                      </Typography>
                    }
                    control={
                      <Dropdown
                        classList={classes.showBySpacing}
                        name="filter"
                        handleChange={handleSelectOnChange}
                        size="small"
                        id="categoryId"
                        value={selectedFilter}
                        variant="standard"
                        showLabel={false}
                        lbldropdown=""
                        ddData={[
                          { value: 1, label: "All" },
                          { value: 2, label: "Selected" },
                          { value: 3, label: "Assigned" },
                          { value: 4, label: "Un-Assigned" },
                        ]}
                      />
                    }
                  />
                </Box>

                
             
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box
        className={`${classes.showOverflow} ${
          props.expandTrafficking && props.expandUnassigned
            ? classes.halfContentHeight
            : props.expandTrafficking
            ? classes.fullHeightTrafficking
            : ""
        }`}
      >
        {props.networkBreakAndPosition.length > 0 ? (
          props.networkBreakAndPosition.map((ele, index) => {
            return (
              <>
                <Grid
                  item
                  xs={12}
                  className={classes.rowBackground}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDrop={(e) => handleTraffickingDrop(e)}
                  onDragStart={(e) =>
                    handleTrafficDragStart(e, index, ele.traffickingRecord)
                  }
                  onDragEnter={(e) =>
                    handleTrafficDragEnter(e, index, ele.traffickingRecord)
                  }
                  key={ele.scheduleAdUnitId}
                >
                  <Grid container spacing={1} marginTop={0} pb={0.5}>
                    {(!showEditRow ||
                      (selectedData.scheduleAdUnitId &&
                        selectedData.scheduleAdUnitId !==
                          ele.scheduleAdUnitId) ||
                      selectedData.id !== ele.id) && (
                      <Grid item xs={1.75} className={classes.borderRight}>
                        <Box display="flex" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <Checkbox
                              {...label}
                              size="small"
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  ele?.traffickingRecord?.scheduleAdUnitId
                                    ? ele?.traffickingRecord?.scheduleAdUnitId
                                    : ele?.id
                                )
                              }
                              checked={
                                selectedIndex.includes(
                                  ele?.traffickingRecord?.scheduleAdUnitId ||
                                    ele?.id
                                )
                                  ? true
                                  : false
                              }
                            />
                            <Chip
                              size="small"
                              label={
                                <Typography variant="subtitle2">
                                  {ele.break}
                                  {ele.position ? "-" + ele.position : ""}
                                </Typography>
                              }
                              variant="contained"
                            />
                          </Box>
                          {!props.isTrafficked && (
                            <Box display="flex" alignItems="flex-start">
                              <IconButton
                                title="Edit Break and Position"
                                size="small"
                                onClick={() => handleEditClick(ele, index)}
                              >
                                <CreateOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    )}

                    {showEditRow &&
                      ((selectedData.scheduleAdUnitId &&
                        selectedData.scheduleAdUnitId ===
                          ele.scheduleAdUnitId) ||
                        index === currentElePosition ||
                        (selectedData?.traffickingRecord?.scheduleAdUnitId &&
                          selectedData?.traffickingRecord?.scheduleAdUnitId ===
                            ele?.traffickingRecord?.scheduleAdUnitId)) && (
                        <Grid item xs={1.75} className={classes.borderRight}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Box display="flex" flex="1">
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  pl={1}
                                  pb={1}
                                >
                                  <Box
                                    component="div"
                                    onLoad={() => {
                                      document
                                        .getElementById("txtBreak")
                                        .focus();
                                    }}
                                  >
                                    <TextField
                                      value={selectedBreak}
                                      onChange={handleBreakBlur}
                                      size="small"
                                      label="Break"
                                      variant="standard"
                                      id="txtBreak"
                                    />
                                  </Box>
                                  <Box component="div">
                                    <TextField
                                      value={selectedPosition}
                                      onChange={handlePositionBlur}
                                      size="small"
                                      label="Position"
                                      variant="standard"
                                    />
                                  </Box>
                                </Box>
                                <Box
                                  pt={1}
                                  flexDirection={"column"}
                                  display="flex"
                                  alignItems={"flex-end"}
                                  justifyContent={"space-between"}
                                >
                                  <IconButton
                                    onClick={handleSaveClick}
                                    size="small"
                                  >
                                    <DoneIcon size="small" />
                                  </IconButton>

                                  <IconButton
                                    onClick={handleCloseClick}
                                    size="small"
                                  >
                                    <CloseIcon size="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    <Grid item xs={10.25}>
                      {ele.traffickingRecord ? (
                        <AssignedUI
                          isTrafficked={props.isTrafficked}
                          data={ele.traffickingRecord}
                          index={index}
                          setIsci={setIsci}
                          selectedScheduleData={props.selectedScheduleData}
                          // setDragPosition={setDragPosition}
                          // setDragOverPosition={setDragOverPosition}
                          // getAssignedData={props.getAssignedData}
                          key={ele.scheduleAdUnitId}
                          getScheduleAdUnit={props.getScheduleAdUnit}
                        />
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                  <Divider sx={{ width: "100%" }} />
                </Grid>
              </>
            );
          })
        ) : (
          <Typography pl={1} pt={1} variant="subtitle1">
            No Record.
          </Typography>
        )}

        {showAddRow && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={1} marginTop={0}>
                <Grid item xs={1.75} className={classes.borderRight}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box display="flex" flex="1">
                        <Box
                          display="flex"
                          flexDirection="column"
                          pl={1}
                          pb={1}
                        >
                          <Box component="div">
                            <TextField
                              onChange={handleBreakBlur}
                              value={selectedBreak}
                              size="small"
                              label="Break"
                              variant="standard"
                              id="txtBreak"
                            />
                          </Box>
                          <Box component="div">
                            <TextField
                              onChange={handlePositionBlur}
                              value={selectedPosition}
                              size="small"
                              label="Position"
                              variant="standard"
                            />
                          </Box>
                        </Box>
                        <Box
                          pt={1}
                          flexDirection={"column"}
                          display="flex"
                          alignItems={"flex-end"}
                          justifyContent={"space-between"}
                        >
                          <IconButton onClick={handleSaveClick} size="small">
                            <DoneIcon size="small" />
                          </IconButton>

                          <IconButton onClick={handleCloseClick} size="small">
                            <CloseIcon size="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={10.25}></Grid>
              </Grid>
              <Divider sx={{ width: "100%" }} />
            </Grid>
          </>
        )}
      </Box>

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

TraffickingAssignUI.displayName = "TraffickingAssignUI";
export default TraffickingAssignUI;
