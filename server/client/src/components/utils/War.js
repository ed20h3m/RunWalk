import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./War.css";

const War = ({ Alerts }) => {
  return (
    <div className="war">
      <Stack className = "info" sx={{ width: "50%", position: "fixed", top: "100px" }} spacing={2}>
        {Alerts.length > 0 &&
          Alerts.map((element) => (
            <Alert
              variant="filled"
              severity={element.type.toLowerCase()}
              key={element.id}
            >
              {element.message}
            </Alert>
          ))}
      </Stack>
    </div>
  );
};

export default War;
