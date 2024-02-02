import { Network } from '../services';

export const HOST = 'http://localhost/';
export const API = 'api/';

const BASE_URL = Network.getBaseUrl();

const UrlConfig = {
    routeUrls: {
        loginUrl: '/login',
        register: '/register',
        openexam: '/openExam',
        // learning: '/learning',
        exam: '/examList',
        productList: '/productList',
        productDetails: '/productDetails',
        ProductDetailsExam: '/ProductDetailsExam',
        purchasedProductDetails: `/purchasedProductDetails`,
        examView: '/exampage',
        VideoPlyerList: '/videoplayer',
        termsPrivacyPolicy: '/termsPrivacyPolicy/:userId',
        //dashboard: '/openExam', //remove comment when open exams are available and comment when no open exam
        dashboard: '/examList',  // remove comment when no open exam and comment when open exams are available

        stripePage: '/stripePage/:clientSecreteKey',

        // myCourses: '/myCourses',
        learning: '/learning',
        exploreCourses: '/exploreCourses',


        UpdateProfile:'/profile',
        ResetPassword:'/resetPassword',
      

       
    },
    apiUrls: {
        registerUrl: `account/student/register`,
        getOTPUrl: `account/otp`,
        emailLoginUrl: `account/student/login`,
        resetPassword: `account/resetPassword`,
        loginWithGoogle: `account/auth/google`,
        getClientSecreteKey: `products/my/paymentIntent`,
        openExamSchedule: `openExamSchedule`, //it will list all open exams published by all institures
        getPurchasedProductList: 'products/my/purchases',
        getExamList: `students/examSchedule`,    //question paper list.
        getAllSubject: `subjects`, //getALl subjectList
        getTestList: `students/examSchedule`,
        examSubmission: `studentExamSubmission`,
        start_discardTest: `studentExamActions`,

        getSubjects: `subjects`,
        importStudent: `students/import`,
        createBranch: `branches`,
        createClass: `classes`,
        createBatch: `batches`,
        createStudent: `students`,
        uploadExam: `exams/importDoc/processDocAndGetSubjects`,
        createExam: `exams/importDoc/mapSubjectsAndCreateExam`,

        getStudentList: `students`,
        getStudents: `students`,
        students: `students`,
        changeStudentBatch: `students/changeBatch`,
        scheduleExam: `examSchedule`,
        getExamSchedule: `examSchedule`,
        updateExamSchedule: `batches/examSchedule/`,
        cancelExamSchedule: `examSchedule`,
        examReport: `examreport`,
        dashBoard: `stats1`,
        accounts: `accounts`,
        absentStudents: `absentStudents`,
        examLiveStats: `examLiveStats`,
        answerKeyCorrection: `answerKeyCorrection`,
        markQuestionsAsWrong: `markQuestionsAsWrong`,
        studentGivenTest: '/students/examSchedule?studentUserId=',
        selfSchedule: `students/selfSchedule`,
        getMyPurchases: 'products/my/purchases',
        isUserExist: 'account/isUserExists',
        getForFreeExam: `products/`,
        updatePassword: `account/changePassword`,
    },
    externalUrls: {
        adminDeveloment: `https://devadminwebuideploy.z29.web.core.windows.net/#/`,
        adminStaging: `https://webuideployment.z29.web.core.windows.net/#/`,
        adminProduction: `https://org.sglearning.in/#/`,

    }
}

export default UrlConfig;