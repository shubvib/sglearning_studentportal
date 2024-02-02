const initialState = null;
const SelectedChapterVideoReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_SELECTED_CHAPTER_VIDEO':
            if (action.payload) {
                return action.payload
            }
            return state;
        case 'RESET_SELECTED_CHAPTER_VIDEO':
            return initialState
        default:
            return state;
    }
}

export default SelectedChapterVideoReducer;
