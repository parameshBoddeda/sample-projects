
//MediaType - TV/ROS/RADIO/VGA/PRINT/DIGITAL/VIRTUAL_SIGNAGE
const PlanFieldsConfig = (props) => {

    let common = CommonFieldsConfig;

    let fields = (props.IsCampaignPlanning) ? CampaignPlanningConfig : SalesPlanningConfig;

    let mediaTypeFields = fields[MediaTypeMapping(props.MediaType, props.MediaTypeParent)];
    
    if(!mediaTypeFields)
        mediaTypeFields = fields[MediaTypeMapping(props.MediaTypeParent, props.MediaTypeParent)];

    if (!mediaTypeFields)
        mediaTypeFields = fields[MediaTypeMapping(null, props.MediaTypeParent)];

    return { CommonFields : common, MediaTypeFields : mediaTypeFields };
}

export default PlanFieldsConfig;

const MediaTypeMapping = (mediaType, parentMediaType) =>{
    if(!mediaType) return "DEFAULT";

    if (mediaType.toUpperCase() === "CRM" && parentMediaType.toUpperCase() === "DIGITAL") return "DIGITALCRM";
    if (mediaType.toUpperCase() === "VIDEO GAME ADVERTISING") return "VGA";
    if (mediaType.toUpperCase() === "SOCIAL MEDIA") return "SOCIALMEDIA";
    if (mediaType.toUpperCase() === "GAME" && parentMediaType.toUpperCase() === "DIGITAL") return "DEFAULT";
    if (mediaType.toUpperCase() === "NON-GAME" && parentMediaType.toUpperCase() === "DIGITAL") return "DEFAULT";
    if (mediaType.toUpperCase() === "OTT" && parentMediaType.toUpperCase() === "DIGITAL") return "DEFAULT";
    if (mediaType.toUpperCase() === "VIRTUAL SIGNAGE") return "VIRTUAL_SIGNAGE";
    //if (mediaType.toUpperCase() === "VIGNETTES") return "VIRTUAL_SIGNAGE";
    
    return mediaType.toUpperCase();
}

const SalesPlanningConfig = {
    TV: {
        RateLabel : 'Base Rate',
        CustomRateLabel: 'Custom Rate',        
        impressions: {visible: false,editable: true,required : false,},
        demography: {visible: true,editable: true,required: false,},
        proposedISCI: {visible: false,editable: false,required: false,},
        ISCIstartDate: {visible: false,editable: false,required: false,},
        ISCIendDate: {visible: false,editable: false,required: false,},
        customerRate: {visible: true,editable : true,required : true},
        unitSizes: {visible: false,editable: false,required: false,},
        trackingLink: {visible: false,editable: false,required: false,},
        placement: {visible: false,editable: false,required: false,},
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    ROS: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: true, required: false, },
        demography: { visible: true, editable: true, required: false, },
        proposedISCI: { visible: true, editable: true, required: true, },
        ISCIstartDate: { visible: true, editable: true, required: true, },
        ISCIendDate: { visible: true, editable: true, required: true, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    RADIO: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: true, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    VGA: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    PRINT: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    CRM: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: true, editable: true, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart: true,
        showEpisodesAndUnits: true
    },
    DIGITAL: {
        RateLabel: 'Base Rate',
        CustomRateLabel: '$ Rate',
        ImpressionsLabel: 'Target',
        ViewsLabel: 'Target',
        impressions: { visible: true, editable: true, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: true, editable: true, required: true, },
        trackingLink: { visible: true, editable: true, required: true, },
        placement: { visible: true, editable: false, required: false, },
        comment: { visible: true, editable: true, required: false, },
        rateType: { visible: true, editable: true, required: false },
        showDayPart : false,
        showEpisodesAndUnits: false
    },
    SOCIALMEDIA: {
        RateLabel: 'Base Rate',
        CustomRateLabel: '$ Rate',
        ImpressionsLabel: 'Target',
        ViewsLabel: 'Target',
        impressions: { visible: true, editable: true, required: true, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: true, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: true, editable: true, required: true, },
        comment: { visible: true, editable: true, required: true, },
        rateType:{visible: true, editable: true, required: false},
        showDayPart : false,
        showEpisodesAndUnits: false
    },
    DIGITALCRM: {
        RateLabel: 'Base Rate',
        CustomRateLabel: '$ Rate',
        ImpressionsLabel: 'Target',
        ViewsLabel: 'Target',
        impressions: { visible: true, editable: true, required: true, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: true, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: true, editable: true, required: true, },
        comment: { visible: true, editable: true, required: true, },
        rateType: { visible: true, editable: true, required: false },
        showDayPart: false,
        showEpisodesAndUnits: false
    },
    VIRTUAL_SIGNAGE: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    DEFAULT: {
        RateLabel: 'Base Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: true, editable: true, required: true },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
}

const CampaignPlanningConfig = {
    TV : {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: true, editable: true, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    ROS: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: true, editable: true, required: false, },
        proposedISCI: { visible: true, editable: true, required: false, },
        ISCIstartDate: { visible: true, editable: true, required: false, },
        ISCIendDate: { visible: true, editable: true, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    RADIO: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: true, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    VGA: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    PRINT: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    CRM: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: true, editable: true, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart: true,
        showEpisodesAndUnits: true
    },
    DIGITAL: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        ImpressionsLabel: 'Target',
        ViewsLabel: 'Target',
        impressions: { visible: true, editable: true, required: false, },
        estimatedImpressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: true, editable: true, required: false, },
        trackingLink: { visible: true, editable: true, required: false, },
        placement: { visible: true, editable: false, required: false, },
        comment: { visible: true, editable: true, required: false, },
        rateType: { visible: true, editable: true, required: false },
        showDayPart : true,
        showEpisodesAndUnits: false,
        IsDigital : true
    },
    SOCIALMEDIA: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        ImpressionsLabel: 'Target',
        ViewsLabel: 'Target',
        impressions: { visible: true, editable: true, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: true, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: true, editable: true, required: false, },
        comment: { visible: true, editable: true, required: false, },
        rateType:{visible: true, editable: true, required: false},
        showDayPart : true,
        showEpisodesAndUnits: false
    },
    DIGITALCRM: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        ImpressionsLabel: 'Target',
        ViewsLabel: 'Target',
        impressions: { visible: true, editable: true, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: true, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: true, editable: true, required: false, },
        comment: { visible: true, editable: true, required: false, },
        rateType: { visible: true, editable: true, required: false },
        showDayPart: true,
        showEpisodesAndUnits: false
    },
    VIRTUAL_SIGNAGE: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits: true
    },
    DEFAULT: {
        RateLabel: 'Rate',
        CustomRateLabel: 'Custom Rate',
        impressions: { visible: false, editable: false, required: false, },
        demography: { visible: false, editable: false, required: false, },
        proposedISCI: { visible: false, editable: false, required: false, },
        ISCIstartDate: { visible: false, editable: false, required: false, },
        ISCIendDate: { visible: false, editable: false, required: false, },
        customerRate: { visible: false, editable: false, required: false },
        unitSizes: { visible: false, editable: false, required: false, },
        trackingLink: { visible: false, editable: false, required: false, },
        placement: { visible: false, editable: false, required: false, },
        comment: { visible: false, editable: false, required: false, },
        showDayPart : true,
        showEpisodesAndUnits : true
    },
}

const CommonFieldsConfig = {
    startDate : {Required : true,},
    endDate: {Required: true,},
    daypart: {Required : true},
    episodes:{Required : true,},
    unitsPerWeek:{Required : true}
}
