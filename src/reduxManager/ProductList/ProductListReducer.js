const initialState = [];
const ProductListReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_PRODUCT_LIST':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_PRODUCT_LIST':
            return initialState
        default:
            return state;
    }
}

export default ProductListReducer;
