# Mongo Freeze
This will aid in automating backups of live MongoDB instances, uploading those backups to blob storage, and pruning the older backups to limit the frequency more the older they are. Today only Azure Blob storage is supported, but support for other cloud providers could be added.
## Prerequisites
Begin by installing [Docker](https://www.docker.com) or if you already have Docker but not Docker Compose (AKA CoreOS) see [this Gist](https://gist.github.com/marszall87/ee7c5ea6f6da9f8968dd).

## Usage
The primary usage of this project is first to clone this repo:
```
https://github.com/okwolf/mongo-freeze.git
```
Then change into the newly cloned repo and start the revive process:
```
cd mongo-freeze && ./freeze.sh
```
You'll be prompted for required values not already set in your environment:
```
Enter prefix for archives (optional): db
Enter host for backups: database.url
Enter app database: dev
Enter app user name: app
Enter app user password: @PasswordMoreS3cure3ThanThi5
Enter Azure blob storage account name: storageaccount
Enter Azure blob storage access key: Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
Enter Azure blob container name: db-backups
Building freeze
Step 1/5 : FROM mongo:3.2.6
 ---> 4244d33b9b0e
...
Creating mongofreeze_freeze_1
Attaching to mongofreeze_freeze_1
freeze_1  | 
freeze_1  | > mongo-freeze@0.0.1 prestart /app
freeze_1  | > npm install
freeze_1  | 
freeze_1  | 
freeze_1  | > mongo-freeze@0.0.1 start /app
freeze_1  | > babel-node src/index.js
freeze_1  | 
freeze_1  | Mongo Freeze webhook ready at /cizglt5kf000012qt1cvyleao
```
At this point you can make a GET request to `/cizglt5kf000012qt1cvyleao` on the machine you spun up mongo-freeze on, assuming it's publicly accessible. This can be automated with something like Scheduler from Azure.

For reference here is a table of all available variables:

| Variable                 | Required|Meaning|
| -------------------------|:-------:|-------|
| MONGO_ARCHIVE_PREFIX     | NO      | Optional prefix to use for archive files that are created. Default value is `db`. |
| MONGO_HOST               | YES     | Host of your MongoDB instance to connect to. Must support TLS/SSL since mongodump will connect securely. |
| MONGO_APP_DB             | YES     | Database to connect to and backup the data contained in. |
| MONGO_APP_USER           | YES     | User to connect for performing the backups. This user must have `backup` role or equivalent. |
| MONGO_APP_PASSWORD       | YES     | Password for the application user above. |
| AZURE_BLOB_CONTAINER     | YES     | Name of the container to upload new archives to and cleanup old archives as well. |

Also the `azure-storage` library requires setting `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`, or `AZURE_STORAGE_CONNECTION_STRING`. For more details see [their documentation](https://github.com/Azure/azure-storage-node#usage).
