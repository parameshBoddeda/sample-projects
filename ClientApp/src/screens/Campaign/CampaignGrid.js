import React, {useState} from 'react';
import Grid from '@mui/material/Grid';
import CampaignUI from './CampaignUI';
import GridHeader from '../../sharedComponents/GridHeader/GridHeader';
import { Box, Paper, Divider } from '@mui/material';
import SearchComponent from '../../sharedComponents/SearchComponent/SearchComponent';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Paging from '../../sharedComponents/Pagination/Paging';

const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 189px)',
        overflowY: 'auto',
    },
    fabButton: {
        position: 'absolute !important',
        right: theme.spacing(10),
        bottom: theme.spacing(2),
    },
}));


const CampaignGrid = (props) => {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const setFilterData = (filterData) => {
        props.setFilterData(filterData);
        if(filterData.length !== props.rows.length)
            setPage(1);
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
                        <GridHeader view={props.view} showIcon={true} icon={"campaign"} hideCheckbox={true} showScheduleIcon={false} headerText="Campaign List">
                            <Box display="flex">
                                <SearchComponent setFilterData={setFilterData} jsonData={props.rows} 
                                    originalData={props.originalData} setSearchItem={props.setSearchItem}
                                    resetApplyLocalFilter={props.resetApplyLocalFilter} 
                                    applyLocalFilter={props.applyLocalFilter} searchItem={props.searchItem}
                                />
                            </Box>
                        </GridHeader>
                    </Box>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
            </Grid>
            <Box className={classes.contentHeight}>
                <Grid container>
                    {props.rows.length > 0 && <Grid item xs={12} sm={12} md={12}>
                        <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                            {
                                props.rows.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((data, index) => {
                                    return <CampaignUI handleCompaignUnitClick={props.handleCompaignUnitClick} 
                                    handleShowMediaPlanningContainer={props.handleShowMediaPlanningContainer}
                                    selectedBtn={props.selectedBtn} handlebudgetClick={props.handlebudgetClick} 
                                    handleCompaignEditClick={props.handleCompaignEditClick} 
                                    selectedCompaignId={props.selectedCompaignId} rowClick={props.rowClick} 
                                    isEditing={props.isEditing} data={data} view={props.view}
                                    index={index} key={'CampaignUI'+ index}
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
                    <Fab title="Add Campaign" size="small" color="primary" className={classes.fabButton} aria-label="add" onClick={() => props.handleCompaignEditClick(0, "add", 0, {})}>
                        <AddIcon />
                    </Fab>
                </Grid>
            </Box>
        </Paper>
    )
}

CampaignGrid.displayName = "CampaignGrid";
export default CampaignGrid;