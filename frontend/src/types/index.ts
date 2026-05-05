export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  defaultPriority: string;
  slaDays: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RequestListItem {
  id: number;
  requestNumber: string;
  title: string;
  status: string;
  priority: string;
  categoryName: string;
  citizenName: string;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiRecommendation {
  id: number;
  provider: string;
  model: string;
  suggestedCategory: string;
  suggestedPriority: string;
  confidenceScore: number;
  reasoning: string;
  summary: string;
  keyFacts: string[];
  missingInformation: string[];
  suggestedNextAction: string;
  citizenGuidance: string;
  citizenFriendlyExplanation: string;
  status: string;
  errorMessage: string;
  createdAt: string;
}

export interface CaseNote {
  id: number;
  authorName: string;
  noteText: string;
  internalOnly: boolean;
  createdAt: string;
}

export interface StatusHistory {
  id: number;
  oldStatus: string | null;
  newStatus: string;
  changedByName: string;
  changeReason: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  performedByName: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
}

export interface RequestDetail {
  id: number;
  requestNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  categoryName: string;
  categoryId: number;
  preferredContactMethod: string;
  phoneNumber: string;
  employerName: string;
  incidentDate: string;
  documentName: string;
  aiSuggestedCategory: string;
  aiSuggestedPriority: string;
  citizenName: string;
  citizenEmail: string;
  citizenId: number;
  assignedToName: string | null;
  assignedToId: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  aiRecommendation: AiRecommendation | null;
  notes: CaseNote[];
  statusHistory: StatusHistory[];
  auditLogs: AuditLogEntry[];
}

export interface CreateRequestResponse {
  id: number;
  requestNumber: string;
  status: string;
  priority: string;
  aiSuggestedCategory: string;
  aiSuggestedPriority: string;
  aiStatus: string;
  citizenGuidance: string;
  message: string;
}

export interface DashboardMetrics {
  totalRequests: number;
  newRequests: number;
  highPriorityRequests: number;
  urgentRequests: number;
  waitingForCitizen: number;
  resolvedThisWeek: number;
  averageResolutionDays: number;
  agingRequests: number;
}

export interface AiSummaryResult {
  aiStatus: string;
  provider: string;
  model: string;
  summary: string;
  keyFacts: string[];
  missingInformation: string[];
  suggestedNextAction: string;
  citizenFriendlyExplanation: string;
  errorMessage: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
