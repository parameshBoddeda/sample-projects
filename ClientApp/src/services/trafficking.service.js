import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetSchedule(criteria) {
  try {
    return await APIHelper.post(APIURLConstants.GET_SCHEDULE, criteria);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetScheduleAdUnit(scheduleId,ros) {
  try {
    return await APIHelper.get(APIURLConstants.GET_SCHEDULE_AD_UNIT(scheduleId,ros));
  }
  catch (e) {
    throw (e);
  }
}

export async function GetNetworkBreakAndPosition(leagueId, networkId, marketTypeId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_NETWORK_BREAK_AND_POSITION(leagueId, networkId, marketTypeId));
  }
  catch (e) {
    throw (e);
  }
}

export async function UpdateTraffickingData(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_TRAFFICKING_DATA, obj);
  } catch (e) {
    throw e;
  }
}

export async function UpdateTraffickingStatus(obj) {
    try {
        return await APIHelper.post(APIURLConstants.SAVE_TRAFFICKING_STATUS, obj);
    } catch (e) {
        throw e;
    }
}

export async function MarkAsTrafficked(obj) {
  try {
      return await APIHelper.post(APIURLConstants.MARK_AS_TRAFFICKED, obj);
  } catch (e) {
      throw e;
  }
}

export async function GetRevisionNumber(obj) {
    try {
        return await APIHelper.post(APIURLConstants.GET_REVISIONNUMBER, obj);
    } catch (e) {
        throw e;
    }
}

export async function GetTraffickedPartner(obj) {
    try {
        return await APIHelper.post(APIURLConstants.GET_TRAFFICKED_PARTNER, obj);
    } catch (e) {
        throw e;
    }
}

export async function GetTraffickedAsset(obj) {
    try {
        return await APIHelper.post(APIURLConstants.GET_TRAFFICKED_ASSET, obj);
    } catch (e) {
        throw e;
    }
}


export async function FilterTraffickingData(obj) {
  try {
      return await APIHelper.post(APIURLConstants.FILTER_TRAFFICKING_DATA, obj);
  } catch (e) {
      throw e;
  }
}

export async function SaveTraffickingScheduleCopyData(obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_SCHEDULE_COPY_DATA, obj);
  } catch (e) {
      throw e;
  }
}

export async function GenerateTrafficLetter(obj) {
  try {
      return await APIHelper.post(APIURLConstants.GENERATE_TRAFFICK_LETTER, obj);
  } catch (e) {
      throw e;
  }
}


export async function GetDigitalSchedule(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_DIGITAL_SCHEDULE, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function DigitalMediaTraffickingStatus(obj) {
  try {
    return await APIHelper.post(APIURLConstants.DIGITAL_MEDIA_TRAFFICKING, obj);
  }
  catch (e) {
    throw (e);
  }
}