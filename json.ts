import { type AxiosPromise } from 'axios';

import ajax from './ajax';

function pathToJsonURL(path: string): string {
  const url = path[0] === '/' ? new URL(path, window.location.origin) : new URL(path);

  const pathname = url.pathname.replace(/\/+$/, '');

  if (pathname === '') {
    const search = new URLSearchParams(url.search);

    search.set('format', 'json');

    url.search = search.toString();
  } else {
    url.pathname = `${pathname}.json`;
  }

  return url.toString();
}

export async function getJSON<T>(url: string): AxiosPromise<T> {
  return ajax.get<T>(pathToJsonURL(url));
}

export async function patchJSON<T>(url: string, data: any): AxiosPromise<T> {
  return ajax.patch<T>(pathToJsonURL(url), data);
}

export async function postJSON<T>(url: string, data?: any): AxiosPromise<T> {
  return ajax.post<T>(pathToJsonURL(url), data);
}

export async function getCurrentPageJson<T = any>(): AxiosPromise<T> {
  return getJSON<T>(window.location.toString());
}
