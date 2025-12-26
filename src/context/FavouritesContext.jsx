import { createContext, useContext, useMemo, useState } from "react";

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  // Store just IDs for simplicity
  const [favouriteIds, setFavouriteIds] = useState([]);

  function addFavourite(id) {
    setFavouriteIds((prev) => {
      if (prev.includes(id)) return prev; // ✅ prevent duplicates
      return [...prev, id];
    });
  }

  function removeFavourite(id) {
    setFavouriteIds((prev) => prev.filter((x) => x !== id));
  }

  function clearFavourites() {
    setFavouriteIds([]);
  }

  const value = useMemo(
    () => ({
      favouriteIds,
      addFavourite,
      removeFavourite,
      clearFavourites
    }),
    [favouriteIds]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavourites must be used inside FavouritesProvider");
  }
  return ctx;
}
