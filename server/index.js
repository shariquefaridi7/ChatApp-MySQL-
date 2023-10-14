import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './util/dbconfig.js';
import userRouter from './routes/userRoute.js';
import chatsRouter from './routes/chatsRoute.js';
import { userData } from './models/userModel.js';
import { Message } from './models/messageModel.js';
import { Chat } from './models/chatModel.js';
import messageRouter from './routes/messageRoute.js';
import cors from 'cors';
import { Server } from 'socket.io';

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




sequelize.sync().then(() => console.log("DB Connect")).catch((error) => console.log(error))

const connection = app.listen(process.env.PORT || 4000, () => {
    console.log("Server Connect 4000")
})


const io = new Server(connection, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chattingapp-96g6.onrender.com",
        // credentials: true,
    },
});


io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData.id);
        console.log(userData.id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room :" + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users is not define");
        chat.users.forEach(user => {
            if (user.usersChat.userId == newMessageRecieved.senderId) return;


            socket.in(user.usersChat.userId).emit("message is recieved", newMessageRecieved);

        })


    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData.id);
    });


})
