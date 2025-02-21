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

        if (allJobs && allJobs.length > 0) {
          setRecommendedJobs(allJobs); // For now, just show all jobs
          setLoading(false);
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
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Loading recommendations...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Recommended Jobs
          </h1>
          <Button 
            onClick={handleViewAllJobs}
            variant="default"
          >
            View All Jobs
          </Button>
        </div>

        {recommendedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              variant="default"
            >
              Browse All Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
