
/**
 * Majors Service
 * Provides Majors to other components
 * @namespace projecthub.majors.services
*/
(function () {
  'use strict';

  angular
    .module('projecthub.majors.services')
    .factory('Majors', Majors);

  Majors.$inject = ['$http'];

  /**
  * @namespace Majors
  * @returns {Factory}
  */
  function Majors($http) {
    var majors = {
      all: all,
      // create: create,
      // deleteById: deleteById,
      // update: update
    };

    const majorURL = '/api/v1/majors/';

    return majors;

    /**
    * @name all
    * @desc Get all Majors
    * @returns {Promise}
    * @memberOf projecthub.majors.services.Majors
    */
    function all() {
      return $http.get(majorURL);
    }


    /**
    * @name create
    * @desc Create a new Project
    * @param {string} title The title of the new Project
    * @param {string} description The description of the new Project
    * @returns {Promise}
    * @memberOf projecthub.projects.services.Projects
    */
    // function create(title, description, majors) {
    //   return $http.post(projectURL, {
    //     title: title,
    //   });
    // }

    /**
     * @name get
     * @desc Get the Project of the given projectID
     * @param {string} username The username to get Projects for
     * @param {string} projectID The projectID to get
     * @returns {Promise}
     * @memberOf projecthub.projects.services.Projects
     */
    // function getById(projectID) {
    //   return $http.get(projectURL + projectID + '/');
    // }

    /**
     *
     */
    // function deleteById(projectID) {
    //   return $http.delete(projectURL + projectID + '/');
    // }

    /**
     *
     */
    // function update(project) {
    //   return $http.put(projectURL + project.id + '/', project);
    // }
  }
})();