import { type Instance } from '@popperjs/core';
import type Listenable from '../listenable';

export default class Dropdown extends Listenable {
  private popper: Instance;

  public static initialize(): void;
  protected static open(event: UIEvent): false;
  protected static hide(): void;
}
