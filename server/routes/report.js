let express = require('express');
let db = require('../models/');

function ReportRoutes() {
    let router = express.Router();

    db.NcmReport.belongsTo(db.Modem, {
        foreignKey: 'modem_id'
    });

    db.AppspaceReport.belongsTo(db.Player, {
        foreignKey: 'player_id'
    });

    db.Player.belongsTo(db.Modem, {
        foreignKey: 'modem_id'
    })

    router.get('/ncm-count', function (req, res) {
        db.NcmReport.findAll({
            attributes: [
                [db.sequelize.literal("COUNT(DISTINCT(modem_id))"), "count"]
            ],
            where: {
                time: {
                    $lt: db.sequelize.fn('NOW'),
                    $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                }
            },
            order: [["modem_id", "ASC"]]
        })
            .then(users => res.status(200).json(users[0]))
            .catch(error => res.status(400).json(error));
    });

    router.get('/ncm', function (req, res) {
        db.NcmReport.findAndCountAll({
            include: [{
                // model: Modem,
                // where: {},
                // paranoid: false
                all: true,
                nested: true
            }],
            where: {
                time: {
                    $lt: db.sequelize.fn('NOW'),
                    $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                }
            },
            order: [["modem_id", "ASC"]]
        })
            .then(users => res.status(200).json(users))
            .catch(error => res.status(400).json(error));
    });

    router.get('/appspace-count', function (req, res) {
        db.AppspaceReport.count({
            where: {
                time: {
                    $lt: db.sequelize.fn('NOW'),
                    $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                }
            },
            order: [["player_id", "ASC"]]
        })
            .then(users => res.status(200).json({ count: users }))
            .catch(error => res.status(400).json(error));
    });

    router.get('/appspace', function (req, res) {
        db.AppspaceReport.findAndCountAll({
            include: [{
                all: true,
                nested: true
            }],
            where: {
                time: {
                    $lt: db.sequelize.fn('NOW'),
                    $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                }
            },
            order: [["player_id", "ASC"]]
        })
            .then(reports => res.status(200).json(reports))
            .catch(error => res.status(400).json(error));
    });

    return router;
}

module.exports = ReportRoutes();