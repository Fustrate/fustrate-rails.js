import AxiosInstance, { AxiosPromise } from 'axios';

export function csrfToken(): string;
export function getCurrentPageJson<T = any>(): AxiosPromise<T>;
export function when<T>(...requests: any[]): Promise<T>;

export default AxiosInstance;
