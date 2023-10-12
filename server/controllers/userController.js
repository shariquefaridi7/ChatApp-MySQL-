import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userData } from "../models/userModel.js";
import dotenv from 'dotenv';
import { sequelize } from '../util/dbconfig.js';
import { Op } from 'sequelize';

dotenv.config();



export const signupData = async (req, res) => {

    const { name, email, password, confirmPass, pic } = req.body;


    // check user is exist or not.

    const userCheck = await userData.findOne({ where: { email } });

    if (!name || !email || !password || !confirmPass) {
        return res.json({ message: "Please Fill All Fields" })
    } else {
        if (userCheck) {
            return res.json({ message: "User Already Exist !!" });
        } else {

            // hash the password for safety.
            if (password != confirmPass) {
                return res.json({ message: "Password Not Matched !!" });
            } else {

                const hashPassword = await bcrypt.hash(password, 12);



                const resp = await userData.create({ name, password: hashPassword, email, pic });
                const id = resp.id;

                // generate token for authentication
                const token = jwt.sign({ email, id }, process.env.SECRET, { expiresIn: "7d" });

                res.status(200).send({ resp, token });
            }
        }

    }

}

export const signinData = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ message: "Please Fill All Fields" })
    } else {
        const resp = await userData.findOne({ where: { email } });
        const hashPassword = resp.dataValues.password;
        const checkPassword = await bcrypt.compare(password, hashPassword);


        if (checkPassword) {

            const id = resp.id;

            // generate token for authentication
            const token = jwt.sign({ email, id }, process.env.SECRET, { expiresIn: "7d" });

            res.status(200).send({ token, resp })


        } else {
            return res.json({ message: "Email or Password Are Not Matched" });
        }

    }

}


export const getalluser = async (req, res) => {
    const { search } = req.query;


    try {
        const whereClause = search
            ? {
                [Op.or]: [
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('name')),
                        'LIKE',
                        `%${search.toLowerCase()}%`
                    ),
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('email')),
                        'LIKE',
                        `%${search.toLowerCase()}%`
                    ),
                ],
                id: { [Op.ne]: req.userId }, // Exclude the current user
            }
            : { id: { [Op.ne]: req.userId } };
        console.log(whereClause);
        // Fetch users based on the where clause
        const users = await userData.findAll({
            where: whereClause,
            attributes: { exclude: ['password'] }, // Exclude the 'password' attribute
        });

        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }

}

