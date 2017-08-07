mainApp.controller("mainCtrl", function ($scope, adalAuthenticationService) {
    google.charts.load("current", { packages: ['corechart'] });
    let s = $scope;

    s.gbl = {
        groups: [],
        wtoolbxVisible: false,
        widgetchartid: 4, // widget id of the chart
        userGroups: []
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

    s.logout = function () {
        adalAuthenticationService.logOut();
    }

    s.showSubMenu = function (ev, _bool) {
        if (!$(ev.currentTarget).hasClass('open')) {
            $(ev.currentTarget.children[2]).width('auto');
            $(ev.currentTarget.children[2])[0].style.left = "-" + ($(ev.currentTarget.children[2]).width() + 1) + "px";
            $(ev.currentTarget).addClass('open');
        } else {
            $(ev.currentTarget.children[2]).width(0);
            $(ev.currentTarget.children[2])[0].style.left = "-300px";
            $(ev.currentTarget).removeClass('open');
        }
    }
});