import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import RegistrationForm from './components/Registration';
import ConfirmationPage from './pages/Confirmation';
import HomePage from './pages/Home';
import LoginForm from './components/Login';
import Profile from './pages/Profile';
import VideoUpload from './components/VideoUpload';
import { UserProvider, useUser } from './components/UserContext';
import Header from './components/Header';

function PrivateRoute({ element, allowedTypes }) {
  const { user } = useUser();
  if (!user) {
    
    return <Navigate to="/login" />;
  }

  if (!allowedTypes.includes(user.type)) {
    
    return <Navigate to="/profile" />;
  }

  return element;
}

function App() {

  return (
    <>
      <Header/>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register/:type" element={<RegistrationForm />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/profile' element={<Profile />}>
              <Route path='upload' element={
                <PrivateRoute
                  element={<VideoUpload />}
                  allowedTypes={["video-editor"]}
                />
              } />
              <Route path='confirm' element={
                <PrivateRoute
                  element={<ConfirmationPage />}
                  allowedTypes={["content-creator"]}
                />
              } />
            </Route>
          </Routes>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
