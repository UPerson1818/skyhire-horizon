
export interface Job {
  id: string;
  job_title: string;  // Required
  company: string;    // Required
  company_name: string;  // Added for compatibility
  location?: string;
  salary?: string;
  salary_range?: string;   // Added for compatibility
  description?: string;    // Added for JobCard
  application_url?: string; // Added for JobCard
  skills?: string[];
  years_of_experience?: string;
  mode_of_working?: string;
  posting_date?: string;
}

export interface JobFilters {
  role?: string;
  location?: string;
}
