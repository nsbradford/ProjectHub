/**
* DiscoverProjectsController
* @namespace projecthub.projects.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.controllers', ['angularMoment'])
    .controller('DiscoverProjectsController', DiscoverProjectsController);

  DiscoverProjectsController.$inject = ['$scope'];

  /**
  * @namespace DiscoverProjectsController
  * @desc contains an algorithm for ensuring similarly-sized columns.
  *   TODO this algorithm needs to be reviewed.
  */
  function DiscoverProjectsController($scope) {
    const vm = this;

    /**
     * This will not be static after movign forward within roadmap
     */
    vm.projects = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf projecthub.projects.controllers.DiscoverProjectsController
    */
    function activate() {
      vm.projects = $scope.projects;
      
    }
  }
})();