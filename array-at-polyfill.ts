// Supports: Safari < 15.4 (2022-03-15)
// https://caniuse.com/mdn-javascript_builtins_array_at
if (typeof Array.prototype.at !== 'function') {
  // eslint-disable-next-line no-extend-native
  Array.prototype.at = function at(index: number) {
    const { length } = this;

    const k = index >= 0 ? index : length + index;

    return k < 0 || k >= length ? undefined : this[k];
  };
}
