//Global Imports Start
import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CircleIcon from "@mui/icons-material/Circle";
import Helper from "../../../common/Helper";

//Global Imports End
//Regional Imports Start

//Regional Import End

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    display: "flex !important",
  },
  oneThirdWidth: { width: "calc(30% - 4px)" },
  twoThirdWidth: { width: "calc(70% - 4px)" },
  borderBottom: {
    borderBottom: "1px solid",
  },
  mediaHeight: {
    height: "calc(100vh - 386px)",
    overflowY: "auto"
  },
}));

export default function MediaPlansList(props) {
  const classes = useStyles();

  const handleChange = (panel, id, campaignOrAdvertiserId) => {
    props.onHeaderSelectionChange(id, campaignOrAdvertiserId);
  };

  let unGroupedData = [];

  const getUnitIcons = () => {
    Object.keys(props.SummaryList).map((groupName) => {
      unGroupedData = unGroupedData.concat(props.SummaryList[groupName]);
      return 0;
    })
    let distUnitTypes = [...new Set(unGroupedData.map(x => x.unitTypeName).sort())];
    let listUnitIcons = distUnitTypes.map((unitTypeName) => {
      //let count = hasUnits(unitTypeName);
      return <Box pr={1} component="div" display="flex" flexDirection="row" alignItems="center" lineHeight={'1'}>
        <CircleIcon style={{ color: Helper.GetStringToColour(unitTypeName), fontSize: '10px' }} fontSize="small" />&nbsp;&nbsp;<Typography variant="caption">{unitTypeName}</Typography>
      </Box>
    })

    return listUnitIcons;
  }

  const getSummaryCount = (list) => {
    let unitTypes = [...new Set(list.filter(y=> y.unitTypeName !== null).map(x => x.unitTypeName).sort())];
    let listUnitIcons = unitTypes.map((unitTypeName) => {
      let count = getUnitsCount(list, unitTypeName);
      return <Box pr={2} title={unitTypeName} component="div">
        <Typography style={{ color: Helper.GetStringToColour(unitTypeName), fontSize:'0.875rem' }} variant="caption" fontWeight="medium">{count}</Typography>
      </Box>
    })

    return listUnitIcons;
  }

  const getUnitsCount = (list, unitType) => {
    return list.filter(x => x.unitTypeName === unitType).map(item => item.units).reduce((prev, curr) => prev + curr, 0);
  }

  return (
    <Container maxWidth={false} disableGutters style={{ borderRight: "1px" }}>
      <React.Fragment>
        {Object.keys(props.SummaryList).length > 0 && (
          <Box pl={2} pb={1} display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
            {getUnitIcons()}
          </Box>
        )}

        <Box className={classes.mediaHeight}>
          {Object.keys(props.SummaryList).map((groupName, index) => {
            let mediaPlanId = props.SummaryList[groupName][0].mediaPlanId;
            let campaignOrAdvertiserId = props.SummaryList[groupName][0].campaignOrAdvertiserId;

            return (
              <Paper elevation={2} key={"CalCampSummary" + index}>
                <Grid
                  container borderTop={0.5}
                  mr={0.5}
                  onClick={() =>
                    handleChange(
                      "panel" + index.toString(),
                      mediaPlanId,
                      campaignOrAdvertiserId
                    )
                  }
                  style={{
                    cursor : 'pointer',
                    backgroundColor:
                      (props.setlecedMediaPlan === mediaPlanId) ? "#e4ecff" : "",
                  }}
                >
                  <Grid item xs={7} md={7} ml={0.25}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="caption" style={{ fontSize: "12px" }}>Media Plan</Typography>
                      </Box>
                      <Box component="div">
                        <Typography variant="subtitle2" component="div" className={classes.date1}>
                          {props.SummaryList[groupName][0].planName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography
                          variant="caption"
                          style={{ fontSize: "12px" }}
                        >
                          Booked Units
                        </Typography>
                      </Box>
                      <Box
                        pb={1}
                        display="flex"
                        flexDirection="row"
                        alignItems="flex-start"
                      >
                        {getSummaryCount(props.SummaryList[groupName])}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}

          {Object.keys(props.SummaryList).length === 0 && (
            <Typography
              variant="subtitle2"
              color="secondary"
              component="div"
              className={classes.date1}
            >
              No Media Plan selected
            </Typography>
          )}
        </Box>
      </React.Fragment>
    </Container>
  );
}
