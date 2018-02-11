/**
* TextInput
* @namespace textinput
* @desc A clearable text box that can have a placeholder and updates a model.
*/
(function () {
    'use strict';
    angular
        .module('projecthub.common')
        .component('textInput', {
            bindings: {
                placeHolder: '=',
                onClear: '=',
                onChange: '=',
                model: '=',
                type: "="
            },
            templateUrl: '/static/templates/common/components/textinput.html'
        });
})();