import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import properties from "../data/properties.json";
import { filterProperties } from "../utils/filterProperties";

export default function SearchPage() {
  // This object holds what the user has typed/selected in the search form
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    dateAdded: "",
    postcode: ""
  });

  // Helper to update one field in filters
  function handleChange(e) {
    const { name, value } = e.target;

    // Update only the field that changed, keep the rest the same
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Compute the filtered list whenever filters change
  const filtered = useMemo(() => {
    return filterProperties(properties, filters);
  }, [filters]);

  function clearFilters() {
    setFilters({
      type: "",
      minPrice: "",
      maxPrice: "",
      minBedrooms: "",
      dateAdded: "",
      postcode: ""
    });
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Estate Agent</h1>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16
        }}
      >
        <h2 style={{ marginTop: 0 }}>Search</h2>

        <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
          <label>
            Type
            <select name="type" value={filters.type} onChange={handleChange}>
              <option value="">Any</option>
              <option value="House">House</option>
              <option value="Flat">Flat</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </label>

          <label>
            Min price
            <input
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="e.g. 250000"
              type="number"
            />
          </label>

          <label>
            Max price
            <input
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="e.g. 600000"
              type="number"
            />
          </label>

          <label>
            Min bedrooms
            <input
              name="minBedrooms"
              value={filters.minBedrooms}
              onChange={handleChange}
              placeholder="e.g. 2"
              type="number"
            />
          </label>

          <label>
            Date added after
            <input
              name="dateAdded"
              value={filters.dateAdded}
              onChange={handleChange}
              type="date"
            />
          </label>

          <label>
            Postcode area (first part, e.g. NW1)
            <input
              name="postcode"
              value={filters.postcode}
              onChange={handleChange}
              placeholder="e.g. NW1"
            />
          </label>

          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>

        <p style={{ marginBottom: 0 }}>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{properties.length}</strong>
        </p>
      </section>

      <section>
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((p) => (
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

              <p style={{ margin: "0 0 6px" }}>
                <strong>{p.postcode}</strong>
              </p>

              <p style={{ margin: "0 0 10px" }}>{p.shortDescription}</p>

              <Link to={`/property/${p.id}`}>View details</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
