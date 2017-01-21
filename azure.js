import azure from 'azure-storage'

const blobService = azure.createBlobService()
const { AZURE_BLOB_CONTAINER } = process.env

const ensureContainer = () => new Promise((resolve, reject) => {
  blobService.createContainerIfNotExists(
    AZURE_BLOB_CONTAINER,
    { publicAccessLevel: 'blob' },
    (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }
  )
})

const uploadToBlobStorage = file => new Promise((resolve, reject) => {
  blobService.createBlockBlobFromLocalFile(
    AZURE_BLOB_CONTAINER,
    file,
    file,
    (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }
  )
})

const listBlobs = () => new Promise((resolve, reject) => {
  blobService.listBlobsSegmented(
    AZURE_BLOB_CONTAINER,
    null,
    (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result.entries)
      }
    }
  )
})

const deleteOldBlobs = blobs => new Promise((resolve, reject) => {
  console.log('TODO: delete old blobs...')
  resolve(blobs)
})

export function saveToBlobStorage(file) {
  return ensureContainer().then(uploadToBlobStorage(file))
}

export function cleanupBlobs() {
  return ensureContainer().then(listBlobs).then(deleteOldBlobs)
}