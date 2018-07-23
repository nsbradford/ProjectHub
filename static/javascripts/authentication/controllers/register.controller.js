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
    vm.checkForApprovedDomainAndDisplayDialog = checkForApprovedDomainAndDisplayDialog;

    vm.clearEmail = clearEmail;
    vm.clearUsername = clearUsername;
    vm.clearFirstname = clearFirstname;
    vm.clearLastName = clearLastName;
    vm.clearPassword = clearPassword;

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
     * @name isApprovedDomain
     * @desc Return true if the email ends in one of the approved domains.
     * @param {string} email The email to check.
     * @memberOf projecthub.authentication.controllers.RegisterController
     */
    function isApprovedDomain(email) {
      const approvedDomains = ['wpi.edu'];
      let answer = false;
      for (let domain of approvedDomains) {
        if (email.endsWith(domain)) {
          answer = true;
        }
      }
      return answer;
    }

    /**
     * @name checkForApprovedDomainAndDisplayDialog
     * @desc Check if the email domain is approved.
     *    If so, display the dialog.
     *    Return true if approved.
     * @memberOf projecthub.authentication.controllers.RegisterController
     */
    function checkForApprovedDomainAndDisplayDialog() {
      const isApproved = vm.email ? isApprovedDomain(vm.email) : false;
      if (! isApproved) {
        displayUnapprovedDomainDialog();
      }
      return isApproved;
    }

    /**
     * @name displayUnapprovedDomainDialog
     * @desc Display a dialog explaining that the input email was unapproved.
     * @memberOf projecthub.authentication.controllers.RegisterController
     */
    function displayUnapprovedDomainDialog() {
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
      });
    }

    /**
    * @name register
    * @desc Register a new user
    * @memberOf projecthub.authentication.controllers.RegisterController
    */
    function register() {
      vm.missing_email = !vm.email ? 'required' : '';
      vm.missing_username = !vm.username ? 'required' : '';
      vm.missing_password = !vm.password ? 'required' : '';
      vm.missing_firstname = !vm.firstname ? 'required' : '';
      vm.missing_lastname = !vm.lastname ? 'required' : '';
      vm.missing_agreement = !vm.agreement ? 'You must agree to the terms to continue' : '';

      if (vm.email && vm.password && vm.username && vm.firstname && vm.lastname && vm.agreement) {
        const isApproved = checkForApprovedDomainAndDisplayDialog();
        if (isApproved) {
          Authentication.register(vm.email, vm.password, vm.username, vm.firstname, vm.lastname);
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

    /**
     * @name clearEmail
     * @desc clears the email control.
     *
     * @param {event} event the click we are going to prevent submitting anything
     */
    function clearEmail(event) {
      event.preventDefault();
      vm.email = '';
    }

    /**
     * @name clearUsername
     * @desc clears the username control.
     *
     * @param {event} event the click we are going to prevent submitting anything
     */
    function clearUsername(event) {
      event.preventDefault();
      vm.username = '';
    }

    /**
     * @name clearFirstname
     * @desc clears the firstname control.
     *
     * @param {event} event the click we are going to prevent submitting anything
     */
    function clearFirstname(event) {
      event.preventDefault();
      vm.firstname = '';
    }

    /**
     * @name clearLastName
     * @desc clears the lastname control.
     *
     * @param {event} event the click we are going to prevent submitting anything
     */
    function clearLastName(event) {
      event.preventDefault();
      vm.lastname = '';
    }

    /**
     * @name clearPassword
     * @desc clears the password control.
     *
     * @param {event} event the click we are going to prevent submitting anything
     */
    function clearPassword(event) {
      event.preventDefault();
      vm.password = '';
    }
  }
})();