import { stopEverything } from '../events';
import Listenable from '../listenable';

// Allow files to be dropped onto an element
export default class DropZone extends Listenable {
  constructor(target, callback) {
    super();

    target.addEventListener('dragover', stopEverything);
    target.addEventListener('dragenter', stopEverything);

    target.addEventListener('drop', (event) => {
      stopEverything(event);

      callback(Array.from(event.dataTransfer.files));
    });
  }

  static create(target, callback) {
    return new DropZone(target, callback);
  }
}
