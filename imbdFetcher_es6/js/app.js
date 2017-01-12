(function () {
    "use strict";

    class App {
        constructor(options) {
            if (options) {
                this.serverUrl = options.serverUrl;
                this.apiKey = options.apiKey;
                this.movies = [];
                this.init();
            } else {
                this.initError('App init error! No init options.');
            }
        }

        init() {
            this.setDOM();
            this.setUtils();
            this.getDataFromServer(this.utils.createRequestURL());
            this.bindEvents();
        }

        setDOM() {
            this.DOM = this.selectDOMElements();
        }

        setUtils() {
            this.utils = this.createUtils();
        }

        bindEvents() {
            const sort = this.sortHandler.bind(this);
            const search = this.searchHandler.bind(this);

            this.DOM.sortHeader.addEventListener('click', sort);
            this.DOM.searchForm.addEventListener('submit', search);
        }

        unbindEvents() {
            const sort = this.sortHandler.bind(this);
            const search = this.searchHandler.bind(this);

            this.DOM.sortHeader.removeEventListener('click', sort);
            this.DOM.searchForm.removeEventListener('submit', search);
        }

        getDataFromServer(url) {
            if (url) {
                fetch(url).then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw new Error('Network response was failed.');
                    }
                }).then(json => {
                    this.movies = json.results;
                    this.render();
                }).catch((error) => {
                    this.renderError(error);
                });
            } else {
                this.renderError('No results... Change query and try again.');
            }

        }

        render() {
            this.renderResultsCount(this.movies.length);

            const compileTemplate = this.utils.templateIt.bind(this);
            const template = this.DOM.dataTemplate;
            let html = '';

            if (this.movies.length) {
                this.movies.forEach(item => {
                    html = html.concat(compileTemplate(template, item));
                });
                this.DOM.tableBody.innerHTML = html;
            } else {
                this.renderError('No results... Change query and try again.');
            }
        }

        renderError(message) {
            this.DOM.tableBody.innerHTML = this.utils.templateIt(this.DOM.errorTemplate, { message });
        }

        initError(message) {
            const container = document.createElement('p');

            container.appendChild(document.createTextNode(message));
            this.DOM.body.innerHTML = container.innerHTML;
        }

        renderResultsCount(count) {
            this.DOM.resultsCounter.innerHTML = count;
        }

        sortHandler(event) {
            const target = event.target,
                key = target.dataset.key;

            if (target.tagName != 'TH') return;

            event.stopPropagation();

            if (target.dataset.sortDirection === '+') {
                this.movies.sort(this.utils.sortByKey(key));
                target.dataset.sortDirection = '-';
                this.utils.clearSortIcons();
                target.querySelector('span').innerHTML = '&darr;';
            } else {
                this.movies.sort(this.utils.sortByKey(key, true));
                target.dataset.sortDirection = '+';
                this.utils.clearSortIcons();
                target.querySelector('span').innerHTML = '&uarr;';
            }

            this.render();
        }

        searchHandler(event) {
            event.preventDefault();
            this.getDataFromServer(this.utils.createRequestURL(event.target.querySelector('input').value));
        }

        selectDOMElements() {
            return Object.create({
                body: document.querySelector('body'),
                dataTemplate: document.querySelector('#data-row-tpl').innerHTML,
                errorTemplate: document.querySelector('#error-row-tpl').innerHTML,
                tableBody: document.querySelector('.js-table-content'),
                sortHeader: document.querySelector('.js-sort-header'),
                searchForm: document.querySelector('#search-form'),
                resultsCounter: document.querySelector('.results-counter')
            });
        }

        createUtils() {
            const { serverUrl, apiKey } = this;

            return Object.create({
                createRequestURL(query) {
                    const validQueryLength = 3;

                    return (query && query.length >= validQueryLength)
                        ? `https://${serverUrl}/3/search/movie?api_key=${apiKey}&language=en-US&page=1&en-US&query=${query}`
                        : (query && query.length < validQueryLength) ? false
                        : `https://${serverUrl}/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
                },
                sortByKey(key, reverse) {
                    if (reverse) {
                        return (a, b) => (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
                    } else {
                        return (a, b) => (a[key] < b[key]) ? 1 : (a[key] > b[key]) ? -1 : 0;
                    }
                },
                clearSortIcons() {
                    const icons = Array.prototype.slice.call(document.querySelectorAll('.js-sort-header > th > span'));

                    icons.forEach(item => item.innerHTML = '');
                },
                templateIt(template, data) {
                    return Object.keys(data).reduce((string, key) => string.replace(new RegExp('{{' + key + '}}', 'g'), data[key]), template);
                }
            });
        }

        destroy() {
            this.unbindEvents();
        }
    }

    new App({
        serverUrl: 'api.themoviedb.org',
        apiKey: '2d5baee3bdc854638c94f95989566db2'
    });
})();
