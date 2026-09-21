// ============================================================
// KRISHIMITRA AI — SUPPORT HUB TYPES & INTERFACES
// Farmer Services, Documents, Applications, Govt Services & Tracking
// ============================================================

export type DocumentType =
  | "soil_report"
  | "land_record_rtc"
  | "crop_record"
  | "insurance_policy"
  | "scheme_doc"
  | "receipt_invoice"
  | "certificate"
  | "other";

export interface FarmerDocument {
  id: string;
  user_id: string;
  farm_id?: string | null;
  document_type: DocumentType;
  document_name: string;
  file_path: string;
  file_size: number; // bytes
  mime_type: string;
  uploaded_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "DOCUMENT_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"
  | "COMPLETED";

export interface SchemeApplicationHistory {
  id: string;
  application_id: string;
  status: ApplicationStatus;
  remarks?: string | null;
  changed_by: string;
  changed_at: string;
}

export interface SchemeApplication {
  id: string;
  user_id: string;
  scheme_id: string;
  scheme_name: string;
  farm_id?: string | null;
  application_reference_number: string;
  submission_date: string;
  status: ApplicationStatus;
  last_updated: string;
  remarks?: string | null;
  required_action?: string | null;
  documents?: string[];
  history?: SchemeApplicationHistory[];
  created_at: string;
  updated_at: string;
}

export type VerificationStatus = "PENDING" | "VERIFIED" | "SUSPENDED" | "ARCHIVED" | "UNVERIFIED";
export type ProviderVerificationStatus = VerificationStatus;

export interface OfficialNotice {
  id: string;
  title: string;
  title_kn?: string;
  description: string;
  description_kn?: string;
  category: "Advisory" | "Announcement" | "Weather" | "Scheme" | "CropNotice" | "General";
  state: string;
  district?: string | null;
  published_at: string;
  valid_from: string;
  valid_until: string;
  source_name: string;
  source_url: string;
  verification_status: "VERIFIED" | "UNVERIFIED" | "ARCHIVED";
  verified_at?: string | null;
  verified_by?: string | null;
  created_at: string;
  updated_at: string;
}

export type BenefitStatus = "APPLIED" | "UNDER_PROCESS" | "APPROVED" | "RECEIVED" | "REJECTED";

export interface FarmerBenefit {
  id: string;
  user_id: string;
  scheme_id: string;
  scheme_name: string;
  application_id?: string | null;
  benefit_type: string;
  expected_amount?: number | null;
  approved_amount?: number | null;
  status: BenefitStatus;
  approval_date?: string | null;
  benefit_date?: string | null;
  source: string;
  updated_at: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  title_kn?: string;
  description: string;
  description_kn?: string;
  category: "SchemeDeadline" | "InsuranceDeadline" | "ApplicationWindow" | "CropDeadline" | "Camp";
  state: string;
  district?: string | null;
  start_date: string;
  deadline: string;
  source_name: string;
  source_url: string;
  verification_status: "VERIFIED" | "UNVERIFIED";
  verified_at?: string | null;
  created_at: string;
}

export type ServiceCategory =
  | "Agriculture Department"
  | "Agriculture Office"
  | "Soil Testing"
  | "Seed/Fertilizer Services"
  | "Agricultural Extension"
  | "Insurance Services"
  | "APMC-related services"
  | "Farm Machinery"
  | "Transport"
  | "Storage"
  | "Irrigation Service"
  | "Other";

export interface SupportService {
  id: string;
  name: string;
  name_kn?: string;
  category: ServiceCategory;
  description: string;
  description_kn?: string;
  is_active: boolean;
}

export interface ServiceProvider {
  id: string;
  organization_name: string;
  provider_type: "Government" | "FPO" | "PrivateVerified" | "University" | "KVK";
  district: string;
  taluk: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  verification_status: VerificationStatus;
  verified_at?: string | null;
  verified_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderServiceItem {
  id: string;
  provider_id: string;
  service_id: string;
  service_name: string;
  category: ServiceCategory;
  rate?: number | null;
  rate_unit?: string | null;
  availability_status: "Available" | "Limited" | "Unavailable";
}

export type RequestStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type ServiceRequestStatus = RequestStatus;

export interface ServiceRequestHistory {
  id: string;
  request_id: string;
  status: RequestStatus;
  remarks?: string | null;
  changed_by: string;
  changed_at: string;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
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
  quantity?: string | null;
  description: string;
  attachment_url?: string | null;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  history?: ServiceRequestHistory[];
}

export interface ServiceFeedback {
  id: string;
  request_id: string;
  user_id: string;
  provider_id: string;
  rating: number; // 1-5
  feedback: string;
  created_at: string;
}

export interface SupportNotification {
  id: string;
  user_id: string;
  type: "application" | "service_request" | "notice" | "deadline" | "document";
  title: string;
  message: string;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportAuditLog {
  id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SupportDashboardSummary {
  document_count: number;
  application_count: number;
  pending_application_count: number;
  active_service_requests: number;
  upcoming_deadlines_count: number;
  unread_notifications_count: number;
  recent_documents: FarmerDocument[];
  recent_applications: SchemeApplication[];
  recent_requests: ServiceRequest[];
  verified_notices_count: number;
}
