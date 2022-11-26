import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CountryNew from "./pages/country-new";
import CountryDetails from "./pages/country-details";
import CountryList from "./pages/country-list";
import Home from "./pages/home";
import ContinentList from "./pages/continent-list";
import ContinentDetails from "./pages/continent-details";
import Shell from "./components/shell";
import CountryWrapper from "./pages/country-wrapper";
import ContinentWrapper from "./pages/continent-wrapper";
import AdminDetails from "./pages/admin-details";
import AdminWrapper from "./pages/admin-wrapper";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
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
        element: <ContinentWrapper />,
        children: [
          {
            path: '/continent/:id',
            element: <ContinentDetails />
          }
        ]
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
        element: <CountryWrapper />,
        children: [
          {
            path: '/country/:id',
            element: <CountryDetails />
          }
        ]
      },
      {
        path: '/admin/:level/:id',
        element: <AdminWrapper />,
        children: [
          {
            path: '/admin/:level/:id',
            element: <AdminDetails />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
