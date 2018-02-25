
/**
 * Tags Service
 * Provides Tags to other components
 * @namespace projecthub.tags.services
*/
(function () {
  'use strict';

  angular
    .module('projecthub.tags.services')
    .factory('tags', tags);

  tags.$inject = ['$http'];

  /**
  * @namespace tags
  * @returns {Factory}
  */
  function tags($http) {
    var tags = {
      all: all
    };

    const tagUrl = '/api/v1/tags/';

    return tags;

    /**
    * @name all
    * @desc Get all Tags
    * @returns {Promise}
    * @memberOf projecthub.tags.services.Tags
    */
    function all() {
      return $http.get(tagUrl);
    }
  }
})();