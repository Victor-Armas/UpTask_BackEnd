import mongoose, { Document, Schema } from "mongoose";

const userRol = {
    ADMIN: 'admin',
    USER: 'user'
} as const

export type UserRol = typeof userRol[keyof typeof userRol]

export interface IUser extends Document{
    email: string
    password: string
    name: string
    confirmed: boolean
    //rol: UserRol
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowecase: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    /* rol:{
        type: String,
        enum: Object.values(userRol),
        require:true
    }, */
})

const User = mongoose.model<IUser>('User', userSchema)
export default User