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
  // The object holds what the user has typed/selected in the search form
  const [filters, setFilters] = useState({
    type: "",
    priceRange: [0, 1000000],
    bedroomsMin: 0,
    dateAdded: null,
    postcode: ""
   });

   const { favouriteIds, addFavourite, removeFavourite, clearFavourites } = useFavourites();


  // Helps to update one field in filters
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
    e.dataTransfer.setData("text/plain", String(id));
    e.dataTransfer.effectAllowed= "move";
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
            <div className="resultsGrid">
            {filtered.map((p) => (
                <article
                key={p.id}
                className="resultCard"
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    handleDragStartProperty(e, p.id);
                }}
                >
                <div className="resultTop">
                    <div>
                    <h2 className="resultTitle">{p.type}</h2>

                    <p className="resultMeta">
                        <strong>£{p.price.toLocaleString()}</strong>, {p.bedrooms} bedrooms
                    </p>

                    <p className="resultMeta">
                        <span className="badge">{p.postcode}</span>
                    </p>
                    </div>
                </div>

                <p className="desc">{p.shortDescription}</p>

                <div className="actionsRow">
                    <Link className="link" to={`/property/${p.id}`}>
                    View details
                    </Link>

                    <button
                    type="button"
                    className="btn"
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
        <aside className="card sidebar">
            <h2 className="cardTitle">Favourites</h2>

            <p className="small">
            Press ☆ Favourite to save properties.
            </p>

            <div className="btnRow">
            <button
                type="button"
                className="btn btnGhost"
                onClick={clearFavourites}
                disabled={favouriteIds.length === 0}
            >
                Clear all
            </button>
            </div>

            <div className="favList">
            {favouriteProperties.length === 0 ? (
                <p className="small">No favourites yet.</p>
            ) : (
                favouriteProperties.map((p) => (
                <div key={p.id} className="favItem">
                    <strong>{p.type}</strong>
                    <div>£{p.price.toLocaleString()}</div>
                    <div className="small">{p.postcode}</div>

                    <button
                    type="button"
                    className="btn"
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
