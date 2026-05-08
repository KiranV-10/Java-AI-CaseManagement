# Labor Services AI Case Management Platform

A full-stack case management application for labor service workflows. Citizens can submit labor-related service requests, while staff can triage, assign, summarize, and resolve cases through a database-backed workflow with AI-assisted classification, prioritization, and summarization.

This project demonstrates Java Spring Boot development, JPA-based database access, REST API design, PostgreSQL schema modeling, React UI development, AI integration, testing, documentation, and Dockerized local setup.

## Highlights

- Citizen request intake with category, employer, incident date, contact preference, and supporting document metadata.
- Staff dashboard for total, new, high-priority, urgent, and aging request metrics.
- Request search and filtering by status, category, priority, assignment, keyword, and date range.
- Case assignment, status transitions, internal notes, priority overrides, and audit logging.
- Admin category management and audit log review.
- Seeded demo users, categories, and realistic labor service requests for local testing.
- Google Gemini integration for AI classification, priority suggestions, citizen guidance, and staff case summaries.
- Swagger/OpenAPI documentation for backend endpoints.

> AI-generated recommendations are for staff assistance only. They do not represent legal advice, official agency decisions, or final case outcomes.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Java 17, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Bean Validation |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Axios, React Router |
| Database | PostgreSQL 16 |
| AI | Google Gemini API |
| API Docs | SpringDoc OpenAPI, Swagger UI |
| Testing | JUnit 5, Mockito, H2, Vitest, React Testing Library |
| DevOps | Docker Compose, GitHub Actions CI |

## Project Structure

```text
.
|-- backend/                  # Spring Boot REST API
|   |-- src/main/java/...      # Controllers, services, DTOs, entities, repositories
|   |-- src/main/resources/    # Spring application configuration
|   `-- src/test/java/...      # Backend unit tests
|-- frontend/                 # React + TypeScript Vite app
|   |-- src/api/               # Axios API client
|   |-- src/components/        # Shared UI components
|   |-- src/pages/             # Citizen, staff, admin, and login pages
|   `-- src/__tests__/         # Frontend tests
|-- docs/                     # Architecture, API, AI, database, and test data docs
|-- docker-compose.yml         # Local PostgreSQL, backend, and frontend stack
`-- .env.example               # Environment variable template
```

## Features

### Citizen

- Log in with a seeded demo account.
- Submit new labor service requests.
- View personal request history and request details.
- See AI-generated guidance when available.

### Staff

- Review dashboard metrics and workload indicators.
- Search and filter all service requests.
- Open staff request details with notes, assignment, AI recommendations, and status history.
- Assign requests to case workers.
- Move requests through controlled status transitions.
- Add internal notes.
- Generate AI-powered staff summaries.
- Override priority while preserving an audit trail.

### Admin

- Create, update, deactivate, and view request categories.
- Review system-wide audit logs.

## AI Behavior

The backend uses an `AiProvider` abstraction. The current implementation calls Google Gemini for:

- Request classification.
- Suggested request priority.
- Citizen-facing guidance.
- Staff-facing case summaries.
- Missing information detection.
- Suggested next actions.

If `GEMINI_API_KEY` is missing or the AI call fails, the application still saves requests and returns an unavailable AI recommendation instead of blocking the case workflow.

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm
- Docker Desktop, if using Docker Compose
- PostgreSQL 16, if running manually
- Google Gemini API key, optional for AI features

## Environment Variables

Create a local `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Key values:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

POSTGRES_DB=case_management
POSTGRES_USER=case_user
POSTGRES_PASSWORD=case_password
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/case_management
SPRING_DATASOURCE_USERNAME=case_user
SPRING_DATASOURCE_PASSWORD=case_password
```

For manual local backend runs, use a `localhost` database URL instead of the Docker service hostname:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/case_management"
$env:SPRING_DATASOURCE_USERNAME="case_user"
$env:SPRING_DATASOURCE_PASSWORD="case_password"
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

## Run Locally

### Option 1: Docker Compose

```powershell
Copy-Item .env.example .env
# Edit .env and add GEMINI_API_KEY if you want live AI responses.

docker compose up --build
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- PostgreSQL: `localhost:5432`

### Option 2: Manual Setup

Create a local PostgreSQL database and user that match the backend defaults:

```sql
CREATE USER case_user WITH PASSWORD 'case_password';
CREATE DATABASE case_management OWNER case_user;
```

Start the backend:

```powershell
cd backend
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/case_management"
$env:SPRING_DATASOURCE_USERNAME="case_user"
$env:SPRING_DATASOURCE_PASSWORD="case_password"
$env:GEMINI_API_KEY="your_gemini_api_key_here"
mvn spring-boot:run
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:8080`.

## Demo Accounts

All seeded demo users use `password123`.

| Role | Name | Email |
| --- | --- | --- |
| Citizen | Demo Citizen | `citizen@example.com` |
| Citizen | Maria Lopez | `maria.lopez@example.com` |
| Citizen | Sam Patel | `sam.patel@example.com` |
| Citizen | Priya Chen | `priya.chen@example.com` |
| Citizen | Omar Johnson | `omar.johnson@example.com` |
| Case Worker | Jordan Caseworker | `worker@example.com` |
| Case Worker | Avery Senior Caseworker | `caseworker2@example.com` |
| Admin | Taylor Admin | `admin@example.com` |

Authentication is intentionally simple for the MVP: the backend validates the seeded email/password pair and returns a mock token with the user's role.

## API Overview

Swagger UI is available at `http://localhost:8080/swagger-ui.html` after the backend starts.

Primary endpoint groups:

- `POST /api/auth/login`
- `GET /api/categories/active`
- `POST /api/requests`
- `GET /api/requests/my`
- `GET /api/requests/{id}`
- `GET /api/staff/requests`
- `GET /api/staff/requests/{id}`
- `PUT /api/staff/requests/{id}/assign`
- `PUT /api/staff/requests/{id}/status`
- `POST /api/staff/requests/{id}/notes`
- `PUT /api/staff/requests/{id}/priority`
- `POST /api/staff/requests/{id}/ai-summary`
- `GET /api/dashboard/metrics`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`
- `GET /api/admin/audit-logs`

See [`docs/api-design.md`](docs/api-design.md) for the full API contract.

## Run Tests

Backend:

```powershell
cd backend
mvn test
```

Frontend:

```powershell
cd frontend
npm test
```

Frontend production build:

```powershell
cd frontend
npm run build
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md) - system architecture overview.
- [`docs/api-design.md`](docs/api-design.md) - REST API contract.
- [`docs/database-schema.md`](docs/database-schema.md) - table definitions and relationships.
- [`docs/ai-design.md`](docs/ai-design.md) - AI provider design, prompt templates, and error handling.
- [`docs/testdata.md`](docs/testdata.md) - seeded demo data reference.

## Future Enhancements

- Add production-grade JWT authentication and authorization.
- Add AWS Bedrock Converse and Google Vertex AI provider profiles.
- Add file upload storage through AWS S3 or Azure Blob Storage.
- Add email notifications for citizen and staff workflow events.
- Add ServiceNow or external ticketing integration.
- Add DB2 deployment profile.
- Add advanced reporting and export workflows.
- Add OpenSearch-backed case search.
- Add SAST scanning and deployment hardening.
- Deploy the backend to AWS or Azure and the frontend to Vercel or Azure Static Web Apps.
