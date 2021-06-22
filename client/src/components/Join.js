import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';

const Join = () => {
  const context = useContext(ChatContext);

  return (
    <form className="input-fields">
      <h1 style={{ color: 'white' }}>Join Chat Rooms</h1>
      <input
        placeholder="Name"
        onChange={(e) => context.setName(e.target.value)}
      ></input>
      <input
        placeholder="Room"
        onChange={(e) => context.setRoom(e.target.value)}
      ></input>
      <Link
        onClick={(e) =>
          !context.name || !context.room ? e.preventDefault : null
        }
        to={`/chat?name=${context.name}&room=${context.room}`}
      >
        <button className="join-button" type="submit">
          Start Chatting!
        </button>
      </Link>
    </form>
  );
};

export default Join;
