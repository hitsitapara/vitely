const BASE_API_URL = process.env.REACT_APP_BACKEND_URL

export const API_END_POINTS = {
  GET_EVENTS: `${BASE_API_URL}/events`,
  ADD_EVENTS: `${BASE_API_URL}/events`,
  GET_CATEGORIES: `${BASE_API_URL}/categories`,
  DELETE_EVENT: `${BASE_API_URL}/events`,
  UPDATE_EVENT: `${BASE_API_URL}/events`,
};

export const DATE_FORMAT = {
  DATE_TIME: "YYYY-MM-DD HH:mm", // 2025-12-04 15:45
};
