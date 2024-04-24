import axios from 'axios';

import Flash from './components/flash';
import { addDebugData } from './debug';

export function csrfToken(): string | undefined {
  return document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content;
}

function processResponseError(response) {
  const { data, status } = response;

  if (!status || status === 404) {
    // eslint-disable-next-line no-alert
    window.alert('The server is not responding - please wait a while before trying again.');
  } else if (status === 401) {
    // eslint-disable-next-line no-alert
    window.alert('You are not currently logged in. Please refresh the page and try performing this action again. To prevent this in the future, check the "Remember Me" box when logging in.');
  } else if (data?.errors) {
    data.errors.forEach((message) => {
      Flash.error(message);
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

const instance = axios.create({
  headers: {
    common: {
      'X-CSRF-Token': csrfToken(),
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

export async function when<T>(...requests: any[]): Promise<T> {
  return new Promise((resolve) => {
    axios.all(requests).then(
      axios.spread((...responses) => resolve(responses as T)),
    );
  });
}

export default instance;
