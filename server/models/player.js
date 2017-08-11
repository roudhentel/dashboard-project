'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Player', {
        player_id: { type: DataTypes.INTEGER, primaryKey: true },
        site_id: DataTypes.INTEGER,
        asset_key: DataTypes.STRING,
        serial_num: DataTypes.STRING,
        modem_id: DataTypes.INTEGER,
        type: DataTypes.STRING,
        description: DataTypes.STRING,
        last_online_tv: DataTypes.DATE
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            tableName: 'players'
        });
};
