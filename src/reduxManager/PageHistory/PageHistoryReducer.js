const initialState = [];
const PageHistoryReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_PAGE_HISTORY':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_PAGE_HISTORY':
            return initialState
        default:
            return state;
    }
}

export default PageHistoryReducer;
