export default function Home() {
  return (
    <main className="page">
      <section className="panel">
        <h1>Jobs API</h1>
        <p>Backend is running. Use the React frontend or call the jobs API.</p>
        <ul>
          <li>POST /jobs</li>
          <li>GET /jobs</li>
          <li>PATCH /jobs/:id/status</li>
          <li>DELETE /jobs/:id</li>
        </ul>
      </section>
    </main>
  );
}
