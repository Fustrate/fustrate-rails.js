import Axios, { AxiosPromise } from 'axios';

export function when(...requests: AxiosPromise[]): Promise<any>;
export function getCurrentPageJson(): AxiosPromise;

export default Axios;
