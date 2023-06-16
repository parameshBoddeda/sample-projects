import React, {useState} from 'react';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import Collapse from '@mui/material/Collapse';
import { Grid, Box, Divider } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Helper from '../../common/Helper';

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import Paging from '../../sharedComponents/Pagination/Paging';
import RedStatus from "../../sharedComponents/customIcons/RedStatus";

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#dfe3ec',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      marginRight: '16px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#dfe3ec',
      },
  }));

const useStyles = makeStyles(theme => ({
    iconColor: {
        color: '#424242 !important',
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
    },
    selectedDealRow: {
        backgroundColor: "#f0f7ff",
    },
    
    selected: {
        background: "#e4ecff"
    },
    statusIcon: {
        "& .MuiSvgIcon-root": {
            height: "15px",
            width: "15px",
            display: "flex",

            alignItems: "flex-end",
            justifyContent: "center",
        },
    },
}));

const MediaAccordion = (props) => {
    const classes = useStyles();
    const [expandDetail, setExpandDetail] = React.useState([]);
    const [showLoading, setShowLoading] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleOnRowsChanged = (e) => {
        setRowsPerPage(e.target.value);
    }

    const handleDealEditClick = (dealId, btnName) => {
        if (props.isEditing) {
            return false;
        }
        if (props.handleDealEditClick) {
            props.handleDealEditClick(dealId, btnName);
        }
    }

    const handlebudgetClick = (event, dealId, index) => {
        event.stopPropagation()
        if (props.isEditing) {
            return false;
        }
        if (props.handleDealEditClick) {
            props.handlebudgetClick(dealId, index);
        }
    }

    const handleExpandDetail = (dealId) => {

        let indexes = [...expandDetail];
        if (indexes.length > 0) {
            let found = false;
            indexes.map((ele, index) => {
                if (ele.id === dealId) {
                    indexes = indexes.filter(fliterEle => fliterEle.id !== dealId);
                    found = true;
                }
            });
            if (!found) {
                indexes.push({ id: dealId });
            }
        } else {
            indexes.push({ id: dealId });
        }
        setExpandDetail(indexes);

    }

    const checkExpand = (id) => {
        let found = false;
        expandDetail && expandDetail.forEach(eleD => {
            if (eleD.id === id && found === false) {
                found = true;
            }
        });
        return found;
    }
    const todayDate = new Date();
    let currentYear = todayDate.getFullYear();
    return (
        <>
            {props.data && props.data.length > 0 && <Grid item xs={12} sm={12} md={12}>
                <div style={{ height: 'calc(100vh - 240px)', overflowY: 'auto' }} >
                    {
                        props.data.slice((page * rowsPerPage) - rowsPerPage, page * rowsPerPage).map((ele, index) => {
                            return (
                                <Box>
                                    <Grid container alignItems={"center"} className={`${props.selectedDealId === ele.dealId ? classes.selectedDealRow : ''}`}>
                                        <Grid item xs={props.view ? 11 : 10}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={.4}>
                                                    <Box title="Lost Deal"
                                                        display="flex"
                                                        className={classes.statusIcon}
                                                        alignItems="baseline"
                                                        pl={1}
                                                    >
                                                        {ele.isActive === false ? <RedStatus /> : <></>}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2.6}>
                                                    <Box display="flex">
                                                        <Box pl={1}>
                                                            <Box component="div">
                                                                <Typography variant="caption">Deal Id</Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography variant="subtitle2 ">{ele.dealId || "-"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Box display="flex">
                                                        <Box pl={1}>
                                                            <Box component="div">
                                                                <Typography variant="caption">Customer</Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography variant="subtitle2 ">{ele.customer || "-"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <Box display="flex">
                                                        <Box pl={1}>
                                                            <Box component="div">
                                                                <Typography variant="caption">Deal Leader</Typography>
                                                            </Box>
                                                            <Box component="div">
                                                                <Typography variant="subtitle2 ">{ele.dealLeader || "-"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Box display="flex" alignItems="center">
                                                            <Box component="div" display="flex" flexDirection="column">
                                                                <Typography variant="caption">Start Date</Typography>
                                                                <Typography variant="subtitle2 ">
                                                                    {Helper.FormatDate(ele.startDate) || '-'}
                                                                </Typography>
                                                            </Box>
                                                            <Box display="flex" flexDirection="column">
                                                                <Box mr={.5} ml={.5} lineHeight={1.2}>|</Box>
                                                                <Box mr={.5} ml={.5} lineHeight={1.2}>|</Box>
                                                            </Box>
                                                            <Box component="div" display="flex" flexDirection="column">
                                                                <Typography variant="caption">End Date</Typography>
                                                                <Typography variant="subtitle2 ">
                                                                    {Helper.FormatDate(ele.endDate) || '-'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                        <Grid xs={props.view ? 1 : 2} key={`GridAction${index}`} alignItems={"center"} justifyContent="flex-end">
                                            <Box display="flex" flexDirection={props.view ? 'row' : 'column'} alignItems={props.view ? 'center' : 'flex-end'} justifyContent={"flex-end"} pr={1.5}>
                                                {/*<IconButton title="Additional  Deal Information" size="small" className={`${classes.iconColor} ${props.selectedDealId === ele.dealId && props.selectedBtn === "deal" ? classes.selectedbtn : ''}`} onClick={() => handleDealEditClick(ele.dealId, "deal")}>*/}
                                                {/*    <LocalOfferOutlinedIcon />*/}
                                                {/*</IconButton>*/}
                                                <IconButton title="Details" className={checkExpand(ele.dealId) ? classes.selectedbtn : ''} size="small" onClick={() => handleExpandDetail(ele.dealId)} >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        <Divider sx={{ width: '100%' }} />
                                    </Grid>
                                    <Collapse in={checkExpand(ele.dealId) ? true : false}>
                                        {
                                            checkExpand(ele.dealId) && ele.advertiserBudgetItems.length > 0 && ele.advertiserBudgetItems.map((descEle, descEleIndex) => {
                                                return <>

                                                    <Box px={1.5}>
                                                        <Grid container className={props.selectedInventoryId && descEle.inventoryId === props.selectedInventoryId ? classes.selected : ""}>
                                                            <Grid item xs={1}>
                                                                <Box display="flex">
                                                                    <Box pl={1} py={1}>
                                                                        <Box component="div">
                                                                            <Typography variant="caption">Year</Typography>
                                                                        </Box>
                                                                        <Box component="div">
                                                                            <Typography variant="subtitle2 ">{descEle.year}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <Box display="flex">
                                                                    <Box pl={1} py={1}>
                                                                        <Box component="div">
                                                                            <Typography variant="caption">Amount</Typography>
                                                                        </Box>
                                                                        <Box component="div">
                                                                            <Typography variant="subtitle2 ">{Helper.ConvertToDollarFormat(descEle.amount)}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid xs={9} container alignItems="center" justifyContent="flex-end">
                                                                <Box display="flex" >
                                                                    <IconButton title="Media Plan" size="small" onClick={() => props.handleShowPlanning(descEle.amount, ele.dealId, descEle.year, ele.startDate, ele.endDate, descEle.inventoryId, descEle.seasonStartDate, descEle.seasonEndDate, descEle )}>
                                                                        <FormatAlignLeftIcon />
                                                                    </IconButton>

                                                                </Box>

                                                                <Box display="flex">
                                                                    <LightTooltip title={

                                                                        <>
                                                                            <Grid container>
                                                                                {
                                                                                    descEle.budgetDetails && descEle.budgetDetails.length > 0 ?

                                                                                        descEle.budgetDetails.map((eleBd, indexBd) => {

                                                                                            return <>
                                                                                                <Grid item xs={12}>
                                                                                                    <Typography noWrap variant="subtitle1">{`${eleBd.market}`}</Typography>
                                                                                                </Grid>
                                                                                                <Grid item xs={6}>
                                                                                                    <Box mr={2} display="flex" flexDirection="column">
                                                                                                        <Typography title={eleBd.region} noWrap variant="subtitle2">{eleBd.region}</Typography>
                                                                                                    </Box>
                                                                                                </Grid>

                                                                                                <Grid item xs={6}>
                                                                                                    <Box mr={2} display="flex" flexDirection="column">
                                                                                                        <Typography noWrap variant="subtitle2">{Helper.ConvertToDollarFormat(eleBd.amount)}</Typography>
                                                                                                    </Box>
                                                                                                </Grid>
                                                                                                <Divider sx={{ width: '100%', mt: 1, mb: 1 }} />
                                                                                            </>
                                                                                        })                                                                                
                                                                                        :
                                                                                        ""
                                                                                }

                                                                            </Grid>
                                                                        </>

                                                                    } arrow>

                                                                        <IconButton size="small" className={classes.infoIcon}>
                                                                            <InfoOutlinedIcon />
                                                                        </IconButton>

                                                                    </LightTooltip>
                                                                </Box>
                                                            </Grid>

                                                            <Divider sx={{ width: '100%' }} />
                                                        </Grid>
                                                    </Box>

                                                </>

                                            })

                                        }
                                    </Collapse>


                                </Box>
                            )
                        })
                    }
                </div>
            </Grid>}
            {
                props.data.length > 0 && <Grid item xs={12} sm={12} md={12} pt={1} className={classes.grid}>
                    <Paging minRows={20} currentpage={page} rows={props.data.length}
                        rowsPerPage={rowsPerPage} handleChangePage={handleChangePage}
                        handleOnRowsChanged={(event) => handleOnRowsChanged(event)}
                    />
                </Grid>
            }
        </>
    );
}

MediaAccordion.displayName = "MediaAccordion";
export default MediaAccordion;