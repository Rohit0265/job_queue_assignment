import JobCard from './JobCard';

export default function JobList({ jobs, filter, onJobChanged }) {
  const filteredJobs = filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter);

  if (jobs.length === 0) {
    return <p>No jobs found.</p>;
  }

  if (filteredJobs.length === 0) {
    return <p>No jobs with this status.</p>;
  }

  return (
    <div className="job-list">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} onJobChanged={onJobChanged} />
      ))}
    </div>
  );
}

