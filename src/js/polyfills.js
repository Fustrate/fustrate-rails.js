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
  Element.prototype.matches = Element.prototype.matchesSelector
    || Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}

// Supports: Internet Explorer (All)
if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(selector) {
    let element = this;

    while (element != null && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element;
      }

      element = element.parentElement || element.parentNode;
    }

    return null;
  };
}
