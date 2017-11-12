/**
* SingleProjectController
* @namespace projecthub.projects.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers')
    .controller('SingleProjectController', SingleProjectController);

  SingleProjectController.$inject = ['$location', '$routeParams', 'Projects', 'Profile', 
    'Snackbar', 'Authentication'];

  /**
  * @namespace SingleProjectController
  */
  function SingleProjectController($location, $routeParams, Projects, Profile, Snackbar, Authentication) {
    const vm = this;
    // vm.profile = undefined;
    vm.project = undefined
    vm.isUserOwnerOfProject = false

    activate();

    function userIsProjectOwner() {
      var account = Authentication.getAuthenticatedAccount()
      if (account === undefined) return false
      return account.username === vm.project.author.username
    }

    function deleteProject() {
      if (!userIsProjectOwner()) {
        alert('You\'re not the owner of this project, so you can\'t delete it.')
      }
      else{
        var confirmed = confirm('Are you sure you want to delete this project? This action can\'t be undone.');
        if (confirmed) {
          Projects.deleteById(vm.project.id)
          window.location = '/discover';
          Snackbar.show('This project has been deleted.');
        }
      }
    }

    function editProject() {
      if (!userIsProjectOwner()) {
        alert('You\'re not the owner of this project, so you can\'t edit it.')
      }
      else {
        $location.url('projects/+' + vm.project.id + '/edit/');
      }
    }

    vm.userIsProjectOwner = userIsProjectOwner
    vm.deleteProject = deleteProject
    vm.editProject = editProject

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.profiles.controllers.ProfileController
    */
    function activate() {
      var projectID = $routeParams.projectID.substr(1);

      if (projectID === '') {
        Snackbar.error('No such project found')
        $location.url('/discover');
      }
      else {
        Projects.getById(projectID).then(projectsSuccessFn, projectsErrorFn);
      }

      // 

      /**
        * @name projectsSucessFn
        * @desc Update `projects` on viewmodel
        */
      function projectsSuccessFn(data, status, headers, config) {
        vm.project = data.data;
        vm.isUserOwnerOfProject = userIsProjectOwner()
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