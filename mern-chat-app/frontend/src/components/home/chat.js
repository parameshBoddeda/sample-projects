import { Box } from '@mui/material';
import React from 'react';
import background from '../../whatsapp.jpg';
import DrawerAppBar from './appBar';
import GridTemplateRows from './grid';
import { MyContext } from '../../App';
import axios from 'axios';
import { BASE_URL } from '../url/url';

const Chat = ({users, setUsers}) => {
  
  const height = users.length > 1 ? '100%' : '100vh';
  const {data} = React.useContext(MyContext);
  const [newUser, setNewUser] = React.useState();

  React.useEffect( () => {
    axios({
        method: 'post',
        url: `${BASE_URL}/getusers`,
        data: {email:data.email}
    })
    .then((res)=>{
        if(res.data.length){
          const findUser = res.data.find(ele=>ele.email === data.email);
          setNewUser(findUser)
          setUsers(res.data)
      }else if(!res.data.length) {
        setNewUser(res.data)
        setUsers([res.data])}
    })
    .catch(err=>console.log(err))
  }, [data.email]);


  return (
    <Box sx={{ backgroundImage: `url(${background})`, height:{height} , marginTop: 0 }}>
      <Box>
        <DrawerAppBar newUser={newUser} />
        <GridTemplateRows users={users} setUsers={setUsers} newUser={newUser}/>
      </Box>
    </Box>
  );
}

export default Chat;
