(function () {
  'use strict';

  angular
    .module('projecthub.profiles', [
      'projecthub.profiles.controllers',
      'projecthub.profiles.services'
    ]);

  angular
    .module('projecthub.profiles.controllers', ['ngSanitize']);

  angular
    .module('projecthub.profiles.services', []);
})();