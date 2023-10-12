import { Sequelize } from "sequelize";
import { sequelize } from "../util/dbconfig.js";

export const Message = sequelize.define(
    'Message',
    {

        content: {
            type: Sequelize.STRING,
            trim: true,
        },

    },
    {
        timestamps: true,

    }
);