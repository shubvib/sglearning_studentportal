import React, { useState, useEffect } from "react";
import { Tooltip, OverlayTrigger, Accordion, Spinner } from "react-bootstrap";
import { FaBook } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";

import { BsCheckCircle, BsCircle, BsChevronDoubleDown } from "react-icons/bs";
import moment from "moment";
import { connect } from "react-redux";
import CommonFunctions from "../../../../utils/CommonFunctions";

const ExamListTableRow = (props) => {
  const {
    index,
    listKey,
    examData,
    handleRankCLick,
    handleStartButtonClick,
    startButtonIcon,
    startButtonLable,
    isMultiExpand,
    handleAkcBkcPreviewClick,
    handleReportClick,
    showExamPreviewLoader,
    showAkcBkcPreviewLoader,
  } = props;
  const {
    exam,
    startDateTime,
    bufferTimeInMinutes,
    isSubmitted,
    examName,
    showReportToStudent,
  } = examData;
  const { name, description, duration, noOfQuestion, marks } = exam;
  const [open, setOpen] = useState(false);
  const [defValue, setDefaultvalue] = useState(index);
  const [isMocktest, setIsMoctest] = useState(false);

  // chech Is MockTest
  const expiredTest = () => {
    let examPeriod = new Date(startDateTime);
    examPeriod.setMinutes(
      examPeriod.getMinutes() + duration + bufferTimeInMinutes
    );
    let currentDateTime = new Date();
    if (examPeriod < currentDateTime) {
      return true;
    }
    return false;
  };

  const mutiExpandComponenet = () => {
    return (
      <Accordion
        className={`accordian-dark-wrapper ${
          CommonFunctions.isTodaysExam(examData) ? "todays-exam" : ""
        }`}
      >
        {subContentComponent()}
      </Accordion>
    );
  };
  const singleExpandComponent = () => {
    return (
      <div
        className={`accordian-dark-wrapper ${
          CommonFunctions.isTodaysExam(examData) ? "todays-exam" : ""
        }`}
        key={`examListItem_${listKey}`}
      >
        {subContentComponent()}
      </div>
    );
  };

  const subContentComponent = () => {
    return (
      <>
        <Accordion.Toggle
          eventKey={defValue}
          key={`AccoExamListItem_${listKey}`}
          onBlur={(e) => {
            e.preventDefault();
            !isMultiExpand && setOpen(false);
          }}
          onClick={(e) => {
            setOpen(!open);
          }}
        >
          <div className="card-box-inner-wrapper">
            <div className="dark-card">
              <div className="exapand-card-row">
                <div className="row">
                  <div className="col-sm-2">
                    <div className="exapand-card-col exapand-card-col-id first-col-wrap">
                      <div className="exapnd-card-box">
                        <div className="exam-text-name-box">
                          <span className="common-text-exapand-id">
                            {index}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="exapand-card-col exapand-card-col-exam-nm second-col-wrap">
                      <div className="exapnd-card-box">
                        <div className="exam-name-box">
                          <div className="exam-text-name-box">
                            <span className="common-text-exapand" title={name}>
                              {examName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="exapand-card-col exapand-card-col-exam-nm third-col-wrap">
                      <div className="exapnd-card-box">
                        <div className="exam-name-box">
                          <div className="exam-text-name-box">
                            <span
                              className="common-text-exapand"
                              title={startDateTime}
                            >
                              {moment(startDateTime).format("DD MMM YYYY LT")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="exapand-card-col exapand-card-col-exam-nm last-col-wrap">
                      <div className="exapnd-card-box">
                        <div className="exam-name-box">
                          <div className="exam-text-name-box">
                            <span
                              className="common-text-exapand"
                              title={startDateTime}
                            >
                              {isSubmitted === true && (
                                <span className="checkbox-right-margin">
                                  <BsCheckCircle />
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={index}>
          <div className="expandable">
            <div className="exapandable-content-wrapper uk-background-muted">
              <div className="inner uk-grid">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="exapandable-content"
                      style={{ display: "block" }}
                    >
                      <div className="row">
                        <div className="col-sm-8">
                          <p>
                            <label>Description:</label>
                            {description ? description : "-"}
                          </p>
                        </div>
                        <div className="col-sm-4">
                          <p className="date-created">
                            <label>Scheduled Date:</label>
                            {moment(new Date(startDateTime)).format("lll")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="exapandable-content"
                      style={{ display: "block" }}
                    >
                      <div className="row">
                        <div className="col-sm-3">
                          <p>
                            <label>Total Questions:</label>
                            {noOfQuestion}
                          </p>
                        </div>
                        <div className="col-sm-3">
                          <p>
                            <label>Total Marks:</label>
                            {marks}
                          </p>
                        </div>
                        <div className="col-sm-3">
                          <p>
                            <label>Duration:</label>
                            {duration} (minutes)
                          </p>
                        </div>
                        <div className="col-sm-3">
                          <p>
                            <label>Buffer Time:</label>
                            {bufferTimeInMinutes} (minutes)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="exapandable-content"
                      style={{ display: "block" }}
                    >
                      <div className="row">
                        <div className="col-sm-8">
                          <p>
                            <label>Note:</label>
                            {"-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3"></div>
                  <div className="col-sm-3">
                    {/* {expiredTest() === true && <div className="exapandable-content-button-box left-btn-expand-box">
                                            <button type="submit" className={`btn btn-report ${showExamPreviewLoader ? 'disabled' : ''}`} onClick={handleRankCLick} >
                                                Rank {showExamPreviewLoader && <Spinner size="sm" animation="grow" variant="info" />}
                                            </button>
                                        </div>
                                        } */}
                  </div>
                  <div className="col-sm-3">
                    {isSubmitted === true && showReportToStudent === true && (
                      <div className="exapandable-content-button-box left-btn-expand-box">
                        <button
                          type="submit"
                          className={`btn btn-report ${
                            showExamPreviewLoader ? "disabled" : ""
                          }`}
                          onClick={handleReportClick}
                        >
                          Report{" "}
                          {showExamPreviewLoader && (
                            <Spinner
                              size="sm"
                              animation="grow"
                              variant="info"
                            />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-3">
                    <div className="exapandable-content-button-box left-btn-expand-box">
                      <button
                        type="submit"
                        className={`btn btn-next ${
                          showExamPreviewLoader ? "disabled" : ""
                        }`}
                        onMouseOver={() => setDefaultvalue(-1)}
                        onMouseLeave={() => setDefaultvalue(index)}
                        onBlur={() => setDefaultvalue(index)}
                        onClick={handleStartButtonClick}
                      >
                        Next{" "}
                        {showExamPreviewLoader && (
                          <Spinner size="sm" animation="grow" variant="info" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Accordion.Collapse>
      </>
    );
  };

  return (
    <>{isMultiExpand ? mutiExpandComponenet() : singleExpandComponent()}</>
  );
};
const mapPropsToState = (state) => {
  return {
    userData: state.userData,
    authDetails: state.authDetails,
    testDetails: state.testDetails,
    accountList: state.accountList,
  };
};
// export default ExamListTableRow;
export default connect(mapPropsToState)(ExamListTableRow);
