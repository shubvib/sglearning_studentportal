import React, { useState, useEffect } from 'react';

import { Button, Modal, Spinner } from 'react-bootstrap';
import { BsChevronDoubleDown, BsPeople, } from 'react-icons/bs';
import { GrDocumentStore } from "react-icons/gr";
import CommonFunctions from '../../../../utils/CommonFunctions';
import CountDownComponent from '../../../../components/coundown/CountDownComponent'
import { useHistory } from "react-router-dom";
import { UrlConfig } from '../../../../config';
import { Api, CommonApiCall, Network } from '../../../../services';
import { toast, ToastContainer } from "react-toastify";

import moment from 'moment';
import { TestDetailsAction, WarningCountAction } from '../../../../reduxManager';

import { connect } from 'react-redux';
import localForage from "localforage";



const DiscardExam = (props) => {
    const {
        disableStartButton,//old props
        testDetailsforSubmit, selectedTest,
        remaningTime, returnTwonumbers, UserAnswerCount, UserBookmarkCount, UserNotAnswerCount, UserVisitedCount,
        showDiscardModal, handleCloseshowDiscardModal, data, remainingDurationTime//new props
    } = props;
    let instructionSet = data && data.exam && data.exam.instructions ? data.exam.instructions.split('\n') : [];
    const history = useHistory();
    const [startTime, setStartTime] = useState(0);
    const [showDiscardLoader, setShowDiscardLoader] = useState(false);


    useEffect(() => {

    }, [data])




    const discardAPI = () => {
        if (selectedTest && selectedTest.id) {
            let payload = {
                "studentExamScheduleId": selectedTest.id,
                "studentExamActionType": 3
            }
            setShowDiscardLoader(true);
            Api.postApi(UrlConfig.apiUrls.start_discardTest, payload)
                .then((data) => {
                    setShowDiscardLoader(false);
                    if (data) {
                        TestDetailsAction.resetTestDetails();
                        history.push(UrlConfig.routeUrls.exam);
                        toast.success(`Exam Discarded`, {
                            type: 'error'
                        });


                        // afterDiscard();
                    }
                    WarningCountAction.resetWarningCount()
                    localForage.setItem('subjectwizeQuestions', null)

                })
                .catch((error) => {
                    setShowDiscardLoader(false);
                    const errorMessage = CommonFunctions.apiErrorMessage(error);
                    toast(errorMessage, {
                        type: "error",
                    });
                });
        } else {
            toast('Test Id not found', {
                type: "error",
            });
        }
    }



    return (

        <div className="modal-main-dark">
            <Modal show={showDiscardModal} onHide={handleCloseshowDiscardModal} size="sm" className="modal-dark subject-mapping-modal" centered >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3><GrDocumentStore size={26} />Do you want to Discard Exam..?</h3>
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
                                <span className="time-remain-text">Time remaining.</span>
                                <CountDownComponent
                                    remainingDuration={remaningTime}
                                    colorsArray={[["#A30000", 0.33], ["#F7B801", 0.33], ["#004777"]]}
                                    onFinish={() => {
                                    }}
                                    size={70}
                                    strokeWidth={5}
                                    textStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                />
                            </div>}
                        <div className="test-information row" >
                            <div className="col-xs-6 color-white count">
                                <div className=" question-number-panel-view-UserAnswerCount " >
                                    <div className="count-text">
                                        {returnTwonumbers(UserAnswerCount)}
                                    </div>
                                </div>
                                <span className="common-text"> Answered</span>
                            </div>
                            <div className="col-xs-6 color-white count">
                                <div className="question-number-panel-view-UserNotAnswerCount" key={2}>
                                    <div className="count-text">
                                        {returnTwonumbers(UserNotAnswerCount)}
                                    </div>
                                </div>
                                <span className="common-text">Not Answered</span>
                            </div>
                        </div>
                        <div className="test-information row " >
                            <div className="col-xs-6 color-white count">
                                <div className=" question-number-panel-view-UserBookmarkCount " >
                                    <div className="count-text">
                                        {returnTwonumbers(UserBookmarkCount)}
                                    </div>
                                </div>
                                <span className="common-text">Bookmarked</span>
                            </div>
                            <div className="col-xs-6 color-white count">
                                <div className="question-number-panel-view-UserVisitedCount" key={2}>
                                    <div className="count-text">
                                        {returnTwonumbers(UserVisitedCount)}
                                    </div>
                                </div>
                                <span className="common-text">Not Visited</span>
                            </div>
                            <br />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="footer-btn-box">
                        <Button variant="primary" className={`uploadeBtn ${showDiscardLoader ? 'disabled' : ''}`} onClick={() => {
                            discardAPI()
                        }}>
                            Discard {showDiscardLoader && <Spinner size="sm" animation="grow" variant="info" />}

                        </Button>
                        <Button variant="secondary" className="closeBtn" onClick={handleCloseshowDiscardModal}>
                            Cancel
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

export default connect(mapPropsToState)(DiscardExam);
