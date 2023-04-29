import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthState } from "./context/Authentication/AuthState";
import { SessionState } from "./context/Sessions/SessionState";
import { FacilitiesState } from "./context/Facilities/FacilitiesState";
import { AlertState } from "./context/Alert/Alert";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AlertState>
    <AuthState>
      <FacilitiesState>
        <SessionState>
          <App />
        </SessionState>
      </FacilitiesState>
    </AuthState>
  </AlertState>
  // </React.StrictMode>
);
