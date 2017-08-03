mainApp.controller("mainCtrl", function ($scope) {
    google.charts.load("current", { packages: ['corechart'] });
    let s = $scope;

    s.gbl = {
        groups: [],
        wtoolbxVisible: false,
        widgetchartid: 4 // widget id of the chart
    };

    s.toggleNameMenu = false;

    $(".group-item .group-header").click(function (e) {
        if (e.currentTarget.nextElementSibling.childElementCount <= 0) return;
        // toggle elements
        if (e.currentTarget.nextElementSibling.classList.contains("hide-list")) {
            e.currentTarget.nextElementSibling.classList.remove("hide-list");
        } else {
            e.currentTarget.nextElementSibling.classList.add("hide-list");
        }
    });

    setTimeout(function () {
        $(".group-item .group-header").each(function () {
            $(this.nextElementSibling).height(this.nextElementSibling.clientHeight);
        });
    }, 50);
});