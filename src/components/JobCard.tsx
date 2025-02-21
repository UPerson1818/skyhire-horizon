
import { BookmarkIcon } from "lucide-react";
import { Job } from "@/types/job";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobCardProps {
  job: Job;
  onBookmark: (jobId: string) => void;
  isBookmarked: boolean;
}

export function JobCard({ job, onBookmark, isBookmarked }: JobCardProps) {
  const handleApply = () => {
    // Redirect to external job application URL
    window.location.href = job.application_url || "https://www.linkedin.com/jobs";
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{job.job_title}</CardTitle>
            <CardDescription>{job.company_name}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBookmark(job.id)}
            className={isBookmarked ? "text-job-primary" : "text-gray-500"}
          >
            <BookmarkIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{job.location}</p>
          <p className="text-sm text-gray-600">{job.salary_range}</p>
          <p className="text-sm">{job.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-job-primary hover:bg-job-hover"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
