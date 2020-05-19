import TooltipJS from 'tooltip.js';
import Component from '../component';

export default class Tooltip extends Component {
  static create(node, title, { placement, container } = {}) {
    return new TooltipJS(node, {
      placement: placement || 'bottom',
      title,
      container: container == null ? document.body : container,
    });
  }
}
