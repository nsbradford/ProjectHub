(function () {
  'use strict';

  angular
    .module('projecthub.projects', [
      'projecthub.projects.controllers',
      'projecthub.projects.directives',
      'projecthub.projects.services'
    ]);

  angular
    .module('projecthub.projects.controllers', []);

  angular
    .module('projecthub.projects.directives', ['ngDialog']);

  angular
    .module('projecthub.projects.services', []);
})();