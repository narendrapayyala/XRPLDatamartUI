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

export const fetchEntityService = () =>
  axiosConfig
    .get(`/entity/list`)
    .then((response) => response.data)
    .catch(handleResponse);

export const fetchFieldsListService = (data) =>
  axiosConfig
    .get(`/${data.connector}/model`)
    .then((response) => response.data)
    .catch(handleResponse);

export const fetchFiltersListService = (data) =>
  axiosConfig
    .get(`/${data.connector}/${data.route}/params/`)
    .then((response) => response.data)
    .catch(handleResponse);

export const createReportService = (entity, data) =>
  axiosConfig
    .post(`/${entity.connector}/${entity.route}/template`, data)
    .then((response) => response.data)
    .catch(handleResponse);

export const updateReportService = (entity, data) =>
  axiosConfig
    .post(`/${entity.connector}/${entity.route}/template/update`, data)
    .then((response) => response.data)
    .catch(handleResponse);

export const fetchTemplatesListService = (data) =>
  axiosConfig
    .get(`/entity/report-templates/list?user_id=${data.user_id}`)
    .then((response) => response.data)
    .catch(handleResponse);

export const generateReportService = (entity, data) =>
  axiosConfig
    .post(`/${entity.connector}/${entity.route}/fetch`, data)
    .then((response) => response.data)
    .catch(handleResponse);

export const downloadCSVReportService = (entity, data) =>
  axiosConfig
    .post(`/${entity.connector}/${entity.route}/csv`, data)
    .then((response) => response.data)
    .catch(handleResponse);

export const dbTestConnectionService = (data) =>
  axiosConfig
    .post(`/config/db/connection`, data)
    .then((response) => response.data)
    .catch(handleResponse);

export const databaseSyncService = (entity, data) =>
  axiosConfig
    .post(`/${entity.connector}/${entity.route}/db/sync`, data)
    .then((response) => response.data)
    .catch(handleResponse);
