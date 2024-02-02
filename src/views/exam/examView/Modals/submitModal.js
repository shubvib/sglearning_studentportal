import React, { useState, useEffect } from 'react';

import { Button, Modal, Spinner } from 'react-bootstrap';
import { BsChevronDoubleDown, BsPeople, } from 'react-icons/bs';
import { GrDocumentStore } from "react-icons/gr";
import CommonFunctions from '../../../../utils/CommonFunctions';
import CountDownComponent from '../../../../components/coundown/CountDownComponent'
import { useHistory } from "react-router-dom";
import { UrlConfig, ConstantConfig } from '../../../../config';
import { Api, CommonApiCall, Network } from '../../../../services';
import { toast, ToastContainer } from "react-toastify";
import { TestDetailsAction, WarningCountAction } from '../../../../reduxManager';

import { connect } from 'react-redux';

import moment from 'moment';
import localForage from "localforage";




const SubmitPriviewMdal = (props) => {
    const {
        disableStartButton,//old props
        remaningTime, setShowAttemptedExamModal, selectedTest, returnTwonumbers, UserAnswerCount, UserBookmarkCount, UserNotAnswerCount, UserVisitedCount, setReportList, examCompleted, setExamCompleted, setDone, checkisDone,
        isMockTest = false,
        showSubmitPriviewModal, handleCloseSubmitPriviewModal, data, remainingDurationTime//new props
    } = props;
    let instructionSet = data && data.exam && data.exam.instructions ? data.exam.instructions.split('\n') : [];
    const history = useHistory();
    const [startTime, setStartTime] = useState(0);
    const [popupLoader, setOpupLoader] = useState(false)
    const [timeCompleted, setTimeCompleted] = useState(false);
    const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
    useEffect(() => {
        setCountDownTimer();

    }, [data])

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
        }
    }
    useEffect(() => {
        setTimeCompleted(false);
    }, [])
    const getAnswersForRport = () => {
        setOpupLoader(true);
        if (data && data.length > 0) {
            setIsAlreadySubmitted(true);
            let examList = [];
            examList = data;
            let ansArray = [];
            let subReport = {

                examId: "",
                examScheduleId: "",
                batchExamScheduleId: "",
                studentExamScheduleId: "",
                studentId: "",
                studentCode: 0,
                studentName: "",

                scheduledStartDateTime: moment(),
                attemptStartDateTime: moment(),
                attemptEndDateTime: moment(),
                answers: [],
                score: {
                    outOfMarks: 0,
                    scoredMarks: 0,
                    percentage: 0,
                    rank: 0,
                    subjectwizeScore: []
                }
            }
            let subArray = [];
            console.log(examList, 'examListexamListexamListexamListexamListexamListexamListexamListexamListexamList')
            examList.map((sub, subIndex) => {
                let subRep = {}

                let positive = 0;
                let negative = 0;
                sub.questions.map((question, questionIndex) => {
                    const { id, isAnswer, answerKey, questionType, negativeMarks, positiveMarks, subjectiveValue, options, selectedOption, userSelected, studentAnswer } = question;
                    if (isAnswer && isAnswer === true) {
                        let selectedOP = []
                        if (questionType == 5 || questionType == 0) {
                            studentAnswer && selectedOP.push(studentAnswer);
                            let value = []
                            value = answerKey.find(aKey => parseFloat(aKey) == parseFloat(studentAnswer));
                            if (value) {
                                positive = positive + positiveMarks;
                            } else {
                                negative = negative + negativeMarks
                            }
                        }
                        else {
                            options && options.length > 0 && options.map((option, optionIndex) => {
                                const { optionValue, key, isChecked } = option;
                                if (isChecked === true) {
                                    selectedOP.push(key);
                                    if (questionType === 1) {
                                        let value = [];
                                        value = answerKey.find(aKey => aKey === key);
                                        if (value) {
                                            positive = positive + positiveMarks;
                                        } else {
                                            negative = negative + negativeMarks
                                        }
                                    }

                                }
                            });
                            if (questionType === 2) {
                                if (answerKey.length === selectedOP.length) {
                                    let aKey = []
                                    answerKey.map(a => {
                                        const correctedAnswer = selectedOP.find((s) => s.trim().toLowerCase() === a.trim().toLowerCase());
                                        if (correctedAnswer) {
                                            aKey.push(correctedAnswer);
                                        }
                                        // let value = selectedOP.map((s) => {
                                        //     if (s.trim().toLowerCase() === a.trim().toLowerCase()) {
                                        //         akey.push(s);
                                        //         return true;
                                        //     } else {
                                        //         return false;
                                        //     }
                                        // }
                                        // );
                                        // if (value === true) {
                                        //     return a;
                                        // }
                                    });

                                    if (aKey && aKey.length === answerKey.length) {
                                        positive = positive + positiveMarks;
                                    } else {
                                        negative = negative + negativeMarks;
                                    }
                                } else {
                                    negative = negative + negativeMarks;
                                }

                            }
                        }
                        ansArray.push({
                            "questionId": id,
                            "optionKeys": selectedOP
                        });


                    }
                });
                subRep = {
                    subjectId: sub.subjectId,
                    subjectName: sub.subjectName,
                    subjectCode: null,
                    outOfMarks: sub.marks,
                    positiveMarks: positive,
                    negativeMarks: negative,
                    scoredMarks: positive - negative,
                    percentage: (positive - negative / sub.marks) * 100,
                    rank: 0
                }
                subArray.push(subRep)

                subReport.score = {
                    outOfMarks: subReport.score.outOfMarks + sub.marks,
                    scoredMarks: subReport.score.scoredMarks + subRep.scoredMarks,
                    percentage: 0,
                    rank: 0,
                    subjectwizeScore: subArray
                }
            });


            // !isMockTest && callAPI_SubmitResult(ansArray)
            callAPI_SubmitResult(ansArray, subReport);
            // generateReport(examList);
            WarningCountAction.resetWarningCount()
        } else {
            toast('Test Id not found', {
                type: "error",
            });
            setOpupLoader(false)
            handleCloseSubmitPriviewModal();
            setShowAttemptedExamModal(false);
            TestDetailsAction.resetTestDetails();
            history.push(UrlConfig.routeUrls.exam);
            WarningCountAction.resetWarningCount();

        }
    }


    const discardAPI = () => {
        if (selectedTest && selectedTest.id) {
            let payload = {
                "studentExamScheduleId": selectedTest.id,
                "studentExamActionType": 3
            }
            Api.postApi(UrlConfig.apiUrls.start_discardTest, payload)
                .then((data) => {
                    if (data) {
                        setOpupLoader(false)
                        TestDetailsAction.resetTestDetails();
                        history.push(UrlConfig.routeUrls.exam);
                        toast.success(`You are not attempted single question.`, {
                            type: "error",
                        });
                        // afterDiscard();
                    }
                    localForage.setItem('subjectwizeQuestions', null)
                })
                .catch((error) => {
                    setOpupLoader(false)

                    const errorMessage = CommonFunctions.apiErrorMessage(error);

                    toast(errorMessage, {
                        type: "error",
                    });
                    // afterDiscard();
                });
        } else {
            toast('Test Id not found', {
                type: "error",
            });
            setOpupLoader(false)
            handleCloseSubmitPriviewModal();
            setShowAttemptedExamModal(false);
            TestDetailsAction.resetTestDetails();
            history.push(UrlConfig.routeUrls.exam);
        }
    }

    const callAPI_SubmitResult = (ansArray, subReport) => {
        if (ansArray.length === 0) {
            discardAPI()
        } else {
            // generateLocalReport(subReport);
            let payload = {
                studentExamScheduleId: selectedTest.id,
                answers: ansArray,
                isMockTest: isMockTest
            }
            // Network.apiDirectRequest(null, 'POST', payload, null, '', 'submit_exam_url')
            Api.postDirectApi(payload, 'submit_exam_url')
                .then(response => {
                    const { data } = response;
                    setOpupLoader(false);
                    if (data) {
                        toast.success(`Test submited Successfully.`
                        );
                        const hideReports = CommonFunctions.hideReports(props.accountList);
                        if (!hideReports) {
                            setExamCompleted(false);
                            setDone(true);
                            let report = [];
                            report.push(data);
                            setReportList(report);
                            setShowAttemptedExamModal(false);
                            console.log('user account details', props.accountList)
                            setShowAttemptedExamModal(true);
                            console.log('postStudentResult Output', data);
                            console.log('testDetailsforSubmit Output', selectedTest);
                        } else {
                            handleCloseSubmitPriviewModal();
                            setShowAttemptedExamModal(false);
                            TestDetailsAction.resetTestDetails();
                            history.push(UrlConfig.routeUrls.exam);
                        }
                    } else {
                        console.log('user account details', props.accountList)
                        console.log('user data details details', props.userData)
                        toast.success(`Test submited Successfully.`
                        );
                        const hideReports = CommonFunctions.hideReports(props.accountList);
                        if (!hideReports) {
                            generateLocalReport(subReport);
                        } else {
                            handleCloseSubmitPriviewModal();
                            setShowAttemptedExamModal(false);
                            TestDetailsAction.resetTestDetails();
                            history.push(UrlConfig.routeUrls.exam);
                        }
                        // setShowAttemptedExamModal(false);
                    }
                    localForage.setItem('subjectwizeQuestions', null);
                    localForage.setItem('recentSubmitExamId', selectedTest.id);
                })
                .catch(error => {
                    setOpupLoader(false)

                    console.log('********Error request ', error);
                    const errorMessage = CommonFunctions.apiErrorMessage(error);

                    toast(errorMessage, {
                        type: "error",
                    });
                })


            // Api.postApi(UrlConfig.apiUrls.examSubmission, payload)
            //     .then((responce) => {
            //         const { data } = responce;
            //         if (data) {
            //             setOpupLoader(false)
            //             toast.success(`Test submited Successfully.`
            //             );
            //             setExamCompleted(false);
            //             setDone(true);
            //             let report = [];
            //             report.push(data);
            //             setReportList(report);
            //             setShowAttemptedExamModal(false);
            //             setShowAttemptedExamModal(true);
            //             console.log('postStudentResult Output', data);
            //             console.log('testDetailsforSubmit Output', selectedTest);
            //         }
            //     })
            //     .catch((error) => {
            //         setOpupLoader(false)

            //         console.log('********Error request ', error);
            //         const errorMessage = CommonFunctions.apiErrorMessage(error);

            //         toast(errorMessage, {
            //             type: "error",
            //         });

            //     });
        }
    }

    const generateLocalReport = (rep) => {
        setExamCompleted(false);
        setDone(true);
        let report = [rep];
        // report.push(data);
        setReportList(report);
        handleCloseSubmitPriviewModal();
        setShowAttemptedExamModal(true);
    }
    useEffect(() => {
        (timeCompleted === true && !isAlreadySubmitted) && getAnswersForRport();
    }, [timeCompleted]);

    return (

        <div className="modal-main-dark">
            <Modal show={showSubmitPriviewModal} onHide={() => {
                if (!examCompleted) {
                    handleCloseSubmitPriviewModal()
                }
            }} size="sm" className="modal-dark subject-mapping-modal" centered >
                {/* {popupLoader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>} */}
                {popupLoader && <div className="loader loader-diff-color">
                    <div className="loader-with-text">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        <p>Please wait exam is submitting....</p>
                    </div>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        {!examCompleted ? <h3><GrDocumentStore size={26} />Do you want to Submit Exam..?</h3>
                            : <h3><GrDocumentStore size={26} />Exam duration has been finished.</h3>
                        }
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
                                <span className="time-remain-text">Exam will be submited in </span>
                                {examCompleted && <CountDownComponent
                                    remainingDuration={10}
                                    colorsArray={[["#A30000", 0.33], ["#F7B801", 0.33], ["#004777"]]}
                                    onFinish={() => {
                                    }}
                                    size={70}
                                    strokeWidth={5}
                                    textStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                    onChange={(remainingTime) => {
                                        if (remainingTime
                                            === 0) {
                                            !checkisDone && setTimeCompleted(true);
                                        }
                                    }}
                                />}
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
                                <span className="common-text"> Bookmarked</span>
                            </div>
                            <div className="col-xs-6 color-white count">
                                <div className="question-number-panel-view-UserVisitedCount" key={2}>
                                    <div className="count-text">
                                        {returnTwonumbers(UserVisitedCount)}
                                    </div>
                                </div>
                                <span className="common-text margin-right-10"> Not Visited {"     "}</span>
                            </div>
                            <br />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="footer-btn-box">
                        <Button variant="primary" className="uploadeBtn" onClick={() => {
                            getAnswersForRport();
                        }}>
                            Submit
                   </Button>
                        <Button variant="secondary" className="closeBtn" onClick={() => {
                            if (!examCompleted) {
                                handleCloseSubmitPriviewModal()
                            }

                        }
                        }>
                            Cancel
                    </Button>
                    </div>
                </Modal.Footer>

            </Modal>
        </div >
    )
}


const mapPropsToState = (state) => {
    return {
        userData: state.userData,
        authDetails: state.authDetails,
        testDetails: state.testDetails,
        accountList: state.accountList
    }
}
export default connect(mapPropsToState)(SubmitPriviewMdal);
