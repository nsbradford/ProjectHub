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
      deleteById: deleteById,
      update: update
    };

    const projectURL = '/api/v1/projects/'

    return Projects;

    /**
    * @name all
    * @desc Get all Projects
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    function all() {
      return $http.get(projectURL);
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
      return $http.post(projectURL, {
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
     * @desc Get the Project of the given projectID
     * @param {string} username The username to get Projects for
     * @param {string} projectID The projectID to get
     * @returns {Promise}
     * @memberOf projecthub.projects.services.Projects
     */
    function getById(projectID) {
      return $http.get(projectURL + projectID + '/');
    }

    /**
     *
     */
    function deleteById(projectID) {
      return $http.delete(projectURL + projectID + '/')
    }

    /**
     *
     */
    function update(project) {
      return $http.put(projectURL + project.id + '/', project);
    }
  }
})();