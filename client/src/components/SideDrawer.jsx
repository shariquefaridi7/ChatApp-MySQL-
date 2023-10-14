import { useState } from 'react';
import {
    Box,
    Button,
    Text,
    Tooltip,
    Menu,
    MenuButton,
    Avatar,
    MenuList,
    MenuItem,
    MenuDivider,
    Drawer,
    Input,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,

} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { ChatState } from './Context/ChatProvider';
import ProfileModal from '../components/ProfileModel'
import { useNavigate } from 'react-router-dom';
import { useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import axios from "axios";
import ChatLoading from './ChatLoading';
import UserListItem from './UserAvatar/UserListItem';
import { getSender } from './config/ChatLogic';
import NotificationBadge, { Effect } from 'react-notification-badge'


const SideDrawer = () => {
    const navigate = useNavigate();
    const { user, setSelectedChat, chats, setChats, token, notification, setNotification } = ChatState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    // Initialize the toast
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`https://chatappbackend-uxzo.onrender.com/allusers?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`https://chatappbackend-uxzo.onrender.com/chats/`, { userId }, config);


            if (!chats.find((c) => c.id === data.id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }



    return (
        <>
            <Box
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <SearchIcon />
                        <Text d={{ md: 'flex', base: 'none' }} marginLeft={2}>  Search</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Chatup
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
                    <DrawerBody>
                        <Box style={{ display: "flex" }} pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (<ChatLoading />) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user.id}
                                    user={user}
                                    handleFunction={() => accessChat(user.id)}
                                />
                            ))
                        )}

                        {loadingChat && <Spinner ml="auto" style={{ display: "flex" }} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
