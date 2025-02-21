
import { BookmarkIcon } from "lucide-react";
import { Job } from "@/types/job";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase"; // Make sure this is imported

interface JobCardProps {
  job: Job;
  onBookmark: (jobId: string) => void;
  isBookmarked: boolean;
}

export function JobCard({ job, onBookmark, isBookmarked }: JobCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      // Record the job application
      const { error } = await supabase
        .from('job_interactions')
        .insert({
          user_id: user.id,
          job_id: job.id,
          interaction_type: 'apply',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your job application has been recorded",
      });

      // Redirect to external job application URL
      window.location.href = job.application_url || "https://www.linkedin.com/jobs";
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      console.error("Application error:", error);
    }
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
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
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

