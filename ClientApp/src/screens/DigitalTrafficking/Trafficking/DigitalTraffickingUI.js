import * as React from "react";
import { Typography } from "@mui/material";
import { Grid, Box, Divider, Checkbox } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { DigitalMediaTraffickingStatus } from "../../../services/trafficking.service";
import AppDataContext from "../../../common/AppContext";
import * as AppLanguage from "../../../common/AppLanguage";
import * as AppConstants from "../../../common/AppConstants";

import Helper from "../../../common/Helper";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "16px 0px",
    width: "100%",
  },
  control: {
    "& .MuiInputLabel-root": {
      fontSize: ".75rem",
      transform: "translate(14px, 6px) scale(1)",
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.35, 0.75),
    },
  },
  checkboxPadding: {
    padding: theme.spacing(0.5) + "px !important",
  },
}));

const DigitalTraffickingUI = (props) => {
  const classes = useStyles();
  let { data, index, view } = props;
  const [checked, setChecked] = React.useState(false);
  const { username, leagueId } = React.useContext(AppDataContext);
  const [unitName,setUnitName]=React.useState('Impressions');

 
  React.useEffect(()=>{
  if(data.rateType==="CPM"){
    setUnitName("Impressions")
    return
  }

  if(data.rateType==="CPV"){
    setUnitName("View")
    return
  }
  if(data.rateType==="Flat Fee"){
    setUnitName("Post")
    return
  }

  if(data.rateType==="Cost Per Post"){
    setUnitName("Post")
    return
  }

  if(data.rateType==="Spot"){
    setUnitName("Spot")
    return
  }

  
  },[data])

  const handleCheckboxChange = (e, selectedData) => {
    setChecked(e.target.checked);
    let params = {
      id: selectedData.id,
      isTrafficked: e.target.checked,
      user: username,
      inventoryId: selectedData.inventoryId,
      mediaTypeId: selectedData.mediaTypeId
    };
    props.setShowLoading(true);
    props.setOpenBackdrop(true);
    DigitalMediaTraffickingStatus(params)
      .then((resp) => {
        props.notifySuccess(resp.message);
        props.setShowLoading(false);
        props.setOpenBackdrop(false);
      })
      .catch((err) => {
        props.notifyWarning(AppLanguage.APP_MESSAGE.API_Error);
        props.setShowLoading(false);
        props.setOpenBackdrop(false);
      });
  };

  React.useEffect(() => {
    setChecked(data.isTrafficked);
  }, [data.isTrafficked]);

  return (
    <React.Fragment>
      <Grid key={`Grid${index}`} item xs={12}>
        <Box px={1}>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={1.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Asset Name</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.assetDisplayName}
                        className={classes.control}
                      >
                        {data.assetDisplayName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={0.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Unit Type</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.unitType}
                        className={classes.control}
                      >
                        {data.unitType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={0.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Rate Type</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.rateType}
                        className={classes.control}
                      >
                        {data.rateType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={0.75}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Rate</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.rate}
                        className={classes.control}
                      >
                        {Helper.ConvertToUSNumberFormat(data.rate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={1.5}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Tracking URL</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.trackingUrl}
                        className={classes.control}
                      >
                        {data.trackingUrl}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item  xs={1}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Placement</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.placement}
                        className={classes.control}
                      >
                        {data.placement}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* <Grid item xs={1}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Net Value</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={Helper.ConvertToUSNumberFormat(data.netValue)}
                        className={classes.control}
                      >
                        {Helper.ConvertToUSNumberFormat(data.netValue)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid> */}
                {(data.mediaTypeId === 121 || data.mediaTypeId === 104 || data.mediaTypeId === 106) ? (
                  <>
                    {" "}
                    <Grid item xs={0.5}>
                      <Box display="flex" flexDirection="column" pl={1}>
                        <Box component="div">
                          <Typography variant="caption">Episodes</Typography>
                        </Box>
                        <Box component="div">
                          <Typography
                            variant="subtitle2"
                            component="div"
                            className={classes.control}
                            noWrap
                            title={data.episodes}
                          >
                            {data.episodes}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={0.5}>
                      <Box display="flex" flexDirection="column" pl={1}>
                        <Box component="div">
                          <Typography variant="caption">Units</Typography>
                        </Box>
                        <Box component="div">
                          <Typography
                            variant="subtitle2"
                            component="div"
                            className={classes.control}
                            noWrap
                            title={data.units}
                          >
                            {data.units}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={1}>
                    <Box display="flex" flexDirection="column" pl={1}>
                      <Box component="div">
                        <Typography variant="caption">{unitName}</Typography>
                      </Box>
                      <Box component="div">
                        <Typography
                          variant="subtitle2"
                          component="div"
                          className={classes.control}
                          noWrap
                          title={Helper.ConvertToUSNumberFormat(
                            data.impression
                          )}
                        >
                          {Helper.ConvertToUSNumberFormat(data.impression)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={2}>
                  <Box component="div">
                    <Typography variant="caption">
                      Start Date | End Date
                    </Typography>
                  </Box>
                  <Box component="div">
                    <Typography
                      variant="subtitle2"
                      component="div"
                      className={classes.date1}
                    >
                      {Helper.FormatDate(data.startDate) +
                        " | " +
                        Helper.FormatDate(data.endDate)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={
                    data.statusId !==
                    AppConstants.MEDIA_PALN_STATUS_IDS.PendingConfirm
                      ? 2
                      : 2.5
                  }
                >
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Comments</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.comments}
                        className={classes.control}
                      >
                        {data.comments}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {data.statusId !==
                AppConstants.MEDIA_PALN_STATUS_IDS.PendingConfirm ? (
                  <Grid item xs={0.5}>
                    <Box
                      alignItems={"center"}
                      display="flex"
                      flexDirection="column"
                      pl={1}
                    >
                      <Box component="div">
                        <Typography variant="caption">Trafficked</Typography>
                      </Box>
                      <Box component="div">
                        <Checkbox
                          onChange={(e) => handleCheckboxChange(e, data)}
                          size="small"
                          name="all"
                          checked={checked ? true : false}
                          defaultChecked={false}
                          className={classes.checkboxPadding}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ) : null}

                <Grid item xs={12}>
                  <Box display="flex" flexDirection="column" pl={1}>
                    <Box component="div">
                      <Typography variant="caption">Unit Sizes</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        title={data.unitSizes}
                        className={classes.control}
                      >
                        {data.unitSizes ? data.unitSizes : "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};

DigitalTraffickingUI.displayName = "PlanningUI";
export default DigitalTraffickingUI;
