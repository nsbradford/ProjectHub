/**
* LoginController
* @namespace projecthub.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication', 'ngDialog'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication, ngDialog) {
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
      Authentication.login(vm.email, vm.password).then(loginSuccessFn, loginErrorFn);
      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(response) {
        Authentication.setAuthenticatedAccount(response.data);
        $location.url('/discover');
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(response) {
        ngDialog.open({
          template: `
            <div class="text-center">
              The username/password combination you entered was invalid.
            </div>
          `,
          plain: true
        });
      }
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