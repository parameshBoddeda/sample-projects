import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetReportsList() {
    try {
        return await APIHelper.get(APIURLConstants.GET_REPORTS_LIST);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetReportsConfig(moduleId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_REPORTS_CONFIG(moduleId));
    }
    catch (e) {
        throw (e);
    }
}
