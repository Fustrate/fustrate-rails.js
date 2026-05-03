import type { Options } from 'ky';
import ajax from './ajax';
import type { PaginatedData } from './components/pagination';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonRequestData = FormData | JsonValue | undefined;

function pathToJsonURL(path: string): string {
  const url = path.startsWith('/') ? new URL(path, window.location.origin) : new URL(path);

  const pathname = url.pathname.replace(/\/+$/, '');

  if (pathname === '') {
    const search = new URLSearchParams(url.search);

    search.set('format', 'json');

    url.search = search.toString();
  } else if (!pathname.endsWith('.json')) {
    url.pathname = `${pathname}.json`;
  }

  return url.toString();
}

function optionsForData(data: JsonRequestData): Options {
  if (data instanceof FormData) {
    return { body: data };
  } else {
    return { json: data, headers: { 'content-type': 'application/json' } };
  }
}

export async function getJSON<T>(url: string): Promise<T> {
  const response = ajax.get<T>(pathToJsonURL(url), { headers: { 'content-type': 'application/json' } });

  return await response.json();
}

export async function patchJSON<T>(url: string, data: JsonRequestData): Promise<T> {
  const response = await ajax.patch<T>(pathToJsonURL(url), optionsForData(data));

  return await response.json();
}

export async function postJSON<T>(url: string, data?: JsonRequestData): Promise<T> {
  const response = await ajax.post<T>(pathToJsonURL(url), optionsForData(data));

  return await response.json();
}

export async function getCurrentPageJSON<T = unknown>(): Promise<T> {
  return getJSON<T>(window.location.toString());
}

export async function getPaginatedJSON<T>(url: string): Promise<PaginatedData<T>> {
  return getJSON<PaginatedData<T>>(url);
}
