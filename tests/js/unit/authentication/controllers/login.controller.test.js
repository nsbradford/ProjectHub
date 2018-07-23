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

    let LoginController, LocationMock, AuthenticationMock, DialogMock, $rootScopeGlobal;

    describe('Login Controller Successess', function () {
        /**
         * Load Dependencies
         */
        beforeEach(loadDependencies = function () {
            LocationMock = {
                url: jasmine.createSpy("url").and.callFake(function () { })
            };

            AuthenticationMock = {
                isAuthenticated: function () { },
                login: function (email, passwd) { },
                setAuthenticatedAccount: function (data) { }
            };
            spyOn(AuthenticationMock, "login").and.returnValue(
                {
                    then: function (success, failure) {
                        success({ data: {} });
                    }
                }
            );



            spyOn(AuthenticationMock, "setAuthenticatedAccount").and.returnValue(true);

            DialogMock = {
                open: function (dialogData) { return dialogData; },
                test: "true"
            };
            spyOn(DialogMock, "open");
        });

        beforeEach(angular.mock.inject(function ($rootScope, $controller) {
            $rootScopeGlobal = $rootScope;

            LoginController = $controller('LoginController', {
                $location: LocationMock,
                $scope: $rootScope.$new(),
                Authentication: AuthenticationMock,
                ngDialog: DialogMock
            });
        }));

        it('Should be defined', function () {
            expect(LoginController).toBeDefined();
        });

        it('Should call Authentication.setAuthenticatedAccount on success', function () {
            LoginController.login();
            expect(AuthenticationMock.setAuthenticatedAccount).toHaveBeenCalled();
            expect(LocationMock.url).toHaveBeenCalled();

        });

    });

    describe("Login Controller Failure Cases", function () {

        /**
 * Load Dependencies
 */
        beforeEach(loadDependencies = function () {
            LocationMock = {
                url: jasmine.createSpy("url").and.callFake(function () { })
            };

            AuthenticationMock = {
                isAuthenticated: function () { },
                login: function (email, passwd) { },
                setAuthenticatedAccount: function (data) { }
            };

            spyOn(AuthenticationMock, "login").and.returnValue(
                {
                    then: function (success, failure) {
                        failure({ data: {} });
                    }
                }
            );


            spyOn(AuthenticationMock, "setAuthenticatedAccount").and.returnValue(true);

            DialogMock = {
                open: function (dialogData) { return dialogData; },
                test: "true"
            };
            spyOn(DialogMock, "open");
        });

        beforeEach(angular.mock.inject(function ($rootScope, $controller) {
            $rootScopeGlobal = $rootScope;

            LoginController = $controller('LoginController', {
                $location: LocationMock,
                $scope: $rootScope.$new(),
                Authentication: AuthenticationMock,
                ngDialog: DialogMock
            });
        }));


        it('Should call ngDialog.oepn on failure', function () {
            LoginController.login();
            expect(DialogMock.open).toHaveBeenCalled();
        });
    });

});
