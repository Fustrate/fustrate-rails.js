export const accountingFormat = number =>
  number < 0 ? `($${(number * -1).toFixed(2)})` : `$${number.toFixed(2)}`;

export const truncate = (number, digits = 2) => number.toFixed(digits).replace(/\.?0+$/, '');

export const bytesToString = number => {
  if (number < 1000) {
    return `${number} B`;
  }

  if (number < 1000000) {
    return `${truncate(number / 1000)} kB`;
  }

  if (number < 1000000000) {
    return `${truncate(number / 1000000)} MB`;
  }

  return `${truncate(number / 1000000000)} GB`;
};

export const ordinalize = number => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = number % 100;

  return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || 'th');
};
