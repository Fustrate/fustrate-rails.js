export function accountingFormat(number: number, stripZeroCents?: boolean): string {
  const string = number < 0 ? `($${(number * -1).toFixed(2)})` : `$${number.toFixed(2)}`;

  return stripZeroCents ? string.replace(/\.00$/, '') : string;
}

export function truncate(number: number, digits: number): string {
  return number.toFixed(digits).replace(/\.?0+$/, '');
}

export function bytesToString(number: number): string {
  if (number < 1000) {
    return `${number} B`;
  }

  if (number < 1_000_000) {
    return `${truncate(number / 1000, 2)} kB`;
  }

  if (number < 1_000_000_000) {
    return `${truncate(number / 1_000_000, 2)} MB`;
  }

  return `${truncate(number / 1_000_000_000, 2)} GB`;
}

export function ordinalize(number: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = number % 100;

  return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || 'th');
}
