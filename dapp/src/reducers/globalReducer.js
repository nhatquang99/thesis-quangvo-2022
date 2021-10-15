import { UPDATE_ADDRESS } from "../constants/globalConstant";

export const globalReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ADDRESS:
            return {...state, userAddress: action.payload};
        default:
            return state;
    }
}