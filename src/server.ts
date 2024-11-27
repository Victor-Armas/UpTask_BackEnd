import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'

dotenv.config()

connectDB()

const app = express()

app.use(cors(corsConfig))
//Logging
app.use(morgan('dev'))
//Leer datos de formulario
app.use(express.json())

//Routes
app.use('/api/auth',authRoutes) //Se creo primero {1}
app.use('/api/projects',projectRoutes) //Se creo primero {1}

export default app