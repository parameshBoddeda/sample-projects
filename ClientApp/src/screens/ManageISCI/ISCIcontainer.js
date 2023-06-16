//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@mui/material/Backdrop';
import FiltersScreen from './Filter/IsciFiltersScreen';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
//Global Imports End

//Regional Imports Start
import AppDataContext from '../../common/AppContext';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import { ToastContainer, toast } from "react-toastify";
import { GetISCIsList, InsUpdISCIinfo } from '../../services/common.service';
import ISCIgrid from "./ISCIgrid";
import AddEditISCI from "./AddEditISCI";
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';

import { GetUserPreference } from "./../../services/common.service";
import SavedSearches from "../../sharedComponents/SavedSearches/SavedSearches";
import * as AppLanguage from '../../common/AppLanguage';

function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
        '& > .MuiCard-root': {
            '& .MuiCardActions-root': {
                height: 'calc(100vh - 128px) !important',
            },
            '& > .MuiCollapse-entered': {
                maxHeight: 'calc(100vh - 128px) !important',
            },
        },
    },
}));

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const ISCIcontainer = (props) => {
    const classes = useStyles();
    const restrictedFields = [];
    const { leagueId, username, FilterPreference } = useContext(AppDataContext);
    const [orgIscisList, setOrgISCIsList] = useState([]);
    const [isciList, setISCIsList] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [formType, setFormType] = useState("Add");
    const [editData, setEditData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [objAccordionVisiblity, setobjAccordionVisiblity] = React.useState({
        isciList: true,
        editIsci: false,
    });
    const [expendIsciList, setExpendIsciList] = useState(true);
    const [expendEditIsci, setExpendEditIsci] = useState(false);

    const [applyLocalFilter, setApplyLocalFilter] = useState(false);
    const [searchItem, setSearchItem] = useState();
    const [clearFilterStatus, setClearFilterStatus] = useState(false);
    const [savedSearchList, setSavedSearchList] = useState([]);
    const [showSavedSearchPopup, setShowSavedSearchPopup] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [TypeId, setTypeId] = useState();
    const [selectedFilterId, setSelectedFilterId] = useState(0)
    const [isEditSearch, setIsEditSearch] = useState(false);
    const getFilteredData = (data) => {
        if(searchItem && searchItem.length > 2) {
            const searchRegex = new RegExp(escapeRegExp(searchItem.trim()), 'i');
            const filteredRows = data.filter((row) => {
                return Object.keys(row).some((field) => {
                    if (restrictedFields && restrictedFields.length > 0) {
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
            return filteredRows;
        } else {
            return data;
        }
    }

    const getISCIList = (obj) => {
        let objnew = JSON.parse(JSON.stringify(obj))
        setShowLoading(true);
        setOpenBackdrop(true);
        let mediatype = objnew.mediaTypeId;
        let mediaTypeup = (mediatype && mediatype.length > 0 && mediatype.map(u => u.value)) || [];
        objnew.mediaTypeId = mediaTypeup;
        objnew.marketTypeId = objnew.marketTypeId && objnew.marketTypeId.lookupId ? objnew.marketTypeId.lookupId : 0;
        GetISCIsList(objnew).then(data => {
            if (data && data.length > 0) {
                if(searchItem){
                    setISCIsList(getFilteredData(data));
                } else {
                    setISCIsList(data);
                }                
                setOrgISCIsList(data);
            }
            else{
                setISCIsList([]);
                setOrgISCIsList([]);
            }
            if(searchItem){
                setApplyLocalFilter(true);
            } else {
                setApplyLocalFilter(false);
            }
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            console.log(err);
            setISCIsList([]);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    useEffect(() => {
        // getISCIList(getEmptyFilterCriteria());
    }, [leagueId]);

    useEffect(() => {
        if (FilterPreference && FilterPreference.length > 0) {
            let tId = FilterPreference.find(x => x.lookupText === "ISCI").lookupId;
            getUserPreference(tId, null);
            setTypeId(tId)
            setFilterCriteria({
                LeagueId: leagueId,
                TypeId: tId,
                user: username
            })
        }
    }, [leagueId, FilterPreference]);

    const editISCI = (isci) => {
        setobjAccordionVisiblity({
            isciList: true,
            editIsci: true,
        });
        setExpendEditIsci(true);
        setExpendIsciList(true);
        // GetISCIsList(leagueId, `${id}`).then(data => {
            setFormType("Edit");
            setEditData(isci);
            setIsEdit(true);
        // }).catch(err => {
        //     console.log(err);
        // })
    }

    const setFilterData = (filterData) => { setISCIsList(filterData) };

    const handleSubmit = (obj, isEdit) => {
        setobjAccordionVisiblity({
            isciList: true,
            editIsci: false,
        });
        setExpendEditIsci(false);
        setExpendIsciList(true);
        InsUpdISCIinfo(obj).then(response => {
            if (!isEdit) {
                notifySuccess(AppLanguage.APP_MESSAGE.Create_ISCI_Success);
            } else {
                notifySuccess(AppLanguage.APP_MESSAGE.Update_ISCI_Success);
            }
            getISCIList(filterCriteria);
            setIsEdit(false);
            setEditData(null);
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => { });
    }


    const handleExpandIsciList = () => {
        if (expendEditIsci) {
            setExpendIsciList(!expendIsciList);
        }
    }
    const handleExpandAddEditIsci = () => {
        if(expendIsciList)
            setExpendEditIsci(!expendEditIsci);
    }


    /******************************

    Global Filter -

    ********************************/

    const getEmptyFilterCriteria = () => {

        return {
            "LeagueId": leagueId,
            "TypeId": TypeId,
            "name": "",
            "description": "",
            "Id": 0
            //"type": ""
        }
    }

    const buttonClicked = () => {
        setShowSavedSearchPopup(true);
    }

    const handleFilterClick = () => {
        let tempFilters = {
            "LeagueId": leagueId,
            "TypeId": TypeId,
            "name": "",
            "description": "",
            "Id": 0,
        };
        setIsEditSearch(false);
        setFilterCriteria(tempFilters);
        setShowFilterPopup(true);
    }

    const handleClearFilterClick = () => {
        getISCIList(getEmptyFilterCriteria());
        setClearFilterStatus(false);
        setShowFilterPopup(false);
        setIsEditSearch(false);
        setSelectedFilterId(0)
        setFilterCriteria(getEmptyFilterCriteria());
    }

    const handleFilterCloseClick = () => {
        setShowFilterPopup(false);
        if(selectedFilterId) {
            getUserPreference(TypeId, selectedFilterId);
        } else {
            const clearedFilter = getEmptyFilterCriteria()
            setFilterCriteria(clearedFilter)
            getISCIList(clearedFilter);
            setClearFilterStatus(false);
            setSelectedFilterId(0)
        }
    }

    const handleSearchCriteriaChange = (criteriaObj, addInPrefList) => {
        setOpenBackdrop(true);
        setShowLoading(true);
        criteriaObj = {
            typeName : criteriaObj.typeName || "Sales",
            ...criteriaObj  
        };
        setFilterCriteria(criteriaObj);
        setShowFilterPopup(false);
        setClearFilterStatus(true);
        if (addInPrefList) {
            getUserPreference(TypeId);
        }
        else {
            getISCIList(criteriaObj);
        }

    }

    const getUserPreference = (TypeId, prefId) => {
        if(!prefId && selectedFilterId && isEditSearch){
            prefId = selectedFilterId;
        }
        setShowLoading(true);
        setOpenBackdrop(true);
        GetUserPreference(TypeId, leagueId).then((data) => {

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
            prefJson.TypeId = TypeId;
            prefJson.Id = defaultPref ? defaultPref.id : 0;
            prefJson.name = defaultPref?.name || '';
            prefJson.description = defaultPref?.description || '';
            setFilterCriteria(prefJson);
            setSavedSearchList(data);
            getISCIList(prefJson);
            // getSchedule(leagueId);
            //getAllRateCardData(prefJson);
            setShowSavedSearchPopup(false);
        }).catch(err => {
            console.log(err);
            setShowLoading(false);
            setOpenBackdrop(false);
        })
    }

    const handleSavedSearchesPopup = (status) => {
        setShowSavedSearchPopup(false);
        setShowFilterPopup(false);
        if (status) {
            getUserPreference(TypeId);
        }
    }

    const handleSavedSearchesChange = (id) => {
        setShowFilterPopup(false);
        setSelectedFilterId(id)
        getUserPreference(TypeId, id);
    }

    const editGlobalSearch = (data) => {
        let tempObj = {
            LeagueId: leagueId,
            TypeId: TypeId,
            Id: data.id,
            name: data.name,
            description: data.description || "",
        }

        let prefJson = JSON.parse(data.prefererJson);
        tempObj["marketTypeId"] = prefJson.marketTypeId;
        tempObj["mediaTypeId"] = prefJson.mediaTypeId;
        tempObj["type"] = prefJson.type;
        tempObj["startDate"] = prefJson.startDate || null;
        tempObj["endDate"] = prefJson.endDate || null;
        setIsEditSearch(true)
        setFilterCriteria(tempObj);
        setShowSavedSearchPopup(false);
        setSelectedFilterId(data.id)
        setShowFilterPopup(true);
    }

    return (
        <React.Fragment>
            <ToastContainer autoClose={3000} />
            <SubHeader headerText={"ISCI MANAGEMENT"}>
                <>
                    <IconButton title="Filter" component="div" onClick={handleFilterClick}>
                        <FilterAltOutlinedIcon className={classes.filter} />
                    </IconButton>
                    {clearFilterStatus && <IconButton title="Remove Filter" onClick={handleClearFilterClick} component="div">
                        <FilterAltOffOutlinedIcon className={classes.filter} />
                    </IconButton>}
                    <Box component="div">
                        <Button onClick={buttonClicked} size="small" color="primary" variant="contained">{'Saved Searches'}</Button>
                    </Box>
                </>
            </SubHeader>
            {
                showFilterPopup ? <FiltersScreen handleFilterCloseClick={handleFilterCloseClick} notifySuccess={(msg) => notifySuccess(msg)}
                    handleCriteriaChange={(criteria, addInPrefList) => handleSearchCriteriaChange(criteria, addInPrefList)}
                    Criteria={filterCriteria} showLoading={(bool) => setShowLoading(bool)} openBackdrop={(bool) => setOpenBackdrop(bool)}
                    notifyWarning={(msg) => notifyWarning(msg)} isEditSearch={isEditSearch}

                />
                :
                <Container maxWidth={false} disableGutters className={classes.container}>

                    {objAccordionVisiblity.isciList && <AccordionHorizontal resize={expendEditIsci && expendIsciList}
                        Expanded={expendIsciList} accordionTitle={"ISCI List"} handleExpand={handleExpandIsciList}

                    >
                        <ISCIgrid rows={isciList}
                            view={!(expendIsciList && expendEditIsci)}
                            setFilterData={setFilterData}
                            OrgRows={orgIscisList}
                            handleISCIAddClick={() => {
                                setFormType("Add");
                                setobjAccordionVisiblity({
                                    isciList: true,
                                    editIsci: true,
                                });
                                setExpendEditIsci(true);
                                setExpendIsciList(true);
                            }}
                            handleISCIEditClick={(data) => {
                                editISCI(data)
                            }}
                            restrictedFields={restrictedFields}

                            setSearchItem={(val) => setSearchItem(val)}
                            resetApplyLocalFilter={() => {
                                setApplyLocalFilter(false);
                            }
                            }
                            searchItem={searchItem}
                            applyLocalFilter={applyLocalFilter}
                            filterCriteria={filterCriteria}
                        />
                    </AccordionHorizontal>
                    }

                    {objAccordionVisiblity.editIsci && <AccordionHorizontal Expanded={expendEditIsci}
                        accordionTitle={"Add/Edit ISCI"} handleExpand={handleExpandAddEditIsci}
                        resize={expendEditIsci && expendIsciList}

                    >
                        <AddEditISCI
                            notifySuccess={notifySuccess}
                            notifyWarning={notifyWarning}
                            isEdit={isEdit}
                            view={!(expendIsciList && expendEditIsci)}
                            handleSubmit={handleSubmit}
                            setShowLoading={(bool) => setShowLoading(bool)}
                            setOpenBackdrop={(bool) => setOpenBackdrop(bool)}
                            FilterName="Inventory" handleClose={() => {
                                //getISCIList(leagueId);
                                setIsEdit(false);
                                setEditData(null);
                                setobjAccordionVisiblity({
                                    isciList: true,
                                    editIsci: false,
                                });
                                setExpendEditIsci(false);
                                setExpendIsciList(true);
                            }}
                            formType={formType}
                            editData={editData}
                        />
                    </AccordionHorizontal>
                    }


                    {showSavedSearchPopup && <SavedSearches data={savedSearchList}
                        notifySuccess={notifySuccess} handleEditClick={editGlobalSearch}
                        show={showSavedSearchPopup}
                        handleSavedSearchesPopup={(bool) => handleSavedSearchesPopup(bool)}
                        handleSavedSearchesChange={(id) => handleSavedSearchesChange(id)}
                        selectedFilterId={selectedFilterId}
                        deleteSelectedFilter={() => setSelectedFilterId(0)}
                    />}

                    {showLoading && <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                    >
                        <div className={'loader-div'}><div className={'loading'}></div></div>
                    </Backdrop>}


                </Container>
            }
        </React.Fragment>
    )
}

ISCIcontainer.displayName = "ISCIcontainer";
export default ISCIcontainer;