/**
* SingleProjectController
* @namespace projecthub.projects.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers')
    .controller('SingleProjectController', SingleProjectController);

  SingleProjectController.$inject = ['$location', '$routeParams', 'Projects', 'Profile', 'Snackbar'];

  /**
  * @namespace SingleProjectController
  */
  function SingleProjectController($location, $routeParams, Projects, Profile, Snackbar) {
    var vm = this;

    // vm.profile = undefined;
    vm.project = undefined

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.profiles.controllers.ProfileController
    */
    function activate() {
      // var username = $routeParams.username.substr(1);
      var project_id = $routeParams.project_id.substr(1);

      // Profile.get(username).then(profileSuccessFn, profileErrorFn);
      Projects.getById(project_id).then(projectsSuccessFn, projectsErrorFn);


      /**
        * @name projectsSucessFn
        * @desc Update `projects` on viewmodel
        */
      function projectsSuccessFn(data, status, headers, config) {
        vm.project = data.data;
      }


      /**
        * @name projectsErrorFn
        * @desc Show error snackbar
        */
      function projectsErrorFn(data, status, headers, config) {
        Snackbar.error(data.data.error);
      }

      /**
      * @name profileSuccessProfile
      * @desc Update `profile` on viewmodel
      */
      // function profileSuccessFn(data, status, headers, config) {
      //   vm.profile = data.data;
      // }


      /**
      * @name profileErrorFn
      * @desc Redirect to index and show error Snackbar
      */
      // function profileErrorFn(data, status, headers, config) {
      //   $location.url('/');
      //   Snackbar.error('That user does not exist.');
      // }

    }
  }
})();