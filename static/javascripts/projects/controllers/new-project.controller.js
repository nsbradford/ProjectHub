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
    vm.majors = null;
    vm.clearTitle = clearTitle;
    vm.clearMajors = clearMajors;

    vm.clearDescription = clearDescription;
    vm.allMajors = $scope.ngDialogData;
    vm.toggleFilter = toggleFilter;

    function clearTitle($event) {
      $event.preventDefault();
      vm.title = '';
    }
    function clearDescription($event) {
      $event.preventDefault();
      vm.description = '';
    }

     function clearMajors($event) {
      $event.preventDefault();
      vm.selected = '';
      vm.allMajors.map(function (major) {
        major.active = false;
      });
  }

   /**
     * @name filterToggleCallback
     * @desc Function that is called when a user applies a filter.
     *
     */
    function toggleFilter(filter) {
      // Filter out the curent applied filter,
      // and toggl its 'active' state.
      vm.allMajors.filter(function (f) {
        return filter.title === f.title;
      }).map(function (f) { return f.active = !f.active; });

      vm.selected = vm.allMajors.filter(function (filter) {
        return filter.active;
      }).map(function (filter) {
        return filter.title;
      }).join(', ');
    }

    /**
    * @name submit
    * @desc Create a new Project
    * @memberOf projecthub.projects.controllers.NewProjectController
    */
    function submit() {

      const majors = vm.allMajors.filter( function(filter) {
        return filter.active;
      }).map(function(major){
        return major.title;
      });

      Projects.create(vm.title, vm.description, majors).then(createProjectSuccessFn, createProjectErrorFn);
      $scope.closeThisDialog();// ngDialog: closes the project-creation dialog

      /**
      * @name createProjectSuccessFn
      * @desc Show snackbar with success message
      */
      function createProjectSuccessFn(data, status, headers, config) {
        Snackbar.show('Success! Project created.');
        $rootScope.$broadcast('project.created', data.data);
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