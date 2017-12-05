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
    const vm = this;
    vm.submit = submit;
    vm.majors = '' // TODO bug: 'field may not be left blank'

    /**
    * @name submit
    * @desc Create a new Project
    * @memberOf projecthub.projects.controllers.NewProjectController
    */
    function submit() {
      var splitMajors = vm.majors.split(' ');

      Projects.create(vm.title, vm.description, vm.majors).then(createProjectSuccessFn, createProjectErrorFn);
      $scope.closeThisDialog();// ngDialog: closes the project-creation dialog

      /**
      * @name createProjectSuccessFn
      * @desc Show snackbar with success message
      */
      function createProjectSuccessFn(data, status, headers, config) {
        Snackbar.show('Success! Project created.');
        $rootScope.$broadcast('project.created', {})
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