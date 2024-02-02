import { combineReducers } from 'redux';
import UserReducer from './User/UserReducer';
import UserAuthenticationReducer from './UserAuthentication/UserAuthenticationReducer';
import CourseListReducer from './CourseList/CourseListReducer';
import WarningCountReducer from './BannedStudent/BannedStudentReducer';
import AccountListReducer from './AccountList/AccountListReducer';
import SubjectListReducer from './SubjectList/SubjectListReducer';
import ExamListReducer from './ExamList/ExamListReducer';
import AppThemeReducer from './AppTheme/AppThemeReducer';
import PageHistoryReducer from './PageHistory/PageHistoryReducer';
import SelectedChapterVideoReducer from './SelectedChapterVideo/SelectedChapterVideoReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import localForage from 'localforage';

import createEncryptor from 'redux-persist-transform-encrypt'
import TestDetailsReducer from './TestDetails/TestDetailsReducer';
import ProductListReducer from './ProductList/ProductListReducer';
import SelectedPorductReducer from './SelectedProduct/SelectedProductReducer';

const encryptor = createEncryptor({
    secretKey: 'SG$oft3ch',
    onError: function (error) {
        // Handle the error.
    }
});

const reducers = combineReducers({
    userData: UserReducer,
    authDetails: UserAuthenticationReducer,
    warningCount: WarningCountReducer,
    courseList: CourseListReducer,
    accountList: AccountListReducer,
    subjectList: SubjectListReducer,
    examList: ExamListReducer,
    appTheme: AppThemeReducer,
    pageHistory: PageHistoryReducer,
    testDetails: TestDetailsReducer,
    productList: ProductListReducer,
    selectedProduct: SelectedPorductReducer,
    selectedChapterVideos: SelectedChapterVideoReducer

});

const persistConfig = {
    key: 'root',
    storage: localForage,
    transforms: [encryptor]

    // whitelist: ['searchHistories', 'appConfiguration']
}

const appReducer = persistReducer(persistConfig, reducers)

export default appReducer