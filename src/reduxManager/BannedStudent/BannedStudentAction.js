import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_WARNING_COUNT: 'SET_WARNING_COUNT',
    RESET_WARNING_COUNT: 'RESET_WARNING_COUNT',
}

const setWarningCount = (warningCOUNT) => {
    // debugger
    store.dispatch({ type: ActionTypes.SET_WARNING_COUNT, payload: warningCOUNT });
}

const resetWarningCount = () => {
    store.dispatch({ type: ActionTypes.RESET_WARNING_COUNT });
}
export default {
    setWarningCount,
    resetWarningCount,
}
