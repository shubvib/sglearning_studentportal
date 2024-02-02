import React, { useState, useEffect, createRef } from "react";
import { Button, Modal, Tab, Nav, Card, Tabs, Alert } from "react-bootstrap";
import { FaBook } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime, GrOrganization } from "react-icons/gr";
import { BsChevronDoubleDown } from "react-icons/bs";
import moment from "moment";
import { Api, CommonApiCall, Network } from "../../../services";
import { useHistory } from "react-router-dom";
import { UrlConfig } from "../../../config";
import CommonFunctions from "../../../utils/CommonFunctions";
import { BsCheckCircle, BsCircle, BsBookmark } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import useForceUpdate from "use-force-update";
import CountDownComponent from "../../../components/coundown/CountDownComponent";
import SubmitPriviewMdal from "./Modals/submitModal";
import BannedPriviewMdal from "./Modals/bannedModal";
import DiscardExam from "./Modals/discardExam";
import WarningExam from "./Modals/warnigModal";
import AttemptedExamModal from "../report/reportModal/AttemptedExamModal";
import { connect } from "react-redux";
import { TestDetailsAction } from "../../../reduxManager";
import localForage from "localforage";
import EnumConfig from "../../../config/EnumConfig";
import { WarningCountAction } from "../../../reduxManager";

let divRefs;
let numberFieldRefs;

const ExamView = (props) => {
  const history = useHistory();
  const [isFullscreen, setFullscreen] = useState(false);
  const [examData, setExamData] = useState(null);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [questionIndex, setquestionIndex] = useState(0);
  const [optionIndex, setOptionIndex] = useState(0);
  const [testDetails, setTestdetails] = useState();
  const [examDuration, setDuration] = useState(0);
  const [istoggle, setisToggle] = useState(true);
  // ************************get User count ***********************
  const [UserAnswerCount, setUserAnswerCount] = useState(0);
  const [UserAnserCountSectionB, setUserAnserCountSectionB] = useState(0);
  const [UserNotAnswerCount, setUserNotAnswerCount] = useState(0);
  const [UserBookmarkCount, setUserBookmarkCount] = useState(0);
  const [UserVisitedCount, setUserVisitedCount] = useState(0);
  const [remaningTime, setExamRemainingDuration] = useState(0);
  const [showAttemptedExamModal, setShowAttemptedExamModal] = useState(false);
  const [reportList, setReportList] = useState([]);
  //*************Modal Visible and hide */
  const closeAttemptedExamModal = () => setShowAttemptedExamModal(false);
  const [showSubmitPriviewModal, setshowSubmitPriviewModal] = useState(false);
  const [showBannedPriviewModal, setshowBannedPriviewModal] = useState(false);
  const [showDiscardModal, setshowDiscardModal] = useState(false);
  const [showWarningModal, setshowWarningModal] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [checkisDone, setDone] = useState(false);
  const [isMockTest, setIsMockTest] = useState(false);

  const handleCloseSubmitPriviewModal = () => setshowSubmitPriviewModal(false); //submitModal
  const handleCloseBannedPriviewModal = () => setshowBannedPriviewModal(false); //submitModal
  const handleCloseshowDiscardModal = () => setshowDiscardModal(false); //discard Modal
  const handleCloseshowWarningModal = () => setshowWarningModal(false); //discard Modal

  ///////////////////////////Start alertBox Modal/////////////////////////////////////////////////

  const [show, setShow] = useState(false);

  ///////////////////////////End alertBox Modal/////////////////////////////////////////////////

  const forceUpdate = useForceUpdate();
  const handleClick = () => {
    forceUpdate();
  };

  useEffect(() => {
    console.log("props exam", props.testDetails);
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        console.log("Close");
        setshowDiscardModal(true);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      divRefs = null;
      numberFieldRefs = null;
    };
  }, []);
  ///////////////////////////////////for visibility alert start///////////////////////////

  const [examFocus, setExamFocus] = useState(true);
  const [alertCount, setAlertCount] = useState(props.warningCount);

  useEffect(() => {
    const {examList}= props.testDetails;
    const {exam}= examList
  const {organizerAccountName}= exam;

  // console.log(
  //   organizerAccountName,
  //   "organizerAccountName organizerAccountName"
  // );


    const handleActivityFalse = () => {
      setExamFocus(false);

      console.log(examFocus, "examFocus from handleActivityFalse");
    };

    const handleActivityTrue = () => {
      setExamFocus(true);
      setAlertCount(alertCount + 1);
      WarningCountAction.setWarningCount(alertCount);
      console.log(examFocus, "examFocus from handleActivityTrue");
      console.log(alertCount, "examFocus from handleActivityTrue");
    };

    if (organizerAccountName === EnumConfig.QuestionShuffle.organizerAccountName) {
      window.addEventListener("focus", handleActivityTrue);
      window.addEventListener("blur", handleActivityFalse);
    }

    return () => {
      if (organizerAccountName === EnumConfig.QuestionShuffle.organizerAccountName) {
        window.removeEventListener("focus", handleActivityTrue);
        window.removeEventListener("blur", handleActivityFalse);
      }
    };
  }, [examFocus]);

  useEffect(() => {
    if (alertCount === 0) {
      return;
    } else {
      if (alertCount > 2) {
        setshowBannedPriviewModal(true);
        console.log(
          alertCount,
          "WarningCountActionWarningCountActionWarningCountAction"
        );
      } else {
        setshowWarningModal(true);
        console.log(
          alertCount,
          "setshowWarningModalsetshowWarningModalsetshowWarningModal"
        );
      }
    }
  }, [alertCount]);

  ///////////////////////////////////for visibility alert end///////////////////////////

  const checkFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  useEffect(() => {
    if (props.testDetails) {
      console.log(
        props.testDetails,
        "testDetailstestDetailstestDetailstestDetails"
      );
      const { examList, selectedTest } = props.testDetails;
      if (examList && selectedTest) {
        if (selectedTest && selectedTest.exam) {
          const {
            exam,
            bufferTimeInMinutes,
            startDateTime,
            isSubmitted,
            launchDateTime,
          } = selectedTest;
          let mockTestDefined = selectedTest.isMockTest;
          const { duration } = exam;
          let durationInSeconds = duration ? duration * 60 : 0;
          let examPeriod = new Date(startDateTime);
          let userExamPeriod = new Date(launchDateTime);

          if (bufferTimeInMinutes) {
            examPeriod.setMinutes(
              examPeriod.getMinutes() + duration + bufferTimeInMinutes
            );
          } else {
            examPeriod.setMinutes(examPeriod.getMinutes() + duration);
          }

          userExamPeriod.setMinutes(userExamPeriod.getMinutes() + duration);

          let currentDateTime = new Date();
          setIsMockTest(isSubmitted);
          if (
            (examPeriod > currentDateTime || !mockTestDefined) &&
            !isSubmitted
          ) {
            let availableTime;
            if (userExamPeriod <= examPeriod) {
              availableTime = moment(userExamPeriod).diff(
                moment(currentDateTime),
                "second"
              );
            } else {
              availableTime = moment(examPeriod).diff(
                moment(currentDateTime),
                "second"
              );
            }
            if (durationInSeconds > availableTime) {
              durationInSeconds = availableTime > 5 ? availableTime : 5;
            }
          } else {
            setIsMockTest(true);
          }
          setDuration(durationInSeconds);
          // setDuration(dur);
        }
        selectedTest && setTestdetails(selectedTest);
        const { subjectwizeQuestions } = examList;
        console.log(examList, "examDatae xamDataexamData");
        const { exam } = examList;
        const { organizerAccountName,courses } = exam;
        console.log(courses[0].name, "courses[0].namecourses[0].name")
        /************************************ Exam Shuffle start *********************************************************/
      if(organizerAccountName===EnumConfig.QuestionShuffle.organizerAccountName)
        {
          debugger
          function shuffle(array) {

          const ShuffleTerms = (array) => {
            let currentIndex = array.length,
              randomIndex;
            console.log(currentIndex, "currentIndexcurrentIndexcurrentIndex");

            // While there remain elements to shuffle...
            while (currentIndex != 0) {
              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex--;

              // And swap it with the current element.
              [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
              ];
            }
            return array;
          };

          let newArry3;
          if(courses[0].name==="JEE") {
            let indexToSplit = EnumConfig.QuestionShuffle.numberOfMCQ;
            let first = array.slice(0, indexToSplit);
            let second = array.slice(indexToSplit);

            console.log(array, "array from Shuffle");
            console.log(first, "first from Shuffle");
            console.log(second, "second from Shuffle");
            let newArry1 = ShuffleTerms(first);
            let newArry2 = ShuffleTerms(second);
            newArry3 = [...newArry1, ...newArry2];
  
            console.log(newArry3, "newArry3 from Shuffle");
            //  console.log(array, "array from Shuffle")
  
            return newArry3;
} else{
  return newArry3 = ShuffleTerms(array);

}
        
        }

        // Used like so
        // var arr = [2, 11, 37, 42];
        let arr = subjectwizeQuestions.map((sub, index) => {
          let shuffledArray = sub.questions.splice(
            0,
            sub.questions.length,
            ...shuffle(sub.questions)
          );
          return shuffledArray;
        });

        console.log(arr, "final shuffled array");
      }

        /****************************************** Exam Shuffle end **********************************************************/

        subjectwizeQuestions && setExamData(subjectwizeQuestions);
        if (subjectwizeQuestions && subjectwizeQuestions.length > 0) {
          localForage
            .getItem("subjectwizeQuestions")
            .then(function (value) {
              if (value) {
                setExamData(value);
              } else {
                // /************************************ Exam Shuffle start *********************************************************/

                // function shuffle(array) {
                //   let currentIndex = array.length,  randomIndex;
                //   console.log(currentIndex, "currentIndexcurrentIndexcurrentIndex")

                //   // While there remain elements to shuffle...
                //   while (currentIndex != 0) {

                //     // Pick a remaining element...
                //     randomIndex = Math.floor(Math.random() * currentIndex);
                //     currentIndex--;

                //     // And swap it with the current element.
                //     [array[currentIndex], array[randomIndex]] = [
                //       array[randomIndex], array[currentIndex]];
                //   }

                //   return array;
                // }

                // // Used like so
                // // var arr = [2, 11, 37, 42];
                //  let arr = subjectwizeQuestions.map((sub, index)=>{
                //   return shuffle(sub.questions)
                //  });

                //  console.log(arr,"subjectwizeQuestions From Question Shuffle Function")

                // /****************************************** Exam Shuffle end **********************************************************/

                console.log(
                  subjectwizeQuestions,
                  "subjectwizeQuestions From Question Shuffle"
                );

                setExamData(subjectwizeQuestions);
              }
            })
            .catch(function (err) {
              setExamData(subjectwizeQuestions);
              console.log(err);
            });

          if (!isFullscreen) {
            checkFullscreen();
            setFullscreen(true);
          }
          divRefs = {};
          numberFieldRefs = {};
          subjectwizeQuestions.map((sub, idx) => {
            const subjectWiseRefs = sub.questions.reduce((acc, value) => {
              acc[value.id] = React.createRef();
              return acc;
            }, {});
            divRefs = Object.assign(subjectWiseRefs, divRefs);
          });

          subjectwizeQuestions.map((sub, idx) => {
            const inputFieldRefs = sub.questions.reduce((acc, value) => {
              const { questionType } = value;
              // if (questionType === 0 || questionType === 5) {
              acc[`${value.id}_numeric`] = React.createRef();
              return acc;
              // }
            }, {});
            if (inputFieldRefs) {
              numberFieldRefs = Object.assign(inputFieldRefs, numberFieldRefs);
            }
          });

          console.log("numberFieldRefs", numberFieldRefs);
          console.log("divRefs type", typeof divRefs);
        } else {
          // history.push(UrlConfig.routeUrls.exam);
        }
      }
    }
  }, [props.testDetails]);

  const checkQuastionType = (type) => {
    switch (type) {
      case 1:
        return "Single choice";
        break;
      case 2:
        return "Multi choice";
        break;

      case 5 || 0:
        return "Numerical Type";
        break;
      default:
    }
  };
  const bookmarkQuestions = (question) => {
    question.isBookmarked = !question.isBookmarked;
    getCount();
  };
  useEffect(() => {
    examData && examData.length > 0 && getCount();
  }, [examData]);
  const updateReduxData = () => {
    if (props.testDetails && examData && examData.length > 0) {
      localForage.setItem("subjectwizeQuestions", examData);
      // const { examList, selectedTest } = props.testDetails;
      // const payLoad = {
      //     selectedTest: selectedTest,
      //     examList: { ...examList, subjectwizeQuestions: examData }
      // }
      // TestDetailsAction.setTestDeatils(payLoad);
    }
  };
  const SelectCheckBox = (option, question, questionindex, opIndex) => {
    if (!isFullscreen) {
      //  checkFullscreen();
    }
    let tempExamdata = examData;
    setquestionIndex(questionindex);
    setOptionIndex(opIndex);
    question.isAnswer = false;

    if (question.questionType === 1) {
      question.options.map((e, i) => {
        if (!e.isChecked) {
          opIndex === i ? (e.isChecked = true) : (e.isChecked = false);
          if (e.isChecked === true) {
            question.isAnswer = true;
          }
        } else {
          e.isChecked = false;
        }
      });
      tempExamdata[questionindex] &&
        tempExamdata[questionindex].question &&
        (tempExamdata[questionindex].question = question);
      setExamData(tempExamdata);
      // updateReduxData();
      getCount();
    } else if (question.questionType === 2) {
      option.isChecked ? (option.isChecked = false) : (option.isChecked = true);
      if (option.isChecked === true) {
        question.isAnswer = true;
      }
      if (1 === 1) {
        question.options.map((o, oI) => {
          if (o.isChecked === true) {
            opIndex !== oI && (question.isAnswer = true);
          }
        });
      }
      // updateReduxData();
      getCount();
    } else {
      // updateReduxData();
      getCount();
    }
    console.log(UserAnswerCount, "UserAnswerCount");
  };

  const handleQuestionPannelClick = (id, quetionArrayLength, idx) => {
    console.log("div refs length", quetionArrayLength);
    console.log("div refs idx", idx);
    if (divRefs && divRefs[id]) {
      // const index = divRefs.findIndex(divRefs[id])
      // alert(index);
      divRefs[id].current.scrollIntoView({
        // behavior: 'smooth',
        block: `${quetionArrayLength === idx + 1 ? "end" : "center"}`,
      });
    }
  };

  const questionListView = (questinList) => {
    let columns = [];
    let css = "";
    questinList.forEach((item, idx) => {
      if (
        props.testDetails.examList.exam.courses[0].name === "NEET" &&
        idx === 0
      ) {
        columns.push(
          <div style={{ width: "100%", padding: "20px" }}>
            <div
              style={{
                background: "#1e90ff",
                paddingBottom: "4px",
                paddingTop: "4px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Section A
            </div>
          </div>
        );
      }

      if (
        props.testDetails.examList.exam.courses[0].name === "NEET" &&
        idx === EnumConfig.NEETSection.constForSectionB
      ) {
        columns.push(
          <div style={{ width: "100%", padding: "20px" }}>
            <div
              style={{
                background: "tomato",
                paddingBottom: "4px",
                paddingTop: "4px",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Section B
            </div>
          </div>
        );
      }

      if (item.isBookmarked === true) {
        css = "question-number-panel-view-bookmark";
      } else if (item.isAnswer === true) {
        css = "question-number-panel-view-answer";
      } else {
        css = "question-number-panel-view";
      }
      // push column
      columns.push(
        <div
          className={css}
          key={`qPannel_${idx}`}
          onClick={() =>
            handleQuestionPannelClick(item.id, questinList.length, idx)
          }
          style={{ cursor: "pointer" }}
        >
          {props.testDetails.examList.exam.courses[0].name === "NEET" &&
          idx < EnumConfig.NEETSection.constForSectionB ? (
            <>
              <div className="count-text">{returnTwonumbers(idx + 1)}</div>
            </>
          ) : props.testDetails.examList.exam.courses[0].name === "NEET" &&
            idx >= EnumConfig.NEETSection.constForSectionB ? (
            <>
              <div className="count-text">
                {returnTwonumbers(
                  idx + 1 - EnumConfig.NEETSection.constForSectionB
                )}
              </div>
            </>
          ) : (
            <>
              <div className="count-text">{returnTwonumbers(idx + 1)}</div>
            </>
          )}
        </div>
        // <div className=" question-number-panel-view-UserAnswerCount " >
        //     <div className="count-text">
        //         {returnTwonumbers(UserAnswerCount)}
        //     </div>
        // </div>
      );

      if ((idx + 1) % 5 === 0) {
        columns.push(<div className="w-100"></div>);
      }
    });

    return columns;
  };
  const retrunBackgroundColor = (que) => {
    return "question-box-quastion-box-attend";
    if (que.isBookmarked === true) {
      return "background-color-lowender ";
    } else if (que.isAnswer === true) {
      return "background-color-green";
    } else {
      return "question-box-quastion-box-attend";
    }
  };
  const returnTwonumbers = (value) => {
    if (value <= 9) {
      return "0" + value;
    } else {
      return value;
    }
  };

  const getCount = () => {
    let newExamListArray = examData;
    let anserCount = 0;
    let notAnswerCount = 0;
    let bookmarkCount = 0;
    let visitedCount = 0;
    examData &&
      examData.length > 0 &&
      newExamListArray.map((sub, subIndex) => {
        let ntCount = 0;
        let inputAnswerCount = 0;
        let anserCountSectionB = 0;

        sub.questions.map((que, queIndex) => {
          que.isAnswer === true && (anserCount = anserCount + 1);
          {
            queIndex > EnumConfig.NEETSection.constForSectionB &&
              que.isAnswer === true &&
              (anserCountSectionB = anserCountSectionB + 1);
          }

          que.isAnswer === true &&
            (que.questionType === 5 || que.questionType === 0) &&
            (inputAnswerCount = inputAnswerCount + 1);

          que.isAnswer === false && (ntCount = ntCount + 1);
          que.isAnswer === false && (notAnswerCount = notAnswerCount + 1);
          que.isBookmarked === true && (bookmarkCount = bookmarkCount + 1);
          if (subjectIndex >= subIndex && questionIndex >= queIndex) {
            que.isAnswer === false && (visitedCount = visitedCount + 1);
          }
        });
        sub.subjectWiseAnswerCount = ntCount;
        if (subjectIndex >= subIndex) {
          sub.anserCountSectionB = anserCountSectionB;
          console.log(sub.anserCountSectionB, "sub.anserCountSectionB");
        }

        sub.inputAnswerCount = inputAnswerCount;
      });
    console.log(newExamListArray, "sub.newExamListArray");

    setUserAnswerCount(anserCount);
    // setUserAnserCountSectionB(anserCountSectionB);
    setUserNotAnswerCount(notAnswerCount);
    setUserBookmarkCount(bookmarkCount);
    setUserVisitedCount(0);
    setExamData(newExamListArray);
    updateReduxData();
  };

  const bookmarkAndAnswer = (question) => {
    const { isBookmarked, isAnswer } = question;
    if (isAnswer === true && isBookmarked === true) {
      return (
        <div className="row cursor-pointer">
          <div
            className="answer-panle-selected col-md-6"
            onClick={() => {
              bookmarkQuestions(question);
            }}
          >
            <span className="bookmark-icon-span">
              <span className="bookmark-icon-text">
                {isAnswer === true && "Answered"}{" "}
              </span>
              <span className="checkbox-right-margin">
                <BsCheckCircle />
              </span>
            </span>
          </div>
          <div
            className="bookamark-panle-selected col-md-6"
            onClick={() => {
              bookmarkQuestions(question);
            }}
          >
            <span className="bookmark-icon-text">
              {isBookmarked === true ? "Bookmarked" : "Bookmark"}{" "}
            </span>
            <span className="bookmark-icon-span">
              <BsBookmark />
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row cursor-pointer">
          <div
            className={
              isAnswer === false && isBookmarked === false
                ? "bookamark-panle-default col-12"
                : isBookmarked === true
                ? "bookamark-panle-selected col-12"
                : "answer-panle-selected col-12"
            }
            onClick={() => {
              bookmarkQuestions(question);
            }}
          >
            <span className="bookmark-icon-text">
              {/* Bookmark */}
              {isBookmarked === true ? "Bookmarked" : "Bookmark"}
            </span>
            <span className="bookmark-icon-span">
              <BsBookmark />
            </span>
          </div>
        </div>
      );
    }
  };

  const TopContainer = () => {
    return (
      <div className="test-information test-information-top-wrapper">
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 color-white">
            {testDetails &&
              testDetails.student &&
              testDetails.student.userInfo &&
              testDetails.student.userInfo.name && (
                <h5 className="text-size-12 margin-left-20">
                  {testDetails.student.userInfo.name}
                  {testDetails &&
                    testDetails.student &&
                    testDetails.student.code && (
                      <span className="text-size-12" style={{ marginLeft: 8 }}>
                        [{testDetails.student.code}]
                      </span>
                    )}
                </h5>
              )}
          </div>
        </div>
        <div className="test-information row">
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 color-white">
            <h5 className="text-size-12 margin-left-20">
              {testDetails && testDetails.examName && testDetails.examName}
            </h5>
          </div>
          <div
            className={`col-xl-4 col-lg-4 col-md-4 col-sm-4 color-white ${
              isMockTest ? "" : "disabled"
            }`}
          >
            <button
              type="submit"
              className="btn-test-discard color-white"
              onClick={() => {
                setshowDiscardModal(true);
              }}
            >
              {"Discard Exam"}{" "}
            </button>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 color-white ">
            <div className="instruction-timer-wrapper">
              <CountDownComponent
                setExamRemainingDuration={setExamRemainingDuration}
                remainingDuration={examDuration}
                colorsArray={[
                  ["#ccf8db", 0.33],
                  ["#06d12f", 0.33],
                  ["#A30000"],
                ]}
                onFinish={() => {}}
                size={58}
                strokeWidth={5}
                textStyle={{ fontSize: 14, paddingHorizontal: 5, margin: 5 }}
                onChange={(remainingTime) => {
                  setExamRemainingDuration(remainingTime);
                  if (remainingTime === 0) {
                    !checkisDone && setExamCompleted(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    examCompleted && setshowSubmitPriviewModal(true);
  }, [examCompleted]);

  const SideComponent = () => {
    return (
      <div className="col-md-3 grid-margin">
        <div className="test-information row">
          <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6 color-white count">
            <div className=" question-number-panel-view-UserAnswerCount ">
              <div className="count-text">
                {returnTwonumbers(UserAnswerCount)}
              </div>
            </div>
            <span className="common-text"> Answered</span>
          </div>
          <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6 color-white count">
            <div
              className="question-number-panel-view-UserNotAnswerCount"
              key={2}
            >
              <div className="count-text">
                {returnTwonumbers(UserNotAnswerCount)}
              </div>
            </div>
            <span className="common-text">Not Answered</span>
          </div>
        </div>
        <div className="test-information row ">
          <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6 color-white count">
            <div className=" question-number-panel-view-UserBookmarkCount ">
              <div className="count-text">
                {returnTwonumbers(UserBookmarkCount)}
              </div>
            </div>
            <span className="common-text"> Bookmarked</span>
          </div>
          <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6 color-white count">
            <div className="question-number-panel-view-UserVisitedCount">
              <div className="count-text">
                {returnTwonumbers(UserVisitedCount)}
              </div>
            </div>
            <span className="common-text"> Not Visited</span>
          </div>
          <br />
          <br />
          <br />
        </div>
        <div className="answer-box panel-height ">
          {
            // examData && examData.length > 0 && examData.map((sub, subIndex) => {
            // return
            examData && examData[subjectIndex] && (
              <div className="subject-List" key={`subjectList_${subjectIndex}`}>
                <div className="subject-name color-white">
                  {examData[subjectIndex].subjectName}
                </div>
                <div className="row question-number-side-panel">
                  {questionListView(examData[subjectIndex].questions)}
                </div>
              </div>
            )
            // })
          }
        </div>
      </div>
    );
  };

  const handleInputChange = (e, que, sub) => {
    if (sub) {
      const { questions } = sub;
      // const inputQuestions = questions.filter((que) => que.questionType === 5 && que.studentAnswer);
      // console.log(inputQuestions)
    }

    que.studentAnswer = e.target.value;
    // console.log(que.studentAnswer);
    que.studentAnswer ? (que.isAnswer = true) : (que.isAnswer = false);
    getCount();
  };

  return (
    <div className="main-exam-container">
      {window &&
        window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "math-panel"])}

      <div className="row">
        <div
          className={
            istoggle
              ? "modal-main-dark col-md-9"
              : "modal-main-dark  col-xl-12 col-lg-12 col-md-12 col-sm-12"
          }
        >
          {examDuration && TopContainer()}
          <div className="modal-dark details-report-modal main-question-panel-view">
            <div className="details-report-tab">
              <Tab.Container defaultActiveKey={"0"}>
                <Nav variant="pills" className="header-main-nav">
                  {examData &&
                    examData.map((sub, subIndex) => {
                      return (
                        <Nav.Item
                          onClick={() => {
                            setSubjectIndex(subIndex);
                          }}
                        >
                          <Nav.Link eventKey={subIndex}>
                            {sub.subjectName} [{sub.subjectWiseAnswerCount}]
                          </Nav.Link>
                        </Nav.Item>
                      );
                    })}
                </Nav>
                {props.testDetails.examList.exam.courses[0].name === "NEET" ? (
                  <div>
                    <Alert show={show} variant="danger">
                      <Alert.Heading>Warning!</Alert.Heading>
                      <p>
                        {`You Can Solve Only ${
                          EnumConfig.NEETSection.onlyQuesAttemptInSectionB + 1
                        } Quetions In Section B.`}
                      </p>
                      <hr />
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={() => setShow(false)}
                          variant="outline-danger"
                        >
                          Close
                        </Button>
                      </div>
                    </Alert>

                    <Tab.Content>
                      {examData &&
                        examData.map((sub, subIndex) => {
                          return (
                            <Tab.Pane eventKey={subIndex}>
                              <div className="answer-box2 overflow-scroll">
                                <div className="details-report-content-accordian">
                                  {sub.questions.map((que, queIndex) => {
                                    let qText = CommonFunctions.filterMarkup(
                                      que.questionText
                                    );
                                    if (
                                      queIndex <
                                      EnumConfig.NEETSection.constForSectionB
                                    ) {
                                      return (
                                        <>
                                          {queIndex === 0 && (
                                            <div
                                              style={{
                                                background: "#1e90ff",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                                fontWeight: "bold",
                                                color: "#fff",
                                                fontSize: "18px",
                                              }}
                                            >
                                              Section A
                                            </div>
                                          )}
                                          <div
                                            className={retrunBackgroundColor(
                                              que
                                            )}
                                            ref={divRefs && divRefs[que.id]}
                                            key={`questions_${que.id}`}
                                          >
                                            {bookmarkAndAnswer(que)}
                                            <p>
                                              <span className="question-number disable-selection">
                                                {queIndex + 1}.
                                              </span>
                                              <span className="question-text disable-selection">
                                                {qText && (
                                                  <span
                                                    dangerouslySetInnerHTML={{
                                                      __html: qText
                                                        ? qText
                                                        : "blank",
                                                    }}
                                                  />
                                                )}
                                              </span>
                                            </p>
                                            <p className="text-on-question-panle disable-selection">
                                              Marks
                                              <span className="positive-marks">
                                                {" "}
                                                (+{que.positiveMarks}){" "}
                                              </span>
                                              <span className="negative-marks">
                                                {" "}
                                                (-{que.negativeMarks}){" "}
                                              </span>
                                            </p>
                                            <p className="text-on-question-panle-questiontype disable-selection">
                                              {checkQuastionType(
                                                que.questionType
                                              )}
                                            </p>
                                            <p>
                                              {(que.questionType === 5 ||
                                                que.questionType === 0) && (
                                                <input
                                                  type="number"
                                                  defaultValue={
                                                    que.studentAnswer
                                                  }
                                                  // value={que.studentAnswer}
                                                  onKeyPress={(e) => {
                                                    if (
                                                      sub.inputAnswerCount ===
                                                        5 &&
                                                      !sub.studentAnswer
                                                    ) {
                                                      e.preventDefault();
                                                      alert(
                                                        "You can  attempt only 5 numeric questions."
                                                      );
                                                      return false;
                                                    }
                                                  }}
                                                  onBlur={(e) =>
                                                    handleInputChange(
                                                      e,
                                                      que,
                                                      sub
                                                    )
                                                  }
                                                  onWheel={(e) =>
                                                    numberFieldRefs &&
                                                    numberFieldRefs[
                                                      `${que.id}_numeric`
                                                    ] &&
                                                    numberFieldRefs[
                                                      `${que.id}_numeric`
                                                    ].current.blur()
                                                  }
                                                  ref={
                                                    numberFieldRefs &&
                                                    numberFieldRefs[
                                                      `${que.id}_numeric`
                                                    ]
                                                  }
                                                  onPaste={(e) =>
                                                    e.preventDefault()
                                                  }
                                                />
                                              )}
                                            </p>
                                            {(que.questionType == 1 ||
                                              que.questionType == 2) &&
                                              que.options.map(
                                                (option, opIndex) => {
                                                  let oText =
                                                    CommonFunctions.filterMarkup(
                                                      option.value
                                                    );

                                                  return (
                                                    <ul className="disable-selection">
                                                      <li
                                                        onClick={() => {
                                                          SelectCheckBox(
                                                            option,
                                                            que,
                                                            queIndex,
                                                            opIndex,
                                                            console.log(
                                                              UserAnswerCount,
                                                              "UserAnswerCount From section A"
                                                            )
                                                          );
                                                        }}
                                                        className="cursor-pointer"
                                                      >
                                                        <span className="wrap-span">
                                                          <input
                                                            type="checkbox"
                                                            className="user-checkBox"
                                                            value={
                                                              que.key + opIndex
                                                            }
                                                            checked={
                                                              option.isChecked
                                                            }
                                                          />

                                                          <span className="option-number margin-right-left-12">
                                                            ({option.key})
                                                          </span>
                                                          <span className="option-text margin-right-12">
                                                            {oText && (
                                                              <span
                                                                dangerouslySetInnerHTML={{
                                                                  __html: oText
                                                                    ? oText
                                                                    : "blank",
                                                                }}
                                                              />
                                                            )}
                                                          </span>
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  );
                                                }
                                              )}
                                          </div>
                                        </>
                                      );
                                    }
                                    //////////////////////////////////////////////////NEET SECTION B START/////////////////////////////////////////////////
                                    else if (
                                      queIndex + 1 >
                                      EnumConfig.NEETSection.constForSectionB
                                    ) {
                                      return (
                                        <>
                                          {queIndex ===
                                            EnumConfig.NEETSection
                                              .constForSectionB && (
                                            <div
                                              style={{
                                                background: "tomato",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                                fontWeight: "bold",
                                                color: "#fff",
                                                fontSize: "18px",
                                              }}
                                            >
                                              Section B
                                            </div>
                                          )}
                                          <div
                                            className={`${retrunBackgroundColor(
                                              que
                                            )} marginPaddingZero`}
                                            ref={divRefs && divRefs[que.id]}
                                            key={`questions_${que.id}`}
                                          >
                                            {bookmarkAndAnswer(que)}
                                            <p>
                                              <span className="question-number disable-selection">
                                                {queIndex +
                                                  1 -
                                                  EnumConfig.NEETSection
                                                    .constForSectionB}
                                                .
                                              </span>
                                              <span className="question-text disable-selection">
                                                {qText && (
                                                  <span
                                                    dangerouslySetInnerHTML={{
                                                      __html: qText
                                                        ? qText
                                                        : "blank",
                                                    }}
                                                  />
                                                )}
                                              </span>
                                            </p>
                                            <p className="text-on-question-panle disable-selection">
                                              Marks
                                              <span className="positive-marks">
                                                {" "}
                                                (+{que.positiveMarks}){" "}
                                              </span>
                                              <span className="negative-marks">
                                                {" "}
                                                (-{que.negativeMarks}){" "}
                                              </span>
                                            </p>
                                            <p className="text-on-question-panle-questiontype disable-selection">
                                              {checkQuastionType(
                                                que.questionType
                                              )}
                                            </p>
                                            <p>
                                              {(que.questionType === 5 ||
                                                que.questionType === 0) && (
                                                <input
                                                  type="number"
                                                  defaultValue={
                                                    que.studentAnswer
                                                  }
                                                  // value={que.studentAnswer}
                                                  onKeyPress={(e) => {
                                                    if (
                                                      sub.anserCountSectionB >=
                                                        EnumConfig.NEETSection
                                                          .onlyQuesAttemptInSectionB &&
                                                      que.isAnswer === false
                                                    ) {
                                                      e.preventDefault();
                                                      setShow(true);
                                                      // alert(
                                                      //   `You Can Solve Only ${
                                                      //     EnumConfig.NEETSection
                                                      //       .onlyQuesAttemptInSectionB +
                                                      //     1
                                                      //   } Quetions In Section B.`
                                                      // );
                                                      return false;
                                                    } else {
                                                      if (
                                                        sub.inputAnswerCount ===
                                                          5 &&
                                                        !sub.studentAnswer
                                                      ) {
                                                        e.preventDefault();
                                                        alert(
                                                          "You can  attempt only 5 numeric questions."
                                                        );
                                                        return false;
                                                      }
                                                    }
                                                  }}
                                                  // disabled={
                                                  //   UserAnserCountSectionB >=
                                                  //     EnumConfig.NEETSection
                                                  //       .onlyQuesAttemptInSectionB &&
                                                  //   que.isAnswer === false
                                                  //     ? true
                                                  //     : false
                                                  // }

                                                  onBlur={(e) =>
                                                    handleInputChange(
                                                      e,
                                                      que,
                                                      sub
                                                    )
                                                  }
                                                  onWheel={(e) =>
                                                    numberFieldRefs &&
                                                    numberFieldRefs[
                                                      `${que.id}_numeric`
                                                    ] &&
                                                    numberFieldRefs[
                                                      `${que.id}_numeric`
                                                    ].current.blur()
                                                  }
                                                  ref={
                                                    numberFieldRefs &&
                                                    numberFieldRefs[
                                                      `${que.id}_numeric`
                                                    ]
                                                  }
                                                  onPaste={(e) =>
                                                    e.preventDefault()
                                                  }
                                                />
                                              )}
                                            </p>
                                            {(que.questionType == 1 ||
                                              que.questionType == 2) &&
                                              que.options.map(
                                                (option, opIndex) => {
                                                  let oText =
                                                    CommonFunctions.filterMarkup(
                                                      option.value
                                                    );

                                                  return (
                                                    <ul className="disable-selection">
                                                      <li
                                                        onClick={() => {
                                                          console.log(
                                                            sub,
                                                            "Sub from section B"
                                                          );
                                                          sub.anserCountSectionB >=
                                                            EnumConfig
                                                              .NEETSection
                                                              .onlyQuesAttemptInSectionB &&
                                                          que.isAnswer === false
                                                            ? setShow(true)
                                                            : // alert(
                                                              //     `You Can Solve Only ${
                                                              //       EnumConfig
                                                              //         .NEETSection
                                                              //         .onlyQuesAttemptInSectionB +
                                                              //       1
                                                              //     } Quetions In Section B.`
                                                              //   )
                                                              SelectCheckBox(
                                                                option,
                                                                que,
                                                                queIndex,
                                                                opIndex
                                                              );
                                                        }}
                                                        className="cursor-pointer"
                                                      >
                                                        <span className="wrap-span">
                                                          <input
                                                            type="checkbox"
                                                            className="user-checkBox"
                                                            value={
                                                              que.key + opIndex
                                                            }
                                                            disabled={
                                                              sub.anserCountSectionB >=
                                                                EnumConfig
                                                                  .NEETSection
                                                                  .onlyQuesAttemptInSectionB &&
                                                              que.isAnswer ===
                                                                false
                                                                ? true
                                                                : false
                                                            }
                                                            checked={
                                                              option.isChecked
                                                            }
                                                          />

                                                          <span className="option-number margin-right-left-12">
                                                            ({option.key})
                                                          </span>
                                                          <span className="option-text margin-right-12">
                                                            {oText && (
                                                              <span
                                                                dangerouslySetInnerHTML={{
                                                                  __html: oText
                                                                    ? oText
                                                                    : "blank",
                                                                }}
                                                              />
                                                            )}
                                                          </span>
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  );
                                                }
                                              )}
                                          </div>
                                        </>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                            </Tab.Pane>
                          );
                        })}
                    </Tab.Content>
                  </div>
                ) : (
                  <Tab.Content>
                    {examData &&
                      examData.map((sub, subIndex) => {
                        return (
                          <Tab.Pane eventKey={subIndex}>
                            <div className="answer-box2 overflow-scroll">
                              <div className="details-report-content-accordian">
                                {sub.questions.map((que, queIndex) => {
                                  let qText = CommonFunctions.filterMarkup(
                                    que.questionText
                                  );

                                  return (
                                    <div
                                      className={retrunBackgroundColor(que)}
                                      ref={divRefs && divRefs[que.id]}
                                      key={`questions_${que.id}`}
                                    >
                                      {bookmarkAndAnswer(que)}
                                      <p>
                                        <span className="question-number disable-selection">
                                          {queIndex + 1}.
                                        </span>
                                        <span className="question-text disable-selection">
                                          {qText && (
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: qText ? qText : "blank",
                                              }}
                                            />
                                          )}
                                        </span>
                                      </p>
                                      <p className="text-on-question-panle disable-selection">
                                        Marks
                                        <span className="positive-marks">
                                          {" "}
                                          (+{que.positiveMarks}){" "}
                                        </span>
                                        <span className="negative-marks">
                                          {" "}
                                          (-{que.negativeMarks}){" "}
                                        </span>
                                      </p>
                                      <p className="text-on-question-panle-questiontype disable-selection">
                                        {checkQuastionType(que.questionType)}
                                      </p>
                                      <p>
                                        {(que.questionType === 5 ||
                                          que.questionType === 0) && (
                                          <input
                                            type="number"
                                            defaultValue={que.studentAnswer}
                                            // value={que.studentAnswer}
                                            onKeyPress={(e) => {
                                              if (
                                                sub.inputAnswerCount === 5 &&
                                                !sub.studentAnswer
                                              ) {
                                                e.preventDefault();
                                                alert(
                                                  "You can  attempt only 5 numeric questions."
                                                );
                                                return false;
                                              }
                                            }}
                                            onBlur={(e) =>
                                              handleInputChange(e, que, sub)
                                            }
                                            onWheel={(e) =>
                                              numberFieldRefs &&
                                              numberFieldRefs[
                                                `${que.id}_numeric`
                                              ] &&
                                              numberFieldRefs[
                                                `${que.id}_numeric`
                                              ].current.blur()
                                            }
                                            ref={
                                              numberFieldRefs &&
                                              numberFieldRefs[
                                                `${que.id}_numeric`
                                              ]
                                            }
                                            onPaste={(e) => e.preventDefault()}
                                          />
                                        )}
                                      </p>
                                      {(que.questionType == 1 ||
                                        que.questionType == 2) &&
                                        que.options.map((option, opIndex) => {
                                          let oText =
                                            CommonFunctions.filterMarkup(
                                              option.value
                                            );

                                          return (
                                            <ul className="disable-selection">
                                              <li
                                                onClick={() => {
                                                  SelectCheckBox(
                                                    option,
                                                    que,
                                                    queIndex,
                                                    opIndex
                                                  );
                                                }}
                                                className="cursor-pointer"
                                              >
                                                <span className="wrap-span">
                                                  <input
                                                    type="checkbox"
                                                    className="user-checkBox"
                                                    value={que.key + opIndex}
                                                    checked={option.isChecked}
                                                  />

                                                  <span className="option-number margin-right-left-12">
                                                    ({option.key})
                                                  </span>
                                                  <span className="option-text margin-right-12">
                                                    {oText && (
                                                      <span
                                                        dangerouslySetInnerHTML={{
                                                          __html: oText
                                                            ? oText
                                                            : "blank",
                                                        }}
                                                      />
                                                    )}
                                                  </span>
                                                </span>
                                              </li>
                                            </ul>
                                          );
                                        })}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </Tab.Pane>
                        );
                      })}
                  </Tab.Content>
                )}
              </Tab.Container>
            </div>
          </div>
        </div>
        {istoggle && SideComponent()}
      </div>
      <br />
      <div className="row bottom-container">
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 color-white"></div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 color-white">
          <button
            type="submit"
            class="btn-test-submit"
            onClick={() => {
              setshowSubmitPriviewModal(true);
            }}
          >
            {"Submit exam"}{" "}
          </button>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 color-white">
          <button
            class="btn-test-submit color-white"
            type="button"
            onClick={() => {
              setisToggle(!istoggle);
            }}
          >
            {!istoggle ? " Show panel" : "Hide Panel"}
          </button>
        </div>
      </div>
      <SubmitPriviewMdal
        showSubmitPriviewModal={showSubmitPriviewModal}
        handleCloseSubmitPriviewModal={handleCloseSubmitPriviewModal}
        data={examData}
        selectedTest={testDetails}
        remaningTime={remaningTime}
        disableStartButton={false}
        returnTwonumbers={returnTwonumbers}
        UserAnswerCount={UserAnswerCount}
        UserBookmarkCount={UserBookmarkCount}
        UserNotAnswerCount={UserNotAnswerCount}
        UserVisitedCount={UserVisitedCount}
        setShowAttemptedExamModal={setShowAttemptedExamModal}
        setReportList={setReportList}
        examCompleted={examCompleted}
        setDone={setDone}
        checkisDone={checkisDone}
        setExamCompleted={setExamCompleted}
      />
      {showBannedPriviewModal && (
        <BannedPriviewMdal
          showBannedPriviewModal={showBannedPriviewModal}
          handleCloseBannedPriviewModal={handleCloseBannedPriviewModal}
          data={examData}
          selectedTest={testDetails}
          remaningTime={remaningTime}
          disableStartButton={false}
          returnTwonumbers={returnTwonumbers}
          UserAnswerCount={UserAnswerCount}
          UserBookmarkCount={UserBookmarkCount}
          UserNotAnswerCount={UserNotAnswerCount}
          UserVisitedCount={UserVisitedCount}
          setShowAttemptedExamModal={setShowAttemptedExamModal}
          setReportList={setReportList}
          examCompleted={examCompleted}
          setDone={setDone}
          checkisDone={checkisDone}
          setExamCompleted={setExamCompleted}
        />
      )}
      <DiscardExam
        showDiscardModal={showDiscardModal}
        handleCloseshowDiscardModal={handleCloseshowDiscardModal}
        data={examData}
        selectedTest={testDetails}
        remaningTime={remaningTime}
        disableStartButton={false}
        returnTwonumbers={returnTwonumbers}
        UserAnswerCount={UserAnswerCount}
        UserBookmarkCount={UserBookmarkCount}
        UserNotAnswerCount={UserNotAnswerCount}
        UserVisitedCount={UserVisitedCount}
      />
      <WarningExam
        showWarningModal={showWarningModal}
        handleCloseshowWarningModal={handleCloseshowWarningModal}
      />
      {showAttemptedExamModal && (
        <AttemptedExamModal
          isNewExamSubmited={true}
          showAttemptedExamModal={showAttemptedExamModal}
          userGivenTestList={testDetails}
          reportList={reportList}
          closeAttemptedExamModal={closeAttemptedExamModal}
          selectedExamData={testDetails}
        />
      )}
    </div>
  );
};

const mapPropsToState = (state) => {
  return {
    testDetails: state.testDetails,
    warningCount: state.warningCount,
  };
};

export default connect(mapPropsToState)(ExamView);
