# Cloud IEP

[![Build Status](https://dev.azure.com/joshuahunsberger/Hunsberger/_apis/build/status/joshuahunsberger.CloudIEP?branchName=main)](https://dev.azure.com/joshuahunsberger/Hunsberger/_build/latest?definitionId=3&branchName=main)

## Getting Started:

To run this locally, you need the following applications:

- Visual Studio, JetBrains Rider, or Visual Studio Code
- .NET 10 SDK
- Node.js & NPM
- Docker or compatible container runtime (Required to run the Cosmos DB emulator container via Aspire)

### Running Locally with Aspire

The easiest way to run the entire application stack is with **Aspire**:

```bash
dotnet run --project api/CloudIEP.AppHost
```

Aspire will automatically orchestrate:
1. **Azure Cosmos DB Emulator**: Starts the emulator container with Data Explorer enabled.
2. **Containers**: Creates the required containers (`Students`, `Users`, `Goals` partitioned by `/id`).
3. **Database Seeder**: Runs `CloudIEP.DatabaseSeeder` to populate initial test students and goals.
4. **Web API**: Launches `CloudIEP.Web` with the emulator connection string injected.
5. **React Client**: Launches `cloud-iep-client` with Vite and connects it to the API.

---

### Auth0 Setup

This application uses Auth0 for authentication. You can create a free account at [auth0.com](https://auth0.com).

Once your account is setup, you need the following values:
- **API Identifier** (used as Audience)
- **Domain** of your API
- **Client ID** from your Single Page Application Auth0 Application

---

### Cosmos DB & Data Access Setup

The data layer uses the **Entity Framework Core Cosmos Provider** (`Aspire.Microsoft.EntityFrameworkCore.Cosmos`) backed by an EF Core DbContext (`CloudIEPDbContext`).

- **When using Aspire**: Cosmos DB provisioning and container creation are fully automated.
- **When running standalone**: You can connect to an existing Azure Cosmos DB instance or local emulator by setting the `CloudIEPDev` connection string.

The database requires three containers partitioned by `/id`:
- `Students`
- `Users`
- `Goals`

---

### ASP.NET Core API Setup (Standalone)

If you are running the API without the Aspire AppHost, configure your secrets using the `dotnet user-secrets` tool in `api/CloudIEP.Web`:

```json
{
  "Auth0:Audience": "...",
  "Auth0:Domain": "...",
  "Auth0:SwaggerClientId": "...",
  "ConnectionStrings:CloudIEPDev": "AccountEndpoint=https://localhost:8081/;AccountKey=..."
}
```

You can set these via bash:
```bash
cat ./user-secrets.json | dotnet user-secrets set
```

To run the API standalone:
```bash
dotnet run --project api/CloudIEP.Web
```

---

### React Client Setup (Standalone)

Add a `.env.local` file to the root of the `cloud-iep-client/` folder:

```bash
VITE_REACT_APP_AUTH0_DOMAIN=...
VITE_REACT_APP_AUTH0_CLIENTID=...
```

Then install dependencies and start the Vite dev server:

```bash
cd cloud-iep-client
npm install
npm run dev
```

---

## Library References:

- [MUI (Material UI)](https://mui.com/) - React components implementing Google's Material Design
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) - Date picker components
- [Recharts](https://recharts.org/) - Composable charting library

## Source Code References:

- [EF Core Azure Cosmos DB Provider](https://learn.microsoft.com/en-us/ef/core/providers/cosmos/) - EF Core Cosmos documentation
- [Auth0 React SDK](https://github.com/auth0/auth0-react) - Authentication provider integration
- Logged-in page routing inspired by [John Reilly](https://github.com/johnnyreilly/auth0-react-typescript-asp-net-core)
- API types concept borrowed from [Camilo Mejia](https://dev.to/camilomejia/fetch-data-with-react-hooks-and-typescript-390c)
