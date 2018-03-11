
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
      all: all
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
  }
})();