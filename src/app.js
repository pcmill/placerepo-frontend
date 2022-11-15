import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CountryNew from "./pages/country-new/country-new";
import CountryDetails from "./pages/country-details/country-details";
import CountryList from "./pages/country-list/country-list";
import Home from "./pages/home/home";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
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
