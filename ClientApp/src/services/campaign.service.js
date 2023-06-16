import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetCampaignList(leagueId) {
  try {
    return await APIHelper.get(APIURLConstants.Campaign_List(leagueId));
  }
  catch (e) {
    throw (e);
  }
}

export async function AddCampaign(obj) {
  try {
    return await APIHelper.post(APIURLConstants.AddCampaign, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function SaveCampaign (obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_CAMPAIGN, obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function AddUpdateCampignUnit (obj) {
  try {
      return await APIHelper.post(APIURLConstants.ADD_UPDATE_CAMPAIGN_UNIT, obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function GetCampaignUnitList(campaignId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_CAMPAIGN_UNIT_LIST(campaignId));
  }
  catch (e) {
    throw (e);
  }
}
export async function GetEpisodesByStartDateAndEndDate(startDate, endDate, campaignOrAdvertiserId, campaignUnitTypeId, campaignUnitInstructionId) {
  try {
      return await APIHelper.get(APIURLConstants.GET_EPISODES_BY_STARTDATE_ENDDATE(startDate, endDate, campaignOrAdvertiserId, campaignUnitTypeId, campaignUnitInstructionId));
  }
  catch (e) {
    throw (e);
  }
}

export async function GetInventoryListSearch(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_INVERTORY_SEARCH, obj);
  }
  catch (e) {
    throw (e);
  }
}

