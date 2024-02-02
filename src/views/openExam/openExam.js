import React, { useState, useEffect } from 'react';
import { Carousel, Spinner } from 'react-bootstrap';
import assets from '../../assets';
import DemoExamModal from './Modals/demoExamModal';
import PagesHeader from '../../components/shared/Pageheader';
import { Api } from '../../services';
import { UrlConfig } from '../../config';
import { toast } from "react-toastify";
import CommonFunctions from '../../utils/CommonFunctions';
import InstructionsModal from '../exam/examList/Modals/InstructionsModal';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';


const OpenExam = (props) => {

    const [showDemoExamModal, setShowDemoExamModal] = useState(false);
    const [openExamDetails, setOpenExamDetails] = useState(null);
    const [trialOpenExamDetails, setTrialOpenExamDetails] = useState(null);
    const [showLoader, setLoader] = useState(false);
    const [launchTrialExam, setLaunchTrialExam] = useState(false);





    const handleShowDemoExamModal = () => setShowDemoExamModal(true);
    const handleCloseDemoExamModal = () => setShowDemoExamModal(false);

    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const handleShowInstructionsModal = (isTrialExam = false) => {
        if (isTrialExam) {
            if (trialOpenExamDetails) {
                setLaunchTrialExam(isTrialExam);
                setShowInstructionsModal(true);
            } else {
                toast('Exam is not yet avaialble.', {
                    type: "error",
                });
            }
        } else {
            if (openExamDetails) {
                setLaunchTrialExam(isTrialExam);
                setShowInstructionsModal(true);
            } else {
                toast('Exam is not yet avaialble.', {
                    type: "error",
                });
            }
        }

    }
    const handleCloseInstructionModal = () => setShowInstructionsModal(false)

    useEffect(() => {
        getOpenExamSchedule();
    }, []);

    const getOpenExamSchedule = () => {
        setLoader(true);
        Api.getApi(UrlConfig.apiUrls.openExamSchedule)
            .then((response) => {
                if (response) {
                    const { data } = response;
                    console.log(response, 'openExamSchedule')
                    if (data && data.length > 0) {
                        const examDetails = data[0];
                        const trialExamDetails = data[1];
                        setOpenExamDetails(examDetails);
                        setTrialOpenExamDetails(trialExamDetails)
                        console.log('getOpenExamSchedule exam details', examDetails.examScheduleAccessType)
                    } else {
                        toast('No open exam found.', {
                            type: "error",
                        });
                    }
                }
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }






    return (
        <div className="openExam-main-div">
            {showLoader &&
                <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            }

            <div className="ExamTrail">
                <div className="carousel-caption-top">
                    <div className="demo-exam-box">
                        <button type="submit" class="btn-demo-exam" onClick={() => {
                            handleShowDemoExamModal()
                        }}>How Exam Looks?</button>
                    </div>
                </div>
            </div>

            <DemoExamModal
                showDemoExamModal={showDemoExamModal}
                handleCloseDemoExamModal={handleCloseDemoExamModal}
            />
            <InstructionsModal
                showInstructionsModal={showInstructionsModal}
                handleCloseInstructionModal={handleCloseInstructionModal}
                data={launchTrialExam ? trialOpenExamDetails : openExamDetails}
                disableStartButton={false}
                isOpenExam={true}
            />




            <div><div class="page-header-wrapper"><div class="page-header">

                <li className='nav-item-dash'>
                    <Link className="nav-link exam-link" to={UrlConfig.routeUrls.exam}>
                        <i className="fa fa-clipboard menu-icon"></i>
                        <span className="menu-title">Exams</span>
                    </Link>
                </li>

                <li className='nav-item-dash'>
                    <Link className="nav-link exam-link" to={UrlConfig.routeUrls.learning}>
                        <i className="fa fa-file-text-o menu-icon"></i>
                        <span className="menu-title">Learning</span>
                    </Link>
                </li>






                <div class="right-side-box"><div class="upload-box"></div></div></div></div></div>


            <div className="common-dark-box open-exam-wrapper-exam-wrapper">
                <div className="open-exam-wrapper">
                    <Carousel indicators={false} controls={false}>
                        <Carousel.Item>
                            <img src={assets.images.Palak_01} className="openExam-image d-block w-100" alt="First slide" />

                        </Carousel.Item>
                    </Carousel>



                    {/* <div className="carousel-caption-top">
                        <div className="demo-exam-box">
                            <button type="submit" class="btn-demo-exam" onClick={() => {
                                handleShowDemoExamModal()
                            }}>How Exam Looks?</button>
                        </div>
                    </div>
                    */}




                </div>
            </div>




            <div className="openExamBtnDiv">
                
                    <div className="TimeDate">
                        <div className="div1 ">
                    <h3>{openExamDetails && moment(openExamDetails.startDateTime).format("DD-MM-YYYY")}</h3></div>
                   
                    <div className="div2">
                    <h3>{openExamDetails && moment(openExamDetails.startDateTime).format("LT")}</h3></div>
                        </div>
                
                <div className="openExamBtnDivRow">
                <div class="launch">
                    <button type="submit" class="btn-launch-trial " onClick={() => handleShowInstructionsModal(false)}  >Launch</button>
                </div>
                    <div class="launch-trial">
                        <button type="submit" class="btn-launch-trial" onClick={() => handleShowInstructionsModal(true)}  >Take Trial Exam</button>
                    </div>

                </div>

            </div>
            

        </div>
    )


}

export default OpenExam;