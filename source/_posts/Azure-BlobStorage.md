---
title: Azure-BlobStorage
date: 2021-02-03 14:21:15
tags:
- Azure
categories: 
- 云平台
---
Blob Storage存储资源的三个层次
+ storage account 存储实例的顶级层次
+ containers 相当于目录
+ blob 文件实体
  ![](https://docs.microsoft.com/zh-cn/azure/storage/blobs/media/storage-blobs-introduction/blob1.png)

Azure 门户点击Storage Account，查看当前tenant的Storage Account，进入其中某个account, 关于存储，提供了一个[Explorer工具](https://azure.microsoft.com/en-us/features/storage-explorer/)
左侧工具 Blob Services - Containers 创建容器csd-commom，（意外地发现之前做App Services备份地Deploy Packages在这里）
进入容器，可以直接使用页面提供的上传入口，上传可以填写一个folder，文件上传时自动使用该folder作为子目录
[官方教程：使用 Azure 存储在云中上传图像数据](https://docs.microsoft.com/zh-cn/azure/storage/blobs/storage-upload-process-images?tabs=dotnet)
$blobStorageAccount（存储账户）
    $blobStorageAccount（容器）
myAppServicePlan（应用服务计划）
    myResourceGroup（资源组）
        $webapp（App Service）[dotNet Blob Uploader](https://github.com/Azure-Samples/storage-blob-upload-from-webapp.git)

YourStorageAccount -- Settings -- Access keys 查看账户密钥以及连接字符串

dotNet Blob Client Package: Azure.Storage
```
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

...
public Task<bool> UploadFileToStorage(Stream fileStream){
  // Create a URI to the blob
  Uri blobUri = new Uri("https://" +
                        _storageConfig.AccountName +
                        ".blob.core.windows.net/" +
                        _storageConfig.ImageContainer +
                        "/" + fileName);
  // connection credential
  StorageSharedKeyCredential storageCredentials =
      new StorageSharedKeyCredential(_storageConfig.AccountName, _storageConfig.AccountKey);

  // Create the blob client.
  BlobClient blobClient = new BlobClient(blobUri, storageCredentials);

  // Upload the file
  await blobClient.UploadAsync(fileStream);

  return await Task.FromResult(true);
}

public static async Task<List<string>> GetThumbNailUrls(AzureStorageConfig _storageConfig)
{
    List<string> thumbnailUrls = new List<string>();

    // Create BlobServiceClient from the account URI
    BlobContainerClient container = new BlobContainerClient(connectionString, _storageConfig.ThumbnailContainer);

    // Get reference to the container
    BlobContainerClient container = blobServiceClient.GetBlobContainerClient(_storageConfig.ThumbnailContainer);

    if (container.Exists())
    {
        foreach (BlobItem blobItem in container.GetBlobs())
        {
            thumbnailUrls.Add(container.Uri + "/" + blobItem.Name);
        }
    }

    return await Task.FromResult(thumbnailUrls);
}
```
Blob SDK for Node.js： [@azure/storage-blob](https://github.com/Azure/azure-sdk-for-js)
```
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const _fs = require('fs')
const { StorageSharedKeyCredential,
    BlobServiceClient } = require('@azure/storage-blob')
const {AbortController} = require('@azure/abort-controller')
const app = express();

// init blob client
const STORAGE_ACCOUNT_NAME = 'YourResourceGroupName'
const CONTAINER_NAME = 'BlobStorageContainerName'
const ACCOUNT_ACCESS_KEY ='****************************'
const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;
const aborter = AbortController.timeout(30 * ONE_MINUTE);
const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,credentials);

const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
//app.use(bodyParser.urlencoded({ extended: false }));
const upload = multer({dest:'/uploads'})
app.post('/upload',upload.single('file'), async (req,res)=>{
    var des_file = __dirname + '/tmp/' +req.file.originalname;
    const stream = _fs.createReadStream(req.file.path)
    const blobClient = containerClient.getBlobClient(req.file.originalname);
    const blockBlobClient = blobClient.getBlockBlobClient();
    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };
    const result = await blockBlobClient.uploadStream(
        stream, 
        uploadOptions.bufferSize, 
        uploadOptions.maxBuffers,
        aborter);
    res.json(result)
})
const port =process.env.PORT||3000;
app.listen(port,()=>{
    console.log('server on port:', port)
})
```
[Azure Blob js SDK](https://docs.microsoft.com/zh-cn/azure/storage/common/storage-samples-javascript?toc=/azure/storage/blobs/toc.json#blob-samples)

-->[自己的栗子](https://github.com/QQstone/node_Blob_Uploader/blob/master/index.js)