function toggleElement(element: HTMLElement, makeVisible?: boolean) {
  if (makeVisible == null) {
    makeVisible = element.style.display === 'none';
  }

  element.style.display = makeVisible ? '' : 'none';
  element.classList.toggle('js-show', makeVisible);
  element.classList.toggle('js-hide', !makeVisible);

  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
  // aria-hidden="true" should not be added when:
  // - The HTML hidden attribute is present
  // - The element or the element's ancestor is hidden with display: none
  // - The element or the element's ancestor is hidden with visibility: hidden
}

export function isVisible(element: HTMLElement): boolean {
  if (element.classList.contains('js-hide') && !element.classList.contains('js-show')) {
    return false;
  }

  // Safari < 17.4 doesn't have this function
  if (typeof HTMLElement.prototype.checkVisibility === 'function') {
    return element.checkVisibility();
  }

  return element.parentElement != null
    && (element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0);
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
