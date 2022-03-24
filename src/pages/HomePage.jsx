import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function HomePage() {
	
	const [roomId, setRoomId] = useState('');
	const [username, setUsername] = useState('');
	const navigate = useNavigate();

	const createNewRoom = (e) => {
		e.preventDefault();
		const id = uuidv4();
		setRoomId(id);
		toast.success("Created new Room.")
	}

	const joinRoom = (e) => {
		if(!roomId || !username) {
			toast.error("ROOM ID & USERNAME is required.");
			return;
		}
		navigate(`/editor/${roomId}`, {state : { username }});
	}

  return (
    <div className="homePageWrapper">
			<div className="formWrapper">
					<h3 className="formTitle">Paste the Room Id here</h3>
					<div className="inputGroup">
						<input 
							className="input" 
							type="text" 
							placeholder="Room Id" 
							value={roomId}
							onChange={(e) => setRoomId(e.target.value)}
						/>
						<input 
							className="input" 
							type="text" 
							placeholder="Username" 
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<button className="btn joinBtn" onClick={joinRoom}>Join</button>
				<span className="bottomInfo">
					Don't have Room ID? Create one&nbsp;
					<a href="/" onClick={createNewRoom}>here</a>
				</span>
			</div>
			<footer>
				<h4>Made with 💜 by ME!!!</h4>
			</footer>
    </div>
  );
};

export default HomePage;