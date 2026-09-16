import { useState, useEffect } from 'react';
import { getJobs } from './services/jobsApi';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import StatusFilter from './components/StatusFilter';
import StatusCounts from './components/StatusCounts';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
      setError('');
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // Poll every 10 seconds so changes from another tab appear automatically.
    // Polling was chosen because the application is small and does not
    // require real-time infrastructure. WebSockets could provide more
    // immediate updates but would add unnecessary complexity for this assignment.
    const interval = setInterval(loadJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Mini Job Queue Dashboard</h1>
      </header>

      <StatusCounts jobs={jobs} />

      <JobForm onJobCreated={loadJobs} />

      <StatusFilter filter={filter} setFilter={setFilter} />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="status-msg">Loading jobs...</p>
      ) : (
        <JobList jobs={jobs} filter={filter} onJobChanged={loadJobs} />
      )}
    </div>
  );
}

export default App;
