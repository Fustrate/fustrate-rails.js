import type Listenable from '../listenable';

export default class DropZone extends Listenable {
  protected constructor(target: HTMLElement, callback: (files: File[]) => void);

  public static create(target: HTMLElement, callback: (files: File[]) => void): void;
}
