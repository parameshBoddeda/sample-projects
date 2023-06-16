import React, { useEffect, useState } from "react";
import {
  Divider,
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const useStyles = makeStyles((theme) => ({}));

const UnassignedUI = (props) => {
  const { data, index } = props;
  const classes = useStyles();
  const [unassignedDragData, setUnassignedDragData] = useState({});

  const handleUnassignedDragStart = (e, data) => {
    // setUnassignedDragData({ item: data });
    props.setUnassignedDraggedItem({ item: data });
  };

  // useEffect(() => {
  //   props.getUnassignedData(unassignedDragData.item);
  // }, [unassignedDragData]);

  return (
    <>
      <Grid
        item
        xs={12}
        draggable
        onDragStart={(e) => handleUnassignedDragStart(e, data)}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <Grid container alignItems="center">
          <Grid container spacing={1} marginTop={0}>
            <Grid item xs={1}>
              <IconButton size="small">
                <DragIndicatorIcon size="small" />
              </IconButton>
            </Grid>

            <Grid item xs={5}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Advertiser/Campaign</Typography>
                </Box>
                <Box component="div">
                  <Typography
                    variant="subtitle2"
                    noWrap
                    title={data.campaignOrAdvertiserName}
                  >
                    {data.campaignOrAdvertiserName}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Unit Size</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">{data.unitSize}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box display="flex" flexDirection="column">
                <Box component="div">
                  <Typography variant="caption">Unit Type</Typography>
                </Box>
                <Box component="div">
                  <Typography variant="subtitle2">
                    {data.unitTypeName}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {data.costTypeName === "Institutional" ? (
              <>
                {data.proposedAdISCI && (
                  <Grid item xs={4} ml={1}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography noWrap variant="subtitle2">
                          {data.proposedAdTitle || "-"}
                        </Typography>
                      </Box>
                      <Box component="div">
                        <Typography noWrap variant="caption">
                          {data.proposedAdISCI}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {data.proposedBreakPosition && (
                  <Grid item xs={4} ml={1}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="subtitle2">
                          Break & Position
                        </Typography>
                      </Box>
                      <Box component="div">
                        <Typography variant="caption">
                          {data.proposedBreakPosition}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ width: "100%" }} />
    </>
  );
};

UnassignedUI.displayName = "UnassignedUI";
export default UnassignedUI;
