import axios from 'axios';
import ApiURLConstants from '../../common/ApiURLConstants';
import {UploadFileLessThan4MB} from './createSPFolder';

export default class UploadFileHelper {

    static uploadFileToSharepoint =(file, folderid, token,sharePointDocDriveID, progressCallBack) =>
    {
        //check if file size is greater than 3.8 MB then upload file in chunks otherwise upload it directly.
        if(folderid === null || file.size > (3.8*1024*1024)){
            return getUploadSession(file, folderid, token, sharePointDocDriveID, progressCallBack);
        }
        else{
            return UploadFileLessThan4MB(token,folderid,file,sharePointDocDriveID);
        }
    };
}

let getUploadSession = async function (file, folderid, token, sharePointDocDriveID, progressCallBack){
    return new Promise((resolve, reject) => {
        //console.log("getUploadSession method called::");
        const body = {
            "item": {
                "@microsoft.graph.conflictBehavior": "rename"
            }
        };
        try {
            var i = file.name.lastIndexOf(".");
        }
        catch (error) {
            return;
        }
        let today = new Date();
        let date = today.getUTCFullYear().toString().substr(2,3)+''+(today.getUTCMonth()+1)+''+today.getUTCDate();
        let time = today.getUTCHours() + "" + today.getUTCMinutes() + "" + today.getUTCSeconds();
        let dateTime = date+''+time;
        let url = ""   
        var fileType = file.name.substring(i + 1);
        var fileName = file.name.substring(0, i).replace(/[/\\?%*#:|"<>]/g, '_');
        fileName = fileName+"_"+dateTime;

        if(folderid !== null)
        {
            url = `${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/items/${folderid}:/${fileName}.${fileType}:/createUploadSession`
        }
        else
        {
            url = `${ApiURLConstants.SHAREPOINT_BASE_URL}/${sharePointDocDriveID}/root:/${fileName}.${fileType}:/createUploadSession`
        }

        axios.post(url, { body }, {
            headers: {
                "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
        }).then(res => {
           // console.log(res.data);
            var uploadURL = res.data.uploadUrl;
            uploadChunks(file, uploadURL, (response) => {
                resolve(response);
            }, progressCallBack);
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    });
}

let uploadChunks = async function (file, uploadUrl, callback, progressCallBack) {
    // Variables for byte stream position
    var position = 0;
    var chunkLength = 320 * 1024;
    //console.log("File size is: " + file.size);
    var continueRead = true;
    while (continueRead) {
        var chunk;
        try {
            continueRead = true;
            //Try to read in the chunk
            try {
                let stopByte = position + chunkLength;
                //console.log("Sending Asynchronous request to read in chunk bytes from position " + position + " to end " + stopByte);

                chunk = await readFragmentAsync(file, position, stopByte);
                //console.log("UploadChunks: Chunk read in of " + chunk.byteLength + " bytes.");
                if (chunk.byteLength > 0) {
                    continueRead = true;
                } else {
                    break;
                }
                //console.log("Chunk bytes received = " + chunk.byteLength);
            } catch (e) {
                console.log("Bytes Received from readFragmentAsync:: " + e);
                break;
            }
            // Try to upload the chunk.
            try {
                //console.log("Request sent for uploadFragmentAsync");
                let res = await uploadChunk(chunk, uploadUrl, position, file.size);
                // Check the response.
                if (res.status !== 202 && res.status !== 201 && res.status !== 200)
                    throw ("Put operation did not return expected response");
                if (res.status === 201 || res.status === 200) {
                    //console.log("Reached last chunk of file.  Status code is: " + res.status);
                    continueRead = false;
                    callback(res);
                }
                else {
                    //console.log("Continuing - Status Code is: " + res.status);
                    position = Number(res.data.nextExpectedRanges[0].split('-')[0]);
                    if(progressCallBack)
                        progressCallBack();
                }

                //console.log("Successful response received from uploadChunk.");
                //console.log("Position is now " + position);
            } catch (e) {
                console.log("Error occured when calling uploadChunk::" + e);
            }

        } catch (e) {
            continueRead = false;
        }
    }
}

let uploadChunk = function (chunk, uploadURL, position, totalLength) {
    var max = position + chunk.byteLength - 1;
    //var contentLength = position + chunk.byteLength;

    //console.log("Chunk size is: " + chunk.byteLength + " bytes.");

    return new Promise((resolve, reject) => {
        //console.log("uploadURL:: " + uploadURL);

        try {
            //console.log('Just before making the PUT call to uploadUrl.');
            let crHeader = "bytes " + position + "-" + max + "/" + totalLength;
            //Execute PUT request to upload the content range.
            axios.put(uploadURL, chunk, {
                headers: { "Content-Range": crHeader, 'Content-Type': 'application/octet-stream' },
            }).then(res => {
                //console.log(res)
                resolve(res);
            })
        } catch (e) {
            console.log("exception inside uploadChunk::  " + e);
            reject(e);
        }
    });
}

let readFragmentAsync = function (file, startByte, stopByte) {
    var frag = "";
    const reader = new FileReader();
    //console.log("startByte :" + startByte + " stopByte :" + stopByte);
    var blob = file.slice(startByte, stopByte);
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve, reject) => {
        reader.onloadend = (event) => {
            //console.log("onloadend called  " + reader.result.byteLength);
            if (reader.readyState === reader.DONE) {
                frag = reader.result;
                resolve(frag);
            }
        };
    });
}
