/**
* Authentication
* @namespace projecthub.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('projecthub.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', 'Snackbar'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http, Snackbar) {

    /**
     * The Hash key for the account cookie.
     */
    const COOKIE_KEY = "authenticatedAccount";

    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      login: login,
      register: register,
      logout: logout,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      activateAccount: activateAccount,
      resendConfirmation: resendConfirmation,
    };
    return Authentication;

    /* Begin functions */

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @param {string} username The username entered by the user
    * @param {string} firstname The first name of the new user
    * @param {string} lastname The last name of the new user
    * @returns {Promise}
    * @memberOf projecthub.authentication.services.Authentication
    */
    function register(email, password, username, firstname, lastname) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        password: password,
        email: email,
        first_name: firstname,
        last_name: lastname
      }).then(registerSuccessFn, registerErrorFn);

      /**
      * @name registerSuccessFn
      * @desc Log the new user in
      */
      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, password);
      }

      /**
      * @name registerErrorFn
      * @desc Log "Epic failure!" to the console
      */
      function registerErrorFn(data, status, headers, config) {
        Snackbar.error('Email and/or username may already be taken.');
      }
    }


    /**
     * @name login
     * @desc Try to log in with email `email` and password `password`
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf projecthub.authentication.services.Authentication
     */
    function login(email, password) {
      return $http.post('/api/v1/auth/login/', {
        email: email, password: password
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);

        window.location = '/discover';
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        Snackbar.error('The username/password combination you entered was invalid.');
      }
    }

    /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf projecthub.authentication.services.Authentication
     */
    function getAuthenticatedAccount() {
      if (!$cookies.get(COOKIE_KEY)) {
        return;
      }

      return JSON.parse($cookies.get(COOKIE_KEY));
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf projecthub.authentication.services.Authentication
     */
    function isAuthenticated() {
      return !!$cookies.get(COOKIE_KEY);
    }

    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     * @memberOf projecthub.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      $cookies.put(COOKIE_KEY, JSON.stringify(account), {'expires': expireDate});
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     * @memberOf projecthub.authentication.services.Authentication
     */
    function unauthenticate() {
      $cookies.remove(COOKIE_KEY);
    }

    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf projecthub.authentication.services.Authentication
     */
    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '/';
      }

      /**
       * @name logoutErrorFn
       * @desc Inform user that something went wrong during logout.
       */
      function logoutErrorFn(data, status, headers, config) {
        Snackbar.error('Something went wrong during Logout.');
      }
    }

    function activateAccount(key) {
      return $http.post('/api/v1/auth/activate/' + key);
    }

    function resendConfirmation(email) {
      return $http.post('/api/v1/auth/resend/', {
        email: email,
      });
    }

  }
})();