import { tag } from 'html';

export function open(callback: (files: FileList) => void): void {
  const input = tag.input({ attributes: { type: 'file' } });

  input.addEventListener('change', () => {
    callback(input.files ?? new FileList());

    input.remove();
  });

  document.body.append(input);

  input.click();
}
