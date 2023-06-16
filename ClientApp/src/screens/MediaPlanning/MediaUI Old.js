import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { th } from 'date-fns/locale';

const useStyles = makeStyles(theme => ({

    selected: {
        background: "#e4ecff"
    },
    dealRow: {
        cursor: "pointer"
    },
    iconColor: {
        color: '#424242 !important',
    },
    selectedbtn: {
        '& svg': {
            backgroundColor: '#1c4289',
            color: '#FFF',
        }
        
    }
}));

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const MediaUI = (props) => {
    let { data, index, view } = props;
    const classes = useStyles();

    const handleDealEditClick = (dealId, btnName) => {
        if (props.isEditing) {
            return false;
        }
        if (props.handleDealEditClick) {
            props.handleDealEditClick(dealId, btnName);
        }
    }
    return (
        <React.Fragment>
            <Grid className={`${classes.deal} ${data.id && props.selectedDealId && data.id === props.selectedDealId ? classes.selected : ""}`} key={`Grid${index}`} item xs={12}>
                <Box px={1}>
                    <Grid container>
                        <Grid item xs={11.5}>
                            <Grid container spacing={1} marginTop={0}>
                                <Grid item xs={props.view ? 1.3 : 3}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="subtitle2" title="leagueName">{data.Customer}</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="caption">{data.league ? data.league : '-'} | {data.year ? `${data.year}` : '-'}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? 1.3 : 4}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Deal Leader</Typography>
                                        </Box>
                                        <Box component="div" >
                                            <Typography variant="subtitle2">{data.dealLeader}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={props.view ? 1.4 : 5}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Sales Person</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.salesPerson}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 1.5 : 3}>
                                    <Box display="flex" flexDirection="column">
                                        <Box display="flex" alignItems="center">
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">Bill Type</Typography>
                                                <Typography variant="subtitle2">
                                                    {data.billType}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column">
                                                <Box mr={.5} ml={.5}>|</Box>
                                                <Box mr={.5} ml={.5}>|</Box>
                                            </Box>
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">Bill By</Typography>
                                                <Typography variant="subtitle2">
                                                    {data.billBy}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 2 : 4}>
                                <Box display="flex" flexDirection="column">
                                        <Box display="flex" alignItems="center">
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">Start Date</Typography>
                                                <Typography variant="subtitle2">
                                                    {data.startDate}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column">
                                                <Box mr={.5} ml={.5}>|</Box>
                                                <Box mr={.5} ml={.5}>|</Box>
                                            </Box>
                                            <Box component="div" display="flex" flexDirection="column">
                                                <Typography variant="caption">End Date</Typography>
                                                <Typography variant="subtitle2">
                                                    {data.endDate}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 1 : 3}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Category</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.category}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 1.5 : 3}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Brand</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.brand}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 1 : 3}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Territories</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                                {data.territories}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={props.view ? 1 : 3}>
                                    <Box display="flex" flexDirection="column">
                                        <Box component="div">
                                            <Typography variant="caption">Budget</Typography>
                                        </Box>
                                        <Box component="div">
                                            <Typography variant="subtitle2" component="div" className={classes.date1} style={{ display: 'flex', }}>
                                            &#36;{data.budget}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={.5}>
                                <Box key={`GridAction${index}`} display="flex" flexDirection='column' justifyContent="space-between">
                                    
                                    <IconButton  title="Split" color="default" 
                                    className={`${classes.iconColor} ${props.selectedDealId === data.id && props.selectedBtn === "budget" ? classes.selectedbtn : ''}`} 
                                    size="small" onClick={() => {
                                        props.handlebudgetClick(data.id, "budget")
                                    }} >
                                        <MonetizationOnOutlinedIcon />
                                    </IconButton>

                                    <IconButton title="Deal Edit" className={`${classes.iconColor} ${props.selectedDealId === data.id && props.selectedBtn === "deal" ? classes.selectedbtn : ''}`}  size="small" onClick={() => handleDealEditClick(data.id, "deal")}>
                                        <LocalOfferOutlinedIcon/>
                                    </IconButton>
                                    
                                </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Divider sx={{ width: '100%' }} />
        </React.Fragment>
    );
}

MediaUI.displayName = "MediaUI";
export default MediaUI;
