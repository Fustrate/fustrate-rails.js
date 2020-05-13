import { AxiosInstance, AxiosPromise } from 'axios';

declare module "@fustrate/rails/ajax" {
    export function when(...requests: AxiosPromise[]): Promise<any>;
    export function getCurrentPageJson(): AxiosPromise;

    export = AxiosInstance;
}
