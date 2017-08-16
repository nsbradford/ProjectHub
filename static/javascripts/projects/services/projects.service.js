/**
* Projects
* @namespace projecthub.projects.services
*/
(function () {
  'use strict';

  angular
    .module('projecthub.projects.services')
    .factory('Projects', Projects);

  Projects.$inject = ['$http'];

  /**
  * @namespace Projects
  * @returns {Factory}
  */
  function Projects($http) {
    var Projects = {
      all: all,
      create: create,
      get: get
    };

    return Projects;

    ////////////////////

    /**
    * @name all
    * @desc Get all Projects
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    function all() {
      return $http.get('/api/v1/projects/');
    }


    /**
    * @name create
    * @desc Create a new Project
    * @param {string} content The content of the new Project
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    function create(content) {
      return $http.post('/api/v1/projects/', {
        content: content
      });
    }

    /**
     * @name get
     * @desc Get the Projects of a given user
     * @param {string} username The username to get Projects for
     * @returns {Promise}
     * @memberOf projecthub.projects.services.Projects
     */
    function get(username) {
      return $http.get('/api/v1/accounts/' + username + '/projects/');
    }
  }
})();