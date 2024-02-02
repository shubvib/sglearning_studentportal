const initialState = 0;
const WarningCountReducer = (
    state = initialState,
    action
) => {
    //debugger
    switch (action.type) {
        case 'SET_WARNING_COUNT':
            if ( action.payload) {
                return action.payload
            }
            return state;
        case 'RESET_WARNING_COUNT':
            return initialState
        default:
            return state;
    }
}

export default WarningCountReducer;
