import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CountryNew from "./pages/country-new";
import CountryDetails from "./pages/country-details";
import CountryList from "./pages/country-list";
import Home from "./pages/home";
import ContinentList from "./pages/continent-list";
import ContinentDetails from "./pages/continent-details";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/continent',
    element: <ContinentList />
  },
  {
    path: '/continent/:id',
    element: <ContinentDetails />
  },
  {
    path: '/country',
    element: <CountryList />
  },
  {
    path: '/country/new',
    element: <CountryNew />
  },
  {
    path: '/country/:id',
    element: <CountryDetails />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
