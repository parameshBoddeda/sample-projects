import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';

export default function DrawerAppBar({newUser}) {
  const navigate = useNavigate();

  const hanleLogout = () =>{
    navigate('/')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Avatar alt={newUser?.username} src={newUser?.pic} />&nbsp;
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1}}
          >
            Welcome Mr {newUser?.username}
          </Typography>
          <Box sx={{ display:'flex', justifyContent: 'end',alignItems: 'center' }}>
            <Typography sx={{mr: 5}}>{newUser?.rolename}</Typography>
              <Button
               variant='contained' 
               color='secondary' 
               sx={{ color: '#fff' }}
               onClick={hanleLogout}
               >
                LogOut
              </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
            
    </Box>
  );
}