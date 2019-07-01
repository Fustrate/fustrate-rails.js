import Listenable from '../src/js/listenable';

class Thing extends Listenable {}

describe('Listenable', () => {
  it('adds an event listener', () => {
    const thing = new Thing();
    let received = false;

    function callback(event) {
      expect(event.detail).toEqual('world');

      received = true;
    }

    thing.addEventListener('hello', callback);

    const event = new CustomEvent('hello', { bubbles: true, cancelable: true, detail: 'world' });

    thing.dispatchEvent(event);

    expect(received).toBeTruthy();
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

    expect(received).toBeFalsy();
  });
});
