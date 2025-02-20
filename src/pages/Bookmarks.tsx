
import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { loadJobs } from "@/utils/csv-loader";

export default function Bookmarks() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const savedBookmarks = localStorage.getItem("bookmarkedJobs");
      const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      setBookmarkedJobs(bookmarks);

      const allJobs = await loadJobs();
      setJobs(allJobs.filter((job) => bookmarks.includes(job.id)));
    };
    fetchJobs();
  }, []);

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => {
      const newBookmarks = prev.filter((id) => id !== jobId);
      localStorage.setItem("bookmarkedJobs", JSON.stringify(newBookmarks));
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      return newBookmarks;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Jobs</h1>
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onBookmark={handleBookmark}
                isBookmarked={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">
              You haven't saved any jobs yet
            </h2>
            <p className="text-gray-500 mt-2">
              Bookmark jobs you're interested in to view them later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
