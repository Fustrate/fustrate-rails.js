import axios from 'axios';
import { ErrorFlash } from './components/flash';
import { addDebugData } from './debug';

function processResponseError(response) {
  const { data, status } = response;

  if (!status || status === 404) {
    // eslint-disable-next-line no-alert
    window.alert('The server is not responding - please wait a while before trying again.');
  } else if (status === 401) {
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
    console.log(`Unhandled interception (${status})`, response);
  }
}

function processRequestError(request) {
  // eslint-disable-next-line no-alert
  window.alert('There was a problem connecting to the server - please wait a while before trying again.');

  addDebugData({
    status: request.status,
    statusText: request.statusText,
    readyState: request.readyState,
    resonseType: request.resonseType,
  });
}

const token = document.querySelector('[name="csrf-token"]') || { content: 'no-csrf-token' };

const instance = axios.create({
  headers: {
    common: {
      'X-CSRF-Token': token.content,
    },
  },
  responseType: 'json',
});

instance.interceptors.request.use((config) => config, (error) => Promise.reject(error));

// The interceptor only handles basic 401 errors and error responses - it will still throw so that
// more involved error handling can happen later.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      processResponseError(error.response);
    } else if (error.request) {
      processRequestError(error.request);
    }

    return Promise.reject(error);
  },
);

export function when(...requests) {
  return new Promise((resolve) => {
    axios.all(requests).then(
      axios.spread((...responses) => resolve(responses)),
    );
  });
}

export function getCurrentPageJson() {
  let pathname = window.location.pathname.replace(/\/+$/, '');
  let { search } = window.location;

  if (pathname === '') {
    search = search === '' ? '?format=json' : `${search}&format=json`;
  } else {
    pathname = `${pathname}.json`;
  }

  return instance.get(`${pathname}${search}`);
}

export function csrfToken() {
  const meta = document.querySelector('meta[name=csrf-token]');

  return meta && meta.content;
}

export default instance;
