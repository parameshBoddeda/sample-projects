import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme, lighten } from '@material-ui/core/styles';
import { Paper, Typography, Box, IconButton, CircularProgress, Button } from '@mui/material';
//import EditIcon from '@mui/material/icons/Edit';
//import { DataGrid } from '@mui/material/data-grid';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import LoadingAppUI from "../../../sharedComponents/emptyStateUIContainers/LoadingAppUI"
import RouteConstants from '../../../common/RouteConstants';
import { withRouter } from 'react-router-dom';
//import { ReSubmitONBDocument } from '../../services/common.service';

import Fade from '@mui/material/Fade';
import Helper from '../../../common/Helper';

const useStyles = makeStyles((theme) => ({
    root: {
        display: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    panelHeader: {
        padding: theme.spacing(1, 2, 1, 2),
    },
    titleHeader: {
        color: '#677790',
        position: 'relative',
        paddingBottom: theme.spacing(1),
        textTransform: 'uppercase',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '35%',
            background: '#677790',
            height: '2px',
            left: '0',
            bottom: '0',
        },
    },
    reviewAll: {
        color: '#1d428a',
    },
    designationText: {
        color: '#bfbfbf',
    },
    table: {
        minWidth: 750,
    },
    employeeTable: {
        maxHeight: '235px',
        overflowY: 'auto',
        '& .MuiTableCell-head': {
            background: '#fafafa',
            color: '#bfbfbf !important',
        },
        '& .MuiTableCell-root': {
            padding: theme.spacing(.625, 2),
            color: '#677790',
            '& .MuiSvgIcon-root': {
                width: '.8em',
                height: '.8em',
            },
        },
    },

    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    notify: {
        height: "220px",
        textAlign: "center"
    },
    cursor: {
        cursor: 'pointer',
    },
    loaderPlaceholder: {
        height: 40,
        textAlign: 'center'
    },
    pending: {
        color: '#fff',
        padding: '0 5px',
        display: 'inline-block',
        borderRadius: theme.spacing(.5),
        background: '#fdd835',
        fontSize: '.75rem',
    },
    failed: {
        color: '#fff',
        padding: '0 5px',
        display: 'inline-block',
        borderRadius: theme.spacing(.5),
        background: '#C8102E',
        fontSize: '.75rem',
    },
    completed: {
        color: '#fff',
        padding: '0 5px',
        display: 'inline-block',
        borderRadius: theme.spacing(.5),
        background: '#43a047',
        fontSize: '.75rem',
    },
    notRequired: {
        color: '#fff',
        padding: '0 5px',
        display: 'inline-block',
        borderRadius: theme.spacing(.5),
        background: '#24428a',
        fontSize: '.75rem',
    },
    pagination: {
        '& .MuiTablePagination-actions': {
            '& button': {
                '&::after': {
                    display: 'none !important',
                },
            },
        },
    },
}));

const BuildInventory = (props) => {
    const classes = useStyles();
    const AllRecords = props.AllRecords;
    const headCells = props.headCells;
    function descendingComparator(a, b, orderBy) {
        //console.log(b[orderBy]);
        //console.log(a[orderBy]);
        if (typeof (b[orderBy]) == "number" || b[orderBy] === null || a[orderBy] === null) {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
        }
        else {
            if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
                return -1;
            }
            if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
                return 1;
            }
        }

        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        if (array === null)
            return;
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getDocumentstatus(status) {

        return (
            <>
                { status === "Completed" &&
                    <Typography variant="subtitle2" className={classes.completed}>{status}</Typography>
                }
                { status === "Not Required to Upload" &&
                    <Typography variant="subtitle2" className={classes.notRequired}>{status}</Typography>
                }
                { status === "Failed" &&
                    <Typography variant="subtitle2" className={classes.failed}>{status}</Typography>
                }
                { status === "Pending" &&
                    <Typography variant="subtitle2" className={classes.pending}>{status}</Typography>
                }
            </>
        );
    }

    function getAction(doc) {

        return (
            <>
                { doc.processStatus === "3" &&
                    !loading && <Button className={classes.nonHireBtn}
                        onClick={(e) => {
                            e.preventDefault();
                            //reSubmitONBDocument(doc);
                        }}
                        variant="contained" size="small" color="primary">
                        ReSubmit
                     </Button>

                }
                {loading && <Box className={classes.loaderPlaceholder}>
                    <Fade
                        in={loading}
                        style={{
                            transitionDelay: loading ? '800ms' : '0ms',
                        }}
                        unmountOnExit>
                        <CircularProgress />
                    </Fade>
                </Box>
                }

            </>
        );
    }

    
    function EnhancedTableHead(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            {headCell.id !== "header_action" ?
                                (
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                        {orderBy === headCell.id ? (
                                            <span className={classes.visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>
                                        ) : null}
                                    </TableSortLabel>
                                ) :
                                <>
                                    {headCell.label}
                                </>
                            }

                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        classes: PropTypes.object.isRequired,
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };
    const [loader, setLoader] = useState(true);
    const [noRecords, setNoRecords] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('employeeName');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const getEmployeeAvatar = (employee) => {
        if (employee == null || employee.employeeName == null)
            return "";

        var avatar = "";
        var arrName = employee.employeeName.split(",");

        if (arrName.length > 1)
            avatar = arrName[0].charAt(0) + arrName[1].charAt(0);
        else
            avatar = employee.employeeName.charAt(0);

        return avatar;
    }
    const findKeyInHeader = (arg) => {
        if (arg !== null || arg !== undefined) {
            let found = false;
            headCells.map((item) => {
                if (item.id == arg)
                    found = true;
            });
            return found;
        }
    }
    const openEditor = (row) => {
        if (props.onEdit !== undefined) {
            props.onEdit(row);
        }
    }
    const setTimer = () => {
        setTimeout(() => {
            setLoader(false);
        }, 10000)
    }
    useEffect(() => {
        // console.log("props.AllRecords ", props.AllRecords)
        if (props.AllRecords === null) {
            setLoader(true);
            setNoRecords(false);
        } else if (props.AllRecords.length === 0) {
            setLoader(false);
            setNoRecords(true);
        } else if (props.AllRecords.length > 0) {
            setPage(0);
            setLoader(false);
            setNoRecords(false);
        }
    }, [props.AllRecords])

    let emptyRows;
    if (AllRecords !== null)
        emptyRows = rowsPerPage - Math.min(rowsPerPage, AllRecords.length - page * rowsPerPage);

    return (
        <Paper className={classes.root}>
            <Box className={classes.panelHeader} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" component="h6" className={classes.titleHeader}>{props.titleLeft}</Typography>
                <Typography variant="subtitle2" className={classes.reviewAll}>{props.titleRight}</Typography>
            </Box>

            <TableContainer className={classes.employeeTable}>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={AllRecords !== null ? AllRecords.length : 0}
                    />
                    <TableBody>
                        {(props.global !== undefined && props.global) ?
                            <TableRow>
                                <TableCell colSpan={props.colspan}>
                                    <div className={classes.notify}>Start search</div>
                                </TableCell>
                            </TableRow> : loader ?
                                <TableRow>
                                    <TableCell colSpan={props.colspan}>
                                        <LoadingAppUI circular={true} />
                                    </TableCell>
                                </TableRow>
                                : noRecords ?
                                    <TableRow>
                                        <TableCell colSpan={props.colspan}>
                                            <div className={classes.notify}>No Records. Start search...</div>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    (AllRecords !== null) ?
                                        stableSort(AllRecords, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        tabIndex={0}
                                                        key={row.name}
                                                    >
                                                        <TableCell align="left" width="10%"><Typography variant="subtitle2">{row.employeeId}</Typography></TableCell>
                                                        <TableCell id={row.employeeId} align="left" width="15%" >
                                                            <Typography variant="subtitle2" className={classes.cursor}> {row.employeeFirstLastName}</Typography>
                                                        </TableCell>
                                                        <TableCell align="left" width="25%"><Typography variant="subtitle2">{row.documentName}</Typography></TableCell>
                                                        <TableCell align="left" width="10%">{getDocumentstatus(row.processStatusOut)}</TableCell>
                                                        <TableCell align="left" width="20%"><Typography variant="subtitle2">{row.failedReason}</Typography></TableCell>
                                                        <TableCell align="left" width="10%"><Typography variant="subtitle2">{Helper.FormatDateToMMDDYYYY(row.docAddedDateOut)}</Typography></TableCell>
                                                        <TableCell align="left" width="10%"><Typography variant="subtitle2">{getAction(row)}</Typography></TableCell>

                                                    </TableRow>
                                                )

                                            }) : null}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: (53) * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={AllRecords !== null ? AllRecords.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                className={classes.pagination}
            />

        </Paper>
    )
}

export default withRouter(BuildInventory);