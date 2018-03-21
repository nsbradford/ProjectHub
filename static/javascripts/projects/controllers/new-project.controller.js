/**
 * NewProjectController
 * @namespace projecthub.projects.controllers
 */
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers')
    .controller('NewProjectController', NewProjectController);

  NewProjectController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar',
    'Projects', 'Majors', 'Tags', '$window'];

  /**
   * @namespace NewProjectController
   */
  function NewProjectController($rootScope, $scope, Authentication, Snackbar, Projects, Majors, Tags, $window) {
    const vm = this;
    vm.submit = submit;
    vm.allMajors = null;
    vm.allTags = null;
    vm.clearTitle = clearTitle;
    vm.clearMajors = clearMajors;
    vm.clearTags = clearTags;

    vm.toggleFilterMajors = toggleFilterMajors;
    vm.toggleFilterTags = toggleFilterTags;

    Majors.all().then(MajorsLoadSuccessCallback, MajorsLoadFailureCallback);
    Tags.all().then(TagsLoadSuccessCallback, TagsLoadFailureCallback)

    /**
     * @name MajorLoadSuccessCallback
     * @desc When we successfully load majors from the server, update the controller
     *
     * @param Object response the Reponse rom the server containing all majors.
     */
    function MajorsLoadSuccessCallback(responseSuccess) {
      vm.allMajors = responseSuccess.data;
    }

    /**
     * @name MajorLoadFailureCallback
     * @desc When we fail to load majors from the server, show an error.
     *
     * @param Object responseFailure the response we get from a failed ajax call.
     */
    function MajorsLoadFailureCallback(responseFailure) {
      Snackbar.error("Unable to load Majors. Please refresh.");
    }

    function TagsLoadSuccessCallback(response) {
      vm.allTags = response.data;
    }

    function TagsLoadFailureCallback(response) {
      Snackbar.error("Unable to load Tags. Please refresh.");
    }

    /**
     * @name clearTitle
     * @desc Clears the Title textbox, by changing th actual model.
     *
     * @param {event} event the event emitted by the clear click
     */
    function clearTitle($event) {
      $event.preventDefault();
      vm.title = '';
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

      const tags = vm.allTags.filter( function(filter) {
        return filter.active;
      }).map(function(tag){
        return tag.title;
      });

      vm.missing_title = !vm.title ? 'Required' : '';
      vm.missing_description = !vm.description ? 'Required' : '';
      // vm.missing_majors = !vm.selected.length ? 'At least one major is Required' : ''; TOOO: Multiselect Refactor
      // vm.missing_tags = !vm.selected.length ? 'At least one major is Required' : '';


      // if (vm.title && vm.description) {
      //   Projects.create(vm.title, vm.description, majors).then(createProjectSuccessFn, createProjectErrorFn);
      // }

      Projects.create(vm.title, vm.description, majors, tags).then(createProjectSuccessFn, createProjectErrorFn);

     /**
      * @name createProjectSuccessFn
      * @desc Show snackbar with success message
      *
      * @param Project response the newly created project
      */
      function createProjectSuccessFn(response) {
        Snackbar.show('Success! Project created.');
        $window.location = `/projects/+${response.data.id}`;
      }


     /**
      * @name createProjectErrorFn
      * @desc Propagate error event and show snackbar with error message
      *
      * @param Error errorResponse
      */
      function createProjectErrorFn(errorResponse) {
        Snackbar.error("Unable to Create Project. Please Try again");
      }
    }
  }
})();