import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    fileInput: {
        '&:before': {
            display: 'none',
        },
        '&:after': {
            display: 'none',
        },
        '& .MuiInputLabel-root': {
            transform: 'translate(14px, -9px) scale(.75)',
            color: '#1d428a',
            background: '#fff',
        },
        '& .MuiInputBase-input': {
      
        },
    },
}));


const UploadImage = (props) => {
    const classes = useStyles();

  const onFileSelectionChange = (fileName) => {
      if(!fileName) {
          return false;
      }
      if(props.handleFileNameChange) {
          props.handleFileNameChange(fileName.target.files[0]);
      }
    }
   

    return (
            <>
               <TextField fullWidth size="small"
                    id="contained-button-file"
                    type="file" inputProps={{ accept: "image/*" }}
                    className={classes.fileInput} 
                    onInput={onFileSelectionChange}
                    label = "Graphics"
                 />
            </>
           );
}

UploadImage.displayName = "UploadImage";
export default UploadImage;