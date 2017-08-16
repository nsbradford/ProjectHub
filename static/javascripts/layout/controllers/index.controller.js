/**
* IndexController
* @namespace projecthub.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'Authentication', 'Projects', 'Snackbar'];

  /**
  * @namespace IndexController
  */
  function IndexController($scope, Authentication, Projects, Snackbar) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.projects = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.layout.controllers.IndexController
    */
    function activate() {
      Projects.all().then(projectsSuccessFn, projectsErrorFn);

      $scope.$on('project.created', function (event, project) {
        vm.projects.unshift(project);
      });

      $scope.$on('project.created.error', function () {
        vm.projects.shift();
      });


      /**
      * @name projectsSuccessFn
      * @desc Update projects array on view
      */
      function projectsSuccessFn(data, status, headers, config) {
        vm.projects = data.data;
      }


      /**
      * @name projectsErrorFn
      * @desc Show snackbar with error
      */
      function projectsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();