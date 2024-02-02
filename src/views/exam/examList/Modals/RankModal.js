import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Card, Accordion, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { Api, CommonApiCall } from '../../../../services';
import { toast, ToastContainer } from 'react-toastify';
import CommonFunctions from '../../../../utils/CommonFunctions';
import { BsCheckCircle, BsCircle } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { UrlConfig } from '../../../../config';
import { TestDetailsAction } from '../../../../reduxManager';

import { connect } from 'react-redux';


const RankModal = (props) => {

    const { showRankModal, isNewExamSubmited = false, closeRankModal, rankList, userGivenTestList, selectedExamData } = props;
    const history = useHistory();
    const [showDetailsReport, setShowDetailsReportModal] = useState(false);
    const closeDetailsReportModal = () => setShowDetailsReportModal(false);
    const [detailedReport, setDetailedReport] = useState({});
    const [selectedReport, setSelectedReport] = useState({});
    const [showButtonLoader, setButtonLoader] = useState(false);
    //****************Main View**************************************/
    if (!rankList) {
        return null;
    }
    console.log(rankList, 'rankListrankListrankListrankList')
    const { headers, toppers } = rankList;



    return (

        <div className="modal-main-dark">

            <Modal show={showRankModal} onHide={() => {
                closeRankModal()
            }} centered size="md" className="modal-dark attempted-exam-modal" backdrop="static" >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <span>Exam Toppers</span>
                        {/* <span>Total attended exam count: {rankList.length}</span> */}
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="rank-table">
                        <div className="rank-table-wrapper">
                            <div className="rank-table-title-box">
                                <span>Your Rank</span>
                            </div>
                            <table>
                                <tr className="rank-table-header">
                                    <th>Name</th>
                                    <th>Code</th>
                                    {toppers && toppers[1] && toppers[1].score && toppers[1].score.subjectwizeScore.map((h, hi) => {
                                        return (
                                            <th>{h.subjectName}</th>
                                        )
                                    })
                                    }
                                    <th>Total Marks</th>

                                    <th>Rank</th>
                                </tr>
                                {toppers && toppers.map((top, index) => {
                                    if (index === 0) {
                                        return false
                                    }
                                    if (index !== 1) {
                                        return false
                                    }
                                    return (
                                        <div className="scroll-table">
                                            <tr className={toppers.length === 11 && index === 0 ? "rank-Own" : ""}>
                                                <td>{top.studentName}</td>
                                                <td>{top.studentCode}</td>
                                                {top.score.subjectwizeScore.map((h, hi) => {
                                                    return (
                                                        <td>{h.rank}</td>
                                                    )
                                                })
                                                }
                                                <td>{top.score.scoredMarks}</td>
                                                <td>{top.score.rank}</td>
                                            </tr>
                                        </div>
                                    )
                                })
                                }
                            </table>
                        </div>
                        <div className="rank-table-wrapper">
                            <div className="rank-table-title-box">
                                <span>Exam Toppers</span>
                            </div>
                            <table>
                                <div className="scroll-table" style={{ overflowY: 'auto', maxHeight: '40vh' }}>
                                    <tr className="rank-table-header">
                                        <th>Name</th>
                                        <th>Code</th>
                                        {toppers && toppers[1] && toppers[1].score && toppers[1].score.subjectwizeScore.map((h, hi) => {
                                            return (
                                                <th>{h.subjectName}</th>
                                            )
                                        })
                                        }
                                        <th>Total Marks</th>
                                        <th>Rank</th>
                                    </tr>
                                </div>
                                <div className="scroll-table" style={{ overflowY: 'auto', maxHeight: '40vh' }}>
                                    {toppers && toppers.map((top, index) => {
                                        if (index === 0 || index === 1) {
                                            return false
                                        }
                                        return (

                                            <tr className={toppers.length === 11 && index === 0 ? "rank-Own" : ""}>
                                                <td>{top.studentName}</td>
                                                <td>{top.studentCode}</td>
                                                {top.score.subjectwizeScore.map((h, hi) => {
                                                    return (
                                                        <td>{h.rank}</td>
                                                    )
                                                })
                                                }
                                                <td>{top.score.scoredMarks}</td>
                                                <td>{top.score.rank}</td>
                                            </tr>

                                        )
                                    })
                                    }
                                </div>
                            </table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={() => {
                        TestDetailsAction.resetTestDetails();
                        closeRankModal(false);
                        // history.push(UrlConfig.routeUrls.exam);
                    }}>
                        ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


const mapPropsToState = (state) => {
    return {
        testDetails: state.testDetails
    }
}
export default connect(mapPropsToState)(RankModal);

