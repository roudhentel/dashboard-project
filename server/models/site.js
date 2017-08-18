'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Site', {
        site_id: { type: DataTypes.INTEGER, primaryKey: true },
        client_id: DataTypes.INTEGER,
        simpro_id: DataTypes.STRING,
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        suburb: DataTypes.STRING,
        state: DataTypes.STRING,
        postcode: DataTypes.STRING,
        country: DataTypes.STRING,
        contact_name: DataTypes.STRING,
        phone_num: DataTypes.STRING,
        mobile_num: DataTypes.STRING,
        email: DataTypes.STRING,
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            tableName: 'sites'
        });
};
