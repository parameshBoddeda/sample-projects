//Global Imports Start
import React, { useState, useEffect, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import Backdrop from '@mui/material/Backdrop';

import { GetUserPreference } from './../../services/common.service';

//Global Imports End

//Regional Imports Start
import { ToastContainer, toast } from "react-toastify";
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import { GetRateCardData, GetRateCardRecords } from './../../services/rate.service';
import RateCardGrid from "./RateCardGrid";
import AddRateCard from "./RateCardActions/AddRateCard";
import AssignCustomer from "./RateCardActions/AssignCustomers";
import AppDataContext from "../../common/AppContext";
import FiltersScreen from './Filter/RateCardFiltersScreen';
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";
//Regional Imports End
function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const RateCardContainer = (props) => {
    const restrictedFields = ["id", "assetId", "changePerc", "countryId", "createdBy", "createdDate",
        "customerId", "customerRateId", "dayPartId", "isLatest", "leagueId", "networkId", "notes",
        "rateCardMasterId", "rateTypeId", "regionId", "unitSizeId", "unitTypeId", "updatedBy", "updatedDate"
    ];
    const classes = useStyles();
    let rateCardId = -1;
    // Hooks decalaration - Start
    const { leagueInfo, leagueId, username, FilterPreference } = useContext(AppDataContext);
    const [rateCardData, setRateCardData] = useState([])
    const [originalRateCardData, setOriginalRateCardData] = useState([])
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [RateCardRows, setRateCardRows] = React.useState([]);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [expandRateCardGrid, setExpandRateCardGrid] = useState(true);
    const [expandAddRateCard, setExpandAddRateCard] = useState(false);
    const [expandAssignCustomer, setExpandAssignCustomer] = useState(false);
    const [clearFilterStatus, setClearFilterStatus] = useState(false);
    const [rowClick, setRowClick] = useState(false);
    const [typeId, setTypeId] = useState();
    const [savedSearchList, setSavedSearchList] = useState([]);
    const [selectedFilterId, setSelectedFilterId] = useState(0)

    const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [action, setAction] = React.useState("");

    const [applyLocalFilter, setApplyLocalFilter] = useState(false);
    const [searchItem, setSearchItem] = useState();
    const [apply, setApply] = useState(false);
    const [isEditSearch, setIsEditSearch] = useState(false);

    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        rateCardList: true,
        addRateCard: false,
        assignCustomer: false,
    });

    const getEmptyFilterCriteria = () => {

        return {
            LeagueId: leagueId,
            rateCardId: rateCardId || -1,
            TypeId: typeId,
            region: [],
            country: [],
            mediaType: 0,
            partner: [],
            asset: [],
            unitType: [],
            rateType: 0,
            dayPart: 0,
            customer: 0,
            name: "",
            description: "",
            user: username
        }
    }


    // Hooks decalaration - End

    // API call to the Rate Card List data
    const getRateData = (leagueId, rateCardId) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        rateCardId = rateCardId || -1;
        GetRateCardData(leagueId, rateCardId).then(data => {
            if (data) {
                // console.log("received latest data")
                setRateCardData(data);
                setOriginalRateCardData(data);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
            else console.log("getRateData API is failing");
        })
    }

    const prepareRequestObect = (criteria) => {
        let regions = [];
        let countries = [];
        let partners = [];
        let assets = [];
        let unitType = [];

        if(criteria.region.length > 0) {
            criteria.region.map(ele => {
                regions.push(ele.value);
            });
        }

        if(criteria.asset.length > 0) {
            criteria.asset.map(ele => {
                assets.push(ele.value);
            });
        }

        if(criteria.partner.length > 0) {
            criteria.partner.map(ele => {
                partners.push(ele.value);
            });
        }

        if(criteria.country.length > 0){
            criteria.country.map(ele => {
                countries.push(ele.value);
            });
        }

        if(criteria.unitType.length > 0){
            criteria.unitType.map(ele => {
                unitType.push(ele.value);
            });
        }

        const obj = {
            LeagueId: leagueId,
            TypeId: typeId,
            RateCardId: rateCardId || -1,
        };

        if(regions.length > 0){
            obj["region"] = regions
        }

        if(countries.length > 0){
            obj["country"] = countries
        }

        if(criteria.Id){
            obj["Id"] = criteria.Id
        }

        if(criteria.name){
            obj["name"] = criteria.name
        }

        if(criteria.description){
            obj["description"] = criteria.description
        }

        if(criteria.mediaType.value){
            obj["mediaType"] = criteria.mediaType.value
        }

        if(criteria.partner){
            obj["partner"] = partners
        }

        if(criteria.asset){
            obj["asset"] = assets
        }

        if(criteria.unitType){
            obj["unitType"] = unitType
        }

        if(criteria.rateType.value){
            obj["rateType"] = criteria.rateType.value
        }

        if(criteria.customer.value){
            obj["customer"] = criteria.customer.value
        }

        if(criteria.dayPart.value){
            obj["dayPart"] = criteria.dayPart.value
        }

        obj["user"] = username;

        return obj;
    }
    const getAllRateCardData = (criteria) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        const obj = prepareRequestObect(criteria);
        GetRateCardRecords(obj).then(data => {
            if (data) {
                if(searchItem){
                    setApplyLocalFilter(true);
                    setRateCardData(getFilteredData(data));
                } else {
                    setApplyLocalFilter(false);
                    setRateCardData(data);
                }
                setOriginalRateCardData(data);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
            else console.log("getRateData API is failing");
        }).catch(err => {
            console.log(err);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    const getFilteredData = (data) => {
        if(searchItem && searchItem.length > 2) {
            const searchRegex = new RegExp(escapeRegExp(searchItem.trim()), 'i');
            const filteredRows = data.filter((row) => {
                return Object.keys(row).some((field) => {
                    if (restrictedFields.length > 0) {
                        if (row[field] && (!restrictedFields.includes(field))) {
                            return searchRegex.test(row[field].toString());
                        }
                    } else {
                        if (row[field]) {
                            return searchRegex.test(row[field].toString());
                        }
                    }
                });
            });
            setApply(false);
            return filteredRows;
        } else {
            setApply(false);
            return data;
        }
    }

    //.....UI Change Handlers - Start

    const handleClose = () => {
        setobjAccordionVisiblity({
            rateCardList: true,
            addRateCard: false,
            assignCustomer: false,
        });
        setIsEditing(false);
        setExpandAddRateCard(false);
        setExpandAssignCustomer(false);
    }
    const splitUIHandler = (action) => {
        if (action === "addRate") {
            setobjAccordionVisiblity({
                rateCardList: true,
                addRateCard: true,
                assignCustomer: false,
            })
            setExpandAddRateCard(true);
            setExpandAssignCustomer(false);
        }
        else if (action === "assignCustomer") {
            setobjAccordionVisiblity({
                rateCardList: true,
                addRateCard: false,
                assignCustomer: true,
            })
            setExpandAddRateCard(false);
            setExpandAssignCustomer(true);
        } else if (action === "updateRate") {

        }
        else if (action === "increaseRate") {

        }
    }

    useEffect(() => {


        if (action === "addRate") {
          setobjAccordionVisiblity({
            rateCardList: true,
            addRateCard: true,
            assignCustomer: false,
          });
          setExpandAddRateCard(true);
          setExpandAssignCustomer(false);
        } else if (action === "assignCustomer") {
          setobjAccordionVisiblity({
            rateCardList: true,
            addRateCard: false,
            assignCustomer: true,
          });
          setExpandAddRateCard(false);
          setExpandAssignCustomer(true);
        } else if (action === "closeAdd") {
          setobjAccordionVisiblity({
            rateCardList: true,
            addRateCard: false,
            assignCustomer: false,
          });
          setIsEditing(false);
          setExpandAddRateCard(false);
          setExpandAssignCustomer(false);
        }
      }, [action]);

    const buttonClicked = () => {
        setShowSavedSearchPopup(true);
        setIsEditSearch(false);
    }

    const SavedSearchPopupClose = () => {
        setShowSavedSearchPopup(false);
    }

    const handleFilterClick = () => {
        let tempFilters = {
            LeagueId: leagueId,
            rateCardId: rateCardId,
            region: [],
            country: [],
            mediaType: 0,
            partner: [],
            asset: [],
            unitType: [],
            rateType: 0,
            dayPart: 0,
            customer: 0,
            name: "",
            description: "",
            Id: 0,
            TypeId: typeId,
            user: username
        };
        setIsEditSearch(false);
        setFilterCriteria(tempFilters);
        setShowFilterPopup(true);
        setIsEditSearch(false);
    }

    const handleFilterCloseClick = () => {
        setShowFilterPopup(false);
        if(selectedFilterId) {
            getUserPreference(typeId, selectedFilterId);
        }
        else {
            const clearedFilter = getEmptyFilterCriteria();
            setFilterCriteria(clearedFilter)
            getAllRateCardData(clearedFilter);
            setSelectedFilterId(0)
            setClearFilterStatus(false)
        }
    }

    const handleRateCardGridExpand = () => {
        setExpandAddRateCard(false);
    }

    const handleAddRateCardExpand = () => {
        setExpandAddRateCard(!expandAddRateCard);
    }
    const handleAssignCustomerExpand = () => {
        setExpandAssignCustomer(!expandAssignCustomer)
    }

    const handleSavedSearchesPopup = (status) => {
        setShowSavedSearchPopup(false);
        setShowFilterPopup(false);
        if (status) {
            // getUserPreference(typeId);
            handleClearFilterClick(getEmptyFilterCriteria())
        }
    }

    const handleSavedSearchesChange = (id) => {
        setShowFilterPopup(false);
        getUserPreference(typeId, id);
        setSelectedFilterId(id)
    }

    const getUserPreference = (typeId, prefId) => {
        setShowLoading(true);
        setOpenBackdrop(true);
        if(!prefId && selectedFilterId && isEditSearch){
            prefId = selectedFilterId;
        }
        GetUserPreference(typeId, leagueId).then((data) => {
            let defaultPref = null;
            if (prefId) {
                defaultPref = data && data.find(x => x.id === prefId);
            } else {
                defaultPref = data && data.length > 0 ? data[0] : null;
                setSelectedFilterId(defaultPref?.id)
            }
            let prefJson = defaultPref ? JSON.parse(defaultPref.prefererJson) : getEmptyFilterCriteria();
            let clearFilterStatus = defaultPref ? true : false;
            setClearFilterStatus(clearFilterStatus);
            prefJson.LeagueId = leagueId;
            prefJson.TypeId = typeId;
            prefJson.RateCardId = rateCardId;
            prefJson.Id = defaultPref ? defaultPref.id : 0;
            prefJson.name = defaultPref?.name || '';
            prefJson.description = defaultPref?.description || '';
            setFilterCriteria(prefJson);
            setSavedSearchList(data);
            //getRateData(prefJson);
            getAllRateCardData(prefJson);
            setShowSavedSearchPopup(false);
            // setShowLoading(false);
            // setOpenBackdrop(false);
        }).catch(err => {
            console.log(err);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    const setRateCardListFilterData = (filterData) => { setRateCardData(filterData) }
    const setFilterData = (filterData) => setRateCardRows(filterData);

    const handleSearchCriteriaChange = (criteriaObj, addInPrefList) => {
        setOpenBackdrop(true);
        setShowLoading(true);
        setFilterCriteria(criteriaObj);
        setShowFilterPopup(false);
        setClearFilterStatus(true);
        if (addInPrefList)
            getUserPreference(typeId);
        else
            getAllRateCardData(criteriaObj);
    }
    //.....UI Change Handlers - End

    const handleClearFilterClick = () => {
        getAllRateCardData(getEmptyFilterCriteria());
        setClearFilterStatus(false);
        setShowFilterPopup(false);
        setSelectedFilterId(0);
        setIsEditSearch(false)
        setFilterCriteria(getEmptyFilterCriteria());
    }

    useEffect(()=>{
        if (FilterPreference && FilterPreference.length > 0) {
            let tId = FilterPreference.find(x => x.lookupText === "RateCard").lookupId;
            getUserPreference(tId, null);
            setTypeId(tId)
            setFilterCriteria({
                LeagueId: leagueId,
                typeId:tId,
                rateCardId: rateCardId,
                user: username
            })
        }
    }, [leagueId, FilterPreference])


const editGlobalSearch = (data) => {
    setIsEditSearch(true);
    let tempObj = {
        LeagueId: leagueId,
        TypeId: typeId,
        Id: data.id,
        name: data.name,
        description: data.description || "",
    }

    let prefJson = JSON.parse(data.prefererJson);
    tempObj["region"] = prefJson.region;
    tempObj["asset"] = prefJson.asset;
    tempObj["partner"] = prefJson.partner;
    tempObj["country"] = prefJson.country;
    tempObj["unitType"] = prefJson.unitType;
    tempObj["mediaType"] = prefJson.mediaType;

    tempObj["rateType"] = prefJson.rateType;
    tempObj["customer"] = prefJson.customer;
    tempObj["dayPart"] = prefJson.dayPart;
    tempObj["rateCardId"] = prefJson.rateCardId; 
    setFilterCriteria(tempObj);
    setShowSavedSearchPopup(false);
    setSelectedFilterId(data.id)
    setShowFilterPopup(true);
}
    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText="RATE CARD"
            >
                <>
                    <IconButton onClick={handleFilterClick} component="div" title="Add Filter">
                        <FilterAltOutlinedIcon className={classes.filter} />
                    </IconButton>
                    {clearFilterStatus && <IconButton onClick={handleClearFilterClick} component="div" title="Clear Filter">
                        <FilterAltOffOutlinedIcon className={classes.filter} />
                    </IconButton>}
                    <Box component="div">
                        <Button onClick={buttonClicked} size="small" color="primary" variant="contained">{'Saved Searches'}</Button>
                    </Box>
                </>
            </SubHeader>

            {
                showFilterPopup ? <FiltersScreen handleFilterCloseClick={handleFilterCloseClick} notifySuccess={(msg) => notifySuccess(msg)}
                    handleCriteriaChange={(criteria, addInPrefList, data) => handleSearchCriteriaChange(criteria, addInPrefList)}
                    Criteria={filterCriteria} showLoading={(bool)=>setShowLoading(bool)} openBackdrop={(bool) => setOpenBackdrop(bool)}
                    notifyWarning={(msg) => notifyWarning(msg)} isEditSearch={isEditSearch}
                /> :
                props.page === "ratecard" && <Container maxWidth={false} disableGutters className={classes.container}>
                    <>
                        <AccordionHorizontal hideExpandButton={rowClick ? false : true}
                            resize={!rowClick ? !(expandRateCardGrid) : (expandRateCardGrid && expandAddRateCard)}
                            accordionTitle={"Rate Card List"} displayName="Add Rate Card"
                            handleExpand={handleRateCardGridExpand}
                            Expanded={expandRateCardGrid}>
                            <RateCardGrid
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                hideExpandIcon={rowClick ? false : true}
                                isEditing={isEditing}
                                view={!(expandRateCardGrid && (expandAddRateCard || expandAssignCustomer))}
                                setFilterData={setRateCardListFilterData}
                                rows={rateCardData}
                                restrictedFields={restrictedFields}
                                originalData={originalRateCardData}
                                splitUIHandler={splitUIHandler}
                                refreshDataFromDB={() => getAllRateCardData(filterCriteria)}
                                filterCriteria={filterCriteria}
                                setRateCardData={setRateCardData}
                                action={action}
                                setAction={setAction}
                                setSearchItem={(val) => setSearchItem(val)}
                                resetApplyLocalFilter={()=> {
                                        setApplyLocalFilter(false);
                                    }
                                }
                                searchItem={searchItem}
                                applyLocalFilter={applyLocalFilter}
                            />
                        </AccordionHorizontal>
                    </>

                    {/* Don't Remove these commented code below.They are a part of my implementaion */}

                    {
                        AccordionVisiblity.addRateCard && <AccordionHorizontal hideExpandButton={rowClick ? false : true}
                            resize={!rowClick ? !expandRateCardGrid : expandAddRateCard}
                            displayName="Add Rate Card"
                            accordionTitle={"Add Rate Card"} Expanded={expandAddRateCard}
                            handleExpand={handleAddRateCardExpand}
                        >
                            <AddRateCard handleClose={handleClose}
                                refreshDataFromDB={() => getAllRateCardData(filterCriteria)}
                                hideExpandIcon={rowClick ? false : true}
                                showCloseIcon={false}
                                showLoading={(bool) => setShowLoading(bool)}
                                openBackdrop={(bool )=> setOpenBackdrop(bool)}
                                rows={rateCardData}
                                setRateCardData={setRateCardData}
                                setAction={setAction}
                            />

                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.assignCustomer && <AccordionHorizontal hideExpandButton={rowClick ? false : true}
                            // resize={!rowClick ? !expandRateCardGrid : expandAddRateCard}
                            displayName="Assign Customer"
                            accordionTitle={"Assign Customer"} Expanded={expandAssignCustomer}
                            handleExpand={handleAssignCustomerExpand}
                        >
                            <AssignCustomer handleClose={handleClose}
                                hideExpandIcon={rowClick ? false : true}
                                showCloseIcon={false}
                            />

                        </AccordionHorizontal>
                    }


                    {showLoading && <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                    >
                        <div className={'loader-div'}><div className={'loading'}></div></div>
                    </Backdrop>}


                </Container>
            }

            {showSavedSearchPopup && <SavedSearches data={savedSearchList}
                notifySuccess={notifySuccess}
                show={showSavedSearchPopup} handleEditClick={editGlobalSearch}
                handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
                handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                selectedFilterId={selectedFilterId}
                deleteSelectedFilter={() => setSelectedFilterId(0)}
            />}

        </React.Fragment>
    )
}

RateCardContainer.displayName = "RateCardContainer";
export default RateCardContainer;