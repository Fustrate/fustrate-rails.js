import type Listenable from '../listenable';

export class Flash extends Listenable {
  protected constructor(message: string, options: { type: string, icon?: string });

  public static show(message: string, options: { type: string, icon?: string }): Flash;
}

export class InfoFlash extends Flash {
  protected constructor(message: string, options?: { icon?: string });

  public static show(message: string, options?: { icon?: string }): InfoFlash;
}

export class ErrorFlash extends Flash {
  protected constructor(message: string, options?: { icon?: string });

  public static show(message: string, options?: { icon?: string }): ErrorFlash;
}

export class SuccessFlash extends Flash {
  protected constructor(message: string, options?: { icon?: string });

  public static show(message: string, options?: { icon?: string }): SuccessFlash;
}
