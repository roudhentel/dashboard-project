var mainApp = angular.module("mainApp", ["ui.router", "ngRoute", "ngMaterial", "gridster", "AdalAngular"]);

mainApp.config(($stateProvider, $urlRouterProvider, $locationProvider, adalAuthenticationServiceProvider, $httpProvider, $routeProvider) => {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "contents/login/",
            controller: "loginCtrl"
        })
        .state('login.authenticate', {
            url: "/authenticate",
            templateUrl: "contents/login/login-form.html",
            controller: "loginFormCtrl"
        })
        .state('login.signup', {
            url: "/signup",
            templateUrl: "contents/login/signup.html",
            controller: "signupCtrl"
        });
        // .state('home', {
        //     url: "/home",
        //     templateUrl: "contents/home/",
        //     controller: "homeCtrl",
        //     requireADLogin: true
        // })
        // .state('home.dashboard', {
        //     url: "/home/dashboard",
        //     templateUrl: "contents/dashboard/",
        //     controller: "dashboardCtrl",
        //     requireADLogin: true
        // });

    $routeProvider.when("/dashboard", {
        templateUrl: "contents/dashboard/",
        controller: "dashboardCtrl",
        requireADLogin: true
    });

    // initialize ADAL with your application's information
    adalAuthenticationServiceProvider.init({
        instance: 'https://login.microsoftonline.com/',
        tenant: 'common',
        clientId: '238ebf3d-2ed8-4e49-ac37-0ac95b6a28a5',
    }, $httpProvider);

    $locationProvider.hashPrefix('');
});