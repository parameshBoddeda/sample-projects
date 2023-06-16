import React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Slide from '@material-ui/core/Slide';

const SnackbarList = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <React.Fragment>
      <div style={{ display: "none" }}>
        {props.error && props.error.map((errEle, i) => {
          return enqueueSnackbar(errEle.message, { variant: errEle.severity, horizontal: 'center', autoHideDuration: 160000, })
        })}
      </div>
    </React.Fragment>
  );
}

const Snackbars = (props) => {
  return (
      <SnackbarProvider maxSnack={4} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }} TransitionComponent={Slide}>
        <SnackbarList error={props.error} />
      </SnackbarProvider>
  );
}

export default Snackbars;
