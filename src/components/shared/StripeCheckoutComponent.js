import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE } from './stripeSettings';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { UrlConfig, AppConfig } from '../../config';

let keys = '';
const StripeCheckoutComponent = (props) => {
  const { clientKeys, handleCloseshowStripeModal, onSuccess = () => { } } = props;
  keys = clientKeys.clientSecret;
  let publicKey = STRIPE.PUBLIC_KEY_LIVE
  if (AppConfig) {
    publicKey = AppConfig.isDevelopment ? STRIPE.PUBLIC_KEY_TEST : STRIPE.PUBLIC_KEY_LIVE;
  }
  const stripePromise = loadStripe(publicKey);
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        handleCloseshowStripeModal={handleCloseshowStripeModal}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};
const CheckoutForm = (props) => {
  const history = useHistory();
  const { handleCloseshowStripeModal, onSuccess } = props;
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const payMoney = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentLoading(true);
    if (keys) {

    }
    const clientSecret = keys;
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Faruq Yusuff",
        },
      },
    });
    console.log('paymentResult', paymentResult);
    setPaymentLoading(false);
    if (paymentResult.error) {
      toast(paymentResult.error.message, {
        type: "error",
      })
      // const errorData = { error: true, success: false, loading: false, message: paymentResult.error.message }
      // onSuccess(errorData);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        toast(`Payment suceess...!`, {
          type: "success",
        });
        handleCloseshowStripeModal();
        const successData = { error: false, success: true, loading: false, message: "Payment succeed" }
        onSuccess(successData);
      }
    }
  };



  return (
    <div
      style={{
        padding: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <form
          style={{
            display: "block",
            width: "100%",
          }}
          onSubmit={payMoney}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardElement
              className="card"
              options={{
                style: {
                  base: {
                    backgroundColor: "white"
                  }
                },
              }}
            />
            <button
              className="pay-button"
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? "Loading..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StripeCheckoutComponent;