import { HTMLEvent, delegate, stopEverything } from '../events';

export default class Tabs {
  protected tabs: HTMLUListElement;

  public constructor(tabs: HTMLUListElement) {
    this.tabs = tabs;

    delegate<HTMLEvent<HTMLAnchorElement>>(this.tabs, 'li > a', 'click', (event) => {
      stopEverything(event);

      this.activateTab(event.target, true);

      return false;
    });

    if (window.location.hash) {
      this.tabs.querySelector(`li > a[href='${window.location.hash}']`);

      const tab = this.tabs.querySelector<HTMLAnchorElement>(`li > a[href='${window.location.hash}']`);

      if (tab) {
        this.activateTab(tab, false);
      }
    } else {
      const tabWithActiveClass = this.tabs.querySelector<HTMLAnchorElement>('li > a.active');

      if (tabWithActiveClass) {
        this.activateTab(tabWithActiveClass, false);
      } else {
        // Open the first tab by default
        const firstTab = this.tabs.querySelector<HTMLAnchorElement>('li > a');

        if (firstTab) {
          this.activateTab(firstTab, false);
        }
      }
    }
  }

  protected activateTab(tab: HTMLAnchorElement, changeHash: boolean): void {
    const link = tab.closest('a');

    if (link == null) {
      return;
    }

    [...this.tabs.querySelectorAll('.active')].forEach((sibling) => {
      sibling.classList.remove('active');
    });

    link.classList.add('active');
    const hash = link.href.split('#')[1];

    if (changeHash) {
      window.location.hash = hash;
    }

    const tabContent = document.querySelector(`#${hash}`);

    if (tabContent?.parentElement == null) {
      return;
    }

    tabContent.classList.add('active');

    [...tabContent.parentElement.children].forEach((sibling) => {
      if (sibling !== tabContent) {
        sibling.classList.remove('active');
      }
    });
  }
}

export function initialize(): void {
  [...document.querySelectorAll<HTMLUListElement>('ul.tabs')].forEach((ul) => new Tabs(ul));
}
