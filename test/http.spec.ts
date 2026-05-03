import { formRedirectTo, redirectTo } from '../http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('redirectTo', () => {
  vi.useFakeTimers();

  Object.defineProperty(window, 'location', {
    value: { href: 'https://github.com' },
    writable: true,
  });

  it('redirects after 750ms', () => {
    redirectTo('https://google.com');
    expect(window.location.href).toBe('https://github.com');

    // Wait for 749ms
    vi.advanceTimersByTime(749);
    expect(window.location.href).toBe('https://github.com');

    // 1 more ms and it should run
    vi.advanceTimersByTime(1);
    expect(window.location.href).toBe('https://google.com');
  });

  it('redirects to an object with a #path method', () => {
    redirectTo({ path: () => 'https://example.com/users' });

    vi.advanceTimersByTime(750);

    expect(window.location.href).toBe('https://example.com/users');
  });
});

describe('formRedirectTo', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('creates a hidden form and appends it to the body', () => {
    formRedirectTo('/users', 'post', {});

    const form = document.body.querySelector<HTMLFormElement>('form');

    expect(form).not.toBeNull();
    expect(form!.getAttribute('action')).toBe('/users');
    expect(form!.method.toLowerCase()).toBe('post');
    expect(form!.style.display).toBe('none');
  });

  it('includes the CSRF token as a hidden input', () => {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = 'secret-token';
    document.head.appendChild(meta);

    formRedirectTo('/users', 'post', {});

    const form = document.body.querySelector<HTMLFormElement>('form');
    const tokenInput = form!.querySelector<HTMLInputElement>('input[name="authenticity_token"]');

    expect(tokenInput).not.toBeNull();
    expect(tokenInput!.value).toBe('secret-token');
  });

  it('uses an empty string for the CSRF token when no meta tag is present', () => {
    formRedirectTo('/users', 'post', {});

    const form = document.body.querySelector<HTMLFormElement>('form');
    const tokenInput = form!.querySelector<HTMLInputElement>('input[name="authenticity_token"]');

    expect(tokenInput!.value).toBe('');
  });

  it('adds a _method input for patch requests', () => {
    formRedirectTo('/users/1', 'patch', {});

    const form = document.body.querySelector<HTMLFormElement>('form');
    const methodInput = form!.querySelector<HTMLInputElement>('input[name="_method"]');

    expect(methodInput).not.toBeNull();
    expect(methodInput!.value).toBe('patch');
  });

  it('adds a _method input for delete requests', () => {
    formRedirectTo('/users/1', 'delete', {});

    const form = document.body.querySelector<HTMLFormElement>('form');
    const methodInput = form!.querySelector<HTMLInputElement>('input[name="_method"]');

    expect(methodInput).not.toBeNull();
    expect(methodInput!.value).toBe('delete');
  });

  it('does not add a _method input for post requests', () => {
    formRedirectTo('/users', 'post', {});

    const form = document.body.querySelector<HTMLFormElement>('form');
    const methodInput = form!.querySelector<HTMLInputElement>('input[name="_method"]');

    expect(methodInput).toBeNull();
  });

  it('adds data entries as hidden inputs', () => {
    formRedirectTo('/users/1', 'patch', { name: 'Alice', age: 30 });

    const form = document.body.querySelector<HTMLFormElement>('form');
    const nameInput = form!.querySelector<HTMLInputElement>('input[name="name"]');
    const ageInput = form!.querySelector<HTMLInputElement>('input[name="age"]');

    expect(nameInput!.value).toBe('Alice');
    expect(ageInput!.value).toBe('30');
  });

  it('converts null and undefined data values to empty strings', () => {
    formRedirectTo('/users/1', 'delete', { reason: null, note: undefined });

    const form = document.body.querySelector<HTMLFormElement>('form');
    const reasonInput = form!.querySelector<HTMLInputElement>('input[name="reason"]');
    const noteInput = form!.querySelector<HTMLInputElement>('input[name="note"]');

    expect(reasonInput!.value).toBe('');
    expect(noteInput!.value).toBe('');
  });
});
