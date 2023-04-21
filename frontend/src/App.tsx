import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ArtistsList } from './components/ArtistsList';
import { Artist } from './models/types';

function App() {
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const CLIENT_ID = "8b1bc3db54804036a9fd94496dcc59e9";
    const REDIRECT_URI = "http://localhost:3000/";
    const RESPONSE_TYPE = "token";
    const SCOPES = [
        "user-top-read",
        "user-read-recently-played",
        "user-library-read",
        "user-read-playback-position",
        "user-read-email",
        "user-read-private",
    ];

    const [Artists, setArtists] = useState<Artist[]>([]);
    const [token, setToken] = useState("");

    const storeArtists = useCallback(async (tokenString: string) => {
        await axios.get('http://localhost:8080/topartists', {
            headers: {
                token: tokenString,
            },
        })
            .then((response) => {
                console.log('response: ', response.data);
                setArtists(response.data);
            });
    }, [setArtists]);

    useEffect(() => {
        const hash: string | undefined = window.location?.hash;
        let token = window.localStorage.getItem("token");

        const sendTokenToBackend = async (token: string) => {
            console.log('sendTokenToBackend token: ', token)
            await axios.post('http://localhost:8080/createuser', {
                token: token,
            })
                .then(async (response) => {
                    console.log('response: ', response);
                    setToken(response.data.token);
                    window.localStorage.setItem("token", response.data.token);
                    storeArtists(response.data.token);
                    window.location.reload();
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
    }, [storeArtists]);

    const logout = () => {
        setToken("");
        console.log('Artists: ', Artists);
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <div className="App_Main">
                <h1 className="App_Title">Concert Compass</h1>
                <h2 className="App_Subtitle">Discover and Book Your Favorite Artists' Shows</h2>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join(' ')}`}><button className="App_LoginButton">Connect your Spotify</button></a>
                    : <button className="App_Out" onClick={logout}>Logout</button>}

                { !token ? '' : <div className="App_TopArtists"> <ArtistsList /> </div> }
            </div>
        </div>
    );
}

export default App;
