/**
* ProfileSettingsController
* @namespace projecthub.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.profiles.controllers')
    .controller('ProfileSettingsController', ProfileSettingsController);

  ProfileSettingsController.$inject = [
    '$location', '$routeParams', 'Authentication', 'Profile', 'Snackbar'
  ];

  /**
  * @namespace ProfileSettingsController
  */
  function ProfileSettingsController($location, $routeParams, Authentication, Profile, Snackbar) {
    const vm = this;
    vm.destroy = destroy;
    vm.update = update;

    vm.missing_email = false;
    vm.missing_firstname = false;
    vm.missing_lastname = false;

    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf projecthub.profiles.controllers.ProfileSettingsController
    */
    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      var username = $routeParams.username.substr(1);

      // Redirect if not logged in
      if (!authenticatedAccount) {
        $location.url('/');
        Snackbar.error('You are not authorized to view this page.');
      } else {
        // Redirect if logged in, but not the owner of this profile.
        if (authenticatedAccount.username !== username) {
          $location.url('/');
          Snackbar.error('You are not authorized to view this page.');
        }
      }

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Update `profile` for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }
    }


    /**
    * @name destroy
    * @desc Destroy this user's profile
    * @memberOf projecthub.profiles.controllers.ProfileSettingsController
    */
    function destroy() {
      var confirmed = confirm('Are you sure you want to delete your account? This action can\'t be undone.');
      if (confirmed) {
        Profile.destroy(vm.profile).then(profileSuccessFn, profileErrorFn);
      }

      /**
      * @name profileSuccessFn
      * @desc Redirect to index and display success snackbar.
      *   Unauthenticate and return to index page.
      */
      function profileSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        window.location = '/';
        Snackbar.show('Your account has been deleted.');
      }


      /**
      * @name profileErrorFn
      * @desc Display error snackbar
      *   Simply display snackbar error; there's no reason it should fail.
      */
      function profileErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }


    /**
    * @name update
    * @desc Update this user's profile
    * @memberOf projecthub.profiles.controllers.ProfileSettingsController
    */
    function update() {
      vm.missing_email = !vm.profile.email ? true : false;
      vm.missing_firstname = !vm.profile.first_name ? true : false;
      vm.missing_lastname = !vm.profile.last_name ? true : false;

      if (vm.profile.email && vm.profile.first_name && vm.profile.last_name) {
        Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);
      }
      else {
        Snackbar.error('Must complete required fields.');
      }

      /**
      * @name profileSuccessFn
      * @desc Show success snackbar
      */
      function profileSuccessFn(data, status, headers, config) {
        Snackbar.show('Your profile has been updated.');
      }


      /**
      * @name profileErrorFn
      * @desc Show error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();