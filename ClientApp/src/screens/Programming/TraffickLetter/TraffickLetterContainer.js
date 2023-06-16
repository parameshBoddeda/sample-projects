import * as React from "react";
import Grid from "@mui/material/Grid";
import TraffickLetterUI from "./TraffickLetterUI";
import CloseIcon from '@mui/icons-material/Close';
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import {
  Box,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 130px)",
  },
}));

const TraffickLetterContainer = (props) => {
  const classes = useStyles();

  return (
    <Paper>
        <Box className={classes.contentHeight}>
          <Grid container>
            <TraffickLetterUI 
              selectedScheduleData={props.selectedScheduleData}
              selectedScheduleId={props.selectedScheduleId}
              closeTraffickingLetter={props.closeTraffickingLetter}
              refreshPage={props.refreshPage}

            />
          </Grid>
        </Box>
    </Paper>
  );
};

TraffickLetterContainer.displayName = "TraffickLetterContainer";
export default TraffickLetterContainer;
