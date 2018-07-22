/**
* ActivateAccountController
* @namespace projecthub.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.controllers')
    .controller('ActivateAccountController', ActivateAccountController);

  ActivateAccountController.$inject = ['$location', '$scope', '$routeParams', 'Snackbar',
  'Authentication', 'ngDialog'];

  /**
  * @namespace ActivateAccountController
  */
  function ActivateAccountController($location, $scope, $routeParams, Snackbar, Authentication,
    ngDialog)
  {
    const vm = this;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.authentication.controllers.ActivateAccountController
    */
    function activate() {
      // TODO logic for making sure the user logs in when activating, for extra security

      var key = $routeParams.key;

      Authentication.activateAccount(key)
        .then(activateSuccessFn, activateErrorFn);

      function activateSuccessFn(response) {
        ngDialog.open({
          template: `
            <div class="text-center">
              Congrats! Your account was confirmed - you're ready to post!.
            </div>
          `,
          plain: true,
          preCloseCallback: function(){ window.location = '/login'; }
        });

      }

      function activateErrorFn(response) {
        Snackbar.error('Something went wrong during account confirmation.');
        $location.url('/');
      }

    }
  }
})();