let dbservice = require('./database');

function WidgetService() {
    var widgetserv = {
        getAll: function (params, callback) {
            dbservice.executeSelectProcedure("dashboard.widgets_get", params, function (result, error) {
                callback(result, error);
            });
        },
        add: function (params, callback) {
            dbservice.executeAddProcedure("dashboard.user_widgets_add", params, function (result, error) {
                callback(result, error);
            });
        },
        edit: function (params, callback) {
            dbservice.executeEditProcedure("dashboard.user_widgets_edit", params, function (result, error) {
                callback(result, error);
            });
        }
    };

    return widgetserv;
}

module.exports = WidgetService();