import axios from "axios";
import { SpotifyUser, TopArtistsResponse } from "../models/types";

export const me = async (accessToken: string): Promise<SpotifyUser> => {
    try {
        const url = `https://api.spotify.com/v1/me`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.data as SpotifyUser;
      } catch (error) {
        console.log(error);
        throw error;
      }
};

export const topArtists = async (accessToken: string): Promise<TopArtistsResponse> => {
    try {
        const url = `https://api.spotify.com/v1/me/top/artists`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.data as TopArtistsResponse;
      } catch (error) {
        console.log(error);
        throw error;
      }
};