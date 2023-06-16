import { Button, Checkbox, CircularProgress, Dialog, DialogContent, FormLabel, IconButton, Radio, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import background from '../../whatsapp.jpg'
import axios from 'axios';
import { object, string } from 'yup';
import { MyContext } from '../../App';
import { BASE_URL } from '../url/url';

const mobileRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const options = ['hr', 'admin', 'user']
const updateSchema = object({
    username: string().min(3).max(15).required(),
    email: string().email().required(),
    mobile: string().required().matches(mobileRegex, 'invalid mobile number'),
    rolenmae: string().oneOf(options, 'invalid option')
})

const UserForm = ({ setKey, username, setUsers, newUser }) => {
    const [userdata, setUserdata] = React.useState({
        username: '',
        email: '',
        mobile: '',
        rolename: '',
    });
    const [message, setMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [checkUpdate, setCheckUpdate] = React.useState(false);
    const { data } = React.useContext(MyContext);
    const [errors, setErrors] = React.useState({
        username: '',
        email: '',
        mobile: '',
        rolename: ''
    });
    const readOnly = (newUser.rolename === 'admin' || newUser.rolename === 'user');

    React.useEffect(() => {
        axios.get(`${BASE_URL}/edituser?username=${username}`)
            .then((res) => {
                setUserdata({
                    username: res.data.username,
                    email: res.data.email,
                    mobile: res.data.mobile,
                    rolename: res.data.rolename,
                });
                setChecked(res.data.enabled)
            })
            .catch(err => console.log(err))
    }, []);

    const handleChange = (key, value) => {
        setUserdata({
            ...userdata,
            [key]: value
        })
    }
    const timer = React.useRef();
    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleUpdate = () => {
        updateSchema.validate(userdata, { abortEarly: false })
            .then((res) => {
                axios({
                    method: 'put',
                    url: `${BASE_URL}/updateuser?username=${username}`,
                    data: res
                })
                    .then((res) => {
                        setMessage(res.data)
                        if (!loading) {
                            setLoading(true);
                            timer.current = window.setTimeout(() => {
                                setOpen(true);
                                setLoading(false);
                            }, 2000);
                        }
                    })
                    .catch(err => console.log(err))
                setErrors({
                    username: '',
                    email: '',
                    mobile: '',
                    rolename: ''
                })
            })
            .catch((error) => {
                console.log(error.inner);
                let errObj = {};
                error.inner.map(err => errObj[err.path] = err.message);
                setErrors(errObj)
            })
    }



    const handleOk = () => {
        setOpen(false);
        setKey(false);
        axios({
            method: 'post',
            url: `${BASE_URL}/getusers`,
            data: { email: data.email }
        })
            .then((res) => {
                setUsers(res.data)
            })
            .catch(err => console.log(err))
    }

    const handleChecked = (e) =>{
        setChecked(e.target.checked);
        setCheckUpdate(true)
    }

    let initial = React.useRef(false);

    React.useMemo(()=>{
       if(initial.current){
        axios({
            method: 'put',
            url: `${BASE_URL}/enableuser?username=${username}`,
            data:{enabled:checked}
        })
         .then(res=>console.log(res.data))
         .catch(err=>console.log(err))
       }else initial.current = true;
    },[checkUpdate])
    
    return (
        <Box >
            <Dialog
                sx={{ backgroundImage: `url(${background})`, width: '100%' }}
                open={true}
                onClose={() => { setKey(false) }}
            >
                <DialogContent >
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <IconButton onClick={() => { setKey(false) }}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h6' component='div'>Update The Bio</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography>Name</Typography>
                        <TextField
                            sx={{
                                input: {
                                    height: 12
                                }
                            }}
                            name='username'
                            value={userdata.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                            helperText={errors?.username}
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Typography>Email Address</Typography>
                        <TextField
                            sx={{
                                input: {
                                    height: 12
                                }
                            }}
                            name='email'
                            value={userdata.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            helperText={errors?.email}
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Typography>Mobile</Typography>
                        <TextField
                            sx={{
                                input: {
                                    height: 12
                                }
                            }}
                            name='mobile'
                            value={userdata.mobile || ''}
                            onChange={(e) => handleChange('mobile', e.target.value)}
                            helperText={errors?.mobile}
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            fullWidth
                        />
                    </Box>
                    <Box>

                        <Typography>Role</Typography>
                        <Radio
                            checked={userdata.rolename === 'hr'}
                            onChange={(e) => handleChange('rolename', e.target.value)}
                            value="hr"
                            name="rolename"
                            disabled={newUser.rolename === 'admin' || newUser.rolename === 'user'}
                        />
                        <FormLabel>Hr</FormLabel>
                        <Radio
                            checked={userdata.rolename === 'admin'}
                            onChange={(e) => handleChange('rolename', e.target.value)}
                            value="admin"
                            name="rolename"
                            disabled={newUser.rolename === 'admin' || newUser.rolename === 'user'}
                        />
                        <FormLabel>Admin</FormLabel>
                        <Radio
                            checked={userdata.rolename === 'user'}
                            onChange={(e) => handleChange('rolename', e.target.value)}
                            value="user"
                            name="rolename"
                            disabled={newUser.rolename === 'admin' || newUser.rolename === 'user'}
                        />
                        <FormLabel>User</FormLabel>
                    </Box>
                    <Box>
                        <Checkbox
                            checked={checked}
                            onChange={handleChecked}
                            disabled={newUser.rolename === 'hr' || newUser.rolename === 'user'}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <FormLabel>Enable</FormLabel>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant='contained'
                            onClick={handleUpdate}
                            disabled={newUser.rolename === 'admin' || newUser.rolename === 'user'}
                        >Update</Button>
                    </Box>
                    <Box>
                        {loading && (
                            <CircularProgress
                                size={30}
                            />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={open} >
                <DialogContent>
                    <Typography>{message}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant='contained' onClick={handleOk}>Ok</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default UserForm;
