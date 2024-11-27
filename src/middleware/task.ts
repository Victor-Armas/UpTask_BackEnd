import type { Request,Response, NextFunction} from "express";
import Task, { ITask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction){
    try {
        const {taskId} = req.params
        const task = await Task.findById(taskId)
        //Se comprueba que el proyecto exista
        if(!task){
            const error = new Error('Tarea No Encontrado')
            res.status(404).json({error: error.message})
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export  function taskBelongToProject(req: Request, res: Response, next: NextFunction){
    if(req.task.project.toString() !== req.project.id.toString()){
        const error = new Error('Acción no válida')
        res.status(400).json({error: error.message})
        return
    }
    next()
}

export  function hasAuthorization(req: Request, res: Response, next: NextFunction){
    if(req.user.id.toString() !== req.project.manager.toString()){
        const error = new Error('Acción no válida')
        res.status(400).json({error: error.message})
        return
    }
    next()
}