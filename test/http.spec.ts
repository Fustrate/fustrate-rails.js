import {
  redirectTo,
} from '../http';

describe('redirectTo', () => {
  jest.useFakeTimers();

  Object.defineProperty(window, 'location', {
    value: { href: 'https://github.com' },
    writable: true,
  });

  it('redirects after 750ms', () => {
    redirectTo('https://google.com');

    expect(window.location.href).toBe('https://github.com');

    // Wait for 749ms
    jest.advanceTimersByTime(749);
    expect(window.location.href).toBe('https://github.com');

    // 1 more ms and it should run
    jest.advanceTimersByTime(1);
    expect(window.location.href).toBe('https://google.com');
  });
});
