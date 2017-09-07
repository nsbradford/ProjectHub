/**
* Register controller
* @namespace projecthub.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication', 'Snackbar'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication, Snackbar) {
    var vm = this;
    vm.missing_email = false;
    // vm.missing_username = false;
    // vm.missing_password = false;
    vm.register = register;

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf projecthub.authentication.controllers.RegisterController
     */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
    * @name register
    * @desc Register a new user
    * @memberOf projecthub.authentication.controllers.RegisterController
    */
    function register() {
      vm.missing_email = !vm.email ? true : false;
      vm.missing_password = !vm.password ? true : false;
      vm.missing_username = !vm.username ? true : false;

      if (vm.email && vm.password && vm.username) {
        Authentication.register(vm.email, vm.password, vm.username);
      }
      else {
        Snackbar.error('Must complete required fields.');
      }
    }
  }
})();