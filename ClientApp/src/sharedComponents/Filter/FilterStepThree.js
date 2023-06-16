import * as React from 'react';
import TextboxField from '../../sharedComponents/TextboxField/TextboxField'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formContainer: {
        '& .MuiFormControl-root': {
            margin: `{${theme.spacing(1.5)} 0px}`
        }
    },
    txtDescription: {
        margin: theme.spacing(1),
        '& .MuiTextField-root': { width: "80%" }
    },
    txtName: {
        '& .MuiTextField-root': { width: "50%" },
        margin: theme.spacing(1),
    },
    contentHeight: {
        height: 'calc(100vh - 315px)',
        overflowY: "auto",
    },
}));

export default function FilterStepThree(props) {
    const classes = useStyles();
    const [filterName, setFilterName] = React.useState(props.filterCriteria.name ?? props.filterCriteria.Name);
    const [description, setDescription] = React.useState(props.filterCriteria.description ?? props.filterCriteria.Description)
    
    const handleDescriptionChange = (value) => {
        setDescription(value);
        let criteria = props.filterCriteria;
        criteria.description = value;
        props.setFilterCriteria(criteria);
    }

    const handleFilterName = (value) => {
        setFilterName(value);
        let criteria = props.filterCriteria;
        criteria.name = value;
        props.setFilterCriteria(criteria);
    }

    return (
        <React.Fragment>
            <div className={`${classes.formContainer} ${classes.contentHeight}`}>
                <div className={classes.txtName}><TextboxField  lblName="Filter Name*" size="small" textboxData={filterName} handleChange={handleFilterName}/></div>
                <div className={classes.txtDescription}><TextboxField lblName="Filter Description" multiline={true} size="small" textboxData={description} handleChange={handleDescriptionChange}/></div>
            </div>
        </React.Fragment>

    )
}