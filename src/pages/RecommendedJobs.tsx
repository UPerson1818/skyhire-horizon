
import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function RecommendedJobs() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        if (!user) {
          setRecommendedJobs([]);
          setLoading(false);
          return;
        }

        // Call the get_recommended_jobs function
        const { data, error } = await supabase.rpc('get_recommended_jobs', {
          p_user_id: user.id
        });

        if (error) throw error;

        setRecommendedJobs(data || []);
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch recommended jobs. Please try again.",
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
                onBookmark={() => {}}
                isBookmarked={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {user ? (
              <p className="text-gray-600 mb-4">
                No recommendations available yet. Complete your profile or interact with more jobs to get personalized recommendations!
              </p>
            ) : (
              <p className="text-gray-600 mb-4">
                Sign in to get personalized job recommendations!
              </p>
            )}
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
