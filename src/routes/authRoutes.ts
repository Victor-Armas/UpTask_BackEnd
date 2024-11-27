import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputError } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    // body('rol')
    // .notEmpty().withMessage('El rol es Obligatorio'),
    body('password')
        .isLength({min: 8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),   
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputError,
    AuthController.crearAccount
)

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputError,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    body('password')
        .notEmpty().withMessage('La contraseña no puede ir sin datos'),
    handleInputError,
    AuthController.login
)

router.post('/request-code', 
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputError,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password', 
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputError,
    AuthController.forgotPassword
)

router.post('/validate-token', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputError,
    AuthController.validateToken
)

router.post('/update-password/:token', 
    param('token')
        .isNumeric().withMessage('Token no valido'),
    body('password')
        .isLength({min: 8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),   
    handleInputError,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** PROFILES */
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputError,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password')
    .notEmpty().withMessage('El password actual no puede ir vacio'),
    body('password')
    .isLength({min: 8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
    if(value !== req.body.password){
        throw new Error('Las contraseñas no son iguales')
    }
        return true
    }),  
    handleInputError,
    AuthController.updateCurrentProfilePassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('El password actual no puede ir vacio'),
    handleInputError,
    AuthController.checkPassword
)

export default router