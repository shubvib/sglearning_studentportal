import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_SELECTED_CHAPTER_VIDEO: 'SET_SELECTED_CHAPTER_VIDEO',
    RESET_SELECTED_CHAPTER_VIDEO: 'RESET_SELECTED_CHAPTER_VIDEO',
}

const setSelectedChapterVideo = (product) => {
    store.dispatch({ type: ActionTypes.SET_SELECTED_CHAPTER_VIDEO, payload: product });
}

const resetSelectedChapterVideo = () => {
    store.dispatch({ type: ActionTypes.RESET_SELECTED_CHAPTER_VIDEO });
}
export default {
    setSelectedChapterVideo,
    resetSelectedChapterVideo,
}