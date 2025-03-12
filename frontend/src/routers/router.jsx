import {createBrowserRouter} from "react-router-dom";
import App from '../App.jsx'
import Home from "../pages/home/Home.jsx";
import CategoryPage from "../pages/category/CategoryPage.jsx";
import Search from "../pages/search/Search.jsx";
import ShopPage from "../pages/shop/ShopPage.jsx";
import SingleProduct from "../pages/shop/productDetails/SingleProduct.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {path: "/",element: <Home />},
      { path: "/category/:categoryName", element: <CategoryPage /> },
      { path: "/search", element: <Search /> },
      { path: "/shop", element: <ShopPage /> },
      {path: "/shop/:id", element: <SingleProduct />},
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }
]);
export default router;