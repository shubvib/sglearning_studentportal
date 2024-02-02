import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_TEST_DETAILS: 'SET_TEST_DETAILS',
    RESET_TEST_DETAILS: 'RESET_TEST_DETAILS',
    // SET_GOOGLE_IMAGE: 'SET_GOOGLE_IMAGE'
}

const setTestDeatils = (data) => {
    console.log('user details in action', data)
    store.dispatch({ type: ActionTypes.SET_TEST_DETAILS, payload: data });
}

const resetTestDetails = () => {
    store.dispatch({ type: ActionTypes.RESET_TEST_DETAILS });
}

// const setGoogleProfileImage = (profileImage) => {
//     store.dispatch({ type: ActionTypes.SET_GOOGLE_IMAGE,payload: profileImage})
// }
export default {
    setTestDeatils,
    resetTestDetails,
    // setGoogleProfileImage
}