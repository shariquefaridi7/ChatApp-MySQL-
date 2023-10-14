import { Sequelize } from "sequelize";
import { sequelize } from "../util/dbconfig.js";



export const Chat = sequelize.define(
    'Chat',
    {
        chatName: {
            type: Sequelize.STRING,
            allowNull: true, // Change to true if it's optional
            trim: true,
        },
        isGroupChat: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

    },
    {
        timestamps: true,
        // You can specify the table name if it's different from the model name
    }
);








