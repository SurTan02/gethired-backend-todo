import { Router } from "express";
import { Request, Response } from 'express';
import { execute } from "../db";
import { todos, dbquery } from "../types/types";
import { todoResponse } from "../utils/utils";

const router = Router();

//  Get All activity-groups
router.get("/todo-items", async(req: Request, res: Response) => {
    try {
        const {activity_group_id} = req.query 

        
        const allTodos: todos[] = activity_group_id ? 
            await execute(`SELECT * FROM todos WHERE activity_group_id = ?`, [activity_group_id]):
            await execute(`SELECT * FROM todos`, [])

        const newAllTodos: todos[] = []
        allTodos.forEach(todo => {
            newAllTodos.push(todoResponse(todo))
        })

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data":  newAllTodos
        });
    } catch (error) {        
        res.sendStatus(500);
    }
});

//  Get One
router.get("/todo-items/:id", async(req: Request, res: Response) => {
    try {
        const {id} = req.params

        const todo: todos[] = await execute(
            `SELECT * FROM todos WHERE todo_id = ?`, [id]
        );
        if (todo.length === 0){
            return res.status(404).json({
                "status": "Not Found",
                "message": `Todo with ID ${id} Not Found`
            })
        }

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data": todoResponse(todo[0])
        });
    } catch (error) {        
        res.sendStatus(500);
    }
});

// // Create
router.post("/todo-items", async(req: Request, res: Response) => {
    try {
        const {title , activity_group_id, is_active} = req.body
    
        if (!title){
            return res.status(400).json({
                "status": "Bad Request",
                "message": "title cannot be null"
            })
        }

        if (!activity_group_id){
            return res.status(400).json({
                "status": "Bad Request",
                "message": "activity_group_id cannot be null"
            })
        }

        const is_active_data =  (is_active == null) ? true : is_active


        const createQuery: dbquery = await execute(
            `INSERT INTO todos (title, activity_group_id, is_active) VALUES (?,?,?)`, [title , activity_group_id, is_active_data]
        );
    
        const insertedTodo: todos[] =  await execute(
            `SELECT * FROM todos WHERE todo_id = ?`, [createQuery.insertId]
        )
        
        res.status(201).json({
            "status": "Success",
            "message": "Success",
            "data": todoResponse(insertedTodo[0])
        });
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    
    
    
});

// // Update
router.patch("/todo-items/:id", async(req: Request, res: Response) => {
    try {
        const {title, priority, is_active} = req.body
        const {id} = req.params
        
        const is_active_data =  (is_active == null) ? true : is_active
        // const title_data = (title == null) ? true : title
        // const priority_data = (priority == null) ? true : priority
        const updateQuery: dbquery = await execute(
            `UPDATE todos SET title = IFNULL(?, title), priority = IFNULL(?, priority), is_active = ? WHERE todo_id = ?`, [title, priority, is_active_data, id]
        );

        
        if (updateQuery.affectedRows === 0){
            return res.status(404).json({
                "status": "Not Found",
                "message": `Todo with ID ${id} Not Found`
            })
        }
        
        const updatedTodo: todos[] =  await execute(
            `SELECT * FROM todos WHERE todo_id = ?`, [id]
        )

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data": todoResponse(updatedTodo[0])
        });
    } catch (error) {
        console.log(error)
        res.status(500)
    }
    
});


// // Delete
router.delete("/todo-items/:id", async(req: Request, res: Response) => {
    try {
        const {id} = req.params
        const deleteQuery: dbquery = await execute(
            `DELETE FROM todos WHERE todo_id = ?`, [id]
        );
        
        if (deleteQuery.affectedRows === 0){
            return res.status(404).json({
                "status": "Not Found",
                "message": `Todo with ID ${id} Not Found`
            })
        }

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data" : {}
        }); 
    } catch (error) {
        return res.sendStatus(500)
    }
});


export { router as todo };