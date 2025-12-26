import { Link } from "react-router-dom";
import properties from "../data/properties.json";

export default function SearchPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Estate Agent</h1>
      <p>Showing all properties (search UI coming next).</p>

      <div style={{ display: "grid", gap: 12 }}>
        {properties.map((p) => (
          <article
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12
            }}
          >
            <h2 style={{ margin: "0 0 6px" }}>{p.type}</h2>

            <p style={{ margin: "0 0 6px" }}>
              <strong>£{p.price.toLocaleString()}</strong>, {p.bedrooms} bedrooms
            </p>

            <p style={{ margin: "0 0 10px" }}>{p.shortDescription}</p>

            <Link to={`/property/${p.id}`}>View details</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
