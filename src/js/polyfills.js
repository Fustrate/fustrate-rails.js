// Supports: Edge (All), Internet Explorer (All)
require('array-flat-polyfill');

// Supports: Internet Explorer (All)
require('custom-event-polyfill');
require('nodelist-foreach-polyfill');

// Supports: Internet Explorer 11
require('es6-promise').polyfill();

// Supports: Internet Explorer (All)
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector
    || Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}
