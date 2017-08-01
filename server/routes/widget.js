let express = require('express');
let widgetsvc = require('../services/widget');

function WidgetRoutes() {
    let router = express.Router();

    router.get('/getAll', function (req, res) {
        widgetsvc.getAll([], function (result, error) {
            if (!error) {
                res.status(result.status).json(result.data);
            } else {
                res.status(error.status).json(error.data);
            }
        });
    });

    router.post('/update', function (req, res) {
        let userid = req.body.userid;
        let userwidgets = req.body.userwidgets;

        updateUserWidgets(userid, userwidgets, 0, res);
    });

    var updateUserWidgets = function (userid, widgets, idx, res) {
        if (idx < widgets.length) {
            if (widgets[idx].id === 0) {
                // add new
                widgetsvc.add([
                    userid,
                    widgets[idx].widgetid,
                    widgets[idx].description,
                    widgets[idx].position.sizeX,
                    widgets[idx].position.sizeY,
                    widgets[idx].position.row,
                    widgets[idx].position.col
                ], function (result, error) {
                    if (error) res.status(500).json({ success: false });

                    updateUserWidgets(userid, widgets, ++idx, res);
                })
            } else {
                // update existing
                widgetsvc.edit([
                    widgets[idx].id,
                    widgets[idx].description,
                    widgets[idx].position.sizeX,
                    widgets[idx].position.sizeY,
                    widgets[idx].position.row,
                    widgets[idx].position.col
                ], function (result, error) {
                    if (error) res.status(500).json({ success: false });

                    updateUserWidgets(userid, widgets, ++idx, res);
                });
            }
        } else {
            res.status(200).json({ success: true });
        }
    }

    return router;
}

module.exports = WidgetRoutes();