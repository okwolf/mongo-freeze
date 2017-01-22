# Prompt for variables not already set in env
[[ $MONGO_ARCHIVE_PREFIX ]] || read -p "Enter prefix for archives (optional): " MONGO_ARCHIVE_PREFIX
[[ $MONGO_HOST ]] || read -p "Enter host for backups: " MONGO_HOST
[[ $MONGO_APP_DB ]] || read -p "Enter app database: " MONGO_APP_DB
[[ $MONGO_APP_USER ]] || read -p "Enter app user name: " MONGO_APP_USER
[[ $MONGO_APP_PASSWORD ]] || read -p "Enter app user password: " MONGO_APP_PASSWORD
[[ $AZURE_STORAGE_ACCOUNT ]] || read -p "Enter Azure blob storage account name: " AZURE_STORAGE_ACCOUNT
[[ $AZURE_STORAGE_ACCESS_KEY ]] || read -p "Enter Azure blob storage access key: " AZURE_STORAGE_ACCESS_KEY
[[ $AZURE_BLOB_CONTAINER ]] || read -p "Enter Azure blob container name: " AZURE_BLOB_CONTAINER

# Build the latest
docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs -f