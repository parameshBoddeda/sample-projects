import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import { Box, Paper, Divider, Typography, IconButton } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import SearchComponent from "../../sharedComponents/SearchComponent/SearchComponent";
import GridHeader from "../../sharedComponents/GridHeader/GridHeader";
import Helper from "../../common/Helper";
import Paging from '../../sharedComponents/Pagination/Paging';

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: "calc(100vh - 189px)",
    overflowY: "auto",
  },
  fabButton: {
    position: "absolute !important",
    right: theme.spacing(10),
    bottom: theme.spacing(2),
  },
  fixedTextWidthStyle: {  // Fix for the issue where date field text overlaps with house id field
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  filterDetailsRow: {
    columnGap: theme.spacing(3.75),
    marginRight: theme.spacing(2),
    backgroundColor: "#dfe3ec",
    padding: theme.spacing(0, 2.5),
    borderRadius: theme.spacing(.75),
    height: theme.spacing(5),
  },
  ellipsisStyle: {
    width: "110px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
}));

const ISCIgrid = (props) => {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  const setFilterData = (filterData) => {
    props.setFilterData(filterData);

    if(filterData.length !== props.rows.length)
      setPage(1);
  };

  const handleISCIEditClick = (data) => {
    props.handleISCIEditClick(data);
  };

  const filterCriteria = props.filterCriteria;

  const filterFieldsExcluded = [];
  const fieldLabels = {
      typeName: "Type",
      marketTypeId: "Market Type",
      mediaTypeId: "Media Type",
  }

  const ISCITypes = {
      1301: "Sales",
      1302: "Institutional"
  }

  const marketTypes = {
      111: "Domestic",
      112: "International",
      113: "Both"
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleOnRowsChanged = (e) => {
    setRowsPerPage(e.target.value);
  }

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Box p={1}>
            <GridHeader
              view={props.view}
              showIcon={true}
              icon={"ISCI"}
              hideCheckbox={true}
              showScheduleIcon={false}
              headerText="ISCI List"
              hasFilter={Object.keys(filterCriteria).length 
                || (("startDate" in filterCriteria && filterCriteria.startDate) 
                || ("endDate" in filterCriteria && filterCriteria.endDate) 
                || ("marketTypeId" in filterCriteria && filterCriteria.marketTypeId) 
                || ("typeName" in filterCriteria && filterCriteria.typeName) 
                || ("mediaTypeId" in filterCriteria && filterCriteria.mediaTypeId.length > 0 ? true : false))}
            >
              {
                  Object.keys(filterCriteria).length 
                  && (("marketTypeId" in filterCriteria && filterCriteria.marketTypeId)  
                  ||  ("mediaTypeId" in filterCriteria && filterCriteria.mediaTypeId.length > 0 ? true : false)
                  || ("typeName" in filterCriteria && filterCriteria.typeName)
                  || ("startDate" in filterCriteria && filterCriteria.startDate) 
                  || ("endDate" in filterCriteria && filterCriteria.endDate)) ?
                  <Box display="flex" className={classes.filterDetailsRow}>
                    {
                      filterCriteria.startDate || filterCriteria.endDate ?
                        <Box display="flex" flexDirection="column">
                          <Typography variant="caption">
                            Start Date | End Date
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {filterCriteria.startDate ? Helper.FormatDate(filterCriteria.startDate) : "-- "} | {filterCriteria.endDate ? Helper.FormatDate(filterCriteria.endDate) : " --"}
                          </Typography>
                        </Box> : ""
                    }
                    {
                      Object.entries(filterCriteria).map((elem) => {
                        if (!filterFieldsExcluded.includes(elem[0])) {
                          if (typeof elem[1] === "object" && !Array.isArray(elem[1]) && elem[1] !== null) {
                            return <Box display="flex" flexDirection="column">
                              <Typography variant="caption">
                                {fieldLabels[elem[0]]}
                              </Typography>
                              <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600}>
                                {elem[1].label}
                              </Typography>
                            </Box>
                          } else if (Array.isArray(elem[1]) && elem[1].length) {
                            if (elem[0] === "mediaTypeId") {
                              return <Box display="flex" flexDirection="column">
                                <Typography variant="caption">
                                  {fieldLabels[elem[0]]}
                                </Typography>
                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={elem[1].length > 1 ? elem[1].map(x => x.label).join(", ") : ""}>
                                  {/* {elem[1].length === 1 ? elem[1][0].label : `${elem[1][0].label}...`} */}
                                  {elem[1].length > 1 ? elem[1].map(x => x.label).join(", ") : elem[1][0].label}
                                </Typography>
                              </Box>
                            }
                          } else if(typeof(elem[1]) === "string"){
                            if (elem[0] === "typeName") {
                              return <Box display="flex" flexDirection="column">
                              <Typography variant="caption">
                                {fieldLabels[elem[0]]}
                              </Typography>
                              <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600}>
                                {elem[1]}
                              </Typography>
                            </Box>
                          }
                        }
                      }
                      })
                    }
                  </Box>
                  : ''
              }
              <Box display="flex">
                <SearchComponent
                  setFilterData={setFilterData}
                  restrictedFields={props.restrictedFields}
                  searchItem={props.searchItem}
                  jsonData={props.rows}
                  originalData={props.OrgRows}
                  setSearchItem={props.setSearchItem}
                  resetApplyLocalFilter={props.resetApplyLocalFilter}
                  applyLocalFilter={props.applyLocalFilter}
                />
              </Box>
            </GridHeader>
          </Box>
          <Divider sx={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Box className={classes.contentHeight}>
        <Grid container>
          {
            props.rows.length > 0 && <Grid item xs={12} sm={12} md={12}>
              <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                {
                  props.rows.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                    return (
                      <ISCIgridItem
                        view={props.view}
                        selectedISCIId={props.selectedISCIId}
                        data={data}
                        index={index}
                        handleISCIEditClick={(data) => handleISCIEditClick(data)}
                      />
                    );
                  })}
                </div>
              </Grid>
            }
          {
            props.rows.length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
              <Paging minRows={20} currentpage={page} rows={props.rows.length}
                rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
              />
            </Grid>
          }

          {
            props.rows.length < 1 ? <Typography pl={1} pt={1} variant="subtitle1">
              No Record.
            </Typography> : ""
          }
          
          <Fab
            title="Add ISCI"
            size="small"
            color="primary"
            className={classes.fabButton}
            aria-label="add"
            onClick={() => props.handleISCIAddClick()}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Box>
    </Paper>
  );
};

ISCIgrid.displayName = "ISCIgrid";
export default ISCIgrid;

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ISCIgridItem = (props) => {
  let { data, index, view } = props;
  const classes = useStyles();

  const handleISCIEditClick = (data) => {
    if (props.handleISCIEditClick) {
      props.handleISCIEditClick(data);
    }
  };

  return (
    <React.Fragment>
      <Grid key={`Grid${props.index}`} item xs={12}>
        <Box px={1} pb={.5}>
          <Grid container>
            <Grid item xs={11.75}>
              <Grid container spacing={1} marginTop={0}>
                <Grid item xs={props.view ? 1 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Type</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.typeName}>
                        {data.typeName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={props.view ? 0.8 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Market Type</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.marketTypeName}>
                        {data.marketTypeName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={props.view ? 0.75 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Media Type</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.mediaTypeName}>
                        {data.mediaTypeName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={props.view ? 0.8 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">ISCI</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.isci}>{data.isci}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={props.view ? 0.7 : 2.5}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Title</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.title}>{data.title}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? .70 : 2}>
                  <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="caption">Start Date</Typography>                        
                      </Box>
                      <Box component="div">
                      <Typography variant="subtitle2">
                          {Helper.FormatDate(data.flightStartDate)}
                        </Typography>
                      </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? .70 : 2}>
                  <Box display="flex" flexDirection="column">
                <Box component="div">
                        <Typography variant="caption" noWrap>End Date</Typography>                        
                      </Box>
                      <Box component="div">
                      <Typography variant="subtitle2" noWrap title={Helper.FormatDate(data.flightEndDate)}>
                          {Helper.FormatDate(data.flightEndDate)}
                        </Typography>
                      </Box>
                      </Box>
                </Grid>
                <Grid item xs={props.view ? .70 : 2}>
                <Box display="flex" flexDirection="column">
                  <Box component="div">
                  <Typography variant="caption" noWrap >Delivery Date</Typography>
                  </Box>
                  <Box component="div">
                  <Typography variant="subtitle2" noWrap title={Helper.FormatDate(data.deliveryDate)}>
                          {Helper.FormatDate(data.deliveryDate)}
                        </Typography>
                  </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 0.65 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">House Id</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.houseId} className={classes.fixedTextWidthStyle}>
                        {data.houseId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 0.8 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Running Time</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.runningTime}>
                        {data.runningTime}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">{data?.typeName?.toLowerCase() === 'sales'? 'Advertiser' : 'Campaign' }</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.campaignOrAdvertiserName}>
                        {data.campaignOrAdvertiserName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1 : 2}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">{data?.typeName?.toLowerCase() === 'sales'? 'Brand' : 'Category' }</Typography>
                    </Box>
                    <Box component="div">
                      <Typography
                        variant="subtitle2"
                        component="div"
                        noWrap
                        title={data.categoryName || data.productName}
                      >
                        {data.categoryName || data.productName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1 : 4}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Content Link</Typography>
                    </Box>
                    <Box component="div">
                      <Typography variant="subtitle2" noWrap title={data.contentLink}>
                        {data.contentLink ? <a target="_blank" href={data.contentLink}>{data.contentLink}</a> : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={props.view ? 1.4 : 6}>
                  <Box display="flex" flexDirection="column">
                    <Box component="div">
                      <Typography variant="caption">Comment</Typography>
                    </Box>
                    <Box component="div">
                      <Typography noWrap title={data.comment}
                        variant="subtitle2"
                        component="div"
                      >
                        {data.comment}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={.25}>
              <Box
                key={`GridAction${props.index}`}
                display="flex"
                justifyContent="flex-end"
              >
                <IconButton
                  title="Edit ISCI"
                  className={`${classes.iconColor}
                                    ${
                                      props.selectedISCIId === data.id
                                        ? classes.selectedbtn
                                        : ""
                                    }`}
                  size="small"
                  onClick={() => handleISCIEditClick(data)}
                >
                  <CreateOutlinedIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Divider sx={{ width: "100%" }} />
    </React.Fragment>
  );
};
