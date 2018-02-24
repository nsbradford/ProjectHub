/**
* Register controller
* @namespace projecthub.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication', 'Snackbar', 'ngDialog'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication, Snackbar, ngDialog) {
    const vm = this;
    vm.inputType = 'password';
    vm.missing_email = false;
    vm.missing_username = false;
    vm.missing_firstname = false;
    vm.missing_lastname = false;
    vm.missing_password = false;
    vm.missing_agreement = false;
    vm.register = register;
    vm.hideShowPassword = hideShowPassword;

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

    function wpiOnly() {
      ngDialog.open({ 
        template: ` 
          <div class="text-center">
            We're only accepting <b>wpi.edu</b> emails at this time.
            <br><br>
            If you have any questions, please reach out to 
            <a href='mailto:support@goprojecthub.com'>support</a>.
          </div>
        `, 
        plain: true,
        // className: 'ngdialog-theme-default' 
      });
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
      vm.missing_firstname = !vm.firstname ? true : false;
      vm.missing_lastname = !vm.lastname ? true : false;
      vm.missing_agreement = !vm.agreement ? true : false;

      if (vm.email && vm.password && vm.username && vm.firstname && vm.lastname && vm.agreement) {
        if (vm.email.endsWith('wpi.edu')){
          Authentication.register(vm.email, vm.password, vm.username, vm.firstname, vm.lastname);
        }
        else {
          wpiOnly();
        }
      }
      else {
        Snackbar.error('Must complete required fields.');
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