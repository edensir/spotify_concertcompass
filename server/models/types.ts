export interface User {
    name: string;
    email: string;
    imageUrl: string;
    topArtists: Artists;
    savedArtists?: Artists;
    events?: Events;
    accessToken: string;
}

export type Events = {
    name: string;
    url: string;
    going: boolean;
}[];

export type Artists = {
    name: string;
    popularity: number;
}[];

export interface TopArtistsResponse {
    items: {
        external_urls: Record<string, string>;
        followers: {
            href: string | null;
            total: number;
        };
        genres: string[];
        href: string;
        id: string;
        images: {
            height: number | null;
            url: string;
            width: number | null;
        }[];
        name: string;
        popularity: number;
        type: string;
        uri: string;
    }[];
}

export interface SpotifyUser {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    external_urls: {
        spotify: string;
    };
    followers: {
        href: null | string;
        total: number;
    };
    href: string;
    id: string;
    images: {
        height: null | number;
        url: string;
        width: null | number;
    }[];
    product: string;
    type: 'user';
    uri: string;
}
