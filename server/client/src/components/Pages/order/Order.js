import React, { useEffect, useContext } from "react";
import { SessionContext } from "../../../context/Sessions/SessionState";
import { AlertContext } from "../../../context/Alert/Alert";
import Loading from "../../utils/Loading";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Icon } from "@mui/material";
import Typography from "@mui/material/Typography";
function Order() {
  const { CheckOut } = useContext(SessionContext);
  const { isLoading } = useContext(AlertContext);
  useEffect(() => {
    async function call() {
      await CheckOut();
    }
    call();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32">
        <div className="flex flex-col items-center justify-center w-full">
          <Card
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "36rem",
              width: "60rem",
              margin: "8rem auto",
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
              <div
                className="flex items-center mb-28"
                style={{ textAlign: "center" }}
              >
                <img
                  src="https://th.bing.com/th/id/OIP.sDGRfLCFGcM8RIBnTjptjgHaHa?pid=ImgDet&rs=1"
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "100%",
                  }}
                />
                {/* <div className="border-l-1 mr-4 w-1 h-40" /> */}
                <div>
                  <Typography
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                    color="inherit"
                  >
                    Your order is completed!
                  </Typography>
                  {/* <Typography
                      className="text-16 tracking-widest -mt-8 font-700"
                      color="textSecondary"
                    >
                      PLATFORM
                    </Typography> */}
                </div>
              </div>
              <Typography variant="subtitle1" className="text-center mb-5 ">
                You will be receiving a confirmation email with order details
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Order;
