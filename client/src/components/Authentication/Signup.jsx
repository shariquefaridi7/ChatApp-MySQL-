import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const Signup = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPass: "",
        pic: ""

    });


    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const PostPic = async (pics) => {
        setLoading(true)
        if (pics == undefined) {
            toast({
                title: "Please Select Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"

            });
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");

            try {
                const resp = await axios.post("https://api.cloudinary.com/v1_1/sharique/image/upload", data);
                console.log(resp.data.url)
                setUserData((prev) => {
                    return {
                        ...prev,
                        pic: resp.data.url
                    }
                })
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        } else {
            toast({
                title: "Please Select Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"

            });
            setLoading(false)
            return;
        }
    }




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
        setLoading(true)
        const resp = await axios.post("https://chatappbackend-uxzo.onrender.com/signup", { name: userData.name, password: userData.password, confirmPass: userData.confirmPass, email: userData.email, pic: userData.pic });
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
                title: "SignUp Succesful",
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top"

            });
            setLoading(false);
            navigate("/chats")

        }

    }


    return (
        <VStack spacing='5px'>
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name' onChange={handleChange} name="name" value={userData.name} />
            </FormControl>

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


            <FormControl isRequired id='confirmPass'>
                <FormLabel> Confirm Password  </FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder="Enter Your Confirm password" onChange={handleChange} name="confirmPass" value={userData.confirmPass} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl>
                <FormLabel>Upload Your Picture </FormLabel>
                <Input type="file" p={1.5} accept="image/*" onChange={(e) => PostPic(e.target.files[0])} />
            </FormControl>

            <Button colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
                isLoading={loading}

            >
                Sign Up
            </Button>
        </VStack>

    )
}

export default Signup
