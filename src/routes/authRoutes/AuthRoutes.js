import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Spinner } from '../../components';
import { UrlConfig } from '../../config';

// const Learning = lazy(() => import('../../views/learning/courses/courses'));
// const OpenExam = lazy(() => import('../../views/openExam/openExam'));
const productList = lazy(() => import('../../views/learning/productList/productList'));
const PurchasedProductDetails = lazy(() => import('../../views/learning/purchaseList/purchaseList'));
const VideoPlyerList = lazy(() => import('../../views/learning/videoPlayer/videoPlayer'));


const productDetails = lazy(() => import('../../views/learning/productdetails/productdetails'));
const ProductDetailsExam = lazy(() => import('../../views/learning/productdetailsExam/productdetailsExam'));

const Exam = lazy(() => import('../../views/exam/examList/examList'));
const ExamView = lazy(() => import('../../views/exam/examView/examView'));
const PageNotFound = lazy(() => import('../../views/404/404'));
const TermsPrivacyPolicy = lazy(() => import('../../views/termsPrivacyPolicy/TermsPrivacyPolicy'));
//  const Dashboard = lazy(() => import('../../views/openExam/openExam'));   //remove comment when open exams are available and comment when no open exam
const Dashboard = lazy(() => import('../../views/exam/examList/examList'));  // remove comment when no open exam and omment when open exams are available

const StripePage = lazy(() => import('../../components/shared/StripeCheckoutPage'));

// const MyCourses = lazy(() => import('../../views/learningPage/MyCourses'));
const Learning = lazy(() => import('../../views/learningPage/Learning'))
const ExploreCourses = lazy(() => import('../../views/exploreCourses/ExploreCourses'));

const UpdateProfile = lazy(() => import('../../views/editProfile/profile'));
const ResetPassword = lazy(() => import('../../views/resetPassword/resetPassword'));






const AuthRoutes = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route exact path={UrlConfig.routeUrls.exam} component={Dashboard} />
                {/* <Route exact path={UrlConfig.routeUrls.learning} component={Learning} /> */}
                <Route exact path={UrlConfig.routeUrls.exam} component={Exam} />
                <Route exact path={UrlConfig.routeUrls.productList} component={productList} />
                <Route exact path={UrlConfig.routeUrls.productDetails} component={productDetails} />
                <Route exact path={UrlConfig.routeUrls.ProductDetailsExam} component={ProductDetailsExam} />
                <Route exact path={UrlConfig.routeUrls.purchasedProductDetails} component={PurchasedProductDetails} />
                <Route exact path={UrlConfig.routeUrls.VideoPlyerList} component={VideoPlyerList} />
                <Route exact path={UrlConfig.routeUrls.examView} component={Exam} />
                <Route exact path={UrlConfig.routeUrls.learning} component={Learning} />
                <Route exact path={UrlConfig.routeUrls.exploreCourses} component={ExploreCourses} />

                <Route exact path={UrlConfig.routeUrls.termsPrivacyPolicy} component={TermsPrivacyPolicy} />
                <Route exact path={UrlConfig.routeUrls.stripePage} component={StripePage} />

                <Route exact path={UrlConfig.routeUrls.UpdateProfile} component={UpdateProfile} />
                <Route exact path={UrlConfig.routeUrls.ResetPassword} component={ResetPassword} />
                
               

                <Route exact path="/" component={Dashboard} />
                <Route component={PageNotFound} />
            </Switch>
        </Suspense>
    );
}

export default AuthRoutes;