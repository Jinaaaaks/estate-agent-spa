import { filterProperties } from "./filterProperties";

const sample = [
  {
    id: "p1",
    type: "House",
    price: 450000,
    bedrooms: 3,
    dateAdded: "2025-11-12",
    postcode: "NW1 6XE"
  },
  {
    id: "p2",
    type: "Flat",
    price: 320000,
    bedrooms: 2,
    dateAdded: "2025-08-30",
    postcode: "E1 7AA"
  },
  {
    id: "p3",
    type: "Bungalow",
    price: 510000,
    bedrooms: 4,
    dateAdded: "2025-10-05",
    postcode: "SW2 3BB"
  }
];

describe("filterProperties", () => {
  test("returns all properties when filters are empty", () => {
    const result = filterProperties(sample, {});
    expect(result).toHaveLength(3);
  });

  test("filters by type", () => {
    const result = filterProperties(sample, { type: "Flat" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p2");
  });

  test("filters by price range", () => {
    const result = filterProperties(sample, { minPrice: 400000, maxPrice: 500000 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p1");
  });

  test("filters by minimum bedrooms", () => {
    const result = filterProperties(sample, { minBedrooms: 4 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p3");
  });

  test("filters by dateAdded after", () => {
    const result = filterProperties(sample, { dateAdded: "2025-10-01" });
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
  });

  test("filters by postcode area (case-insensitive)", () => {
    const result = filterProperties(sample, { postcode: "nw1" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p1");
  });
});
