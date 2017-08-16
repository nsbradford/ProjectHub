/**
* NewProjectController
* @namespace projecthub.projects.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers')
    .controller('NewProjectController', NewProjectController);

  NewProjectController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Projects'];

  /**
  * @namespace NewProjectController
  */
  function NewProjectController($rootScope, $scope, Authentication, Snackbar, Projects) {
    var vm = this;

    vm.submit = submit;

    /**
    * TODO: This is a trick to the project creation appear instant, by repopulating the list
    * with the new project immediately. However, in some cases the request to the server
    * might actually fail, leading to an error, or a user thinking a project was created
    * when it really wasn't. It also makes the code a little more complex and harder
    * to understand. For these reasons, this should be removed in final production.
    * @name submit
    * @desc Create a new Project
    * @memberOf projecthub.projects.controllers.NewProjectController
    */
    function submit() {
      $rootScope.$broadcast('project.created', {
        content: vm.content,
        author: {
          username: Authentication.getAuthenticatedAccount().username
        }
      });

      $scope.closeThisDialog();// ngDialog: closes the project-creation dialog
      Projects.create(vm.content).then(createProjectSuccessFn, createProjectErrorFn);


      /**
      * @name createProjectSuccessFn
      * @desc Show snackbar with success message
      */
      function createProjectSuccessFn(data, status, headers, config) {
        Snackbar.show('Success! Project created.');
      }


      /**
      * @name createProjectErrorFn
      * @desc Propogate error event and show snackbar with error message
      */
      function createProjectErrorFn(data, status, headers, config) {
        $rootScope.$broadcast('project.created.error');
        Snackbar.error(data.error);
      }
    }
  }
})();