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
    * @desc The directive to be returned.
    *   Setting projects: '=' allows for two-way binding, so $scope.projects
    *   is passed through to the projects attribute in the html template.
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