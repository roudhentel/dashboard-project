'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AppspaceReport', {
        app_report_id: { type: DataTypes.INTEGER, primaryKey: true },
        player_id: DataTypes.INTEGER,
        time: DataTypes.DATE,
        status: DataTypes.STRING,
        last_online: DataTypes.DATE
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            tableName: 'appspace_reports'
        });
};
