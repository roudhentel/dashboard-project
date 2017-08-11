'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Modem', {
        modem_id: { type: DataTypes.INTEGER, primaryKey: true },
        site_id: DataTypes.INTEGER,
        serial_number: DataTypes.STRING
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            tableName: 'modems'
        });
};
