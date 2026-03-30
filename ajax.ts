import ky, { type BeforeErrorHook } from 'ky';

import { addDebugData } from './debug';

export function csrfToken(): string | undefined {
  return document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content;
}

const onResponseError: BeforeErrorHook = async (error) => {
  const { request, response } = error;
  const { url, method } = request;
  const { status, statusText } = response;

  addDebugData({ status, url, method, statusText });

  if (!status || status === 404) {
    window.alert('The server is not responding - please wait a while before trying again.');
  } else if (status === 401) {
    window.alert(
      'You are not currently logged in. Please refresh the page and try performing this action again. ' +
        'To prevent this in the future, check the "Remember Me" box when logging in.',
    );
  } else {
    console.log(`Unhandled interception (${status})`, error.response);
  }

  return error;
};

const instance = ky.create({
  headers: {
    'X-CSRF-Token': csrfToken(),
  },
  hooks: {
    beforeError: [onResponseError],
  },
  // stringifyJson: data => JSON.stringify(data, (key, value) => {
  //   if (key.endsWith('_at')) {
  //       return DateTime.fromISO(value);
  //   }

  //   return value;
  // }),
});

export default instance;
