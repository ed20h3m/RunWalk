import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
// import Loading from "../../utils/Loading";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { AuthContext } from "../../../context/Authentication/AuthState";
import { AlertContext } from "../../../context/Alert/Alert";
import "./SubCard.css";
const str = require("stripe")(
  "sk_test_51MlBZHFi0ADzfbva1UjwNVVstqe7Jpqh5eaibsM92PmKpBEpUfP81cpAySUDLA4TvyAzjhqiI2qf1kzBeSJgcEiX00OW7ph683"
);

const SubscriptionForm = () => {
  const { customer, PutCustomer } = useContext(AuthContext);
  const { SetAlert, ToggleLoading, isLoading, ToggleOverlay } =
    useContext(AlertContext);
  const [Monthly, setMonthly] = useState("");
  const [Yearly, setYearly] = useState("");
  const [plan, setPlan] = useState("");
  useEffect(() => {
    async function call() {
      const monthly = await str.products.retrieve("prod_Nav9YtxTWpvmRR");
      const yearly = await str.products.retrieve("prod_NbC9bn8OHuKL6R");
      setMonthly(yearly.default_price);
      setYearly(monthly.default_price);
      setPlan(monthly.default_price);
    }
    call();
  }, [Yearly, Monthly]);

  const stripe = useStripe();
  const elements = useElements();

  const changePlan = (e) => {
    if (e.target.value === "monthly") setPlan(Monthly);
    else if (e.target.value === "yearly") setPlan(Yearly);
  };
  const createSubscription = async () => {
    // return;
    ToggleOverlay(true);
    try {
      // create a payment method
      const paymentMethod = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement),
        billing_details: {
          name: customer ? customer.FirsName : "",
          email: customer ? customer.Email : "",
        },
      });
      console.log(plan);
      const res = await axios.post("/subscription", {
        paymentMethod: paymentMethod?.paymentMethod?.id,
        name: customer ? customer.FirsName : "",
        email: customer ? customer.Email : "",
        priceId: plan,
      });

      const confirmPayment = await stripe?.confirmCardPayment(
        res.data.clientSecret
      );
      if (confirmPayment?.error) {
        SetAlert(confirmPayment.error.message, "error");
      } else {
        SetAlert("Success! Subscription Created", "success");
        PutCustomer({ subId: res.data.subscription.id, isMember: true });
        window.location.reload(false);
      }
    } catch (error) {
      SetAlert(error.message);
    }
    ToggleOverlay(false);
  };

  const handleSubmit = async (event) => {
    // ToggleOverlay(true);
    createSubscription();
    // ToggleOverlay(false);
    event.preventDefault();
  };

  return (
    <>
      {/* {isLoading && <Loading />} */}
      <form className="sub-card" onSubmit={handleSubmit}>
        <h5>{customer ? customer.Email : ""}</h5>
        <select
          name="plan"
          className="sub-card-plans"
          onChange={changePlan}
          required
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <CardElement />
        <button type="submit" className="sub-btn" disabled={!stripe}>
          Subscribe
        </button>
      </form>
    </>
  );
};

export default SubscriptionForm;
