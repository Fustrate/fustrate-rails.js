import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

vi.mock('../debug', () => ({
  addDebugData: vi.fn(),
}));

import ajax, { csrfToken, setResponseErrorHandler } from '../ajax';

// const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const makeRequest = async (status: number, body = '{}') => {
  vi.spyOn(window, 'fetch').mockResolvedValue(
    new Response(body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  try {
    await ajax.get('https://example.com/test', { retry: 0, timeout: false });
  } catch {
    // errors are expected
  }

  // await flushPromises();
};

describe('ajax', () => {
  let alertSpy: MockInstance;
  let consoleSpy: MockInstance;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    Object.defineProperty(window.location, 'origin', {
      value: 'https://example.com',
      configurable: true,
    });
  });

  afterEach(() => {
    alertSpy.mockRestore();
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
    document.head.innerHTML = '';
  });

  describe('csrfToken', () => {
    it('returns undefined when no csrf-token meta tag is present', () => {
      expect(csrfToken()).toBeUndefined();
    });

    it('returns the content of the csrf-token meta tag', () => {
      const meta = document.createElement('meta');
      meta.name = 'csrf-token';
      meta.content = 'abc123';
      document.head.appendChild(meta);

      expect(csrfToken()).toBe('abc123');
    });
  });

  describe('default response error handler', () => {
    it('alerts with a server-not-responding message for a 404', async () => {
      await makeRequest(404);

      expect(alertSpy).toHaveBeenCalledWith('The server is not responding - please wait a while before trying again.');
    });

    it('alerts with a login message for a 401', async () => {
      await makeRequest(401);

      expect(alertSpy).toHaveBeenCalledWith(
        'You are not currently logged in. Please refresh the page and try performing this action again. To prevent this in the future, check the "Remember Me" box when logging in.',
      );
    });

    it('logs errors when the response body contains errors', async () => {
      await makeRequest(422, JSON.stringify({ errors: ['Something went wrong', 'Another error'] }));

      expect(consoleSpy).toHaveBeenCalledWith('Errors encountered:', ['Something went wrong', 'Another error']);
    });

    it('logs an unhandled interception message when there are no errors', async () => {
      await makeRequest(500, '{}');

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled interception (500)', expect.anything());
    });
  });

  describe('setResponseErrorHandler', () => {
    it('replaces the error handler', async () => {
      const mockHandler = vi.fn();
      setResponseErrorHandler(mockHandler);

      await makeRequest(422);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('calls the custom handler with the response object', async () => {
      const mockHandler = vi.fn();
      setResponseErrorHandler(mockHandler);

      await makeRequest(403);

      expect(mockHandler).toHaveBeenCalledOnce();
      expect((mockHandler.mock.calls[0][0] as Response).status).toBe(403);
    });
  });
});
