import { Sequelize } from "sequelize";
import { sequelize } from "../util/dbconfig.js";

export const userData = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pic: {
        type: Sequelize.STRING,
        allowNull: false
    },
})