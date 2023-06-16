import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetInventory(criteria) {
  try {
    return await APIHelper.post(APIURLConstants.GET_INVENTORY, criteria);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetInventoryUnit(InventoryID) {
    try {
        return await APIHelper.get(APIURLConstants.GET_INVENTORY_UNIT(InventoryID));
    }
    catch (e) {
        throw (e);
    }
}

export async function GetFrequencies() {
  try {
      return await APIHelper.get(APIURLConstants.GET_FREQUENCIES);
  }
  catch (e) {
      throw (e);
  }
}

export async function GetDays() {
  try {
      return await APIHelper.get(APIURLConstants.GET_DAYS);
  }
  catch (e) {
      throw (e);
  }
}

export async function GenerateScheduleswithInventory (obj) {
  try {
      return await APIHelper.post(APIURLConstants.GENERATE_SCHEDULES_WITH_INVENTORY , obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetInventorySchedule(id) {
  try {
      return await APIHelper.get(APIURLConstants.GET_INVENTORY_SCHEDULE(id));
  }
  catch (e) {
      throw (e);
  }
}
export async function SaveInventoryUnit (obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_INVENTORY_UNIT , obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function SaveInventoryDeal(obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_INVENTORY_DEAL, obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function GetInventories(id) {
  try {
      return await APIHelper.get(APIURLConstants.GET_INVENTORIES_BY_DEAL_ID(id));
  }
  catch (e) {
      throw (e);
  }
}

export async function SaveInventory(obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_INVENTORY, obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function DeleteInventory(obj) {
    try {
        return await APIHelper.post(APIURLConstants.DELETE_INVENTORY, obj);
    }
    catch (e) {
        throw (e);
    }
}

export async function DeleteInventoryUnit (obj) {
  try {
      return await APIHelper.post(APIURLConstants.DELETE_INVENTORY_UNIT , obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function GetCopyScheduleBreakUps(id) {
  try {
      return await APIHelper.get(APIURLConstants.GET_COPY_SCHEDULE_BREAKUPS(id));
  }
  catch (e) {
      throw (e);
  }
}

export async function SaveCopySchedule (obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_COPY_SCHEDULE , obj);
  }
  catch (e) {
      throw (e);
  }
}

export async function GetMonthlySchedule(Id) {
    try {
        return await APIHelper.get(APIURLConstants.GET_MONTHLY_SCHEDULE(Id));
    }
    catch (e) {
        throw (e);
    }
}

export async function InsertMonthlySchedule(obj) {
    try {
        return await APIHelper.post(APIURLConstants.INSERT_MONTHLY_SCHEDULE, obj);
    }
    catch (e) {
        throw (e);
    }
}
export async function CheckInventoryScheduleByDate(id, startDate, endDate) {
  try {
      return await APIHelper.get(APIURLConstants.CHECK_INVENTORY_SCHEDULE_BYDATE(id, startDate, endDate));
  }
  catch (e) {
      throw (e);
  }
}

export async function GetDigitalInventoryAdditionalInfo(inventoryId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_DIGITAL_ADDITIONAL_INVENTORY_INFO(inventoryId));
  }
  catch (e) {
    throw (e);
  }
}

export async function SaveDigitalAdditionalInventoryInfo (obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_DIGITAL_ADDITIONAL_INVENTORY_INFO , obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetDigitalAssetAdUnitMapping(assetId) {
  try {
    return await APIHelper.get(APIURLConstants.GET_DIGITAL_ASSET_ADUNIT_MAPPING(assetId));
  }
  catch (e) {
    throw (e);
  }
}
export async function EditScheduleData(obj) {
  try {
      return await APIHelper.post(APIURLConstants.EDIT_SCHEDULE, obj);
  }
  catch (e) {
      throw (e);
  }
}
export async function DeleteScheduleData(scheduleID) {
  try {
      return await APIHelper.delete(APIURLConstants.DELETE_SCHEDULE(scheduleID));
  }
  catch (e) {
      throw (e);
  }
}

export async function GetEpisodesList() {
  try {
    return await APIHelper.get(APIURLConstants.GET_EPISODE_LIST);
  }
  catch (e) {
    throw (e);
  }
}
