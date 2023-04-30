import React, { useState } from "react";
import "./Membership.css";
import { useContext } from "react";
import { AuthContext } from "../../../../context/Authentication/AuthState";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { AlertContext } from "../../../../context/Alert/Alert";
import { SessionContext } from "../../../../context/Sessions/SessionState";
import axios from "axios";
const plans = {
  MONTHLY: "price_1MpjIrFi0ADzfbvac4X6zSJE",
  ANNUALLY: "price_1Mpzl5Fi0ADzfbvaCarF6wCL",
};
const MembershipButton = ({ isMember }) => {
  const [showModal, setShowModal] = useState(false);
  const { customer, PutCustomer, GetCustomerDetails } = useContext(AuthContext);
  const { info } = useContext(SessionContext);

  const { SetAlert } = useContext(AlertContext);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!stripe || !elements) {
        return;
      }

      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: customer ? customer.FirsName : "",
          email: customer ? customer.Email : "",
        },
      });
      const res = await axios.post("/subscription", {
        paymentMethod: paymentMethod?.paymentMethod?.id,
        name: customer ? customer.FirsName : "",
        email: customer ? customer.Email : "",
        priceId: plans.MONTHLY,
      });
      const confirmPayment = await stripe.confirmCardPayment(
        res.data.clientSecret
      );

      if (confirmPayment?.error) {
        SetAlert(confirmPayment.error.message, "error");
      } else {
        handleSuccess().then(() => {
          SetAlert("Success! Subscription Created", "success");
        });
      }
    } catch (error) {
      console.log(error);
      SetAlert("Error. Couldn't Subscribe");
    }
  };

  const handleSuccess = async () => {
    // handle subscription logic here
    PutCustomer({ _id: customer._id, isMember: true }).then(() => {
      if (localStorage.getItem("customer_email"))
        GetCustomerDetails(localStorage.getItem("customer_email"));
    });
  };

  const handleCancel = () => {
    // handle cancel subscription logic here
    PutCustomer({ _id: customer._id, isMember: false }).then(() => {
      if (localStorage.getItem("customer_email"))
        GetCustomerDetails(localStorage.getItem("customer_email"));
    });
  };
  const handleClose = () => {
    // handle cancel subscription logic here
    setShowModal(false);
  };
  return (
    <>
      <button className="click-button" onClick={() => setShowModal(true)}>
        Membership
      </button>
      {showModal && (
        <div className="membership-modal">
          <div className="membership-modal-content">
            {isMember ? (
              <>
                <h3>You are currently subscribed to:</h3>
                <h2>Run Walk Sports Centre Subscription</h2>
                <button onClick={handleCancel}>Cancel subscription</button>
                <button onClick={handleClose}>Close</button>
              </>
            ) : (
              <>
                <h3>Choose a membership option:</h3>
                <form onSubmit={handleSubmit}>
                  <CardElement />
                  <button disabled={!stripe}>
                    Subscribe to Monthly membership for £{info.MonthlyPrice}
                  </button>
                  <button disabled={!stripe}>
                    Subscribe to Annual membership for £{info.AnnualPrice}
                  </button>
                </form>
                <button onClick={handleClose}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MembershipButton;