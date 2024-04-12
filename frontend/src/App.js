import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import UserRegistration from './components/Registration';
import VideoUpload from './components/VideoUpload';
import RegistrationForm from './components/Registration';
import ConfirmationPage from './components/Confirmation';
import HomePage from './pages/Home';
import LoginForm from './components/Login';
import Profile from './pages/Profile';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomePage />}/>
        <Route path="/register/:type" element={<RegistrationForm />} />
        <Route path='/login' element={< LoginForm/>}/>
        <Route path='/profile' element={< Profile/>}/>
        <Route path='/upload' element={< VideoUpload/>}/>
        <Route path='/confirm' element={< ConfirmationPage/>}/>

      </>

    )
  )


  return (
    <>
      {/* <VideoUpload />
      <ConfirmationPage />
      <RegistrationForm /> */}
      <RouterProvider router={router} />
    </>


  );
}

export default App;
