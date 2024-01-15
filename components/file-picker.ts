import Listenable from '../listenable';

// Turn any element into a trigger for file selection.
export default class FilePicker extends Listenable {
  protected constructor(callback: (files: FileList) => void) {
    super();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    input.addEventListener('change', () => {
      callback(input.files);

      input.remove();
    });

    document.body.append(input);

    input.click();
  }

  public static open(callback: (files: FileList) => void): FilePicker {
    return new this(callback);
  }
}
