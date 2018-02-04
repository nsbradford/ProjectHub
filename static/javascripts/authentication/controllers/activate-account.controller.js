/**
* ActivateAccountController
* @namespace projecthub.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.controllers')
    .controller('ActivateAccountController', ActivateAccountController);

  ActivateAccountController.$inject = ['$location', '$scope', '$routeParams', 'Authentication'];

  /**
  * @namespace ActivateAccountController
  */
  function ActivateAccountController($location, $scope, $routeParams, Authentication) {
    const vm = this;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.authentication.controllers.ActivateAccountController
    */
    function activate() {
      // todo logic for making sure the user logs in, for extra security
      if (Authentication.isAuthenticated()) {
        
      }

      var key = $routeParams.key;

      Authentication.activateAccount(key)
        .then(activateSuccessFn, activateErrorFn)

      function activateSuccessFn(data, status, headers, config) {
        Snackbar.show('Congrats! Your account was confirmed - you\'re ready to post!.');
      }

      function activateErrorFn(data, status, headers, config) {
        Snackbar.error('Something went wrong during account confirmation.');
      }

    }
  }
})();