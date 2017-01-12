"use strict";

function routes($stateProvider) {
    $stateProvider
        .state('routeEditor', {
            url: '/route-editor',
            template: require('./route-editor.html'),
            controller: 'MapEditorToolkit',
            controllerAs: 'editor'
        });
}

routes.$inject = ['$stateProvider'];

module.exports = routes;