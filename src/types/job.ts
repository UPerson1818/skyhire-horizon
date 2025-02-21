
export interface Job {
  id: string;
  job_title: string;
  company_name: string;    // Changed from company to company_name
  location?: string;
  salary_range?: string;   // Changed from salary to salary_range
  description?: string;    // Added description
  application_url?: string; // Added application_url
  skills?: string[];
  years_of_experience?: string;
  mode_of_working?: string;
  posting_date?: string;
}

export interface JobFilters {
  role?: string;
  location?: string;
}
