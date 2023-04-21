import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Artist } from '../models/types';

export const ArtistsList = () => {
  const [Artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        await axios.get('http://localhost:8080/topartists', {
          headers: {
            token,
          },
        })
          .then((response) => {
            setArtists(response.data);
          });
      }
    }

    fetchData();
  }, []);

  const clearList = useCallback(async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      await axios.delete('http://localhost:8080/topartists', {
        headers: {
          token,
        },
      })
        .then((response) => {
          setArtists([]);
        });
    }

    setArtists([]);
  }, [setArtists])

  return (
    <div>
      <ol className="Artists_List">
        {Artists.map((artist) => (
          <li className="Artist_Component" key={artist._id}>
            <h2 className="Artist_Name" >{artist.name}</h2>
            <p className="Artist_Popular" >Popularity: {artist.popularity}</p>
          </li>
        ))}
      </ol>
      <button className="Artist_Clear" onClick={clearList}>Clear List</button>
    </div>
  );
}
