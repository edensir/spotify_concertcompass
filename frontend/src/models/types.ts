export interface User {
    name: string;
    email: string;
    imageUrl: string;
    topArtists: Artist[];
    savedArtists?: Artist[];
    events?: Events;
    auth: {
        accessToken: string;
    }
}

export type Events = {
    name: string;
    url: string;
    going: boolean;
}[];

export type Artist = {
    _id?: string;
    name: string;
    popularity: number;
};

