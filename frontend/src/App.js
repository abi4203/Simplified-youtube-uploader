import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import RegistrationForm from './components/Registration';
import ConfirmationPage from './components/Confirmation';
import HomePage from './pages/Home';
import LoginForm from './components/Login';
import Profile from './pages/Profile';
import VideoUpload from './components/VideoUpload';
import { UserProvider } from './components/UserContext';

function App() {

  return (
    <>

      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register/:type" element={<RegistrationForm />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/profile' element={<Profile />}>
            </Route>
            <Route path='/upload' element={<VideoUpload />} />
            <Route path='/confirm' element={<ConfirmationPage />} />
          </Routes>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
