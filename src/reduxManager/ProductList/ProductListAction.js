import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_PRODUCT_LIST: 'SET_PRODUCT_LIST',
    RESET_PRODUCT_LIST: 'RESET_PRODUCT_LIST',
}

const setProductList = (productList) => {
    store.dispatch({ type: ActionTypes.SET_PRODUCT_LIST, payload: productList });
}

const resetProductList = () => {
    store.dispatch({ type: ActionTypes.RESET_PRODUCT_LIST });
}
export default {
    setProductList,
    resetProductList,
}