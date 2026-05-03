import ky, { type KyRequest, type BeforeErrorHook, type KyResponse, isHTTPError } from 'ky';

import { addDebugData } from './debug';

export function csrfToken(): string | undefined {
  return document.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content;
}

type ResponseErrorData = { errors?: string[] };
type ResponseErrorHandler = (response: KyResponse<ResponseErrorData>, data?: ResponseErrorData) => void;

let onResponseError: ResponseErrorHandler = (response, data) => {
  const { status } = response;

  if (!status || status === 404) {
    window.alert('The server is not responding - please wait a while before trying again.');
  } else if (status === 401) {
    window.alert(
      'You are not currently logged in. Please refresh the page and try performing this action again. To prevent this in the future, check the "Remember Me" box when logging in.',
    );
  } else if (data?.errors) {
    console.log('Errors encountered:', data.errors);
  } else {
    console.log(`Unhandled interception (${status})`, response);
  }
};

export function setResponseErrorHandler(f: ResponseErrorHandler): void {
  onResponseError = f;
}

function processRequestError(request: KyRequest) {
  window.alert('There was a problem connecting to the server - please wait a while before trying again.');

  addDebugData({
    destination: request.destination,
  });
}

const errorHandler: BeforeErrorHook = async ({ error, request }) => {
  if (isHTTPError(error)) {
    const response = error.response as KyResponse<ResponseErrorData>;
    const data = error.data as ResponseErrorData | undefined;

    onResponseError(response, data);
  } else if (request) {
    processRequestError(request);
  }

  return Promise.reject(error);
};

const instance = ky.create({
  headers: {
    'X-CSRF-Token': csrfToken(),
  },
  hooks: {
    beforeError: [errorHandler],
  },
});

// export async function when<T>(...requests: any[]): Promise<T> {
//   return new Promise((resolve) => {
//     axios.all(requests).then(
//       axios.spread((...responses) => {
//         resolve(responses as T);
//       }),
//     );
//   });
// }

export default instance;
