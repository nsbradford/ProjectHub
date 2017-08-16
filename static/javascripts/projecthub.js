(function () {
  'use strict';

  angular
    .module('projecthub', [
      'projecthub.config',
      'projecthub.routes',
      'projecthub.authentication',
      'projecthub.layout',
      'projecthub.projects',
      'projecthub.profiles',
      'projecthub.utils',
    ]);

  angular
    .module('projecthub.routes', ['ngRoute']);

  angular
    .module('projecthub.config', []);

  angular
    .module('projecthub')
    .run(run);

  run.$inject = ['$http'];

  /**
  * @name run
  * @desc Update xsrf $http headers to align with Django's defaults
  */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }
})();
