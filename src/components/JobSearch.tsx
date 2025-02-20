
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { loadJobs } from "@/utils/csv-loader";
import { useAuth } from "@/contexts/AuthContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function JobSearch() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [openRole, setOpenRole] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const jobs = await loadJobs();
      const uniqueTitles = Array.from(new Set(jobs.map(job => job.job_title)));
      const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
      setJobTitles(uniqueTitles);
      setLocations(uniqueLocations);
    };
    fetchSuggestions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
    
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
        <Popover open={openRole} onOpenChange={setOpenRole}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                placeholder="Job Role (e.g. Software Engineer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-12 w-full"
                onClick={() => setOpenRole(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[--trigger-width] p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {jobTitles
                    .filter(title => 
                      title.toLowerCase().includes(role.toLowerCase())
                    )
                    .map((title) => (
                      <CommandItem
                        key={title}
                        onSelect={() => {
                          setRole(title);
                          setOpenRole(false);
                        }}
                      >
                        {title}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1">
        <Popover open={openLocation} onOpenChange={setOpenLocation}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                placeholder="Location (e.g. New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 w-full"
                onClick={() => setOpenLocation(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[--trigger-width] p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {locations
                    .filter(loc => 
                      loc.toLowerCase().includes(location.toLowerCase())
                    )
                    .map((loc) => (
                      <CommandItem
                        key={loc}
                        onSelect={() => {
                          setLocation(loc);
                          setOpenLocation(false);
                        }}
                      >
                        {loc}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
