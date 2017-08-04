mainApp.controller("dashboardCtrl", function ($scope, $http, Dialog, adalAuthenticationService) {
    let s = $scope;
    let dialogsvc = new Dialog();
    s.dashboard = {
        smVisible: false,
        header: "Support Monitoring Dashboard",
        isEdit: false,
        savingFlag: false,
        selectedItem: {},
        gridToggle: true
    };

    let setSelectedItem = function (item) {
        s.dashboard.selectedItem = item;
    }

    s.toggleDialog = function (_bool, item) {
        s.dashboard.smVisible = _bool;
        if (item) setSelectedItem(item);
    };

    let setGridOptions = function () {
        var w = (window.innerHeight * 2) > window.innerWidth ? window.innerWidth / 2 : window.innerHeight;
        var h = (parseInt(w / 100) * 100);
        var tileWidth = (h - (h * .10)) / 3;
        s.gridsterOpts = {
            columns: 6,
            minRows: 1,
            maxRows: 3,
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
            $('#grid').width(w);
            $('.db-header').width(w);
            $('.grid-toolbox').width(w);
        });
    }



    s.listToolbox = [];

    var getlisttoolbox = function () {
        $http({
            method: "GET",
            url: "/api/widget/getAll"
        }).then(function (res) {
            if (res.data.success) {
                s.listToolbox = res.data.rows;

                getuserwidgets();
            }
        }, function (err) {
            console.log(err);
        });
    }

    s.widgets = [];
    var getuserwidgets = function () {
        $http({
            method: "GET",
            url: "/api/user/getwidgets",
            params: {
                userid: 1
            }
        }).then(function (res) {
            if (res.data.success) {
                var userwidgets = res.data.rows;
                userwidgets.forEach(item => {
                    var tool = s.listToolbox.find(obj => obj.widget_id === item.widgetid);
                    if (tool) {
                        s.widgets.push({
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
                            }
                        });
                    }

                });
                google.charts.setOnLoadCallback(s.drawLineChart);

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
                    s.widgets.push({
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
                        }
                    });
                    google.charts.setOnLoadCallback(s.drawLineChart);
                }
            });
        } else {
            s.widgets.push({
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
                }
            });
        }

    };

    s.removeWidget = function (ev, item) {
        s.widgets.splice(s.widgets.indexOf(item), 1);
    }

    s.displayNotUsed = function (item) {
        let result = s.widgets.find(obj => obj.name === item.name);
        if (!result || item.name.toLowerCase() === 'location') return item;
    }

    s.cancelEdit = function () {
        if (s.dashboard.isEdit) {
            toggleDashboard(false);
            s.widgets = s.tempWidgets;
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
                    userid: 1,
                    userwidgets: s.widgets
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
            s.tempWidgets = JSON.parse(JSON.stringify(s.widgets));
            toggleDashboard(true);
        }
    }

    let toggleDashboard = function (_bool) {
        s.gridsterOpts.draggable.enabled = _bool;
        s.gridsterOpts.resizable.enabled = _bool;
        s.dashboard.isEdit = _bool;
    }

    s.colors = ['#D37637', '#CE4C3A', '#D62885', '#54D166', '#5968D3'];
    s.devices = ['Network', 'DMP', 'Apss', 'Panel', 'Local PC'];
    s.drawLineChart = function () {
        var widget = s.widgets.find(obj => obj.widgetid === s.gbl.widgetchartid);
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
                console.log(res.data.groups);
            }
        }, function (err) {
            console.log(err);
        });
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
                setTimeout(function() {
                    google.charts.setOnLoadCallback(s.drawLineChart);    
                }, 500);
                s.dashboard.gridToggle = true;
            })
        }, 10);

    });
});