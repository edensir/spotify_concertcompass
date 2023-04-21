import { Artists, Events, User } from "../models/types";
import { UserModel } from "../models/users";

export const upsertUser = (email: string, topArtists?: Artists, savedArtists?: Artists, events?: Events, name?: string, imageUrl?: string, accessToken?: string) => {
      UserModel.findOneAndUpdate(
        {
            email
        },
        {
            name,
            email,
            imageUrl,
            topArtists,
            savedArtists,
            events,
            auth: {
                accessToken,
            }
        }
    );
}

export const getUser = (email: string): User => {
    const user = UserModel.findOne(
        {
            email
        }
        )
        console.log(user)
    return user as unknown as User;
}