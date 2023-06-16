import React, { useState } from "react";
import {
  Box,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  FormControlLabel,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Helper from "../../../common/Helper";
import { ToastContainer, toast } from "react-toastify";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  DeleteMediaPlanBudget
} from "../../../services/planning.service";
import ConfrimDialog from "../../../sharedComponents/Dialog/ConfirmDialog";



const useStyles = makeStyles((theme) => ({}));

function notifySuccess(message) {
  toast.success(message);
}

const BudgetUI = (props) => {
  const { data } = props;
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId,setCurrentId] = useState(null)

  

  const handleDelete = (id) =>{
    DeleteMediaPlanBudget(id)
      .then((data) => {
        notifySuccess("Amount deleted successfully");

          props.refreshData();
      })
      .catch((err) => {
      });    
  }

  const handleDialogOK = () => {
    handleDelete(currentId)
    setOpenDialog(false);

  };

  const handleDialogCancel = () => {
    setOpenDialog(false);
  };

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />

      <Grid container spacing={1}>
        <Grid item xs={11}>
          <Grid container>
            {/* <Grid item xs={3}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Bill Type</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {data.billTypeName}
                  </Typography>
                </Box>
              </Box>
            </Grid> */}
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Country</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {data.countryName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Media</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {data.mediaTypeName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">
                    Start Date | End Date
                  </Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {data.startDate ? Helper.FormatDate(data.startDate) : ""}
                    {data.endDate
                      ? ` | ${Helper.FormatDate(data.endDate)}`
                      : ""}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Asset</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {data.assetName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Brand</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {data.productName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Planned $ Amount</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {Helper.ConvertToDollarFormat(data.plannedBudget)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box display="flex" flexDirection="column" pl={1}>
                <Box component="div">
                  <Typography variant="caption">Comment</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2" component="div">
                    {data.comment ?? '--'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="flex-start"
          justifyContent="flex-end"
          xs={1}
        >
          <IconButton
            title="Edit Planned Amount"
            size="small"
            onClick={() => {
              props.handleEdit(data);
              props.setShowForm(true);
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            title="Delete"
            // color="secondary"
            size="small"
            onClick={() => {
              // handleDelete(data.id)
              setCurrentId(data.id)
              setOpenDialog(true);
            }}
          >
           <DeleteOutlineIcon fontSize="small" />
          </IconButton>

          <ConfrimDialog
        open={openDialog}
        title={"Confirmation"}
        description={"Are you sure you want to delete?"}
        ok={"OK"}
        cancel={"Cancel"}
        handleDialogOk={() => handleDialogOK()}
        handleDialogCancel={() => handleDialogCancel()}
      ></ConfrimDialog>
        </Grid>
      </Grid>
      <Divider width="100%" />
    </React.Fragment>
  );
};

export default BudgetUI;
