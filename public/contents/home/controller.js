mainApp.controller("homeCtrl", function ($scope) {
    let s = $scope;

    s.toggleNameMenu = false;

    $(".group-item .group-header").click(function (e) {
        if (e.currentTarget.nextElementSibling.classList.contains("hide-list")) {
            e.currentTarget.nextElementSibling.classList.remove("hide-list");
        } else {
            e.currentTarget.nextElementSibling.classList.add("hide-list");
        }
    });
});