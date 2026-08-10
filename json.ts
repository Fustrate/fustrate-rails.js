import type { Options } from 'ky';
import ajax from './ajax';
import type { PaginatedData } from './components/pagination';

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

function optionsForData(data: any): Options {
  if (data instanceof FormData) {
    return { body: data };
  } else {
    return { json: data, headers: { 'content-type': 'application/json' } };
  }
}

interface JSONOptions {
  parseResponse?: boolean;
}

export async function getJSON<T>(url: string): Promise<T> {
  const response = ajax.get<T>(pathToJsonURL(url), { headers: { 'content-type': 'application/json' } });

  return await response.json();
}

export function patchJSON(url: string, data: any, options: { parseResponse: false }): Promise<void>;
export function patchJSON<T>(url: string, data: any, options?: { parseResponse?: true }): Promise<T>;
export function patchJSON<T>(url: string, data: any): Promise<T>;
export async function patchJSON<T>(url: string, data: any, options: JSONOptions = {}): Promise<T | undefined> {
  const response = await ajax.patch<T>(pathToJsonURL(url), optionsForData(data));

  if (options.parseResponse === false) {
    return;
  }

  // Fallback for when the client hasn't been updated to pass parseResponse: false and the server returns a
  // 204 No Content response.
  if (response.status === 204) {
    return;
  }

  return await response.json();
}

export function postJSON(url: string, data: any, options: { parseResponse: false }): Promise<void>;
export function postJSON<T>(url: string, data?: any, options?: { parseResponse?: true }): Promise<T>;
export function postJSON<T>(url: string, data?: any): Promise<T>;
export async function postJSON<T>(url: string, data?: any, options: JSONOptions = {}): Promise<T | undefined> {
  const response = await ajax.post<T>(pathToJsonURL(url), optionsForData(data));

  if (options.parseResponse === false) {
    return;
  }

  // Fallback for when the client hasn't been updated to pass parseResponse: false and the server returns a
  // 204 No Content response.
  if (response.status === 204) {
    return;
  }

  return await response.json();
}

export async function getCurrentPageJSON<T = any>(): Promise<T> {
  return getJSON<T>(window.location.toString());
}

export async function getPaginatedJSON<T>(url: string): Promise<PaginatedData<T>> {
  return getJSON<PaginatedData<T>>(url);
}
