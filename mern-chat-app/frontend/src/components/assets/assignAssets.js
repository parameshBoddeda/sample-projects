import {
    Button,
    Card,
    Chip,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import background from '../../whatsapp.jpg';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BASE_URL } from '../url/url';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'laptop',
    'keyboard',
    'mouse',
    'headphone',
    'dongle'
];

function getStyles(name, assets, theme) {
    return {
        fontWeight:
            assets.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const AssignAssets = ({ users }) => {
    const [user, setUser] = React.useState('select');
    const [chart, setChart] = React.useState('doughnut');
    const [month, setMonth] = React.useState('select');
    const [noOfAssets, setNoOfAssets] = React.useState([]);
    const [userAssets, setUserAssets] = React.useState([]);
    const theme = useTheme();
    const [assets, setAssets] = React.useState([]);
    const [assetmodel, setAssetmodel] = React.useState({});
    const [key, setKey] = React.useState(false);
    const [loadCharts, setLoadCharts] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(false);
    const matches = useMediaQuery('(min-width:900px)');

    React.useEffect(() => {
        axios.get(`${BASE_URL}/getuserassets`)
            .then((res) => {
                setUserAssets(res.data);
                const keyboard = res.data.filter(e => e.keyboard);
                const mouse = res.data.filter(e => e.mouse);
                const headphone = res.data.filter(e => e.headphone);
                const dongle = res.data.filter(e => e.dongle);
                const laptop = res.data.filter(e => e.laptop);
                setNoOfAssets([
                    keyboard.length, mouse.length, headphone.length, dongle.length, laptop.length
                ])
                setLoadCharts(false)
            })
            .catch(err => console.log(err))
    }, [loadCharts]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setAssets(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        setKey(true)
    };
    let newAsset = assets[assets.length - 1];

    React.useEffect(() => {
        if (key) {
            axios({
                method: 'put',
                url: `${BASE_URL}/getasset`,
                data: {
                    [newAsset]: newAsset
                }
            })
                .then((res) => {
                    setKey(false);
                    if (res.data.laptop.length > 0) {
                        setAssetmodel({ ...assetmodel, laptop: res.data.laptop[0]?.model });
                    } else if (res.data.keyboard.length > 0) {
                        setAssetmodel({ ...assetmodel, keyboard: res.data.keyboard[0]?.model });
                    } else if (res.data.mouse.length > 0) {
                        setAssetmodel({ ...assetmodel, mouse: res.data.mouse[0]?.model });
                    } else if (res.data.headphone.length > 0) {
                        setAssetmodel({ ...assetmodel, headphone: res.data.headphone[0]?.model });
                    } else if (res.data.dongle.length > 0) {
                        setAssetmodel({ ...assetmodel, dongle: res.data.dongle[0]?.model });
                    }

                })
                .catch((err) => { console.log(err); setKey(false); });
        }
    }, [key]);
    const handleAssign = () => {
        
        if (user !== 'select') {
            setErrorMsg(false)
            axios({
                method: 'post',
                url: `${BASE_URL}/userassets`,
                data: {
                    username: user,
                    laptop: assetmodel.laptop,
                    keyboard: assetmodel.keyboard,
                    mouse: assetmodel.mouse,
                    headphone: assetmodel.headphone,
                    dongle: assetmodel.dongle
                }
            })
                .then((res) => {
                    alert(res.data + ' to ' + user)
                    setUser('select');
                    setAssets([]);
                    setLoadCharts(true)
                })
                .catch(err => console.log(err))
            axios({
                method: 'post',
                url: `${BASE_URL}/sendemail`,
                data: {
                    username: user,
                    laptop: assetmodel.laptop,
                    keyboard: assetmodel.keyboard,
                    mouse: assetmodel.mouse,
                    headphone: assetmodel.headphone,
                    dongle: assetmodel.dongle
                }
            })
                .then((res) => {
                    console.log(res.data);
                })
                .catch(err => console.log(err))

        }
        else setErrorMsg(true)
    }


    const handleMonth = (e) => {
        setMonth(e.target.value);
        let keyboard = 0;
        let mouse = 0;
        let headphone = 0;
        let dongle = 0;
        let laptop = 0;
        if (e.target.value !== 'select') {
            userAssets.map((ele) => {
                const date = new Date(ele.createdAt);

                if (e.target.value == date.getMonth()) {
                    keyboard += ele.keyboard ? 1 : 0;
                    mouse += ele.mouse ? 1 : 0;
                    headphone += ele.headphone ? 1 : 0;
                    dongle += ele.dongle ? 1 : 0;
                    laptop += ele.laptop ? 1 : 0;
                    setNoOfAssets([
                        keyboard, mouse, headphone, dongle, laptop
                    ])
                }
                else {
                    setNoOfAssets([
                        keyboard, mouse, headphone, dongle, laptop
                    ])
                }
            })
        }
        else {
            keyboard = userAssets.filter(e => e.keyboard);
            mouse = userAssets.filter(e => e.mouse);
            headphone = userAssets.filter(e => e.headphone);
            dongle = userAssets.filter(e => e.dongle);
            laptop = userAssets.filter(e => e.laptop);
            setNoOfAssets([
                keyboard.length, mouse.length, headphone.length, dongle.length, laptop.length
            ])
        }

    }

    const BarChart = (props) => {
        const chartContainer = React.useRef(null);

        React.useEffect(() => {
            let chartInstance;
            if (chartContainer && chartContainer.current) {
                chartInstance = new Chart(chartContainer.current, {
                    type: props.type,
                    data: {
                        labels: props.labels,
                        datasets: [
                            {
                                label: props.datasetLabel,
                                data: props.data,
                                backgroundColor: props.backgroundColor,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    aspectRatio: 1,
                    animation: {
                        duration: 0,
                    },
                });
            }

            return () => {
                if (chartInstance) {
                    chartInstance.destroy();
                }
            };

        }, [chartContainer]);

        return <canvas ref={chartContainer} />;
    };
    return (
        <Box sx={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            display: matches ? 'flex' : '',
            minHeight: '100vh',
            overflow: 'auto',

        }}>
            <Box sx={{ width: matches ? '50%' : '100%' }}>
                <Typography
                    sx={{ color: 'white' }}
                    variant='h5'
                    component='div'
                    align='center'>Assign Assets to user</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                    <Typography sx={{ ml: '15%', mt: 2, color: 'white' }}>User</Typography>
                    <FormControl sx={{mr: '15%'}}>
                        <Select
                            sx={{ width: 300, backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
                            value={user}
                            onChange={(e) => {setUser(e.target.value);
                                if(e.target.value !== 'select') setErrorMsg(false)
                            }}

                        >
                            <MenuItem value='select'>Select</MenuItem>
                            {
                                users.map(ele => (
                                    <MenuItem key={ele.username} value={ele.username}>{ele.username}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText sx={{color: 'white !important'}}>{errorMsg ? 'Please Select User' : ''}</FormHelperText>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 10 }}>
                    <Typography sx={{ ml: '15%', mt: 2, color: 'white' }}>Assets</Typography>
                    <FormControl sx={{ mr: '15%', width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">Select</InputLabel>
                        <Select
                            sx={{ backgroundColor: 'white', color: 'black', borderRadius: '50px', }}
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={assets}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Select Asset" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(name, assets, theme)}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <Button sx={{ width: 110, borderRadius: '50px' }} variant='contained' onClick={handleAssign}>Assign</Button>
                </Box>
            </Box>
            <Box sx={{ width: matches ? '50%' : '100%' }}>

                <Typography
                    sx={{ color: 'white' }}
                    variant='h5'
                    component='div'
                    align='center'>Display Assets</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                    <Typography sx={{ ml: '15%', mt: 2, color: 'white' }}>Chart Type</Typography>
                    <Select
                        sx={{ width: 300, mr: '15%', backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
                        value={chart}
                        onChange={(e) => setChart(e.target.value)}

                    >
                        {/* <MenuItem value='select'>Select</MenuItem> */}
                        <MenuItem value='doughnut'>Doughnut</MenuItem>
                        <MenuItem value='bar'>Bar</MenuItem>
                        <MenuItem value='pie'>Pie</MenuItem>
                        <MenuItem value='polarArea'>PolarArea</MenuItem>

                    </Select>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 10 }}>
                    <Typography sx={{ ml: '15%', mt: 2, color: 'white' }}>Month  </Typography>
                    <Select
                        sx={{ width: 300, mr: '15%', backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
                        value={month}
                        onChange={handleMonth}

                    >
                        <MenuItem value='select'>Select</MenuItem>
                        <MenuItem value='0'>Jan</MenuItem>
                        <MenuItem value='1'>Feb</MenuItem>
                        <MenuItem value='2'>Mar</MenuItem>
                        <MenuItem value='3'>Apr</MenuItem>
                        <MenuItem value='4'>May</MenuItem>
                        <MenuItem value='5'>Jun</MenuItem>
                        <MenuItem value='6'>Jul</MenuItem>
                        <MenuItem value='7'>Aug</MenuItem>
                        <MenuItem value='8'>Sep</MenuItem>
                        <MenuItem value='9'>Oct</MenuItem>
                        <MenuItem value='10'>Nov</MenuItem>
                        <MenuItem value='11'>Dec</MenuItem>

                    </Select>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', mr: '15%' }}>
                    <Card sx={{ mt: 6, width: '300px', height: '250px', borderRadius: '20px', display: 'flex', justifyContent: 'center' }}>
                        <BarChart
                            type={chart}
                            labels={['Keyboards', 'Mouses', 'Headphones', 'Dongles', 'Laptops']}
                            data={noOfAssets}
                            datasetLabel='Assigned'
                            backgroundColor={['red', 'yellow', 'aqua', 'green', 'blue']}
                        />
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}

export default AssignAssets;
