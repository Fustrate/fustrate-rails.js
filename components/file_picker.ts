import Listenable from '../listenable';

// Turn any element into a trigger for file selection.
export default class FilePicker extends Listenable {
  protected constructor(callback: (files: File[]) => void) {
    super();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    input.addEventListener('change', () => {
      callback(Array.from(input.files));

      input.parentNode.removeChild(input);
    });

    document.body.appendChild(input);

    input.click();
  }

  public static open(callback: (files: File[]) => void): FilePicker {
    return new this(callback);
  }
}
