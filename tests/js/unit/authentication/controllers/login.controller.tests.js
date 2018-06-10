/**
 * Login Controller Tests
 *
 * @author Ben Bianchi <benjaminbianchi@outlook.com>
 * @description Tests for the register controller -- the controller that specifies who, what, an
 * how a user can be registered for projcethub.
 */

describe('LoginController', function () {

    /**
     * Make Sure we load the namespace of the Login Controller
     */
    beforeEach(module('projecthub.authentication.controllers'));

    var LoginController, LocationMock, AuthenticationMock, DialogMock;

    /**
     * Load Dependencies
     */
    beforeEach(loadDependencies = function () {
        LocationMock = {
            url: function (url) { return undefined; }
        };
        spyOn(LocationMock, "url");

        AuthenticationMock = {
            isAuthenticated: function () { return true; },
            login : function(email, passwd) { return Promise();},
            setAuthenticatedAccount: function(data) {return data;}
        };
        spyOn(AuthenticationMock, "isAuthenticated");
        spyOn(AuthenticationMock, "login");
        spyOn(AuthenticationMock, "setAuthenticatedAccount");

        DialogMock = {
            open: function (dialogData) { return dialogData; }
        };
        spyOn(DialogMock, "open");
    });

    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        LoginController = $controller('LoginController', {
            $location: LocationMock,
            $scope: $rootScope.$new(),
            Authentication: AuthenticationMock,
            Snackbar: SnackbarMock,
            ngDialog: DialogMock
        });
    }));

    it('Should be defined', function () {
        expect(LoginController).toBeDefined();
    });
});
