import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import properties from "../data/properties.json";

export default function PropertyPage() {
  const { id } = useParams();

  const property = properties.find((p) => p.id === id);

  // Early return BEFORE hooks that depend on property
  if (!property) {
    return (
      <main style={{ padding: 16 }}>
        <Link to="/">← Back to search</Link>
        <h1>Property not found</h1>
        <p>This property does not exist.</p>
      </main>
    );
  }

  // Hook runs safely because property is guaranteed
  const [mainImage, setMainImage] = useState(property.images[0]);

  return (
    <main style={{ padding: 16 }}>
      <Link to="/">← Back to search</Link>

      <h1>{property.type}</h1>

      <p>
        <strong>£{property.price.toLocaleString()}</strong>,{" "}
        {property.bedrooms} bedrooms
      </p>

      <p>
        <strong>Postcode:</strong> {property.postcode}
      </p>

      <p>
        <strong>Date added:</strong> {property.dateAdded}
      </p>

      {/* Image gallery */}
      <img
        src={mainImage}
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
              border:
                mainImage === img
                  ? "2px solid black"
                  : "1px solid #ccc",
            }}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      {/* Tabs */}
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
            src="https://www.google.com/maps?q=London&output=embed"
          />
        </TabPanel>
      </Tabs>
    </main>
  );
}
