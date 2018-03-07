/**
* LoginController
* @namespace projecthub.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication) {
    const vm = this;
    vm.inputType = 'password';
    vm.login = login;

    vm.clearEmail = clearEmail;
    vm.clearPassword = clearPassword;
    vm.hideShowPassword = hideShowPassword;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/discover');
      }
    }

    /**
     * @name clearEmail
     * @desc clear the current typed email.
     *
     * @param {event} event
     */
    function clearEmail(event) {
      event.preventDefault();
      vm.email = '';
    }
    /**
     * @name clearPassword
     * @desc clear the current typed password.
     *
     * @param {event} event
     */
    function clearPassword(event) {
      event.preventDefault();
      vm.password = '';
    }
    /**
    * @name login
    * @desc Log the user in
    * @memberOf projecthub.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.email, vm.password);
    }

    function hideShowPassword() {
      if (vm.inputType == 'password'){
        vm.inputType = 'text';
      }
      else {
        vm.inputType = 'password';
      }
    }
  }
})();