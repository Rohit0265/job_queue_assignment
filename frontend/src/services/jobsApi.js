const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function readResponse(res) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
}

export async function getJobs() {
  const res = await fetch(`${API_URL}/jobs`);
  return readResponse(res);
}

export async function createJob(data) {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return readResponse(res);
}

export async function updateJobStatus(id, status, version) {
  const res = await fetch(`${API_URL}/jobs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, version }),
  });
  return readResponse(res);
}

export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
  });
  return readResponse(res);
}
