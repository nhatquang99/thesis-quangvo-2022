import baseApi from "../apis/baseApi";
import {
  GET_JSON_FROM_PINATA_FAILED,
  GET_JSON_FROM_PINATA_REQUEST,
  GET_JSON_FROM_PINATA_SUCCESS,
  PIN_FILE_TO_PINATA_FAILED,
  PIN_FILE_TO_PINATA_REQUEST,
  PIN_FILE_TO_PINATA_SUCCESS,
  PIN_JSON_TO_PINATA_FAILED,
  PIN_JSON_TO_PINATA_REQUEST,
  PIN_JSON_TO_PINATA_SUCCESS,
} from "../constants/tokenConstant";

export const pinFiletoPinata = (file, id) => async (dispatch) => {
  try {
    dispatch({ type: PIN_FILE_TO_PINATA_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await baseApi.post(`/pinFileToIPFS`, file, config);

    const payload = {
      data,
      id,
    };

    dispatch({
      type: PIN_FILE_TO_PINATA_SUCCESS,
      payload,
    });
  } catch (error) {
    dispatch({
      type: PIN_FILE_TO_PINATA_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const pinJSONToPinata = (metadata) => async (dispatch) => {
  try {
    dispatch({ type: PIN_JSON_TO_PINATA_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await baseApi.post(`/pinJsonToIPFS`, metadata, config);

    dispatch({
      type: PIN_JSON_TO_PINATA_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PIN_JSON_TO_PINATA_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getJSONFromPinata = (tokenURI) => async (dispatch) => {
  try {
    dispatch({ type: GET_JSON_FROM_PINATA_REQUEST });

    const { data } = await baseApi.get(`/getJsonFromIPFS/${tokenURI}`);

    dispatch({
      type: GET_JSON_FROM_PINATA_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_JSON_FROM_PINATA_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};