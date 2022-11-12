import { Route, Routes } from "react-router-dom";
import NewCountry from "./pages/add-country/add-country";
import Home from "./pages/home/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new/country" element={<NewCountry />} />
    </Routes>
  );
}

export default App;
