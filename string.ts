import './array-at-polyfill';

export function humanize(string?: string): string {
  if (typeof string !== 'string') {
    return '';
  }

  return string
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]} ${match[1]}`)
    .replace(/_/g, ' ')
    .toLowerCase();
}

export function isBlank(string: string | null | undefined): boolean {
  return string == null || (typeof string === 'string' && string.trim() === '');
}

export function isPresent(string?: string): boolean {
  return !isBlank(string);
}

export function parameterize(string?: string): string {
  if (typeof string !== 'string') {
    return '';
  }

  return string
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]}_${match[1]}`)
    .replace(/[^\w-]+/, '-') // Turn unwanted chars into the separator
    .replace(/^-|-$/, '') // Remove leading/trailing separator.
    .toLowerCase();
}

export function phoneFormat(input: string): string {
  if (/^1?\d{10}$/.test(input)) {
    return input.replace(/1?(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  if (/^\d{7}$/.test(input)) {
    return input.replace(/(\d{3})(\d{4})/, '$1-$2');
  }

  return input;
}

// This is far too simple for most cases, but it works for the few things we need
export function pluralize(string: string): string {
  return string.at(-1) === 'y'
    ? `${string.slice(0, -1)}ies`
    : `${string}s`;
}

export function presence(input: string | null | undefined): string | undefined {
  return isBlank(input) ? undefined : String(input);
}

export function underscore(string?: string): string {
  if (typeof string !== 'string') {
    return '';
  }

  return string
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]}_${match[1]}`)
    .replace('::', '/')
    .toLowerCase();
}
