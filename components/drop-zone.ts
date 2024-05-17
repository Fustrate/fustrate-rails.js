import { stopEverything } from '../events';

// Allow files to be dropped onto an element
export default function dropzone(target: HTMLElement, callback: (files: FileList) => void): void {
  target.addEventListener('dragover', stopEverything);
  target.addEventListener('dragenter', stopEverything);

  target.addEventListener('drop', (event) => {
    stopEverything(event);

    callback(event.dataTransfer?.files ?? new FileList());
  });
}
