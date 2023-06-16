
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@mui/material';
import { ToastContainer } from "react-toastify";
import * as AppConstants from '../../../common/AppConstants';
import {
  GetSeason,
  GetUsersListByRole,
  GetPartnerByType,
  GetSeasons
} from '../../../services/common.service';
import MulltiSelectDropdown from '../../../sharedComponents/Dropdown/MulltiSelectDropdown';
import ChipsList from '../../../sharedComponents/chips/ChipsList';
import TextboxField from '../../../sharedComponents/TextboxField/TextboxField';
import { ROLE } from "../../../common/AppConstants";

const useStyles = makeStyles((theme) => ({
  contentHeight: {
    height: 'calc(100vh - 294px)',
  },
}));

const MediaPlanFiltersStepOne = (props) => {
  const classes = useStyles();

  const [customerData, setCustomerData] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [selectedSeasonList, setSelectedSeasonList] = useState([]);
  const [selectedCustomerList, setSelectedCustomerList] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState();
  const [selectedCustomerName, setSelectedCustomerName] = useState();
  const [selectedMediaAEName, setSelectedMediaAEName] = useState();


  useEffect(() => {
    getCustomerData();
    getSeasonData();
    getMediaAEData();
  }, [props.filterCriteria.LeagueId]);

  const getCustomerData = () => {
    GetPartnerByType(AppConstants.PartnerType.Licensee_Sponsor).then((data) => {
      let customer = [];
      data.map(item => {
        customer.push({ label: item.partnerName, value: item.id });
      });
      setCustomerData(customer);
    }).catch(err => console.log(err))
  }

  const getSeasonData = () => {
    GetSeason(props.filterCriteria.LeagueId).then(data => {
        if (data) {
            let list = data.map((item) => {
                return { label: item.seasonName, value: item.seasonId }
            });
            setSeasonList(list);
        }
        else console.log("Seasons API is failing");
    });
  }

  const getMediaAEData = () => {
    let id = -1;
    GetUsersListByRole(ROLE.MEDIA_AE)
      .then((data) => {
        let mediumData = [];
        data.map((item) => {
          mediumData.push({
            label: item.fullName,
            value: item.loginId,
            loginId: item.email,
          });
        });
        setMediaData(mediumData);
      })
      .catch((err) => console.log(err));
  };

  const handleSeasonChange = (name, value) => {
    setSelectedSeason(value.label)
    let temp = selectedSeasonList || [];
    let index = temp.findIndex(t => t.value === value.value);
    if (index <= -1) {
      temp.push(value);
      setSelectedSeasonList(temp);
    }
    if (props.setFilterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  }

  const handleCustomerChange = (name, value) => {
    setSelectedCustomerName(value.label);
    let temp = selectedCustomers || [];
    let index = temp.findIndex(t=>t.value === value.value);
    if(index <= -1){
        temp.push(value);
        setSelectedCustomers(temp);
        if(props.setFilterCriteria) {
          props.setFilterCriteria(name, temp);
        }
    }
    
  }
  
  const handleMediaAE = (name, value) => {
    setSelectedMediaAEName(value.label);
    let temp = mediaList || [];
    let index = temp.findIndex((t) => t.value === value.value);
    if (index == -1) {
      var obj = { value: value.value, label: value.label };
      temp.push(obj);
      setMediaList(temp);
    }
    if(props.filterCriteria) {
      props.setFilterCriteria(name, temp);
    }
  };

  const handleDelete = (name, value) => {
    if (name === "season") {
      let temp = selectedSeasonList.slice();
      let index = temp.findIndex((t) => t.label === value);
      temp.splice(index, 1);
      setSelectedSeasonList(temp);
      props.setFilterCriteria(name, temp);
    }

    if (name === "customer") {
      let temp = selectedCustomers.slice();
      let index = temp.findIndex((t) => t.label === value);
      temp.splice(index, 1);
      setSelectedCustomers(temp);
      props.setFilterCriteria(name, temp);
    }

    if (name === "mediaAE") {
      let temp = mediaList.slice();
      let index = temp.findIndex((t) => t.label === value);
      temp.splice(index, 1);
      setMediaList(temp);
      props.setFilterCriteria(name, temp);
    }
  };

  useEffect(()=>{
    if(props.filterCriteria) {
      setSelectedCustomers(props.filterCriteria?.customer);
      setSelectedSeasonList(props.filterCriteria?.season);
      setMediaList(props.filterCriteria?.mediaAE)
    }
  }, [props.filterCriteria]);

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box display="flex" flexDirection="column" justifyContent="space-between" p={1.5} className={classes.contentHeight}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={10}></Grid>
          <Grid item xs={4} mt={1}>


              <MulltiSelectDropdown size="small" name="season" id="season" value={selectedSeason}
              variant="outlined" showLabel={true} lbldropdown="Season Name" handleChange={handleSeasonChange} 
              ddData={seasonList ? seasonList : []} />
          </Grid>
          <Grid item xs={8}>
            {selectedSeasonList &&
              <ChipsList
                name="season"
                handleDelete={handleDelete}
                showDelete={true}
                className="chips"
                label=""
                data={selectedSeasonList}
              />
            }
            </Grid>
          <Grid item xs={4} mt={1}>
            <MulltiSelectDropdown size="small" name="customer" id="customer" value={selectedCustomerName}
              variant="outlined" showLabel={true} lbldropdown="Customer" handleChange={handleCustomerChange}
              ddData={customerData ? customerData : []}
            />
          </Grid>
          <Grid item xs={8}>

            {selectedCustomers  &&
              <ChipsList
                name="customer"
                handleDelete={handleDelete}
                showDelete={true}
                className="chips"
                label=""
                data={selectedCustomers}
              />
            }


          </Grid>
          <Grid item xs={4} mt={1}>
            <MulltiSelectDropdown value={selectedMediaAEName}
              size="small"
              id="media"
              name="mediaAE"
              variant="outlined"
              // showLabel={true}
              lbldropdown="Media AE"
              handleChange={handleMediaAE}
              ddData={mediaData ? mediaData : []}
            />
          </Grid>
          <Grid item xs={8}>
            {mediaList && 
              <ChipsList
                name="mediaAE"
                handleDelete={handleDelete}
                showDelete={true}
                className="chips"
                label=""
                data={mediaList}
              />
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );

}
export default MediaPlanFiltersStepOne;

