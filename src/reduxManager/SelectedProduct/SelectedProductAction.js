import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_SELCTED_PRODUCT: 'SET_SELECTED_PRODUCT',
    RESET_SELECTED_PRODUCT: 'RESET_SELECTED_PRODUCT',
}

const setSelectedProduct = (product) => {
    store.dispatch({ type: ActionTypes.SET_SELCTED_PRODUCT, payload: product });
}

const resetSelectedProduct = () => {
    store.dispatch({ type: ActionTypes.RESET_SELECTED_PRODUCT });
}
export default {
    setSelectedProduct,
    resetSelectedProduct,
}