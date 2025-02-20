
import { JobSearch } from "@/components/JobSearch";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Job } from "@/types/job";
import { loadJobs } from "@/utils/csv-loader";

export default function Index() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await loadJobs();
      setRecentJobs(jobs.slice(0, 3));
    };
    fetchJobs();

    const savedBookmarks = localStorage.getItem("bookmarkedJobs");
    if (savedBookmarks) {
      setBookmarkedJobs(JSON.parse(savedBookmarks));
    }
  }, []);

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => {
      const newBookmarks = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("bookmarkedJobs", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4 animate-fadeIn">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8 animate-fadeIn">
            Discover opportunities that match your skills and ambitions
          </p>
          <JobSearch />
        </div>
      </section>

      {/* Why Choose SKY-HIRE Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose SKY-HIRE
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 animate-slideIn">
              <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered system matches you with the perfect opportunities
                based on your skills and preferences.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 animate-slideIn">
              <h3 className="text-xl font-semibold mb-4">Quality Jobs</h3>
              <p className="text-gray-600">
                We partner with top companies to bring you the best opportunities in
                your field.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 animate-slideIn">
              <h3 className="text-xl font-semibold mb-4">Easy Apply</h3>
              <p className="text-gray-600">
                Streamlined application process lets you apply to multiple jobs with
                just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recent Job Opportunities
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {recentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedJobs.includes(job.id)}
              />
            ))}
          </div>
          <div className="text-center">
            <Link to="/jobs">
              <Button
                size="lg"
                className="bg-job-primary hover:bg-job-hover transition-colors"
              >
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
