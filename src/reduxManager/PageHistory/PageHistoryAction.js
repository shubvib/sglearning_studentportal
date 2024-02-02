import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_PAGE_HISTORY: 'SET_PAGE_HISTORY',
    RESET_PAGE_HISTORY: 'RESET_PAGE_HISTORY'
}

const setPageHistory = (pageData) => {
    store.dispatch({ type: ActionTypes.SET_PAGE_HISTORY, payload: pageData });
}

const resetPageHistory = () => {
    store.dispatch({ type: ActionTypes.RESET_PAGE_HISTORY });
}

export default {
    setPageHistory,
    resetPageHistory
}