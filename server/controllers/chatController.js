import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { userData } from "../models/userModel.js";
import { sequelize } from "../util/dbconfig.js";
import { Op } from "sequelize";


export const accesChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId params not sent with request");
        return res.sendStatus(400);
    }
    console.log(req.userId, userId);

    // check chats exist or not
    try {
        const isChat = await Chat.findOne({
            where: {
                isGroupChat: false,
                id: {
                    [Op.in]: [req.userId, userId], // Check if either req.userId or userId is in the id field
                },
            },
            include: [
                {
                    model: userData,
                    as: "users",

                    attributes: { exclude: ['password'] },
                },
                {
                    model: Message,
                    as: "latestMessage"

                },
            ],
        });

        if (isChat) {
            console.log('Chat already exists:', isChat);
            return res.send(isChat);
        }
        console.log(isChat)

        // Create a new chat if it doesn't exist
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
        };

        // Create the chat
        const createdChat = await Chat.create(chatData);

        // Add users to the chat
        await createdChat.addUsers([req.userId, userId]);

        // Fetch the full chat including users
        const fullChat = await Chat.findByPk(createdChat.id, {
            include: [
                {
                    model: userData,
                    as: 'users',
                    attributes: { exclude: ['password'] },
                },
            ],
        });

        console.log('Chat created successfully:', fullChat);
        res.status(200).json(fullChat);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
    }

}

//get all chats

export const getChats = async (req, res) => {
    try {
        const results = await Chat.findAll({

            include: [
                {
                    model: userData,
                    as: 'users',
                    attributes: { exclude: ['password'] },
                    where: {
                        id: req.userId
                    },

                },
                {
                    model: userData,
                    as: 'groupAdmin',
                    attributes: { exclude: ['password'] },
                },
                {
                    model: Message,
                    as: 'latestMessage',
                    include: [
                        {
                            model: userData,
                            as: 'sender',
                            attributes: ['name', 'pic', 'email'],
                        },
                    ],
                },
            ],
            order: [['updatedAt', 'DESC']], // Order by 'updatedAt' in descending order
        });

        let chatIds = results.map((chat) => chat.id);


        const data = await Chat.findAll({


            where: {
                id: chatIds, // Filter by the specific chatIds
            },


            include: [
                {
                    model: userData,
                    as: 'users',
                    attributes: { exclude: ['password'] },
                },
                {
                    model: userData,
                    as: 'groupAdmin',
                    attributes: { exclude: ['password'] },
                },
                {
                    model: Message,
                    as: 'latestMessage',
                    include: [
                        {
                            model: userData,
                            as: 'sender',
                            attributes: ['name', 'pic', 'email'],
                        },
                    ],
                },
            ],
            order: [['updatedAt', 'DESC']], // Order by 'updatedAt' in descending order
        });



        res.status(200).send(data);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad Request' });
    }


};

export const createGroupChat = async (req, res) => {

    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }


    console.log(req.userId)
    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.userId);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            adminId: req.userId,
        });

        await groupChat.addUsers(users);

        const fullGroupChat = await Chat.findByPk(groupChat.id, {
            include: [
                {
                    model: userData,
                    as: 'users',
                    attributes: { exclude: ['password'] },
                },
                {
                    model: userData,
                    as: 'groupAdmin',
                    attributes: { exclude: ['password'] },
                },
            ],
        });

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    try {
        const [updatedCount] = await Chat.update(
            {
                chatName: chatName,
            },
            {
                where: { id: chatId },
            }
        );

        if (updatedCount === 0) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            const updatedChat = await Chat.findByPk(chatId, {
                include: [
                    {
                        model: userData,
                        as: 'users',
                        attributes: { exclude: ['password'] },
                    },
                    {
                        model: userData,
                        as: 'groupAdmin',
                        attributes: { exclude: ['password'] },
                    },
                ],
            });

            res.json(updatedChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};


export const removeFromGroup = async (req, res) => {

    const { chatId, userId } = req.body;

    try {
        // Fetch the chat by chatId
        const chat = await Chat.findByPk(chatId);

        if (!chat) {
            res.status(404);
            throw new Error("Chat Not Found");
        }

        // Remove the user from the chat
        await chat.removeUser(userId);

        // If there are no users left in the chat, you can delete the chat
        const remainingUsers = await chat.getUsers();
        if (remainingUsers.length === 0) {
            await chat.destroy(); // Delete the chat
            res.status(204).send(); // No Content response
        } else {
            // Fetch the updated chat
            const updatedChat = await Chat.findByPk(chatId, {
                include: [
                    {
                        model: userData,
                        as: 'users',
                        attributes: { exclude: ['password'] },
                    },
                    {
                        model: userData,
                        as: 'groupAdmin',
                        attributes: { exclude: ['password'] },
                    },
                ],
            });

            res.json(updatedChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};



export const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        // Fetch the chat by chatId
        const chat = await Chat.findByPk(chatId);
        console.log(chat)

        if (!chat) {
            res.status(404);
            throw new Error("Chat Not Found");
        }

        // Check if the requester is an admin (You need to implement this check)
        const isRequesterAdmin = req.userId === chat.adminId;

        if (!isRequesterAdmin) {
            res.status(403); // Forbidden
            throw new Error("You are not authorized to add users to this chat.");
        }

        // Add the user to the chat
        await chat.addUser(userId);

        // Fetch the updated chat
        const updatedChat = await Chat.findByPk(chatId, {
            include: [
                {
                    model: userData,
                    as: 'users',
                    attributes: { exclude: ['password'] },
                },
                {
                    model: userData,
                    as: 'groupAdmin',
                    attributes: { exclude: ['password'] },
                },
            ],
        });

        res.json(updatedChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};


