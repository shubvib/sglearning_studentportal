import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { GrDocumentStore } from "react-icons/gr";
import { toast, ToastContainer } from "react-toastify";
import { connect } from 'react-redux';

const WarningExam = (props) => {
    const { showWarningModal, handleCloseshowWarningModal} = props;
    return (
    <div className="modal-main-dark">
            <Modal show={showWarningModal} onHide={handleCloseshowWarningModal} backdrop="static" size="sm" className="modal-dark subject-mapping-modal" centered >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header >
                    <div className="modal-title-box">
                        <h3 style={{color:"Orange"}}><GrDocumentStore size={26} />Warning!!!!</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="subject-mapping-wrapper" style={{
                        color: 'white',
                        alignItems: 'center',
                        // backgroundImage: `url(${require("../../../../assets/images/Instruction_BG1.png")})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        height: "100%"
                    }}>
                        {
                            <div className="instruction-timer-wrapper" >
                                <span className="time-remain-text">You Are Not Allow To Switch This Window.</span>
                                <span className="time-remain-text">If You Again Switch This Window</span>
                                <span className="time-remain-text">You Will Banned For This Exam.</span> 
                            </div>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="footer-btn-box">
                        {/* <Button variant="primary" className={`uploadeBtn ${showDiscardLoader ? 'disabled' : ''}`} onClick={() => {
                            discardAPI()
                        }}>
                            Discard {showDiscardLoader && <Spinner size="sm" animation="grow" variant="info" />}

                        </Button> */}
                        <Button variant="secondary" className="closeBtn" onClick={handleCloseshowWarningModal}>
                            OK
                    </Button>
                    </div>
                </Modal.Footer>
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

export default connect(mapPropsToState)(WarningExam);
