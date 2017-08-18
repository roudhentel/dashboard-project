var mainApp = angular.module("mainApp", ["ngRoute", "ngMaterial", "gridster", "AdalAngular"]);

mainApp.config(($locationProvider, adalAuthenticationServiceProvider, $httpProvider, $routeProvider) => {

    $routeProvider.when("/dashboard", {
        templateUrl: "contents/dashboard/",
        controller: "dashboardCtrl",
        requireADLogin: true
    }).otherwise({ redirectTo: "/dashboard" });

    // initialize ADAL with your application's information
    adalAuthenticationServiceProvider.init({
        instance: 'https://login.microsoftonline.com/',
        tenant: 'a53a1d69-f63a-4ee0-9ef5-fc468542cc19',
        clientId: '238ebf3d-2ed8-4e49-ac37-0ac95b6a28a5',
        // clientId: 'ce203717-c038-45c0-ad87-3c7bd40869d3',
    }, $httpProvider);

    $locationProvider.hashPrefix('');
});