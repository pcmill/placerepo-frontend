import { Route, Routes } from "react-router-dom";
import NewCountry from "./pages/add-country/add-country";
import CountryDetails from "./pages/country-details/country-details";
import Home from "./pages/home/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new/country" element={<NewCountry />} />
      <Route path="/country/:id" element={<CountryDetails />} />
    </Routes>
  );
}

export default App;
