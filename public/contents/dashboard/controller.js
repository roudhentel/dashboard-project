mainApp.controller("dashboardCtrl", function ($scope, $http) {
    let s = $scope;
    s.dashboard = {
        smVisible: false,
        header: "Support Monitoring Dashboard",
        isEdit: false,
        savingFlag: false,
        selectedItem: {}
    };

    let setSelectedItem = function (item) {
        s.dashboard.selectedItem = item;
    }

    s.toggleDialog = function (_bool, item) {
        s.dashboard.smVisible = _bool;
        if (item) setSelectedItem(item);
    };

    s.gridsterOpts = {
        columns: 6,
        minRows: 2,
        maxRows: 6,
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
        colWidth: 250,
        rowHeight: 'match'
    };

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
            }
        }, function (err) {
            console.log(err);
        });
    }

    s.addWidget = function (ev, item) {
        if (!s.dashboard.isEdit) return;
        var newItem = JSON.parse(JSON.stringify(item));
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
    };

    s.removeWidget = function (ev, item) {
        s.widgets.splice(s.widgets.indexOf(item), 1);
    }

    s.displayNotUsed = function (item) {
        let result = s.widgets.find(obj => obj.name === item.name);
        if (!result) return item;
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

    let init = function () {
        getlisttoolbox();
    }

    init();

    setTimeout(function () {
        $('#grid').width(1490);
        $('.db-header').width(1490);
        $('.grid-toolbox').width(1490);
    });
});