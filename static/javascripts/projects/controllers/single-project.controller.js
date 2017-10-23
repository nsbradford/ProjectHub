/**
* SingleProjectController
* @namespace projecthub.projects.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers')
    .controller('SingleProjectController', SingleProjectController);

  SingleProjectController.$inject = ['$location', '$routeParams', 'Projects', 'Profile', 'Snackbar', 'Authentication'];

  /**
  * @namespace SingleProjectController
  */
  function SingleProjectController($location, $routeParams, Projects, Profile, Snackbar, Authentication) {
    var vm = this;

    // vm.profile = undefined;
    vm.project = undefined

    activate();

    function deleteProject() {
      var account = Authentication.getAuthenticatedAccount()
      if (account.username != vm.project.author.username) {
        alert('You\'re not the owner of this project, so you can\'t delete it.')
      }
      else{
        var confirmed = confirm('Are you sure you want to delete this project? This action can\'t be undone.');
        if (confirmed) {
          Projects.deleteById(vm.project.id)
        }
      }
    }

    function editProject() {
      alert('Editing projects is not supported in this version.');
    }

    vm.deleteProject = deleteProject
    vm.editProject = editProject

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.profiles.controllers.ProfileController
    */
    function activate() {
      var project_id = $routeParams.project_id.substr(1);

      if (project_id === '') {
        Snackbar.error('No such project found')
        $location.url('/discover');
      }
      else {
        Projects.getById(project_id).then(projectsSuccessFn, projectsErrorFn);
      }

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
        Snackbar.error('No such project found')
        $location.url('/discover');
      }
    }
  }
})();