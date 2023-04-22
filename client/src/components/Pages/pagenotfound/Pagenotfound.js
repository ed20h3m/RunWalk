import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Pagenotfound() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  });
  return (
    <>
      <div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32 ">
        <div className="flex flex-col items-center justify-center w-full">
          <Card
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "36rem",
              width: "60rem",
              margin: "auto",
              marginTop: "5rem",
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
              <div
                className="flex items-center mb-28"
                style={{ textAlign: "center" }}
              >
                {/* <div className="border-l-1 mr-4 w-1 h-40" /> */}
                <div>
                  <Typography
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                    color="inherit"
                  >
                    Sorry page not found!
                  </Typography>
                  {/* <Typography
                      className="text-16 tracking-widest -mt-8 font-700"
                      color="textSecondary"
                    >
                      PLATFORM
                    </Typography> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Pagenotfound;
