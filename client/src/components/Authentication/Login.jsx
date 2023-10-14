import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({

        email: "",
        password: "",


    })



    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const resp = await axios.post("https://chatappbackend-uxzo.onrender.com/signin", { password: userData.password, email: userData.email, });
        if (resp.data.message) {
            toast({
                title: resp.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"

            });
            setLoading(false);
        } else {
            localStorage.setItem('userInfo', JSON.stringify(resp.data.resp))
            localStorage.setItem('token', JSON.stringify(resp.data.token))

            toast({
                title: "Login Succesful",
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top"

            });
            setLoading(false);
            navigate("/chats");


        }


    }


    return (
        <VStack spacing='5px'>


            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' onChange={handleChange} name="email" value={userData.email} />
            </FormControl>

            <FormControl isRequired id='password' >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder='Enter Your Password' onChange={handleChange} name="password" value={userData.password} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
                isLoading={loading}>
                Login
            </Button>
            <Button
                variant='solid'
                colorScheme="red"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={() => {
                    setUserData({ email: "guest@example.com", password: "123456" })
                }}>
                Get Guest User Credentials
            </Button>
        </VStack>

    )
}

export default Login
