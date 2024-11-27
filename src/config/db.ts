import mongoose from "mongoose";
import { exit } from 'node:process';
import color  from "colors";

export const connectDB = async () =>{
    try {   
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(color.bgMagenta.bold(`MongoDB Conectado en URL: ${url}`))
    } catch (error) {
        //console.log(error.message)
        console.log(color.bgRed('Error al Conectar a la base de datos'))
        exit(1)
    }
}