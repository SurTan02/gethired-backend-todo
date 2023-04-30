import { Router } from "express";
import { Request, Response } from 'express';
import { execute } from "../db";
import { activity, dbquery } from "../types/types";
import { activityResponse } from "../utils/utils";

const router = Router();

//  Get All activity-groups
router.get("/activity-groups", async(req: Request, res: Response) => {
    try {
        const allActivies: activity[] = await execute(
            `SELECT * FROM activities`, []
        );

        const newAllActivies: activity[] = []
        allActivies.forEach(activity => {
            newAllActivies.push(activityResponse(activity))
        })

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data":  newAllActivies
        });
    } catch (error) {        
        res.sendStatus(500);
    }
});

//  Get One
router.get("/activity-groups/:id", async(req: Request, res: Response) => {
    try {
        const {id} = req.params
        const activity: activity[] = await execute(
            `SELECT * FROM activities WHERE activity_id = ?`, [id]
        );
        if (activity.length === 0){
            return res.status(404).json({
                "status": "Not Found",
                "message": `Activity with ID ${id} Not Found`
            })
        }

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data": activityResponse(activity[0])
        });
    } catch (error) {        
        res.sendStatus(500);
    }
});

// Create
router.post("/activity-groups", async(req: Request, res: Response) => {
    try {
        const {title , email} = req.body
    
        if (!title){
            return res.status(400).json({
                "status": "Bad Request",
                "message": "title cannot be null"
            })
        }

        const createQuery: dbquery = await execute(
            `INSERT INTO activities (title, email) VALUES (?,?)`, [title, email]
        );

        const insertedActivity: activity[] =  await execute(
            `SELECT * FROM activities WHERE activity_id = ?`, [createQuery.insertId]
        )
        
        res.status(201).json({
            "status": "Success",
            "message": "Success",
            "data": activityResponse(insertedActivity[0])
        });
    } catch (error) {
        return res.sendStatus(500)
    }
    
});

// Update
router.patch("/activity-groups/:id", async(req: Request, res: Response) => {
    try {
        const {title} = req.body
        const {id} = req.params
        
        if (!title){
            return res.status(400).json({
                "status": "Bad Request",
                "message": "title cannot be null"
            })
        }

        const updateQuery: dbquery = await execute(
            `UPDATE activities SET title = ? WHERE activity_id = ?`, [title, id]
        );

        
        if (updateQuery.affectedRows === 0){
            return res.status(404).json({
                "status": "Not Found",
                "message": `Activity with ID ${id} Not Found`
            })
        }
        
        const updatedActivity: activity[] =  await execute(
            `SELECT * FROM activities WHERE activity_id = ?`, [id]
        )

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data": activityResponse(updatedActivity[0])
        });
    } catch (error) {
        return res.sendStatus(500)
    }
    
    
});


// Delete
router.delete("/activity-groups/:id", async(req: Request, res: Response) => {
    try {
        const {id} = req.params
    
        const deleteQuery: dbquery = await execute(
            `DELETE FROM activities WHERE activity_id = ?`, [id]
        );
        
        if (deleteQuery.affectedRows === 0){
            return res.status(404).json({
                "status": "Not Found",
                "message": `Activity with ID ${id} Not Found`
            })
        }

        res.status(200).json({
            "status": "Success",
            "message": "Success",
            "data" : {}
        });
    } catch (error) {
        res.sendStatus(500)
    }
    
});


export { router as activity };