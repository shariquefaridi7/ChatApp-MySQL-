import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from './components/Context/ChatProvider';
import { BrowserRouter } from 'react-router-dom';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
  ,
)
