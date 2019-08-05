// Supports: Edge (All), Internet Explorer (All)
require('core-js/features/array/flat');
require('core-js/features/array/flat-map');

// Supports: Internet Explorer (All)
require('custom-event-polyfill');
require('core-js/features/dom-collections/for-each');
require('core-js/features/array/from');

// Supports: Internet Explorer 11
require('core-js/features/promise');
require('core-js/features/symbol');

// Supports: Internet Explorer (All)
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

// Supports: Internet Explorer (All)
if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(selector) {
    let el = this;

    while (el !== null && el.nodeType === 1) {
      if (el.matches(selector)) {
        return el;
      }

      el = el.parentElement || el.parentNode;
    }

    return null;
  };
}
