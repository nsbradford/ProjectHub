/**
 * Activate Account Controller Tests
 *
 * @author Ben Bianchi <benjaminbianchi@outlook.com>
 * @description Tests for the account activate controller -- the controller that allows users to
 * become full projecthub members/
 */

describe('ActivateAccountController', function () {
    // Required Dependencies ActivateAccountController.$inject = ['$location', '$scope', '$routeParams', 'Snackbar',
    //     Authentication', 'ngDialog'];

    /**
     * Setup Modules and Vars for Injecting Mock Depencies.
     */
    beforeEach(module('projecthub.authentication.controllers'));
    let ActivateAccountController, LocationMock, ScopeMock, RouteParamsMock, SnackBarMock, AuthenticationMock, DialogMock;

    /**
     * Construct all mocked services, and spy on them so that we know if they were called or not within
     * a test
     */
    beforeEach(loadDependencies = function () {

        // Location is called on the promise reject for activating an account
        LocationMock = {
            url: function (string) { }
        };

        spyOn(LocationMock, "url").and.callThrough();

        // Initialize a mock that we can spy on later
        AuthenticationMock = {
            activateAccount: function (key) { },
        };

        // Mock to see if a dialog is called or not.
        DialogMock = {
            open: function (dialogData) { return dialogData; },
        };

        spyOn(DialogMock, "open");

        // RouteParams are required to instantiate this controller
        RouteParamsMock = {
            key: "key"
        };

        // Snack Bar is called on a promise reject. Required for controller instantiation
        SnackBarMock = {
            error: function (string) { }
        };

        spyOn(SnackBarMock, "error").and.callThrough();

    });


    describe('Success Case', function () {
        beforeEach(setAuthToSucceed = function () {
            spyOn(AuthenticationMock, "activateAccount").and.returnValue(
                {
                    then: function (success, failure) {
                        success({});
                    }
                }
            );
        });

        beforeEach(angular.mock.inject(function ($rootScope, $controller) {
            ScopeMock = $rootScope.$new();

            ActivateAccountController = $controller('ActivateAccountController', {
                $location: LocationMock,
                $scope: $rootScope.$new(),
                $routeParams: RouteParamsMock,
                Snackbar: SnackBarMock,
                Authentication: AuthenticationMock,
                ngDialog: DialogMock
            });
        }));

        /**
         * The success of this test is more difficult, than you think. It helps to have a
         * test that confirms that the test file is actually valid.
         */
        it('Should Instantiate', function () {
            expect(ActivateAccountController).toBeDefined();
        });

        it('Should open a dialog on success and forward the user to the login page', function () {
            ScopeMock.$digest();
            AuthenticationMock.activateAccount().then(function () {
                expect(DialogMock.open).toHaveBeenCalled();
            });

        });

    });

    /**
     * Seperate Failure Case so that we can reuse as much code as possible
     */
    describe('Failure Case', function () {
        beforeEach(setAuthToFail = function () {
            spyOn(AuthenticationMock, "activateAccount").and.returnValue(
                {
                    then: function (success, failure) {
                        failure({});
                    }
                });
        });

        beforeEach(angular.mock.inject(function ($rootScope, $controller) {
            ScopeMock = $rootScope.$new();

            ActivateAccountController = $controller('ActivateAccountController', {
                $location: LocationMock,
                $scope: $rootScope.$new(),
                $routeParams: RouteParamsMock,
                Snackbar: SnackBarMock,
                Authentication: AuthenticationMock,
                ngDialog: DialogMock
            });
        }));

        it('Should Instantiate', function () {
            expect(ActivateAccountController).toBeDefined();
        });

        it('Should open a SnackBar error on failure and forward the user to the root page', function () {
            expect(SnackBarMock.error).toHaveBeenCalled();
            expect(LocationMock.url).toHaveBeenCalled();
        });

    });
});