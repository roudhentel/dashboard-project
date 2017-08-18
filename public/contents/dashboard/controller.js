mainApp.controller("dashboardCtrl", function ($scope, $http, Dialog, adalAuthenticationService) {
    let s = $scope;
    let dialogsvc = new Dialog();
    s.dashboard = {
        smVisible: false,
        header: "Support Monitoring Dashboard",
        isEdit: false,
        savingFlag: false,
        selectedItem: {},
        gridToggle: true,
        sdVisible: false,
        selectedDevice: {}
    };

    let setSelectedItem = function (item) {
        s.dashboard.selectedItem = item;
    }

    s.colors = ['#D37637', '#CE4C3A', '#D62885', '#54D166', '#5968D3'];
    s.devices = ['Network', 'DMP', 'Apps', 'Panel', 'Local PC'];
    s.visibledevices = [];
    s.dialogData = [];
    s.toggleDialog = function (_bool, item) {
        s.dashboard.smVisible = _bool;
        if (!_bool && s.dashboard.selectedItem && s.dashboard.selectedItem.name.toLowerCase() === "search") {
            s.dashboard.selectedItem.value = 0;
        }
        if (item) {
            setSelectedItem(item);
            s.dialogData = [];
            if (item.name.toLowerCase().indexOf("sites requiring") > -1 ||
                item.name.toLowerCase().indexOf("search") > -1) {
                s.visibledevices = s.devices;
                switch (item.name.toLowerCase()) {
                    case "sites requiring attention":
                        s.dialogDataLoading = true;
                        $http({
                            method: "GET",
                            url: "/api/report/ncm",
                        }).then(function (res) {
                            if (res.data) {
                                s.dialogData = res.data.rows;
                            }
                            s.dialogDataLoading = false;
                        }, function (err) {
                            console.log(err);
                            s.dialogDataLoading = false;
                        });
                        break;
                    case "search":

                        break;
                }
            } else {
                s.visibledevices = [item.name];
                switch (item.name.toLowerCase()) {
                    case "appspace":
                        s.dialogDataLoading = true;
                        $http({
                            method: "GET",
                            url: "/api/report/appspace",
                        }).then(function (res) {
                            if (res.data) {
                                s.dialogData = res.data.rows;
                            }
                            s.dialogDataLoading = false;
                        }, function (err) {
                            console.log(err);
                            s.dialogDataLoading = false;
                        });
                        break;
                    case "network":
                        s.dialogDataLoading = true;
                        $http({
                            method: "GET",
                            url: "/api/report/ncm",
                        }).then(function (res) {
                            if (res.data) {
                                s.dialogData = res.data.rows;
                                console.log(res.data);
                            }
                            s.dialogDataLoading = false;
                        }, function (err) {
                            console.log(err);
                            s.dialogDataLoading = false;
                        });
                        break;
                    case "sites requiring attention":

                        break;
                }
            }
        }
    };

    s.getDeviceStatus = function (col, item) {
        if (col && col.toLowerCase() === 'network') {
            return item.Modem ? "redstatus" : "greenstatus";
        } else {
            return "nastatus";
        }
    }

    s.getDeviceColor = function (device) {
        if (!device) return;
        var d = s.devices.find(obj => obj.toLowerCase() === device.toLowerCase().substr(0, obj.length));
        if (d) {
            var idx = s.devices.indexOf(d);
            if (idx > -1) return s.colors[idx];
        }
    }

    s.toggleDialog_1 = function (_bool, item, device) {
        let showdialog = false;
        let color = s.getDeviceColor(device);

        if (device === "Network" && item.Modem) showdialog = true;

        if (!showdialog && _bool) return;
        s.dashboard.selectedDevice = { item: item, color: color, device: device };
        s.dashboard.sdVisible = _bool;
    }

    s.txtSearch = "";
    s.search = function (queryStr) {
        if (queryStr === undefined) return;
        s.dialogDataLoading = true;
        $http({
            method: "GET",
            url: "/api/report/search",
            params: {
                queryStr: queryStr
            }
        }).then(function (res) {
            if (res.data.rows) {
                s.dialogData = res.data.rows;
                s.dashboard.selectedItem.value = res.data.rows.length;
            }
            s.dialogDataLoading = false;
        }, function (err) {
            console.log(err);
            s.dialogDataLoading = false;
        })
    }

    let setGridOptions = function () {
        var w = (window.innerHeight * 2) > window.innerWidth ? window.innerWidth / 2 : window.innerHeight;
        var h = (parseInt(w / 100) * 100);
        var tileWidth = window.innerWidth < 769 ? 'auto' : (h - (h * .10)) / 3;
        s.gridsterOpts = {
            columns: 6,
            minRows: 1,
            maxRows: 5,
            margins: [10, 10],
            outerMargin: false,
            pushing: false,
            floating: true,
            swapping: true,
            draggable: {
                enabled: false
            },
            resizable: {
                enabled: false,
                handles: ['n', 'e', 's', 'w', 'se', 'sw']
            },
            colWidth: tileWidth,
            rowHeight: 'match'
        };

        setTimeout(function () {
            var w = (6 * tileWidth) - (s.gridsterOpts.margins[1] || 0);
            var h = (3 * tileWidth) - (s.gridsterOpts.margins[1] || 0)
            $('#grid').width(w);
            $('.db-header').width(w);
            $('.grid-toolbox').width(w);

            $('.grid-container').width(w);
            $('.grid-container').height(h);

        });
    }

    var getlisttoolbox = function () {
        $http({
            method: "GET",
            url: "/api/widget/getAll"
        }).then(function (res) {
            if (res.data.success) {
                s.gbl.listToolbox = res.data.rows;

                s.getuserwidgets();
            }
        }, function (err) {
            console.log(err);
        });
    }

    s.addWidget = function (ev, item) {
        if (!s.dashboard.isEdit) return;
        var newItem = JSON.parse(JSON.stringify(item));
        if (item.name.toLowerCase() === 'location') {
            dialogsvc.showPrompt("Add Location Widget", "Enter location description", "Description", "Ok", "Cancel", false, "parent", ev).then(function (res) {
                if (res) {
                    s.gbl.widgets.push({
                        id: 0,
                        widgetid: item.widget_id,
                        name: newItem.name,
                        color: newItem.color,
                        subtitle: newItem.subtitle,
                        description: res,
                        value: 0,
                        position: {
                            sizeX: 1,
                            sizeY: 1
                        },
                        is_deleted: item.is_deleted
                    });
                    google.charts.setOnLoadCallback(s.drawLineChart);
                }
            });
        } else {
            s.gbl.widgets.push({
                id: 0,
                widgetid: item.widget_id,
                name: newItem.name,
                color: newItem.color,
                subtitle: newItem.subtitle,
                description: "",
                value: 0,
                position: {
                    sizeX: 1,
                    sizeY: 1
                },
                is_deleted: 0
            });
        }

    };

    s.removeWidget = function (ev, item) {
        item.is_deleted = 1;
    }

    s.displayNotUsed = function (item) {
        let result = s.gbl.widgets.find(obj => obj.name === item.name && obj.is_deleted === 0);
        if (!result || item.name.toLowerCase() === 'location') return item;
    }

    s.cancelEdit = function () {
        if (s.dashboard.isEdit) {
            toggleDashboard(false);
            s.gbl.widgets = s.tempWidgets;
        } else {
            s.gbl.wtoolbxVisible = false;
        }
    }

    s.tempWidgets = [];
    s.editDashboard = function () {
        if (s.dashboard.isEdit) {
            s.dashboard.savingFlag = true;
            s.gridsterOpts.draggable.enabled = false;
            s.gridsterOpts.resizable.enabled = false;
            $http({
                method: "POST",
                url: "/api/widget/update",
                data: {
                    userid: s.gbl.selectedView === 0 ? s.userInfo.profile.oid : s.gbl.selectedObjId,
                    userwidgets: s.gbl.widgets
                }
            }).then(function (res) {
                if (res.data.success) {
                    toggleDashboard(false);
                    google.charts.setOnLoadCallback(s.drawLineChart);
                }
                s.dashboard.savingFlag = false;
            }, function (err) {
                console.log(err);
                s.dashboard.savingFlag = false;
            });
        } else {
            s.tempWidgets = JSON.parse(JSON.stringify(s.gbl.widgets));
            toggleDashboard(true);
        }
    }

    let toggleDashboard = function (_bool) {
        s.gridsterOpts.draggable.enabled = _bool;
        s.gridsterOpts.resizable.enabled = _bool;
        s.dashboard.isEdit = _bool;
    }

    s.drawLineChart = function () {
        var widget = s.gbl.widgets.find(obj => obj.widgetid === s.gbl.widgetchartid);
        if (widget) {
            var head = ["Month"];
            head.push.apply(head, s.devices);
            var data = google.visualization.arrayToDataTable([
                head,
                ["January", 21, 10, 15, 32, 5],
                ["February", 32, 3, 5, 23, 12],
                ["March", 27, 17, 11, 32, 5],
                ["April", 21, 10, 15, 32, 5],
                ["May", 21, 10, 15, 32, 5],
                ["June", 21, 10, 15, 32, 5],
                ["July", 21, 10, 15, 32, 5],
                ["August", 21, 10, 15, 32, 5],
                ["September", 21, 10, 15, 32, 5],
                ["October", 21, 10, 15, 32, 5],
                ["November", 21, 10, 15, 32, 5],
                ["December", 21, 10, 15, 32, 5],
            ]);

            var options = {
                focusTarget: 'category',
                legend: "none",
                colors: s.colors,
                hAxis: {
                    textStyle: {
                        color: "#FFF",
                        fontSize: 12
                    },
                    slantedText: true,
                    slantedTextAngle: 40 // here you can even use 180 
                },
                vAxis: {
                    textStyle: {
                        color: "#FFF"
                    }
                },
                chartArea: {
                    width: '90%',
                    height: '60%'
                },
                backgroundColor: 'transparent'
            };

            var formatter = new google.visualization.NumberFormat({ fractionDigits: 2 });
            formatter.format(data, 1);

            var chart = new google.visualization.LineChart(document.getElementById('lineChart'));

            chart.draw(data, options);
        }
    }

    s.flipWidget = function (event, elem) {
        event.preventDefault();
        if (elem.attributes.widgetid.value.toString() === s.gbl.widgetchartid.toString()) return;
        if (elem.classList.contains("hover")) {
            elem.classList.remove("hover");
        } else {
            elem.classList.add("hover");
        }
    }

    let getAccountGroup = function () {
        $http({
            method: "GET",
            url: "/api/user/accountGroups",
            params: {
                objId: s.userInfo.profile.oid
            }
        }).then(function (res) {
            if (res.data.success) {
                s.gbl.userGroups = res.data.groups;
                // if (s.gbl.userGroups.length <= 0) {
                //     s.logout();
                // }
                setTimeout(function () {
                    fixWidthOfUserViews();
                }, 100);
            }
        }, function (err) {
            console.log(err);
        });
    }

    let fixWidthOfUserViews = function () {
        var elem = $("#user-views");
        if (elem.hasClass('open')) {
            $(elem.children()[2]).width('auto');
            $(elem.children()[2])[0].style.left = "-" + ($(elem.children()[2]).width() + 1) + "px";
        } else {
            $(elem.children()[2]).width(0);
            $(elem.children()[2])[0].style.left = "-300px";
        }
    }

    let init = function () {
        getlisttoolbox();
        getAccountGroup();
        setGridOptions();
    }

    init();

    $(window).resize(function () {
        setTimeout(function () {
            s.$apply(function () {
                s.dashboard.gridToggle = false;
                setGridOptions();
                setTimeout(function () {
                    google.charts.setOnLoadCallback(s.drawLineChart);
                }, 500);
                s.dashboard.gridToggle = true;
            })
        }, 10);

    });
});