/**
* EditProjectController
* @namespace projecthub.projects.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers')
    .controller('EditProjectController', EditProjectController);

  EditProjectController.$inject = [
    '$location', '$routeParams', 'Authentication', 'Snackbar', 'Projects'
  ];

  /**
  * @namespace EditProjectController
  */
  function EditProjectController($location, $routeParams, Authentication, Snackbar, Projects) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;
    vm.isUserOwnerOfProject = false
    vm.project = undefined

    activate();

    function userIsProjectOwner() {
      var account = Authentication.getAuthenticatedAccount()
      console.log(account.username, vm.project.author.username)
      if (account === undefined) return false
      return account.username === vm.project.author.username
    }

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf projecthub.projects.controllers.EditProjectController
    */
    function activate() {
      var project_id = $routeParams.project_id.substr(1);
      Projects.getById(project_id).then(projectsSuccessFn, projectsErrorFn);      

      /**
      * @name projectSuccessFn
      * @desc Update `project` for view
      */
      function projectsSuccessFn(data, status, headers, config) {
        vm.project = data.data;
        console.log('found project')
        vm.isUserOwnerOfProject = userIsProjectOwner()
        if (!vm.isUserOwnerOfProject) {
          $location.url('/');
          Snackbar.error('You are not authorized to view this page.');
        }
        else console.log('project-user match')
      }

      /**
      * @name projectErrorFn
      * @desc Redirect to index
      */
      function projectsErrorFn(data, status, headers, config) {
        Snackbar.error('No such project found')
        $location.url('/');
      }
    }


    /**
    * @name destroy
    * @desc Destroy this user's project
    * @memberOf projecthub.projects.controllers.EditProjectController
    */
    function destroy() {
      var confirmed = confirm('Are you sure you want to delete this project? This action can\'t be undone.');
      if (confirmed) {
        Projects.deleteById(vm.project.id).then(projectSuccessFn, projectErrorFn);
      }

      /**
      * @name projectSuccessFn
      * @desc Redirect to index and display success snackbar.
      *   Unauthenticate and return to index page.
      */
      function projectSuccessFn(data, status, headers, config) {
        window.location = '/discover';
        Snackbar.show('This project has been deleted.');
      }


      /**
      * @name projectErrorFn
      * @desc Display error snackbar
      *   Simply display snackbar error; there's no reason it should fail.
      */
      function projectErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }


    /**
    * @name update
    * @desc Update this user's project
    * @memberOf projecthub.projects.controllers.EditProjectController
    */
    function update() {
      Projects.update(vm.project).then(projectSuccessFn, projectErrorFn);

      /**
      * @name projectSuccessFn
      * @desc Show success snackbar
      */
      function projectSuccessFn(data, status, headers, config) {
        Snackbar.show('Your project has been updated.');
      }


      /**
      * @name projectErrorFn
      * @desc Show error snackbar
      */
      function projectErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();