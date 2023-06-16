import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetRateCardData(leagueId, rateCardId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_RATE_CARDS(leagueId, rateCardId));
  }
  catch (e) {
    throw (e);
  }
}

export async function InsertRateCard (obj) {
  try {
      return await APIHelper.post(APIURLConstants.INSERT_RATE_CARD, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetRateCardRecords(criteria) {
  try {
    return await APIHelper.post(APIURLConstants.GET_RATE_CARDS_RECORDS, criteria);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetRatesByInventoryId(inventoryId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_RATES_BY_INVENTORY_ID(inventoryId));
  }
  catch (e) {
    throw (e);
  }
}
