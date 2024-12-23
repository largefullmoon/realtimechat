import { useRef, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './auth/SingIn';
import Message from './Message';
import NotFound from './Notfound';
import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store';

let isAuthenticated = false;
function App() {
  if (isAuthenticated === false) {
    const name = prompt("Please enter your username:", "");
    if (name) {
      isAuthenticated = true;
      localStorage.setItem('userId', name);
    }
  }
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/message" element={<Message />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router >
    </Provider>
  )
}

export default App