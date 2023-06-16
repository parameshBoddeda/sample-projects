import React, { useState} from "react";
import { MenuItem, TextField, Typography, Box } from "@mui/material"
import Pagination from '@mui/material/Pagination';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    contentHeight: {
        height: 'calc(100vh - 189px)',
        overflowY: 'auto',
    },
}));

const Paging =(props)=>{
    const classes = useStyles();
    const [ minRows ] = useState(props.minRows ?? 20);

    const handleOnRowsChanged = (e) => {
        props.handleOnRowsChanged(e);
        if (props.rows <= e.target.value)
            props.handleChangePage(e, 1);
        else if ((props.currentpage * e.target.value) > props.rows)
            props.handleChangePage(e, 1);
    }

    return(
        <Box display="flex" flex="1" alignItems="center" justifyContent="center" >
            <Typography variant="subtitle2" color="secondary" mr={3}>Total# {props.rows}</Typography>
            <Pagination count={Math.ceil(props.rows / props.rowsPerPage)} showFirstButton showLastButton 
                page={props.currentpage} onChange={props.handleChangePage} color="primary" >
            </Pagination>
            <TextField
                id="paginationList" select
                value={props.rowsPerPage}
                onChange={(event) => handleOnRowsChanged(event)}
                variant="outlined"size="small" color="primary"
                style={{ width: "16ch", paddingLeft: '24px' }}
                className={classes.sorting}
            >
                <MenuItem key={'Paging_' + (minRows)}     value={minRows}>    {minRows}</MenuItem>
                {((minRows * 1) < props.rows ) && <MenuItem key={'Paging_' + (minRows * 2)} value={minRows * 2}>{minRows * 2}</MenuItem>}
                {((minRows * 2) < props.rows ) && <MenuItem key={'Paging_' + (minRows * 3)} value={minRows * 3}>{minRows * 3}</MenuItem>}
                {((minRows * 3) < props.rows ) && <MenuItem key={'Paging_' + (minRows * 4)} value={minRows * 4}>{minRows * 4}</MenuItem>}
                {((minRows * 4) < props.rows ) && <MenuItem key={'Paging_' + (minRows * 5)} value={minRows * 5}>{minRows * 5}</MenuItem>}
            </TextField>            
        </Box>
    )
}

Paging.propTypes = {
    minRows: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    currentpage: PropTypes.number.isRequired,
    handleChangePage: PropTypes.func,
    handleOnRowsChanged: PropTypes.func,
};
export default Paging;