/**
 * AddProjectButtonController
 * @namespace projecthub.layout.controllers
 */
(function () {
    'use strict';

    angular
        .module('projecthub.layout.controllers')
        .controller('AddProjectButtonController', AddProjectButtonController);

    NavbarController.$inject = ['$scope', 'Authentication'];

    /**
     * @namespace NavbarController
     * @desc This Controller is responsible for blocking unauthenticated and non-confirmed users
     * from creating new projecs.
     */
    function AddProjectButtonController($scope, Authentication) {
        const vm = this;
        const account = Authentication.getAuthenticatedAccount();
        if (account) {
            Profile.get(account.username).then(profileSuccessFn, profileErrorFn);
        }

        /**
         * @name profileSuccessFn
         * @desc Callback that is run if the server responds without an error.
         *
         * @param {object} responseSuccess The response from the server
         */
        function profileSuccessFn(responseSuccess) {
            const profile = response.data;
            vm.isActivated = vm.profile.is_email_confirmed;
        }

        /**
         * @name profileErrorFn
         * @desc Callback that is run if the server responds with an error.
         *
         * @param {object} responseFailure The response from the server
         */
        function profileErrorFn(responseFailure) {
            Snackbar.error('Error loading profile, please refresh.');
        }

    }
})();