import React, {useRef, useState} from 'react';

const Preparation = ({setReady,socket,opponentName}) => {
    let btnRef = useRef();
    const [text, setText] = useState("Click here to get ready");
    const handleReady = () => {
        setReady(true);
        socket.emit('get-ready',true)
        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", "disabled");
            setText("Waiting for opponent to get ready...");
        }
    }
    return <div className="app">
        <button disabled={!opponentName} ref={btnRef} onClick={handleReady}>{opponentName ? text : "Waiting for opponent to join..."}</button>
    </div>;
}
export default Preparation;