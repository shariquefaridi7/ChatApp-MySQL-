import { Container, Box, Text, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Form = () => {
    return (
        <>
            <Container maxW='xl' centerContent>
                <Box display="flex"
                    justifyContent='center'
                    p={3}
                    bg={"white"}
                    w="100%"
                    m="20px 0 15px 0"
                    borderRadius="lg"
                    borderWidth='1px'
                    color="black"
                    border="1px solid black"


                >
                    <Text fontFamily='Work sans' fontSize='3xl'>ChatApp</Text>

                </Box>

                <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' color='black'>
                    <Tabs variant='soft-rounded' >
                        <TabList mb='1em'>
                            <Tab width='50%'>Login</Tab>
                            <Tab width='50%'>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Login />
                            </TabPanel>
                            <TabPanel>
                                <Signup />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>


            </Container>

        </>
    )
}

export default Form
