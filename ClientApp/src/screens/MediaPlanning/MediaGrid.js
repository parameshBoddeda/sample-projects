import * as React from 'react';
import Grid from '@mui/material/Grid';
import MediaUI from './MediaUI';
import GridHeader from '../../sharedComponents/GridHeader/GridHeader';
import { Box, Paper, Divider, Typography } from '@mui/material';
import SearchComponent from '../../sharedComponents/SearchComponent/SearchComponent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 189px)',
        overflowY: 'auto',
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

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const MediaGrid = (props) => {
    const classes = useStyles();
    const setFilterData = (filteredRows, status) => {
        props.setFilterData(filteredRows, status);
    }

    const filterCriteria = props.filterCriteria;

    return (
        <Paper>
            <Grid container>
                <Grid item xs={12}>
                    <Box p={1}>
                        <GridHeader hasFilter={Object.keys(filterCriteria).length && (("year" in filterCriteria && filterCriteria.year > 0) || ("customer" in filterCriteria && filterCriteria.customer.length > 0))} view={props.view} hideExpendIcon={props.hideExpendIcon} showIcon={true} icon={"media"} hideCheckbox={true} showScheduleIcon={false} headerText="Sponsorship Deal">
                        {
                            Object.keys(filterCriteria).length && (("year" in filterCriteria && filterCriteria.year > 0) || ("customer" in filterCriteria && filterCriteria.customer.length > 0) || ("marketType" in filterCriteria)) ?
                                <Box display="flex" className={classes.filterDetailsRow}>
                                    {
                                        filterCriteria.year > 0 ?
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="caption">
                                                    Year
                                                </Typography>
                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600}>
                                                    {filterCriteria.year}
                                                </Typography>
                                            </Box> : ''
                                    }
                                    {
                                        filterCriteria.customer.length ?
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="caption">
                                                    Customer
                                                </Typography>
                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={filterCriteria.customer.length > 1 ? filterCriteria.customer.map(x => x.label).join(", ") : filterCriteria.customer[0].label}>
                                                    {filterCriteria.customer.length > 1 ? filterCriteria.customer.map(x => x.label).join(", ") : filterCriteria.customer[0].label}
                                                </Typography>
                                            </Box> : ''
                                    }
                                    {
                                        filterCriteria.marketType?.label ?
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="caption">
                                                    Market Type
                                                </Typography>
                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={filterCriteria.marketType?.label}>
                                                    {filterCriteria.marketType?.label}
                                                </Typography>
                                            </Box> : ''
                                    }
                                </Box>  : ''
                            }
                            <Box display="flex">
                                <SearchComponent restrictedFields={[]} setFilterData={setFilterData} enableCustomFilter={true} jsonData={props.rows} originalData={props.originalData}
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
            <Grid container className={classes.contentHeight}>
                <MediaUI selectedBtn={props.selectedBtn} selectedInventoryId={props.selectedInventoryId}
                    selectedBudgetIndex={props.selectedBudgetIndex}
                    handlebudgetClick={props.handlebudgetClick}
                    handleDealEditClick={props.handleDealEditClick} handleExpandDetail={props.handleExpandDetail} expandDetail={props.expandDetail}
                    selectedDealId={props.selectedDealId} rowClick={props.rowClick} handleShowPlanning={props.handleShowPlanning}
                    isEditing={props.isEditing} data={props.rows} view={props.view}
                />
            </Grid>
        </Paper>
    )
}

MediaGrid.displayName = "MediaGrid";
export default MediaGrid;