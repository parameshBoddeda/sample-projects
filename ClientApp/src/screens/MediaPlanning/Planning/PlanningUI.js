import * as React from "react";
import { Typography } from "@mui/material";
import { Grid, Box, Divider } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import {  TvOutlined } from '@mui/icons-material';
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import Helper from "../../../common/Helper";
import { ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  hidden: {
    display: "none !important",
  },
  rowContainer: {
    border: "none",
    borderBottom: "1px solid",
    width: "100%",
  },
  container: {
    padding: "16px 0px",
    width: "100%",
  },
  date1: {
    "& .MuiInputLabel-root": {
      fontSize: ".75rem",
      transform: "translate(14px, 6px) scale(1)",
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.35, 0.75),
    },
  },
  selected: {
    background: "#e4ecff",
  },
  rateCardRow: {
    cursor: "pointer",
  },
  updatedRate: {
    color: "#ff6347",
  },
  validFrom: {
    width: "-webkit-fill-available",
  },
  working: {
    color: "#F6AB27 !important",
  },
  grey: {
    color: "#9fa19f !important",
  },
  confirmed: {
    color: "#F62727 !important",
  },
  proposed: {
    color: "#FF008A !important"
  },
  PendingConfirm: {
    color: '#7CB9E8 !important',
  },
  revised: {
    color: "#5A92FF !important"
  }
}));

const PlanningUI = (props) => {
  const classes = useStyles();
  let { data, index, view } = props;
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedId, setSelectedId] = React.useState();
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleDealEditClick = (event, dealId, btnName) => {
    event.stopPropagation();
    if (props.isEditing) {
      return false;
    }
    if (props.handleDealEditClick) {
      props.handleDealEditClick(dealId, btnName);
    }
  };

  const handlebudgetClick = (event, dealId, index) => {
    event.stopPropagation();
    if (props.isEditing) {
      return false;
    }
    if (props.handleDealEditClick) {
      props.handlebudgetClick(dealId, index);
    }
  };
  const handleClick = (index, id, action) => {
    props.splitUIHandler(action, id);
  };

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <Grid
        className={`${
          data.id &&
          props.selectedId &&
          data.id === props.selectedId
            ? classes.selected
            : ""
        }`}
        key={`Grid${index}`}
        item
        xs={12}
      >
        <Box px={1}>
          <Grid container alignItems="center">
            <Grid item xs={0.5}>
              <Box
                display="flex"
              >
                {data.status.toLowerCase() !== "cancelled" ? 
                <IconButton
                  title={`Plan Status: ${data.status}`}
                  size="small"
                  className={
                    data.status.toLowerCase() === "confirmed" ? classes.confirmed :
                    (data.status.toLowerCase() === "working" || data.status.toLowerCase() === "proposed" )? classes.working :
                    data.status.toLowerCase() === "pending confirm" ? classes.PendingConfirm : classes.grey
                  }
                  onClick={() => {}}
                >
                  <CheckCircleOutlineOutlinedIcon />
                </IconButton>
                : 
                  <IconButton
                    title={`Plan Status: ${data.status}`}
                    size="small"
                    className={classes.confirmed}
                    onClick={() => { }}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                }
              </Box>
            </Grid>
            <Grid item xs={10.5} onClick={() => {}}>
              <Grid container>
                <Grid item xs={1}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Version</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.version}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={1.2}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Plan ID</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={1.2}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Deal ID</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {props.row.campaignOrAdvertiserId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">
                        Start Date | End Date
                      </Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2">
                        {data.startDate
                          ? Helper.FormatDate(data.startDate)
                          : ""}
                        {data.endDate
                          ? ` | ${Helper.FormatDate(data.endDate)}`
                          : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={2.5}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Planned Budget</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {Helper.ConvertToDollarFormat(data.plannedBudget)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Primary</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        className={classes.date1}
                      >
                        {data.primaryFlag ? <StarOutlinedIcon color="secondary" /> : <StarBorderOutlinedIcon /> }
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              xs={1} key={`GridAction${index}`} container
              alignItems="center" justifyContent="flex-end"
            >
              <Box
                display="flex"
                justifyContent="space-between"
              >
                {data.status.toLowerCase() !== "cancelled" && 
                  <Box
                    display="flex"
                    // flexDirection={"column"}
                    justifyContent="space-between"
                  >
                    {props.view && (
                      <IconButton title="abc" size="small">
                        <CurrencyExchangeIcon className={classes.hidden} />
                      </IconButton>
                    )}
                    {(!props.IsPlanConfirmed || (props.IsPlanConfirmed && data.status.toLowerCase() === "confirmed")) && <IconButton
                      title="Budget Split"
                      size="small"
                      onClick={() => handleClick(index, data.id, "budget")}
                    >
                      <CurrencyExchangeIcon />
                    </IconButton>}
                  </Box>}
                  <Box
                    display="flex"
                    // flexDirection={"column"}
                    justifyContent="space-between"
                  >
                  {data.status.toLowerCase() !== "cancelled" && <>
                    {(!props.IsPlanConfirmed || (props.IsPlanConfirmed && data.status.toLowerCase() === "confirmed")) && <IconButton
                      title="Edit Plan"
                      size="small"
                      onClick={() => handleClick(index, data.id, "addPlan")}
                    >
                      <EditOutlinedIcon />
                    </IconButton>}
                    {!props.IsPlanConfirmed && <IconButton
                      title="Media Planning"
                      className={classes.done}
                      size="small"
                      onClick={() => {
                        handleClick(index, data.id, "salesPlanning");
                      }}
                    >
                      <TvOutlined />
                    </IconButton>}
                    </>}
                    <IconButton
                      title="Download Plan report for user"
                      className={classes.done}
                      size="small"
                      onClick={() => {
                        handleClick(index, data.id, "download");
                      }}
                    >
                      <DownloadOutlinedIcon />
                    </IconButton>
                    {data.status.toLowerCase() !== "cancelled" && <IconButton
                      title="Download Plan report for customers"
                      className={classes.done}
                      size="small"
                      onClick={() => {
                        handleClick(index, data.id, "downloadCustomer");
                      }}
                    >
                      <DownloadForOfflineOutlinedIcon />
                    </IconButton>}
                  </Box>                
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

PlanningUI.displayName = "PlanningUI";
export default PlanningUI;
