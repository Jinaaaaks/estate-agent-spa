import "../styles/SearchPage.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import properties from "../data/properties.json";
import { filterProperties } from "../utils/filterProperties";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { useFavourites } from "../context/FavouritesContext";

export default function SearchPage() {
  // This object holds what the user has typed/selected in the search form
  const [filters, setFilters] = useState({
    type: "",
    priceRange: [0, 1000000],
    bedroomsMin: 0,
    dateAdded: null,
    postcode: ""
   });

   const { favouriteIds, addFavourite, removeFavourite, clearFavourites } = useFavourites();


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
    const normalizedFilters = {
        type: filters.type,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        minBedrooms: filters.bedroomsMin,
        dateAdded: filters.dateAdded
            ? filters.dateAdded.toISOString().slice(0, 10)
            : "",
        postcode: filters.postcode
    };

    return filterProperties(properties, normalizedFilters);
  }, [filters]);


  function clearFilters() {
    setFilters({
        type: "",
        priceRange: [0, 1000000],
        bedroomsMin: 0,
        dateAdded: null,
        postcode: ""
    });
  } 

  function handleDragStartProperty(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDropAddToFavourites(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) addFavourite(id);
  }

  const favouriteProperties = useMemo(() => {
    return favouriteIds
        .map((id) => properties.find((p) => p.id === id))
        .filter(Boolean);
  }, [favouriteIds]);



  return (
    <main className="page">
        <div className="header">
            <h1 className="title">Estate Agent</h1>
            <p className="subtle"> Showing <strong>{filtered.length}</strong> of <strong>{properties.length}</strong></p>
        </div>
      

      <section className="card searchCard">
        <h2 className="cardTitle">Search</h2>

        <div className="formGrid">
            <div className="field">
                <label>Type</label>
                <select name="type" value={filters.type} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="House">House</option>
                    <option value="Flat">Flat</option>
                    <option value="Bungalow">Bungalow</option>
                </select>
            </div>
            <div className="field">
                <label>Price range (£)</label>
                <div className="sliderWrap">
                    <Slider
                        range
                        min={0}
                        max={1000000}
                        step={5000}
                        value={filters.priceRange}
                        onChange={(value) =>
                            setFilters((prev) => ({
                            ...prev,
                            priceRange: value
                            }))
                        }
                    />
                </div>
                <p className="inlineHelp">
                    £{filters.priceRange[0].toLocaleString()} to £{filters.priceRange[1].toLocaleString()}
                </p>
            </div>
            <div className="field">
                <label>Minimum bedrooms</label>
                <div className="sliderWrap">
                    <Slider
                        min={0}
                        max={6}
                        step={1}
                        value={filters.bedroomsMin}
                        onChange={(value) =>
                            setFilters((prev) => ({
                            ...prev,
                            bedroomsMin: value
                            }))
                        }
                    />
                    <p className="inlineHelp">{filters.bedroomsMin}+</p>
                </div>
            </div>
            <div className="field">
                <label>Date added after</label>
                <DatePicker
                    className="input"
                    selected={filters.dateAdded}
                    onChange={(date) => setFilters((prev) => ({ ...prev, dateAdded: date }))}
                    placeholderText="Select a date"
                    dateFormat="yyyy-MM-dd"
                    isClearable
                />
            </div>

            <div className="field">
                <label>Postcode Area</label>
                <input
                    className="input"
                    name="postcode"
                    value={filters.postcode}
                    onChange={handleChange}
                    placeholder="e.g. NW1"
                />
            </div>
            <div className="btnRow" style={{gridColumn:"1 / -1", marginTop: 8}}>
                <button type="button" className="btn btnGhost" onClick={clearFilters}>Clear filters</button>
            </div>

        </div>

      </section>

      <section className="mainGrid">
        
        {/* Results */}
        <div>
            <div style={{ display: "grid", gap: 12 }}>
            {filtered.map((p) => (
                <article
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStartProperty(e, p.id)}
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

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Link to={`/property/${p.id}`}>View details</Link>

                    <button
                    type="button"
                    onClick={() => addFavourite(p.id)}
                    disabled={favouriteIds.includes(p.id)}
                    title={favouriteIds.includes(p.id) ? "Already in favourites" : "Add to favourites"}
                    >
                    {favouriteIds.includes(p.id) ? "★ Favourited" : "☆ Favourite"}
                    </button>
                </div>
                </article>
            ))}
            </div>
        </div>

        {/* Favourites panel */}
        <aside
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropAddToFavourites}
            style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            position: "sticky",
            top: 12
            }}
        >
            <h2 style={{ marginTop: 0 }}>Favourites</h2>
            <p style={{ marginTop: 0 }}>
                Drag a property here or press ☆ Favourite.
            </p>


            <button type="button" onClick={clearFavourites} disabled={favouriteIds.length === 0}>
            Clear all
            </button>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    if (id) removeFavourite(id);
                }}
                style={{
                    marginTop: 12,
                    padding: 12,
                    border: "2px dashed #cc0000",
                    borderRadius: 8,
                    textAlign: "center",
                    fontWeight: "bold"
                }}
                >
                Drop here to remove
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {favouriteProperties.length === 0 ? (
                <p style={{ margin: 0 }}>No favourites yet.</p>
            ) : (
                favouriteProperties.map((p) => (
                <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                    style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 10,
                    cursor: "grab"
                    }}
                >
                    <strong>{p.type}</strong>
                    <div>£{p.price.toLocaleString()}</div>
                    <div>{p.postcode}</div>

                    <button
                    type="button"
                    onClick={() => removeFavourite(p.id)}
                    style={{ marginTop: 8 }}
                    >
                    Remove
                    </button>
                </div>
                ))
            )}
            </div>
        </aside>
        </section>

    </main>
  );
}
