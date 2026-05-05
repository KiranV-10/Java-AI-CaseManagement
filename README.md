# Labor Services AI Case Management Platform

A full-stack Java Spring Boot and React case management application where citizens submit labor-related service requests and internal staff manage, assign, summarize, and resolve those cases using a database-backed workflow with real AI-assisted classification, prioritization, and summarization.

## Role Alignment

This project was built to demonstrate skills aligned with a Java Applications Developer role supporting government service applications. It highlights Java Spring Boot development, JPA-based database access, RESTful web services, SQL database design, React frontend development, real AI-assisted workflows, technical testing, documentation, and maintainable SDLC practices.

The job description mentions Angular. This project uses React + TypeScript for the frontend because the focus is on demonstrating full-stack architecture, REST API integration, component-based UI development, and maintainable application design. The frontend architecture is intentionally modular and could be adapted to Angular if required.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA |
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Database | PostgreSQL 16 |
| AI | Google Gemini API |
| API Docs | SpringDoc OpenAPI / Swagger UI |
| Testing | JUnit 5, Mockito, Vitest, React Testing Library |
| DevOps | Docker Compose, GitHub Actions CI |

## Features

### Citizen Features
- Submit labor service requests with category, description, and supporting details
- View own requests with status tracking
- Receive AI-generated guidance after submission

### Staff Features
- Dashboard with metrics (total, new, high priority, urgent, aging requests)
- Filter and search all requests
- Assign cases, update status, add internal notes
- Generate AI-powered case summaries
- Override priority with audit trail

### Admin Features
- Manage request categories (create, edit, deactivate)
- View system-wide audit logs

### Real AI Features
- **Request Classification**: AI suggests category, priority, and provides citizen guidance
- **Case Summarization**: AI generates summary, key facts, missing information, and next actions
- **Missing Information Detection**: AI identifies what case workers need to collect
- **Suggested Next Actions**: AI recommends administrative steps

The current MVP uses Google Gemini for real AI-powered classification and summarization. The AI provider layer is designed so AWS Bedrock Converse can be added using a separate Spring profile.

## Real AI Setup

This MVP uses Google Gemini API for real AI-powered request classification and case summarization.

Create a `.env` file from `.env.example` and set:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

If the API key is missing, the application will still save service requests, but AI recommendations will be shown as unavailable.

## How to Run Locally

### Prerequisites
- Java 17+
- Node.js 20+
- PostgreSQL 16 (or use Docker Compose)
- Google Gemini API key (optional, for AI features)

### Option 1: Docker Compose (Recommended)

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Database: localhost:5432

### Option 2: Manual Setup

**Database:**
```bash
createdb case_management
```

**Backend:**
```bash
cd backend
export GEMINI_API_KEY=your_key_here
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Demo Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Demo Citizen | citizen@example.com | password123 | CITIZEN |
| Jordan Caseworker | worker@example.com | password123 | CASE_WORKER |
| Taylor Admin | admin@example.com | password123 | ADMIN |

## How to Run Tests

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
npm test
```

## API Documentation

Interactive Swagger UI available at: http://localhost:8080/swagger-ui.html

See [docs/api-design.md](docs/api-design.md) for the full API contract.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the system architecture overview.

## Database Schema

See [docs/database-schema.md](docs/database-schema.md) for table definitions.

## AI Design

See [docs/ai-design.md](docs/ai-design.md) for AI provider architecture, prompt templates, and error handling strategy.

> AI-generated recommendations are for staff assistance only. They do not represent legal advice, official agency decisions, or final case outcomes.

## Future Enhancements

- Add AWS Bedrock Converse provider
- Add Google Vertex AI profile
- Add ServiceNow ticket creation integration
- Add file upload to AWS S3
- Add email notifications
- Add JWT authentication
- Add DB2 deployment profile
- Add advanced reporting
- Add OpenSearch case search
- Add Veracode/SAST scanning
- Deploy backend to AWS or Azure
- Deploy frontend to Vercel or Azure Static Web Apps

---

I built a full-stack Java Spring Boot and React case management platform inspired by labor service workflows. It allows citizens to submit service requests and internal staff to manage, assign, summarize, and resolve cases. The project uses real Google Gemini AI assistance for request classification, priority suggestion, missing information detection, and staff case summarization. It demonstrates Java application development, JPA-based database design, REST APIs, React UI development, AI integration, role-based workflows, testing, documentation, and Dockerized local setup.
