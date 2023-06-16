import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    fileInput: {
        display: 'flex',
        flex: '1',
        color: '#444',
        padding: theme.spacing(.4),
        background: '#fff',
        borderRadius: theme.spacing(.5),
        border: '1px solid rgb(0 0 0 / 23%)',
        marginRight: theme.spacing(1),
        fontWeight: '600',
        '&::file-selector-button': {
            marginRight: theme.spacing(2),
            border: 'none',
            background: '#1d428a',
            padding: theme.spacing(1, 2),
            borderRadius: theme.spacing(.5),
            color: '#fff',
            cursor: 'pointer',
            transition: 'background .2s ease-in-out',
            fontWeight: '600',
            textTransform: 'uppercase',
        },
        '&::file-selector-button:hover': {
            background: '#0d45a5',
        }
    }
}));

const FileUploadComponent = (props) => {
    const classes = useStyles();

    const [fileInfo, setFileInfo] = useState();

    const handleChange = (e) => {
        props.handleClear();
        setFileInfo({ file: e.target.files[0] });
    }

    const handleSubmit = (e) => {
        if(props.handleFileUpload){
            props.handleFileUpload(fileInfo);
        }        
    }

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <input className={classes.fileInput} type="file" name="file" onChange={e => handleChange(e)} />
                <Button variant="contained" onClick={handleSubmit}>{`Validate & Preview`}</Button>
            </Box>
        </>
    );
}

export default FileUploadComponent;