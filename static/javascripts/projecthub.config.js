(function () {
  'use strict';

  angular
    .module('projecthub.config')
    .config(config);

  config.$inject = ['$locationProvider'];

  /**
  * @name config
  * @desc Enable HTML5 routing. Some people hate the deafult hash mark that
  *   Angular uses, so we'll take advantage of HTML5 to remove it. Note that
  *   for older browsers that don't support it, Angular will smartly fall back
  *   to using hash routing so nothing breaks.
  * The hashPrefix default is '!' now, so urls in old browsers will end with '#!'
  */
  function config($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }
})();