/**
* MultiSelect
* @namespace multiselect
* @desc A multiselect form input that renders a div with all choices in it.
*/
(function () {
    'use strict';
    angular
        .module('projecthub.common')
        .component('multiselect', {
            bindings: {
                placeHolder: '=',
                onClear: '=',
                onChange: '=',
                options: '=',
                selected: '='
            },
            templateUrl: '/static/templates/common/components/multiselect.html'
        });
})();