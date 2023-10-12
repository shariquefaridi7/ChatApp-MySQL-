import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './util/dbconfig.js';
import userRouter from './routes/userRoute.js';
import chatsRouter from './routes/chatsRoute.js';
import { userData } from './models/userModel.js';
import { Message } from './models/messageModel.js';
import { Chat } from './models/chatModel.js';
import messageRouter from './routes/messageRoute.js';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Routes 

app.use("/", userRouter);
app.use("/chats", chatsRouter);
app.use("/message", messageRouter);


//relation between tables

Message.belongsTo(userData, { as: 'sender', foreignKey: "senderId" });
Message.belongsTo(Chat, { as: "chat", foreignKey: "chatId" });
Message.belongsToMany(userData, { through: "MessageReadBy", as: "readBy" });

Chat.belongsTo(userData, { as: "groupAdmin", foreignKey: "adminId" });
Chat.belongsTo(Message, { as: "latestMessage", foreignKey: "latestmessageId" });
Chat.belongsToMany(userData, { through: "usersChat", as: "users" });

userData.hasMany(Message, { as: "sender", foreignKey: "senderId" });
userData.hasMany(Chat, { as: "groupAdmin", foreignKey: "adminId" });




sequelize.sync({ force: false }).then(() => console.log("DB Connect")).catch((error) => console.log(error))

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Connect 4000")
})