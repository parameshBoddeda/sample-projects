import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import APIHelper from "../../common/ApiHelper";
import APIURLConstants from "../../common/ApiURLConstants";
import AppDataContext from '../../common/AppContext';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
    smallAvatarSize: {
        width: '40px',
        height: '40px'
    },
    avatarSize: {
        width: '75px',
        height: '75px'
    }
}));


export default function ProfileAvatar(props) {
    const classes = useStyles();
    const { userId, setPic, picData } = useContext(AppDataContext);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (picData === null && userId && userId !== '') {
            try {
                APIHelper.get(APIURLConstants.GET_EMP_DETAILS(userId +'@nba.com'))
                    .then(data => {
                        if (data && data !== ""){
                            setProfileData(data);
                            if (data.profileImageBase64)
                                setPic("data:image/jpeg;base64," + data.profileImageBase64);
                        }
                    })
                    .catch(error => {
                        console.log('Error fetching Profile Pid : ' + error);
                        setProfileData(null);
                        setPic(null);
                    })
            }
            catch (e) {
                setProfileData(null);
                setPic(null);
            }
        }
    }, [picData]);


    return (
        <>
            {picData ?
                <Avatar variant={props.variant ?? 'square'} className={props.small ? classes.smallAvatarSize : classes.avatarSize} src={picData} ></Avatar> :
                (props.isCircle ? <AccountCircle /> :
                    <Avatar variant="square" className={classes.avatarSize} style={{ backgroundColor: '#fffff', border: '1px solid #00000' }}
                        src="" > <PersonIcon color="primary" /></Avatar>)}
        </>
    )
}