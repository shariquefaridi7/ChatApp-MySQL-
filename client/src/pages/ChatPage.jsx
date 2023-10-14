import { Box } from '@chakra-ui/react'
import { useState } from 'react';
import { ChatState } from "../components/Context/ChatProvider";
import SideDrawer from '../components/SideDrawer';
import MyChat from '../components/MyChat';
import ChatBox from '../components/ChatBox';
const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                w="100%"
                h="91.5"

                style={{ display: "flex", justifyContent: 'space-between' }}
            >
                {user && <MyChat fetchAgain={fetchAgain} />}
                {user && <ChatBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage;