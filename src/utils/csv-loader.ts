
import Papa from 'papaparse';

export async function loadJobs() {
  const response = await fetch('/jobs.csv');
  const csv = await response.text();
  
  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => {
      if (value.includes('[') && value.includes(']')) {
        return JSON.parse(value);
      }
      return value;
    }
  });

  return data.map((job: any, index: number) => ({
    ...job,
    id: `job-${index + 1}`,
    skills: Array.isArray(job.skills) ? job.skills : job.skills.split(',').map((s: string) => s.trim())
  }));
}

export function filterJobs(jobs: any[], filters: { role?: string; location?: string }) {
  return jobs.filter(job => {
    const matchesRole = !filters.role || 
      job.job_title.toLowerCase().includes(filters.role.toLowerCase());
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesRole && matchesLocation;
  });
}
