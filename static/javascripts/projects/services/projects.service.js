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
      get: get,
      getById: getById,
      deleteById: deleteById
    };

    var project_url = '/api/v1/projects/'

    return Projects;

    ////////////////////

    /**
    * @name all
    * @desc Get all Projects
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    function all() {
      return $http.get(project_url);
    }


    /**
    * @name create
    * @desc Create a new Project
    * @param {string} title The title of the new Project
    * @param {string} description The description of the new Project
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    function create(title, description, majors) {
      // console.log(majors)
      return $http.post(project_url, {
        title: title,
        description: description,
        // majors: majors // TODO only handling a single major currently
        major: majors 
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

    /**
     * @name get
     * @desc Get the Project of the given project_id
     * @param {string} username The username to get Projects for
     * @param {string} project_id The project_id to get
     * @returns {Promise}
     * @memberOf projecthub.projects.services.Projects
     */
    function getById(project_id) {
      return $http.get(project_url + project_id + '/');
    }

    /**
     *
     */
    function deleteById(project_id) {
      return $http.delete(project_url + project_id + '/')
    }
  }
})();