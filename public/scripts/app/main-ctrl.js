mainApp.controller("mainCtrl", function ($scope) {
    google.charts.load("current", { packages: ['corechart'] });
    let s = $scope;

    s.gbl = {
        groups: [],
        wtoolbxVisible: false,
        widgetchartid: 4 // widget id of the chart
    };

});