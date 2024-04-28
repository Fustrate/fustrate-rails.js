function toggleElement(element: HTMLElement, makeVisible?: boolean) {
  if (makeVisible == null) {
    makeVisible = element.style.display === 'none';
  }

  element.style.display = makeVisible ? '' : 'none';

  if (makeVisible) {
    element.classList.remove('js-hide');
  }
}

export function isVisible(elem: HTMLElement): boolean {
  return elem.parentElement != null
    && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length > 0) != null;
}

export function toggle(element: NodeList | HTMLElement, showOrHide?: boolean): void {
  if (element instanceof NodeList) {
    element.forEach((elem) => {
      toggleElement(elem as HTMLElement, showOrHide ?? !isVisible(elem as HTMLElement));
    });
  } else {
    toggleElement(element, showOrHide ?? !isVisible(element));
  }
}

export function show(element: NodeList | HTMLElement): void {
  toggle(element, true);
}

export function hide(element: NodeList | HTMLElement): void {
  toggle(element, false);
}
