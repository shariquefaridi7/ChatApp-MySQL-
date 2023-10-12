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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat, token } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");


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
                `http://localhost:4000/message/${selectedChat.id}`,
                config
            );
            setMessages(data);
            setLoading(false);


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

    }, [selectedChat]);


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {

            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:4000/message",
                    {
                        content: newMessage,
                        chatId: selectedChat.id,
                    },
                    config
                );

                console.log(data);




                setMessages([...messages, data]);
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
                                        {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

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
                            ) :

                                <h1>jjj</h1>
                            }

                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>

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