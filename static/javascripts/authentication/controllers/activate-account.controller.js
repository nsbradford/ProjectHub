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
      // If the user is authenticated, they should not be here.
      var key = $routeParams.key.substr(1);
      Authentication.activateAccount(key);
      if (Authentication.isAuthenticated()) {
        // todo logic for making sure the user logs in, for extra security
      }
    }
  }
})();