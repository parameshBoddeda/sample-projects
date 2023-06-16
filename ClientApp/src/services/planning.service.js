import APIHelper from "../common/ApiHelper";
import APIURLConstants from "../common/ApiURLConstants";

export async function GetDeals(criteria) {
  try {
    return await APIHelper.post(APIURLConstants.GET_DEALS, criteria);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetCampaignMediaPlans(id, year) {
  try {
    return await APIHelper.get(APIURLConstants.GET_CAMPAIGN_MEDIA_PLANS(id, year));
  }
  catch (e) {
    throw (e);
  }
}

export async function GetMediaPlanPartners(id, year) {
  try {
    return await APIHelper.get(APIURLConstants.Get_Media_Plan_Partners(id, year));
  }
  catch (e) {
    throw (e);
  }
}


export async function GetMediaPlans(id, year, leagueId) {
  try {
    return await APIHelper.get(APIURLConstants.Get_Media_Plans(id, year, leagueId));
  }
  catch (e) {
    throw (e);
  }
}

export async function GetMediaPlansWithCriteria(criteria) {
  try {
    return await APIHelper.post(APIURLConstants.Get_Media_Plans_Criteria, criteria);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetBillBy() {
  try {
    return await APIHelper.get(APIURLConstants.GET_LOOKUP_By_ID(APIURLConstants.BILL_BY_ID));
  }
  catch (e) {
    throw (e);
  }
}

export async function GetAdditionalDealInfo(id) {
  try {
    return await APIHelper.get(APIURLConstants.GET_ADDITIONAL_DEALINFO(id));
  }
  catch (e) {
    throw (e);
  }
}

export async function GetInventoryAssets(criteria) {
  try {
    return await APIHelper.post(APIURLConstants.GET_INVENTORY_ASSETS, criteria);
  }
  catch (e) {
    throw (e);
  }
}

export async function SaveMediaPlan(reqBody) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_MEDIA_PLAN, reqBody);
  } catch (e) {
    throw (e)
  }
}

export async function ChangeSalesMediaPlanUnitsStatus(id, status) {
  try {
    return await APIHelper.post(APIURLConstants.CHANGE_SALES_MEDIA_PLAN_UNITS_STATUS(id, status));
  } catch (e) {
    throw (e)
  }
}


export async function SaveAdditionalDealInfo (obj) {
  try {
      return await APIHelper.post(APIURLConstants.SAVE_ADDITIONAL_DEAL_INFO , obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetScheduleAndUnits (obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_AVAILABLE_SCHEDULE_UNITS, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetAvailableEpisodeAndUnits(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_AVAILABLE_SCHEDULE_AND_UNITS_COUNT, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function SaveCampaignMediaPlanAndUnits(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_CAMPAIGN_MEDIA_PLAN_AND_UNITS, obj);
  } catch (e) {
    throw (e)
  }
}

export async function ValidateCampaignInventoryAndPlan(obj) {
  try {
    return await APIHelper.post(APIURLConstants.VALIDATE_CAMPAIGN_UNITS_AND_PLAN, obj);
  } catch (e) {
    throw (e)
  }
}

export async function ValidateSalesInventoryAndPlan(obj) {
  try {
    return await APIHelper.post(APIURLConstants.VALIDATE_UNITS_AND_PLAN, obj);
  } catch (e) {
    throw (e)
  }
}

export async function GetMediaPlanSummary(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_MEDIA_PLAN_SUMMARY_LIST, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetMediaPlanCalendarSummary(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_MEDIA_PLAN_CALENDAR_SUMMARY_LIST, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetSchedulesByCampaignOrMediaPlanId(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_SCHEDULESLIST_BY_CAMP_MEDIA_PLANID, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetSchedulesByInventory(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_SCHEDULESLIST_BY_INVENTORYID, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function SplitScheduleUnit(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SPLIT_SCHEDULE_UNIT, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function MergeScheduleUnits(obj) {
  try {
    return await APIHelper.post(APIURLConstants.MERGE_SCHEDULE_UNITS, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function ChangeUnitCostType(obj) {
  try {
    return await APIHelper.post(APIURLConstants.CHANGE_UNIT_COST_TYPE, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function GetISCIsByCampaignId(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_ISCIs_BY_CAMPAIGN_ID, obj);
  }
  catch (e) {
    throw (e);
  }
}

//pass array of objects
export async function UpdateScheduleUnitInfo(obj) {
  try {
    return await APIHelper.post(APIURLConstants.UPD_SCHEDULE_UNITS_INFO, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function ConfirmCampaignMediaPlan(obj) {
  try {
    return await APIHelper.post(APIURLConstants.CONFIRM_CAMPAIGN_MEDIA_PLAN, obj);
  }
  catch (e) {
    throw (e);
  }
}

//SALES MEDIA PLANNING - START
export async function SaveSalesMediaPlanDataAndProposedUnits(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_SALES_MEDIA_PLAN_AND_UNITS, obj);
  } catch (e) {
    throw (e)
  }
}

//pass array of objects
export async function UpdateSalesScheduleUnitInfo(obj) {
  try {
    return await APIHelper.post(APIURLConstants.UPD_SALES_SCHEDULE_UNITS_INFO, obj);
  }
  catch (e) {
    throw (e);
  }
}

export async function ConfirmSalesMediaPlan(id) {
  try {
    return await APIHelper.post(APIURLConstants.CONFIRM_SALES_MEDIA_PLAN(id));
  }
  catch (e) {
    throw (e);
  }
}

export async function SaveMediaPlanBudgets(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_MEDIA_PLAN_BUDGETS, obj);
  } catch (e) {
    throw e;
  }
}

export async function GetMediaPlansBudgets(id) {
  try {
    return await APIHelper.get(APIURLConstants.Get_Media_Plans_Budgets(id));
  } catch (e) {
    throw e;
  }
}

export async function DeleteMediaPlanBudget(id) {
  try {
    return await APIHelper.post(APIURLConstants.DELETE_MEDIAPLAN_BUDGET(id));
  } catch (e) {
    throw e;
  }
}

export async function GetCopyPlanSchedules(leagueId,planTypeId, marketTypeId) {
  try {
    return await APIHelper.get(APIURLConstants.Get_Copy_Plan_Schedules(leagueId,planTypeId, marketTypeId));
  } catch (e) {
    throw e;
  }
}

export async function GetCopyPlanSchedulesList(obj) {
  try {
    return await APIHelper.post(APIURLConstants.Get_Copy_Plan_Schedules_List, obj);
  } catch (e) {
    throw e;
  }
}

export async function GetPlannedUnits(scheduleId,planType,isROS) {
  try {
    return await APIHelper.get(APIURLConstants.Get_Planned_Units(scheduleId,planType,isROS));
  } catch (e) {
    throw e;
  }
}

export async function FilterScheduleData(obj) {
  try {
      return await APIHelper.post(APIURLConstants.Get_Filtered_Schedules, obj);
  } catch (e) {
      throw e;
  }
}

export async function SaveCopyPlanScheduleData(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_COPY_PLAN_SCHEDULE_DATA, obj);
  } catch (e) {
    throw e;
  }
}
//SALES MEDIA PLANNING - END

//Digital Media Planning
export async function SaveDigitalMediaPlanData(obj) {
  try {
    return await APIHelper.post(APIURLConstants.SAVE_DIGITAL_MEDIA_PLAN_DETAILS, obj);
  } catch (e) {
    throw (e)
  }
}

export async function GetDaywiseImpressions(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_DAY_WISE_IMPRESSIONS, obj);
  } catch (e) {
    throw (e)
  }
}

export async function GetImpressionsSummary(obj) {
  try {
    return await APIHelper.post(APIURLConstants.GET_IMPRESSIONS_SUMMARY, obj);
  } catch (e) {
    throw (e)
  }
}

export async function GetDigitalUnitSizesByInventory(inventoryId, IsCampaignPlanning) {
  try {
    return await APIHelper.get(APIURLConstants.GET_DIGITAL_UNIT_SIZES(inventoryId, IsCampaignPlanning));
  } catch (e) {
    throw (e)
  }
}

export async function GetDigitalDefaultUnitSizesByInventory(inventoryId, IsCampaignPlanning) {
  try {
    return await APIHelper.get(APIURLConstants.GET_DIGITAL_DEFAULT_UNIT_SIZES(inventoryId, IsCampaignPlanning));
  } catch (e) {
    throw (e)
  }
}

export async function GetMediaPlanMedium(planId) {
  try {
    return await APIHelper.get(APIURLConstants.Get_Media_Plan_Medium(planId));
  }
  catch (e) {
    throw (e);
  }
}


export async function SaveMediaPlanMedium(obj) {
  try {
    return await APIHelper.post(APIURLConstants.Save_Media_Plan_Medium, obj);
  } catch (e) {
    throw (e)
  }
}