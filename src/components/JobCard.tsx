
import { useState } from "react";
import { Button } from "./ui/button";
import { BookmarkIcon } from "lucide-react";
import { Job } from "@/types/job";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: Job;
  onBookmark: (jobId: string) => void;
  isBookmarked: boolean;
}

export function JobCard({ job, onBookmark, isBookmarked }: JobCardProps) {
  const { toast } = useToast();
  
  const handleBookmark = () => {
    onBookmark(job.id);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${job.job_title} at ${job.company}`,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-slideIn">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.job_title}
          </h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? "text-job-primary bg-blue-50"
              : "text-gray-400 hover:text-job-primary hover:bg-blue-50"
          }`}
        >
          <BookmarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <span className="text-sm">📍 {job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="text-sm">💰 {job.salary}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="text-sm">🏢 {job.mode_of_working}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-job-primary rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted: {new Date(job.posting_date).toLocaleDateString()}
        </span>
        <Button className="bg-job-primary hover:bg-job-hover transition-colors">
          Apply Now
        </Button>
      </div>
    </div>
  );
}
