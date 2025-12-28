import SearchPage from "../styles/SearchPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import properties from "../data/properties.json";

export default function PropertyPage() {
  const { id } = useParams();

  const property = useMemo(() => properties.find((p) => p.id === id), [id]);

  const [mainImage, setMainImage] = useState("");

  // Keep main image synced when opening a different property
  useEffect(() => {
    if (property?.images?.length) {
      setMainImage(property.images[0]);
    } else {
      setMainImage("");
    }
  }, [property]);

  if (!property) {
    return (
      <main className="page">
        <Link className="link" to="/">
          ← Back to search
        </Link>

        <section className="card" style={{ marginTop: 12 }}>
          <h1 className="title" style={{ marginBottom: 6 }}>
            Property not found
          </h1>
          <p className="subtle">This property does not exist.</p>
        </section>
      </main>
    );
  }

  const safeMainImage = mainImage || property.images?.[0] || "";

  return (
    <main className="page">
      <div className="header">
        <div>
          <Link className="link" to="/">
            ← Back to search
          </Link>
          <h1 className="title" style={{ marginTop: 10 }}>
            {property.type}
          </h1>
        </div>

        <p className="subtle" style={{ textAlign: "right" }}>
          <strong>£{property.price.toLocaleString()}</strong>
          <br />
          {property.bedrooms} bedrooms
        </p>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="metaRow">
          <span className="badge">Postcode: {property.postcode}</span>
          <span className="badge">Date added: {property.dateAdded}</span>
          <span className="badge">Bedrooms: {property.bedrooms}</span>
        </div>

        {/* Gallery */}
        <div className="gallery">
          <div className="mainImg">
            {safeMainImage ? (
              <img src={safeMainImage} alt="Property" />
            ) : (
              <div className="subtle" style={{ padding: 12 }}>
                No image available.
              </div>
            )}
          </div>

          {property.images?.length > 0 && (
            <div className="thumbs">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    safeMainImage === img ? "thumbBtn thumbActive" : "thumbBtn"
                  }
                  onClick={() => setMainImage(img)}
                  title="View image"
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor Plan</Tab>
            <Tab>Map</Tab>
          </TabList>

          <TabPanel>
            <p className="desc" style={{ marginTop: 12 }}>
              {property.longDescription}
            </p>
          </TabPanel>

          <TabPanel>
            {property.floorPlan ? (
              <img
                src={property.floorPlan}
                alt="Floor plan"
                style={{
                  maxWidth: "100%",
                  border: "1px solid #e6e6e6",
                  borderRadius: 12,
                  marginTop: 12,
                }}
              />
            ) : (
              <p className="subtle" style={{ marginTop: 12 }}>
                No floor plan available.
              </p>
            )}
          </TabPanel>

          <TabPanel>
            <div style={{ marginTop: 12 }}>
              <iframe
                title="map"
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: 12 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  property.postcode
                )}&output=embed`}
              />
            </div>
          </TabPanel>
        </Tabs>
      </section>
    </main>
  );
}
