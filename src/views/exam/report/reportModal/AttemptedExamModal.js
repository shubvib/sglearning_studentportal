import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Card, Accordion, Spinner } from 'react-bootstrap';
import DetailsReportModal from './DetailsReportModal';
import moment from 'moment';
import { Api, CommonApiCall } from '../../../../services';
import { toast, ToastContainer } from 'react-toastify';
import CommonFunctions from '../../../../utils/CommonFunctions';
import { BsCheckCircle, BsCircle } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { UrlConfig, ConstantConfig } from '../../../../config';
import { TestDetailsAction } from '../../../../reduxManager';

import { connect } from 'react-redux';
import Axios from 'axios';

const AttemptedExamModal = (props) => {
    const { showAttemptedExamModal, isNewExamSubmited = false, closeAttemptedExamModal, reportList, userGivenTestList, selectedExamData } = props;
    const history = useHistory();
    const [showDetailsReport, setShowDetailsReportModal] = useState(false);
    const closeDetailsReportModal = () => setShowDetailsReportModal(false);
    const [detailedReport, setDetailedReport] = useState({});
    const [selectedReport, setSelectedReport] = useState({});
    const [showButtonLoader, setButtonLoader] = useState(false);
    //****************Main View**************************************/
    const getReportbyScheduleID = (id) => {
        Api.getApi('studentExamSubmission/' + id + '/reports')
            .then((response) => {
                console.log(response);
                const { data } = response;
                if (data && data.length != 0) {
                    data.reverse();

                } else {
                    toast('Something goes wrong..!', {
                        type: "error",
                    });
                }
            }).catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                // setAddPopupLoader(false);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }

    const getDetailedReport = (id, data) => {
        if (!id) {
            const errorMessage = 'please wait for result submission...!';
            toast(errorMessage, {
                type: "error",
            });
            return
        }
        const showReport = CommonFunctions.canShowDetailReport(selectedExamData);
        if (showReport) {
            setButtonLoader(true);
            getQuestionPaper(data);
            // Api.getApi('studentExamSubmission/' + id + '/detailReport')
            //     .then((response) => {
            //         // setButtonLoader(false);
            //         console.log(response);
            //         const { data } = response;
            //         if (data) {
            //             console.log(data)
            //             getQuestionPaper(data);
            //             // setDetailedReport(data);
            //             // setShowDetailsReportModal(true)
            //         } else {
            //             setButtonLoader(false);
            //             toast('Something goes wrong..!', {
            //                 type: "error",
            //             });
            //         }
            //     }).catch((error) => {
            //         setButtonLoader(false);
            //         const errorMessage = CommonFunctions.apiErrorMessage(error);
            //         console.log('errorMessage', errorMessage);
            //         toast(errorMessage, {
            //             type: "error",
            //         });
            //     });
        } else {
            const { startDateTime, exam, bufferTimeInMinutes } = selectedExamData;
            let examEndTime = new Date(startDateTime);
            const { duration } = exam;
            const techBuffer = 15;
            examEndTime.setMinutes(examEndTime.getMinutes() + duration + bufferTimeInMinutes + ConstantConfig.exam.technicalBufferTime);
            const errorMessage = `Detail report will be available after ${examEndTime ? moment(examEndTime).format('MMMM Do YYYY, hh:mm a') : ''}`;
            toast.error(errorMessage);
        }


    }

    const getQuestionPaper = (data) => {
        const { questionSetDataUrl } = data;
        // const questionSetDataUrl = " https://sglearningfilestorage-dev-cdn.azureedge.net/questionsetdatafiles/51b6bd1a-790e-4449-a735-084a92e39b65%2Feb129bae-41c4-4057-8741-7ae0edd843b9";
        // const questionSetDataUrl = " https://sglearningfilestorage.blob.core.windows.net/questionsetdatafiles/51b6bd1a-790e-4449-a735-084a92e39b65%2Fc14fae53-2c31-49e5-8a2f-1b863d0bca2b";
        Axios.get(questionSetDataUrl)
            .then((response) => {
                console.log('CDN json data', response);
                const { answers } = data;
                const { subjectwizeQuestions } = response;
                if (subjectwizeQuestions && subjectwizeQuestions.length > 0) {
                    subjectwizeQuestions.map((subQue, idx) => {
                        const { questions } = subQue;
                        questions.map((que, index) => {
                            const answerObj = answers.find((ans) => ans.questionId === que.id)
                            if (answerObj) {
                                que = { ...que, ...answerObj, studentAnswer: answerObj.optionKeys }; 
                            }
                            questions[index] = que;
                            return true;
                        });
                        // subjectwizeQuestions[idx] = { ...subQue, questions };
                        return true;
                    });
                    const detailReportData = { ...data, subjectwizeQuestions };
                    setDetailedReport(detailReportData);
                    setShowDetailsReportModal(true)
                }
                setButtonLoader(false);
            })
            .catch((error) => {
                setButtonLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            })
    }



    return (

        <div className="modal-main-dark">
            {showDetailsReport && <DetailsReportModal
                showDetailsReportModal={showDetailsReport}
                closeDetailsReportModal={closeDetailsReportModal}
                detailedReport={detailedReport}
                reportList={selectedReport}
            />}
            <Modal show={showAttemptedExamModal} onHide={() => {


                !isNewExamSubmited && closeAttemptedExamModal();
            }} centered size="md" className="modal-dark attempted-exam-modal" backdrop="static" >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    {!isNewExamSubmited && <div className="modal-title-box">
                        <span>Attended Exam</span>
                        <span>Total attended exam count: {reportList.length}</span>
                    </div>}
                </Modal.Header>

                <Modal.Body>
                    <div className="attempted-exam-list">
                        <Accordion>{reportList.map((r, index) => {
                            // if (e.isSubmitted === false) return
                            return <div key={`examreportList_${index}`}>{<div>
                                <Accordion.Toggle as={Card.Header} eventKey={index}
                                    onClick={() => {

                                    }}>
                                    <div className="row">
                                        <div className="col-sm-1">
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className="col-sm-3">
                                            <span>{moment(r.attemptEndDateTime).format('DD MMM YYYY, hh:mm a')}</span>
                                        </div>
                                        <div className="col-sm-6">
                                            <span> {
                                                r.score.subjectwizeScore.map((sub, subIndex) => {
                                                    return <span className="subject-marks" key={`subjectName_${subIndex}`}>
                                                        <span><label>{sub.subjectName} :</label> {sub.scoredMarks},</span>
                                                    </span>
                                                })
                                            }
                                                <span className="total-count"><label> Total Marks : </label> {r.score.scoredMarks}.</span>
                                            </span>
                                        </div>
                                        <div className="col-sm-2">
                                            {(r && r.id) && <span>

                                                <Button variant="secondary" className={`uploadeBtn ${showButtonLoader ? 'disabled' : ''}`} onClick={() => {
                                                    setSelectedReport(r);
                                                    getDetailedReport(r.id, r);
                                                }}>
                                                    Detail Report  {(showButtonLoader && (selectedReport && selectedReport.id === r.id)) && <Spinner size="sm" animation="grow" variant="info" />}
                                                </Button>
                                            </span>}
                                        </div>
                                    </div>
                                </Accordion.Toggle>
                            </div>
                            }
                            </div>
                        })}
                        </Accordion>
                    </div>

                </Modal.Body>
                {isNewExamSubmited && <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={() => {
                        TestDetailsAction.resetTestDetails();
                        setShowDetailsReportModal(false);
                        history.push(UrlConfig.routeUrls.exam);
                    }}>
                        ok
                    </Button>
                </Modal.Footer>}
            </Modal>
        </div>
    )
}


const mapPropsToState = (state) => {
    return {
        testDetails: state.testDetails
    }
}
export default connect(mapPropsToState)(AttemptedExamModal);

