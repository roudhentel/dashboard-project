mainApp.controller("mainCtrl", function ($scope, $http, adalAuthenticationService) {
    google.charts.load("current", { packages: ['corechart'] });
    let s = $scope;

    s.gbl = {
        groups: [],
        wtoolbxVisible: false,
        widgetchartid: 4, // widget id of the chart
        userGroups: [],
        selectedView: 0,
        selectedObjId: 0,
        widgets: [],
        listToolbox: []
    };

    s.getuserwidgets = function (objid) {
        $http({
            method: "GET",
            url: "/api/user/getwidgets",
            params: {
                userid: objid ? objid : s.userInfo.profile.oid
            }
        }).then(function (res) {
            if (res.data.success) {
                var userwidgets = res.data.rows;
                s.gbl.widgets = [];
                userwidgets.forEach(item => {
                    var tool = s.gbl.listToolbox.find(obj => obj.widget_id === item.widgetid);
                    if (tool) {
                        s.gbl.widgets.push({
                            id: item.user_widget_id,
                            widgetid: item.widgetid,
                            name: tool.name,
                            color: tool.color,
                            subtitle: tool.subtitle,
                            description: item.description,
                            value: 0,
                            position: {
                                sizeX: item.width,
                                sizeY: item.height,
                                row: item.row,
                                col: item.col
                            },
                            is_deleted: item.is_deleted
                        });
                    }

                });
                google.charts.setOnLoadCallback(s.drawLineChart);

            }
        }, function (err) {
            console.log(err);
        });
    }

    s.setSelectedView = function (view, objid) {
        s.gbl.selectedView = view;
        s.getuserwidgets(objid);
        s.gbl.selectedObjId = objid;
        s.toggleNameMenu = false;
    }

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