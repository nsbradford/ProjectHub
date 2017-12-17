/**
* MajorsController
* @namespace projecthub.majors.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.majors.controllers', [])
    .controller('MajorsController', MajorsController);

  MajorsController.$inject = ['$scope', 'Majors'];

  /**
  * @namespace MajorsController
  * @desc contains an algorithm for ensuring similarly-sized columns.
  *   TODO this algorithm needs to be reviewed.
  */
  function MajorsController($scope, Majors) {
    const vm = this;

    /**
     * This will not be static after movign forward within roadmap
     */
    vm.majors = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.projects.controllers.MajorsController
    */
    function activate() {
      Majors.all(MajorsSuccessCallback, MajorsFailureCallback);
    }

    /**
     * @name MajorSuccessCallback
     * @desc This function is called when a call to the Majors service
     * returns successfully.
     *
     * @param {object} response The response from the server
     */
    function MajorsSuccessCallback(response) {
        vm.majors = payload.data;
    }

    /**
     * @name MajorsfailureCallback
     * @desc Function that is calle when the majors service fails to proivde a list of
     * majors
     */
    function MajorsFailureCallback() {
        // Snackbar.error("Unable to get majors. Please refresh the page.");
    }
  }
})();