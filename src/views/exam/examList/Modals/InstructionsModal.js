import React, { useState, useEffect } from 'react';

import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { BsChevronDoubleDown, BsPeople, } from 'react-icons/bs';
import { GrDocumentStore } from "react-icons/gr";
import CommonFunctions from '../../../../utils/CommonFunctions';
import CountDownComponent from '../../../../components/coundown/CountDownComponent'
import { useHistory } from "react-router-dom";
import { UrlConfig, EnumConfig } from '../../../../config';
import { Api, CommonApiCall, Network } from '../../../../services';
import { toast, ToastContainer } from "react-toastify";
import moment from 'moment';
import { TestDetailsAction } from '../../../../reduxManager';
import { connect } from 'react-redux';
import Axios from 'axios';
import localForage from "localforage";

const InstructionsModal = (props) => {
    const { showInstructionsModal, handleCloseInstructionModal, data, disableStartButton, isOpenExam = false } = props;
    let instructionSet = data && data.exam && data.exam.instructions ? data.exam.instructions.split('\n') : [];
    const history = useHistory();
    const [startTime, setStartTime] = useState(0);
    const [popupLoader, setOpupLoader] = useState(false);
    const [remainingErrorMessage, setMessage] = useState(null);
    useEffect(() => {
        if (data && showInstructionsModal) {
            setCountDownTimer();
        }

    }, [data, showInstructionsModal])

    const setCountDownTimer = () => {
        let remaningTime, remaningTimeHrs;
        if (data && data.startDateTime) {
            const { startDateTime } = data;
            let startDate = new Date(startDateTime)
            const now = moment(new Date()); //todays date
            const end = moment(startDate, 'MM-DD-YYYY hh:mm a'); // another date
            remaningTimeHrs = end.diff(now, 'hours', true);
            remaningTime = (remaningTimeHrs * 60 * 60).toFixed(0); //get duration in seconds
            setStartTime(remaningTime);

            const today = moment(startDateTime.substring(0, 10)).isSame(Date.now(), 'day') ? 'Today' : moment(startDateTime.substring(0, 10)).format('DD-MM-YYYY');
            const message = `Exam Start Time Is ${moment(startDateTime).format('LT') + ' (' + today + ')'}`;
            setMessage(message);
        }
    }

    useEffect(() => {
        if (props.testDetails) {
            console.log(props.testDetails, 'testDetailstestDetailstestDetailstestDetails')
        }
    }, [props.testDetails])

    const callAPIStartTest = (examScheduleId = null) => {
        let studentExamScheduleId = data.id;
        if (data.examScheduleAccessType === EnumConfig.ExamScheduleAccessType.open) {
            studentExamScheduleId = examScheduleId;
        }
        let payload = {
            "studentExamScheduleId": studentExamScheduleId,
            "studentExamActionType": 1
        }
        // Api.postApi(UrlConfig.apiUrls.start_discardTest, payload)
        Api.postDirectApi(payload, 'start_exam_capture_url', studentExamScheduleId)
            .then((response) => {
                // window.open('http://172.16.15.105:3000/#/exampage');
                console.log('captured start');

            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('error in capture start', errorMessage);
            });
    }

    const selfScheduleExam = (examData) => {
        const value = data;
        const url = `${UrlConfig.apiUrls.scheduleExam}/${value.id}/${UrlConfig.apiUrls.selfSchedule}`;
        const payload = {
            examScheduleId: value.id
        }
        Api.postApi(url, payload)
            .then((response) => {
                const { data } = response;
                if (data) {
                    const { id } = data;
                    callAPIStartTest(id);
                    console.log('selfScheduleData', data);
                    const examDetailData = {
                        selectedTest: { ...value, id },
                        examList: examData
                    }
                    TestDetailsAction.setTestDeatils(examDetailData);
                    history.push(UrlConfig.routeUrls.examView);
                    setOpupLoader(false);
                } else {
                    setOpupLoader(false);
                    const errorMessage = 'No schedule data found.';
                    toast(errorMessage, {
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                setOpupLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            });



    }


    const launchTest = () => {
        setOpupLoader(true)

        //  ToDO-- {selectedTestDetails.id} Add this id 
        const value = data;
        Api.getDirectApi(null, 'start_exam_url', data.id)
            .then((response) => {
                const data = response;
                if (data) {
                    data && data.subjectwizeQuestions && data.subjectwizeQuestions.length > 0 && data.subjectwizeQuestions.map((sub, subIndex) => {
                        sub.questions.map((que, queIndex) => {
                            que.isAnswer = false;
                            que.isBookmarked = false;
                        });
                        sub.subjectWiseAnswerCount = 0;
                    });
                    if (value.examScheduleAccessType === EnumConfig.ExamScheduleAccessType.open) {
                        selfScheduleExam(data);
                    } else {
                        callAPIStartTest();

                        const { exam, bufferTimeInMinutes, startDateTime } = value;
                        const { duration } = exam;
                        const isMockTest = CommonFunctions.isExpiredTest(
                            startDateTime,
                            duration,
                            bufferTimeInMinutes,
                        );
                        const payLoad = {
                            selectedTest: { ...value, isMockTest },
                            examList: data
                        }
                        TestDetailsAction.setTestDeatils(payLoad);
                        history.push(UrlConfig.routeUrls.examView);
                        setOpupLoader(false);
                    }
                    return response.data;
                }
            })
            .catch((error) => {
                setOpupLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            })


        // Api.getApi(UrlConfig.apiUrls.getTestList + '/' + data.id)
        //     .then((response) => {
        //         const { data } = response;
        //         if (data) {
        //             data && data.subjectwizeQuestions && data.subjectwizeQuestions.length > 0 && data.subjectwizeQuestions.map((sub, subIndex) => {
        //                 sub.questions.map((que, queIndex) => {
        //                     que.isAnswer = false;
        //                     que.isBookmarked = false;
        //                 });
        //                 sub.subjectWiseAnswerCount = 0;
        //             });
        //             if (value.examScheduleAccessType === EnumConfig.ExamScheduleAccessType.open) {
        //                 selfScheduleExam(data);
        //             } else {
        //                 callAPIStartTest();
        //                 const payLoad = {
        //                     selectedTest: value,
        //                     examList: data
        //                 }
        //                 TestDetailsAction.setTestDeatils(payLoad);
        //                 history.push(UrlConfig.routeUrls.examView);
        //                 setOpupLoader(false);
        //             }
        //             return response.data;
        //         }
        //     })
        //     .catch(error => {
        //         setOpupLoader(false);
        //         const errorMessage = CommonFunctions.apiErrorMessage(error);
        //         toast(errorMessage, {
        //             type: "error",
        //         });
        //     });
    }

    const updateExamDataAndRedirect = async (responseData) => {
        const value = data;
        const { exam, bufferTimeInMinutes, startDateTime } = responseData;
        const { questionSetDataUrl, duration } = exam;
        if (questionSetDataUrl) {
            // Api.getDirectApi(null, questionSetDataUrl, '', '', true)
            Axios.get(questionSetDataUrl)
                .then(async (response) => {
                    console.log('CDN json data', response);
                    const { subjectwizeQuestions } = response;
                    if (subjectwizeQuestions && subjectwizeQuestions.length > 0) {
                        subjectwizeQuestions.map((sub, subIndex) => {
                            sub.questions.map((que, queIndex) => {
                                que.isAnswer = false;
                                que.isBookmarked = false;
                            });
                            sub.subjectWiseAnswerCount = 0;
                        });
                    }
                    const isMockTest = CommonFunctions.isExpiredTest(
                        startDateTime,
                        duration,
                        bufferTimeInMinutes,
                    );
                    const payLoad = {
                        selectedTest: { ...value, isMockTest, launchDateTime: new Date() },
                        examList: { ...data, subjectwizeQuestions }
                    }
                    // await localForage.setItem('subjectwizeQuestions', null);
                    TestDetailsAction.setTestDeatils(payLoad);
                    history.push(UrlConfig.routeUrls.examView);

                    // localForage.setItem('subjectwizeQuestions', null).then((value) => {
                    //     TestDetailsAction.setTestDeatils(payLoad);
                    //     history.push(UrlConfig.routeUrls.examView);

                    // })
                    //     .catch((err) => {
                    //         TestDetailsAction.setTestDeatils(payLoad);
                    //         history.push(UrlConfig.routeUrls.examView);

                    //     });

                    setOpupLoader(false);
                })
                .catch((error) => {
                    setOpupLoader(false);
                    const errorMessage = CommonFunctions.apiErrorMessage(error);
                    toast(errorMessage, {
                        type: "error",
                    });
                })
        }
        // responseData && responseData.subjectwizeQuestions && responseData.subjectwizeQuestions.length > 0 && responseData.subjectwizeQuestions.map((sub, subIndex) => {
        //     sub.questions.map((que, queIndex) => {
        //         que.isAnswer = false;
        //         que.isBookmarked = false;
        //     });
        //     sub.subjectWiseAnswerCount = 0;
        // });

    }


    const updateExamDataAndRedirectOpenExamCdn = async (responseData) => {
        const value = data;
        const { exam, bufferTimeInMinutes, startDateTime } = responseData;
        const { questionSetDataUrl, duration } = exam;
        if (questionSetDataUrl) {
            Axios.get(questionSetDataUrl)
                .then(async (response) => {
                    console.log('CDN json data', response);
                    const { subjectwizeQuestions } = response;
                    if (subjectwizeQuestions && subjectwizeQuestions.length > 0) {
                        subjectwizeQuestions.map((sub, subIndex) => {
                            sub.questions.map((que, queIndex) => {
                                que.isAnswer = false;
                                que.isBookmarked = false;
                            });
                            sub.subjectWiseAnswerCount = 0;
                        });
                    }
                    const isMockTest = CommonFunctions.isExpiredTest(
                        startDateTime,
                        duration,
                        bufferTimeInMinutes,
                    );
                    const payLoad = {
                        selectedTest: { ...responseData, isMockTest, launchDateTime: new Date() },
                        examList: { ...data, subjectwizeQuestions }
                    }
                    TestDetailsAction.setTestDeatils(payLoad);
                    history.push(UrlConfig.routeUrls.examView);
                    setOpupLoader(false);
                })
                .catch((error) => {
                    setOpupLoader(false);
                    const errorMessage = CommonFunctions.apiErrorMessage(error);
                    toast(errorMessage, {
                        type: "error",
                    });
                })
        }

    }

    const selfScheduleExamCdn = () => {
        const value = data;
        const url = `${UrlConfig.apiUrls.scheduleExam}/${value.id}/${UrlConfig.apiUrls.selfSchedule}`;
        const payload = {
            examScheduleId: value.id
        }
        Api.postApi(url, payload)
            .then((response) => {
                const { data } = response;
                if (data) {
                    launchTestFromCdnOpenExam(data);
                }
            })
            .catch((error) => {
                setOpupLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            });



    }

    const launchTestFromCdnOpenExam = (scheduledData) => {
        setOpupLoader(true)
        Api.getDirectApi(null, 'start_exam_url', scheduledData.id)
            .then((response) => {
                const data = response;
                if (data) {
                    callAPIStartTest(scheduledData.id);
                    // updateExamDataAndRedirect(data);
                    updateExamDataAndRedirectOpenExamCdn(data)
                    return response.data;
                } else {
                    setOpupLoader(false);
                    toast('No data found', {
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                setOpupLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }





    const launchTestFromCdn = () => {
        setOpupLoader(true)
        const value = data;
        Api.getDirectApi(null, 'start_exam_url', data.id)
            .then((response) => {
                const data = response;
                if (data) {
                    if (value.examScheduleAccessType === EnumConfig.ExamScheduleAccessType.open) {
                        selfScheduleExam(data);
                    } else {
                        callAPIStartTest();
                        updateExamDataAndRedirect(data);
                    }
                    return response.data;
                } else {
                    setOpupLoader(false);
                    toast('No data found', {
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                setOpupLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }
    const [timerMessage, setTimerMessage] = useState('');
    const redirectPage = () => {
        const { startDateTime } = data;
        let examStartDateTime = new Date(startDateTime);
        const currentDate = new Date();
        if (examStartDateTime > currentDate) {
            const today = moment(startDateTime.substring(0, 10)).isSame(Date.now(), 'day') ? 'Today' : moment(startDateTime.substring(0, 10)).format('DD-MM-YYYY');
            const errorMessage = 'Exam Start Time is ' + moment(startDateTime).format('LT') + ' (' + today + ')';
            // toast(errorMessage, {
            //     type: "error",
            // });
            setShowDateAlert(true);
            setTimerMessage(errorMessage);
        } else {
            
            // launchTest();
            isOpenExam ? selfScheduleExamCdn() : launchTestFromCdn();
        }


    }

    const [showDateAlert, setShowDateAlert] = useState(false);

    const showAlert = () => {
        return (
            <>
                <Alert show={showDateAlert} variant="warning">
                    <Alert.Heading>Exam Start Time!</Alert.Heading>
                    <p>
                        {timerMessage}
                    </p>
                    <hr />
                    <div className="d-flex justify-content-start">
                        <p>
                            Note: Please make sure your system date is correct.
                        </p>
                    </div>
                    <div className="d-flex justify-content-end">

                        <Button onClick={() => {
                            setShowDateAlert(false)
                            setTimerMessage('');
                        }
                        } variant="outline-success" style={{ zIndex: 99999 }} >
                            Okay got it!
                </Button>
                    </div>
                </Alert>
            </>

        )
    }



    return (

        <div className="modal-main-dark">

            <Modal show={showInstructionsModal} onHide={handleCloseInstructionModal} size="sm" className="modal-dark subject-mapping-modal" centered >
                {popupLoader && <div className="loader loader-diff-color">
                    <div className="loader-with-text">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        <p>Please wait exam is loading....</p>
                    </div>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3><GrDocumentStore size={26} />Exam Instructions</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>

                    <div className="subject-mapping-wrapper water-mark-box">
                        {showAlert()}
                        {(startTime > 0 && remainingErrorMessage) &&
                            <div className="instruction-timer-wrapper" >

                                <span>{remainingErrorMessage}</span>
                                {/* <CountDownComponent
                                    remainingDuration={startTime}
                                    colorsArray={[["#A30000", 0.33], ["#F7B801", 0.33], ["#004777"]]}
                                    onFinish={() => {
                                    }}
                                    size={70}
                                    strokeWidth={5}
                                    textStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                /> */}
                            </div>

                        }

                        {
                            (instructionSet && instructionSet.length > 0) &&
                            instructionSet.map((set, index) => {
                                return (
                                    <div className="exam-instruction-text" key={`instructions_${index}`} >
                                        {set && index != instructionSet.length - 1 && <span> {index + 1}{"."}  {set}</span>}
                                    </div>
                                )
                            })
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="footer-btn-box">
                        <div></div>
                        <Button className="uploadeBtn btn-secondary" onClick={() => {
                            redirectPage()
                        }}>
                            Launch
                   </Button>
                        {/* <Button variant="secondary" className="closeBtn" onClick={handleCloseInstructionModal}>
                            Close
                    </Button> */}
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
export default connect(mapPropsToState)(InstructionsModal);
