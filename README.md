# dotnet-orval-tanstack-router-template

Template repository with:

- **Backend**: .NET multi-project solution
  - `backend/src/DotnetOrvalTemplate.Api` (Web API)
  - `backend/tests/DotnetOrvalTemplate.Api.Tests` (xUnit tests)
- **Frontend**: Vite + React + Tailwind + TanStack Router/Query/Form
  - `frontend/app`
- **API client generation**: Orval-generated TanStack Query hooks
- **Auth + guest flow**: register/login/guest + JWT auth
- **Database**: PostgreSQL via EF Core

## Backend

```bash
cd /home/runner/work/dotnet-orval-tanstack-router-template/dotnet-orval-tanstack-router-template/backend

dotnet test DotnetOrvalTemplate.slnx
```

Default API endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/guest`
- `GET /api/auth/me` (JWT required)

Set a valid PostgreSQL connection string in:

- `/home/runner/work/dotnet-orval-tanstack-router-template/dotnet-orval-tanstack-router-template/backend/src/DotnetOrvalTemplate.Api/appsettings.json`

## Frontend

```bash
cd /home/runner/work/dotnet-orval-tanstack-router-template/dotnet-orval-tanstack-router-template/frontend/app
npm install
npm run dev
```

Optional commands:

```bash
npm run generate:api
npm run build
npm run lint
```

The frontend calls the API using Orval-generated hooks in:

- `/home/runner/work/dotnet-orval-tanstack-router-template/dotnet-orval-tanstack-router-template/frontend/app/src/api/generated.ts`
