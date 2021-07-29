import React, {useEffect, useState} from 'react';
import Score from "./Score";
import Question from "./Question";
import Preparation from "./Preparation";
import {useParams} from "react-router";

const Competition = ({username, socket}) => {
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [opponentName, setOpponentName] = useState("");
    const [ready, setReady] = useState(false);
    const [opponentReady, setOpponentReady] = useState(false);
    const [finished, setFinished] = useState(false);
    const [opponentFinished, setOpponentFinished] = useState(false);
    let {id} = useParams();

    useEffect(() => {
        socket.on("room-users", updateOpponent);
        socket.on("room-readiness", updateReadiness);
        socket.on("get-score", getScore);
        socket.on("get-finished", getFinished);
        socket.on("update-leave-room", updateLeaveRoom);
        socket.emit("join-room", {room: id, username});
        socket.removeAllListeners("get-all-rooms");
    }, [])
    const updateLeaveRoom = ({username}) => {
        setOpponentReady(false);
        setOpponentName("");
        setOpponentScore(0);
        setMyScore(0);
        if (myScore > 0) {
            setOpponentFinished(true);
        }
    }
    const getFinished = ({user, isFinished}) => {
        setOpponentFinished(true);
    }
    const getScore = async ({user, addedScore}) => {
        await setOpponentScore((opponentScore) => (opponentScore + addedScore));
    }
    const updateReadiness = ({user, isReady}) => {
        console.log("Opponent is ready");
        setOpponentReady(() => true);
    }
    const updateOpponent = async ({room, users}) => {
        let foundOpponent = false;
        for (let user of users) {
            if (user.username !== username) {
                foundOpponent = true;
                await setOpponentName(user.username);
            }
        }
        if (!foundOpponent) {
            await setOpponentName("");
        }
    }


    return <div className={"question-container"}>
        <Score key={"Me"} score={myScore} name={username}/>
        {(ready && opponentReady) ?
            <Question setFinished={setFinished} myScore={myScore} setMyScore={setMyScore} socket={socket}
                      opponentFinished={opponentFinished} finished={finished} room={id}
                      username={username}/> :
            <Preparation socket={socket} opponentName={opponentName} setReady={setReady}
            />}
        <Score key={"Opponent"} score={opponentScore} name={opponentName ? opponentName : "Waiting..."}/>
    </div>
}

export default Competition;