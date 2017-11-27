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
    const vm = this;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.allFilters = [{ title: "CS" }, { title: "ME" }, { title: "ECE" }]; 
    // This will be removed soon. We will be pulling the majors from the backend using angular.
    // Until we have that endpoint, we will be using a static list.
    vm.toggleFilter = toggleFilter;
    vm.projects = [];
    vm.filteredProjects = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    *   On project.created or project.created.error, update the projects
    *   array to reflect the changes. On successful add, we actually
    *   add the project before receiving confirmation to avoid waiting for
    *   another API response, increasing the perceived speed.
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
        vm.filteredProjects = data.data;
      }

      /**
      * @name projectsErrorFn
      * @desc Show snackbar with error
      */
      function projectsErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
    /**
 * @name filterToggleCallback
 * @desc Function that is called when a user applies a filter.
 * 
 */
    function toggleFilter(filter) {
      // Filter out the curent applied filter,
      // and toggl its 'active' state.
      vm.allFilters.filter(function (f) {
        return filter.title === f.title;
      }).map(function (f) { return f.active = !f.active; });
      
      filterProjects();
    }

    /**
     * @name filterProjects
     * @desc Filter out all projects that do not fit the criteria given by the user.
     * If there are no filters, then render all projects.
     */
    function filterProjects() {
      // Retrieve all filters that are active.
      const activeFilters = vm.allFilters.filter(function (f) {
        return f.active;
      });
      // If we dont have any filters that are applied.
      // Then Set the displayed projects to all projects.
      // Else Lets apply filters to each project and see if they
      // pass.
      if (!activeFilters.length) {
        vm.filteredProjects = vm.projects;
        return;
      }
      vm.filteredProjects = vm.projects.filter(function (project) {
        return project.major === activeFilters[0].title;
      });
    }
  }
})();