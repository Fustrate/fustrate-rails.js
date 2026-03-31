import ajax from '../ajax';
import { getCurrentPageJSON, getJSON, getPaginatedJSON, patchJSON, postJSON } from '../json';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('getJSON', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds .json to relative paths and preserves query params', async () => {
    const response = { json: vi.fn().mockResolvedValue({ ok: true }) };
    const getSpy = vi.spyOn(ajax, 'get').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await getJSON<{ ok: boolean }>('/users?page=2');

    expect(getSpy).toHaveBeenCalledWith(`${origin}/users.json?page=2`, {
      headers: { 'content-type': 'application/json' },
    });
    expect(response.json).toHaveBeenCalledTimes(1);
    expect(data).toEqual({ ok: true });
  });

  it('adds format=json for root paths', async () => {
    const response = { json: vi.fn().mockResolvedValue({ ok: true }) };
    const getSpy = vi.spyOn(ajax, 'get').mockReturnValue(response as any);
    const origin = window.location.origin;

    await getJSON('/');

    expect(getSpy).toHaveBeenCalledWith(`${origin}/?format=json`, {
      headers: { 'content-type': 'application/json' },
    });
  });

  it('normalizes absolute URLs with trailing slashes', async () => {
    const response = { json: vi.fn().mockResolvedValue({ ok: true }) };
    const getSpy = vi.spyOn(ajax, 'get').mockReturnValue(response as any);

    await getJSON('https://example.com/api/users/?page=1');

    expect(getSpy).toHaveBeenCalledWith('https://example.com/api/users.json?page=1', {
      headers: { 'content-type': 'application/json' },
    });
  });
});

describe('patchJSON', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('patches JSON and returns parsed body', async () => {
    const payload = { id: 42 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const patchSpy = vi.spyOn(ajax, 'patch').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await patchJSON<typeof payload>('/users/42', { name: 'Steven' });

    expect(patchSpy).toHaveBeenCalledWith(`${origin}/users/42.json`, {
      json: { name: 'Steven' },
      headers: { 'content-type': 'application/json' },
    });
    expect(data).toEqual(payload);
  });
});

describe('postJSON', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('posts JSON payload and returns parsed body', async () => {
    const payload = { id: 99 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const postSpy = vi.spyOn(ajax, 'post').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await postJSON<typeof payload>('/users', { name: 'Taylor' });

    expect(postSpy).toHaveBeenCalledWith(`${origin}/users.json`, {
      json: { name: 'Taylor' },
      headers: { 'content-type': 'application/json' },
    });
    expect(data).toEqual(payload);
  });

  it('allows posting without data', async () => {
    const payload = { ok: true };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const postSpy = vi.spyOn(ajax, 'post').mockReturnValue(response as any);
    const origin = window.location.origin;

    await postJSON('/ping');

    expect(postSpy).toHaveBeenCalledWith(`${origin}/ping.json`, {
      json: undefined,
      headers: { 'content-type': 'application/json' },
    });
  });
});

describe('page helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getCurrentPageJSON requests the current location as JSON', async () => {
    const origin = window.location.origin;
    window.history.pushState({}, '', '/projects?tab=all');

    const response = { json: vi.fn().mockResolvedValue({ ok: true }) };
    const getSpy = vi.spyOn(ajax, 'get').mockReturnValue(response as any);

    await getCurrentPageJSON();

    expect(getSpy).toHaveBeenCalledWith(`${origin}/projects.json?tab=all`, {
      headers: { 'content-type': 'application/json' },
    });
  });

  it('getPaginatedJSON delegates to getJSON', async () => {
    const payload = { data: [{ id: 1 }], pagination: { page: 1 } };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const getSpy = vi.spyOn(ajax, 'get').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await getPaginatedJSON<{ id: number }>('/widgets');

    expect(getSpy).toHaveBeenCalledWith(`${origin}/widgets.json`, {
      headers: { 'content-type': 'application/json' },
    });
    expect(data).toEqual(payload);
  });
});
