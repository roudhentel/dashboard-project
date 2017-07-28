mainApp.controller("dashboardCtrl", function ($scope) {
    let s = $scope;
    s.dashboard = {
        smVisible: false
    };

    s.toggleDialog = function (_bool) {
        s.dashboard.smVisible = _bool;
    };
});