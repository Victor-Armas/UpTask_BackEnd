import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputError } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { hasAuthorization, taskBelongToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";


const router = Router()

router.use(authenticate)

//Crear un Proyecto
router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('la descripcion del proyecto es obligatorio'),
    handleInputError,
    ProjectController.createProject
)

//Obtener todos los proyectos
router.get('/', ProjectController.getAllProject)

//Obtener un Proyecto en especifico
router.get('/:id', 
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputError,
    ProjectController.getProjectById
)

/* este es para que en todas las rutas que tengan ese mismo "projectId 
primero corra ese middleware y no tener que colocarlo en cada ruta" */
router.param('projectId',projectExist) 

//Actualizar un Proyecto
router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('la descripcion del proyecto es obligatorio'),
    handleInputError,
    hasAuthorization,
    ProjectController.updateProject
)

//Eliminar proyecto
router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputError,
    hasAuthorization,
    ProjectController.deleteProject
)


/** ROUTES FOR TASK **/


router.param('taskId', taskExist) //En las rutas donde encuentre "taskId" ejecuta ese middleware
router.param('taskId', taskBelongToProject) //En las rutas donde encuentre "taskId" ejecuta ese middleware

router.post('/:projectId/tasks',
    //projectExist, //Primero valida que el proyecto exista
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('responsible')
        .notEmpty().withMessage('El nombre del responsable de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('la descripcion de la tarea es obligatorio'),
    TaskController.createTask
)

router.get('/:projectId/tasks',
    //projectExist,
    TaskController.getProjectTask
)

router.get('/:projectId/tasks/:taskId',
    //projectExist,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputError,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    //projectExist,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('responsible')
        .notEmpty().withMessage('El nombre del responsable de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('la descripcion de la tarea es obligatorio'),
    handleInputError,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    //projectExist,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputError,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputError,
    TaskController.updateStatus
)

/** ROUTES for TEAMS **/

router.post('/:projectId/team/find',
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputError,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputError,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no valido'),
    handleInputError,
    TeamMemberController.removeMemberById
)

/* Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputError,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputError,
    NoteController.deleteNote
)

export default router