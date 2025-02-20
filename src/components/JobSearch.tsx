
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function JobSearch() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (role || location) {
      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (location) params.append("location", location);
      navigate(`/jobs?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 w-full max-w-3xl mx-auto"
    >
      <div className="flex-1">
        <Input
          placeholder="Job Role (e.g. Software Engineer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-12"
        />
      </div>
      <div className="flex-1">
        <Input
          placeholder="Location (e.g. New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-12"
        />
      </div>
      <Button
        type="submit"
        className="h-12 px-8 bg-job-primary hover:bg-job-hover transition-colors"
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
