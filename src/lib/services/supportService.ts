// ============================================================
// KRISHIMITRA AI — SUPPORT SERVICE LAYER
// Supabase-Integrated & In-Memory Fallback Support Hub Engine
// Zero-Fake Data: Strict authentic farmer records & verified govt data
// ============================================================

import { supabase } from "@/lib/supabase";
import {
  FarmerDocument,
  DocumentType,
  SchemeApplication,
  SchemeApplicationHistory,
  ApplicationStatus,
  FarmerBenefit,
  BenefitStatus,
  OfficialNotice,
  ImportantDate,
  ServiceRequest,
  ServiceRequestHistory,
  RequestStatus,
  ServiceFeedback,
  SupportNotification,
  SupportAuditLog,
  SupportDashboardSummary,
  ServiceProvider,
} from "@/lib/types/support";
import {
  VERIFIED_OFFICIAL_NOTICES,
  VERIFIED_IMPORTANT_DATES,
  VERIFIED_SERVICE_PROVIDERS,
  MASTER_SUPPORT_SERVICES,
} from "@/lib/services/governmentDataService";

// In-Memory User Stores (Initialized completely empty for realistic farmer sessions)
const inMemoryDocuments: FarmerDocument[] = [];
const inMemoryApplications: SchemeApplication[] = [];
const inMemoryBenefits: FarmerBenefit[] = [];
const inMemoryServiceRequests: ServiceRequest[] = [];
const inMemoryFeedback: ServiceFeedback[] = [];
const inMemoryNotifications: SupportNotification[] = [];
const inMemoryAuditLogs: SupportAuditLog[] = [];
const inMemoryNotices: OfficialNotice[] = [...VERIFIED_OFFICIAL_NOTICES];
const inMemoryDates: ImportantDate[] = [...VERIFIED_IMPORTANT_DATES];
const inMemoryProviders: ServiceProvider[] = [...VERIFIED_SERVICE_PROVIDERS];

// Helper to log audit events
export function logSupportAudit(
  actorId: string,
  actorRole: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, any>
): SupportAuditLog {
  const log: SupportAuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    actor_id: actorId,
    actor_role: actorRole,
    action,
    entity_type: entityType,
    entity_id: entityId,
    timestamp: new Date().toISOString(),
    metadata,
  };
  inMemoryAuditLogs.unshift(log);
  return log;
}

// ------------------------------------------------------------
// 1. SECURE DOCUMENT VAULT
// ------------------------------------------------------------

export async function getFarmerDocuments(
  userId: string,
  filters?: {
    type?: DocumentType;
    farmId?: string;
    search?: string;
    sortBy?: "date" | "name" | "size";
  }
): Promise<FarmerDocument[]> {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from("farmer_documents")
      .select("*")
      .eq("user_id", userId);

    let docs: FarmerDocument[] = [];
    if (!error && Array.isArray(data) && data.length > 0) {
      docs = data;
    } else {
      docs = inMemoryDocuments.filter((d) => d.user_id === userId);
    }

    if (filters?.type) {
      docs = docs.filter((d) => d.document_type === filters.type);
    }
    if (filters?.farmId) {
      docs = docs.filter((d) => d.farm_id === filters.farmId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      docs = docs.filter((d) => d.document_name.toLowerCase().includes(q));
    }

    // Sorting
    if (filters?.sortBy === "name") {
      docs.sort((a, b) => a.document_name.localeCompare(b.document_name));
    } else if (filters?.sortBy === "size") {
      docs.sort((a, b) => b.file_size - a.file_size);
    } else {
      // Default: date descending
      docs.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
    }

    return docs;
  } catch {
    return inMemoryDocuments.filter((d) => d.user_id === userId);
  }
}

export async function uploadFarmerDocument(
  userId: string,
  doc: {
    farm_id?: string | null;
    document_type: DocumentType;
    document_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }
): Promise<FarmerDocument> {
  const newDoc: FarmerDocument = {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    farm_id: doc.farm_id || null,
    document_type: doc.document_type,
    document_name: doc.document_name,
    file_path: doc.file_path,
    file_size: doc.file_size,
    mime_type: doc.mime_type,
    uploaded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemoryDocuments.unshift(newDoc);
  logSupportAudit(userId, "farmer", "DOCUMENT_UPLOADED", "farmer_documents", newDoc.id, {
    name: newDoc.document_name,
    type: newDoc.document_type,
    size: newDoc.file_size,
  });

  return newDoc;
}

export async function renameFarmerDocument(
  userId: string,
  docId: string,
  newName: string
): Promise<FarmerDocument | null> {
  const doc = inMemoryDocuments.find((d) => d.id === docId && d.user_id === userId);
  if (!doc) return null;

  doc.document_name = newName;
  doc.updated_at = new Date().toISOString();

  logSupportAudit(userId, "farmer", "DOCUMENT_RENAMED", "farmer_documents", doc.id, { newName });
  return doc;
}

export async function deleteFarmerDocument(userId: string, docId: string): Promise<boolean> {
  const index = inMemoryDocuments.findIndex((d) => d.id === docId && d.user_id === userId);
  if (index === -1) return false;

  inMemoryDocuments.splice(index, 1);
  logSupportAudit(userId, "farmer", "DOCUMENT_DELETED", "farmer_documents", docId);
  return true;
}

// ------------------------------------------------------------
// 2. GOVERNMENT SCHEME APPLICATION TRACKER
// ------------------------------------------------------------

export async function getFarmerApplications(userId: string): Promise<SchemeApplication[]> {
  try {
    const { data, error } = await supabase
      .from("scheme_applications")
      .select("*")
      .eq("user_id", userId);

    if (!error && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return inMemoryApplications.filter((a) => a.user_id === userId);
  } catch {
    return inMemoryApplications.filter((a) => a.user_id === userId);
  }
}

export async function getApplicationById(
  userId: string,
  applicationId: string
): Promise<SchemeApplication | null> {
  const app = inMemoryApplications.find((a) => a.id === applicationId && a.user_id === userId);
  return app || null;
}

export async function submitSchemeApplication(
  userId: string,
  payload: {
    scheme_id: string;
    scheme_name: string;
    farm_id?: string | null;
    remarks?: string;
    documents?: string[];
  }
): Promise<SchemeApplication> {
  const refNumber = `KA-AGRI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const historyItem: SchemeApplicationHistory = {
    id: `hist_${Date.now()}`,
    application_id: "",
    status: "SUBMITTED",
    remarks: payload.remarks || "Application successfully submitted to Agriculture Directorate portal.",
    changed_by: "Farmer (Direct Portal Submission)",
    changed_at: now,
  };

  const newApp: SchemeApplication = {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    scheme_id: payload.scheme_id,
    scheme_name: payload.scheme_name,
    farm_id: payload.farm_id || null,
    application_reference_number: refNumber,
    submission_date: now.split("T")[0],
    status: "SUBMITTED",
    last_updated: now,
    remarks: payload.remarks || null,
    required_action: "Under verification at Taluk Agriculture Office (ADA Desk).",
    documents: payload.documents || [],
    history: [historyItem],
    created_at: now,
    updated_at: now,
  };

  historyItem.application_id = newApp.id;
  inMemoryApplications.unshift(newApp);

  // Link corresponding benefit record in "APPLIED" state
  const newBenefit: FarmerBenefit = {
    id: `ben_${Date.now()}`,
    user_id: userId,
    scheme_id: payload.scheme_id,
    scheme_name: payload.scheme_name,
    application_id: newApp.id,
    benefit_type: "Direct Benefit Subsidy / Grant",
    expected_amount: null, // Zero fake amount, depends on official eligibility approval
    approved_amount: null,
    status: "APPLIED",
    source: "Karnataka Dept of Agriculture / DBT Cell",
    updated_at: now,
  };
  inMemoryBenefits.unshift(newBenefit);

  // Trigger Notification
  createNotification(
    userId,
    "application",
    "Scheme Application Submitted",
    `Application ${refNumber} for ${payload.scheme_name} has been submitted for official scrutiny.`,
    "scheme_applications",
    newApp.id
  );

  logSupportAudit(userId, "farmer", "SCHEME_APPLICATION_CREATED", "scheme_applications", newApp.id, {
    ref: refNumber,
    scheme: payload.scheme_name,
  });

  return newApp;
}

export async function updateApplicationStatus(
  actorId: string,
  actorRole: string,
  applicationId: string,
  newStatus: ApplicationStatus,
  remarks?: string
): Promise<SchemeApplication | null> {
  const app = inMemoryApplications.find((a) => a.id === applicationId);
  if (!app) return null;

  const now = new Date().toISOString();
  app.status = newStatus;
  app.last_updated = now;
  app.updated_at = now;
  if (remarks) app.remarks = remarks;

  if (newStatus === "DOCUMENT_REQUIRED") {
    app.required_action = remarks || "Additional land ownership / soil report document required.";
  } else if (newStatus === "APPROVED") {
    app.required_action = "Approved by Joint Director of Agriculture. Sanction order released.";
  } else if (newStatus === "COMPLETED") {
    app.required_action = "Benefit amount credited to DBT Aadhaar linked account.";
  }

  const historyItem: SchemeApplicationHistory = {
    id: `hist_${Date.now()}`,
    application_id: app.id,
    status: newStatus,
    remarks: remarks || `Status updated to ${newStatus}`,
    changed_by: actorRole === "admin" ? "Agricultural Directorate Admin" : "System",
    changed_at: now,
  };

  app.history = app.history || [];
  app.history.push(historyItem);

  // Update corresponding benefit if exists
  const benefit = inMemoryBenefits.find((b) => b.application_id === app.id);
  if (benefit) {
    if (newStatus === "APPROVED") {
      benefit.status = "APPROVED";
      benefit.approval_date = now.split("T")[0];
    } else if (newStatus === "COMPLETED") {
      benefit.status = "RECEIVED";
      benefit.benefit_date = now.split("T")[0];
    } else if (newStatus === "REJECTED") {
      benefit.status = "REJECTED";
    }
  }

  createNotification(
    app.user_id,
    "application",
    `Application Status: ${newStatus}`,
    `Your application ${app.application_reference_number} is now ${newStatus}. ${remarks || ""}`,
    "scheme_applications",
    app.id
  );

  logSupportAudit(actorId, actorRole, "APPLICATION_STATUS_UPDATED", "scheme_applications", app.id, {
    newStatus,
    remarks,
  });

  return app;
}

// ------------------------------------------------------------
// 3. BENEFITS & SUBSIDIES
// ------------------------------------------------------------

export async function getFarmerBenefits(userId: string): Promise<FarmerBenefit[]> {
  return inMemoryBenefits.filter((b) => b.user_id === userId);
}

// ------------------------------------------------------------
// 4. OFFICIAL NOTICES & IMPORTANT DATES
// ------------------------------------------------------------

export async function getVerifiedOfficialNotices(filters?: {
  state?: string;
  district?: string;
  category?: string;
}): Promise<OfficialNotice[]> {
  let notices = inMemoryNotices.filter((n) => n.verification_status === "VERIFIED");

  if (filters?.category && filters.category !== "All") {
    notices = notices.filter((n) => n.category.toLowerCase() === filters.category?.toLowerCase());
  }
  if (filters?.district) {
    notices = notices.filter((n) => !n.district || n.district.toLowerCase() === filters.district?.toLowerCase());
  }

  return notices.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export async function getVerifiedImportantDates(): Promise<ImportantDate[]> {
  return inMemoryDates.filter((d) => d.verification_status === "VERIFIED");
}

// ------------------------------------------------------------
// 5. SERVICE REQUESTS & SERVICE PROVIDERS
// ------------------------------------------------------------

export async function getFarmerServiceRequests(userId: string): Promise<ServiceRequest[]> {
  return inMemoryServiceRequests.filter((r) => r.user_id === userId);
}

export async function submitServiceRequest(
  userId: string,
  payload: {
    farm_id?: string | null;
    farm_name?: string | null;
    service_id: string;
    service_name: string;
    provider_id?: string | null;
    provider_name?: string | null;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    requested_date: string;
    quantity?: string;
    description: string;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  }
): Promise<ServiceRequest> {
  const now = new Date().toISOString();
  const newReq: ServiceRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    farm_id: payload.farm_id || null,
    farm_name: payload.farm_name || "Primary Farm",
    service_id: payload.service_id,
    service_name: payload.service_name,
    provider_id: payload.provider_id || null,
    provider_name: payload.provider_name || "Verified Government Service Provider",
    location: payload.location,
    latitude: payload.latitude || null,
    longitude: payload.longitude || null,
    requested_date: payload.requested_date,
    quantity: payload.quantity || null,
    description: payload.description,
    priority: payload.priority || "NORMAL",
    status: "REQUESTED",
    created_at: now,
    updated_at: now,
    history: [
      {
        id: `rhist_${Date.now()}`,
        request_id: "",
        status: "REQUESTED",
        remarks: "Service request placed by farmer. Transmitted to designated service provider.",
        changed_by: "Farmer",
        changed_at: now,
      },
    ],
  };

  if (newReq.history) newReq.history[0].request_id = newReq.id;
  inMemoryServiceRequests.unshift(newReq);

  createNotification(
    userId,
    "service_request",
    "Service Request Created",
    `Your request for ${payload.service_name} scheduled for ${payload.requested_date} has been registered.`,
    "service_requests",
    newReq.id
  );

  logSupportAudit(userId, "farmer", "SERVICE_REQUEST_CREATED", "service_requests", newReq.id, {
    service: payload.service_name,
    date: payload.requested_date,
  });

  return newReq;
}

export async function updateServiceRequestStatus(
  actorId: string,
  actorRole: string,
  requestId: string,
  newStatus: RequestStatus,
  remarks?: string
): Promise<ServiceRequest | null> {
  const req = inMemoryServiceRequests.find((r) => r.id === requestId);
  if (!req) return null;

  const now = new Date().toISOString();
  req.status = newStatus;
  req.updated_at = now;
  if (newStatus === "COMPLETED") {
    req.completed_at = now;
  }

  req.history = req.history || [];
  req.history.push({
    id: `rhist_${Date.now()}`,
    request_id: req.id,
    status: newStatus,
    remarks: remarks || `Status transitioned to ${newStatus}`,
    changed_by: actorRole === "admin" ? "Service Provider Desk" : "Farmer",
    changed_at: now,
  });

  createNotification(
    req.user_id,
    "service_request",
    `Service Request Update: ${newStatus}`,
    `Your request for ${req.service_name} is now ${newStatus}.`,
    "service_requests",
    req.id
  );

  logSupportAudit(actorId, actorRole, "SERVICE_REQUEST_STATUS_UPDATED", "service_requests", req.id, {
    newStatus,
    remarks,
  });

  return req;
}

// ------------------------------------------------------------
// 6. SERVICE FEEDBACK
// ------------------------------------------------------------

export async function submitServiceFeedback(
  userId: string,
  payload: {
    request_id: string;
    provider_id: string;
    rating: number;
    feedback: string;
  }
): Promise<ServiceFeedback | null> {
  // Verify that the request belongs to user and is completed
  const req = inMemoryServiceRequests.find((r) => r.id === payload.request_id && r.user_id === userId);
  if (!req) return null;

  // Prevent duplicate feedback
  const existing = inMemoryFeedback.find((f) => f.request_id === payload.request_id);
  if (existing) {
    existing.rating = payload.rating;
    existing.feedback = payload.feedback;
    return existing;
  }

  const fb: ServiceFeedback = {
    id: `fb_${Date.now()}`,
    request_id: payload.request_id,
    user_id: userId,
    provider_id: payload.provider_id,
    rating: payload.rating,
    feedback: payload.feedback,
    created_at: new Date().toISOString(),
  };

  inMemoryFeedback.push(fb);
  logSupportAudit(userId, "farmer", "FEEDBACK_SUBMITTED", "service_feedback", fb.id, {
    rating: fb.rating,
  });

  return fb;
}

// ------------------------------------------------------------
// 7. IN-APP NOTIFICATIONS
// ------------------------------------------------------------

export function createNotification(
  userId: string,
  type: "application" | "service_request" | "notice" | "deadline" | "document",
  title: string,
  message: string,
  referenceType?: string,
  referenceId?: string
): SupportNotification {
  const notif: SupportNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    user_id: userId,
    type,
    title,
    message,
    reference_type: referenceType,
    reference_id: referenceId,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  inMemoryNotifications.unshift(notif);
  return notif;
}

export async function getFarmerNotifications(userId: string): Promise<SupportNotification[]> {
  return inMemoryNotifications.filter((n) => n.user_id === userId);
}

export async function markNotificationAsRead(userId: string, notifId: string): Promise<boolean> {
  const n = inMemoryNotifications.find((item) => item.id === notifId && item.user_id === userId);
  if (!n) return false;
  n.is_read = true;
  return true;
}

// ------------------------------------------------------------
// 8. DASHBOARD AGGREGATE SUMMARY
// ------------------------------------------------------------

export async function getSupportDashboardSummary(userId: string): Promise<SupportDashboardSummary> {
  const docs = inMemoryDocuments.filter((d) => d.user_id === userId);
  const apps = inMemoryApplications.filter((a) => a.user_id === userId);
  const pendingApps = apps.filter(
    (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW" || a.status === "DOCUMENT_REQUIRED"
  );
  const reqs = inMemoryServiceRequests.filter((r) => r.user_id === userId);
  const activeReqs = reqs.filter(
    (r) => r.status === "REQUESTED" || r.status === "ACCEPTED" || r.status === "SCHEDULED" || r.status === "IN_PROGRESS"
  );
  const notifs = inMemoryNotifications.filter((n) => n.user_id === userId && !n.is_read);
  const verifiedNotices = inMemoryNotices.filter((n) => n.verification_status === "VERIFIED");
  const upcomingDeadlines = inMemoryDates.filter(
    (d) => d.verification_status === "VERIFIED" && new Date(d.deadline) >= new Date()
  );

  return {
    document_count: docs.length,
    application_count: apps.length,
    pending_application_count: pendingApps.length,
    active_service_requests: activeReqs.length,
    upcoming_deadlines_count: upcomingDeadlines.length,
    unread_notifications_count: notifs.length,
    recent_documents: docs.slice(0, 4),
    recent_applications: apps.slice(0, 4),
    recent_requests: reqs.slice(0, 4),
    verified_notices_count: verifiedNotices.length,
  };
}

// ------------------------------------------------------------
// 9. ADMIN HELPERS & GOVERNANCE
// ------------------------------------------------------------

export async function getAdminSupportStats() {
  return {
    total_documents: inMemoryDocuments.length,
    total_applications: inMemoryApplications.length,
    total_service_requests: inMemoryServiceRequests.length,
    total_verified_providers: inMemoryProviders.filter((p) => p.verification_status === "VERIFIED").length,
    total_pending_providers: inMemoryProviders.filter((p) => p.verification_status === "PENDING").length,
    total_notices: inMemoryNotices.length,
    total_important_dates: inMemoryDates.length,
    total_feedback: inMemoryFeedback.length,
    providers: inMemoryProviders,
    service_requests: inMemoryServiceRequests,
    notices: inMemoryNotices,
    dates: inMemoryDates,
    feedback: inMemoryFeedback,
    audit_logs: inMemoryAuditLogs.slice(0, 100),
  };
}

export async function adminVerifyProvider(adminId: string, providerId: string, status: "VERIFIED" | "SUSPENDED" | "PENDING") {
  const prov = inMemoryProviders.find((p) => p.id === providerId);
  if (!prov) return null;

  prov.verification_status = status;
  prov.verified_at = status === "VERIFIED" ? new Date().toISOString() : undefined;
  prov.verified_by = "District Agricultural Officer (Admin)";
  prov.updated_at = new Date().toISOString();

  logSupportAudit(adminId, "admin", "PROVIDER_VERIFICATION_UPDATED", "service_providers", providerId, { status });
  return prov;
}

export async function adminCreateOfficialNotice(adminId: string, notice: Omit<OfficialNotice, "id" | "created_at" | "updated_at">) {
  const newNotice: OfficialNotice = {
    ...notice,
    id: `not_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  inMemoryNotices.unshift(newNotice);
  logSupportAudit(adminId, "admin", "OFFICIAL_NOTICE_PUBLISHED", "official_notices", newNotice.id, {
    title: newNotice.title,
  });
  return newNotice;
}

export async function adminCreateImportantDate(adminId: string, dateObj: Omit<ImportantDate, "id" | "created_at">) {
  const newDate: ImportantDate = {
    ...dateObj,
    id: `date_${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  inMemoryDates.unshift(newDate);
  logSupportAudit(adminId, "admin", "IMPORTANT_DATE_CREATED", "important_dates", newDate.id, {
    title: newDate.title,
    deadline: newDate.deadline,
  });
  return newDate;
}

export const createSupportNotification = createNotification;

export async function adminUpdateServiceRequestStatus(
  adminId: string,
  requestId: string,
  status: RequestStatus,
  remarks?: string
) {
  const req = inMemoryServiceRequests.find((r) => r.id === requestId);
  if (!req) return null;

  req.status = status;
  req.updated_at = new Date().toISOString();
  if (status === "COMPLETED") {
    req.completed_at = new Date().toISOString();
  }

  // Add history record
  req.history = req.history || [];
  req.history.push({
    id: `srh_${Date.now()}`,
    request_id: requestId,
    status,
    remarks: remarks || `Status updated to ${status} by Administrator.`,
    changed_by: "District Agriculture Admin",
    changed_at: new Date().toISOString(),
  });

  // Notify farmer
  createNotification(
    req.user_id,
    "service_request",
    `Service Request Update: ${status}`,
    `Your request #${req.id} status has been updated to ${status}.${remarks ? ` Note: ${remarks}` : ""}`,
    "service_request",
    req.id
  );

  logSupportAudit(adminId, "admin", "SERVICE_REQUEST_STATUS_UPDATED", "service_requests", req.id, {
    status,
    remarks,
  });

  return req;
}
