import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetEmployeeCount() {
    try {
        return await APIHelper.get(APIURLConstants.GET_EMPLOYEE_COUNT);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetTest(obj) {
    try {
        //debugger;
        //let queryString = "?docStatus=" + obj.docStatus;
        //if (obj.docSource !== undefined)
        //    queryString = queryString + "&docSource=" + obj.docSource;
        //if (obj.addedBy !== undefined)
        //    queryString = queryString + "&addedBy=" + obj.addedBy;

        return await APIHelper.get('APIURLConstants.GET_ALL_DOCUMENT_BY_EMPLOYEE + queryString');
    }
    catch (e) {
        throw (e);
    }
}

export async function GetUsersListByRole(roleName) {
    try {
        return await APIHelper.get(APIURLConstants.GET_USERS_LIST_BY_ROLE_NAME(roleName));
    }
    catch (e) {
        throw (e);
    }
}


export async function GetSchedules() {
    try {
        return await APIHelper.get(APIURLConstants.GET_SCHEDULES);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetPartnerByType(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_PARTNER_BY_TYPE(id));
    }
    catch (e) {
        throw (e);
    }
}
export async function GetPartnerByInventory(leagueId, mediaTypeId, regionIds) {
    try {
        return await APIHelper.get(APIURLConstants.GET_PARTNER_BY_INVENTORY(leagueId, mediaTypeId, regionIds));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetPartnerByInventoryPlanning(leagueId, mediaTypeId, regionIds) {
    try {
        return await APIHelper.get(APIURLConstants.GET_PARTNER_BY_INVENTORY_PLANNING(leagueId, mediaTypeId, regionIds));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetNetworks(partnerId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_NETWORKS(partnerId));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetNetworkByRegion(partnerId, regionId, mediaTypeId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_NETWORK_BY_REGION(partnerId, regionId, mediaTypeId));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetNetworkBreakPositions(obj) {
    try {
        return await APIHelper.post(APIURLConstants.GET_NETWORK_BREAK_POSITIONS, obj);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetRegions() {
    try {
        return await APIHelper.get(APIURLConstants.GET_REGIONS);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetSeason(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_SEASONS_BY_LEAGUE(id));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetCountries(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_COUNTRIES_REGION(id));
    }
    catch (e) {
        throw (e);
    }
}


export async function GetMediaType() {
    try {
        return await APIHelper.get(APIURLConstants.GET_MEDIATYPES);
    }
    catch (e) {
        throw (e);
    }
}


export async function GetCostTypes() {
    try {
        return await APIHelper.get(APIURLConstants.GET_COSTTYPES);
    }
    catch (e) {
        throw (e);
    }
}
export async function GetUnitTypes(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_UNIT_TYPES(id));
    }
    catch (e) {
        throw (e);
    }
}
export async function GetUnitSizes(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_UNIT_SIZES(id));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetLeagues() {
    try {
        return await APIHelper.get(APIURLConstants.GET_LEAGUES);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetChannels(id, mediaTypeName) {
    try {
        return await APIHelper.get(APIURLConstants.GET_CHANNELS(id, mediaTypeName));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetPrograms(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_PROGRAM(id));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetLookupById(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_LOOKUP_By_ID(id));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetLookups() {
    try {
        return await APIHelper.get(APIURLConstants.GET_LOOKUPS);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetSeasons() {
    try {
        return await APIHelper.get(APIURLConstants.GET_SEASONS);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetCurrentSeasonsInfo() {
    try {
        return await APIHelper.get(APIURLConstants.GET_CURRENT_SEASONS_INFO);
    }
    catch (e) {
        throw (e);
    }
}


export async function GetUserPreference(typeId, leagueId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_USER_PREFERENCE_BY_MODULE(typeId, leagueId));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetReportUrl(name, setting) {
    try {
        return await APIHelper.get(APIURLConstants.GET_REPORT_URL(name, setting));
    }
    catch (e) {
        throw (e);
    }
}

export async function AddUpdateUserPreferences(data) {
    try {
        return await APIHelper.post(APIURLConstants.ADD_UPDATE_SAVED_PREFERENCE, data);
    }
    catch (e) {
        throw (e);
    }
}

export async function DeleteUserPreference(id) {
    try {
        return await APIHelper.delete(APIURLConstants.DELETE_USER_SAVED_PREFERENCE(id));
    }
    catch (e) {
        throw (e);
    }
}

export async function InsUpdSeason(seasonInfo) {
    try {
        return await APIHelper.post(APIURLConstants.INS_UPD_SEASON, seasonInfo);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetMedium(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_MEDIUM(id));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetAssetsByInventory(leagueId, MarketTypeId, VenturizeId, MediaType, NetworkId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_ASSETS_BY_INVENTORY(leagueId, MarketTypeId, VenturizeId, MediaType, NetworkId));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetAssetsByInventoryPlanning(leagueId, MarketTypeId, VenturizeId, MediaType, PartnerId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_ASSETS_BY_INVENTORY_PLANNING(leagueId, MarketTypeId, VenturizeId, MediaType, PartnerId));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetAssets(leagueId, MarketTypeId, VenturizeId, MediaType) {
    try {
        return await APIHelper.get(APIURLConstants.GET_ASSETS(leagueId, MarketTypeId, VenturizeId, MediaType));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetAssetsParent(leagueId, MarketTypeId, VenturizeId, MediaType) {
    try {
        return await APIHelper.get(APIURLConstants.GET_ASSETS_PARENT(leagueId, MarketTypeId, VenturizeId, MediaType));
    }
    catch (e) {
        throw (e);
    }
}

export async function ExportToExcel() {
    try {
        return await APIHelper.get(APIURLConstants.EXPORT_TO_EXCEL);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetEpisodes(assetId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_EPISODES(assetId));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetISCIList(leagueId, campOrAdvId) {
    try {
        return await APIHelper.get(APIURLConstants.GET_ISCI_LIST(leagueId, campOrAdvId));
    }
    catch (e) {
        throw (e);
    }
}
export async function GetISCIsList(filter) {
    console.log(APIURLConstants.GET_ISCIS_LIST);
    try {
        return await APIHelper.post(APIURLConstants.GET_ISCIS_LIST, filter);
    }
    catch (e) {
        throw (e);
    }
}

export async function InsUpdISCIinfo(obj) {
    try {
        return await APIHelper.post(APIURLConstants.INS_UPD_ISCI_DETAILS, obj);
    }
    catch (e) {
        throw (e);
    }
}

export async function GetBrands(id) {
    try {
      return await APIHelper.get(APIURLConstants.GET_BRANDS(id));
    } catch (e) {
      throw e;
    }
  }

  export async function GetCountriesByRegionIds(id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_COUNTRIES_BY_REGIONIDS(id));
    }
    catch (e) {
        throw (e);
    }
}
