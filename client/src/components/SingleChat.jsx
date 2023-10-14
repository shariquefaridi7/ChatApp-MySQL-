import { FormControl, IconButton, Input, Spinner } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { ChatState } from "./Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/ChatLogic";
import ProfileModal from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModel";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import "./style.css"
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';
import animationData from "./Animation/typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { user, selectedChat, setSelectedChat, token, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnect, setSocketConnect] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);


    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `https://chatappbackend-uxzo.onrender.com/message/${selectedChat.id}`,
                config
            );
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat.id)


            console.log(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {

        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnect(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])


    useEffect(() => {
        socket.on('message is recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare.id != newMessageRecieved.chat.id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }

            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat.id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "https://chatappbackend-uxzo.onrender.com/message",
                    {
                        content: newMessage,
                        chatId: selectedChat.id,
                    },
                    config
                );

                console.log(data);



                socket.emit("new message", data);

                setMessages([...messages, data]);
                setFetchAgain(!fetchAgain)
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typeHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnect) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat.id);

        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat.id);
                setTyping(false)
            }
        }, timerLength)



    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"

                        >

                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")} />

                            {
                                (!selectedChat.isGroupChat) ? (
                                    <>

                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>

                                        {selectedChat.chatName.toUpperCase()}
                                        {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}

                                    </>
                                )
                            }

                        </Text>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <div className="message">
                                    <ScrollableChat messages={messages} />
                                </div>
                            )


                            }

                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                {isTyping ? <div >
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}

                                        style={{ marginBottom: 15, marginLeft: 0, size: "10px" }}

                                    />

                                </div> : ""}
                                <Input variant="filled" bg="#E0E0E0" placeholder='Enter a message' onChange={typeHandler} value={newMessage} />
                            </FormControl>


                        </Box>

                    </>

                ) : (
                    <Box
                        display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
                            Click on user to start chatting
                        </Text>
                    </Box>
                )
            }






        </>

    )





}

export default SingleChat;
