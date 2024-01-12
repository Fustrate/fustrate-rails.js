import { stopEverything } from '../events';
import Listenable from '../listenable';

// Allow files to be dropped onto an element
export default class DropZone extends Listenable {
  protected constructor(target: HTMLElement, callback: (files: File[]) => void) {
    super();

    target.addEventListener('dragover', stopEverything);
    target.addEventListener('dragenter', stopEverything);

    target.addEventListener('drop', (event) => {
      stopEverything(event);

      callback(Array.from(event.dataTransfer.files));
    });
  }

  public static create(target: HTMLElement, callback: (files: File[]) => void): DropZone {
    return new DropZone(target, callback);
  }
}
