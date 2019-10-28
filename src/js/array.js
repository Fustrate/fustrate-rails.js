// TODO: Remove these and use lodash directly in projects
export {
  compact,
  head as first,
  last,
  uniq as unique,
  pull as remove,
} from 'lodash';

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
