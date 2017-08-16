/**
* Projects
* @namespace projecthub.projects.directives
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.directives')
    .directive('discoverProjects', discoverProjects);

  /**
  * @namespace Projects
  */
  function discoverProjects() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf projecthub.projects.directives.Projects
    */
    var directive = {
      controller: 'DiscoverProjectsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        projects: '='
      },
      templateUrl: '/static/templates/projects/discover-projects.html'
    };

    return directive;
  }
})();