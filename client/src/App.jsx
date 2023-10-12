import { Route, Routes } from 'react-router-dom'
import "./App.css";
import Form from './pages/Home'
import ChatPage from './pages/ChatPage';

function App() {
    return (
        <div className='App'>


            <Routes>

                <Route path='/' element={<Form />} />
                <Route path='/chats' element={<ChatPage />} />

            </Routes>

        </div>
    )
}

export default App
