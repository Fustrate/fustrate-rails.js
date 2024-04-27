// A few select tags that we're most likely to show or hide
const defaultDisplayMap: Record<string, string> = {
  A: 'inline',
  BUTTON: 'inline',
  DIV: 'block',
  FORM: 'block',
  IMG: 'inline',
  INPUT: 'inline',
  LABEL: 'inline',
  P: 'block',
  PRE: 'block',
  SECTION: 'block',
  SELECT: 'inline',
  SPAN: 'inline',
  TABLE: 'block',
  TEXTAREA: 'inline',
};

function getDefaultDisplay(elem: HTMLElement) {
  const { nodeName } = elem;
  let display = defaultDisplayMap[nodeName];

  if (display) {
    return display;
  }

  const { ownerDocument } = elem;

  const temp = ownerDocument.createElement(nodeName);
  ownerDocument.body.append(temp);

  ({ display } = temp.style);

  temp.remove();

  if (display === 'none') {
    display = 'block';
  }

  defaultDisplayMap[nodeName] = display;

  return display;
}

function toggleElement(element: HTMLElement, makeVisible?: boolean) {
  if (makeVisible == null) {
    makeVisible = element.style.display === 'none';
  }

  element.style.display = makeVisible ? getDefaultDisplay(element) : 'none';

  if (makeVisible) {
    element.classList.remove('js-hide');
  }
}

export function isVisible(elem: HTMLElement): boolean {
  return !!(
    elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length > 0
  );
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
