import { GET_JSON_FROM_PINATA_FAILED, GET_JSON_FROM_PINATA_REQUEST, GET_JSON_FROM_PINATA_RESET, GET_JSON_FROM_PINATA_SUCCESS, PIN_FILE_TO_PINATA_FAILED, PIN_FILE_TO_PINATA_REQUEST, PIN_FILE_TO_PINATA_RESET, PIN_FILE_TO_PINATA_SUCCESS, PIN_JSON_TO_PINATA_FAILED, PIN_JSON_TO_PINATA_REQUEST, PIN_JSON_TO_PINATA_SUCCESS, TOKEN_REDUCER_LOADING_FALSE, TOKEN_REDUCER_LOADING_TRUE } from "../constants/tokenConstant";

export const tokenReducer = (state = {}, action) => {
    switch (action.type) {
        case PIN_FILE_TO_PINATA_REQUEST:
            return {...state, loading: true};
        case PIN_FILE_TO_PINATA_SUCCESS:
            if (action.payload.id == 1) 
            {
                return {...state, loading: false, first_image_hash: action.payload.data.IpfsHash}
            } 
            else if (action.payload.id == 2)
            {
                return {...state, loading: false, second_image_hash: action.payload.data.IpfsHash}
            }
            else if (action.payload.id == 3)
            {
                return {...state, loading: false, third_image_hash: action.payload.data.IpfsHash}
            }
        case PIN_FILE_TO_PINATA_FAILED:
            return {...state, loading: false, error: action.payload}
        case PIN_JSON_TO_PINATA_REQUEST:
            return {...state, loading: true}
        case PIN_JSON_TO_PINATA_SUCCESS:
            return {...state, loading: false, tokenHash: action.payload.IpfsHash}
        case PIN_JSON_TO_PINATA_FAILED:
            return{...state, loading: false, error: action.payload}
        case PIN_FILE_TO_PINATA_RESET:
            return {...state, image_hash: undefined}
        case GET_JSON_FROM_PINATA_REQUEST:
            return {...state, loading: true}
        case GET_JSON_FROM_PINATA_RESET:
            return {...state, tokenDetail: undefined}
        case GET_JSON_FROM_PINATA_SUCCESS:
            return {...state, loading: false, tokenDetail: action.payload}
        case GET_JSON_FROM_PINATA_FAILED:
            return {...state, error: action.payload}
        case TOKEN_REDUCER_LOADING_TRUE:
            return {...state, loading: true}
        case TOKEN_REDUCER_LOADING_FALSE:
            return {...state, loading: false}
        default:
            return state;
    }
}