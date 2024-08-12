import { csrfToken } from './ajax';

type FormRedirectMethod = 'post' | 'patch' | 'delete';
type FormRedirectData = Record<string, string>;

export function formRedirectTo(
  href: string,
  method: FormRedirectMethod,
  data: FormRedirectData,
): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = href;
  form.style.display = 'none';

  const csrfInput = document.createElement('input');

  csrfInput.type = 'hidden';
  csrfInput.name = 'authenticity_token';
  csrfInput.value = csrfToken() ?? '';

  form.append(csrfInput);

  if (method !== 'post') {
    const methodInput = document.createElement('input');

    methodInput.type = 'hidden';
    methodInput.name = '_method';
    methodInput.value = method;

    form.append(methodInput);
  }

  for (const [name, value] of Object.entries(data)) {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = name;
    input.value = value;

    form.append(input);
  }

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  form.append(submitButton);

  document.body.append(form);

  submitButton.click();
}

// Redirect by setting a new location, which performs a simple GET request
export function redirectTo(href: string | { path(): string }): void {
  window.setTimeout(() => {
    window.location.href = typeof href === 'string' ? href : href.path();
  }, 750);
}
