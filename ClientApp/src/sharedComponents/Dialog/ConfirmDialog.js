import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfrimDialog = (props) => {
    
    return (
        <>
            <Dialog
                open={props.open}                
                onClose={props.handleDialogClose}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.description}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={props.handleDialogOk} autoFocus>{props.ok}</Button>
                <Button onClick={props.handleDialogCancel}>{props.cancel}</Button>
                </DialogActions>
            </Dialog>        
        </>
    );
}

ConfrimDialog.displayName = "ConfrimDialog";
export default ConfrimDialog;

