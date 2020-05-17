import Axios, { AxiosPromise } from 'axios';

export function when<T>(...requests: any[]): Promise<T>;
export function getCurrentPageJson(): AxiosPromise;

export default Axios;
