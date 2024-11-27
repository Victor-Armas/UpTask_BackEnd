import mongoose, { Document } from "mongoose";
declare const userRol: {
    readonly ADMIN: "admin";
    readonly USER: "user";
};
export type UserRol = typeof userRol[keyof typeof userRol];
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    confirmed: boolean;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>;
export default User;
