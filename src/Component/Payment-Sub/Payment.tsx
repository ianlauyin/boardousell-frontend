import { CircularProgress } from "@mui/material";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKENDURL } from "../../constant";
import { useParams } from "react-router-dom";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { orderId } = useParams();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent && paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        error.message && setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
    setIsLoading(false);
    try {
      await axios.put(`${BACKENDURL}/order/paid`, { orderId });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-3">
      <form className="flex flex-col" id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button
          className="my-3 btn btn-accent self-end"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          {isLoading ? <CircularProgress /> : "Pay now"}
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}