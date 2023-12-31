import { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider';
import { AddIcon } from "@chakra-ui/icons";
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from './config/ChatLogic';

import GroupChatModal from './GroupChatModel';

const MyChat = ({ fetchAgain }) => {

    const { selectedChat, setSelectedChat, chats, setChats, token } = ChatState();
    const [loggedUser, setLoggedUser] = useState();
    const toast = useToast();

    const fetchChats = async () => {

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`https://chatappbackend-uxzo.onrender.com/chats`, config);

            setChats(data);
            console.log(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };


    useEffect(() => {

        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();

    }, [fetchAgain]);

    return (

        <>

            <Box
                display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                flexDirection="column"
                alignItems="center"
                p={3}
                m={2}

                bg="white"
                w={{ base: "100%", md: "31%" }}
                borderRadius="lg"
                borderWidth="1px"
                h="100vh"
            >
                <Box

                    pb={3}
                    px={3}
                    fontSize={{ base: "28px", md: "30px" }}
                    fontFamily="Work sans"
                    display="flex"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    My Chat
                    <GroupChatModal>
                        <Button
                            display="flex"
                            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                            rightIcon={<AddIcon />}
                        >
                            New Group Chat
                        </Button>
                    </GroupChatModal>
                </Box>

                <Box
                    display="flex"
                    flexDirection="column"
                    p={3}
                    bg="#F8F8F8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"

                >

                    {chats?.length > 0 ? (
                        <Stack overflowY="scroll">
                            {chats.map((chat) => (
                                <Box

                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat.id}
                                >
                                    <Text style={{ color: "black" }}>

                                        {!chat.isGroupChat ? (
                                            getSender(loggedUser, chat.users)
                                        ) :

                                            <b> {chat.chatName}</b>



                                        }
                                    </Text>
                                    <Text style={{ color: "black" }}>
                                        {
                                            chat.isGroupChat ? (chat.latestMessage ? <span><b>{chat.latestMessage.sender.name}</b>{" : "}{chat.latestMessage.content}</span> : <></>) : (<span>{chat.latestMessage?.content}</span>)
                                        }

                                    </Text>
                                </Box>
                            ))}
                        </Stack>

                    ) : (<ChatLoading />)}

                </Box>








            </Box>

        </>
    )
}

export default MyChat
