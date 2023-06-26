export default class FormDataBuilder {
  public static appendObject(data: FormData, key: string, value: any): void;
  public static build(obj: { [s: string]: any }, namespace?: string): FormData;
  public static toFormData(data: FormData, obj: { [s: string]: any }, namespace?: string): FormData;
}

