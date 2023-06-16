import { Box } from '@mui/system';
import React, { useState } from 'react';
import { loremIpsum } from "lorem-ipsum";
import { Card, CardContent, IconButton, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import background from '../../whatsapp.jpg';
import useMediaQuery from '@mui/material/useMediaQuery';

export const AssetDesc = ({ desc, assetFeatures, asset, model }) => {
    const navigate = useNavigate();
    const [show , setShow] = useState(false)
    const matches = useMediaQuery('(min-width:600px)');

    const lorem = loremIpsum({
        count: 1,
        units: "paragraphs",
    });
    const para = lorem.slice(0, 30) + '...'
    return (
        <Box>
            {
                desc ?
                    <Box sx={{ backgroundImage: `url(${background})`, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Card sx={{ width: matches ? '50%':'100%' }}>
                            <Box sx={{display : 'flex', justifyContent : 'end'}}>
                                <IconButton onClick={()=>navigate('/assetslist')}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            
                            <CardContent>
                               <b> Asset </b> : {assetFeatures?.asset},<br />
                               <b> Brand </b> : Dell,<br />
                               <b> Model </b> : {assetFeatures?.model},<br />
                               <b> Description </b> : &nbsp;{lorem}
                            </CardContent>
                        </Card>
                    </Box>
                    :
                    <Box>
                        Asset : {asset},<br />
                        Brand : Dell,<br />
                        Model : {model},<br />
                        Description : &nbsp;
                        {show ? lorem
                           :
                            <>
                                {para}
                                <Link sx={{ color: 'yellow', cursor: 'pointer' }} onClick={() => setShow(true)}>
                                    See More
                                </Link>
                            </>
                        }
                    </Box>
            }

        </Box>
    )
}