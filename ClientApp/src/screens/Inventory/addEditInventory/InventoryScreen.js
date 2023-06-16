import * as React from 'react';
import AppDataContext from '../../../common/AppContext';
import Helper from '../../../common/Helper';
import InventoryDealOne from './InventoryDealOne';
import InventoryDealTwo from './InventoryDealTwo';
import NonLinearStepper from '../../../sharedComponents/Stepper/NonLinearStepper';
import { SaveInventoryDeal, SaveInventory, GetInventories } from '../../../services/inventory.service';
import { GetLookupById } from '../../../services/common.service';
import {inventoryDealConstants} from '../../../common/AppConstants';
 
import { ToastContainer, toast } from "react-toastify";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as AppLanguage from '../../../common/AppLanguage';

const stepsTotalSteps = ['Deal Header', 'Inventory'];
function notifySuccess(message) { toast.success(message) }
function notifyWarning(message) { toast.warning(message) }
function notifyError(msg) { toast.error(msg)  }
const InventoryScreen = (props) => {
    const { leagueInfo, leagueId, Regions, username } = React.useContext(AppDataContext);
    const [step, setStep] = React.useState(0);
    const [dealId, setId] = React.useState(props.inventoryDealData?.inventoryDealId);
    const [inventoryDealId, setInventoryDealId] = React.useState({inventoryDealId: props.inventoryDealData?.inventoryDealId});
    const [recordId, setRecordId] = React.useState();

    const [dataSourceId, setDataSourceId] = React.useState();
    const [inventories, setInventories] = React.useState([]);
    const [inventoryDealData, setInventoryDealData] = React.useState({
        leagueId: leagueId, 
        dealId: props.inventoryDealData?.dealId,
        inventoryDealId: props.inventoryDealData?.inventoryDealId,
        dealName: props.inventoryDealData?.dealName,
        startDate: props.inventoryDealData?.dealStartDate || null,
        endDate: props.inventoryDealData?.dealEndDate || null,
        region: {label: props.inventoryDealData?.regionName, value: props.inventoryDealData?.regionId},
        partner: {label: props.inventoryDealData?.partnerName, value: props.inventoryDealData?.partnerId}
    });
    // const [inventoryDealData, setInventoryDealData] = React.useState(props.inventoryDealData});
    const [showLoading, setShowLoading] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [resetInventory, setResetInventoy] = React.useState(false);
    const [addForm, setAddForm] = React.useState(false);
    const [newDealId, setNewDealId] = React.useState();
    const [newDealInventoryId, setNewDealInventoryId] = React.useState();
   // const [handleSaveResponseMessage, setHandleSaveResponseMessage] = React.useState("");
    
    const [flag, setFlag] = React.useState(0);
    const [inventory, setInventory] = React.useState({
        leagueId: leagueId, year: "", region: "", availableImpressions: "",
        country: "", mediaType: "", network: "", asset: "",
        quantityFrom: "", quantityTo: "", salesUnitCount: "", salesRight: "",
        insCount: "", insRight: ""
    });

    const updateInventoryDealData = (name, value) => {
        let tempInventoryDeal = inventoryDealData;
        tempInventoryDeal[name] = value;
        setInventoryDealData(tempInventoryDeal);
        setFlag(flag+1);
    }

    const updateInventoryData = (name, value) => {
        let tempInventory = inventory;
        tempInventory[name] = value;
        setInventory(tempInventory);
    }

    const handleStep = (nextStep) => {
        if(!dealId) {
            return false;
        }
        if(step === 1 && addForm) {
            setRecordId("");
        }
        getInventories(inventoryDealData.inventoryDealId);
        setInventory({region: inventoryDealData.region});
        setStep(nextStep)
    }

    const handleInventoryRowEdit = (id) => {
        setRecordId(id);
    }

    const handleAdd = () => {
        setRecordId(0);
        setAddForm(true);
        setInventory({
            leagueId: leagueId, year: "", region: "", availableImpressions: "",
            country: "", mediaType: "", network: "", asset: "",
            quantityFrom: "", quantityTo: "", salesUnitCount: "", salesRight: "",
            insCount: "", insRight: ""
        });  
    }

   
 
    const handleSave = () => {
        if(!addForm) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__",'Edit or Add option from Inventory Grid'));
            return false;
        }
        let isValid = true;
        if(!inventory.asset) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Assest"));
            isValid = false;
        }
        if(!inventory.year) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Year"));
            isValid = false;
        }
        if(!inventoryDealData.region) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Region"));
            isValid = false;
        }
        if(!inventory.country) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Country"));
            isValid = false;
        }
        if(!inventory.mediaType) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Media Type"));
            isValid = false;
        }
        // if(inventory.mediaType.value === 151 || inventory.mediaType.value === 152 || inventory.mediaType.value === 201 || inventory.mediaType.value === 202)
        // {
        //     if(!inventory.network) {
        //         notifyWarning("Network is a required field.");
        //         isValid = false;
        //     }
        // }
        if(!inventory.salesUnitCount && !inventory.insCount) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Sales Unit Count or Ins Count"));
            isValid = false;
        }
        if(inventory.salesUnitCount) {
            if(!inventory.salesRight) {
                notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Sales Right"));
                isValid = false;
            }
        }
        if(inventory.insCount) {
            if(!inventory.insRight) {
                notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Ins Right"));
                isValid = false;
            }
        }

        if(inventory.quantityFrom  && inventory.quantityTo) {
            if(parseInt(inventory.quantityFrom) > parseInt(inventory.quantityTo)){
                notifyWarning(AppLanguage.APP_MESSAGE.Quantity_To_Validation);
                isValid = false;
            }
        }

        if(inventory?.mediaType?.parentId===inventoryDealConstants.RadioParentId||inventory?.mediaType?.parentId===inventoryDealConstants.TVParentId){
            if((inventory.salesUnitCount*60)%5!==0){
              
                notifyWarning(AppLanguage.APP_MESSAGE.Linear_Sales_Count_Validation)
                isValid = false;
            }
            if((inventory.insCount*60)%5!==0){
              
               notifyWarning(AppLanguage.APP_MESSAGE.Linear_Ins_Count_Validation)
               isValid = false;
           }
           
       }
 
        if(!isValid) {
            return false;
        }

       
 
        let params = {
            inventoryId: recordId ?  recordId : 0,
            inventoryDealId: dealId,
            seasonId: inventory.year.value,
            regionId: inventoryDealData.region.value,
            countryId: inventory.country.value,
            mediaTypeId: inventory.mediaType.value,
            networkId: inventory.network && inventory.network.value !== "" ? inventory.network.value : 0,
            assetId: inventory.asset && inventory.asset.value !== ""  ? inventory.asset.value : 0,
            quantityFrom: inventory.quantityFrom ? inventory.quantityFrom : 0,
            quantityTo: inventory.quantityTo ? inventory.quantityTo : 0,
            salesUnit: inventory.salesUnitCount ? inventory.salesUnitCount : 0,
            salesUnitDesc: inventory.salesRight ? inventory.salesRight.value : 0,
            institutionalUnit: inventory.insCount ? inventory.insCount : 0,
            instAvgImpression: inventory.availableImpressions ? inventory.availableImpressions : 0,
            institutionalUnitDesc: inventory.insRight ? inventory.insRight.value : 0,
            actionBy: username,
        }
        setShowLoading(true);
        setOpenBackdrop(true);
      
               
    
        SaveInventory(params).then(resp => {
            if (resp) {
             
                if(resp.message !== "") {
                    if(resp.message === 'Data saved successfully..!') {
                        notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
                    } else {
                        notifyWarning(resp.message);
                    }
                } else {
                    notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
                }
                setInventory({
                    leagueId: leagueId, year: "", region: "", availableImpressions: "",
                    country: "", mediaType: "", network: "", asset: "",
                    quantityFrom: "", quantityTo: "", salesUnitCount: "", salesRight: "",
                    insCount: "", insRight: ""
                });
                setRecordId("");
                getInventories(dealId);
                setShowLoading(false);
                setOpenBackdrop(false);
                setResetInventoy(true);
                setAddForm(false);
                props.refreshPage();
            }
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            console.log(err)
        });
    }

    const refreshDealInventoryPage = () => {
        getInventories(dealId);
    }

    const getInventories = (id) => {
        // if(!props.enableDealEdit) {
        //     return false;
        // }
        GetInventories(id).then(resp => {
            setInventories(resp);
            // if(handleSaveResponseMessage === "")
            // {
                setNewDealInventoryId(resp[0]?.inventoryId);
            // }
            
        }).catch(err => {
            console.log(err);
        });
    }
 
    const handleInventoryDealSave = () => {
       
        let status = true;
        var dealName = inventoryDealData?.dealName?.trim() || '';
        if(!dealName) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Deal Name"));
            status = false;
        }
        if(!inventoryDealData.startDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Start Date"));
            status = false;
        }
        if(!inventoryDealData.endDate) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "End Date"));
            status = false;
        }
        if(!inventoryDealData.region.value) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Region"));
            status = false;
        }
        if(!inventoryDealData.partner.value) {
            notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", "Partner"));
            status = false;
        }

        if(!status) {
            return false;
        }
       
            let params = {
                id: newDealId ? newDealId : (inventoryDealData.inventoryDealId ? inventoryDealData.inventoryDealId : 0),
                dealId: inventoryDealData.dealId,
                dealName: inventoryDealData.dealName,
                leagueId: leagueId,
                startDate: Helper.FormatToIsoDate(inventoryDealData.startDate),
                endDate: Helper.FormatToIsoDate(inventoryDealData.endDate),
                regionId: inventoryDealData.region.value,
                partnerId: inventoryDealData.partner.value,
                dealSourceId: dataSourceId,
                actionBy: username,

           }
 
        setShowLoading(true);
        setOpenBackdrop(true);

        SaveInventoryDeal(params).then(resp => {
            if (resp) {
                if(resp.message !== "") {
                    if (resp.message === 'success.') {
                        setId(resp.data);
                        setNewDealId(resp.data);
                        props.refreshPage();
                        getInventories(resp.data);
                        setInventory({ region: inventoryDealData.region });
                        notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
                        if (props.updateEnableDealEdit) {
                            props.updateEnableDealEdit(true);
                        }
                    } else {
                        notifyWarning(resp.message);
                       // setHandleSaveResponseMessage(resp.message);
                    }                    
                 } 
               else {
                    notifySuccess(AppLanguage.APP_MESSAGE.API_Success);
                    setId(resp.data);
                    setNewDealId(resp.data);
                    props.refreshPage();
                    getInventories(resp.data);
                    setInventory({region: inventoryDealData.region});
                }
                setShowLoading(false);
                setOpenBackdrop(false);
            } else {
                notifySuccess(AppLanguage.APP_MESSAGE.API_Error);
                setShowLoading(false);
                setOpenBackdrop(false);
            }
        }).catch(err => {
            setShowLoading(false);
            setOpenBackdrop(false);
            console.log(err)
        })
    }

    const handleClose = () => {
        if(step === 1 && addForm) {
            getInventories(dealId);
            setResetInventoy(true);
            setAddForm(false);
            setRecordId("");
        } else {
            setId("");
            setInventoryDealId("");
            setNewDealInventoryId("");
            //setHandleSaveResponseMessage("");
            console.log(inventoryDealData)
            if(props.handleClose) {
                props.handleClose();
            }
        }
       

    }
 
    const reset = () => {
        setInventoryDealData({ leagueId: leagueId, dealId: "", dealName: "",
            startDate: null, endDate: "", region: "", partner: ""
        });
    }
 
    const handleEdit = (ele, name) => {
        setRecordId(ele.inventoryId);
        setAddForm(true);
    }
    const getDataSource = () => {
        GetLookupById(inventoryDealConstants.InventorySource).then((data) => {
            if (data) {
                let dSource = data.filter(v => v.lookupText == 'MPATS');
                setDataSourceId(dSource[0].lookupId);
            }
        }).catch(err => console.log(err));
    }
 
    React.useEffect(() => {
        getDataSource();
        if(resetInventory) {
            setResetInventoy(false);
        }
    }, [resetInventory])
 

    return (
        <React.Fragment>
            <NonLinearStepper isInventoryDeal={true} handleSave={handleSave}
                handleInventoryDealSave={handleInventoryDealSave} handleClose={handleClose}
                step={step} stepsTotalSteps={stepsTotalSteps} handleStep={handleStep}
             
            >
                {step === 0 && <InventoryDealOne refreshPage={props.refreshPage} enableDealEdit={props.enableDealEdit}
                    updateInventoryDealData={updateInventoryDealData} inventoryDealData={inventoryDealData}
                    dealSourceId={props.dealSourceId} IsEditing={props.isEditing} countDealInventoryItems={props.countDealInventoryItems}
                    newDealInventoryId = {newDealInventoryId}
                />}
                {step === 1 && <InventoryDealTwo updateInventoryData={updateInventoryData}
                    region={inventoryDealData.region} handleEdit={handleEdit} refreshDealInventoryPage={refreshDealInventoryPage}
                    handleClose={props.handleClose} refreshPage={props.refreshPage} dealId={dealId}
                    handleInventoryRowEdit={handleInventoryRowEdit} recordId={recordId}
                    inventories={inventories} partner={inventoryDealData.partner} handleAdd={handleAdd}
                    notifyWarning={(msg) => {notifyWarning(msg)}} 
 

                    resetInventory={resetInventory}
                />}
            </NonLinearStepper>
            {showLoading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <div className={'loader-div'}><div className={'loading'}></div></div>
                </Backdrop>
            }
        </React.Fragment>
    )

}
export default InventoryScreen;


