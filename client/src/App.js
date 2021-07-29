import React, {useEffect, useState} from 'react';
import Question from "./components/Question";
import Login from "./components/Login";
import ListRooms from "./components/ListRooms";
import {Redirect, Route, Switch} from "react-router";
import {BrowserRouter as Router} from 'react-router-dom';
import io from "socket.io-client";
import Competition from "./components/Competition";

const ENDPOINT = "http://localhost:8080";

const socket = io(ENDPOINT);

const App = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        if(window.localStorage.getItem("username")){
              setUsername(window.localStorage.getItem("username"));
        }

    }, [])
    return (<><Router>
            <Switch>
                <Route exact path='/' component={() => {
                    if (username) {
                        return <Redirect to={'/rooms'}/>
                    } else {
                        return <Login username={username} setUsername={setUsername}/>
                    }

                }}></Route>
                <Route exact path='/rooms' component={() => {
                    if (username) {
                        return <ListRooms setUsername={setUsername} username={username} socket={socket}/>;
                    } else {
                        return <Redirect to={'/'}/>
                    }
                }}></Route>
                <Route exact path='/rooms/:id'
                       component={() => <Competition socket={socket} username={username}/>}></Route>
            </Switch>


        </Router>

        </>
    );
}

export default App;