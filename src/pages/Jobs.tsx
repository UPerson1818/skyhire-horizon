
import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { JobCard } from "@/components/JobCard";
import { JobSearch } from "@/components/JobSearch";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  // Fetch jobs based on search params
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const role = searchParams.get("role");
        const location = searchParams.get("location");

        let query = supabase.from("jobs").select("*");

        if (role) {
          query = query.ilike("job_title", `%${role}%`);
        }
        if (location) {
          query = query.ilike("location", `%${location}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams, toast]);

  // Fetch bookmarked jobs
  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      try {
        const { data, error } = await supabase
          .from("job_interactions")
          .select("job_id")
          .eq("user_id", user.uid)
          .eq("interaction_type", "bookmark");

        if (error) throw error;

        setBookmarkedJobs(data.map((bookmark) => bookmark.job_id));
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleBookmark = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to bookmark jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      const isBookmarked = bookmarkedJobs.includes(jobId);

      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from("job_interactions")
          .delete()
          .eq("user_id", user.uid)
          .eq("job_id", jobId)
          .eq("interaction_type", "bookmark");

        setBookmarkedJobs(bookmarkedJobs.filter((id) => id !== jobId));
      } else {
        // Add bookmark
        await supabase.from("job_interactions").insert({
          user_id: user.uid,
          job_id: jobId,
          interaction_type: "bookmark",
          created_at: new Date().toISOString(),
        });

        setBookmarkedJobs([...bookmarkedJobs, jobId]);
      }

      toast({
        title: isBookmarked ? "Bookmark removed" : "Job bookmarked",
        description: isBookmarked
          ? "This job has been removed from your bookmarks"
          : "This job has been added to your bookmarks",
      });
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <JobSearch />
        <div className="mt-8 text-center">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <JobSearch />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onBookmark={handleBookmark}
            isBookmarked={bookmarkedJobs.includes(job.id)}
          />
        ))}
      </div>
      {jobs.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No jobs found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
