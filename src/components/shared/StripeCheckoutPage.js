import React, { useState, useEffect } from 'react';

import { Button, Modal, Spinner } from 'react-bootstrap';

import { toast, ToastContainer } from "react-toastify";

import { connect } from 'react-redux';
import StripeCheckoutComponent from './StripeCheckoutComponent';

const StripeCheckoutPage = (props) => {

    const { clientSecreteKey } = props.match.params;

    const clientKeys = { clientSecret: clientSecreteKey }

    const onSuccess = (paymentData) => {
        window.ReactNativeWebView.postMessage(JSON.stringify(paymentData))
    }

    const handleCloseshowStripeModal = () => {

    }
    return (
        <div style={{ height: "100%" }}>
            <div className="common-dark-box stripe-wrapper">
                <div className="stripe-sub-wrapper">
                    <h3>Pay using credit or debit card</h3>
                    <StripeCheckoutComponent
                        clientKeys={clientKeys}
                        handleCloseshowStripeModal={handleCloseshowStripeModal}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        </div>
    )
}


export default StripeCheckoutPage;
