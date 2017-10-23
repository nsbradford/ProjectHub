(function () {
  'use strict';

  angular
    .module('projecthub.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController', 
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/about', {
      templateUrl: 'static/templates/about/about.html'
    }).when('/policies/terms-of-service', {
      templateUrl: 'static/templates/about/termsofservice.html'
    }).when('/', {
      templateUrl: 'static/templates/layout/index.html'
    }).when('/discover', {
      controller: 'IndexController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/layout/discover.html',
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/+:username', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/profile.html'
    }).when('/+:username/settings', {
      controller: 'ProfileSettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/settings.html'
    }).when('/projects/:project_id', {
      controller: 'SingleProjectController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/projects/single-project.html'
    }).otherwise('/');
  }
})();
