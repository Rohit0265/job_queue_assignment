export default function StatusFilter({ filter, setFilter }) {
  return (
    <div className="card filter-card">
      <label>Filter</label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="ALL">All</option>
        <option value="pending">Pending</option>
        <option value="running">Running</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
    </div>
  );
}
