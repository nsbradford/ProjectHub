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
                label: '=',
                onChange: '=',
                onClick: '=',
                onClear: '=',
                onActivate: '=',
                options: '=',
                selected: '=',
            },
            bindToController: {
                isActive: '='
            },

            templateUrl: '/static/templates/common/components/multiselect.html',
            controller: function ($document, $scope, $element, $attrs) {
                const $ctrl = this;

                $ctrl.isActive = false;

                $document.bind('click', function (event) {
                    /**
                     * If a click is fired,
                     *  lets check to see that something under THIS multiselect was clicked, and that we are open
                     */
                    if ($ctrl.isActive == true) {
                        if ($($element).has(event.target).length == 0) {
                            $ctrl.isActive = false;
                            $scope.$apply();
                        }
                    }
                    else {
                        if ($($element).has(event.target).length > 0) {
                            $ctrl.isActive = true;
                            $scope.$apply();
                        }
                    }
                });
            }
        });
})();