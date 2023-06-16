import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import FileUploadComponent from '../../sharedComponents/FileUpload/FileUploadComponent';
import { GetValidatedFile } from '../../services/reconcilliation.service';
import * as AppLanguage from '../../common/AppLanguage';

const SelectFilesComponent = (props) => {
    const [selectedUploadTypeName, setSelectedUploadTypeName] = React.useState("Reconciliation");
    const [selectedUploadType, setSelectedUploadType] =  React.useState({ value: 1, label: "Reconciliation" });

    const handleChange = (name, value) => {
        props.setValidationMsg("");
        setSelectedUploadTypeName(value.label);
        setSelectedUploadType(value);
        props.setFileName("");
    }

    const handleClear = () => {
        props.setValidationMsg("");

    }

    const handleFileUpload = (fileInfo) => {
        if(!selectedUploadType) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'Upload Type'));
            return false;
        }
        
        if(!fileInfo) {
            props.notifyWarning(AppLanguage.APP_MESSAGE.Require_Field_Validation.replace("__FieldName__", 'a File'));
            return false;
        }

        fileInfo.file["UploadType"] = selectedUploadType.label;
        
        let formData = new FormData();
        formData.append('FileObject', fileInfo.file);
        props.setFileName(fileInfo.file.name);

        props.setShowLoading(true);
        props.setOpenBackdrop(true);
        GetValidatedFile(formData).then(resp => {
            if(typeof resp === 'object'){
                if(resp.programDetailList && resp.programDetailList.length > 0) {
                    props.setValidationMsg(AppLanguage.APP_MESSAGE.Valid_Upload);
                    if(props.setRowsData){
                        props.setRowsData(resp.programDetailList);
                    }
                } else {
                    props.setValidationMsg(AppLanguage.APP_MESSAGE.Invalid_Upload + " " + resp.errors);
                    if(props.setRowsData){
                        props.setRowsData([]);
                    }
                }
            } else {
                props.setValidationMsg(AppLanguage.APP_MESSAGE.Invalid_Upload + " " + resp.errors);

            }
            props.setShowLoading(false);
            props.setOpenBackdrop(false);
        }).catch(error => {
            console.error(error);
            props.setValidationMsg(AppLanguage.APP_MESSAGE.Invalid_Upload + " " + error.errors);
            if(props.setRowsData){
                props.setRowsData([]);
            }
            props.setShowLoading(false);
            props.setOpenBackdrop(false);
        })
    }

    return(
        <>
            
            <Box display="flex" flexDirection="column" justifyContent="space-between" py={1.5}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>

                        <Grid item sm={2}>

                            <Dropdown name="uploadType" handleChange={handleChange}
                                value={selectedUploadTypeName}
                                size="small" id="uploadType" variant="outlined" showLabel={true}
                                lbldropdown="Upload Type" ddData={[
                                    { value: 1, label: "Reconciliation" },
                                ]}
                            />

                        </Grid>

                        <Grid item sm={6}>

                            <FileUploadComponent notifySuccess={props.notifySuccess} notifyWarning={props.notifyWarning}
                                selectedUploadType={selectedUploadType} setValidationMsg={props.setValidationMsg} 
                                selectedUploadTypeName={selectedUploadTypeName} setRowsData={props.setRowsData}
                                handleFileUpload={handleFileUpload} handleClear={handleClear}
                            />

                        </Grid>

                        <Grid item sm={4}>
                            {
                                props.validationMsg ? <>
                                    <Typography variant="subtitle2" color="primary" component="span" mr={1}>
                                        {'Validation Message: '}
                                    </Typography>

                                    <Typography variant="body2" component="span">
                                        {props.validationMsg}
                                    </Typography>
                                </> : null
                            }

                        </Grid>

                    </Grid>
                </Grid>
            </Box>
        </>
    )

}

export default SelectFilesComponent;