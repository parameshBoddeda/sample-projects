import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Collapse, Divider, Paper, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Grid';
import React, {useState} from 'react';
import Helper from '../../../common/Helper';
import GridHeader from '../../../sharedComponents/GridHeader/GridHeader';
import SearchComponent from '../../../sharedComponents/SearchComponent/SearchComponent';
import PlanningUI from './PlanningUI';
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
    }
}));


const PlanningGrid = (props) => {
    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [selectedId, setSlectedId] = React.useState();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const filterCriteria = props.filterCriteria;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleOnRowsChanged = (e) => {
        setRowsPerPage(e.target.value);
    }

    const setFilterData = (filterData) => {
        if(props.setFilterData) {
            props.setFilterData(filterData);
        }
    }

    const fieldLabels = {
        season: "Season",
        customer: "Customer",
        mediaAE: "Media AE"
    }

    const filterFieldsExcluded = []

    React.useEffect(() => {
        if (props.planData) {
            let groupedData = Helper.GroupByMultiple(props.planData, function (item) { return [item.customerName, item.planMasterId]; });
            setRows(groupedData);
            setPage(1);
        }
    }, [props.planData]);

    const checkExpand = (name) => {
        let found = false;
        expandDetail && expandDetail.forEach(eleD => {
            if (eleD === name && found === false) {
                found = true;
            }
        });
        return found;
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

    const isPlanConfirmed = (masterId) => {
        return props.planData.filter(x => x.planMasterId === masterId && x.status === 'Confirmed').length > 0;
    }

    return (
        <Paper>
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader
                            hasFilter={Object.keys(filterCriteria).length && ((filterCriteria.season && filterCriteria.season.length > 0) || (filterCriteria.mediaAE && filterCriteria.mediaAE.length > 0) || (filterCriteria.customer && filterCriteria.customer.length > 0)) ? true : false}
                            hideExpendIcon={props.hideExpendIcon} showIcon={true} icon={"mediaPlanning"} hideCheckbox={true} showScheduleIcon={false} headerText="Media Plans">
                               {
                                Object.keys(filterCriteria).length && ((filterCriteria.season && filterCriteria.season.length > 0) || (filterCriteria.mediaAE && filterCriteria.mediaAE.length > 0) || (filterCriteria.customer && filterCriteria.customer.length > 0)) ?
                                    <Box display="flex" className={classes.filterDetailsRow}>
                                        {
                                            Object.entries(filterCriteria).map((elem) => {
                                                if (!filterFieldsExcluded.includes(elem[0])) {
                                                     if (Array.isArray(elem[1]) && elem[1].length) {
                                                        if ((elem[0] !== "region" && elem[0] !== "country") || elem[0] !== "season") {
                                                            return <Box display="flex" flexDirection="column">
                                                                <Typography variant="caption">
                                                                    {fieldLabels[elem[0]]}
                                                                </Typography>
                                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={elem[1].length >= 1 ? elem[1].map(x => x.label).join(", ") : ""}>
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
                            <Box display="flex">
                                <SearchComponent setFilterData={setFilterData} jsonData={rows} originalData={props.originalPlanData}
                                    setSearchItem={props.setSearchItem}
                                    resetApplyLocalFilter={props.resetApplyLocalFilter}
                                    applyLocalFilter={props.applyLocalFilter}
                                    searchItem={props.searchItem}
                                />
                            </Box>
                        </GridHeader>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Box className={classes.contentHeight}>
                <Grid container>
                    {Object.keys(rows).length > 0 && <Grid item xs={12} sm={12} md={12}>
                        <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                            {
                                Object.keys(rows).slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((groupName, index) => {
                                    let row = rows[groupName][0];
                                    return (
                                        <Grid item xs={12}>
                                            <Box px={1}>
                                                <Grid container alignItems={"center"} className={checkExpand(groupName) ? classes.selectedDealRow : ""}>

                                                    <Grid item xs={10}>
                                                        <Grid container spacing={1}>
                                                        <Grid item xs={props.view ? 2 : 1.5}>
                                                                <Box display="flex" flexDirection="column">
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Deal Id</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography component="p" variant="subtitle2 " noWrap title={row.campaignOrAdvertiserId}>{row.campaignOrAdvertiserId}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        <Grid item xs={props.view ? 3 : 4}>
                                                                <Box display="flex" flexDirection="column">
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Customer</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            className={classes.date1}
                                                                            noWrap title={row.customerName}
                                                                        >
                                                                            {row.customerName || '-'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                          
                                                            <Grid item xs={props.view ? 3 : 4}>
                                                                <Box display="flex" flexDirection="column">
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Media Plan Name</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography component="p" variant="subtitle2 " noWrap title={row.planName}>{row.planName}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={props.view ? 2 : 1}>
                                                                <Box display="flex" flexDirection="column">
                                                                    <Box component="div">
                                                                        <Typography variant="caption">Year</Typography>
                                                                    </Box>
                                                                    <Box component="div">
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            component="div"
                                                                            className={classes.date1}
                                                                        >
                                                                            {row.year}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={2} key={`GridAction${index}`} alignItems={"center"} justifyContent="flex-end">
                                                        <Box flexDirection={'row'} alignItems={'flex-start'} display="flex" justifyContent={"flex-end"}>
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
                                                            return <PlanningUI row={row} selectedId={selectedId} data={item} IsPlanConfirmed={isPlanConfirmed(item.planMasterId)}
                                                                splitUIHandler={(action, id) => {
                                                                    setSlectedId(id);
                                                                    props.splitUIHandler(action, item);
                                                                }} view={props.view} />
                                                        })
                                                    }
                                                </Collapse>
                                                : ''}
                                            </Box>
                                        </Grid>
                                    )
                                })
                            }
                        </div>
                    </Grid>
                    }
                    {
                        Object.keys(rows).length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
                            <Paging minRows={20} currentpage={page} rows={Object.keys(rows).length}
                                rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
                            />
                        </Grid>
                    }
                    {
                        Object.keys(rows).length < 1 && <Typography pl={1} pt={1} variant="subtitle1">
                            No Record.
                        </Typography>
                    }
                </Grid>
            </Box>
            {showLoading && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <div className={'loader-div'}><div className={'loading'}></div></div>
            </Backdrop>}

        </Paper>
    )
}

PlanningGrid.displayName = "PlanningGrid";
export default PlanningGrid;