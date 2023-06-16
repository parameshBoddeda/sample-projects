import React, { useState, useEffect, useContext } from "react";
import { Container, Box, IconButton, Button, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ReconciliationListGrid from "./ReconciliationList/ReconciliationListGrid";
import ReconciliationUploadUtil from "./ReconciliationUploadUtil";
import { ToastContainer, toast } from "react-toastify";
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import AccordionHorizontal from "../../sharedComponents/HorizontalAccordion/AccordionWrapper";
import { GetReconciliationListData} from "../../services/reconcilliation.service";
import AppDataContext from "../../common/AppContext";

function notifySuccess(message) {
  toast.success(message);
}
function notifyWarning(message) {
  toast.warning(message);
}
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    display: "flex !important",
  },
}));

const ReconciliationContainer = (props) => {
  const classes = useStyles();
  const { leagueInfo, leagueId, username } = useContext(AppDataContext);
  const [rowClick, setRowClick] = useState(false);
  const [expandReconciliationGrid, setExpandReconciliationGrid] =
    useState(true);
  const [expandUpload, setExpandUpload] = useState(false);
  const [searchItem, setSearchItem] = useState();
  const [applyLocalFilter, setApplyLocalFilter] = useState(false);

  const [AccordionVisibility, setAccordionVisibility] = useState({
    showReconciliationList: true,
    showUpload: false,
  });
  const [showLoading, setShowLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const [reconciliationListData, setReconciliationListData] = useState([]);
  const [originalReconciliationListData, setOriginalReconciliationListData] =
    useState([]);
  const [action, setAction] = useState("");
  const [statusValue, setStatusValue] = useState(7501);
  const [statusName, setStatusName] = useState("All");
  const [statusFilteredData,setStatusFilteredData] = useState([])


  useEffect(() => {
    getReconciliationList(leagueId);
  }, []);

  const getReconciliationList = (leagueId) => {
    setShowLoading(true);
    setOpenBackdrop(true);

    GetReconciliationListData(leagueId)
      .then((data) => {
        if (data) {
          setReconciliationListData(data);
          setOriginalReconciliationListData(data);
          setStatusFilteredData(data);
          setShowLoading(false);
          setOpenBackdrop(false);
        } else console.log("getReconciliationListData API is failing");
      })
      .catch((err) => {
        console.log(err);
        setShowLoading(false);
        setOpenBackdrop(false);
      });
  };

  const handleReconciliationListExpand = () => {
    setExpandUpload(false);
  };

  const handleReconciliationUploadExpand = () => {
    setExpandUpload(!expandUpload);
  };

  const setReconciliationListFilterData = (filterData) => {
    // setReconciliationListData(filterData);
    setStatusFilteredData(filterData);
  };

  const refreshDataFromDB = ()=>{
    getReconciliationList(leagueId);
  }


  const handleUpload = ()=>{
    setAccordionVisibility({
      showReconciliationList: false,
      showUpload: true,
    });
    setExpandUpload(true);
  }

  const handleClose = ()=>{
    setAccordionVisibility({
      showReconciliationList: true,
      showUpload: false,
    });

    setExpandUpload(false);
    refreshDataFromDB();
  }

  const handleStatusChange = (value)=>{
   
    setStatusValue(value.value);
    setStatusName(value.label);
   }

   useEffect(()=>{
    if (statusValue === 7501) {
      setStatusFilteredData(reconciliationListData);
      return;
    }
    let filtered = reconciliationListData.filter(
      (item) => item.status === statusValue
    );
    setStatusFilteredData(filtered);
  },[statusValue])

 

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <SubHeader headerText="Reconciliation List"></SubHeader>

      {props.page === "Reconciliation" ? (
        <Container
          maxWidth={false}
          disableGutters
          className={classes.container}
        >
          {AccordionVisibility.showReconciliationList && (
            <AccordionHorizontal
              displayName="Reconciliation List"
              accordionTitle={"Reconciliation List"}
              hideExpandButton={rowClick ? false : true}
              resize={
                !rowClick
                  ? !expandReconciliationGrid
                  : expandReconciliationGrid && expandUpload
              }
              handleExpand={handleReconciliationListExpand}
              Expanded={expandReconciliationGrid}
            >
              <ReconciliationListGrid
               rows={reconciliationListData}
                statusFilteredData={statusFilteredData}
                originalData={originalReconciliationListData}
                setFilterData={setReconciliationListFilterData}
                setSearchItem={(val) => setSearchItem(val)}
                searchItem={searchItem}
                applyLocalFilter={applyLocalFilter}
                setAction={setAction}
                resetApplyLocalFilter={() => {
                  setApplyLocalFilter(false);
                }}
                refreshDataFromDB={refreshDataFromDB}
                view={!(expandReconciliationGrid && (expandUpload))}
                handleUpload={handleUpload}
                handleStatusChange={handleStatusChange}
                statusName={statusName}
              />
            </AccordionHorizontal>
          )}

          {AccordionVisibility.showUpload && (
            <AccordionHorizontal
              hideExpandButton={rowClick ? false : true}
              resize={!rowClick ? !expandReconciliationGrid : expandUpload}
              displayName="Upload Rate Card"
              accordionTitle={"Upload Rate Card"}
              Expanded={expandUpload}
              handleExpand={handleReconciliationUploadExpand}
            >
              <ReconciliationUploadUtil
                notifySuccess={(msg) => notifySuccess(msg)}
                setShowLoading={(val) => setShowLoading(val)}
                setOpenBackdrop={(val) => setOpenBackdrop(val)}
                notifyWarning={(msg) => notifyWarning(msg)}
                setAction={setAction}
                handleClose={handleClose}
              />
            </AccordionHorizontal>
          )}

          {showLoading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={openBackdrop}
            >
              <div className={"loader-div"}>
                <div className={"loading"}></div>
              </div>
            </Backdrop>
          ) : null}
        </Container>
      ) : null}
    </React.Fragment>
  );
};

export default ReconciliationContainer;
