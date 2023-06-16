import * as React from 'react';
import { Box, IconButton, Avatar, Typography, MenuItem, Select, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UserForm from './userForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BASE_URL } from '../url/url';


function Item(props) {
    const { sx, ...other } = props;
    return (

        <Box
            sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                border: '1px solid',
                borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                p: 1,
                m: 1,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...sx,
            }}
            {...other}
        />


    );
}

export default function GridTemplateRows({ users, setUsers, newUser }) {

    const [key, setKey] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [selected, setSelected] = React.useState('select');
    const navigate = useNavigate();
    const matches = useMediaQuery('(min-width:700px)');
    
    

    const handleEdit = (username) => {
        const findUser = users.filter(ele => ele.username === username);
        setUsername(findUser[0].username)
        setKey(true)
    }

    const handleSelect = (e) => {
        setSelected(e.target.value);
    }
    let initial = React.useRef(false)
    React.useMemo(() => {
        if (initial.current) {
            axios.get(`${BASE_URL}/listusers?search=${selected}`)
                .then((res) => {
                    if (res.data.length) setUsers(res.data)
                    if (!res.data.length) setUsers([res.data])
                })
                .catch(err => console.log(err))
        } else initial.current = true;
    }, [selected])

    const handleAssets = () => {
        navigate('/assetslist')
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: matches? 'space-around': 'center',
            flexDirection: matches ? '': 'column',
            alignItems: matches ? '' : 'center',
            minHeight: '100vh',
            overflow: 'auto',
            // height: '100%'
        }}
        
        >
            
            {newUser &&
                newUser.rolename === 'user' ? '' :
                <Box sx={{ width:matches? '25%': '75%' }}>
                    <Typography variant='h6' component='div' color='white'>Select Users</Typography>
                    <Select
                        sx={{ backgroundColor: 'white', color: 'black' }}
                        value={selected}
                        onChange={handleSelect}
                        fullWidth
                    >
                        <MenuItem value='select'>Select</MenuItem>
                        <MenuItem value='all'>All Users</MenuItem>
                        <MenuItem value='enable'>Enabled Users</MenuItem>
                        <MenuItem value='disable'>Disabled Users</MenuItem>
                    </Select>
                </Box>
            }

            <Box sx={{ width:matches? '25%': '75%' }} >
                {
                    users.map((user, i) => {
                        return (
                            <Box key={i} sx={{ display: 'grid', gridTemplateRows: 'repeat(1, 1fr)' }}>
                                <Item key={user._id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar alt={user.username} src={user.pic} />&nbsp;
                                        {user.username}
                                    </Box>
                                    <IconButton
                                        onClick={() => handleEdit(user.username)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Item>

                            </Box>
                        )
                    })
                }
            </Box>
            {
                newUser &&
                    newUser.rolename === 'admin' ?
                    <Box>
                        <Button variant='contained' color='warning' onClick={handleAssets}>Go To Assets</Button>
                    </Box>
                    : ''
            }

            <Box>
                {
                    key ? <UserForm setUsers={setUsers} setKey={setKey} username={username} newUser={newUser} /> : ''
                }
            </Box>
           
        </Box>
    );
}