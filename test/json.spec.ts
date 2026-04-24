/// <reference lib="dom" />

import ajax from '../ajax';
import { getCurrentPageJSON, getJSON, getPaginatedJSON, patchJSON, postJSON } from '../json';
import { afterEach, beforeEach, describe, expect, it, vi, mock, spyOn } from 'bun:test';

describe('getJSON', () => {
  beforeEach(() => {
    Object.defineProperty(window.location, 'origin', {
      value: 'https://example.com',
      configurable: true,
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('adds .json to relative paths and preserves query params', async () => {
    const asyncMock = mock();

    const response = { json: asyncMock.mockResolvedValue({ ok: true }) };
    const getSpy = spyOn(ajax, 'get').mockReturnValue(response as any);
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
    const getSpy = spyOn(ajax, 'get').mockReturnValue(response as any);
    const origin = window.location.origin;

    await getJSON('/');

    expect(getSpy).toHaveBeenCalledWith(`${origin}/?format=json`, {
      headers: { 'content-type': 'application/json' },
    });
  });

  it('normalizes absolute URLs with trailing slashes', async () => {
    const response = { json: vi.fn().mockResolvedValue({ ok: true }) };
    const getSpy = spyOn(ajax, 'get').mockReturnValue(response as any);

    await getJSON('https://example.com/api/users/?page=1');

    expect(getSpy).toHaveBeenCalledWith('https://example.com/api/users.json?page=1', {
      headers: { 'content-type': 'application/json' },
    });
  });
});

describe('patchJSON', () => {
  afterEach(() => {
    mock.restore();
  });

  it('patches JSON and returns parsed body', async () => {
    const payload = { id: 42 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const patchSpy = spyOn(ajax, 'patch').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await patchJSON<typeof payload>('/users/42', { name: 'Steven' });

    expect(patchSpy).toHaveBeenCalledWith(`${origin}/users/42.json`, {
      json: { name: 'Steven' },
      headers: { 'content-type': 'application/json' },
    });
    expect(data).toEqual(payload);
  });

  it('sends FormData as body without content-type header', async () => {
    const payload = { id: 42 };
    const response = { json: mock().mockResolvedValue(payload) };
    const patchSpy = spyOn(ajax, 'patch').mockReturnValue(response as any);
    const origin = window.location.origin;
    const formData = new FormData();
    formData.append('name', 'Steven');

    const data = await patchJSON<typeof payload>('/users/42', formData);

    expect(patchSpy).toHaveBeenCalledWith(`${origin}/users/42.json`, {
      body: formData,
    });
    expect(data).toEqual(payload);
  });

  it('sends a plain object as JSON with content-type header', async () => {
    const payload = { id: 42 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const patchSpy = spyOn(ajax, 'patch').mockReturnValue(response as any);
    const origin = window.location.origin;

    await patchJSON('/users/42', { active: false });

    expect(patchSpy).toHaveBeenCalledWith(`${origin}/users/42.json`, {
      json: { active: false },
      headers: { 'content-type': 'application/json' },
    });
  });
});

describe('postJSON', () => {
  afterEach(() => {
    mock.restore();
  });

  it('posts JSON payload and returns parsed body', async () => {
    const payload = { id: 99 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const postSpy = spyOn(ajax, 'post').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await postJSON<typeof payload>('/users', { name: 'Taylor' });

    expect(postSpy).toHaveBeenCalledWith(`${origin}/users.json`, {
      json: { name: 'Taylor' },
      headers: { 'content-type': 'application/json' },
    });
    expect(data).toEqual(payload);
  });

  it('sends FormData as body without content-type header', async () => {
    const payload = { id: 99 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const postSpy = spyOn(ajax, 'post').mockReturnValue(response as any);
    const origin = window.location.origin;
    const formData = new FormData();
    formData.append('name', 'Taylor');

    const data = await postJSON<typeof payload>('/users', formData);

    expect(postSpy).toHaveBeenCalledWith(`${origin}/users.json`, {
      body: formData,
    });
    expect(data).toEqual(payload);
  });

  it('sends a plain object as JSON with content-type header', async () => {
    const payload = { id: 99 };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const postSpy = spyOn(ajax, 'post').mockReturnValue(response as any);
    const origin = window.location.origin;

    await postJSON('/users', { role: 'admin' });

    expect(postSpy).toHaveBeenCalledWith(`${origin}/users.json`, {
      json: { role: 'admin' },
      headers: { 'content-type': 'application/json' },
    });
  });

  it('allows posting without data', async () => {
    const payload = { ok: true };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const postSpy = spyOn(ajax, 'post').mockReturnValue(response as any);
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
    mock.restore();
  });

  beforeEach(() => {
    spyOn(window.location, 'origin').mockReturnValue('https://example.com');
    spyOn(window.location, 'toString').mockReturnValue(`${window.location.origin}/projects?tab=all`);
  });

  it('getCurrentPageJSON requests the current location as JSON', async () => {
    const origin = window.location.origin;

    const response = { json: mock().mockResolvedValue({ ok: true }) };
    const getSpy = spyOn(ajax, 'get').mockReturnValue(response as any);

    await getCurrentPageJSON();

    expect(getSpy).toHaveBeenCalledWith(`${origin}/projects.json?tab=all`, {
      headers: { 'content-type': 'application/json' },
    });
  });

  it('getPaginatedJSON delegates to getJSON', async () => {
    const payload = { data: [{ id: 1 }], pagination: { page: 1 } };
    const response = { json: vi.fn().mockResolvedValue(payload) };
    const getSpy = spyOn(ajax, 'get').mockReturnValue(response as any);
    const origin = window.location.origin;

    const data = await getPaginatedJSON<{ id: number }>('/widgets');

    expect(getSpy).toHaveBeenCalledWith(`${origin}/widgets.json`, {
      headers: { 'content-type': 'application/json' },
    });
    expect(data).toEqual(payload);
  });
});
