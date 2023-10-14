import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DB, process.env.USERDB, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: "mysql"
})