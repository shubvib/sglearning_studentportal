import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Spinner } from "../../components";
import { UrlConfig } from "../../config";

const Login = lazy(() => import("../../views/login/Login"));
const Register = lazy(() => import("../../views/register/Registration.js"));
const PageNotFound = lazy(() => import("../../views/404/404"));
const TermsPrivacyPolicy = lazy(() =>
  import("../../views/termsPrivacyPolicy/TermsPrivacyPolicy")
);
const ExamView = lazy(() => import("../../views/exam/examView/examView"));
const StripePage = lazy(() =>
  import("../../components/shared/StripeCheckoutPage")
);

const AuthRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path={UrlConfig.routeUrls.loginUrl} component={Login} />
        <Route exact path={UrlConfig.routeUrls.register} component={Register} />
        <Route exact path={UrlConfig.routeUrls.examView} component={ExamView} />
        {/* <Route exact path="/" path={UrlConfig.routeUrls.examView} component={ExamView} /> */}
        <Route
          exact
          path={UrlConfig.routeUrls.termsPrivacyPolicy}
          component={TermsPrivacyPolicy}
        />
        <Route
          exact
          path={UrlConfig.routeUrls.stripePage}
          component={StripePage}
        />
        <Route component={PageNotFound} />
      </Switch>
    </Suspense>
  );
};

export default AuthRoutes;
