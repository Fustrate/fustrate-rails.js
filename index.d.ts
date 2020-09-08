import type Awesomplete from 'awesomplete';
import type { AxiosResponse } from 'axios';

type ModalButton = 'spacer' | string | { [s: string]: string | { text?: string, type?: string } }

export interface ModalSettings {
    buttons?: ModalButton[],
    closeOnBackgroundClick?: boolean,
    content?: string,
    distanceFromTop?: number,
    icon?: string,
    size?: string,
    title?: string,
    type?: string,
}

export interface PaginationData {
    currentPage?: number,
    perPage?: number,
    totalEntries?: number,
    totalPages?: number,
}

export interface GenericTableSettings {
    blankRow?: string,
    noRecordsMessage?: string,
    [s: string]: any,
}

export class Listenable {
    listeners: { [s: string]: ((event: CustomEvent) => void)[] };

    addEventListener(type: string, listener: (event: CustomEvent) => void): void;
    dispatchEvent(event: CustomEvent): boolean;
    removeEventListener(type: string, listener: (event: CustomEvent) => void): void;
}

export class BasicObject extends Listenable {
    constructor(data?: number | string);

    extractFromData(data: { [s: string]: any }): { [s: string]: any };

    get isBasicObject(): boolean;

    static build<T extends typeof BasicObject>(this: T, data?: { [s: string]: any }, attributes?: { [s: string]: any }): InstanceType<T>;
    static buildList<T extends typeof BasicObject>(this: T, items: any[], attributes?: { [s: string]: any }): InstanceType<T>[];
}

export class Record extends BasicObject {
    static classname: string;

    id?: number;
    isLoaded: boolean;

    constructor(data?: number | string);

    delete(params?:  { [s: string]: any }): Promise<AxiosResponse<any>>;
    extractFromData(data: number | string | { [s: string]: any }): { [s: string]: any };
    path(options?: { format?: string }): string;
    reload(options?: { force?: boolean }): Promise<AxiosResponse<any>>;
    update(attributes: { [s: string]: any }, additionalParameters?: { [s: string]: any }): Promise<AxiosResponse<any>>;

    get classname(): string;

    static create<T extends typeof Record>(this: T, attributes: { [s: string]: any }): Promise<InstanceType<T>>;

    static get paramKey(): string;
}

export class Component extends Listenable {
}

export class AlertBox extends Component {
    static closeAlertBox(event: UIEvent): false;
    static initialize(): void;
}

export class AutocompleteSuggestion extends String {
    datum: any;

    constructor(datum: any, displayValue: string);

    highlight(input: string, text: string): string;
    highlightedHTML(value: string): string;
    item(text: string): HTMLLIElement;
}

export class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
    constructor(datum: any);
}

export class AutocompleteSource {
    filter(suggestion: AutocompleteSuggestion, userInput: string): boolean;
    matches(datum: any): boolean;
    suggestion(datum: any): AutocompleteSuggestion;
}

export class PlainAutocompleteSource extends AutocompleteSource {
    list: string[];

    constructor(list: string[]);

    filter(suggestion: AutocompleteSuggestion, userInput: string): boolean;
    matchingData(searchTerm: string): string[];
    suggestion(datum: any): PlainAutocompleteSuggestion;
}

export interface AutocompleteOptions {
    source?: AutocompleteSource,
    sources?: AutocompleteSource[],
    list?: string[],
    [s: string]: any,
}

export class Autocomplete extends Component {
    input: HTMLElement;
    awesomplete: Awesomplete;
    sources: AutocompleteSource[];
    value: string;

    constructor(input: HTMLElement, options?: AutocompleteOptions);

    blanked(): void;
    extractOptions(options: AutocompleteOptions): void;
    highlight(text: string): string;
    onFocus(): void;
    onKeyup(event: UIEvent): void;
    onSelect(event: UIEvent): void;
    replace(suggestion: AutocompleteSuggestion): void;
    sourceForDatum(datum: any): AutocompleteSource;
    suggestionForDatum(datum: any): AutocompleteSuggestion;

    static create<T extends typeof Autocomplete>(this: T, input: HTMLElement, options?: AutocompleteOptions): InstanceType<T>;
}

export class PlainAutocomplete extends Autocomplete {
    list: any[];
}

export class Disclosure extends Component {
    static initialize(): void;
    static toggleDisclosure(event: UIEvent): false;
}

export class DropZone extends Component {
    constructor(target: HTMLElement, callback: (files: File[]) => void);

    static create(target: HTMLElement, callback: (files: File[]) => void): void;
}

export class Dropdown extends Component {
    static initialize(): void;
    static open(event: UIEvent): false;
    static hide(): void;
}

export class FilePicker extends Component {
    constructor(callback: (files: File[]) => void);

    static open(callback: (files: File[]) => void): FilePicker;
}

export class Flash extends Component {
    constructor(message: string, options: { type: string, icon?: string });

    static show(message: string, options: { type: string, icon?: string }): Flash;
}

export class InfoFlash extends Flash {
    constructor(message: string, options?: { icon?: string });

    static show(message: string, options?: { icon?: string }): InfoFlash;
}

export class ErrorFlash extends Flash {
    constructor(message: string, options?: { icon?: string });

    static show(message: string, options?: { icon?: string }): ErrorFlash;
}

export class SuccessFlash extends Flash {
    constructor(message: string, options?: { icon?: string });

    static show(message: string, options?: { icon?: string }): SuccessFlash;
}

export class Modal extends Component {
    buttons: { [s: string]: HTMLElement };
    fields: { [s: string]: HTMLElement };
    modalId: number;
    settings: ModalSettings;
    modal: HTMLDivElement;

    promise: Promise<any>;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;

    static get settings(): ModalSettings;

    static build<T extends typeof Modal>(this: T): InstanceType<T>;

    constructor(settings?: ModalSettings);

    addEventListeners(): void;
    cancel(): void;
    close(openPrevious?: boolean): void;
    closeButtonClicked(event: UIEvent): false;
    createModal(): HTMLDivElement;
    defaultClasses(): string[];
    focusFirstInput(): void;
    hide(): void;
    initialize(): void;
    open(reopening?: boolean): Promise<any>;
    openPreviousModal(): void;
    reloadUIElements(): void;
    setButtons(buttons: ModalButton[], reload?: boolean): void;
    setContent(content: string, reload?: boolean): void;
    setTitle(title: string, options?: { icon?: string }): void;

    static backgroundClicked(): false;
    static hideAllModals(): void;
    static keyPressed(event: UIEvent): void;
}

export class Pagination extends Component {
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    perPage: number;
    base: string;

    constructor(options: PaginationData);

    generate(): HTMLUListElement;
    link(text: string, page: number, attributes: { [s: string]: any }): string;
    nextLink(): HTMLLIElement;
    previousLink(): HTMLLIElement;
    windowedPageNumbers(): (string|number)[];

    static getCurrentPage(): number;
}

export class Tabs extends Component {
    tabs: HTMLUListElement;

    constructor(tabs: HTMLUListElement);

    activateTab(tab: HTMLLIElement, changeHash: boolean): void;

    static initialize(): Tabs;
}

export class FormDataBuilder {
    static appendObject(data: FormData, key: string, value: any): void;
    static build(obj: { [s: string]: any }, namespace?: string): FormData;
    static toFormData(data: FormData, obj: { [s: string]: any }, namespace?: string): FormData;
}

export class GenericPage {
    fields: { [s: string]: HTMLElement };
    buttons: { [s: string]: HTMLElement };
    allMethodNamesList: string[];

    addEventListeners(): void;
    callAllMethodsBeginningWith(string: string): void;
    getAllMethodNames(): string[];
    initialize(): Promise<any>;
    refresh(): void;
    reloadUIElements(): void;
    setHeader(text: string): void;
}

export class GenericTable extends GenericPage {
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    settings: GenericTableSettings;

    static blankRow: string;
    static noRecordsMessage: string;

    constructor(tableSelector: string, settings: GenericTableSettings);

    addRow(row: HTMLTableRowElement): void;
    checkAll(event: UIEvent): void;
    createRow(item: Record | { [s: string]: any }): HTMLTableRowElement;
    getCheckedIds(): string[];
    initialize(): Promise<any>;
    reloadRows(trs: HTMLTableRowElement[], options?: { sort?: (a: HTMLTableRowElement, b: HTMLTableRowElement) => number }): void;
    reloadTable(): void;
    removeRow(row: HTMLTableRowElement): void;
    uncheckAll(): void;
    updated(): void;
    updatePagination(data: PaginationData): void;
    updateRow(row: HTMLTableRowElement, item: any): void;
}

export class Fustrate {
    static instance: GenericPage;

    constructor();

    static initialize(): void;
    static start(klass: typeof GenericPage): void;
}

export default Fustrate;
