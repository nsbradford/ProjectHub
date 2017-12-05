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
    vm.submitSearch = submitSearch;
    vm.projects = [];
    vm.filteredProjects = [];
    vm.searchString = null;

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
      /*
      * If we dont have any filters that are applied.
      * Then Set the displayed projects to all projects.
      * Else Lets apply filters to each project and see if they
      * pass.
      */
      if (!activeFilters.length) {
        vm.filteredProjects = vm.projects;
        return;
      }
      vm.filteredProjects = vm.projects.filter(function (project) {

        /**
         * Normally I would use another functional JS component, but we can get 
         * more efficiency if we use a traditional for loop. We cant achieve
         * short circuits using the functional components.
         */
        for (let i = 0; i < activeFilters.length; i++ ) {
          if (project.major === activeFilters[i].title) {
            return true;
          }
        }        
      });
    }

    /**
     * @name submitSearch
     * @desc Perform a call to the server in order to recieve a search result list back
     * Attach Success and Failure callbacks, and finally apply all filters. 
     * 
     * @param {String} searchString The string we provide to the server to be used in a search.
     */
    function submitSearch(searchString) {
      if (searchString) {
        Projects.search(searchString).then(ProjectSearchSuccessCallback, ProjectSearchFailureCallback); 
      } else {
        Snackbar.error("Pleae provide something to search.");
      }
    }
    
    /**
     * @name ProjectSearchSuccessCallback
     * @desc Callback that is fired on a successful search event. Apples filters.
     *
     * @param {object} response the Response we get from the server 
     * @param {object} status the status of the resposne we recieve. This will be used in lazyloader later...
     * @param {object} headers the headers of the response
     * @param {object} config the config of the response
     */
    function ProjectSearchSuccessCallback(response, status, headers, config) {
      vm.projects = response.data;
      filterProjects(); 
    }

    /**
     *  
     *
     * @param {object} response the Response we get from the server 
     * @param {object} status the status of the resposne we recieve. This will be used in lazyloader later...
     * @param {object} headers the headers of the response
     * @param {object} config the config of the response
     */
    function ProjectSearchFailureCallback(response, status, headers, config) {
      Snackbar.error(data.error);
    }

  }
})();