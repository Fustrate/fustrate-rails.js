import type { AxiosResponse } from 'axios';

type ModalButton = 'spacer' | string | { [s: string]: string | { text?: string, type?: string } }

export interface ModalSettings {
    buttons?: ModalButton[];
    closeOnBackgroundClick?: boolean;
    content?: string;
    distanceFromTop?: number;
    icon?: string;
    size?: string;
    title?: string;
    type?: string;
}

export interface PaginationData {
    currentPage?: number;
    perPage?: number;
    totalEntries?: number;
    totalPages?: number;
}

export interface GenericTableSettings {
    [s: string]: any;
    blankRow?: string;
    noRecordsMessage?: string;
}

export interface UIElements {
    [s: string]: HTMLElement | UIElements | UIElements[];
}

export type ParamValue = string | number | boolean | null | undefined | File | ParamValue[] | { [s: string]: ParamValue };
export type Parameters = { [s: string]: ParamValue };

export class Listenable {
    protected listeners: { [s: string]: ((event: CustomEvent) => void)[] };

    public addEventListener(type: string, listener: (event: CustomEvent) => void): void;
    public removeEventListener(type: string, listener: (event: CustomEvent) => void): void;

    public dispatchEvent(event: CustomEvent): boolean;
}

export class BasicObject extends Listenable {
    public static build<T extends typeof BasicObject>(this: T, data?: { [s: string]: any }, attributes?: { [s: string]: any }): InstanceType<T>;
    public static buildList<T extends typeof BasicObject>(this: T, items: any[], attributes?: { [s: string]: any }): InstanceType<T>[];

    public constructor(data?: number | string);

    public extractObjectsFromData(data: { [s: string]: any }): void;

    public get isBasicObject(): boolean;

    protected extractFromData(data: { [s: string]: any }): { [s: string]: any };
}

export class Record extends BasicObject {
    public static classname: string;

    public id?: number;
    protected isLoaded: boolean;

    public constructor(data?: number | string);

    public delete(params?: Parameters): Promise<AxiosResponse<any>>;
    public extractFromData(data: number | string | { [s: string]: any }): { [s: string]: any };
    public path(options?: { format?: string }): string;
    public reload(options?: { force?: boolean }): Promise<AxiosResponse<any>>;
    public update(attributes: Parameters, additionalParameters?: Parameters): Promise<AxiosResponse<any>>;

    public get classname(): string;

    public static create<T extends typeof Record>(this: T, attributes: { [s: string]: any }, additionalParameters?: Parameters): Promise<InstanceType<T>>;

    public static get paramKey(): string;
}

export class Component extends Listenable {
}

export class AlertBox extends Component {
    public static initialize(): void;
    protected static closeAlertBox(event: UIEvent): false;
}

export class Disclosure extends Component {
    public static initialize(): void;
    protected static toggleDisclosure(event: UIEvent): false;
}

export class DropZone extends Component {
    protected constructor(target: HTMLElement, callback: (files: File[]) => void);

    public static create(target: HTMLElement, callback: (files: File[]) => void): void;
}

export class Dropdown extends Component {
    public static initialize(): void;
    protected static open(event: UIEvent): false;
    protected static hide(): void;
}

export class FilePicker extends Component {
    protected constructor(callback: (files: File[]) => void);

    public static open(callback: (files: File[]) => void): FilePicker;
}

export class Flash extends Component {
    protected constructor(message: string, options: { type: string, icon?: string });

    public static show(message: string, options: { type: string, icon?: string }): Flash;
}

export class InfoFlash extends Flash {
    protected constructor(message: string, options?: { icon?: string });

    public static show(message: string, options?: { icon?: string }): InfoFlash;
}

export class ErrorFlash extends Flash {
    protected constructor(message: string, options?: { icon?: string });

    public static show(message: string, options?: { icon?: string }): ErrorFlash;
}

export class SuccessFlash extends Flash {
    protected constructor(message: string, options?: { icon?: string });

    public static show(message: string, options?: { icon?: string }): SuccessFlash;
}

export class Modal<T = void> extends Component {
    protected buttons: UIElements;
    protected fields: UIElements;
    protected modalId: number;
    protected settings: ModalSettings;
    protected modal: HTMLDivElement;

    protected promise: Promise<T>;
    protected resolve: (value?: T) => void;
    protected reject: (reason?: any) => void;

    public constructor(settings?: ModalSettings);

    public static hideAllModals(): void;

    protected static get settings(): ModalSettings;

    protected static backgroundClicked(): false;
    protected static keyPressed(event: UIEvent): void;

    public close(openPrevious?: boolean): void;
    public hide(): void;
    public open(reopening?: boolean): Promise<T>;

    protected addEventListeners(): void;
    protected cancel(): void;
    protected closeButtonClicked(event: UIEvent): false;
    protected createModal(): HTMLDivElement;
    protected defaultClasses(): string[];
    protected focusFirstInput(): void;
    protected initialize(): void;
    protected openPreviousModal(): void;
    protected reloadUIElements(): void;
    protected setButtons(buttons: ModalButton[], reload?: boolean): void;
    protected disableButtons(): void;
    protected enableButtons(): void;
    protected setContent(content: string, reload?: boolean): void;
    protected setTitle(title: string, options?: { icon?: string }): void;
}

export class Pagination extends Component {
    protected currentPage: number;
    protected totalPages: number;
    protected totalEntries: number;
    protected perPage: number;
    protected base: string;

    public constructor(options: PaginationData);

    public generate(): HTMLUListElement;

    protected static getCurrentPage(): number;

    protected link(text: string, page: number, attributes: { [s: string]: any }): string;
    protected nextLink(): HTMLLIElement;
    protected previousLink(): HTMLLIElement;
    protected windowedPageNumbers(): (string|number)[];
}

export class Tabs extends Component {
    protected tabs: HTMLUListElement;

    public constructor(tabs: HTMLUListElement);

    public static initialize(): Tabs;

    protected activateTab(tab: HTMLLIElement, changeHash: boolean): void;
}

export class FormDataBuilder {
    public static appendObject(data: FormData, key: string, value: any): void;
    public static build(obj: { [s: string]: any }, namespace?: string): FormData;
    public static toFormData(data: FormData, obj: { [s: string]: any }, namespace?: string): FormData;
}

// interface MethodDecoratorTarget {
//     kind: 'method';
//     key: string | symbol;
//     placement: 'prototype';
// }

// type DecoratorFunction = (target: MethodDecoratorTarget, key: string, descriptor: PropertyDescriptor) => void;

export function callDecoratedMethods(obj: object, tag: string): void;

export function decorateMethod(value: string): any;

export class GenericPage {
    protected fields: UIElements;
    protected buttons: UIElements;
    protected allMethodNamesList: string[];

    public initialize(): Promise<any>;
    public refresh(): void;

    protected addEventListeners(): void;
    protected reloadUIElements(): void;
    protected setHeader(text: string): void;
}

export class GenericTable<T> extends GenericPage {
    protected table: HTMLTableElement;
    protected tbody: HTMLTableSectionElement;
    protected settings: GenericTableSettings;

    protected static blankRow: string;
    protected static noRecordsMessage: string;

    public constructor(tableSelector: string, settings: GenericTableSettings);

    public initialize(): Promise<any>;

    protected addRow(row: HTMLTableRowElement): void;
    protected checkAll(event: UIEvent): void;
    protected createRow(item: T): HTMLTableRowElement;
    protected getCheckedIds(): string[];
    protected reloadRows(trs: HTMLTableRowElement[], options?: { sort?: (row: HTMLTableRowElement) => string }): void;
    protected reloadTable(): void;
    protected removeRow(row: HTMLTableRowElement): void;
    protected uncheckAll(): void;
    protected updated(): void;
    protected updatePagination(data: PaginationData): void;
    protected updateRow(row: HTMLTableRowElement, item: T): void;
}

export class Fustrate {
    public static instance: GenericPage;

    public constructor();

    public static start(klass: typeof GenericPage): void;

    protected static initialize(): void;
}

export default Fustrate;
