import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router";

const NavBar = ({username,setUsername}) => {
    let history = useHistory();
    useEffect(() => {
    })
    const logout = async () =>{
        await setUsername("");
        window.localStorage.clear();
        history.push("/");
    }
    return <div className="navbar">
        <div className="welcome-text">Welcome {username}!</div>
        <button onClick={logout} className="log-out">Log out</button>
    </div>
}

export default NavBar;
