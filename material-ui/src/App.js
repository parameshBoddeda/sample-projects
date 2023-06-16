import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    Box,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Grid,
    Button,
    Avatar,
    Stack,
    Divider,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Snackbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import records from './Teams.json';
import SelectControl from './Select';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

 const App = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [playerName, setPlayerName] = useState('Jhon');
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [details, setDetails] = useState({
        jobTitle: '',
        id: '',
        teamId: '',
        playerId: '',
        footwareShoebrand: '',
        selectedTeamId: '',
        country: '',
        jerseyPlayerName: 'Holiday1',
        warmupsJacket: '',
        compressionTop: '',
        practiceMeshShort: '',
        remarks: ''
    });
    const [jhon, setJhon] = useState({});
    const [bob, setBob] = useState({});
    const [marley, setMarley] = useState({});
    const [antony, setAntony] = useState({});
    const [viswak, setViswak] = useState({});

    const handleJhon = () => {
        setPlayerName('Jhon');
        setDetails(jhon);
    }
    const handleBob = () => {
        setPlayerName('Bob');
        setDetails(bob);
    }
    const handleMarley = () => {
        setPlayerName('Marley');
        setDetails(marley);
    }
    const handleAntony = () => {
        setPlayerName('Antony');
        setDetails(antony);
    }
    const handleViswak = () => {
        setPlayerName('Viswak');
        setDetails(viswak);
    }
   
   console.log(jhon,bob);
    const handleAccordion = () => {
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleYes = () => {
        setOpen(false);
        setOpen1(true)
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosing = () => {
        setAnchorEl(null);
    };

    const handleChange = (key, value) => {
        setDetails({
            ...details,
            [key]: value
        })
    }
    const handleSave = () => {
        if (playerName === 'Jhon') {
            setJhon(details);
        
        } else if (playerName === 'Bob') {
            setBob(details);
           
        } else if (playerName === 'Marley') {
            setMarley(details);
           
        } else if (playerName === 'Antony') {
            setAntony(details)
            
        } else if (playerName === 'Viswak') {
            setViswak(details)
        
        }
      
        setOpen(true);
        
    }
    const handleClose1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen1(false)
    }
        const action = (
            <React.Fragment>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose1}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
        );

        return (
            <>
            <nav >
            <AppBar position='static' style={{ height: 30 }}>
                    <Toolbar >
                        <Typography variant='h6' style={{ marginBottom: 30 }} >Header</Typography>
                        <div>
                            <IconButton
                                size="large"
                                edge='end'
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                                style={{ margin: '0 0 30px 1150px' }}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClosing}
                            >
                                <MenuItem onClick={handleClosing}>Parameswara</MenuItem>
                                <MenuItem onClick={handleClosing}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </nav>
                

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={3} style={{ backgroundColor: 'lightgrey', marginTop: 12 }}>
                        
                            <Typography variant='h4' textAlign='left' color='primary'>Teams</Typography>

                            <IconButton size='large' edge='start' color='inherit' aria-label='logo' onClick={() => setIsDrawerOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor='left'
                                open={isDrawerOpen}
                                onClose={() => setIsDrawerOpen(false)}
                            >
                                <Box p={2} textAlign='center' role='presentation'>
                                    {
                                        records.NBATeams.map((team) => {
                                            return (
                                                <>
                                                    <Accordion onClick={handleAccordion}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                            <Typography variant='h6' key={team.teamId}>{team.teamName}</Typography>
                                                            {/* <Avatar alt={team.teamName} src={team.logoURL} /> */}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Stack direction="row" spacing={2}>
                                                                <Avatar onClick={handleJhon}>J</Avatar>
                                                                <Typography variant='h6'>Jhon</Typography>
                                                            </Stack >
                                                            <Divider />
                                                            <Stack direction="row" spacing={2}>
                                                                <Avatar onClick={handleBob}>B</Avatar>
                                                                <Typography variant='h6'>Bob</Typography>
                                                            </Stack >
                                                            <Divider />
                                                            <Stack direction="row" spacing={2}>
                                                                <Avatar onClick={handleMarley}>M</Avatar>
                                                                <Typography variant='h6'>Marley</Typography>
                                                            </Stack >
                                                            <Divider />
                                                            <Stack direction="row" spacing={2}>
                                                                <Avatar onClick={handleAntony}>A</Avatar>
                                                                <Typography variant='h6'>Antony</Typography>
                                                            </Stack >
                                                            <Divider />
                                                            <Stack direction="row" spacing={2}>
                                                                <Avatar onClick={handleViswak}>V</Avatar>
                                                                <Typography variant='h6'>Viswak</Typography>
                                                            </Stack >

                                                        </AccordionDetails>

                                                    </Accordion>

                                                </>
                                            )
                                        })
                                    }
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                There are some unsaved changes. Would you like to save the data?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose}>No</Button>
                                            <Button onClick={handleYes} autoFocus>
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Snackbar
                                        severity="success"
                                        open={open1}
                                        autoHideDuration={6000}
                                        onClose={handleClose1}
                                        message="Data Saved Successfully"
                                        action={action}
                                    />
                                </Box>
                            </Drawer>
                        
                    </Grid>
                    <Grid item xs={9}>
                        
                            <Typography variant='h5' textAlign='left' color='secondary'>Player Data</Typography>

                            <Accordion >
                                <AccordionSummary >
                                    <Typography variant='h6' textAlign='center' ><mark>{playerName}</mark></Typography>
                                </AccordionSummary>
                            </Accordion>
                            <Stack direction='row' spacing={2} style={{ margin: '20px 0 20px' }}>
                                <TextField
                                    variant='outlined'
                                    label='Job_Title'
                                    value={details.jobTitle}
                                    onChange={(e) => { handleChange('jobTitle', e.target.value) }}
                                    required
                                />
                                <TextField
                                    variant='standard'
                                    helperText='Id'
                                    value={details.id}
                                    onChange={(e) => { handleChange('id', e.target.value) }}
                                />
                                <TextField
                                    variant='filled'
                                    label='Team_Id'
                                    value={details.teamId}
                                    fullWidth
                                    required
                                    onChange={(e) => { handleChange('teamId', e.target.value) }}
                                />
                            </Stack>
                            <Stack direction='row' spacing={2} style={{ margin: '20px 0 20px' }}>
                                <TextField
                                    variant='outlined'
                                    label='Player_Id'
                                    value={details.playerId}
                                    required
                                    onChange={(e) => { handleChange('playerId', e.target.value) }}
                                />
                                <TextField
                                    variant='outlined'
                                    label='Footware_Shoebrand'
                                    value={details.footwareShoebrand}
                                    required
                                    onChange={(e) => { handleChange('footwareShoebrand', e.target.value) }}
                                />
                                <TextField
                                    variant='outlined'
                                    label='Selected Team Id'
                                    value={details.selectedTeamId}
                                    onChange={(e) => { handleChange('selectedTeamId', e.target.value) }}
                                />
                                <TextField
                                    variant='outlined'
                                    label='Country'
                                    value={details.country}
                                    required
                                    onChange={(e) => { handleChange('country', e.target.value) }}
                                />
                            </Stack>
                            <Stack direction='row' spacing={2} style={{ margin: '20px 0 20px' }}>
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        required
                                        id="outlined-required"
                                        helperText="GameUniform_JerseyPlayerName"
                                        defaultValue="Holiday1"
                                        value={details.jerseyPlayerName}
                                        fullWidth
                                        onChange={(e) => { handleChange('jerseyPlayerName', e.target.value) }}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label='WarmUps_Jacket'
                                        value={details.warmupsJacket}
                                        fullWidth
                                        onChange={(e) => { handleChange('warmupsJacket', e.target.value) }}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label='Compression_Top'
                                        value={details.compressionTop}
                                        fullWidth
                                        onChange={(e) => { handleChange('compressionTop', e.target.value) }}
                                    />
                                </Box>
                            </Stack>
                            <Stack direction='row' spacing={2} style={{ margin: '20px 0 20px' }}>
                                <TextField
                                    variant='outlined'
                                    label='Practice_MeshShort'
                                    value={details.practiceMeshShort}
                                    fullWidth
                                    onChange={(e) => { handleChange('practiceMeshShort', e.target.value) }}
                                />
                                <SelectControl />
                            </Stack>
                            <Stack direction='row' spacing={2} style={{ margin: '20px 0 20px' }}>
                                <TextField
                                    variant='filled'
                                    label='Remarks'
                                    value={details.remarks}
                                    fullWidth
                                    onChange={(e) => { handleChange('remarks', e.target.value) }}
                                />
                            </Stack>
                            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </Box>

                    </Grid>
                </Grid>
                <footer
                    style={{
                        backgroundColor: 'grey',
                        height: 30,
                        fontSize: '20px',
                        display: 'flex',
                        justifyContent: 'end',
                        color: 'white',
                        marginTop: 20
                    }}>
                    Footer
                </footer>
            </>

        )
    };

    export default App;