
/**
 * Majors Service
 * Provides Majors to other components.
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
      sortedList: sortedList
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
     * @name sortedList
     * @desc Places the any major at the top of the array for multiselects
     *
     */
    async function sortedList() {
      return await this.all().then(MajorsCallbackSuccess,MajorsCallbackFailure);
    }

    /**
     * @name MajorsCallbackSuccess
     * @desc Callback for when we query the backend for Majors
     * @param {object} responseSuccess Response Containing all Majors
     */
    function MajorsCallbackSuccess(responseSuccess){
      const anyMajor = responseSuccess.data.find(function(major){
        return major.title == "Any";
      });
      return [anyMajor].concat(responseSuccess.data.filter(function(major){
        return major.title != "Any";
      }));
    }

    /**
     * @name MajorsCallbackFailure
     * @desc Callback for when we fail to query the backend for Majors
     * @param {object} responseFailure response containing error
     */
    function MajorsCallbackFailure(responseFailure){
      throw Exception("Cannot Fetch Majors!");
    }
  }
})();