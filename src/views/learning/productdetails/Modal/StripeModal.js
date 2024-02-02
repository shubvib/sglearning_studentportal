import React, { useState, useEffect } from 'react';

import { Button, Modal, Spinner } from 'react-bootstrap';

import { toast, ToastContainer } from "react-toastify";

import { connect } from 'react-redux';
import { StripeCheckoutComponent } from '../../../../components';
import { EnumConfig, UrlConfig } from '../../../../config';
import { useHistory } from 'react-router-dom';

const StripeModal = (props) => {
    // Router Functions
    const history = useHistory();
    const { handleCloseshowStripeModal, showStripeModalModal, clientKeys, productToPurchase } = props;
    useEffect(() => {
        console.log('Heloooooooo');
    }, []);
    const sendToPage = () => {
        console.log('AAproductToPurchase', productToPurchase);
        if (productToPurchase.productType === EnumConfig.ProductType.examPackages) {
            history.push(UrlConfig.routeUrls.exam)
        } else {
            history.push(UrlConfig.routeUrls.learning);
        }
    }
    return (
        <div className="modal-main-dark">
            <Modal show={showStripeModalModal} onHide={() => {
                toast(`Payment cancelled...!`, {
                    type: "error",
                });
                handleCloseshowStripeModal();

            }} size="sm" className="modal-dark subject-mapping-modal" centered >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <StripeCheckoutComponent
                        clientKeys={clientKeys}
                        handleCloseshowStripeModal={handleCloseshowStripeModal}
                        onSuccess={() => { productToPurchase && sendToPage() }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}



const mapPropsToState = (state) => {
    return {
        userData: state.userData,
        authDetails: state.authDetails,
        testDetails: state.testDetails
    }
}

export default connect(mapPropsToState)(StripeModal);
