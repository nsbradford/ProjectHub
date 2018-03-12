
/**
 * Tags Service
 * Provides Tags to other components
 * @namespace projecthub.tags.services
*/
(function () {
  'use strict';

  angular
    .module('projecthub.tags.services')
    .factory('Tags', Tags);

  Tags.$inject = ['$http'];

  /**
  * @namespace tags
  * @returns {Factory}
  */
  function Tags($http) {
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