import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";

const URL = "http://localhost:8080";

const Login = ({username, setUsername}) => {
    const [user, setUser] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    useEffect(() => {
    }, [])
    const handleChange = (e) => {
        e.preventDefault();
        setUser(e.target.value);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (user.length < 3 || user.length > 6) {
                setError("Name length must be between 3 and 6");
            } else {
                fetch(`/login`, {
                    body: JSON.stringify({username: user}),
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }

                }).then((e) => {
                    setError("");
                    setUsername(user);
                    window.localStorage.setItem("username", user);
                    history.push("/rooms");
                }).catch(() => {
                    setError("Internet connection error.");
                });
            }
        }
    }
    return (<div className="login-container">
            <div className="login">
                <div>
                    Enter your name:
                    <input required={true} minLength={3} maxLength={6} type="text" value={user} name="username"
                           onChange={handleChange} onKeyDown={handleKeyDown}/>
                    <div>{error && error}</div>
                </div>
            </div>
    </div>

    );
}
export default Login;