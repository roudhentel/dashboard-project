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

    s.toProperCase = function (str) {
        if (!str) return;
        var ret = str.toString().toLowerCase();
        var _arr = ret.split(" ");
        var newstr = "";
        _arr.forEach(item => {
            newstr += item.substr(0, 1).toUpperCase() + item.substr(1, item.length) + " ";
        })
        return newstr.trim();
    }

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

                s.updateWidgetsData();
                google.charts.setOnLoadCallback(s.drawLineChart);

            }
        }, function (err) {
            console.log(err);
        });
    }

    s.updateWidgetsData = function () {
        if (s.gbl.widgets.length > 0) {
            s.gbl.widgets.forEach(wgts => {
                if (wgts.name.toLowerCase() === 'appspace') {
                    wgts.showLoading = true;
                    $http({
                        method: "GET",
                        url: "/api/report/appspace-count",
                        params: {}
                    }).then(function (res) {
                        if (res) {
                            wgts.value = res.data.count;
                        }
                        wgts.showLoading = false;
                    }, function (err) {
                        console.log(err);
                        wgts.showLoading = false;
                    });
                } else if (wgts.name.toLowerCase() === 'network') {
                    wgts.showLoading = true;
                    $http({
                        method: "GET",
                        url: "/api/report/ncm-count",
                        params: {}
                    }).then(function (res) {
                        if (res) {
                            wgts.value = res.data.count;
                        }
                        wgts.showLoading = false;
                    }, function (err) {
                        console.log(err);
                        wgts.showLoading = false;
                    });
                } else if (wgts.name.toLowerCase() === 'sites requiring attention') {
                    wgts.showLoading = true;
                    $http({
                        method: "GET",
                        url: "/api/report/ncm-count",
                        params: {}
                    }).then(function (res) {
                        if (res) {
                            wgts.value = res.data.count;
                        }
                        wgts.showLoading = false;
                    }, function (err) {
                        console.log(err);
                        wgts.showLoading = false;
                    });
                }
            });
        };
    };

    setInterval(() => {
        s.updateWidgetsData();
    }, 60000);

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

   // console.log(s.userInfo);
});