import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {
    static crearAccount = async (req : Request, res: Response) => {
        try {
            const {password, email} = req.body
            
            //Prevenir duplicados
            const userExist = await User.findOne({email})
            if(userExist){
                const error = new Error('El usuario ya esta registrado')
                res.status(409).json({error: error.message})
                return
            }

            //Crea un usuario
            const user = new User(req.body)

            //HASH PASSWORD (seguridad)
            user.password = await hashPassword(password)

            //Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            

            //Almacenando en la base de datos
            await Promise.allSettled([user.save(), token.save()])
            //Mensaje de Confirmacion
            res.send('Cuenta creada, revisa el EMAIL para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }  
    }

    static confirmAccount = async (req : Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('Token no valido')
                res.status(404).json({error: error.message})
                return
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req : Request, res: Response) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})

            //Si el usuario existe
            if(!user){
                const error = new Error('Usuario no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            //Si la cuenta esta confirmada
            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                //Enviar Email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                const error = new Error('El usuario aun no esta confirmado, hemos enviado un email para confirmar')
                res.status(401).json({error: error.message})
                return
            }
            //Revisar Password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                res.status(401).json({error: error.message})
                return
            }

            const token = generateJWT({id: user.id})

            res.send(token)


        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res: Response) => {
        try {
            const {email} = req.body
            
            //Usuario Existe
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario no esta registrado')
                res.status(404).json({error: error.message})
                return
            }

            if(user.confirmed){
                const error = new Error('El usuario ya esta confirmado')
                res.status(403).json({error: error.message})
                return
            }

            //Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            

            //Almacenando en la base de datos
            await Promise.allSettled([user.save(), token.save()])
            //Mensaje de Confirmacion
            res.send('Se envió un nuevo token a tu E-MAIL')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }  
    }

    static forgotPassword = async (req : Request, res: Response) => {
        try {
            const {email} = req.body
            
            //Usuario Existe
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario no esta registrado')
                res.status(404).json({error: error.message})
                return
            }


            //Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Enviar Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            //Mensaje de Confirmacion
            res.send('Revisa tu Email y sigue las instrucciones')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }  
    }

    static validateToken = async (req : Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('Token no valido')
                res.status(404).json({error: error.message})
                return
            }

            
            res.send('Token valido, define tu nueva contraseña')
        
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePasswordWithToken = async (req : Request, res: Response) => {
        try {
            const {token} = req.params
            const {password} = req.body

            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('Token no valido')
                res.status(404).json({error: error.message})
                return
            }
            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            
            res.send('La contraseña se modifico correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static user = async (req : Request, res: Response) => {
        res.json(req.user)
        return
    }

    static updateProfile = async (req : Request, res: Response) => {
        const {name, email} = req.body

        req.user.name = name
        req.user.email = email

        const userExists = await User.findOne({email})

        if(userExists && userExists.id.toString() !== req.user.id.toString()){
            const error = new Error('Ese email ya esta registrado')
            res.status(409).json({error: error.message})
            return
        }

        try {
            await req.user.save()
            res.send('Perfil Actualizado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateCurrentProfilePassword = async (req : Request, res: Response) => {
        const {current_password, password} = req.body

        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('El password actual es incorrecto')
            res.status(401).json({error: error.message})
            return
        }   

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('El password se cambio correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static checkPassword = async (req : Request, res: Response) => {
        const {password} = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('El password es incorrecto')
            res.status(401).json({error: error.message})
            return
        }   

        res.send('Password Correcto')
    }
}