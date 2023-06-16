import React, { useState, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Snackbar,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import teams from './Teams.json';
import BasicSelect from './SelectControls/select';

const drawerWidth = 240;

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [playerName, setPlayerName] = useState('Jhon');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [key, setKey] = useState(false);
  // const [dailog, setDailog] = useState(false);
  const [loader, setLoader] = useState(false);
  const [player, setPlayer] = useState(['Jhon', 'Bob', 'Marley', 'Antony', 'Viswak'])
  const [playerData, setPlayerData] = useState([])
  const [details, setDetails] = useState({
    jobTitle: '',
    id: '',
    footwareShoebrand: '',
    jerseyPlayerName: 'Holiday1',
    remarks: ''
  });
  const [selectFields, setSelectFields] = useState({
    wsId: '', ws: '', wjId: '', wj: '', wpId: '', wp: '',
    psId: '', ps: '', ctId: '', ct: '', fsId: '', fs: ''
  });
  const timer = useRef();

  var autosave = useRef()

  if (key) {
    if (autosave.current) clearTimeout(autosave.current);
    autosave.current = setTimeout(() => {
      var pName = player.find((ele) => {
        return (ele === playerName);
      });
      if (playerData.includes(playerData.find(ele => ele.name === pName))) {
        let newPlayerData = playerData.filter(ele => ele.name !== pName)
        setPlayerData([
          ...newPlayerData,
          {
            name: pName,
            details: details,
            selectFields: selectFields
          }
        ]);
      } else {
        setPlayerData([
          ...playerData,
          {
            name: pName,
            details: details,
            selectFields: selectFields
          }
        ]);
      }
      console.log('data saved');
      setKey(false);
    }, 5000)
  }



  const handlePlayer = (player) => {
    setPlayerName(player);
    let newData = playerData.find(ele => ele.name === player);
    if (newData) {
      setDetails(newData.details);
      setSelectFields(newData.selectFields);
    } else {
      setDetails({
        jobTitle: '',
        id: '',
        footwareShoebrand: '',
        jerseyPlayerName: 'Holiday1',
        remarks: ''
      });
      setSelectFields({
        wsId: '', ws: '', wjId: '', wj: '', wpId: '', wp: '',
        psId: '', ps: '', ctId: '', ct: '', fsId: '', fs: ''
      })
    }
  }

  const handleAccordion = () => {
    if (key) {
      setOpen(true);
    }
   else if (player[0] !== playerName ) {
      setPlayerName(player[0]);
      let newData = playerData.find(ele => ele.name === player[0]);
      if (newData) {
        setDetails(newData.details);
        setSelectFields(newData.selectFields);
      } else {
        setDetails({
          jobTitle: '',
          id: '',
          footwareShoebrand: '',
          jerseyPlayerName: 'Holiday1',
          remarks: ''
        });
        setSelectFields({
          wsId: '', ws: '', wjId: '', wj: '', wpId: '', wp: '',
          psId: '', ps: '', ctId: '', ct: '', fsId: '', fs: ''
        })
      }
    }

  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNo = () => {
    setOpen(false);
    setKey(false);
    clearTimeout(autosave.current);
    if (player[0] !== playerName ) {
      setPlayerName(player[0]);
      let newData = playerData.find(ele => ele.name === player[0]);
      if (newData) {
        setDetails(newData.details);
        setSelectFields(newData.selectFields);
      } else {
        setDetails({
          jobTitle: '',
          id: '',
          footwareShoebrand: '',
          jerseyPlayerName: 'Holiday1',
          remarks: ''
        });
        setSelectFields({
          wsId: '', ws: '', wjId: '', wj: '', wpId: '', wp: '',
          psId: '', ps: '', ctId: '', ct: '', fsId: '', fs: ''
        })
      }
    }
  };
  const handleYes = () => {
    setOpen(false);
    setOpen1(true);
    setKey(false);
    clearTimeout(autosave.current);
    var pName = player.find((ele) => {
      return (ele === playerName);
    });
    if (playerData.includes(playerData.find(ele => ele.name === pName))) {
      let newPlayerData = playerData.filter(ele => ele.name !== pName)
      setPlayerData([
        ...newPlayerData,
        {
          name: pName,
          details: details,
          selectFields: selectFields
        }
      ]);
    } else {
      setPlayerData([
        ...playerData,
        {
          name: pName,
          details: details,
          selectFields: selectFields
        }
      ]);
    }
    if (player[0] !== playerName ) {
      setPlayerName(player[0]);
      let newData = playerData.find(ele => ele.name === player[0]);
      if (newData) {
        setDetails(newData.details);
        setSelectFields(newData.selectFields);
      } else {
        setDetails({
          jobTitle: '',
          id: '',
          footwareShoebrand: '',
          jerseyPlayerName: 'Holiday1',
          remarks: ''
        });
        setSelectFields({
          wsId: '', ws: '', wjId: '', wj: '', wpId: '', wp: '',
          psId: '', ps: '', ctId: '', ct: '', fsId: '', fs: ''
        })
      }
    }
  };
  const handleClose1 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen1(false)
  };

  const handleChange = (key, value) => {
    let data = {
      ...details,
      [key]: value
    }
    setDetails(data);
    setKey(true);
  };

  const handleSave = () => {
    var pName = player.find((ele) => {
      return (ele === playerName);
    });
    if (playerData.includes(playerData.find(ele => ele.name === pName))) {
      let newPlayerData = playerData.filter(ele => ele.name !== pName)
      setPlayerData([
        ...newPlayerData,
        {
          name: pName,
          details: details,
          selectFields: selectFields
        }
      ]);
    } else {
      setPlayerData([
        ...playerData,
        {
          name: pName,
          details: details,
          selectFields: selectFields
        }
      ]);
    }
    if (key) {
      if (!loader) {
        setLoader(true);
        timer.current = window.setTimeout(() => {
          setLoader(false);
        }, 1000);
        setTimeout(() => {
          setOpen1(true);
        }, 1100)
      }
    }
    setKey(false);
    clearTimeout(autosave.current);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosing = () => {
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
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
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {
          teams.NBATeams.map((team) => {
            return (
              <>
                <div key={team.teamId}>
                  <Accordion >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography onClick={handleAccordion} variant='h6' >{team.teamName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {
                        player.map((player) => {
                          return (
                            <Stack direction="row" spacing={2}>
                              <Avatar onClick={() => handlePlayer(player)}>{player.slice(0, 1)}</Avatar>
                              <Typography variant='h6'>{player}</Typography>
                            </Stack >
                          )
                        })
                      }
                    </AccordionDetails>

                  </Accordion>
                </div>

              </>
            )
          })
        }
      </List>
    </div>
  );


  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Header
            </Typography>
            <div >
              <IconButton
                size="large"
                edge='end'
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
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
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
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
            <Button onClick={handleNo}>No</Button>
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
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Typography variant='h5' textAlign='center' color='secondary'>Player Data</Typography>

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
              label='Footware_ShoeBrand'
              value={details.footwareShoebrand}
              fullWidth
              required
              onChange={(e) => { handleChange('footwareShoebrand', e.target.value) }}
            />
          </Stack>
          <BasicSelect
            selectFields={selectFields}
            setSelectFields={setSelectFields}
            setKey={setKey}
            details={details}
          />

          <Stack direction='row' spacing={2} style={{ margin: '20px 0 20px' }}>
            <TextField
              variant='outlined'
              label='GameUniform_JerseyPlayerName'
              defaultValue='Holiday1'
              fullWidth
              onChange={(e) => { handleChange('practiceMeshShort', e.target.value) }}
            />
            <TextField
              label='AccessoriesOrMedical_SpecialAccessories'
              id="standard-read-only-input"
              defaultValue="Accessories Info"
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
              fullWidth
            />
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
              style={{ marginRight: 30 }}
              variant='contained'
              color='primary'
              onClick={handleSave}
            >
              Save
            </Button>
            {
              loader &&
              <CircularProgress size={30} />
            }
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'end' }}>
            <footer>ISO:9001</footer>
          </Box>
        </Box>
      </Box>
    </>
  );
}
