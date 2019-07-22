// A few select tags that we're most likely to show or hide
const defaultDisplayMap = {
  'A': 'inline',
  'BUTTON': 'inline',
  'DIV': 'block',
  'FORM': 'block',
  'IMG': 'inline',
  'INPUT': 'inline',
  'LABEL': 'inline',
  'P': 'block',
  'PRE': 'block',
  'SECTION': 'block',
  'SELECT': 'inline',
  'SPAN': 'inline',
  'TABLE': 'block',
  'TEXTAREA': 'inline',
};

function getDefaultDisplay(elem) {
  const { nodeName, ownerDocument } = elem;
  let display = defaultDisplayMap[nodeName];

  if (display) {
    return display;
  }

  const temp = ownerDocument.body.appendChild(ownerDocument.createElement(nodeName));
  ({ display } = temp.style);

  temp.parentNode.removeChild(temp);

  if (display === 'none') {
    display = 'block';
  }

  defaultDisplayMap[nodeName] = display;

  return display;
}

function toggleElement(element, makeVisible) {
  element.display = makeVisible ? getDefaultDisplay(element) : 'none';

  if (makeVisible) {
    element.classList.remove('js-hide');
  }
};

export const toggle = (element, showOrHide) => {
  if (element instanceof NodeList) {
    element.forEach(elem => {
      toggleElement(elem, showOrHide);
    });
  } else {
    toggleElement(element, showOrHide);
  }
};

export const show = (element) => {
  toggleElement(element, true);
};

export const hide = (element) => {
  toggleElement(element, false);
};
