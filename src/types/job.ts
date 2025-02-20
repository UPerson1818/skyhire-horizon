
export interface Job {
  id: string;
  job_title: string;  // Required
  company: string;    // Required
  location?: string;
  salary?: string;
  skills?: string[];
  years_of_experience?: string;
  mode_of_working?: string;
  posting_date?: string;
}

export interface JobFilters {
  role?: string;
  location?: string;
}
