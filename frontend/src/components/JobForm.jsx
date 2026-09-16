import { useState } from 'react';
import { createJob } from '../services/jobsApi';

export default function JobForm({ onJobCreated }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !type) return;

    setCreating(true);
    setError('');
    
    try {
      await createJob({ title, type });
      setTitle('');
      setType('');
      onJobCreated();
    } catch (err) {
      setError(err.message || 'Failed to create job.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card">
      <h3>Create New Job</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={creating}
            placeholder="e.g. Generate Report"
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={creating}
            placeholder="e.g. report"
            required
          />
        </div>
        <button type="submit" disabled={creating || !title || !type}>
          {creating ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}

