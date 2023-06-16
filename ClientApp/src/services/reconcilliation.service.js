import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";


export async function GetValidatedFile(fileName) {
  try {
    return await APIHelper.post(APIURLConstants.VALIDATE_FILE, fileName);
  }
  catch (e) {
    throw (e);
  }
}

export async function UpLoadData(obj) {
  try {
    return await APIHelper.post(APIURLConstants.UPLOAD_DATA, obj);
  }
  catch (e) {
    throw (e);
  }
}
  

export async function GetReconciliationListData(leagueId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_RECONCILIATION_LIST(leagueId));
  }
  catch (e) {
    throw (e);
  }
}

export async function SaveReconciliationData(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_RECONCILIATION_DATA, obj);
  }
  catch (e) {
    throw (e);
  }
}