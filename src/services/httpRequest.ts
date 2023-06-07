import axios from 'axios';

interface Config {
  headers: Record<string, any>;
  data?: Record<string, any>;
  method?: string;
  url?: string;
}

const httpRequest = (
  verb: string,
  endpoint: string,
  data?: Record<string, any> | null,
  headers = {}
) => {
  const config: Config = {
    headers,
  };

  const token = window.sessionStorage.getItem('token') || null;

  if (typeof token === 'string') {
    const parsedToken = JSON.parse(token);

    config.headers.Authorization = `Bearer ${parsedToken}`;
  }

  config.method = verb;

  config.url = import.meta.env.VITE_API_URL + endpoint;

  if (data) config.data = data;

  return new Promise((resolve, reject) => {
    axios(config)
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

// handle get requests
/**
 * @param {string} endpoint
 * @param {object} headers
 * @returns {Promise}
 *
 * This function is used to handle get requests, receives the endpoint and the headers,
 * if not headers are passed, then the headers object is setted to {}
 * if token exist in localStorage, then add it to headers
 */
export const getRequest = (endpoint: string, headers?: Record<string, any>): Promise<any> =>
  httpRequest('get', endpoint, null, headers);

// handle post requests
/**
 * @param {string} endpoint
 * @param {object} data
 * @param {object} headers
 * @returns {Promise}
 *
 * this function is used to handle post requests, receives the endpoint, data and headers,
 * if not headers are passed, then the headers object is setted to {}
 * if token exist in localStorage, then add it to headers
 */
export const postRequest = (
  endpoint: string,
  data: any,
  headers?: Record<string, any>
): Promise<any> => httpRequest('post', endpoint, data, headers);

// handle put requests
/**
 * @param {string} endpoint
 * @param {object} data
 * @param {object} headers
 * @returns {Promise}
 *
 * this function is used to handle put requests, receives the endpoint, data and headers,
 * if not headers are passed, then the headers object is setted to {}
 * if token exist in localStorage, then add it to headers
 */

export const putRequest = (
  endpoint: string,
  data: Record<string, any>,
  headers?: Record<string, any>
): Promise<any> => httpRequest('put', endpoint, data, headers);

// handle patch requests
/**
 * @param {string} endpoint
 * @param {object} data
 * @param {object} headers
 * @returns {Promise}
 *
 * this function is used to handle put requests, receives the endpoint, data and headers,
 * if not headers are passed, then the headers object is setted to {}
 * if token exist in localStorage, then add it to headers
 */
export const patchRequest = (
  endpoint: string,
  data: Record<string, any>,
  headers?: Record<string, any>
): Promise<any> => httpRequest('patch', endpoint, data, headers);

/**
 * @param {string} endpoint
 * @param {object} headers
 * @returns {Promise}
 *
 * this function is used to handle delete requests, receives the endpoint, data and headers,
 * if not headers are passed, then the headers object is setted to {}
 * if token exist in localStorage, then add it to headers
 */

export const deleteRequest = (endpoint: string, headers?: Record<string, any>): Promise<any> =>
  httpRequest('delete', endpoint, null, headers);
