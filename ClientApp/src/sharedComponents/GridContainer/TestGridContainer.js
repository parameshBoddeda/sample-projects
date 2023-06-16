import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import { typography } from '@mui/system';
import { Typography, Container } from '@material-ui/core';
import { Article, DriveFileRenameOutline, Done, Delete, Download, ContentCopy } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import GridListData from '../../static/GridListData.json';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@mui/material/TextField';
import SearchTextBox from '../../sharedComponents/SearchTextBox/SearchTextBox';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
let datarows = GridListData.rows;

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function GridContainer() {

  const [rows, setRows] = React.useState(datarows);
  const [searched, setSearched] = React.useState('');
 
const setFilterData = (filterData ) => {
  setRows(filterData);
}

const setJsonData = (Data) => {
  setRows(Data);
}
 
  return (

    <List sx={{ width: '100%', maxWidth: '600px', bgcolor: 'background.paper' }}>
      <ListItem>
        <Container maxWidth={false} disableGutters>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Box component="div" display="flex" alignItems="center">
                <Checkbox size="small" {...label} defaultChecked />
                <Article />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Schedules</Typography>
            </Grid>
            <Grid item xs={5}>
            <SearchTextBox lblName="Search... " jsonData={rows} setFilterData={setFilterData} setJsonData={setJsonData} originalData={datarows}/>
            </Grid>
            <Grid item xs={2}>
              <Delete />
              <Download />
              <ContentCopy />
            </Grid>
          </Grid>
        </Container>
      </ListItem>
      {rows.map((data) => (
        <ListItem>

          <Container maxWidth={false} disableGutters>
            <Grid container spacing={2}>
              <Grid item xs={4} sm={3} md={2}>
                <Box display="flex" flexDirection="column">
                  <Box component="div" display="flex" alignItems="center">
                    <Checkbox size="small" {...label} defaultChecked />
                    <Article />
                    {/* {data.NetworkIcon} */}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={8} sm={9} md={10}>
                <Grid container>
                  <Grid item xs={3}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="body2">{data.Network}</Typography>
                      </Box>
                      <Box component="div">
                        <Typography variant="caption">{data.Region} | {data.Country} </Typography>
                      </Box>
                    </Box>
                    {/* <Item>xs=8</Item> */}
                  </Grid>

                  <Grid item xs={8}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography>
                          {data.ScheduleName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <DriveFileRenameOutline />
                  </Grid>
                  <Grid item xs={3}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="body2">Est Air Date|Time</Typography>
                      </Box>
                      <Box component="div">
                        <Typography variant="caption">{data.EstAirDate}|{data.EstAirTime}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="body2">Regional Air Date|Time</Typography>
                      </Box>
                      <Box component="div">
                        <Typography variant="caption">{data.RegionalAirDate}|{data.RegionalAirTime}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" flexDirection="column">
                      <Box component="div">
                        <Typography variant="body2">Sellable|Institutional</Typography>
                      </Box>
                      <Box component="div">
                        <Typography variant="caption">{data.Sellable} | {data.Institutional}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={1}>
                    <Done />
                  </Grid>
                </Grid>
              </Grid>


            </Grid>

            <Divider />
          </Container>

        </ListItem>
      ))}
    </List>


  );
}
