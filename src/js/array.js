export const compact = (arr, strings = true) => arr
  .filter(element => !(element === undefined || element === null || (strings && element === '')))

export const first = arr => arr[0];

export const last = arr => arr[arr.length - 1];

export const remove = (arr, object) => {
  const index = arr.indexOf(object);

  if (index !== -1) {
    arr.splice(index, 1);
  }
};

export const toSentence = (arr) => {
  switch (arr.length) {
    case 0:
      return '';
    case 1:
      return String(arr[0]);
    case 2:
      return `${arr[0]} and ${arr[1]}`;
    default:
      return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
  }
};
