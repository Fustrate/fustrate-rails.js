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

export async function getJSON<T>(url: string): Promise<T> {
  const response = ajax.get<T>(pathToJsonURL(url), { headers: { 'content-type': 'application/json' } });

  return await response.json();
}

export async function patchJSON<T>(url: string, data: any): Promise<T> {
  const response = ajax.patch<T>(pathToJsonURL(url), { json: data, headers: { 'content-type': 'application/json' } });
  return await response.json();
}

export async function postJSON<T>(url: string, data?: any): Promise<T> {
  const response = ajax.post<T>(pathToJsonURL(url), { json: data, headers: { 'content-type': 'application/json' } });
  return await response.json();
}

export async function getCurrentPageJSON<T = any>(): Promise<T> {
  return getJSON<T>(window.location.toString());
}

export async function getPaginatedJSON<T>(url: string): Promise<PaginatedData<T>> {
  return getJSON<PaginatedData<T>>(url);
}
