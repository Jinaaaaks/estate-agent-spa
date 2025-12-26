import { Link, useParams } from "react-router-dom";
import properties from "../data/properties.json";

export default function PropertyPage() {
  const { id } = useParams();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <main style={{ padding: 16 }}>
        <Link to="/">← Back to search</Link>
        <h1>Property not found</h1>
        <p>This property does not exist.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 16 }}>
      <Link to="/">← Back to search</Link>

      <h1>{property.type}</h1>

      <p>
        <strong>£{property.price.toLocaleString()}</strong>, {property.bedrooms} bedrooms
      </p>

      <p>
        <strong>Postcode:</strong> {property.postcode}
      </p>

      <p>
        <strong>Date added:</strong> {property.dateAdded}
      </p>

      <h2>Short description</h2>
      <p>{property.shortDescription}</p>

      <h2>Long description</h2>
      <p>{property.longDescription}</p>
    </main>
  );
}
