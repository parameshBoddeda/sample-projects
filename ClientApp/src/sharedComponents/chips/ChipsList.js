import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { List, Typography } from '@mui/material';
import Helper from '../../common/Helper';

const useStyled = makeStyles((theme) => ({
    paperClass: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0) + 'px !important',
    },
    label: {
        lineHeight: 1 + "!important",
    },
    blue:{
        backgroundColor: 'blue'
    },
    orange:{
        backgroundColor: 'orange'
    },
    green:{
        backgroundColor: '#eb00ffde'
    }
}));
const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0, 0.5),
}));

const ChipsList = (props) => {
    const classes = useStyled();

    const handleClick = (chip) => () => {
    };

    const handleDelete = (value) => {
        if (props.handleDelete) {
            props.handleDelete(props.name, value);
        }

    }

    return (
        <React.Fragment>
            <FormControl>
                <FormLabel className={classes.label}><Typography variant='caption' component="span" fontWeight="bold">{props.label ? props.label : ""}</Typography></FormLabel>
                <List
                    className={classes.paperClass}
                >
                    {props.data && props.data.length > 0 && props.data.map((data, index) => {
                        let bgColor = data.planStatus === 'Pending Confirm' ? '#7CB9E8' : (data.planStatus === 'Working Internal' || data.planStatus === 'Proposed') ? '#F6AB27' : data.planStatus === 'Revised' ? '#5A92FF' : '';
                        let color = data.planStatus ? 'white' : 'black';
                        return (
                            <ListItem key={data.key??Helper.GetRandomId(6) + index}>
                                <Chip
                                    size='small'
                                    title={data.planStatus ?? ''}
                                    style={{ backgroundColor: bgColor, color: color}}
                                    label={data.label}
                                    onClick={props.enableClick ? () => handleClick : null}
                                    onDelete={props.showDelete ? () => handleDelete(data.label) : null}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </FormControl>
        </React.Fragment>

    );
}

ChipsList.displayName = "ChipsComponent"
export default ChipsList;
