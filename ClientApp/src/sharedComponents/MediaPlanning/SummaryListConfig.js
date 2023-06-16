//MediaType - TV/ROS/RADIO/VGA/PRINT/DIGITAL/VIRTUAL_SIGNAGE
const SummaryListConfig = (props) => {
  let common = CommonFieldsConfig;

  let fields = props.IsCampaignPlanning ? CampaignPlanningConfig : SalesPlanningConfig;

  let mediaTypeFields = fields[MediaTypeMapping(props.MediaType, props.UnitTypeName, props.MediaTypeParent)];

  if (!mediaTypeFields)
    mediaTypeFields = fields[MediaTypeMapping(props.MediaTypeParent, props.UnitTypeName, props.MediaTypeParent)];

  if (!mediaTypeFields)
    mediaTypeFields = fields[MediaTypeMapping(null, props.UnitTypeName, props.MediaTypeParent)];

  return { CommonFields: common, MediaTypeFields: mediaTypeFields };
};

export default SummaryListConfig;

const MediaTypeMapping = (mediaType, unitTypeName, parentMediaType) => {
  if (!mediaType) return "DEFAULT";

  if (mediaType.toUpperCase() === "CRM" && parentMediaType.toUpperCase() === "DIGITAL") return "DIGITALCRM";
  if (mediaType.toUpperCase() === "VIDEO GAME ADVERTISING") return "VGA";
  if (mediaType.toUpperCase() === "SOCIAL MEDIA") return "SOCIALMEDIA";
  if (mediaType.toUpperCase() === "GAME" && parentMediaType.toUpperCase() === "DIGITAL") return "DEFAULT";
  if (mediaType.toUpperCase() === "NON-GAME" && parentMediaType.toUpperCase() === "DIGITAL") return "DEFAULT";
  if (mediaType.toUpperCase() === "OTT" && parentMediaType.toUpperCase() === "DIGITAL") return "DEFAULT";
  if (mediaType.toUpperCase() === "TV" && unitTypeName.toUpperCase() === "VIRTUAL SIGNAGE") return "VIRTUAL_SIGNAGE";

  return mediaType.toUpperCase();
};

const SalesPlanningConfig = {
  TV: {
    impressions: false,
    demography: true,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork : true,
  },
  ROS: {
    impressions: false,
    demography: false,
    proposedISCI: true,
    ISCIstartDate: true,
    ISCIendDate: true,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  RADIO: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  VGA: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  PRINT: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  CRM: {
    impressions: false,
    demography: true,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  DIGITAL: {
    impressions: true,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: true,
    trackingLink: true,
    regionNetwork: true,
    isDigital: true,
    isPureDigital: true,
  },
  SOCIALMEDIA: {
    impressions: true,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: true,
    regionNetwork: true,
    isDigital: true,
    isPureDigital: false,
  },
  DIGITALCRM: {
    impressions: true,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: true,
    regionNetwork: true,
    isDigital: true,
    isPureDigital: false,
  },
  VIRTUAL_SIGNAGE: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  DEFAULT: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: true,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
    isDigital: false,
    isPureDigital: false,
  },
};

const CampaignPlanningConfig = {
  TV: {
    impressions: false,
    demography: true,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  ROS: {
    impressions: false,
    demography: false,
    proposedISCI: true,
    ISCIstartDate: true,
    ISCIendDate: true,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  RADIO: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  VGA: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  PRINT: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  CRM: {
    impressions: false,
    demography: true,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  DIGITAL: {
    impressions: true,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: true,
    trackingLink: true,
    regionNetwork: true,
    isDigital : true,
    isPureDigital : true,
  },
  VIRTUAL_SIGNAGE: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
  },
  SOCIALMEDIA: {
    impressions: true,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: true,
    regionNetwork: true,
    isDigital: true,
    isPureDigital: false,
  },
  DIGITALCRM: {
    impressions: true,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: true,
    regionNetwork: true,
    isDigital: true,
    isPureDigital: false,
  },
  DEFAULT: {
    impressions: false,
    demography: false,
    proposedISCI: false,
    ISCIstartDate: false,
    ISCIendDate: false,
    customerRate: false,
    unitSizes: false,
    trackingLink: false,
    regionNetwork: true,
    isDigital: false,
    isPureDigital: false,
  },
};

const CommonFieldsConfig = {
  startDate: true,
  endDate: true,
  daypart: true,
  episodes: true,
  units: true,
  assetName: true,
  mediaType: true,
  unitSize: true,
  unitType: true,
};
