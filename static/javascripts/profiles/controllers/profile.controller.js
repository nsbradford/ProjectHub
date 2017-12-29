/**
* ProfileController
* @namespace projecthub.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$location', '$routeParams', 'Projects', 'Profile', 'Snackbar', 'Authentication', '$sanitize'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($location, $routeParams, Projects, Profile, Snackbar, Authentication, $sanitize) {
    const vm = this;

    vm.profile = undefined;
    vm.projects = [];
    vm.isUserOwnerOfProject = false
    vm.viewSettings = viewSettings

    activate();

    function userIsProjectOwner() {
      var account = Authentication.getAuthenticatedAccount()
      if (account === undefined) return false
      return account.username === vm.profile.username
    }

    function viewSettings() {
      if (!userIsProjectOwner()) {
        alert('You\'re not allowed to view this page.')
      }
      else {
        $location.url('/' + vm.profile.username + '/settings/');
      }
    }

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.profiles.controllers.ProfileController
    */
    function activate() {
      var username = $routeParams.username.substr(1);

      Profile.get(username).then(profileSuccessFn, profileErrorFn);
      Projects.get(username).then(projectsSuccessFn, projectsErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update `profile` on viewmodel
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        vm.isUserOwnerOfProject = userIsProjectOwner()
      }


      /**
      * @name profileErrorFn
      * @desc Redirect to index and show error Snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }


      /**
        * @name projectsSucessFn
        * @desc Update `projects` on viewmodel
        */
      function projectsSuccessFn(data, status, headers, config) {
        vm.projects = data.data;
      }


      /**
        * @name projectsErrorFn
        * @desc Show error snackbar
        */
      function projectsErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.error);
      }
    }
  }
})();