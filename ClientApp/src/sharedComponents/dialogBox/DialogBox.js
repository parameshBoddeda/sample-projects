import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from './DialogTitle';
import DialogContent from './DialogContent';
import DialogActions from './DialogActions';

const DialogBox = (props) => {

  const handleClose = () => {
    props.handleClose(false);

  };

  return (
    <div>      
      <Dialog maxWidth={props.size ? props.size : 'xs'} fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.open} >
        <DialogTitle onClose={handleClose}>
          {props.headerText}
        </DialogTitle>
        <DialogContent dividers>
          {
              props.children
          }
        </DialogContent>
        {props.Action ? <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions> : null}
      </Dialog>
    </div>
  );
}

DialogBox.displayName = "DialogBox";
export default DialogBox;
