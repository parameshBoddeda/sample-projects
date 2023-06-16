import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetAppDetails() {
  try {
    return await APIHelper.get(APIURLConstants.GET_APP_DETAILS);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetConfigs() {
    try {
        return await APIHelper.get(APIURLConstants.GET_CONFIGS);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetCustomLoginDetails(loginId, name) {
    try {
        return await APIHelper.get(APIURLConstants.GET_CUSTOM_LOGIN_DETAILS(loginId, name));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetCustomLoginUsers() {
    try {
        return await APIHelper.get(APIURLConstants.GET_CUSTOM_LOGIN_USERS);
    }
    catch (e) {
        throw (e);
    }
}
