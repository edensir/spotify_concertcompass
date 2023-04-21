/*
- create spotifyService.ts
    o export const me = (accessToken) => do axios call to spotify api /me
    o export const music taste = (accessToken) => do axios call to spotify api /music taste???
*/

import axios from "axios";
import { SpotifyUser, TopArtistsResponse } from "../models/types";

//https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
export const me = async (accessToken: string): Promise<SpotifyUser> => {
    try {
        const url = `https://api.spotify.com/v1/me`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log('me(): ', response.data);
        return response.data as SpotifyUser;
      } catch (error) {
        console.log(error);
        throw error;
      }
};

// https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
export const topArtists = async (accessToken: string): Promise<TopArtistsResponse> => {
  console.log('accessToken: ', accessToken);
    try {
        const url = `https://api.spotify.com/v1/me/top/artists`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log('topArtists(): ', response.data);
        return response.data as TopArtistsResponse;
      } catch (error) {
        console.log(error);
        throw error;
      }
};