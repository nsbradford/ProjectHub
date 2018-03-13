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
    '$location', '$routeParams', 'Authentication', 'Snackbar', 'Projects', 'Majors', 'Tags'
  ];

  /**
  * @namespace EditProjectController
  */
  function EditProjectController($location, $routeParams, Authentication, Snackbar, Projects, Majors, Tags) {
    const vm = this;
    vm.isUserOwnerOfProject = false
    vm.project = undefined
    vm.destroy = destroy;
    vm.update = update;

    vm.selectedTags = ''
    vm.clearTags = clearTags;
    vm.toggleFilterTags = toggleFilterTags

    vm.selectedMajors = ''
    vm.clearMajors = clearMajors;
    vm.toggleFilterMajors = toggleFilterMajors;

    vm.clearTitle = clearTitle;
    vm.clearDescription = clearDescription;

    activate();


    function clearTitle(event) {
      event.preventDefault();
      vm.project.title = "";
    }

    function clearDescription(event) {
      event.preventDefault();
      vm.project.description = "";
    }

    /**
     *
     */
    function userIsProjectOwner() {
      var account = Authentication.getAuthenticatedAccount()
      if (account === undefined) return false
      return account.username === vm.project.author.username
    }

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf projecthub.projects.controllers.EditProjectController
    */
    function activate() {
      var projectID = $routeParams.projectID.substr(1);
      Projects.getById(projectID).then(projectsSuccessFn, projectsErrorFn);

      /**
      * @name projectSuccessFn
      * @desc Update `project` for view
      */
      function projectsSuccessFn(data, status, headers, config) {
        vm.project = data.data;
        vm.isUserOwnerOfProject = userIsProjectOwner()
        if (!vm.isUserOwnerOfProject) {
          $location.url('/');
          Snackbar.error('You are not authorized to view this page.');
        }

        /**
         * Sending an ajax request to fetch majors is contingent on us loading the project.
         */
        Majors.all().then(MajorsSuccessCallback, MajorsFailureCallback);
        Tags.all().then(TagsSuccessCallback, TagsFailureCallback);
      }

      /**
     * @name MajorSuccessCallback
     * @desc This function is called when a call to the Majors service
     * returns successfully. We must then coalesce what majors are already selected into this payload.
     *
     * @param {object} response The response from the server
     */
    function MajorsSuccessCallback(response) {
      vm.allMajors = response.data;

      vm.project.majors.forEach(function(selectedMajor) {
        vm.allMajors.find(function (major) {
          return major.title == selectedMajor;
        }).active = true;
      });

      updateTextBoxMajors();
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
     * returns successfully. We must then coalesce what tags are already selected into this payload.
     *
     * @param {object} response The response from the server
     */
    function TagsSuccessCallback(response) {
      vm.allTags = response.data;

      vm.project.tags.forEach(function(selectedTag) {
        vm.allTags.find(function (major) {
          return major.title == selectedTag;
        }).active = true;
      });

      updateTextBoxTags();
    }

    /**
     * @name TagsfailureCallback
     * @desc Function that is calle when the Tags service fails to proivde a list of
     * Tags
     */
    function TagsFailureCallback() {
        Snackbar.error("Unable to get Tags. Please refresh the page.");
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
     * @name clearMajors
     * @desc Clears the Majors multiselect, by changing th actual model.
     *
     * @param {event} event the event emitted by the clear click
     */
    function clearMajors($event) {
      $event.preventDefault();
      vm.selectedMajors = '';
      vm.allMajors.map(function (major) {
        major.active = false;
      });
    }


    // Filter out the curent applied filter,
    // and toggl its 'active' state.
    function toggleFilter(item, collection) {
      vm.allMajors.filter(function (f) {
        return item.title === f.title;
      }).map(function (f) { return f.active = !f.active; });
    }

   /**
     * @name filterToggleCallback
     * @desc Function that is called when a user applies a filter.
     *
     */
    function toggleFilterMajors(item) {
      toggleFilter(item, vm.allMajors)
      updateTextBoxMajors(vm.allMajors, vm.selectedMajors);
    }

    /**
     * @name clearMajors
     * @desc Clears the Majors multiselect, by changing th actual model.
     *
     * @param {event} event the event emitted by the clear click
     */
    function clearTags($event) {
      $event.preventDefault();
      vm.selectedTags = '';
      vm.allTags.map(function (major) {
        major.active = false;
      });
    }

   /**
     * @name filterToggleCallback
     * @desc Function that is called when a user applies a filter.
     *
     */
    function toggleFilterTags(item) {
      toggleFilter(item, vm.allTags)
      updateTextBoxTags();
    }

    /**
     * @name updateTextBoxMajors
     * @desc Concantenates all selected majors and seperates them by a comma
     *
     */
    function updateTextBoxMajors() {
      vm.selectedMajors = vm.allMajors.filter(function (filter) {
        return filter.active;
      }).map(function (filter) {
        return filter.title;
      }).join(', ');
    }

    /**
     * @name updateTextBoxMajors
     * @desc Concantenates all selected majors and seperates them by a comma
     *
     */
    function updateTextBoxTags() {
      vm.selectedTags = vm.allTags.filter(function (filter) {
        return filter.active;
      }).map(function (filter) {
        return filter.title;
      }).join(', ');
    }

    /**
    * @name destroy
    * @desc Destroy this user's project
    * @memberOf projecthub.projects.controllers.EditProjectController
    */
    function destroy() {
      const confirmed = confirm('Are you sure you want to delete this project? This action can\'t be undone.');
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

      vm.missing_title = !vm.project.title ? 'Required' : '';
      vm.missing_description = !vm.project.description ? 'Required' : '';
      // vm.missing_majors = !vm.selected.length ? 'Required' : ''; This should be addressed in the MultiSelect Refactor
      // vm.missing_tags = !vm.project.selected.length ? 'Required' : '';

      if (vm.project.title && vm.project.description && vm.selected && vm.missing_tags) {
        vm.project.majors = vm.allMajors.filter(function (major) {
          return major.active;
        }).map(function (selectedMajor) {
          return selectedMajor.title;
        });

      vm.project.tags = vm.allTags.filter(function(tag){
        return tag.active;
       }).map(function(selectedTag) {
          return selectedTag.title;
      });

      Projects.update(vm.project).then(projectSuccessFn, projectErrorFn);
        Projects.update(vm.project).then(projectSuccessFn, projectErrorFn);
      }

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