import './App.css';
import React, { useState } from 'react';
import { ChatContext } from './context/ChatContext';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Join from './components/Join';
import Chat from './components/Chat';

function App() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="App">
      <Router>
        <ChatContext.Provider value={{ name, setName, room, setRoom }}>
          <Route path="/" exact render={() => <Join />} />
          <Route path="/chat" render={() => <Chat />} />
        </ChatContext.Provider>
      </Router>
    </div>
  );
}

export default App;
