/**
 * Register Controller Tests
 *
 * @author Ben Bianchi <benjaminbianchi@outlook.com>
 * @description Tests for the register controller -- the controller that specifies who, what, an
 * how a user can be registered for projcethub.
 */

describe('RegisterController', function () {

    /**
     * Make Sure we load the namespace of the Register Controller
     */
    beforeEach(module('projecthub.authentication.controllers'));

    var RegisterController, LocationMock, AuthenticationMock, SnackbarMock, DialogMock;

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
            register : function( email, passwd, usrname, fname, lastname, isaggreed) { return true;}
        };
        spyOn(AuthenticationMock, "isAuthenticated");
        spyOn(AuthenticationMock, "register");

        SnackbarMock = {
            error: function (string) { return string; }
        };
        spyOn(SnackbarMock, "error");

        DialogMock = {
            open: function (dialogData) { return dialogData; }
        };
        spyOn(DialogMock, "open");
    });

    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        RegisterController = $controller('RegisterController', {
            $location: LocationMock,
            $scope: $rootScope.$new(),
            Authentication: AuthenticationMock,
            Snackbar: SnackbarMock,
            ngDialog: DialogMock
        });
    }));

    it('Should be defined', function () {
        expect(RegisterController).toBeDefined();
    });


    describe('checkForApprovedDomainAndDisplayDialog behavior', function () {
        it('should succeed when a user provides an email and it is a wpi email.', function () {
            RegisterController.email = "ben@wpi.edu";
            expect(RegisterController.checkForApprovedDomainAndDisplayDialog()).toBe(true);
        });

        it('should fail when a user fails to provide an email', function () {
            RegisterController.email = undefined;
            expect(RegisterController.checkForApprovedDomainAndDisplayDialog()).toBe(false);
            expect(DialogMock.open).toHaveBeenCalled();
        });

        it('should fail when a user fails to provide a WPI email', function () {
            RegisterController.email = "fool@mit.com";
            expect(RegisterController.checkForApprovedDomainAndDisplayDialog()).toBe(false);
            expect(DialogMock.open).toHaveBeenCalled();
        });
    });

    describe('Register behavior', function () {
        beforeEach(validInput = function () {
            RegisterController.email = "email@wpi.edu",
                RegisterController.username = "username",
                RegisterController.password = "secret",
                RegisterController.firstname = "firstname",
                RegisterController.lastname = "lastname",
                RegisterController.agreement = true;
        });

        it('Should Succeed, when we provide valid input to the controller', function () {
            RegisterController.register();
            expect(AuthenticationMock.register).toHaveBeenCalled();
        });

        it('Should fail and show dialog when we provide a bad email address, when we provide valid input to the controller', function () {
            RegisterController.email = "fool@rit.edu";
            RegisterController.register();
            expect(DialogMock.open).toHaveBeenCalled();
        });

        it('Should fail, when no email is provided', function() {
            RegisterController.email = '';
            RegisterController.register();
            expect(RegisterController.missing_email).toBe('required');
            expect(SnackbarMock.error).toHaveBeenCalled();
        });

        it('Should fail, when no username is provided', function() {
            RegisterController.username = '';
            RegisterController.register();
            expect(RegisterController.missing_username).toBe('required');
            expect(SnackbarMock.error).toHaveBeenCalled();
        });

        it('Should fail, when no password is provided', function() {
            RegisterController.password = '';
            RegisterController.register();
            expect(RegisterController.missing_password).toBe('required');
            expect(SnackbarMock.error).toHaveBeenCalled();
        });

        it('Should fail, when no firstname is provided', function() {
            RegisterController.firstname = '';
            RegisterController.register();
            expect(RegisterController.missing_firstname).toBe('required');
            expect(SnackbarMock.error).toHaveBeenCalled();
        });

        it('Should fail, when no lastname is provided', function() {
            RegisterController.lastname = '';
            RegisterController.register();
            expect(RegisterController.missing_lastname).toBe('required');
            expect(SnackbarMock.error).toHaveBeenCalled();
        });

        it('Should fail, when no agreement is provided', function() {
            RegisterController.agreement = '';
            RegisterController.register();
            expect(RegisterController.missing_agreement).toBe('You must agree to the terms to continue');
            expect(SnackbarMock.error).toHaveBeenCalled();
        });
    });

    describe('hideShowPassword behavior', function() {
        it('should have a default input type as password', function() {
            expect(RegisterController.inputType).toBe('password');
        });

         it('should switch to text', function() {
             RegisterController.hideShowPassword();
            expect(RegisterController.inputType).toBe('text');
        });

        it('should from text to password', function() {
            RegisterController.inputType = "text";
            RegisterController.hideShowPassword();
            expect(RegisterController.inputType).toBe('password');
        });
    });
});