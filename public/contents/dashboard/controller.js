mainApp.controller("dashboardCtrl", function ($scope) {
    let s = $scope;
    s.dashboard = {
        smVisible: false,
        header: "Support Monitoring Dashboard",
        isEdit: false
    };

    s.toggleDialog = function (_bool) {
        s.dashboard.smVisible = _bool;
    };

    $scope.gridsterOpts = {
        columns: 6,
        minRows: 2,
        maxRows: 6,
        margins: [10, 10],
        outerMargin: false,
        pushing: false,
        floating: true,
        swapping: true,
        draggable: {
            enabled: true
        },
        resizable: {
            enabled: true,
            handles: ['n', 'e', 's', 'w', 'se', 'sw']
        },
        colWidth: 250,
        rowHeight: 'match'
    };

    s.listToolbox = [
        {
            name: "Network",
            color: "corange",
            subtitle: "Site Requiring Attention",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "DMP",
            color: "cdorange",
            subtitle: "Site Requiring Attention",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Appspace",
            color: "cpink",
            value: 0,
            subtitle: "Site Requiring Attention",
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Total Site Issues Per Month",
            color: "",
            subtitle: "",
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Panel",
            color: "cgreen",
            value: 0,
            subtitle: "Site Requiring Attention",
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Local PC",
            color: "cviolet",
            subtitle: "Site Requiring Attention",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Other",
            color: "cdefault",
            subtitle: "Site Requiring Attention",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Total Sites Monitored",
            color: "cdefault",
            subtitle: "",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Sites Requiring Attention",
            color: "cdefault",
            subtitle: "",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        },
        {
            name: "Location",
            color: "cdefault",
            subtitle: "Site Requiring Attention",
            value: 0,
            position: { sizeX: 1, sizeY: 1 }
        }
    ]

    // these map directly to gridsterItem options
    s.widgets = [
        {
            name: "Network",
            color: "corange",
            subtitle: "Site Requiring Attention",
            value: 15,
            position: { sizeX: 1, sizeY: 1, row: 0, col: 0 }
        },
        {
            name: "DMP",
            color: "cdorange",
            subtitle: "Site Requiring Attention",
            value: 18,
            position: { sizeX: 1, sizeY: 1, row: 0, col: 1 }
        },
    ];

    s.addWidget = function (ev, item) {
        if (!s.dashboard.isEdit) return;
        var newItem = JSON.parse(JSON.stringify(item));
        s.widgets.push(newItem);
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
            s.dashboard.isEdit = false;
            s.widgets = s.tempWidgets;
        } else {
            s.gbl.wtoolbxVisible = false;
        }
    }

    s.tempWidgets = [];
    s.editDashboard = function () {
        if (s.dashboard.isEdit) {
            s.dashboard.isEdit = false;
        } else {
            s.tempWidgets = JSON.parse(JSON.stringify(s.widgets));
            s.dashboard.isEdit = true;
        }
    }

    setTimeout(function () {
        $('#grid').width(1490);
        $('.db-header').width(1490);
        $('.grid-toolbox').width(1490);
    });
});