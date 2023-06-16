import { Box, Button, Dialog, DialogContent, FormHelperText, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material'
import React, {  useState, useRef, useMemo } from 'react';
import {object, string} from 'yup';
import {useFormik} from 'formik';
import axios from 'axios';
import { BASE_URL } from '../url/url';

const mobileRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
 
const regSchema = object({
  username : string().min(3).max(15).required(),
  email : string().email().required(),
  mobile: string().required().matches(mobileRegex, 'invalid mobile number'),
  password: string().min(6).max(15).required(),
  confirmpassword: string().required().test('confirm-pass','Must match with password',function(confirmpassword){
    return confirmpassword === this.parent.password
    })
  })

const Signup = ({handleLogin}) => {
  const [data, setData] = useState({});
  const [key, setKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { values, handleSubmit, handleChange, handleBlur, errors } = useFormik({
    initialValues:{
      username: '',
      email: '',
      mobile: '',
      password: '',
      confirmpassword: '',
      pic: ''
    },
    validationSchema: regSchema,
    onSubmit: (values)=>{
      console.log(values);
      setData(values);
    }
  });

  let initialRender = useRef(false)

  useMemo(() => {
    if(initialRender.current){
      axios({
        method : 'post',
        url: `${BASE_URL}/signup`,
        data:{
          username: data.username,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
          pic:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
      }).then(()=>{
          setKey(true);
      }).catch((err)=>{
        console.log(err);
      })
    }else initialRender.current = true;
  }, [data]);

  return (
    <Box>
      <form onSubmit={handleSubmit} >
    <Box>
      <Typography>Name <span style={{color:'red'}}>*</span></Typography>
      <TextField sx={{
        input:{
          height:8
        }
      }}
      name='username'
      value={values.username || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={errors.username && values.username  ? errors.username : ''}
      placeholder='Enter Your Name'
      fullWidth
      />
    </Box>
    <Box>
      <Typography>Email Address <span style={{color:'red'}}>*</span></Typography>
      <TextField sx={{
        input:{
          height:8
        }
      }}
      type= 'email'
      name= 'email'
      value={values.email || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={errors.email && values.email ? errors.email : ''}
      placeholder='Enter Your Email Address'
      fullWidth
      />
    </Box>
    <Box>
      <Typography>Mobile <span style={{color:'red'}}>*</span></Typography>
      <TextField sx={{
        input:{
          height:8
        }
      }}
      name='mobile'
      value={values.mobile || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={errors.mobile && values.mobile ? errors.mobile : ''}
      placeholder='Enter Your Mobile'
      fullWidth
      />
    </Box>
    <Box>
      <Typography>Password <span style={{color:'red'}}>*</span></Typography>
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
    <Box>
      <Typography>Confirm Password <span style={{color:'red'}}>*</span></Typography>
      <OutlinedInput
            sx={{ height: '45px' }}
            id="outlined-adornment-password"
            name='confirmpassword'
            value={values.confirmpassword || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter ConfirmPassword'
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
          <FormHelperText>{errors.confirmpassword && values.confirmpassword ? errors.confirmpassword : ''}</FormHelperText>
    </Box>
    <Box>
      <Typography>Upload Your Picture</Typography>
      <TextField type='file'sx={{
        input:{
          height:8
        }
      }}
      name= 'pic'
      value={values.pic || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth
      />
    </Box>
    <Button 
      sx={{marginTop:'10px'}} 
      variant='contained'
      fullWidth
      type='submit'
    >Sign Up</Button>
    </form>
    <Dialog
    open={key}
    onClose={()=>setKey(false)}
    >
      <DialogContent>
        <Typography variant='h6' component='div' > Registration success</Typography>
        <Button variant='contained' onClick={handleLogin}>Ok</Button>
      </DialogContent>
    </Dialog>
  </Box>
  
  );
}

export default Signup;
