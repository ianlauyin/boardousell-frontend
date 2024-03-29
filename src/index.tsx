import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WrongPage from "./Component/WrongPage";
import AboutUsPage from "./Component/AboutUsPage";
import ExplorePage from "./Component/ExplorePage";
import HomePage from "./Component/HomePage";
import OrderListPage from "./Component/OrderListPage";
import OrderPage from "./Component/OrderPage";
import PolicyPage from "./Component/PolicyPage";
import ProductPage from "./Component/ProductPage";
import UserPage from "./Component/UserPage";
import "tailwindcss/tailwind.css";
import NoticePage from "./Component/Notice-Sub/NoticePage";
import CheckoutPage from "./Component/CheckoutPage";
import ContactUsPage from "./Component/ContactUs-Sub/ContactUsPage";
import SearchPage from "./Component/SearchPage";
import { Auth0Provider } from "@auth0/auth0-react";
import AdminPage from "./Component/Admin-Sub/AdminPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH_AUDIENCE,
        scope: "read:current_user profile email",
      }}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="*" element={<WrongPage />} />
            <Route path="" element={<HomePage />} />
            <Route path="contactus" element={<ContactUsPage />} />
            <Route path="aboutus" element={<AboutUsPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="orderlist" element={<OrderListPage />} />
            <Route path="order/:orderId" element={<OrderPage />} />
            <Route path="policy" element={<PolicyPage />} />
            <Route path="product/:productId" element={<ProductPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="notice" element={<NoticePage />} />
            <Route path="notice/:noticeId" element={<NoticePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
