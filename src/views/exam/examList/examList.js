import React, { useState, useEffect } from 'react';
import PagesHeader from '../../../components/shared/Pageheader';
import { BsCloudUpload } from 'react-icons/bs'
import { FaUserEdit, FaUserClock, FaUserTimes, FaRegPlayCircle, } from "react-icons/fa";
import { FcNext } from "react-icons/fc";
import { BsFilterRight } from "react-icons/bs";
import { GoReport } from "react-icons/go";
import { Tooltip, OverlayTrigger, Form, Accordion, Spinner, Button } from 'react-bootstrap';
import { UrlConfig, ConstantConfig } from '../../../config';
import { toast } from "react-toastify";
import { InstructionsModal } from './Modals';
import { connect } from 'react-redux';
import { Api, CommonApiCall, Network } from '../../../services';
import { CourseListAction, SubjectListAction, AccountListAction } from '../../../reduxManager';
import { ExamListTableRow } from './Component';
import CommonFunctions from '../../../utils/CommonFunctions';
import moment from 'moment';
import AttemptedExamModal from '../../exam/report/reportModal/AttemptedExamModal';
import RankModal from './Modals/RankModal'
import { Link } from 'react-router-dom';
import localForage from "localforage";

const QuestionPapers = (props) => {
    const [examLists, setExamLists] = useState([]);
    const [selectedTest, setSelectedtest] = useState();


    const [counter, setCounter] = useState(1);
    const [listLoader, setListLoader] = useState(false);
    const [clickedExamId, setClickedExamId] = useState();
    const [show, setShow] = useState(false);
    const [showfileExplorerModel, setshowfileExplorerModel] = useState(false);
    const [isFileExploere, setFileExploere] = useState(true)
    const [showAkcBkcPreviewModal, setShowAkcBkcPreviewModal] = useState(false);
    const [isMultiExpand, setMultiExpand] = useState(false);
    const [subjects, setSubjects] = useState([]);


    //*************** for model*************** */
    const [userGivenTestList, setTestList] = useState([]);
    const [showAttemptedExamModal, setShowAttemptedExamModal] = useState(false)
    const closeAttemptedExamModal = () => setShowAttemptedExamModal(false);
    const [reportList, setReportList] = useState([]);
    //*************** for model*************** */
    const [examPreviewSubj, setExamPreviewSubj] = useState();
    const [scrollPosition, setScrollPosition] = useState();
    const [tempScrollPosition, setTempScrollPosition] = useState(1000);
    const [documentSubjects, setDocumentSubjects] = useState([]); //state used for set document subject on upload;
    const [mappedSubjects, setMappedSubjects] = useState([]); //set here mapped subject on mapping click
    const [createTestJSON, setcreateTest] = useState({
        id: "",
        name: "",
        description: "",
        price: Number,
        discount: "",
        examType: "1",
        applicableFor: [],
        duration: "",
        positiveMarks: "",
        negativeMarks: "",
        totalMarks: "",
        numberOfSubject: "",
        subjects: [],
        questionsPerSubject: "",
        totalQuestions: "",
        attempts: 1,
        // commonInstruction: true,
        isSpecificInstructions: false,
        testInstructions: "",
        importDocumentId: null,
        free: true
    });
    const [showSubjectMappingModal, setShowSubjectMappingModal] = useState(false);
    const [isSubjectMappingRequire, setIsubjectMappingRequire] = useState(false);
    const [showOverlayOncreate, setShowOverlayOncreate] = useState(true);
    const [mappingError, setMappingError] = useState(null);
    const [selectedExamFile, setSelectedExamFile] = useState(null);
    const [showCreateTestLoader, setCreateTestLoader] = useState(false);
    const [isValidCreateData, setCreateDataValid] = useState(false);
    const [showLoader, setLoader] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [condition, setCondition] = useState(false);
    const [apiCallFinsihed, setApicallFinished] = useState(false);
    // ****************************************************For Filter Menu************************
    const [updater, setUpdater] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [courseListForExamFilters, setCourseListForExamFilters] = useState(null);
    const [filterParams, setFilterParams] = useState({
        isCurrentDateSelected: false,
        currentDate: "",
        isDateRangeSelected: false,
        dateRange: { startDate: "", endDate: "" },
        applicableFor: []
    })




    useEffect(() => {
        console.log('showFilterMenu', showFilterMenu)
    }, [showFilterMenu])

    useEffect(() => {
        console.log('filterParams', filterParams);
    }, [filterParams])
    // ****************************************************Filter Menu End************************
    // *******************************For ExamPreview Modal*********************************************************
    const [showExamPreviewModal, setShowExamPreviewModal] = useState(false);
    const [examPreviewData, setExamPreviewData] = useState(null);
    const [showExamPreviewLoader, setExamPreviewLoader] = useState(false);
    const [showAkcBkcPreviewLoader, setAkcBkcPreviewLoader] = useState(false);
    const [disabledUpload, setDisabledUpload] = useState(false);
    // ****************************************************************************************
    useEffect(() => {
        // CommonApiCall.getInstituteData();
        getInstituteList();
        getPurchesedTest();
        // getSubjectList();
        // ****************************************For Exam List************************************************
        if (!examLists || examLists.length === 0) {
            setLoader(true);
            // getExamList();
        }
        return () => {
            setCondition(false)
            setLoader(false);
            setIsLoading(false);
            setListLoader(false);
            setExamLists([]);
            setCounter(1);
        }
        // ****************************************************************************************
    }, []);

    // ************************************Exam List****************************************************
    const getExamList = (id, loadFirstPage = false,) => {
        setIsLoading(true);
        if (!id) {
            setIsLoading(false);
            return false
        }

        (counter > 1 && !loadFirstPage) && setListLoader(true);
        const pageNumber = loadFirstPage ? 1 : counter;
        if (loadFirstPage) { setTempScrollPosition(1000) }
        var params = new URLSearchParams();
        params.append("OrgAccountId", id);
        params.append("PageSize", 500);

        // Api.getApi(UrlConfig.apiUrls.getExamList + '?OrgAccountId=' + id)
        Api.getApi(UrlConfig.apiUrls.getExamList, params)
            .then((response) => {
                if (response) {
                    console.log('examResponse', response);
                    const { data } = response;
                    setExamLists([]);
                    setExamLists(data);
                    setCondition(true);
                    setCounter(pageNumber + 1);
                }
                setListLoader(false);
                setLoader(false);
                setIsLoading(false);
            })
            .catch((error) => {
                setListLoader(false);
                setLoader(false);
                setIsLoading(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            })

    }






    useEffect(() => {
        handleCreateTestValidation();
    }, [createTestJSON]);
    const handleCreateTestValidation = () => {
        const { name, description, importDocumentId, applicableFor, duration, attempts } = createTestJSON;
        if (!name || !importDocumentId || !applicableFor || (applicableFor && applicableFor.length === 0) || !duration || !attempts) {
            setCreateDataValid(false);
            return false;
        }
        setCreateDataValid(true);
        return true;
    }




    /*********** start file explorer modal functionality *****************************/
    const handelScrollPosition = async (e) => {
        let tempScroll = tempScrollPosition;
        if (scrollPosition > tempScrollPosition) {
            let check = counter + 1;
            console.log("counterrrrrrr", counter);
            setListLoader(true);
            if (check !== counter) {
                setTempScrollPosition(tempScroll + 1300);
                // getExamList();
            }
        }
    }
    const Loadder = () => {
        return <Spinner animation="border" role="status" style={{ color: '#fff' }}>
            <span className="sr-only" > Loading...</span >
        </Spinner >
    }







    const setExamId = (id) => { setClickedExamId(id) };

    const showAkcBkcPreviewClick = () => setShowAkcBkcPreviewModal(true);
    const closeAkcBkcPreviewModal = () => setShowAkcBkcPreviewModal(false);

    const CloseExamPreviewModal = () => setShowExamPreviewModal(false);

    const showSubjectMappingClick = () => setShowSubjectMappingModal(true);
    const closeSubjectMappingModal = () => setShowSubjectMappingModal(false);


    /*********** end scheduled test modal functionality *****************************/


    // let i = 0;
    const examListTable = () => {
        return (
            <span >
                {examLists.map((examData, index) => {
                    console.log(examData,"examData")
                    return !examData.isDeleted &&
                        <ExamListTableRow
                            index={index + 1}
                            key={`examList_${examData.id}`}
                            listKey={`examList_${examData.id}`}
                            examData={examData}
                            startButtonLable={'Next'}
                            startButtonIcon={<FcNext />}
                            examId={examData.id}
                            isMultiExpand={isMultiExpand}
                            handleReportClick={() => {
                                setSelectedtest(examData)
                                getReportbyScheduleID(examData.id)
                            }}
                            handleRankCLick={() => {
                                if (examData.examScheduleId === '00000000-0000-0000-0000-000000000000') {
                                    toast('ID is epmty ..! id ' + examData.examScheduleId, {
                                        type: "error",
                                    });
                                } else {
                                    getRankbyScheduleID(examData.examScheduleId);

                                }

                            }}
                            showExamPreviewLoader={showExamPreviewLoader}
                            setCurrentExamId={setExamId}
                            handleStartButtonClick={() => {
                                setSelectedtest(examData);
                                handleShowInstructionsModal(examData)
                            }}
                        />
                }
                )}
                <div style={{ textAlign: "center", padding: 10 }}>
                    {listLoader && Loadder()}
                </div>

            </span>
        )
    }

    const getReportbyScheduleID = (id) => {
        setLoader(true);

        Api.getApi('studentExamSubmission/' + id + '/reports')
            .then(async (response) => {
                setLoader(false);
                console.log(response);
                const { data } = response;
                if (data && data.length != 0) {
                    data.reverse();
                    const duplicateInTime = data.filter((dt) => dt.isInTimeSubmission === true);
                    console.log('duplicateInTimeduplicateInTime', duplicateInTime)
                    if (duplicateInTime.length > 1) {
                        const newDataArray = await CommonFunctions.removeDuplicateRecod(data);
                        console.log('newDataArraynewDataArraynewDataArray', newDataArray)
                        setReportList(newDataArray);
                    } else {
                        setReportList(data);
                    }
                    setShowAttemptedExamModal(true)
                } else {
                    toast('Something goes wrong..!', {
                        type: "error",
                    });
                }
            }).catch((error) => {
                setLoader(false);

                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                // setAddPopupLoader(false);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }
    const [showRankModal, setShowRankModal] = useState(false);
    const [rankList, setrankList] = useState();

    const closeRankModal = () => setShowRankModal(false);
    const getRankbyScheduleID = (id) => {
        setLoader(true);
        Api.getApi('examSchedule/' + '560b86ee-bd6a-4733-a921-f392b03e105d' + '/toppers')
            .then((response) => {
                setLoader(false);
                console.log(response);
                const { data } = response;
                if (data) {
                    // data.reverse();
                    console.clear();
                    console.log(data, 'datadatadatadatadatadatadatadatadatadatadatadata')
                    setrankList(data);
                    setShowRankModal(true)
                } else {
                    toast('Something goes wrong..!', {
                        type: "error",
                    });
                }
            }).catch((error) => {
                setLoader(false);

                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                // setAddPopupLoader(false);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const handleShowInstructionsModal = async (examData) => {
        const { startDateTime, exam, bufferTimeInMinutes, isSubmitted, id } = examData;
        if (isSubmitted) {
            const canStartExam = CommonFunctions.canShowDetailReport(examData);
            if (canStartExam) {
                setShowInstructionsModal(true);
            } else {
                let examEndTime = new Date(startDateTime);
                const { duration } = exam;

                //technical buffer time is 15 mimute
                const techBuffer = 15; //to-do: update it to globally.

                examEndTime.setMinutes(examEndTime.getMinutes() + duration + bufferTimeInMinutes + ConstantConfig.exam.technicalBufferTime);
                const errorMessage = `You already submitted the exam, you can start the practice exam after ${examEndTime ? moment(examEndTime).format('MMMM Do YYYY, hh:mm a') : ''}`;
                toast.error(errorMessage);
            }
        } else {
            const recentSubmitExamId = await localForage.getItem('recentSubmitExamId');
            const canStartExam = CommonFunctions.canShowDetailReport(examData);
            if (recentSubmitExamId === id && !canStartExam) {
                let examEndTime = new Date(startDateTime);
                const { duration } = exam;
                examEndTime.setMinutes(examEndTime.getMinutes() + duration + bufferTimeInMinutes + ConstantConfig.exam.technicalBufferTime);
                const errorMessage = `You already submitted the exam, you can start the practice exam after ${examEndTime ? moment(examEndTime).format('MMMM Do YYYY, hh:mm a') : ''}`;
                toast.error(errorMessage);
            } else {
                setShowInstructionsModal(true);
            }


        }
    }
    const handleCloseInstructionModal = () => setShowInstructionsModal(false);
    const [instituteList, setinstituteList] = useState([]);
    useEffect(() => {
        // console.clear();
        console.log(instituteList, 'instituteListinstituteListinstituteListinstituteList')
        if (instituteList && instituteList.length > 0) {
            const { account } = instituteList[0];
            if (account && instituteList.length === 1) {
                setPurchesIndex(-1);
                setInstituteIndex(0);
                setExamLists([]);
                getExamList(account.id);
            }
        }
    }, [instituteList])

    // get instutute
    const getInstituteList = () => {

        setLoader(true);
        Api.getApi('user/enrollToAccounts')
            .then((response) => {
                setLoader(false);
                console.log(response);
                const { data } = response;
                if (data) {
                    // data.reverse();
                    setinstituteList(data);
                    AccountListAction.setAccountList(data);
                } else {
                    toast('Something goes wrong..!', {
                        type: "error",
                    });
                }
                setApicallFinished(true);
            }).catch((error) => {
                setApicallFinished(true);
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                // setAddPopupLoader(false);
                toast(errorMessage, {
                    type: "error",
                });
            });
    };
    const [purchesedTestList, setPurchesedTestList] = useState([]);

    const getPurchesedTest = async () => {
        setLoader(true);
        return new Promise((resolve, reject) => {
            Api.getApi(UrlConfig.apiUrls.getPurchasedProductList + '?productType=1')
                .then(response => {
                    setLoader(false);
                    const { data } = response;
                    if (data && data.length > 0) {

                        console.log(data, 'datadatadatadatadatadatadatadatadata');
                        setPurchesedTestList(data);
                    } else {
                        // examlistAction.resetExamList();
                    }
                    resolve(response);
                })
                .catch(error => {
                    setLoader(false);
                    reject(error);
                });
        });
    };
    const [purchesListIndex, setPurchesIndex] = useState(-1);
    const [instituteIndex, setInstituteIndex] = useState(-1);

    const rederInstituteList = () => {
        return instituteList.map((data, index) => {

            return (
                <div>
                    <div className="card-box-inner-wrapper exam-main-list-wrap" onClick={() => {
                        if (instituteIndex === index) {
                            setInstituteIndex(-1);
                            setInstituteIndex(-1);
                        } else {
                            setPurchesIndex(-1);
                            setInstituteIndex(index);
                            setExamLists([]);
                            getExamList(data.account.id);
                        }

                    }}>
                        <div className="dark-card">
                            <div className="ribbon-1"></div>
                            <div className="exapand-card-row">
                                <div className="row" style={{ alignItems: 'center' }}>
                                    <div className="col-sm-1">
                                        <div className="exapand-card-col exapand-card-col-id">
                                            <div className="exapnd-card-box">
                                                <div className="exam-text-name-box">
                                                    <span className="common-text-exapand-id">{" "}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-10">
                                        <div className="exapand-card-col exapand-card-col-exam-nm">
                                            <div className="exapnd-card-box">
                                                <div className="exam-name-box">
                                                    <div className="exam-text-name-box">
                                                        <span className="common-text-exapand" title={data.account.name}>{data.account.name}</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    {instituteIndex === index && <Accordion className="exam-main-list-expand-accordian" style={{ position: 'relative', paddingTop: 20, paddingBottom: 20 }}>
                        {isLoading &&
                            <div className="loader">
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </div>
                        }
                        {examLists && examLists.length > 0 ? examListTable() : (!showLoader && !isLoading) ?
                            <div className="no-data-found">
                                <div className="no-data-found-sub">
                                    {/* <h3>Exam List will appear here, once...</h3> */}
                                    <h3>No exam assigned by your institute yet, exam list will appear here once your institute will assign you an exam. For any query chat with us using the below chat icon or contact your  institute.</h3>

                                </div>
                            </div> : <></>
                        }
                    </Accordion>
                    }

                </div>
            )
        })
    }

    const rederPurchesedList = () => {
        return purchesedTestList.map((data, index) => {
            let ShortName = '';
            if (data.product) {
                // const { shortName } = data.product.orgAccount;
                // ShortName = shortName;
            }
            return (
                <div >
                    <div className="card-box-inner-wrapper exam-main-list-wrap" onClick={() => {
                        if (purchesListIndex === index) {
                            setInstituteIndex(-1);
                            setPurchesIndex(-1);
                        } else {
                            setExamLists([]);
                            setInstituteIndex(-1);
                            setPurchesIndex(index);

                            data.studentExamSchedules && setExamLists(data.studentExamSchedules)
                        }


                    }}>
                        <div className="dark-card">
                            <div className="ribbon-2"></div>
                            <div className="exapand-card-row">
                                <div className="row" style={{ alignItems: 'center' }}>
                                    <div className="col-sm-1">
                                        <div className="exapand-card-col exapand-card-col-id ">
                                            <div className="exapnd-card-box">
                                                <div className="exam-text-name-box">
                                                    <span className="common-text-exapand-id">{" "}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-10">
                                        <div className="exapand-card-col exapand-card-col-exam-nm">
                                            <div className="exapnd-card-box">
                                                <div className="exam-name-box">
                                                    <div className="exam-text-name-box">
                                                        <span className="common-text-exapand" title={data.product.name}>  {data.product.name} </span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    {purchesListIndex === index && <Accordion className="exam-main-list-expand-accordian">
                        {examListTable()}
                    </Accordion>
                    }
                </div>
            )
        })
    }
    return (
        <div>
            <PagesHeader headerText={"Exams"} customElementsComponent={() => { return <></> }} />
            <div className="common-dark-box">

                {<div
                    // onScroll={e => {
                    //     setScrollPosition(e.target.scrollTop);
                    //     (scrollPosition >= tempScrollPosition) && handelScrollPosition(e);
                    // }} 
                    className={condition ? "card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>
                    {showLoader &&
                        <div className="loader">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    {(instituteList.length === 0 && purchesedTestList.length === 0 && (!showLoader && !isLoading && apiCallFinsihed)) &&
                        <div className="no-data-found">
                            <div className="no-data-found-sub">
                                {/* <h3>Exam List will appear here, once...</h3> */}
                                <h3> You have not enrolled by any institute yet. For any query chat with us using the below chat icon or please contact your institute. </h3>
                                <h3>or</h3>
                                <h3>If you are a direct user, you have to purchase an exam pack on SG Learning Platform</h3>
                                <h3><Link to="/exploreCourses">Start Exploring Paid and <span style={{}} className='free-courses-span'>Free Courses...</span> </Link></h3>
                            </div>
                        </div>
                    }
                    {/*  */}
                    {/* <div >
                        {isMultiExpand ? examListTable() : <Accordion>
                            {examListTable()}
                        </Accordion>
                        }
                    </div> */}
                    {rederInstituteList()}
                    {rederPurchesedList()}
                </div>}

            </div>
            <InstructionsModal
                showInstructionsModal={showInstructionsModal}
                handleCloseInstructionModal={handleCloseInstructionModal}
                data={selectedTest}

                disableStartButton={false}
            />

            {
                showAttemptedExamModal && <AttemptedExamModal showAttemptedExamModal={showAttemptedExamModal}
                    userGivenTestList={userGivenTestList}
                    reportList={reportList}
                    closeAttemptedExamModal={closeAttemptedExamModal}
                    selectedExamData={selectedTest}
                />
            }
            <RankModal showRankModal={showRankModal}
                userGivenTestList={userGivenTestList}
                rankList={rankList}
                closeRankModal={closeRankModal}
                selectedExamData={selectedTest}
            />
            {/*************** end Modal section  ************************/}


        </div>

    )
}
const mapPropsToState = (state) => {
    return {
        examList: state.examList,
        accountList: state.accountList,
        explorerData: state.explorerData,
        courseList: state.courseList,
        subjectList: state.subjectList

    }
}
export default connect(mapPropsToState)(QuestionPapers);
