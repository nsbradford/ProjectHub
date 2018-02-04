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
      load: load,
      create: create,
      get: get,
      getById: getById,
      deleteById: deleteById,
      search: search,
      update: update
    };

    const projectURL = '/api/v1/projects/';

    return Projects;

    /**
    * @name load
    * @desc Gets n amount of projects
    *
    * @param int transactionStartIndex how many projects to load.
    * @param string searchString the string we are searching for (could also be nothing)
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    function load(transactionStartIndex, searchString) {
      if (searchString == undefined) {
        searchString = "";
      }
      return $http.get(projectURL + "?lastProjectIndex=" + transactionStartIndex + "&searchString=" + encodeURIComponent(searchString));
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
        majors: majors
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
      return $http.delete(projectURL + projectID + '/');
    }

    /**
     *
     */
    function update(project) {
      return $http.put(projectURL + project.id + '/', project);
    }

    /**
     * @name search
     * @desc api call to search all projects's fields for a given string.
     *
     * @param {String} searchString string that will be used in a server-side search of projects.
     *
     * @returns {array} an array of all projects that contain the searchString within their fields.
     */
    function search(searchString) {
      return $http.get(projectURL + "?searchString=" + encodeURIComponent(searchString));
    }
  }
})();