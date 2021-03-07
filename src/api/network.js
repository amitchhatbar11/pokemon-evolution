import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = `https://pokeapi.co/api/v2/`;

export const get = (url, params) =>
  axios
    .get(baseUrl + url, { params })
    .then((response) => response.data)
    .catch((error) => handleError(error));

export const post = (url, payload, config = {}) =>
  axios
    .post(baseUrl + url, payload, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return handleError(error);
    });

export const handleError = (error) => {
  const { response } = error;
  if (error && response && response.data.message) {
    throw response.data.message;
  } else if (response.data.errorMessage) {
    if (response.data && response.data.code && response.data.code === 409) {
      toast.toastError(response.data.errorMessage);
    } else if (
      response.data &&
      response.data.code &&
      response.data.code === 400
    ) {
      toast.toastError(response.data.errorMessage);
    } else {
      throw response.data.errorMessage;
    }
  }
  throw error;
};
