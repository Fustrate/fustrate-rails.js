import { hide, isVisible, show, toggle } from '../show-hide';

describe('isVisible', () => {
  it('detects invisible elements', () => {
    const div = document.createElement('div');

    expect(isVisible(div)).toBe(false);
  });

  it('detects visible elements', () => {
    const div = document.createElement('div');

    document.body.append(div);

    expect(isVisible(div)).toBe(true);
  });
});

describe('toggle', () => {
  it('toggles a NodeList of elements', () => {
    const root = document.createElement('div');
    root.append(document.createElement('span'), document.createElement('span'));

    const spans = root.querySelectorAll('span');

    toggle(spans, false);

    expect(spans[0].classList.contains('hidden!')).toBe(true);
    expect(spans[1].classList.contains('hidden!')).toBe(true);
  });

  it('toggles a single element', () => {
    const element = document.createElement('div');

    toggle(element, false);

    expect(element.classList.contains('hidden!')).toBe(true);

    toggle(element);

    expect(element.classList.contains('hidden!')).toBe(false);
  });
});

describe('show', () => {
  it('removes the hidden class', () => {
    const element = document.createElement('div');
    element.classList.add('hidden!');

    show(element);

    expect(Object.keys(element.classList).length).toEqual(0);
  });

  it('does not change an element that is not hidden', () => {
    const element = document.createElement('div');

    show(element);

    expect(Object.keys(element.classList).length).toEqual(0);
  });
});

describe('hide', () => {
  it('adds the hidden class', () => {
    const element = document.createElement('div');

    hide(element);

    expect(element.classList).toEqual({ 0: 'hidden!' });
  });
});
