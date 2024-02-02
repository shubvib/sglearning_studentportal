const initialState = null;
const TestDetailsReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_TEST_DETAILS':
            if (action.payload) {
                return action.payload
            }
            return state;
        case 'RESET_TEST_DETAILS':
            return initialState
        // case 'SET_GOOGLE_IMAGE':
        //     return action.payload
        default:
            return state;
    }
}

export default TestDetailsReducer;
