
import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RecommendedJobs() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!user) return;

      try {
        // First, check if the jobs table exists by trying to fetch all jobs
        const { data: allJobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .limit(5);

        if (jobsError) {
          console.error("Error fetching jobs:", jobsError);
          toast({
            title: "Database not set up",
            description: "Please set up the jobs database first.",
            variant: "destructive",
          });
          return;
        }

        // If we have jobs, try to get recommendations
        if (allJobs && allJobs.length > 0) {
          const { data: interactions } = await supabase
            .from('job_interactions')
            .select('job_id')
            .eq('user_id', user.uid)
            .eq('interaction_type', 'apply')
            .order('created_at', { ascending: false })
            .limit(1);

          if (interactions && interactions.length > 0) {
            const lastAppliedJobId = interactions[0].job_id;
            
            const { data: lastJob } = await supabase
              .from('jobs')
              .select('category, industry')
              .eq('id', lastAppliedJobId)
              .single();

            if (lastJob) {
              const { data: similarJobs } = await supabase
                .from('jobs')
                .select('*')
                .eq('category', lastJob.category)
                .eq('industry', lastJob.industry)
                .neq('id', lastAppliedJobId)
                .limit(10);

              if (similarJobs) {
                setRecommendedJobs(similarJobs);
              }
            }
          } else {
            // If no applications yet, just show some random jobs
            setRecommendedJobs(allJobs);
          }
        }
      } catch (error) {
        console.error("Error fetching recommended jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load recommended jobs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [user, toast]);

  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Loading recommendations...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Recommended Jobs
          </h1>
          <Button 
            onClick={handleViewAllJobs}
            className="bg-job-primary hover:bg-job-hover"
          >
            View All Jobs
          </Button>
        </div>

        {recommendedJobs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onBookmark={() => {}} // Will be implemented later
                isBookmarked={bookmarkedJobs.includes(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No recommendations available yet. Check out all available jobs!
            </p>
            <Button 
              onClick={handleViewAllJobs}
              className="bg-job-primary hover:bg-job-hover"
            >
              Browse All Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
