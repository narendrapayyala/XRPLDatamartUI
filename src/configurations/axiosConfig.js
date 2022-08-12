import axios from 'axios';

const axiosConfig = axios.create({
  // withCredentials: true,
  baseURL: process.env.REACT_APP_BASE_URL
});
// axiosConfig.interceptors.request.use(
//   async (config) => {
//     const session = await onAuthStateChanged(AUTH);
//     console.log(session);
//     if (session) {
//       config.headers = {
//         ...config.headers,
//         'Content-Type': 'application/json',
//         token: session.accessToken
//       };
//     } else {
//       config.headers = {
//         ...config.headers,
//         'Content-Type': 'application/json',
//         token: ''
//       };
//       logoutUser();
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosConfig;
