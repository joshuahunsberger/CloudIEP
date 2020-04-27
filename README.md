# Cloud IEP

[![Build Status](https://dev.azure.com/joshuahunsberger/Hunsberger/_apis/build/status/joshuahunsberger.CloudIEP?branchName=master)](https://dev.azure.com/joshuahunsberger/Hunsberger/_build/latest?definitionId=3&branchName=master)

## Getting Started:

To run this locally, you need the following applications:

- Visual Studio or Visual Studio Code
- dotnet SDK
- Node
- NPM or Yarn
- Docker Desktop (If you want to run the API in a container)

### Auth0 Setup

This application uses Auth0 for authentication.  You can create a free account at auth0.com.  You can follow the relevant steps in this tutorial to get your account set up: https://auth0.com/docs/quickstart/spa/react/02-calling-an-api

Once your account is setup, you need the following values:
- API Identifier (to be used as Audience)
- Domain of your API
- Client ID from your Single Page Application Auth0 Application

### Cosmos DB Setup

The data store for this application is Cosmos DB.  You can either set up a free account in Azure using the Cosmos DB free tier or use the Cosmos Emulator on Windows (https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator).  This app was set up using the SQL API.

Once set up, you need the following values:
- URL of your instance
- Access key
- Database name

You will also need to create the containers/collections listed below (partitioned by /id):
- Students
- Users
- Goals

### ASP.NET Core API Setup

The API project is making use of the Secret Manager tool for managing application secrets.
See more here:
https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-3.1

To configure secrets, navigate to api/CloudIEP.Web and run the `dotnet user-secrets` command for your operating system (https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-3.1&tabs=windows#set-multiple-secrets)

If the following values existed as user-secrets.json
```
{
  "Auth0:Audience": "...",
  "Auth0:Domain": "...",
  "Auth0:Token": "...",
  "CosmosDB:DatabaseName": "...",
  "CosmosDB:Endpoint": "...",
  "CosmosDB:Key": "...",
  "CosmosDB:Collections:0:Name": "Students",
  "CosmosDB:Collections:0:PartitionKey": "Id",
  "CosmosDB:Collections:1:Name": "Users",
  "CosmosDB:Collections:1:PartitionKey": "Id",
  "CosmosDB:Collections:2:Name": "Goals",
  "CosmosDB:Collections:2:PartitionKey": "Id",
}
```
You could run the following command in bash:

`cat ./input.json | dotnet user-secrets set`

To run the project locally, you open the solution in the /api directory in your preferred version of Visual Studio.

Alternatively, you can run the docker compose command in the api directory:

`docker-compose -f "docker-compose.yml" up -d --build`

### React Client Setup

Some configuration for the React application comes from a .env file.  Add a .env.local file to the root of the cloud-iep-client folder with the following values:

```
REACT_APP_AUTH0_DOMAIN=...
REACT_APP_AUTH0_CLIENTID=...
REACT_APP_AUTH0_AUDIENCE=...
```

Once that file is setup, you can run the following commands in the cloud-iep-client/ directory:
```
yarn install
yarn start
```

or

```
npm install
npm start
```
## Library References:

Material-UI for React Components that implement Google's Material Design: https://material-ui.com/

Material-UI Pickers for date picker components: https://material-ui-pickers.dev/

Recharts for graphing: http://recharts.org/en-US

## Source Code References:
Example for Repository Pattern with CosmosDB: https://github.com/Azure-Samples/PartitionedRepository


Logged-in page routing inspired by John Reilly on GitHub: https://github.com/johnnyreilly/auth0-react-typescript-asp-net-core


API types concept borrowed from https://github.com/camilosw/react-hooks-services and related blog post by Camilo Mejia: https://dev.to/camilomejia/fetch-data-with-react-hooks-and-typescript-390c
