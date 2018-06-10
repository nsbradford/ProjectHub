/**
 * Navbar Controller Test.
 *
 * @author Ben Bianchi <benjmaminbianchi@outlook.com>
 * @description This is a test that just shows users how to setup a test with mocks. This took me a very
 * long time, and I will remain adament about keeping this here since testing with karma and jasmine is extremely
 * confusing.
 */
describe('NavbarController', function () {

    /**
     * Make sure to load the namespace of the controller you are testing.
     */
    beforeEach(module("projecthub.layout.controllers"));

    /**
     * Define a controller, and anything else you need to share amongst tests.
     */
    var NavbarController, AuthenticationMock;

    /**
     * This is Critical, define all Mocks/Dependencies in a beforeEach() call.
     * This is the simplest way to mock a dependency. Other ways are more intricate an provide
     * a little bit more control.
     */
    beforeAll(function () {
        AuthenticationMock = {
            logout: function (book) { return true; },
            isAuthenticated: function () { return true; }
        };
    });

    /**
     * You must call mock.inject() and provide it parameters you need for injection.
     * This is a bit dark magicky, and I still don't fully understand it, but injector
     * has accesss to providers, such as the rootScope provider, and the controller provider.
     * If you'd like you can specify a provider for mock services, but this will be more difficult.
     */
    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        NavbarController = $controller('NavbarController', {
            $scope: $rootScope.$new(),
            Authentication: AuthenticationMock
        });
    }));


    /**
     * You can Nest test suites. Why? Because we have setup all the injection above.
     */
    describe('Test', function () {
        it('Give, Expecting Nothing Thereof.', function () {
            expect().nothing();
        });
    });
});