
export interface Job {
  id: string;
  job_title: string;
  company_name: string;
  company?: string;
  location?: string;
  salary?: string;
  salary_range?: string;
  description?: string;
  application_url?: string;
  skills?: string[];
  years_of_experience?: string;
  mode_of_working?: string;
  posting_date?: string;
  category?: string;    // Added for recommendations
  industry?: string;    // Added for recommendations
}

export interface JobFilters {
  role?: string;
  location?: string;
}

export interface JobInteraction {
  user_id: string;
  job_id: string;
  interaction_type: 'apply' | 'bookmark';
  created_at: string;
}
