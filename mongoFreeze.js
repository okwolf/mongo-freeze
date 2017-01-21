import { spawn } from 'child_process'
import moment from 'moment'
import fs from 'fs'
import { saveToBlobStorage, cleanupBlobs } from './azure'

const { MONGO_ARCHIVE_PREFIX = 'db', MONGO_HOST, MONGO_APP_DB, MONGO_APP_USER, MONGO_APP_PASSWORD } = process.env

const createArchiveNamed = archiveName => new Promise((resolve, reject) => {
  const mongodump = spawn('mongodump', [
    '--gzip',
    `--archive=${archiveName}`,
    `--host=${MONGO_HOST}`,
    '--ssl', '--sslAllowInvalidCertificates',
    `--db=${MONGO_APP_DB}`,
    `--username=${MONGO_APP_USER}`,
    `--password=${MONGO_APP_PASSWORD}`
  ], { stdio: 'inherit' })
  mongodump.on('error', err => {
    reject(err)
  })
  mongodump.on('exit', exitCode => {
    if (exitCode === 0) {
      resolve(exitCode)
    } else {
      reject(exitCode)
    }
  })
})

const cleanupFile = file => new Promise((resolve, reject) => {
  fs.unlink(file, err => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})

export default function mongoFreeze() {
  const archiveName = `${MONGO_ARCHIVE_PREFIX}-${moment().format('Y-MM-DD-HH-mm-ss')}.archive`
  createArchiveNamed(archiveName).then(() => {
    console.log(`created archive: ${archiveName}`)
    return saveToBlobStorage(archiveName)
  }).then(() => {
    console.log(`saved ${archiveName} to blob storage`)
    return cleanupFile(archiveName)
  }).then(() => {
    console.log(`cleaned up ${archiveName} after saving`)
    return cleanupBlobs()
  }).then(() => {
    console.log(`cleaned up old blobs after saving ${archiveName} complete`)
  }).catch(console.error)
  return {
    archiveName
  }
}