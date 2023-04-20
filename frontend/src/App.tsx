import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const CLIENT_ID = "8b1bc3db54804036a9fd94496dcc59e9"
    const REDIRECT_URI = "http://localhost:3000/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")

    useEffect(() => {
        const hash: string | undefined = window.location?.hash;

        let token = window.localStorage.getItem("token");

        if (!token && hash !== undefined) {
            const element = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"));
            if (!element) {
                console.error('Can not find access token');
                return;
            }
            token = element.split("=")[1];
            console.log('token: ', token);
            
            window.location.hash = ""
            window.localStorage.setItem("token", token)
        };

        if (!token) {
            console.error('Can not find access token');
            return;
        }


        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>}
            </header>
        </div>
    );
}

export default App;
