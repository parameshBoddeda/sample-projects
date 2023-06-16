
export const CONSTANTS = {
    APP_NAME: 'Media Planning and Ad Trafficking System',

}

export const MEDIA_PALN_STATUS_IDS = {
    WorkingInternal : 901,
    Proposed : 902,
    PendingConfirm : 903,
    Confirmed : 909,
    Cancelled : 910
}

export const MEDIA_PALN_STATUS_NAMES = {
    WorkingInternal: 'Working Internal',
    Proposed: 'Proposed',
    PendingConfirm: 'Pending Confirm',
    Confirmed: 'Confirmed',
    Cancelled: 'Cancelled'
}

export const SCHEDULE_STATUS_IDS = {
    Initial: 701,
    Prospect: 702,
    Actual: 703,
    Trafficked: 704,
    Deleted: 705
}

export const Exclude_BillTypeIds_Total_Dollar_Calc = [253,255,256]

export const SCHEDULE_ADUNIT_STATUS_IDS = {
    WorkingInternal: 1351,
    Proposed: 1352,
    PendingConfirm: 1353,
    Confirmed: 1354,
    Trafficked : 1355,
    Cancelled: 1356
}

export const STATUS = {
    PENDING_REVIEW: "-1",
    PENDING: "0",
    APPROVED: "1",
    REJECTED: "2"
}

export const SOURCE = {
    Unknown: 0,
    HROps: 1,
    SelfService: 2,
    BulkUpload: 3,
    SuccessFactor: 4
}

export const MEDIA_PARENT_NAMES ={
    TV : 'TV',
    RADIO:'Radio',
    NBA_TV: 'TV - NBATV',
    VGA: 'Video Game Advertising',
    FANTASY_GAMING: 'Fantasy & Gaming',
    VIGNETTES: 'VIGNETTES',
    OOH: 'OOH',
    DIGITAL: 'Digital'
}

export const ROLE = {
    MEDIA_AE: 'MEDIA-AE',
    INVENTORY_MANAGEMENT: 'INVENTORY MANAGEMENT',
    DIGITAL_INVENTORY_MANAGEMENT: 'DIGITAL INVENTORY MANAGEMENT',
    SALES_PLANNER: 'SALES PLANNER',
    CAMPAIGN_PLANNER: 'CAMPAIGN PLANNER',
    LINEAR_TRAFFICKING: 'LINEAR TRAFFICKING',
    DIGITAL_TRAFFICKING: 'DIGITAL TRAFFICKING',
    RECONCILIATION: 'RECONCILIATION',
    ADMIN: 'ADMIN',
    REPORTS: 'REPORTS'
}

export const CLAIMS = {

    ManageInventory: "ManageInventory",
    ManageDigitalInventory: "ManageDigitalInventory",
    ManageSalesPlanning: "ManageSalesPlanning",
    ManageCampaignPlanning: "ManageCampaignPlanning",
    ManageLinearTrafficking: "ManageLinearTrafficking",
    ManageDigitalTrafficking: "ManageDigitalTrafficking",
    ManageReconciliation: "ManageReconciliation",
    ManageAdmin: "ManageAdmin",
    ManageReports: "ManageReports"
}

export const SCREEN = {
    BUILD_SCHEDULE: 'BUILD_SCHEDULE',
}

export const Inventory = {
    networkId: "Network is a required field.",
    StartDate: "Start date is a required field.",
    EndDate: "End date is a required field.",
    invalidEndDate: "Invalid end date.",
    ValidateStartDateLessThanEndDate: "Make sure start date is less than or euqals to end date",
    StartDateEndDateFallsBetweenSeasonStartDateAndEndDate:'Make sure start date and end date falls between season start date and season end date',
    EndAfter: "End after is a required field.",
    EndAfterCheck: "End after cannot exceed to Season End Date.",
    EstAirTime: "Est AirTime is a required field.",
    Frequency: "Frequency is a required field.",
    Days: "Day(s) is required field.",
    endAfter: "endAfter",
    endDate: "endDate",
    warning: "warning",
    sysError: "System error, please login again.",
    dealId: "InventoryID not found.",
    dailyId: 601,
    weeklyId: 602,
    monthlyId: 603,
    Yes:"yes",
    No:"no",
    App:"app",
    Web:"Web",
    AdUnitSizes:"200x90,300x250,320x33,320x50,640x100,728x90,970x90",
    MediaTypeId: 101,
    ActionType: 754
}

export const Deal = {
  
    soldbyId: "Sold by is a required field.",
    billbyId: "Bill by is a required field.",
    notes: "Comment is a required field.",
}

export const DigitalAddInvInfo = {
  
    comment: "Comment is a required field.",
    siteURL: "Site URL is a required field.",
}

export const inventoryDealConstants = {
    DigitalParentId: 100,
    TVParentId: 150,
    RadioParentId: 200,
    InventorySource: 1050,
}

export const PartnerType = {
    Licensee_Sponsor: 501,
    NonPartner: 502,
    Broadcaster: 503,
    Both: 504
}

export const LOOKUP_VALUE = {
    Programming_Status: 100,
    Market_Type: 110,
    Planning_Status: 200,
    Bill_Type: 250,
    Filter_Preference: 300,
    Bill_By: 310,
    Column_Preference: 350,
    Upload_Status: 400,
    Upload_Audit: 450,
    PartnerType: 500,
	Inventory_Status: 550,
    Distribution_Type: 600,
    Days_of_Week: 650,
    Schedule_Status: 700,
	Inventory_Action_Type: 750,
    Rate_Type: 800,
    Day_Part: 850,
    Campaign_Unit_Type: 150,
    Media_Plan_Status : 900,
    Sales_Right: 1100,
    Venturized: 950,
    Distribution_Rule_Type: 1150,
    Schedule_Ad_Unit_Status: 1345,
    Demography_Type: 1450,
    Digital_Placement: 1600,
    Module_Names:1700
}


export const IdsToHideBuildSchedule = [151, 201]

export const HideBreakPositions = ["Digital", "Social Media","Video Game Advertising", "CRM"]