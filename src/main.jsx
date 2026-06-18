import React from "react";
import ReactDOM from "react-dom/client";
import Gate from "./Gate.jsx";
import ClinicModel from "./ClinicModel.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Gate>
      <ClinicModel />
    </Gate>
  </React.StrictMode>
);
