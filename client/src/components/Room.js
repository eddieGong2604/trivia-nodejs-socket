import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";

const Room = ({roomName, numberOfUser, isFull,currentUsers}) => {
    const [roomState, setRoomState] = useState({roomName: "", numberOfUser: 0, isFull: false, currentUsers:[]});
    const history = useHistory();
    useEffect(() =>{
        const room = {roomName, numberOfUser, isFull,currentUsers};
        setRoomState(room);
    },[])
    const handleJoin = () => {
        if(!roomState.isFull){
            history.push(`/rooms/${roomState.roomName}`)
        }
    }
    return (<>
        <div className="room-card">
            <div>
                <p>Room: {roomState.roomName}</p>
                <p>Number of User: {roomState.numberOfUser}</p>
                <p>Status: {roomState.isFull ? "Full" : "Ready"}</p>
            </div>
            <div className="join-button-container">
                <button onClick={handleJoin} className="join-button"> {roomState.isFull ? "Unable to join" : "Join"} </button>
            </div>

        </div>

    </>);
}


export default Room;