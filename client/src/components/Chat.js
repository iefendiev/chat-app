import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { XCircleIcon } from '@heroicons/react/solid';
import Messages from './Messages';

let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);

  const { search } = useLocation();
  // console.log(name, room);
  const ENDPOINT = 'https://iefendiev-chatapp-backend.herokuapp.com/';

  const closeChat = () => {
    return true;
  };

  const submitButton = (e) => {
    e.preventDefault();
    sendMessage(e);
  };

  useEffect(() => {
    const { name, room } = queryString.parse(`${search}`);

    socket = io(ENDPOINT, { transports: ['websocket'] });

    setName(name);
    setRoom(room);
    // console.log(socket);

    socket.emit('join', { name, room }, (error) => {
      // alert(error);
    });

    // unmounting for useEffect
    if (!closeChat()) {
      return () => {
        socket.emit('disconnect');
        socket.off();
      };
    }
  }, [ENDPOINT, search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  useEffect(() => {
    socket.emit('showUsersInRoom', room, () => null);

    socket.on('users', (users) => {
      setUsersInRoom(() => users);
    });
  }, [messages]);
  // console.log(usersInRoom);
  // send message function
  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  // console.log('message', message, 'messages', messages);

  return (
    <div className="chat-window">
      <form className="chat-field">
        <div className="close-wrapper">
          <div className="room-name">Room: {room}</div>
          <Link to="/">
            <XCircleIcon className="close-chat-button" onClick={closeChat} />
          </Link>
        </div>
        <Messages messages={messages} name={name}></Messages>
        <div className="chat-bottom">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
            className="message-input"
          />
          <button
            className="message-submit-button"
            type="submit"
            onClick={(e) => submitButton(e)}
          >
            Send
          </button>
        </div>
      </form>
      <div className="online-users">
        <h3
          style={{
            fontSize: '1.7rem',
            borderBottom: '2px solid white',
            paddingBottom: '0.5rem',
          }}
        >
          Online Users
        </h3>
        {usersInRoom
          ? usersInRoom.map((user) => <p key={user.id}>{user.name}</p>)
          : null}
      </div>
    </div>
  );
};

export default Chat;
