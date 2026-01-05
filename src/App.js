import { HashRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import PropertyPage from "./pages/PropertyPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
      </Routes>
    </HashRouter>
  );
}
