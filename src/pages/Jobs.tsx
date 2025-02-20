
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { Job } from "@/types/job";
import { loadJobs, filterJobs } from "@/utils/csv-loader";

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const jobsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      const allJobs = await loadJobs();
      setJobs(allJobs);
      
      const role = searchParams.get("role");
      const location = searchParams.get("location");
      
      if (role || location) {
        const filtered = filterJobs(allJobs, { role, location });
        setFilteredJobs(filtered);
      } else {
        setFilteredJobs(allJobs);
      }
    };
    fetchJobs();

    const savedBookmarks = localStorage.getItem("bookmarkedJobs");
    if (savedBookmarks) {
      setBookmarkedJobs(JSON.parse(savedBookmarks));
    }
  }, [searchParams]);

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => {
      const newBookmarks = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("bookmarkedJobs", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {searchParams.get("role") || searchParams.get("location")
            ? "Search Results"
            : "All Jobs"}
        </h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {currentJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedJobs.includes(job.id)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
