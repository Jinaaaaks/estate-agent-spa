import { Link, useParams } from "react-router-dom";

export default function PropertyPage() {
  const { id } = useParams();

  return (
    <main style={{ padding: 16 }}>
      <Link to="/">← Back to Search</Link>
      <h1>Property {id}</h1>
      <p>Property details page coming next.</p>
    </main>
  );
}
