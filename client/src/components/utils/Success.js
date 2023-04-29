import React, { useEffect, useContext } from "react";
import { SessionContext } from "../../context/Sessions/SessionState";
import { AlertContext } from "../../context/Alert/Alert";
import Loading from "./Loading";

const Success = () => {
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
    <h1 style={{ textAlign: "center", marginTop: "10rem" }}>Order Complete</h1>
  );
};

export default Success;
