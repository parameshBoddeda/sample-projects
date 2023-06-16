import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Paging from "../../../sharedComponents/Pagination/Paging";
import AppDataContext from "../../../common/AppContext";

import ReconciliationListUI from "./ReconciliationListUI";
import SearchComponent from "../../../sharedComponents/SearchComponent/SearchComponent";
import {
  Button,
  Divider,
  Paper,
  Box,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import GridHeader from "../../../sharedComponents/GridHeader/GridHeader";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Dropdown from "../../../sharedComponents/Dropdown/Dropdown";
import Tooltip from '@mui/material/Tooltip';


const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 179px)",
    overflowY: "auto",
  },
  container: {
    padding: theme.spacing(1),
    display: "flex !important",
  },
  ddMinWidth: {
    width: "180px",
  },
}));

const ReconciliationListGrid = (props) => {
  const classes = useStyles();
  const { leagueInfo, leagueId, username } = useContext(AppDataContext);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOnRowsChanged = (e) => {
    setRowsPerPage(e.target.value);
  };

  const setFilterData = (filterData) => {
    props.setFilterData(filterData);

    if (filterData.length !== props.rows.length) setPage(1);
  };

  const handleUpload = () => {
    props.handleUpload();
  };

  const handleStatusChange = (name,value) => {
   
    props.handleStatusChange(value)
  };

  

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box p={1}>
            <GridHeader
              hideExpendIcon={props.hideExpandIcon}
              showIcon={true}
              icon="reconciliationList"
              view={props.view}
              page={"Reconciliation"}
              hideCheckbox={true}
              showScheduleIcon={false}
              headerText="Reconciliation List"
            >
              <Box display="flex" mr={2} className={classes.ddMinWidth}>
                <Dropdown
                  size="small"
                  name="status"
                  fullWidth
                  lbldropdown="Status"
                  value={props.statusName}
                  ddData={[
                    {
                      label: "All",
                      value: 7501,
                    },
                    {
                      label: "Matched",
                      value: 7502,
                    },
                    {
                      label: "Not Matched",
                      value: 7503,
                    },
                  ]}
                  handleChange={handleStatusChange}
                />
              </Box>
              <Box display="flex">
                <SearchComponent
                  //   restrictedFields={props.restrictedFields}
                  setFilterData={setFilterData}
                  jsonData={props.rows}
                  originalData={props.originalData}
                  setSearchItem={props.setSearchItem}
                  searchItem={props.searchItem}
                  applyLocalFilter={props.applyLocalFilter}
                  resetApplyLocalFilter={props.resetApplyLocalFilter}
                />
                {/* <Button style={{marginLeft:'8px'}} variant="contained"  color="primary" >{'Upload'}</Button> */}
                <Box ml={1} display="flex" alignItems="center">
                <Tooltip title="Upload" placement="top" arrow>
                  <IconButton size="small" onClick={handleUpload}>
                    <CloudUploadIcon />
                  </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </GridHeader>{" "}
          </Box>
          <Divider sx={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Box className={classes.contentHeight}>
        <Grid container>
          {props.statusFilteredData?.length > 0 && (
            <Grid item xs={12} sm={12} md={12}>
              <div style={{ height: "calc(100vh - 240px)", overflowY: "auto" }}>
                {props.statusFilteredData
                  .slice(page * rowsPerPage - rowsPerPage, page * rowsPerPage)
                  .map((data, index) => {
                    return (
                      <ReconciliationListUI
                        showLoading={props.showLoading}
                        openBackdrop={props.openBackdrop}
                        isEditing={props.isEditing}
                        key={index}
                        data={data}
                        index={index}
                        view={props.view}
                        splitUIHandler={props.splitUIHandler}
                        refreshDataFromDB={props.refreshDataFromDB}
                      />
                    );
                  })}
              </div>
            </Grid>
          )}
          {props.rows.length > 0 && (
            <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
              <Paging
                minRows={20}
                currentpage={page}
                rows={props.rows.length}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
              />
            </Grid>
          )}
          {props.rows.length < 1 && (
            <Typography pl={1} pt={1} variant="subtitle1">
              No Record.
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default ReconciliationListGrid;
