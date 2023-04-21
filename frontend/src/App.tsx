import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const CLIENT_ID = "8b1bc3db54804036a9fd94496dcc59e9";
    const REDIRECT_URI = "http://localhost:3000/";
    const RESPONSE_TYPE = "token";
    const SCOPES = [
        // "ugc-image-upload",
        "user-top-read",
        "user-read-recently-played",
        "user-library-read",
        // "user-read-playback-state",
        // "app-remote-control", would be nice for audio/voice control
        // "playlist-modify-public",
        // "user-modify-playback-state",
        // "playlist-modify-private",
        // "user-follow-modify",
        // "user-read-currently-playing", this would be nice when you can see timeline with live music playing of friends, just like spotify on desktop
        // "user-follow-read", good for adding friends to follow on concert compass
        // "user-library-modify",
        "user-read-playback-position", /* show popularity score of artist and your position towards artist */
        // "playlist-read-private",
        "user-read-email",
        "user-read-private",
        // "playlist-read-collaborative", nice for merging concerts/shows with friends based on collab playlist
        // "streaming"
    ];

    const [token, setToken] = useState("");

    useEffect(() => {
        const hash: string | undefined = window.location?.hash;
        let token = window.localStorage.getItem("token");

        const sendTokenToBackend = async (token: string) => {
            console.log('sendTokenToBackend token: ', token)
            await axios.post('http://localhost:8080/createuser', {
                token: token,
            })
                .then((response) => {
                    console.log('response: ', response);
                    setToken(response.data.token);
                    window.localStorage.setItem("token", response.data.token);
                });
        }

        if (!token && hash !== undefined) {
            const element = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"));
            if (!element) {
                console.error('Can not find access token');
                return;
            }
            token = element.split("=")[1];
            console.log('token: ', token);

            sendTokenToBackend(token)
                .then(() => console.log('done sending'))
                .catch((err) => console.error(err));

            window.location.hash = "";
        };

        if (!token) {
            return;
        }

        setToken(token);
    }, []);

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <header className="App_Header">
                <h1 className="App_Title">Concert Compass</h1>
                <h2 className="App_Subtitle">Discover and Book Your Favorite Artists' Shows</h2>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join(' ')}`}><button className="App_LoginButton">Connect your Spotify</button></a>
                    : <button className="App_Out" onClick={logout}>Logout</button>}
            </header>
        </div>
    );
}

export default App;
