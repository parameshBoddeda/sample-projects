import * as React from 'react';
import TextboxField from '../../sharedComponents/TextboxField/TextboxField'
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    // formContainer: {
    //     paddingTop: theme.spacing(2),
    //     paddingBottom: theme.spacing(6),
    //     '& .MuiFormControl-root': {
    //         margin: `{${theme.spacing(1.5)} 0px}`
    //     }
    // },
}));

export default function FilterStepThree(props) {
    const classes = useStyles();
    const [filterName, setFilterName] = React.useState();
    const [description, setDescription] = React.useState("This is the description about the filter - It can be auto generated based on the selection.")
    
    const handleDescriptionChange = (value) => {
        setDescription(value);
    }

    const handleFilterName = (value) => {
        setFilterName(value);
    }

    return (
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <TextboxField fullWidth lblName="Filter Name" size="small" textboxData={filterName} handleChange={handleFilterName}/>
                </Grid>
                <Grid item xs={9}>
                    <TextboxField fullWidth lblName="Filter Description" size="small" textboxData={description} handleChange={handleDescriptionChange}/>
                </Grid>
            </Grid>
    )
}