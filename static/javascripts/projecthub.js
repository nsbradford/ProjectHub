(function () {
  'use strict';

  angular
    .module('projecthub', [
      'projecthub.config',
      'projecthub.routes',
      'projecthub.authentication',
      'projecthub.layout',
      'projecthub.majors',
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
  * @desc Update xsrf $http headers to align with Django's defaults,
  *   which expects 'X-CSRFToken' with any dangerous HTTP request.
  *   (Cross-Site Request Forgeries occur when a user is authenticated
  *   on ProjectHub but visiting another site, and that site takes
  *   advantage of the credentials to send malicious requests without
  *   the user's knowledge. This is solved by using a CSRFtoken that
  *   updates after every request.)
  */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }
})();
