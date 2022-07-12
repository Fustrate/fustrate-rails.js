import Listenable from '../src/listenable';

class Thing extends Listenable {}

describe('Listenable', () => {
  it('adds an event listener', () => {
    const thing = new Thing();
    let received = false;

    function callback(event) {
      expect(event.detail).toBe('world');

      received = true;
    }

    thing.addEventListener('hello', callback);

    const event = new CustomEvent('hello', { bubbles: true, cancelable: true, detail: 'world' });

    thing.dispatchEvent(event);

    expect(received).toBe(true);
  });

  it('removes an event listener', () => {
    const thing = new Thing();
    let received = false;

    const callback = () => {
      received = true;
    };

    thing.addEventListener('hello', callback);
    thing.removeEventListener('hello', callback);

    const event = new CustomEvent('hello', { bubbles: true, cancelable: true, detail: 'world' });

    thing.dispatchEvent(event);

    expect(received).toBe(false);
  });
});
