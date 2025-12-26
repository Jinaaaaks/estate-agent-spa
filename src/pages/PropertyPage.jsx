import { Link, useParams } from "react-router-dom";
import properties from "../data/properties.json";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";


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

      <Tabs>
        <TabList>
            <Tab>Description</Tab>
            <Tab>Floor Plan</Tab>
            <Tab>Map</Tab>
        </TabList>

        <TabPanel>
            <h2>Description</h2>
            <p>{property.longDescription}</p>
        </TabPanel>

        <TabPanel>
            <h2>Floor Plan</h2>
            <img
            src={property.floorPlan}
            alt="Floor plan"
            style={{ maxWidth: "100%", border: "1px solid #ccc" }}
            />
        </TabPanel>

        <TabPanel>
            <h2>Location</h2>
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
