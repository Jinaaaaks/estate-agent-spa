export function filterProperties(properties, filters) {
  return properties.filter((property) => {
    // Filter by type
    if (filters.type && property.type !== filters.type) {
      return false;
    }

    // Filter by minimum price
    if (
      filters.minPrice &&
      property.price < Number(filters.minPrice)
    ) {
      return false;
    }

    // Filter by maximum price
    if (
      filters.maxPrice &&
      property.price > Number(filters.maxPrice)
    ) {
      return false;
    }

    // Filter by minimum bedrooms
    if (
      filters.minBedrooms &&
      property.bedrooms < Number(filters.minBedrooms)
    ) {
      return false;
    }

    // Filter by date added (after)
    if (
      filters.dateAdded &&
      new Date(property.dateAdded) < new Date(filters.dateAdded)
    ) {
      return false;
    }

    // Filter by postcode area (first part)
    if (
      filters.postcode &&
      !property.postcode
        .toUpperCase()
        .startsWith(filters.postcode.toUpperCase())
    ) {
      return false;
    }

    return true;
  });
}
