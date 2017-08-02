mainApp.controller("homeCtrl", function ($scope) {
    let s = $scope;

    s.toggleNameMenu = false;

    $(".group-item .group-header").click(function (e) {
        if (e.currentTarget.nextElementSibling.classList.contains("hidden")) {
            e.currentTarget.nextElementSibling.classList.remove("hidden");
        } else {
            e.currentTarget.nextElementSibling.classList.add("hidden");
        }
    });
});