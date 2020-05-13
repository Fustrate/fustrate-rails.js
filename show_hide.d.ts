declare module "@fustrate/rails/show_hide" {
    export function isVisible(elem: HTMLElement): boolean;
    export function toggle(element: NodeList | HTMLElement, showOrHide?: boolean): void;
    export function show(element: NodeList | HTMLElement): void;
    export function hide(element: NodeList | HTMLElement): void;
}
