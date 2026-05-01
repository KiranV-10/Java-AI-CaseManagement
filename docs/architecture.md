# Architecture Overview

## System Components

- **Frontend**: React + TypeScript + Tailwind CSS served by Vite (dev) or Nginx (Docker)
- **Backend**: Java 17 Spring Boot REST API
- **Database**: PostgreSQL 16 with JPA/Hibernate ORM
- **AI Provider**: Google Gemini API (pluggable via AiProvider interface)

## High-Level Flow

1. Citizens submit service requests through the React frontend
2. Backend saves the request and calls the Gemini AI for classification
3. AI classification result is stored alongside the request
4. Staff view requests on the dashboard, manage cases, and generate AI summaries
5. All actions are audit-logged for traceability

## Backend Package Structure

```
com.kiran.casemanagement
├── ai/           - AI provider interface, Gemini implementation, prompt builder, parser
├── config/       - CORS, OpenAPI, data seeder
├── controller/   - REST controllers (Auth, Request, Staff, Category, Dashboard)
├── dto/          - Data transfer objects
├── entity/       - JPA entities
├── enums/        - Domain enums (status, priority, roles, etc.)
├── exception/    - Custom exceptions and global handler
├── repository/   - Spring Data JPA repositories
└── service/      - Business logic services
```

## Frontend Structure

```
src/
├── api/          - Axios API client
├── components/   - Shared UI components (Layout, badges, disclaimer)
├── pages/        - Route pages organized by role (citizen, staff, admin)
├── types/        - TypeScript interfaces
└── __tests__/    - Vitest test files
```
