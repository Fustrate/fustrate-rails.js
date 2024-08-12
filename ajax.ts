import axios, { type AxiosResponse } from 'axios';

import Flash from './components/flash';
import { addDebugData } from './debug';

export function csrfToken(): string | undefined {
  return document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content;
}

function processResponseError(response: AxiosResponse<{ errors?: string[] }>) {
  const { data, status } = response;

  if (!status || status === 404) {
    // eslint-disable-next-line no-alert
    window.alert('The server is not responding - please wait a while before trying again.');
  } else if (status === 401) {
    // eslint-disable-next-line no-alert
    window.alert('You are not currently logged in. Please refresh the page and try performing this action again. To prevent this in the future, check the "Remember Me" box when logging in.');
  } else if (data.errors) {
    for (const message of data.errors) {
      Flash.error(message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`Unhandled interception (${status})`, response);
  }
}

function processRequestError(request: Record<string, any>) {
  // eslint-disable-next-line no-alert
  window.alert('There was a problem connecting to the server - please wait a while before trying again.');

  addDebugData({
    status: request.status,
    statusText: request.statusText,
    readyState: request.readyState,
    responseType: request.responseType,
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

instance.interceptors.request.use((config) => config, (error) => Promise.reject(new Error(error)));

// The interceptor only handles basic 401 errors and error responses - it will still throw so that
// more involved error handling can happen later.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if ('response' in error && error.response) {
      processResponseError(error.response);
    } else if ('request' in error && error.request) {
      processRequestError(error.request);
    }

    return Promise.reject(new Error(error));
  },
);

export async function when<T>(...requests: any[]): Promise<T> {
  return new Promise((resolve) => {
    axios.all(requests).then(
      axios.spread((...responses) => { resolve(responses as T); }),
    );
  });
}

export default instance;
