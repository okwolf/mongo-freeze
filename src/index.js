import express from 'express'
import cuid from 'cuid'
import mongoFreeze from './mongoFreeze'

const app = express()
const webhookPath = `/${cuid()}`

app.disable('x-powered-by')

app.get('/', (req, res) => res.send('Nothing to see here...'))

app.get(webhookPath, (req, res) => {
  const freezeResult = mongoFreeze()
  res.send(`Started mongo-freeze...<br />
    Your archive will be: ${freezeResult.archiveName}`)
})

app.listen(8080, () => {
  console.log(`Mongo Freeze webhook ready at ${webhookPath}`)
})
