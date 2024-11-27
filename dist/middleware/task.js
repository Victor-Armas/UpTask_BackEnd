"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskExist = taskExist;
exports.taskBelongToProject = taskBelongToProject;
exports.hasAuthorization = hasAuthorization;
const Task_1 = __importDefault(require("../models/Task"));
async function taskExist(req, res, next) {
    try {
        const { taskId } = req.params;
        const task = await Task_1.default.findById(taskId);
        //Se comprueba que el proyecto exista
        if (!task) {
            const error = new Error('Tarea No Encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        req.task = task;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
function taskBelongToProject(req, res, next) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción no válida');
        res.status(400).json({ error: error.message });
        return;
    }
    next();
}
function hasAuthorization(req, res, next) {
    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acción no válida');
        res.status(400).json({ error: error.message });
        return;
    }
    next();
}
//# sourceMappingURL=task.js.map