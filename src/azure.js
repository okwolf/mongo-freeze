import azure from 'azure-storage'
import moment from 'moment'
import blobCleanup from './blobCleanup'

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

const deleteBlob = name => new Promise((resolve, reject) => {
  blobService.deleteBlob(
    AZURE_BLOB_CONTAINER,
    name,
    (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve({ name, result })
      }
    }
  )
})

const deleteOldBlobs = blobs => Promise.all(
  blobCleanup({ blobs }).map(blob => deleteBlob(blob.name))
)

export function saveToBlobStorage(file) {
  return ensureContainer().then(uploadToBlobStorage(file))
}

export function cleanupBlobs() {
  return ensureContainer().then(listBlobs).then(deleteOldBlobs)
}