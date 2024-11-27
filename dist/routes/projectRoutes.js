"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ProjectController_1 = require("../controllers/ProjectController");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
//Crear un Proyecto
router.post('/', (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('la descripcion del proyecto es obligatorio'), validation_1.handleInputError, ProjectController_1.ProjectController.createProject);
//Obtener todos los proyectos
router.get('/', ProjectController_1.ProjectController.getAllProject);
//Obtener un Proyecto en especifico
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('ID no valido'), validation_1.handleInputError, ProjectController_1.ProjectController.getProjectById);
/* este es para que en todas las rutas que tengan ese mismo "projectId
primero corra ese middleware y no tener que colocarlo en cada ruta" */
router.param('projectId', project_1.projectExist);
//Actualizar un Proyecto
router.put('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('la descripcion del proyecto es obligatorio'), validation_1.handleInputError, task_1.hasAuthorization, ProjectController_1.ProjectController.updateProject);
//Eliminar proyecto
router.delete('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no valido'), validation_1.handleInputError, task_1.hasAuthorization, ProjectController_1.ProjectController.deleteProject);
/** ROUTES FOR TASK **/
router.param('taskId', task_1.taskExist); //En las rutas donde encuentre "taskId" ejecuta ese middleware
router.param('taskId', task_1.taskBelongToProject); //En las rutas donde encuentre "taskId" ejecuta ese middleware
router.post('/:projectId/tasks', 
//projectExist, //Primero valida que el proyecto exista
(0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'), (0, express_validator_1.body)('responsible')
    .notEmpty().withMessage('El nombre del responsable de la tarea es obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('la descripcion de la tarea es obligatorio'), TaskController_1.TaskController.createTask);
router.get('/:projectId/tasks', 
//projectExist,
TaskController_1.TaskController.getProjectTask);
router.get('/:projectId/tasks/:taskId', 
//projectExist,
(0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), validation_1.handleInputError, TaskController_1.TaskController.getTaskById);
router.put('/:projectId/tasks/:taskId', task_1.hasAuthorization, 
//projectExist,
(0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'), (0, express_validator_1.body)('responsible')
    .notEmpty().withMessage('El nombre del responsable de la tarea es obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('la descripcion de la tarea es obligatorio'), validation_1.handleInputError, TaskController_1.TaskController.updateTask);
router.delete('/:projectId/tasks/:taskId', task_1.hasAuthorization, 
//projectExist,
(0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), validation_1.handleInputError, TaskController_1.TaskController.deleteTask);
router.post('/:projectId/tasks/:taskId/status', (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('status')
    .notEmpty().withMessage('El estado es obligatorio'), validation_1.handleInputError, TaskController_1.TaskController.updateStatus);
/** ROUTES for TEAMS **/
router.post('/:projectId/team/find', (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no valido'), validation_1.handleInputError, TeamController_1.TeamMemberController.findMemberByEmail);
router.get('/:projectId/team', TeamController_1.TeamMemberController.getProjectTeam);
router.post('/:projectId/team', (0, express_validator_1.body)('id')
    .isMongoId().withMessage('ID no valido'), validation_1.handleInputError, TeamController_1.TeamMemberController.addMemberById);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('ID no valido'), validation_1.handleInputError, TeamController_1.TeamMemberController.removeMemberById);
/* Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content')
    .notEmpty().withMessage('El Contenido de la nota es obligatorio'), validation_1.handleInputError, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('ID No Válido'), validation_1.handleInputError, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map