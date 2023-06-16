//Global Imports Start
import React, { useEffect, useState, useContext } from "react";
import { Container, Box, IconButton, Button } from "@mui/material";
import { makeStyles } from '@material-ui/core/styles';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//Global Imports End

//Regional Imports Start
import MediaGrid from './CampaignGrid';
import AppDataContext from '../../common/AppContext';
import AccordionHorizontal from '../../sharedComponents/HorizontalAccordion/AccordionWrapper';
import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import CampaignPlanConf from "./CampaignPlanConf/CampaignPlanConf";
import AddCampaign from "./AddCampaign/AddCampaign";
import CampaignUnitInstructions from './CampaignUnitInstructions/CampaignUnitInstructions';
import { GetCampaignList } from './../../services/campaign.service';
import CampaignMediaPlanningContainer from "./CampaignMediaPlanning/CampaignMediaPlanningContainer";
import { ToastContainer, toast } from "react-toastify";
import {  GetReportUrl } from "./../../services/common.service";
import ReportViewer from "./Report/ReportViewer"

function notifyWarning(message) { toast.warning(message) }
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(1),
        display: 'flex !important',
    },
}));
const CampaignContainer = (props) => {
    const { leagueId } = useContext(AppDataContext);
    const classes = useStyles();
    const [CompaignOriginalRows, setCompaignOriginalRows] = useState([]);
    const [CompaignRows, setCompaignRows] = useState([]);
    const [isEditing, setIsEditing] = useState(false)
    const [expandCompaignGrid, setExpandCompaignGrid] = useState(true);
    const [expandedEditCompaign, setExpendEditCompaign] = useState(false);
    const [expandBudget, setExpandBudget] = useState(false);
    const [expandReport, setExpandReport] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [expandCampaignUnitInstructions, setExpandCampaignUnitInstructions] = useState(false);
    const [rowClick, setRowClick] = useState(false);
    const [recordId, setRecordId] = useState();
    const [selectedRow, setSelectedRow] = useState();
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [selectedCompaignId, setSelectedCompaignId] = useState();
    const [showCampaignMediaPlanning, setShowCampaignMediaPlanning] = useState(false);
    const [AccordionVisiblity, setobjAccordionVisiblity] = useState({
        dealGrid: true,
        CampaignPlanConf: false,
        AddCampaign: false,
        CampaignUnit: false,
        CampaignPlanning : false,
        report: false,
    });
    const [isAddCEditing, setIsAddCEditing] = useState(false);
    const [selectedBtn, setSelectedBtn] = useState();
    const [selectedCampaignIdForFilter, setSelectedCampaignIdForFilter] = useState('');
    const [applyChanges, setApplyChanges] = useState(false);
    const [reportUrl, setReportUrl] = useState("");

    const [applyLocalFilter, setApplyLocalFilter] = useState(false);
    const [searchItem, setSearchItem] = useState();
    const [selectedCampaignData,setSelectedCampaignData] = useState(null)

    const handleExpandCompaignGrid = () => {        
        if(AccordionVisiblity.CampaignUnit){
            if(expandCampaignUnitInstructions){
                setExpandCompaignGrid(false);
            }
            if(expandCompaignGrid){
                setExpandCompaignGrid(false);
                setExpandCampaignUnitInstructions(true);
            }
            setExpandCompaignGrid(!expandCompaignGrid);

        } else {
            setobjAccordionVisiblity({
                dealGrid: true,
                CampaignPlanConf: false,
                AddCampaign: false,
                CampaignUnit: false,
                report: false,
                CampaignPlanning: false,
            });
            setExpandCompaignGrid(true);
            setIsEditing(false);
            setExpandBudget(false);
            setExpendEditCompaign(false);
            setShowCampaignMediaPlanning(false);
            setExpandCampaignUnitInstructions(false);
            setExpandReport(false);
            setSelectedBtn();
            setIsAddCEditing(false);
            setSelectedCompaignId();
        }
        
    }

    const handleCompaignEditExpand = () => {
        setExpendEditCompaign(!expandedEditCompaign);
        setExpandBudget(false);
        if (expandedEditCompaign) {
            setRowClick(false);
        } else {
            setRowClick(false);
        }
    }
    const handleCompaignUnitExpand = () => {
        setExpandCampaignUnitInstructions(!expandCampaignUnitInstructions);
    }

    const handleBudgetExpand = () => {
        setExpandBudget(!expandBudget);
        setExpendEditCompaign(false);
        if (expandBudget) {
            setRowClick(false);
        } else {
            setRowClick(false);
        }
    }

    const gridRowClick = (id) => {
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: true,
            AddCampaign: true,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: false,
        });
        setExpandReport(false);
        setRowClick(true);
        setSelectedCompaignId(id);
    }

    const handleClose = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: false,
            AddCampaign: false,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: false,
        });
        setExpandReport(false);
        setIsAddCEditing(false);
        setRowClick(false);
        setExpandCompaignGrid(true);
        setExpandCampaignUnitInstructions(false);
        setExpendEditCompaign(false);
        setExpandBudget(false);
        setSelectedBtn();
        setSelectedCompaignId();
    }

    const refershPage = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: false,
            AddCampaign: false,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: false,
        });
        setExpandReport(false);
        setIsAddCEditing(false);
        setExpandCampaignUnitInstructions(false);
        setRowClick(false);
        setExpandCompaignGrid(true);
        setExpendEditCompaign(false);
        setExpandBudget(false);
        setSelectedBtn();
        setSelectedCompaignId();
        getCompaignData();
    }

    const handleCompaignEditClick = (id, btnName, campaignId, selectedRowData) => {
        if(isAddCEditing){
            notifyWarning("Already open in edit mode.");
            return false;
        }
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: false,
            AddCampaign: true,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: false,
        });
        setExpandReport(false);
        setIsAddCEditing(true);
        setRowClick(false);
        setSelectedBtn(btnName);
        setExpendEditCompaign(true);
        setExpandBudget(false);
        setSelectedCompaignId(campaignId);
        setRecordId(id);
        setSelectedRow(selectedRowData);
    }

    const handleCompaignUnitClick = (id, campaignId, btnName, planId,currentData) => {
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: false,
            AddCampaign: false,
            CampaignUnit: true,
            report: false,
            CampaignPlanning: false,
        });
        setIsAddCEditing(false);
        setExpandCampaignUnitInstructions(true);
        setSelectedBtn(btnName);
        setRecordId(id);
        setSelectedCompaignId(campaignId);
        setSelectedCampaignData(currentData)
        if(btnName === "download") {
            setobjAccordionVisiblity({
                dealGrid: true,
                CampaignPlanConf: false,
                AddCampaign: false,
                CampaignUnit: false,
                report: true,
                CampaignPlanning: false,
            });
            setSelectedCompaignId(planId);
            setExpendEditCompaign(false);
            setExpandReport(true);
            setExpandCampaignUnitInstructions(false);
            GetReportUrl("ReportUrls", "campaignReportUrl").then(data => {
                setReportUrl(data);

            }).catch(err => {
                console.log(err);
            })
        } else if(btnName === "downloadCustomers"){
            setobjAccordionVisiblity({
                dealGrid: true,
                CampaignPlanConf: false,
                AddCampaign: false,
                CampaignUnit: false,
                report: true,
                CampaignPlanning: false,
            });
            setSelectedCompaignId(planId);
            setExpendEditCompaign(false);
            setExpandReport(true);
            setExpandCampaignUnitInstructions(false);
            GetReportUrl("ReportUrls", "campaignReportUrl").then(data => {
                data = data.replace("&rp:Columns_Hide=N","&rp:Columns_Hide=Y")
                setReportUrl(data);

            }).catch(err => {
                console.log(err);
            })
        } else {
            setobjAccordionVisiblity({
                dealGrid: true,
                CampaignPlanConf: false,
                AddCampaign: false,
                CampaignUnit: true,
                report: false,
                CampaignPlanning: false,
            });            
        }
    }

    const handleCampaignUnitClose = () => {
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: false,
            AddCampaign: false,
            CampaignUnit: false,
            CampaignPlanning: false,
            report: false
        });
        setExpandCompaignGrid(true);
        setExpandReport(false);
        setSelectedBtn();
        setSelectedCompaignId();
        setExpandCampaignUnitInstructions(false);
    }

    const handleBudgetClick = (id, btnName) => {
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: true,
            AddCampaign: false,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: false,
        });
        setExpandReport(false);
        setIsAddCEditing(false);
        setExpendEditCompaign(false);
        setSelectedBtn(btnName);
        setExpandBudget(true);
        setRowClick(false);
        setSelectedCompaignId(id);
    }

    const getCompaignData = () => {
        // setCompaignOriginalRows(compaignData.data);
        // setCompaignRows(compaignData.data);

        setShowLoading(true);
        setOpenBackdrop(true);
        GetCampaignList(leagueId).then(Campaigns => {
            setCompaignOriginalRows(Campaigns);
            if(searchItem){
                setApplyLocalFilter(true);
            } else {
                setApplyLocalFilter(false);
            }
            setCompaignRows(Campaigns);
            setShowLoading(false);
            setOpenBackdrop(false);
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            setCompaignOriginalRows([]);
            setCompaignRows([]);
        });
    }

    const refreshCampaignList = () => {
        getCompaignData();
    }

    useEffect(() => {
        getCompaignData();
    }, [leagueId])

    const showMediaPlanningContainer = (id)=>{
        setobjAccordionVisiblity({
            dealGrid: true,
            CampaignPlanConf: false,
            AddCampaign: false,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: true,
        });
        setExpandReport(false);
        setExpandCompaignGrid(false);
        setExpandCampaignUnitInstructions(false);
        setExpandBudget(false);
        setExpendEditCompaign(false);
        setSelectedCampaignIdForFilter(id);
        setShowCampaignMediaPlanning(true);
    }

    const handleReportExpand = () => {
        if(expandReport && expandCompaignGrid) {
            setExpandCompaignGrid(false);
            setExpandReport(true); 
        } else {
            if(expandCompaignGrid){
                setExpandCompaignGrid(false);
            } else {
                setExpandCompaignGrid(true);
            }
            setExpandReport(!expandReport);
        }
        
    }

    const handleMediaPlanningContainer = () => {
        setobjAccordionVisiblity({
            dealGrid: AccordionVisiblity.CampaignPlanning,
            CampaignPlanConf: false,
            AddCampaign: false,
            CampaignUnit: false,
            report: false,
            CampaignPlanning: !AccordionVisiblity.CampaignPlanning,
        });
        setExpandReport(false);
        setShowCampaignMediaPlanning(!showCampaignMediaPlanning);
        //setExpandCompaignGrid(!showCampaignMediaPlanning);
    }

    const setFilterData = (filterData) => { setCompaignRows(filterData) };
    return (
        <React.Fragment>
             <ToastContainer autoClose={3000} />
            <SubHeader headerText="CAMPAIGN PLANNING"
            >
                {!AccordionVisiblity.CampaignPlanning && <>
                    {/* <IconButton component="div">
                        <FilterAltOutlinedIcon className={classes.filter} />
                    </IconButton> */}
                    {/* <Box component="div">
                        <Button size="small" color="primary" variant="contained">{'Saved Searches'}</Button>
                    </Box> */}
                </>}
                {/* {AccordionVisiblity.CampaignPlanning && <>
                    <Box component="div">
                        <Button size="small" color="primary" onClick={()=> setApplyChanges(true)} variant="contained">{'Apply'}</Button>
                    </Box>
                </>} */}
            </SubHeader>

            {
                <Container maxWidth={false} 
                    disableGutters className={classes.container}>
                    <>
                        {AccordionVisiblity.dealGrid && <AccordionHorizontal
                            resize={expandCompaignGrid && (expandedEditCompaign || expandReport || expandBudget || expandCampaignUnitInstructions)}
                            accordionTitle={"Campaigns"} displayName="Campaigns"
                            handleExpand={handleExpandCompaignGrid}
                            Expanded={expandCompaignGrid}>
                            <MediaGrid setFilterData={setFilterData}
                                handleCompaignUnitClick={handleCompaignUnitClick}
                                rows={CompaignRows}
                                originalData={CompaignOriginalRows}
                                isEditing={isEditing}
                                handleShowMediaPlanningContainer={showMediaPlanningContainer}
                                view={!(expandCompaignGrid && 
                                    (expandedEditCompaign || expandReport || expandBudget || expandCampaignUnitInstructions || showCampaignMediaPlanning))}
                                selectedCompaignId={selectedCompaignId}
                                handleCompaignEditClick={handleCompaignEditClick}
                                handlebudgetClick={handleBudgetClick} selectedBtn={selectedBtn}

                                setSearchItem={(val) => setSearchItem(val)}
                                resetApplyLocalFilter={()=> {
                                        setApplyLocalFilter(false);
                                    }
                                }
                                searchItem={searchItem}
                                applyLocalFilter={applyLocalFilter}

                            />
                        </AccordionHorizontal>}
                    </>
                    {
                        AccordionVisiblity.AddCampaign && <AccordionHorizontal 
                            resize={(expandCompaignGrid && expandedEditCompaign)} displayName="Compaign"
                            accordionTitle={"Compaign"} Expanded={expandedEditCompaign}
                            handleExpand={handleCompaignEditExpand}
                        >
                            <AddCampaign CampaignId={selectedCompaignId} selectedBtn={selectedBtn}
                                showCloseIcon={!rowClick} handleClose={handleClose} recordId={recordId}
                                selectedRow={selectedRow} refershPage={refershPage}
                            />

                        </AccordionHorizontal>
                    }
                    {
                        AccordionVisiblity.CampaignPlanConf && <AccordionHorizontal
                            resize={(expandCompaignGrid && expandBudget)} displayName="Budget"
                            accordionTitle={"Budget"} Expanded={expandBudget}
                            handleExpand={handleBudgetExpand}
                        >
                            <CampaignPlanConf CampaignId={selectedCompaignId} 
                                showCloseIcon={!rowClick} handleClose={handleClose} 
                            />

                        </AccordionHorizontal>
                    }

                    {
                        AccordionVisiblity.CampaignUnit && <AccordionHorizontal 
                            resize={(expandCompaignGrid && expandCampaignUnitInstructions)} 
                            displayName="Campaign Unit Instructions"
                            accordionTitle={"Compaign"} Expanded={expandCampaignUnitInstructions}
                            handleExpand={handleCompaignUnitExpand} hideExpandButton={true}
                        >
                            <CampaignUnitInstructions CampaignId={selectedCompaignId} recordId={recordId}
                                showCloseIcon={!rowClick} handleClose={handleCampaignUnitClose} 
                                refreshCampaignList={refreshCampaignList}
                                selectedCampaignData={selectedCampaignData}
                            />

                        </AccordionHorizontal>
                    }

                    {
                        showLoading && <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={openBackdrop}
                        >
                            <div className={'loader-div'}><div className={'loading'}></div></div>
                        </Backdrop>
                    }

                    {AccordionVisiblity.CampaignPlanning &&
                        <AccordionHorizontal
                            resize={(expandCompaignGrid && showCampaignMediaPlanning)}
                            displayName="Campaign Planning"
                            accordionTitle={"Compaign Planning"} Expanded={showCampaignMediaPlanning}
                            handleExpand={handleMediaPlanningContainer} hideExpandButton={true}
                        >
                            <CampaignMediaPlanningContainer
                                selectedCampaignIdForFilter={selectedCampaignIdForFilter}
                                CompaignOriginalRows={CompaignOriginalRows}
                                SaveAllMediaPlans={applyChanges}
                                ResetApplyStatus={() => setApplyChanges(false)}
                            />

                        </AccordionHorizontal>
                    }

{
                        AccordionVisiblity.report && <AccordionHorizontal hideExpandButton={false}
                            resize={expandCompaignGrid && expandReport} displayName="SSRS Report"
                            accordionTitle={"SSRS Report"} Expanded={expandReport}
                            handleExpand={handleReportExpand}
                        >
                            <ReportViewer hideExpandIcon={true} recordId={selectedCompaignId} leagueId={leagueId} url={reportUrl}
                                handleClose={handleCampaignUnitClose} showCloseIcon={!rowClick} />
                        </AccordionHorizontal>
                    }

                </Container>
            }           

        </React.Fragment>
    )
}

CampaignContainer.displayName = "CampaignContainer";
export default CampaignContainer;