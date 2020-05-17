/* eslint-disable max-classes-per-file */

import Awesomplete from 'awesomplete';
import { fire } from '@rails/ujs';
import { debounce } from 'lodash/function';

import Component from '../component';
import ajax from '../ajax';

export class AutocompleteSuggestion extends String {
  constructor(datum, displayValue) {
    super(displayValue);

    this.datum = datum;
  }

  highlight(input, text) {
    if (input.trim() === '') {
      return text;
    }

    return text.replace(RegExp(Awesomplete.$.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>');
  }

  item(text) {
    return Awesomplete.$.create('li', {
      innerHTML: this.highlightedHTML(text),
      role: 'option',
      'aria-selected': 'false',
    });
  }

  highlightedHTML(value) {
    return this.highlight(value, this.toString());
  }
}

export class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
  constructor(datum) {
    super(datum, datum);
  }
}

export class AutocompleteSource {
  matches() {
    return true;
  }

  filter() {
    return true;
  }

  suggestion(datum) {
    return new AutocompleteSuggestion(datum);
  }
}

export class PlainAutocompleteSource extends AutocompleteSource {
  constructor(list) {
    super();

    this.list = list;
  }

  filter(suggestion, userInput) {
    return suggestion.toLowerCase().indexOf(userInput) >= 0;
  }

  suggestion(datum) {
    return new PlainAutocompleteSuggestion(datum);
  }

  matchingData(searchTerm) {
    return this.list.filter((datum) => this.filter(datum, searchTerm), this);
  }
}

export class Autocomplete extends Component {
  constructor(input, options) {
    super();

    this.input = input;
    this.extractOptions(options);

    this.awesomplete = new Awesomplete(this.input, {
      minChars: 0,
      maxItems: 25,
      filter: () => true,
      item: (suggestion, value, index) => suggestion.item(value, index),
      sort: false, // Items are fed in the intended order
      replace: (suggestion) => suggestion.label,
      suggestion: (datum) => this.suggestionForDatum(datum),
    });

    // Fix for Chrome ignoring autocomplete="off", but does it break Firefox?
    this.input.setAttribute('autocomplete', 'awesomplete');

    this.input.addEventListener('awesomplete-selectcomplete', this.onSelect.bind(this));
    this.input.addEventListener('keyup', debounce(this.onKeyup.bind(this)));
    this.input.addEventListener('focus', this.onFocus.bind(this));
  }

  extractOptions(options) {
    if (options.source) {
      this.sources = [options.source];
    } else if (options.sources) {
      this.sources = options.sources;
    } else if (options.list) {
      this.sources = [new PlainAutocompleteSource(options.list)];
    }
  }

  sourceForDatum(datum) {
    if (this.sources.length === 1) {
      return this.sources[0];
    }

    return this.sources.find((source) => source.matches(datum));
  }

  suggestionForDatum(datum) {
    return this.sourceForDatum(datum).suggestion(datum);
  }

  blanked() {
    if (this.input.value && this.input.value.trim() !== '') {
      return;
    }

    this.awesomplete.close();

    fire(this.input, 'blanked.autocomplete');
  }

  onSelect(event) {
    fire(this.input, 'selected.autocomplete', { suggestion: event.text });

    // It's obviously not still an error if we just selected a value from the dropdown.
    this.input.classList.remove('error');
  }

  onFocus() {
    this.value = this.input.value ? this.input.value.trim() : '';

    let list = [];
    const searchTerm = this.value.toLowerCase();

    // If we have plain text sources, show them immediately
    this.sources
      .filter((source) => source.list)
      .forEach((source) => {
        list = list.concat(source.matchingData(searchTerm));
      }, this);

    this.awesomplete.list = list;
  }

  onKeyup(e) {
    const keyCode = e.which || e.keyCode;
    const value = this.input.value ? this.input.value.trim() : '';

    if (value === '' && this.value !== '') {
      this.blanked();

      return;
    }

    // Don't perform the same search twice in a row, and ignore:
    //   Tab, Enter, Esc, Left, Up, Right, Down
    if (value === this.value || value.length < 3 || [9, 13, 27, 37, 38, 39, 40].includes(keyCode)) {
      return;
    }

    this.value = value;
    let list = [];

    this.sources.forEach((source) => {
      if (source.url) {
        ajax.get(source.url({ search: value, commit: 1, format: 'json' })).then((response) => {
          if (Array.isArray(response.data)) {
            list = list.concat(response.data);
          } else {
            list = list.concat(response.data.data);
          }

          this.awesomplete.list = list;
        }, () => { });
      } else if (source.list) {
        const searchTerm = value.toLowerCase();

        list = list.concat(source.matchingData(searchTerm));
      }
    }, this);

    this.awesomplete.list = list;
  }

  highlight(text) {
    if (!text) {
      return '';
    }

    return text.replace(RegExp(`(${this.value.split(/\s+/).join('|')})`, 'gi'), '<mark>$&</mark>');
  }

  replace(suggestion) {
    this.awesomplete.replace(suggestion);
  }

  static create(input, options) {
    return new this(input, options);
  }
}

export class PlainAutocomplete extends Autocomplete {
  onSelect(event) {
    super.onSelect(event);

    this.input.value = event.text.toString();
  }
}
