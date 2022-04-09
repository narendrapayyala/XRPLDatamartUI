import axiosConfig from '../../configurations/axiosConfig';

const handleResponse = (error) => {
  if (
    error.response &&
    (error.response.status === 500 ||
      error.response.status === 400 ||
      error.response.status === 401 ||
      error.response.status === 422)
  ) {
    return error.response && error.response.data;
  }
  return error.response && error.response.data;
};

export const fetchServerService = () =>
  axiosConfig
    .get(`/config`)
    .then((response) => response.data)
    .catch(handleResponse);

export const createServerService = (data) =>
  axiosConfig
    .post(`/config/create`, data)
    .then((response) => response.data)
    .catch(handleResponse);

export const updateServerService = (data) =>
  axiosConfig
    .post(`/config/update`, data)
    .then((response) => response.data)
    .catch(handleResponse);
