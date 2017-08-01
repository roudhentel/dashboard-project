let dbservice = require('./database');

function UserService() {
    var userserv = {
        getUserWidgets: function (params, callback) {
            dbservice.executeSelectProcedure("dashboard.user_widgets_get", params, function (result, error) {
                callback(result, error);
            });
        }
    };

    return userserv;
}

module.exports = UserService();