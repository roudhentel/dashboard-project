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

    db.Player.belongsTo(db.Site, {
        foreignKey: 'site_id'
    });

    db.Modem.belongsTo(db.Site, {
        foreignKey: 'site_id'
    });

    router.get('/ncm-count', function (req, res) {
        db.NcmReport.count({
            // attributes: [
            //     [db.sequelize.literal("COUNT(DISTINCT(modem_id))"), "count"]
            // ],
            include: [{
                all: true,
                nested: true
            }],
            where: {
                // time: {
                //     $lt: db.sequelize.fn('NOW'),
                //     $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                // },
                time: { $in: db.sequelize.literal("(SELECT MAX(ncm_reports.time) FROM ncm_reports)") },
                $not: [
                    { status: 'online' }
                ],
                $and: [
                    { $not: [{ '$Modem.site_id$': null }] }
                ]
            }
        })
            .then(count => res.status(200).json({ count: count }))
            .catch(error => res.status(400).json(error));
    });

    router.get('/ncm', function (req, res) {
        db.NcmReport.findAndCountAll({
            include: [{
                all: true,
                nested: true
            }],
            where: {
                // time: {
                //     $lt: db.sequelize.fn('NOW'),
                //     $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                // },
                time: { $in: db.sequelize.literal("(SELECT MAX(ncm_reports.time) FROM ncm_reports)") },
                $not: [
                    { status: 'online' }
                ],
                $and: [
                    { $not: [{ '$Modem.site_id$': null }] }
                ]
            },
            order: [["modem_id", "ASC"]]
        })
            .then(users => res.status(200).json(users))
            .catch(error => res.status(400).json(error));
    });

    router.get('/appspace-count', function (req, res) {
        db.AppspaceReport.count({
            include: [{
                all: true,
                nested: true
            }],
            where: {
                // time: {
                //     $lt: db.sequelize.fn('NOW'),
                //     $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                // },
                time: { $in: db.sequelize.literal("(SELECT MAX(appspace_reports.time) FROM appspace_reports)") },
                $not: [
                    { status: 'online' }
                ],
                $and: [
                    { $not: [{ '$Player.site_id$': null }] }
                ]
            }
        })
            .then(count => res.status(200).json({ count: count }))
            .catch(error => res.status(400).json(error));
    });

    router.get('/appspace', function (req, res) {
        db.AppspaceReport.findAndCountAll({
            include: [{
                all: true,
                nested: true
            }],
            where: {
                // time: {
                //     $lt: db.sequelize.fn('NOW'),
                //     $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                // },
                time: { $in: db.sequelize.literal("(SELECT MAX(appspace_reports.time) FROM appspace_reports)") },
                $not: [
                    { status: 'online' }
                ],
                $and: [
                    { $not: [{ '$Player.site_id$': null }] }
                ]
            },
            order: [["player_id", "ASC"]]
        })
            .then(reports => res.status(200).json(reports))
            .catch(error => res.status(400).json(error));
    });

    router.get('/search', function (req, res) {
        let queryStr = req.query.queryStr;
        queryStr = queryStr ? queryStr.toString().toLowerCase() : "";
        db.NcmReport.findAll({
            include: [{
                all: true,
                nested: true
            }],
            where: {
                // time: {
                //     $lt: db.sequelize.fn('NOW'),
                //     $gt: db.sequelize.literal("NOW() - INTERVAL '15:0' MINUTE_SECOND")
                // },
                time: { $in: db.sequelize.literal("(SELECT MAX(ncm_reports.time) FROM ncm_reports)") },
                $not: [
                    { status: 'online' }
                ],
                $and: [
                    { $not: [{ '$Modem.site_id$': null }] }
                ]
            },
            order: [["modem_id", "ASC"]]
        })
            .then(result => {
                var filteredResult = result.filter(obj => {
                    if ((obj.Modem && obj.Modem.serial_number.toLowerCase().indexOf(queryStr) > -1) ||
                        (obj.Modem && obj.Modem.Site && 
                            (obj.Modem.Site.name.toLowerCase().indexOf(queryStr) > -1 ||
                            (obj.Modem.Site.address || "").toLowerCase().indexOf(queryStr) > -1 ||
                            (obj.Modem.Site.postcode || "").toLowerCase().indexOf(queryStr) > -1))
                    ) {
                        return obj;
                    }
                });
                res.status(200).json({ rows: filteredResult });
            })
            .catch(error => res.status(400).json(error));
    });

    return router;
}

module.exports = ReportRoutes();