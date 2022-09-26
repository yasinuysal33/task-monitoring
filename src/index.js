import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StaffContextProvider } from "./components/store/staffContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StaffContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StaffContextProvider>
);
