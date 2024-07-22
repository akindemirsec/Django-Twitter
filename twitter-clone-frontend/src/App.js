import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import Menu from './components/Menu';
import { GlobalStyle, theme } from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import UserInfo from './components/UserInfo';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <div style={{ display: 'flex' }}>
          {/* Conditionally render Menu based on the current path */}
          {window.location.pathname !== '/register' && window.location.pathname !== '/login' && (
            <>
              <Menu />
              <UserInfo />
            </>
          )}
          <div style={{ marginLeft: window.location.pathname !== '/register' && window.location.pathname !== '/login' ? '250px' : '0', width: '100%' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
