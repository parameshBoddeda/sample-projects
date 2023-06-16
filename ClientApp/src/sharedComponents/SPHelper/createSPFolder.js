import { ListItemAvatar } from '@material-ui/core';
import axios from 'axios';
import ApiURLConstants from '../../common/ApiURLConstants';

export const CreateSPParentFolder = (token,sharePointDocDriveID) => {

    return new Promise((resolve, reject) => {

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date();
        const folderName = monthNames[d.getMonth()] + '' + d.getFullYear();
        axios.get(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/root:/${folderName}`, {
            headers: {
                "Accept": " */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res && res.data ) {
                resolve(res.data["id"]);
            }
        }).catch(err => {
            let body = {
                "name": folderName,
                "folder": {},
                "@microsoft.graph.conflictBehavior": "replace"
            };
            axios.post(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/root/children`, body, {
                headers: {
                    "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                let parentFolderID = res.data.id;
                resolve(parentFolderID);
            }).catch(err => {
                console.log(err)
                reject(err);
            })
        })

    });
}
export const CreateSPProjectFolder = (token,sharePointDocDriveID,parentFolderId) => {

    return new Promise((resolve, reject) => {
       
            let projectGUID = generateProjectGUID();
            let folderID = '';

            let body = {
                "name": projectGUID,
                "folder": {},
                "@microsoft.graph.conflictBehavior": "rename"
            };

          axios.post(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${parentFolderId}/children`, body, {
                headers: {
                    "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                folderID = res.data.id;
                resolve(folderID);
            }).catch(err => {
                console.log(err)
                reject(err);
            })
       
    });
}


const generateProjectGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const UpdateSPProjectFolderName = (token,folderid,projectFolderName,sharePointDocDriveID) => {

    return new Promise((resolve, reject) => {
        //console.log("UpdateSPProjectFolderName method called::");
        let folderID = '';
        
        let body = {
             "name": projectFolderName.replace(/[/\\?%*#:|"<>]/g, '_'),
        };

        axios.patch(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${folderid}`,  body , {
            headers: {
                "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            //console.log(res.data);
            folderID = res.data.id;
            resolve(folderID);
        }).catch(err => {
            console.log(err)
            reject(err);
        })
    });
}

export const DeleteSPFile = (token,fileID,sharePointDocDriveID) => {
    return new Promise((resolve, reject) => {
        //console.log("DeleteSPFile method called::");
        let result =0;
        axios.delete(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${fileID}`, {
            headers: {
                "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            if(res.status === 204)
            {
                result=1;
            }
            resolve(result);
        }).catch(err => {
            console.log(err)
            reject(err);
        })
    });
}

export const DownloadSPFile = (token,fileID,sharePointDocDriveID) => {
    return new Promise((resolve, reject) => {
        //console.log("DownloadSPFile method called::");

        axios.get(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${fileID}`, {
            headers: {
                "Accept": " */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            //console.log(res.data["@microsoft.graph.downloadUrl"]);
            resolve(res.data["@microsoft.graph.downloadUrl"]);
        }).catch(err => {
            console.log(err)
            reject(err);
        })
    });
}

export const GenerateSPFileThumbnail = (token,fileID,sharePointDocDriveID) => {
       return new Promise((resolve, reject) => {
        //console.log("GenerateSPFileThumbnail method called::");

        axios.get(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${fileID}/thumbnails?select=large`, {
            headers: {
                "Accept": " */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res && res.data && res.data.value[0]) {
                //console.log(res.data.value[0].large.url);
                resolve(res.data.value[0].large.url);
            }
            else
            {
                resolve("");
            }
        }).catch(err => {
            console.log(err)
            reject(err);
        })
    });
}

export const GetSPItemContent = (token,fileID,sharePointLogoDriveID) => {
    return new Promise((resolve, reject) => {
     //console.log("GetSPItemContent method called::");
     fileID = fileID?fileID:'111';
     axios.get(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointLogoDriveID}/items/${fileID}`, {
         headers: {
             "Accept": " */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
         }
     }).then(res => {
         if (res && res.data ) {
             //console.log(res.data["@microsoft.graph.downloadUrl"]);
             resolve(res.data["@microsoft.graph.downloadUrl"]);
         }
         else
         {
             resolve("");
         }
     }).catch(err => {
         console.log(err)
         reject(err);
     })
 });
}

export const GetSPItemPreview = (token,fileID,sharePointDocDriveID) => {
    return new Promise((resolve, reject) => {
     //console.log("GetSPItemPreview method called::");
     
     axios.post(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${fileID}/Preview`, null,{
         headers: {
              "Authorization": `Bearer ${token}`
         }
     }).then(res => {
         if (res && res.data ) {
             //console.log(res.data.getUrl);
             resolve(res.data.getUrl);
         }
         else
         {
             resolve("");
         }
     }).catch(err => {
         console.log(err)
         reject(err);
     })
 });
}

export const GetSPItem = (token,fileID,sharePointLogoDriveID) => {
    return new Promise((resolve, reject) => {
     //console.log("GetSPItemContent method called::");
     fileID = fileID?fileID:'111';
     axios.get(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointLogoDriveID}/items/${fileID}`, {
         headers: {
             "Accept": " */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
         }
     }).then(res => {
         if (res && res.data ) {
             console.log(res.data);
             resolve(res.data);
         }
         else
         {
             resolve("");
         }
     }).catch(err => {
         console.log(err)
         reject(err);
     })
 });
}

export const UploadFileLessThan4MB = async (token, folderid, file, sharePointDocDriveID) => {
    var fileStr = await getFileStream(file);

    try {
        var i = file.name.lastIndexOf(".");
    }
    catch (error) {
        return;
    }
    let today = new Date();
    let date = today.getUTCFullYear().toString().substr(2,3) + '' + (today.getUTCMonth() + 1) + '' + today.getUTCDate();
    let time = today.getUTCHours() + "" + today.getUTCMinutes() + "" + today.getUTCSeconds();
    let dateTime = date + '' + time;
    var fileType = file.name.substring(i + 1);
    var fileName = file.name.substring(0, i).replace(/[/\\?%*#:|"<>]/g, '_');
    fileName = fileName + "_" + dateTime;

    if (fileStr) {
        return new Promise((resolve, reject) => {
            axios.put(`${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${folderid}:/${fileName}.${fileType}:/content`, fileStr,
                {
                    headers: {
                        'Accept': 'application/json', "Content-Type": "application/octet-stream", "Authorization": `Bearer ${token}`
                    }
                }).then(res => {
                    //console.log(res)
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }
}
const getFileStream = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = (event) => {
            if (reader.readyState === reader.DONE) {
                resolve(reader.result);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}