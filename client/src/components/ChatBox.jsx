import { ChatState } from './Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ setFetchAgain, fetchAgain }) => {

    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            h="100vh"
            m={2}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
        </Box>
    )
}

export default ChatBox