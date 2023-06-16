import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Collapse, Divider, Paper, Typography, TextField, MenuItem } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Grid';
import React, { useContext, useState } from 'react';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Helper from '../../../common/Helper';
import AppDataContext from '../../../common/AppContext';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import SearchComponent from '../../../sharedComponents/SearchComponent/SearchComponent';
import DigitalTraffickingUI from './DigitalTraffickingUI';
import Dropdown from '../../../sharedComponents/Dropdown/Dropdown';
import ReportViewer from '../../../sharedComponents/ReportViewer/ReportViewer';
import DrawerComponent from '../../../sharedComponents/Drawer/DrawerComponent';
import { GetReportUrl } from "../../../services/common.service";
import Paging from '../../../sharedComponents/Pagination/Paging';

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 186px)',
        overflowY: 'auto',
    },
    fabButton: {
        position: 'absolute !important',
        right: theme.spacing(10),
        bottom: theme.spacing(2),
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }

    },
    selectedItem: {
        '& svg': {
            color: '#94d584',
        }
    },
    selectedDealRow: {
        backgroundColor: "#f0f7ff",
    },
    infoIcon: {
        marginRight: theme.spacing(1),
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
    },
    reportDrawer: {
        "& .MuiDrawer-paper": {
            width: "50%",
            margin: "50px 0 0 0px",
            padding: theme.spacing(0, 1),
        },
    },
}));


const DigitalTraffickingGrid = (props) => {
    const classes = useStyles();
    const filterCriteria = props.filterCriteria;
    const { leagueId } = useContext(AppDataContext);
    const [rows, setRows] = React.useState([]);
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [selectedStatus, setSelectedStatus] = React.useState("All");
    
    const [reportType, setReportType] = useState("");
    const [reportUrl, setReportUrl] = useState("");
    const [planId, setPlanId] = useState("");
    const [campaignOrDealId, setCampaignOrDealId] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);


    const filterFieldsExcluded = [""] // to be decided
  const fieldLabels = {
    region: "Region",
    country: "Country",
    mediaType: "Media Type",
    asset: "Asset",
  }
    const checkExpand = (name) => {
        let found = false;
        expandDetail && expandDetail.forEach(eleD => {
            if (eleD === name && found === false) {
                found = true;
            }
        });
        return found;
    }

    React.useEffect(() => {
        if (props.rows) {
            let groupedData = Helper.GroupBy(props.rows, 'planId');
            setRows(groupedData);
            setPage(1);
        }
    }, [props.rows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleOnRowsChanged = (e) => {
        setRowsPerPage(e.target.value);
    }

    const handleExpandDetail = (name) => {
        let list = [...expandDetail];
        if (list.length > 0) {
            let index = list.findIndex(x => x === name);
            if (index === -1)
                list.push(name);
            else
                list.splice(index, 1);
        } else {
            list.push(name);
        }
        setExpandDetail(list);
    }

    const handleStatusChange = (name, value) => {
        setSelectedStatus(value.label);
        if (props.setFilterCriteria) {
            props.setFilterCriteria(name, value);
        }
        props.callAPI(name, value);
    }

    const viewReport = (planType, planId, campaignOrDealId)=>{
        let settingName = '';
        if (planType === 'Campaign')
            settingName = 'campaignReportUrl';
        else
            settingName = 'mediaPlanReportUrl';

        GetReportUrl("ReportUrls", settingName).then(data => {
            setReportUrl(data);
            setCampaignOrDealId(campaignOrDealId);
            if (planType === 'Campaign')
            {
                setPlanId(planId);
                setReportType('CampaignReport');
            }
            else{
                setPlanId("&rp:PlanID=" + planId);
                setReportType('MediaReport');
            }

            setShowReport(true);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <Paper>
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader view={true}
                            hasFilter={Object.keys(filterCriteria).length > 0 && (("startDate" in filterCriteria && filterCriteria.startDate) || ("endDate" in filterCriteria && filterCriteria.endDate)) ? true : false}
                            hideExpendIcon={props.hideExpendIcon} showIcon={true} icon={"digitalPlans"} hideCheckbox={true} showScheduleIcon={false} headerText="Digital Plans">
                            <Box display={"flex"}>
                                {
                                    Object.keys(filterCriteria).length && (("startDate" in filterCriteria && filterCriteria.startDate) || ("endDate" in filterCriteria && filterCriteria.endDate) || ("region" in filterCriteria && filterCriteria.region.length) || ("country" in filterCriteria && filterCriteria.country.length) || ("network" in filterCriteria && filterCriteria.network.length) || (filterCriteria?.mediaType && "label" in filterCriteria.mediaType)) ?
                                        <Box display="flex" className={classes.filterDetailsRow}>
                                            {
                                                (Array.isArray(filterCriteria.country) && filterCriteria.country.length) || (Array.isArray(filterCriteria.region) && filterCriteria.region.length) ?
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography variant="caption">
                                                            {filterCriteria.country.length ? 'Country' : filterCriteria.region.length ? 'Region' : ''}
                                                        </Typography>
                                                        <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={filterCriteria.country.length ? filterCriteria.country.map(x => x.label).join(", ") : filterCriteria.region.map(x => x.label).join(", ")}>
                                                            {filterCriteria.country.length ? (filterCriteria.country.length > 1 ? filterCriteria.country.map(x => x.label).join(", ") : filterCriteria.country[0].label) : (filterCriteria.region.length > 1 ? filterCriteria.region.map(x => x.label).join(", ") : filterCriteria.region[0].label)}
                                                        </Typography>
                                                    </Box> : ""
                                            }
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
                                                            if (elem[0] !== "region" && elem[0] !== "country") {
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
                                                        }
                                                    }
                                                })
                                            }
                                        </Box>
                                        : ''
                                }
                            </Box>
                            
                            <Grid                                
                                item
                                xs={2}
                                display="flex"
                                justifyContent="flex-end"
                                ml={2}
                                mr={2}
                            >

                                <Dropdown size="small" name="status" fullWidth lbldropdown="Status" value={selectedStatus}
                                    ddData={[
                                        {
                                            label: "All",
                                            value: 2,
                                        },
                                        {
                                            label: "Pending Confirm",
                                            value: 3,
                                        },
                                        {
                                            label: "Confirmed",
                                            value: 4,
                                        },
                                        {
                                            label: "Trafficked",
                                            value: 1,
                                        },
                                        {
                                            label: "Not Trafficked",
                                            value: 5,
                                        },
                                        
                                    ]}
                                    handleChange={handleStatusChange}
                                />
                            </Grid>
                            <Box display="flex">
                                <SearchComponent setFilterData={props.setFilterData} jsonData={props.rows}
                                    originalData={props.originalData} setSearchItem={props.setSearchItem}
                                    restrictedFields={props.restrictedFields} searchItem={props.searchItem}

                                />
                            </Box>
                        </GridHeader>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Box className={classes.contentHeight}>
                <Grid container>
                    {Object.keys(rows).length > 0 &&<Grid item xs={12} sm={12} md={12}>
                        <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                            <Grid container>
                                {Object.keys(rows).slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((groupName, index) => {
                                    let row = rows[groupName][0];
                                    return (
                                        <Grid key={"digiTrafficGrid_"+index} item xs={12}>
                                            <Box px={1}>
                                                <Grid container alignItems={"center"} className={checkExpand(groupName) ? classes.selectedDealRow : ""}>

                                                    <Grid item xs={11.5}>
                                                        <Grid container spacing={1}>

                                                            <Grid item xs={3}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Campaign/Advertiser</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.campaignOrAdvertiser}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.campaignOrAdvertiser}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Plan ID</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.planId}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.planId}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={3}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Plan Name</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.planName}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.planName}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={1.5}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Media Plan Status</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.mediaPlanStatus}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.mediaPlanStatus}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={.5}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Version</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.unitSizes}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.version}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={1}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Media Type</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.mediaTypeName}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.mediaTypeName}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={1}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Region</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.regionName}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.regionName}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={1}>
                                                                <Box display="flex" flexDirection="column" pl={1}>
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Country</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            noWrap
                                                                            title={row.country}
                                                                            className={classes.control}
                                                                        >
                                                                            {row.country}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>                                                    

                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={.5} key={`GridAction${index}`} alignItems={"center"} justifyContent="flex-end">
                                                        <Box flexDirection={'row'} alignItems={'flex-start'} display="flex" justifyContent={"flex-end"}>
                                                            <IconButton title="Download Plan report" className={classes.done}
                                                                size="small" onClick={() => { viewReport(row.planTypeName, row.planId, row.dealId);}}>
                                                                <DownloadOutlinedIcon />
                                                            </IconButton>
                                                            <IconButton title="Details" className={checkExpand(groupName) ? classes.selectedbtn : ''} size="small" onClick={() => handleExpandDetail(groupName)} >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                    <Divider sx={{ width: '100%' }} />
                                                </Grid>
                                                {checkExpand(groupName) ? <Collapse in={checkExpand(groupName) ? true : false}>
                                                    {
                                                        rows[groupName].filter(x => x.status !== 'Cancelled').map(item => {
                                                            return <DigitalTraffickingUI index={index} data={item} notifySuccess={props.notifySuccess}
                                                                refreshList={props.refreshList} splitUIHandler={(action, id) => {
                                                                    props.splitUIHandler(action, item);
                                                                }} view={props.view} notifyWarning={props.notifyWarning} 
                                                                setShowLoading={props.setShowLoading} setOpenBackdrop={props.setOpenBackdrop}
                                                                />
                                                        })
                                                    }
                                                </Collapse>
                                                    : ''}
                                            </Box>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                    </Grid>}
                    {
                        Object.keys(rows).length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
                            <Paging minRows={20} currentpage={page} rows={Object.keys(rows).length}
                                rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
                            />
                        </Grid>
                    }

                    {showReport &&
                        <DrawerComponent
                            open={showReport} variant={"temporary"}
                            handleDrawerClose={() => setShowReport(false)}
                            handleDrawerOpen={() => setShowReport(true)}
                            anchor={"right"}
                            className={classes.reportDrawer}
                        >
                            <ReportViewer hideExpandIcon={true} planId={planId} leagueId={leagueId} url={reportUrl}
                                type={reportType} campaignOrDealId={campaignOrDealId} handleClose={() => setShowReport(false)} showCloseIcon={true} />
                        </DrawerComponent>
                    }

                    {
                        props.rows && props.rows.length < 1 ? <Typography pl={1} pt={1} variant="subtitle1">
                            No Record.
                        </Typography> : ""
                    }

                </Grid>
            </Box>

        </Paper>
    )
}

DigitalTraffickingGrid.displayName = "DigitalTraffickingGrid";
export default DigitalTraffickingGrid;