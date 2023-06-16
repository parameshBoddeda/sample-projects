import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ErrorBoundary } from 'react-error-boundary';
import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';
import ApplicationBar from './sharedComponents/ApplicationBar';
import NBALogo from './sharedComponents/nbaLogo/NBALogo';
import * as AppConstants from './common/AppConstants';
import UserMenu from './sharedComponents/UserMenu';
//import ErrorBoundary from '../src/sharedComponents/ErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <AppBar position="fixed" style={{ backgroundColor: '#06255B !important' }}>
        <Toolbar>
          <NBALogo />
          <Typography variant="subtitle1" style={{flexGrow : 1}}>
            {AppConstants.CONSTANTS.APP_NAME}&nbsp;          
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Box pt={8} display="flex" flexDirection="column" style={{ backgroundColor: 'white !important'}}>
        <p>Something went wrong.</p>
        <p style={{ color:'#E5E5E5'}}>{error.message}</p>
        <button onClick={resetErrorBoundary}>Try again</button>
      </Box>
    </Box>
  )
}