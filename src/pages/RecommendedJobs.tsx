
import { useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function RecommendedJobs() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!user) return;

      try {
        // For now, we'll fetch jobs that match the user's most recent application
        const { data: interactions } = await supabase
          .from('job_interactions')
          .select('job_id')
          .eq('user_id', user.id)
          .eq('interaction_type', 'apply')
          .order('created_at', { ascending: false })
          .limit(1);

        if (interactions && interactions.length > 0) {
          const lastAppliedJobId = interactions[0].job_id;
          
          // Fetch the last applied job to get its category/industry
          const { data: lastJob } = await supabase
            .from('jobs')
            .select('category, industry')
            .eq('id', lastAppliedJobId)
            .single();

          if (lastJob) {
            // Fetch similar jobs based on category and industry
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

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedJobs");
    if (savedBookmarks) {
      setBookmarkedJobs(JSON.parse(savedBookmarks));
    }
  }, [user]);

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => {
      const newBookmarks = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("bookmarkedJobs", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Recommended Jobs
        </h1>

        {recommendedJobs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedJobs.includes(job.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No recommendations available yet. Try applying to some jobs first!
          </p>
        )}
      </div>
    </div>
  );
}

