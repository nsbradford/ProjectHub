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


  function resolveUserAuthenticated($location, Authentication) {
    if(!Authentication.getAuthenticatedAccount()) {
      alert('You are not allowed to view this page.');
      $location.path('/');
    }
  }

  function resolveUserActivated($location) {
    if('Your Condition'){
        //Do something
    }else{
        $location.path('/');    //redirect user to home.
        alert("You don't have access here");
    }
  }


    $routeProvider.when('/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/about', {
      templateUrl: 'static/templates/about/about.html'
    }).when('/policies/terms-of-service', {
      templateUrl: 'static/templates/about/termsofservice.html'
    }).when('/', {
      templateUrl: 'static/templates/layout/home.html'
    }).when('/discover', {
      controller: 'DiscoverController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/layout/discover.html',
    }).when('/new-project', {
      controller: 'NewProjectController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/projects/new-project.html'
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
      templateUrl: '/static/templates/profiles/settings.html',
      resolve: [
        'Authentication', resolveUserAuthenticated
      ]
    }).when('/projects/:projectID', {
      controller: 'SingleProjectController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/projects/single-project.html'
    }).when('/projects/:projectID/edit/', {
      controller: 'EditProjectController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/projects/edit-project.html'
    }).when('/activate/:key/', {
      controller: 'ActivateAccountController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/activate-account.html'
    }).otherwise('/');
  }
})();
