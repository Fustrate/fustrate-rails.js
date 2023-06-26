import type Listenable from '../listenable';

export default class FilePicker extends Listenable {
  protected constructor(callback: (files: File[]) => void);

  public static open(callback: (files: File[]) => void): FilePicker;
}
