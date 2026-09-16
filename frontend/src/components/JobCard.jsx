import { useState } from 'react';
import { updateJobStatus, deleteJob } from '../services/jobsApi';

export default function JobCard({ job, onJobChanged }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async (status) => {
    setLoading(true);
    setError('');
    try {
      await updateJobStatus(job.id, status, job.version);
      onJobChanged();
    } catch (err) {
      if (err.message.includes('modified by another user')) {
        setError('This job was updated by another user. Please refresh the jobs.');
        onJobChanged();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteJob(job.id);
      onJobChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card job-card">
      <h4>{job.title}</h4>
      <p>Type: {job.type}</p>
      <p>Status: <strong>{job.status}</strong></p>
      <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
      {error && <div className="error">{error}</div>}
      <div className="actions">
        {job.status === 'pending' && (
          <>
            <button onClick={() => handleStatusChange('running')} disabled={loading}>Run</button>
            <button onClick={() => handleStatusChange('failed')} disabled={loading}>Fail</button>
          </>
        )}
        {job.status === 'running' && (
          <>
            <button onClick={() => handleStatusChange('completed')} disabled={loading}>Complete</button>
            <button onClick={() => handleStatusChange('failed')} disabled={loading}>Fail</button>
          </>
        )}
        <button onClick={handleDelete} disabled={loading} className="danger">Delete</button>
      </div>
    </div>
  );
}
