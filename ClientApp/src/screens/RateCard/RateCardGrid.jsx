//Global Imports Start
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@material-ui/core/styles';
//Global Imports End

//Regional Imports Start
import GridHeader from '../../sharedComponents/GridHeader/GridHeader';
import RateCardUI from './RateCardUI';
import SearchComponent from '../../sharedComponents/SearchComponent/SearchComponent';

//Regional Imports End

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Paging from '../../sharedComponents/Pagination/Paging';

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 179px)',
        overflowY: 'auto',
    },
    fabButton: {
        position: 'absolute !important',
        right: theme.spacing(10),
        bottom: theme.spacing(2),
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

const RateCardGrid = (props) => {
    const classes = useStyles();
    const rateListEnd = useRef(null);

    const filterCriteria = props.filterCriteria;
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const filterFieldsExcluded = ["partner", "asset", "unitType"] // to be decided

    const fieldLabels = {
        region: "Region",
        country: "Country",
        customer: "Customer",
        dayPart: "Day Part",
        partner: "Partner",
        mediaType: "Media Type",
        rateType: "Rate Type",
        asset: "Asset",
        unitType: "Unit Type"
    }

    const setFilterData = (filterData) => {
        props.setFilterData(filterData);

        if(filterData.length !== props.rows.length)
            setPage(1);
    }

    useEffect(()=>{
        if(props.action==='addRate'){

            rateListEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    },[props.rows]);

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
                    <GridHeader hasFilter={Object.keys(filterCriteria).length && (("region" in filterCriteria && filterCriteria.region.length) || ("country" in filterCriteria && filterCriteria.country.length) || (filterCriteria?.mediaType && "label" in filterCriteria.mediaType)) ? true : false} hideExpendIcon={props.hideExpandIcon} showIcon={true} icon="ratecard" view={props.view} page={'ratecard'} hideCheckbox={true} showScheduleIcon={false} headerText="Rate Card List">
                               {
                                    Object.keys(filterCriteria).length && (("region" in filterCriteria && filterCriteria.region.length) || ("country" in filterCriteria && filterCriteria.country.length) || (filterCriteria?.mediaType && "label" in filterCriteria.mediaType)) ?
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
                                            Object.entries(filterCriteria).map((elem) => {
                                                if(!filterFieldsExcluded.includes(elem[0])) {
                                                    if(typeof elem[1] === "object" && !Array.isArray(elem[1]) && elem[1] !== null) {
                                                        return <Box display="flex" flexDirection="column">
                                                                <Typography variant="caption">
                                                                    {fieldLabels[elem[0]]}
                                                                </Typography>
                                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={elem[1].label}>
                                                                    {elem[1].label}
                                                                </Typography>
                                                            </Box>
                                                    } else if(Array.isArray(elem[1]) && elem[1].length) {
                                                        if(elem[0] !== "region" && elem[0] !== "country") {
                                                            return <Box display="flex" flexDirection="column">
                                                                <Typography variant="caption">
                                                                    {fieldLabels[elem[0]]}
                                                                </Typography>
                                                                <Typography className={classes.ellipsisStyle} variant="caption" fontWeight={600} title={elem[1].length > 1 ? elem[1].map(x => x.label).join(", ") : ""}>
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
                                <SearchComponent
                                    restrictedFields={props.restrictedFields}
                                    setFilterData={setFilterData} jsonData={props.rows} originalData={props.originalData}
                                    setSearchItem={props.setSearchItem} searchItem={props.searchItem}
                                    applyLocalFilter={props.applyLocalFilter} resetApplyLocalFilter={props.resetApplyLocalFilter}
                                />
                            </Box>
                        </GridHeader>                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Box className={classes.contentHeight}>
                <Grid container>
                    {props.rows.length > 0 && <Grid item xs={12} sm={12} md={12}>
                        <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                            {
                                props.rows.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                                    return <RateCardUI
                                        showLoading={props.showLoading}
                                        openBackdrop={props.openBackdrop}
                                        isEditing={props.isEditing}
                                        key={index} data={data} index={index} view={props.view}
                                        refreshDataFromDB={props.refreshDataFromDB}
                                        rateCardData={props.rows}
                                        setRateCardData={props.setRateCardData}
                                    />
                                })
                            }
                        </div>
                    </Grid>}
                    {
                        props.rows.length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
                            <Paging minRows={20} currentpage={page} rows={props.rows.length}
                                rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                                handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
                            />
                        </Grid>
                    }
                    {
                        props.rows.length < 1 && <Typography pl={1} pt={1} variant="subtitle1">
                            No Record.
                        </Typography>

                    }
                </Grid>
                <Fab title="Add Rate Card" size="small" color="primary" className={classes.fabButton} aria-label="add" onClick={() => props.setAction('addRate')}>
                    <AddIcon />
                </Fab>
                <Box ref={rateListEnd}></Box>
            </Box>

        </Paper>
    )
}
export default RateCardGrid;