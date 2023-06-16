import React, { useState } from 'react';
import background from '../../whatsapp.jpg'
import {
  Box, Button, Card, CardActions, CardContent, Typography,

} from '@mui/material'
import Signup from './signup';
import Login from './login';
import useMediaQuery from '@mui/material/useMediaQuery';

const Home = () => {
  const [component, setComponent] = useState(<Login />);
  const [contained, setContained] = useState(false);

  const matches = useMediaQuery('(min-width:600px)');

  const handleLogin = () =>{
    setComponent(<Login />);
    setContained(false)
  }
  const handleSignup = () =>{
    setComponent(<Signup handleLogin={handleLogin}/>);
    setContained(true)
  }

  return (
    <Box sx={{ backgroundImage: `url(${background})`, height: '100vh', marginTop: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width:matches ? '40%' : '100%', margin: '20px 0 20px 0' }}>
          <CardContent>
            <Typography variant='h4' component='div' align='center'>Talk-A-Tive</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: matches ? '40%' : '100%' }}>
          <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              sx={{borderRadius:10}}
              onClick={handleLogin}
              fullWidth
              color='secondary'
              variant={contained ? '' : 'contained'}
            >
              Login
            </Button>
            <Button
              sx={{borderRadius:10}}
              onClick={handleSignup}
              fullWidth
              color='secondary'
              variant={contained ? 'contained' : ''}
            >
              Signup
            </Button>
          </CardActions>
          <CardContent>
            {component}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Home;
