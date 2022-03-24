import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditorPage() {

	const [clients, setClients] = useState([]);
	const socketRef = useRef(null);
	const codeRef = useRef(null);
	const location = useLocation();
	const reactNavigate = useNavigate();
	const { roomId } = useParams();

	const handleErrors = (err) => {
		console.log('socket error', err);
		toast.error('socket connection error, try again later.')
		reactNavigate('/');
	}

	const leaveRoom = () => {
		reactNavigate('/');
	}

	const copyRoomId = async() => {
		try{
			await navigator.clipboard.writeText(roomId);
			toast.success('RoomID copied to the clipboard.');
		} catch (err) {
			toast.error('Could not copy RoomID.');
			console.log(err);
		}
	}

	useEffect(() => {
		async function init() {
			socketRef.current = await initSocket();
			socketRef.current.on('connect_error', (err) => handleErrors(err));
			socketRef.current.on('connect_failed', (err) => handleErrors(err));

			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				username: location.state?.username,
			});
			socketRef.current.on(ACTIONS.JOINED, ({ username, socketId, clients }) => {
				console.log(socketId, socketRef.current.id);
				if(username !== location.state?.username) {
					toast.success(`${username} joined the room.`);
					console.log(`${username} joined`)
				}
				setClients(clients);
				socketRef.current.emit(ACTIONS.CODE_SYNC, { 
					socketId,
					code: codeRef.current 
				})
			});

			socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
				setClients(prev => { 
					return prev.filter(client => client.socketId !== socketId)
				});
				toast.success(`${username} left the room.`);
				console.log(`${username} left`);
			});
		}
		init();

		return () => {
			socketRef.current.off(ACTIONS.JOINED);
			socketRef.current.off(ACTIONS.DISCONNECTED);
			socketRef.current.disconnect();
		}
	}, []);
	if(!location.state)
		return <Navigate to="/"/>
		
	return (
	<div className="editorPageWrapper">
		<div className="sidebar">
			<div className="innerSidebar">
				<div className="logo">
					<img className="logoImage" src="src/assets/kindpng_2982104.png" alt="logoImage"></img>
				</div>
				<div className="clientGroup">
					{clients.map(client => {
						return <Client username={client.username} key={client.socketId} />
					})}
				</div>
				<div className="btnGroup">
					<button className='btn btnCopyRoomId' onClick={copyRoomId}>Copy RoomId</button>
					<button className='btn btnLeaveRoom' onClick={leaveRoom}>Leave Room</button>
				</div>
			</div>
		</div>
		<div className="editorWrapper">
			<Editor socketRef={socketRef} onCodeChange={code => codeRef.current = code}/>
		</div>
	</div>
	)
}

export default EditorPage