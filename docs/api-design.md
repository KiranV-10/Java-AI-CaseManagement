# API Design

All endpoints are prefixed with `/api`.

## Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/login | Login with email/password |

## Citizen Requests

| Method | Path | Description |
|--------|------|-------------|
| POST | /requests | Submit a new service request |
| GET | /requests/my?citizenId={id} | Get citizen's own requests |
| GET | /requests/{id} | Get request details (citizen view) |

## Staff Operations

| Method | Path | Description |
|--------|------|-------------|
| GET | /staff/requests | Get all requests with filters and pagination |
| GET | /staff/requests/{id} | Get request details (staff view with internal notes) |
| PUT | /staff/requests/{id}/assign | Assign request to a case worker |
| PUT | /staff/requests/{id}/status | Update request status |
| POST | /staff/requests/{id}/notes | Add an internal note |
| PUT | /staff/requests/{id}/priority | Override request priority |
| POST | /staff/requests/{id}/ai-summary | Generate AI case summary |

## Categories

| Method | Path | Description |
|--------|------|-------------|
| GET | /categories/active | Get active categories |
| GET | /admin/categories | Get all categories (admin) |
| POST | /admin/categories | Create a new category |
| PUT | /admin/categories/{id} | Update a category |
| DELETE | /admin/categories/{id} | Deactivate a category (soft delete) |

## Dashboard & Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | /dashboard/metrics | Get dashboard metrics |
| GET | /admin/audit-logs | Get paginated audit logs |

## Interactive API Docs

Swagger UI: http://localhost:8080/swagger-ui.html
