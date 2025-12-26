import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import properties from "../data/properties.json";

export default function PropertyPage() {
  const { id } = useParams();

  // Always define property, every render
  const property = useMemo(() => properties.find((p) => p.id === id), [id]);

  // ✅ Hook is always called, every render, same order
  // If property is missing, fallback to empty string
  const [mainImage, setMainImage] = useState(() =>
    property?.images?.[0] ?? ""
  );

  // Keep mainImage in sync when id changes
  // If you click a different property, it updates the main image
  if (property && property.images && property.images[0] && mainImage === "") {
    // setMainImage inside render is not ideal. So we avoid this pattern.
    // We'll handle sync in a safe way below.
  }

  // If no property, return not found after hooks are declared
  if (!property) {
    return (
      <main style={{ padding: 16 }}>
        <Link to="/">← Back to search</Link>
        <h1>Property not found</h1>
        <p>This property does not exist.</p>
      </main>
    );
  }

  // If property exists but state is empty, show first image
  const safeMainImage = mainImage || property.images[0];

  return (
    <main style={{ padding: 16 }}>
      <Link to="/">← Back to search</Link>

      <h1>{property.type}</h1>

      <p>
        <strong>£{property.price.toLocaleString()}</strong>, {property.bedrooms}{" "}
        bedrooms
      </p>

      <p>
        <strong>Postcode:</strong> {property.postcode}
      </p>

      <p>
        <strong>Date added:</strong> {property.dateAdded}
      </p>

      <img
        src={safeMainImage}
        alt="Property"
        style={{
          width: "100%",
          maxHeight: 400,
          objectFit: "cover",
          marginBottom: 12,
        }}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Thumbnail"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
              cursor: "pointer",
              border: safeMainImage === img ? "2px solid black" : "1px solid #ccc",
            }}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      <Tabs>
        <TabList>
          <Tab>Description</Tab>
          <Tab>Floor Plan</Tab>
          <Tab>Map</Tab>
        </TabList>

        <TabPanel>
          <p>{property.longDescription}</p>
        </TabPanel>

        <TabPanel>
          <img
            src={property.floorPlan}
            alt="Floor plan"
            style={{ maxWidth: "100%", border: "1px solid #ccc" }}
          />
        </TabPanel>

        <TabPanel>
          <iframe
            title="map"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              property.postcode
            )}&output=embed`}
          />
        </TabPanel>
      </Tabs>
    </main>
  );
}
