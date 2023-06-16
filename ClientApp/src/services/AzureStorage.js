// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient } from "@azure/storage-blob";

//Photo Storage
let sasToken, containerName, storageAccountName;
//storageAccountName : stmpatsdev
//containerName : mpats
//sastoken : ?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2050-08-02T00:51:00Z&st=2022-08-01T16:51:00Z&spr=https&sig=jZs52RgkqOxmDE79zyLAA7FBCcss9ZKGCfkIjeKZxGs%3D
//name : fileName

const getStorageAccessConfigData =()=> {
    //call API here
    let obj = {
        sasToken: '?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2050-08-02T00:51:00Z&st=2022-08-01T16:51:00Z&spr=https&sig=jZs52RgkqOxmDE79zyLAA7FBCcss9ZKGCfkIjeKZxGs%3D',
        storageAccountName: 'stmpatsdev',
        containerName: 'mpats',
    }

    sasToken = obj.sasToken;
    storageAccountName = obj.storageAccountName;
    containerName = obj.containerName;
}

//Photo baseUrl
export const baseUrl = (name) => {
    return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${name}?${sasToken}`;
};

// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
    return !(!storageAccountName || !sasToken);
};

// return list of blobs in container to display
export const getBlobsInContainer = async () => {
    const returnedBlobUrls = [];
    const blobService = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);

    // get list of blobs in container
    // eslint-disable-next-line
    for await (const blob of containerClient.listBlobsFlat({
        includeMetadata: true,
    })) {
        // if image is public, just construct URL
        returnedBlobUrls.push({
            //url: `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`,
            videoUrl: `https://ik.imagekit.io/mediabucket/chq-sandbox/${blob.name}`,
            drillType: blob.metadata?.drilltype ?? "",
            playerName: blob.metadata?.playername ?? "",
            createdDate: blob.properties.createdOn,
        });
    }

    return returnedBlobUrls;
};

const createBlobInContainer = async (containerClient, file) => {
    // create blobClient for container
    const blobClient = containerClient.getBlockBlobClient(file.name);

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    // upload file
    await blobClient.uploadBrowserData(file, options);
    //await blobClient.setMetadata({ UserName: "sachin" });
};

const uploadFileToBlob = async (file) => {
    if (!file) return [];

    getStorageAccessConfigData();

    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);

    // upload file
    createBlobInContainer(containerClient, file);
    return true;

    // get list of blobs in container
    //return getBlobsInContainer(containerClient);
};
// </snippet_uploadFileToBlob>

export default uploadFileToBlob;