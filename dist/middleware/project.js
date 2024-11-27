"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectExist = projectExist;
const Project_1 = __importDefault(require("../models/Project"));
async function projectExist(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await Project_1.default.findById(projectId);
        //Se comprueba que el proyecto exista
        if (!project) {
            const error = new Error('Proyecto No Encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        req.project = project;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
//# sourceMappingURL=project.js.map