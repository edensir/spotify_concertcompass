import { Artists, Events, User } from "../models/types";
import { UserModel } from "../models/users";

export const upsertUser = async(email: string, topArtists?: Artists, savedArtists?: Artists, events?: Events, name?: string, imageUrl?: string, accessToken?: string) => {
    await UserModel.findOneAndUpdate(
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
            accessToken,
        },
        {
            upsert: true
        }
    ).exec();
}

// https://mongoosejs.com/docs/promises.html
export const getUser = async (email: string): Promise<User> => {
    const user = await UserModel.findOne(
        {
            email
        }
        ).exec();
    return user as unknown as User;
}