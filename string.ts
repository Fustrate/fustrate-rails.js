import './array-at-polyfill';

export function humanize(input: string): string {
  return input
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]} ${match[1]}`)
    .replace(/_/g, ' ')
    .toLowerCase();
}

export function isBlank(input: string | null | undefined): boolean {
  return input == null || input.trim() === '';
}

export function isPresent(input: string | null | undefined): boolean {
  return !isBlank(input);
}

export function parameterize(input: string): string {
  return input
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]}_${match[1]}`)
    .replace(/[^\w-]+/, '-') // Turn unwanted chars into the separator
    .replace(/^-|-$/, '') // Remove leading/trailing separator.
    .toLowerCase();
}

export function phoneFormat(input: string): string {
  if (input == null) {
    return '';
  }

  if (/^1?\d{10}$/.test(input)) {
    return input.replace(/1?(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  if (/^\d{7}$/.test(input)) {
    return input.replace(/(\d{3})(\d{4})/, '$1-$2');
  }

  return input;
}

// This is far too simple for most cases, but it works for the few things we need
export function pluralize(input: string): string {
  return input.at(-1) === 'y' ? `${input.slice(0, -1)}ies` : `${input}s`;
}

export function presence(input: string | null | undefined): string | undefined {
  return isBlank(input) ? undefined : String(input);
}

export function underscore(input: string): string {
  return input
    .replace(/[a-z][A-Z]/g, (match) => `${match[0]}_${match[1]}`)
    .replace('::', '/')
    .toLowerCase();
}
