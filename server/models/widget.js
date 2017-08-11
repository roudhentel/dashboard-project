'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Widget', {
        widget_id: { type: DataTypes.INTEGER, primaryKey: true },
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        subtitle: DataTypes.STRING
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            tableName: 'widgets'
        });
};
