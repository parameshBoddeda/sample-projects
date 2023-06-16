import React, { useContext, useState, useEffect, } from "react";
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Grid, Paper, TextField, Container, Typography } from "@mui/material";
import { GetCustomLoginDetails, GetCustomLoginUsers } from "./services/auth.service";
import AppDataContext from './common/AppContext';
import clsx from 'clsx';
import './customLogin.css';
import RouteConstants from './common/RouteConstants';

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginPortal: {
        height: theme.spacing(10),
        width: theme.spacing(60),
    },
    loginInput: {
        // marginLeft: theme.spacing(4),
        // marginRight:theme.spacing(4),
    }

}));

const CustomLogin = (props) => {
    const classes = useStyles();

    const [login, setLogin] = useState('');
    const { setUserDetails, isADEnabled, isCustomLoginEnabled } = useContext(AppDataContext);
    const [LoginOptions, setLoginOptions] = useState([]);
    const [role, setRole] = useState('');
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);

    const handleChange = (event) => {
        setLogin(event.target.value);

        if (event.target.value !== "" && event.target.value !== "---Select---") {
            setRole(LoginOptions.find(x => x.loginIDWithName === event.target.value).role);
        }


    };

    function handleLogin(e) {
        if (login !== '' && isCustomLoginEnabled) {
            let details = login.split('-');

            GetCustomLoginDetails(details[0], details[1])
                .then((data) => {
                    localStorage.setItem('userId', data.userId)
                    setUserDetails(data);
                    props.history.push({
                        pathname: props.history.push(
                            data.userRole === "DOCUMENT_REQUESTOR" ?
                                RouteConstants.DOCUMENT_REQUEST_HOME : RouteConstants.HOME
                        ),
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const getLoginUsers = () => {
        //debugger;
        setShowLoading(true);
        setOpenBackdrop(true);
        GetCustomLoginUsers().then(data => {
            //debugger;
            setShowLoading(false);
            setOpenBackdrop(false);
            setLoginOptions(data);
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            throw err;
        });
    };

    useEffect(() => {
        getLoginUsers();

    }, []);

    return (
        <div className={clsx("login-bg", classes.root)}>
            <div className={classes.loginPortal}>
                <Paper elevation={2} style={{marginTop : '-80px'}}>
                    <Container maxWidth={false}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12}>Custom Login</Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                    className={classes.loginInput}
                                    fullWidth
                                    id="txtLogin"
                                    select
                                    label="Login"
                                    value={login}
                                    onChange={(e) => handleChange(e)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    <option key='-1' value='---Select---'></option>
                                    {LoginOptions !== null && LoginOptions.length > 0 && LoginOptions.map((option) => (
                                        <option key={option.name} value={option.loginIDWithName}>
                                            {option.name}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                {
                                    (role !== "") && <>
                                        <Typography variant="subtitle2" className={classes.reviewAll}>Role: </Typography>
                                        {
                                            role.split(',').map((row, index) => {
                                                return (
                                                    <Typography key={row.trim() + index} variant="subtitle2" className={classes.reviewAll}>{row.trim()}</Typography>
                                                )
                                            })
                                        }

                                    </>
                                }
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Button onClick={(e) => handleLogin(e)} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Paper>
                {showLoading && <div className={'loader-div'}>
                    <div className={'loading'}></div>
                </div>}
            </div>
        </div>
    )
}

export default withRouter(CustomLogin);