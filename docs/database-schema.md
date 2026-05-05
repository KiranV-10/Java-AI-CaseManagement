# Database Schema

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| full_name | VARCHAR | |
| email | VARCHAR | UNIQUE |
| password_hash | VARCHAR | |
| role | VARCHAR | CITIZEN, CASE_WORKER, ADMIN |
| active | BOOLEAN | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### request_categories
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| name | VARCHAR | UNIQUE |
| description | VARCHAR | |
| default_priority | VARCHAR | LOW, MEDIUM, HIGH, URGENT |
| sla_days | INT | |
| active | BOOLEAN | Soft delete |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### service_requests
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| request_number | VARCHAR | UNIQUE, e.g., REQ-2026-0001 |
| citizen_id | BIGINT | FK -> users |
| category_id | BIGINT | FK -> request_categories |
| title | VARCHAR | |
| description | TEXT | |
| preferred_contact_method | VARCHAR | EMAIL, PHONE, MAIL |
| phone_number | VARCHAR | |
| employer_name | VARCHAR | |
| incident_date | DATE | |
| document_name | VARCHAR | |
| status | VARCHAR | NEW, IN_REVIEW, WAITING_FOR_CITIZEN, RESOLVED, CLOSED |
| priority | VARCHAR | LOW, MEDIUM, HIGH, URGENT |
| ai_suggested_category | VARCHAR | |
| ai_suggested_priority | VARCHAR | |
| assigned_to_id | BIGINT | FK -> users |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| resolved_at | TIMESTAMP | |
| closed_at | TIMESTAMP | |

### case_notes
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| request_id | BIGINT | FK -> service_requests |
| author_id | BIGINT | FK -> users |
| note_text | TEXT | |
| internal_only | BOOLEAN | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### case_status_history
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| request_id | BIGINT | FK -> service_requests |
| old_status | VARCHAR | |
| new_status | VARCHAR | |
| changed_by_id | BIGINT | FK -> users |
| change_reason | VARCHAR | |
| created_at | TIMESTAMP | |

### ai_recommendations
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| request_id | BIGINT | FK -> service_requests |
| provider | VARCHAR | gemini, bedrock |
| model | VARCHAR | |
| suggested_category | VARCHAR | |
| suggested_priority | VARCHAR | |
| confidence_score | DOUBLE | |
| reasoning | TEXT | |
| summary | TEXT | |
| key_facts | TEXT | JSON array |
| missing_information | TEXT | JSON array |
| suggested_next_action | TEXT | |
| citizen_guidance | TEXT | |
| raw_response | TEXT | |
| status | VARCHAR | SUCCESS, FAILED |
| error_message | TEXT | |
| created_at | TIMESTAMP | |

### audit_logs
| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | PK |
| entity_type | VARCHAR | |
| entity_id | BIGINT | |
| action | VARCHAR | See AuditAction enum |
| performed_by_id | BIGINT | FK -> users |
| old_value | TEXT | |
| new_value | TEXT | |
| created_at | TIMESTAMP | |
