import React, {useCallback, useEffect, useState} from 'react';
import Room from "./Room";
import CreateRoom from "./CreateRoom";
import NavBar from "./NavBar";
import {v4 as uuidv4} from 'uuid';

const ListRooms = ({socket, username, setUsername}) => {
    const [rooms, setRooms] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        socket.emit("leave-room", {});
        socket.on("get-all-rooms", getAllRooms);
        socket.on("update-leaderboard", getLeaderboard);
        socket.emit("get-all-rooms-request", {});
        socket.emit("get-leaderboard-request", {});
    }, []);
    const getAllRooms = (updatedRooms) => {
        setRooms([...updatedRooms]);
    }
    const getLeaderboard = (updatedLeaderboard) => {
        setLeaderboard([...updatedLeaderboard]);
    }
    return (<div className="home-container">
            <div>
                <NavBar setUsername={setUsername} username={username}/>
                <div className="room-container">
                    <CreateRoom socket={socket} username={username}/>
                    {rooms.map(room => {
                        return <Room key={uuidv4()} {...room}/>;
                    })}
                </div>
            </div>
            <div>
                <p className="leaderboard-text">Leaderboard </p>
                <div className="leaderboard">
                    <table>
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>User</th>
                            <th>Pts.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderboard.map(user =>
                            <tr key={uuidv4()}>
                                <td className={username === user.username && "current-user"}>{leaderboard.indexOf(user) + 1}
                                </td>
                                <td className={username === user.username && "current-user"}>{user.username} {username === user.username && "(You)"}
                                </td>
                                <td className={username === user.username && "current-user"}>{user.points}
                                </td>
                            </tr>
                        )}


                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
}

export default ListRooms;