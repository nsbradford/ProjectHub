/**
* NavbarController
* @namespace projecthub.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('projecthub.layout.controllers')
    .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$scope', 'Authentication'];

  /**
  * @namespace NavbarController
  */
  function NavbarController($scope, Authentication) {
    const vm = this;
    vm.logout = logout;
    vm.isAuthenticated = Authentication.isAuthenticated();

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf projecthub.layout.controllers.NavbarController
    */
    function logout() {
      Authentication.logout();
    }
  }
})();