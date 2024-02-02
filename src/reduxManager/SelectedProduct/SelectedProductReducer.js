const initialState = {};
const SelectedPorductReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_SELECTED_PRODUCT':
            if (action.payload) {
                return action.payload
            }
            return state;
        case 'RESET_SELECTED_PRODUCT':
            return initialState
        default:
            return state;
    }
}

export default SelectedPorductReducer;
