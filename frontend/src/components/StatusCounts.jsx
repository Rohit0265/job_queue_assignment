export default function StatusCounts({ jobs }) {
  const counts = {
    ALL: jobs.length,
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
  };

  jobs.forEach((job) => {
    if (counts[job.status] !== undefined) {
      counts[job.status]++;
    }
  });

  return (
    <div className="card counts-card">
      <div className="count-item"><span>All</span> <strong>{counts.ALL}</strong></div>
      <div className="count-item"><span>Pending</span> <strong>{counts.pending}</strong></div>
      <div className="count-item"><span>Running</span> <strong>{counts.running}</strong></div>
      <div className="count-item"><span>Completed</span> <strong>{counts.completed}</strong></div>
      <div className="count-item"><span>Failed</span> <strong>{counts.failed}</strong></div>
    </div>
  );
}
