'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('NcmReport', {
        ncm_reports_id: { type: DataTypes.INTEGER, primaryKey: true },
        modem_id: DataTypes.INTEGER,
        time: DataTypes.DATE,
        status: DataTypes.STRING,
        last_status_change: DataTypes.DATE,
        signal_strength: DataTypes.STRING
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            tableName: 'ncm_reports'
        });
};
