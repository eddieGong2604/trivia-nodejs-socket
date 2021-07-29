import React, {useState} from 'react';
import Modal from 'react-modal';
import {useHistory} from "react-router-dom";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'black'
    },
};
const CreateRoom = ({socket,username}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();


    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setError("");
        setRoomName("");
        setIsOpen(false);
    }
    const handleChange = (e) => {
        setRoomName(e.target.value);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if(roomName.length < 3 || roomName.length > 6){
                setError("Room name length must be between 3 and 6");
            }
            else{
                socket.emit("client-create-room", {roomName, username});
                socket.removeAllListeners("get-all-rooms");
                history.push(`/rooms/${roomName}`)
                closeModal();
            }
        }

    }
    return (<>
        <div className="create-room-card">
            <button onClick={openModal} className="create-room-button"> Create Room</button>
            <Modal
                ariaHideApp={false}
                isOpen={isOpen}
                contentLabel="Create Room"
                style={customStyles}
                onRequestClose={closeModal}
            >
                Enter Room Name:
                <input type={"text"} onChange={handleChange} onKeyDown={handleKeyDown} value={roomName}/>
                <br/>
                {error && error}
            </Modal>
        </div>

    </>);
}


export default CreateRoom;