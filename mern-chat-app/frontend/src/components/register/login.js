import { Box, Button, FormHelperText, IconButton, InputAdornment,  OutlinedInput, TextField, Typography } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material'
import axios from 'axios';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { MyContext } from '../../App';
import { BASE_URL } from '../url/url';

const options = ['admin', 'user']
const logSchema = object({
  email: string().email().required(),
  password: string().min(6).max(15).required(),
  role: string().oneOf(options, 'Please Select role')
})


const Login = () => {
  const navigate = useNavigate()
  
  const { data, setData } = useContext(MyContext);
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { values, handleSubmit, handleChange, handleBlur, errors } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: logSchema,
    onSubmit: (values) => {
      setData(values)
    }
  });
  let initialRender = useRef(false)

  useMemo(() => {
    if (initialRender.current) {
      axios({
        method: 'post',
        url: `${BASE_URL}/login`,
        data: data
      })
        .then(() => {
          setErrMsg('')
          navigate('/chat')
        })
        .catch((err) => {
          if (err.response.data) {
            setErrMsg(err.response.data)
          }
        })
    } else initialRender.current = true;


  }, [data]);

  return (
    <Box>
      <form onSubmit={handleSubmit} >
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <FormHelperText>{errMsg}</FormHelperText>
        </Box>
        <Box>
          <Typography>Email Address <span style={{ color: 'red' }}>*</span></Typography>
          <TextField sx={{
            input: {
              height: 12
            }
          }}
            name='email'
            value={values.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={errors.email && values.email ? errors.email : ''}
            placeholder='Enter Your Email Address'
            fullWidth
          />
        </Box>
        <Box sx={{ marginTop: '10px' }}>
          <Typography>Password <span style={{ color: 'red' }}>*</span></Typography>
          <OutlinedInput
            sx={{ height: '45px' }}
            id="outlined-adornment-password"
            name='password'
            value={values.password || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Password'
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            fullWidth
          />
          <FormHelperText>{errors.password && values.password ? errors.password : ''}</FormHelperText>
        </Box>
        <Button
          sx={{ margin: '10px 0 10px 0' }}
          type='submit'
          variant='contained'
          fullWidth
        >Login</Button>
        <Button variant='contained' color='error' fullWidth>Get Guest User Credentials</Button>
      </form>
    </Box>
  );
}

export default Login;


