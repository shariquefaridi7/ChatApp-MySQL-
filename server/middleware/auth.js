import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


const authen = async (req, res, next) => {

    try {

        let token = req.headers.authorization.split(" ")[1];
        let isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.SECRET);

            req.userId = decodedData?.id;

        } else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;

        }

        console.log(`auth ${req.userId}`)
        next();

    } catch (error) {

        res.send({ message: "invalid token request..." })
    }
};

export default authen;