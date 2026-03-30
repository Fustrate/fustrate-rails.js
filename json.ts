import type { KyResponse } from 'ky';

import ajax from './ajax';
import type { PaginatedData } from './components/pagination';

function pathToJsonURL(path: string): string {
  const url = path.startsWith('/') ? new URL(path, window.location.origin) : new URL(path);

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

export async function getJSON<T>(url: string): Promise<KyResponse<T>> {
  return ajax.get<T>(pathToJsonURL(url));
}

export async function patchJSON<T>(url: string, data: any): Promise<KyResponse<T>> {
  return ajax.patch<T>(pathToJsonURL(url), { body: data });
}

export async function postJSON<T>(url: string, data?: any): Promise<KyResponse<T>> {
  return ajax.post<T>(pathToJsonURL(url), { body: data });
}

export async function getCurrentPageJSON<T = any>(): Promise<KyResponse<T>> {
  return getJSON<T>(window.location.toString());
}

export async function getPaginatedJSON<T>(url: string): Promise<KyResponse<PaginatedData<T>>> {
  return getJSON<PaginatedData<T>>(url);
}
