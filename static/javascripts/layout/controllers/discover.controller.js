/**
* DiscoverController
* @namespace projecthub.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.layout.controllers')
    .controller('DiscoverController', DiscoverController);

  DiscoverController.$inject = ['$scope', 'Authentication', 'Projects', 'Snackbar', 'Profile', 
    'Majors', 'Tags', '$document'];

  /**
  * @namespace DiscoverController
  */
  function DiscoverController($scope, Authentication, Projects, Snackbar, Profile, Majors, Tags, $document) {
    const vm = this;
    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.submitSearch = submitSearch;
    vm.lazyLoad = lazyLoad;
    vm.projects = [];
    vm.filteredProjects = [];
    vm.searchString = null;
    vm.lastProjectIndex = 0;
    vm.canLoadMoreProjects = true;
    vm.clearSearch = clearSearch;

    vm.allMajors = [];
    vm.selectedMajors = '';
    vm.clearSelectedMajors = clearSelectedMajors;
    vm.toggleFilterMajors = toggleFilterMajors;

    vm.allTags = [];
    vm.selectedTags = '';
    vm.clearSelectedTags = clearSelectedTags;
    vm.toggleFilterTags = toggleFilterTags;


    /**
     * We ask to filter on project creation, this function should stay outside the activate function
     */
    $scope.$on('project.created', function (event, data) {
      vm.projects = [data].concat(vm.projects);
      filterProjects();
      vm.lastProjectIndex += 1;
    });


    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    *   On project.created or project.created.error, update the projects
    *   array to reflect the changes.
    * @memberOf projecthub.layout.controllers.DiscoverController
    */
    function activate() {
      Projects.load(vm.lastProjectIndex).then(projectsSuccessFn, projectsErrorFn);
      Majors.all().then(MajorsSuccessCallback, MajorsFailureCallback);
      Tags.all().then(TagsSuccessCallback, TagsFailureCallback)

      const account = Authentication.getAuthenticatedAccount();
      if (account) {
        Profile.get(account.username).then(profileSuccessFn, profileErrorFn);
      }

      /**
       * @name MajorsSuccessCallback
       * @desc This function is called when a call to the Majors service
       * returns successfully.
       *
       * @param {object} response The response from the server
       */
      function MajorsSuccessCallback(response) {
        vm.allMajors = response.data;
      }

      /**
       * @name MajorsfailureCallback
       * @desc Function that is calle when the majors service fails to proivde a list of
       * majors
       */
      function MajorsFailureCallback() {
        Snackbar.error("Unable to get majors. Please refresh the page.");
      }

      /**
       * @name TagsSuccessCallback
       * @desc This function is called when a call to the Tags service
       * returns successfully.
       *
       * @param {object} response The response from the server
       */
      function TagsSuccessCallback(response) {
        vm.allTags = response.data;
      }

      /**
       * @name TagsfailureCallback
       * @desc Function that is calle when the Tags service fails to proivde a list of
       * Tags
       */
      function TagsFailureCallback() {
        Snackbar.error("Unable to get Tags. Please refresh the page.");
      }

      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
        vm.isActivated = vm.profile.is_email_confirmed;
      }

      function profileErrorFn(data, status, headers, config) {
        Snackbar.error('Error loading profile, please refresh.');
      }
    }
    /**
    * @name projectsSuccessFn
    * @desc Update projects array on view
    */
    function projectsSuccessFn(data, status, headers, config) {

      /**
       * No Content -- Tell the controller that we can no longer lazyload,
       * Do not add anything to the the project list
       */
      if (data.status == 204) {
        vm.canLoadMoreProjects = false;
        return;
      }

      /**
       * Partial content -- Tell controller, no more lazyloading
       * Go ahead and add to the project lists
       */
      if (data.status == 206) {
        vm.canLoadMoreProjects = false;
      }
      vm.projects = vm.projects.concat(data.data);
      filterProjects();
      vm.lastProjectIndex += data.data.length;

    }

    /**
    * @name projectsErrorFn
    * @desc Show snackbar with error
    */
    function projectsErrorFn(data, status, headers, config) {
      Snackbar.error(data.error);
    }

    /**
     * @name filterToggleCallback
     * @desc Function that is called when a user applies a filter.
     *
     */
    function toggleFilterMajors(filter) {
      // Filter out the curent applied filter,
      // and toggl its 'active' state.
      vm.allMajors.filter(function (f) {
        return filter.title === f.title;
      }).map(function (f) { return f.active = !f.active; });

      vm.selectedMajors = vm.allMajors.filter(function (filter) {
        return filter.active;
      }).map(function (filter) {
        return filter.title;
      }).join(', ');
      filterProjects();
    }

    /**
     * @name filterProjects
     * @desc Filter out all projects that do not fit the criteria given by the user.
     * If there are no filters, then render all projects.
     */
    function filterProjects() {
      // Retrieve all filters that are active.
      const activeFiltersMajors = vm.allMajors.filter(function (f) {
        return f.active;
      }).map(function (activeMajors) {
        return activeMajors.title;
      });

      const activeFiltersTags = vm.allTags.filter(function (f) {
        return f.active;
      }).map(function (activeTags) {
        return activeTags.title;
      });

      vm.filteredProjects = vm.projects.filter(function (project) {

        const containsMajor = activeFiltersMajors.some(function (filter) {
          return (project.majors.indexOf(filter) > -1);
        });

        const containsTag = activeFiltersTags.some(function (filter) {
          return (project.tags.indexOf(filter) > -1);
        });

        const validMajors = !activeFiltersMajors.length || containsMajor;
        const validTags = !activeFiltersTags.length || containsTag;

        return (validMajors && validTags);
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
     * @name clearSearch
     * @desc Remove the words
     */
    function clearSearch(event) {
      vm.lastProjectIndex = 0;
      vm.searchString = '';

      Projects.load(vm.lastProjectIndex).then(ProjectSearchSuccessCallback, ProjectSearchFailureCallback)
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
    /**
     * @name lazyLoad
     * @desc Perform a get request to the server that loads the
     * constant LAZY_LOAD_PROJECT_LENGTH amount of projects
     */
    function lazyLoad() {
      if (vm.canLoadMoreProjects) {
        Projects.load(vm.lastProjectIndex, vm.searchString).then(projectsSuccessFn, projectsSuccessFn);
      }
    }


    /**
     * @name clearSelectedMajors
     * @desc the callback fired when a use hits the c
     */
    function clearSelectedMajors() {
      vm.selectedMajors = '';
      vm.allMajors.map(function (filter) {
        return filter.active = false;
      });
      filterProjects();
    }

    /**
     * @name clearSelectedTags
     * @desc the callback fired when a use hits the c
     */
    function clearSelectedTags() {
      vm.selectedTags = '';
      vm.allTags.map(function (filter) {
        return filter.active = false;
      });
      filterProjects();
    }

    /**
     * @name filterToggleTags
     * @desc Function that is called when a user applies a filter.
     *
     */
    function toggleFilterTags(filter) {
      // Filter out the curent applied filter,
      // and toggl its 'active' state.
      vm.allTags.filter(function (f) {
        return filter.title === f.title;
      }).map(function (f) { return f.active = !f.active; });

      vm.selectedTags = vm.allTags.filter(function (filter) {
        return filter.active;
      }).map(function (filter) {
        return filter.title;
      }).join(', ');
      filterProjects();
    }

  }
})();