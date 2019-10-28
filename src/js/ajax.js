import axios from 'axios';
import { ErrorFlash } from './components/flash';

// Supports: Internet Explorer 11
require('core-js/features/promise');

const token = document.querySelector('[name="csrf-token"]') || { content: 'no-csrf-token' };

const instance = axios.create({
  headers: {
    common: {
      'X-CSRF-Token': token.content,
    },
  },
  responseType: 'json',
});

export function errorHandler(error) {
  const { data, status } = error.response;

  if (status === 401) {
    // eslint-disable-next-line no-alert
    window.alert(`
    You are not currently logged in. Please refresh the page and try performing this action again.
    To prevent this in the future, check the "Remember Me" box when logging in.`);
  } else if (data && data.errors) {
    data.errors.forEach((message) => {
      ErrorFlash.show(message);
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Unhandled interception', error.response);
  }
}

export const get = (url, config = {}) => instance.get(url, config);
export const post = (url, data, config = {}) => instance.post(url, data, config);
export const patch = (url, data, config = {}) => instance.patch(url, data, config);

export const when = (...requests) => new Promise((resolve) => {
  axios.all(requests).then(
    axios.spread((...responses) => {
      resolve(...responses);
    }),
  );
});

export const getCurrentPageJson = () => {
  const pathname = window.location.pathname.replace(/\/+$/, '');

  return get(`${pathname}.json${window.location.search}`);
};

export default instance;
