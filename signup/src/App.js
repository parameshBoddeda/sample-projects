import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField, Stack, Paper, Box } from '@mui/material';


export default function App() {
  return (
    <Stack >
      <Card style={{width : '500px'}} sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant='h4'>
          Digital CU
        </Typography>
        <Typography variant="h6" component="div">
          Client Id*
        </Typography>
        <TextField variant='outlined' type='text' label='please enter client id'/>
        <Typography variant="h6" component="div">
          Grant_Type*
        </Typography>
        <TextField variant='outlined' type='text' label='please enter grant-type'/>
        <Typography variant="h6" component="div">
          Username*
        </Typography>
        <TextField variant='outlined' type='text' label='please enter username'/>
        <Typography variant="h6" component="div">
          Password*
        </Typography>
        <TextField variant='outlined' type='password' label='please enter password'/>
        <Typography variant="h6" component="div">
          Client_Secret*
        </Typography>
        <TextField variant='outlined' type='text' label='please enter client secret'/>
        
       
      </CardContent>
      <CardActions>
        <Button variant='contained'>Register</Button>
      </CardActions>
    </Card>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 128,
          height: 128,
        },
      }}
    >
      <Paper elevation={0} />
      <Paper />
      <Paper elevation={5} />
    </Box>
    </Stack>
    
  );
}
