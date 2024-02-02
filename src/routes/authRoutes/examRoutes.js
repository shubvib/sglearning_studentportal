
import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Dashboard, } from '../../views';
import { Spinner } from '../../components';
import { UrlConfig } from '../../config';


const ExamView = lazy(() => import('../../views/exam/examView/examView'));

const PageNotFound = lazy(() => import('../../views/404/404'));



const ExamRoutes = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route exact  path={UrlConfig.routeUrls.examView} component={ExamView} />

                <Route exact path="/" component={ExamView} />
                <Route component={ExamView} />
            </Switch>
        </Suspense>
    );
}

export default ExamRoutes;