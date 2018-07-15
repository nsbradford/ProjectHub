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

    beforeEach(loadDependencies = function () {
        LocationMock = {
            url: function(string) {}
        };

        spyOn(LocationMock, "url").and.callThrough();

        AuthenticationMock = {
            activateAccount: function (key) { },
        };

        DialogMock = {
            open: function (dialogData) { return dialogData; },
        };

        spyOn(DialogMock, "open");

        RouteParamsMock = {
            key: "key"
        };

        SnackBarMock = {
            error: function(string) {}
        };

        spyOn(SnackBarMock, "error").and.callThrough();

    });


    describe('Success Case', function () {
        beforeEach(setAuthToSucceed = function () {
            spyOn(AuthenticationMock, "activateAccount").and.returnValue(
                Promise.resolve(true)
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

        it('Should Instantiate', function() {
            expect(ActivateAccountController).toBeDefined();
        });

        it('Should open a dialog on success and forward the user to the login page', function (){
            ScopeMock.$digest();
            AuthenticationMock.activateAccount().then(function () {
                expect(DialogMock.open).toHaveBeenCalled();
            });

        });

    });

    describe('Failure Case', function () {
        beforeEach(setAuthToFail = function () {
            spyOn(AuthenticationMock, "activateAccount").and.returnValue(
                Promise.reject(true)
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

        it('Should Instantiate', function() {
            expect(ActivateAccountController).toBeDefined();
        });

        it('Should open a SnackBar error on failure and forward the user to the root page', function (){
            ScopeMock.$digest();
            AuthenticationMock.activateAccount().then(function (result) {
                expect(SnackBarMock.error).toHaveBeenCalled();
                expect(LocationMock.url).toHaveBeenCalled();
            });

        });

    });
});