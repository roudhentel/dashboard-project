var mainApp = angular.module("mainApp", ["ui.router", "ngMaterial", "gridster"]);

mainApp.config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/login/authenticate');

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
        })
        .state('home', {
            url: "/home",
            templateUrl: "contents/home/",
            controller: "homeCtrl"
        })
        .state('home.dashboard', {
            url: "/dashboard",
            templateUrl: "contents/dashboard/",
            controller: "dashboardCtrl"
        });
});