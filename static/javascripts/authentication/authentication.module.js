(function () {
  'use strict';

  angular
    .module('projecthub.authentication', [
      'projecthub.authentication.controllers',
      'projecthub.authentication.services'
    ]);

  angular
    .module('projecthub.authentication.controllers', []);

  angular
    .module('projecthub.authentication.services', ['ngCookies']);
})();