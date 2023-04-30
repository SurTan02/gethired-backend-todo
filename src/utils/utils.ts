import { activity, todos } from "../types/types"

export const activityResponse = (data: activity) =>{
    return{
        "id": data.activity_id,
        "title": data.title,
        "email": data.email,
        "created_at": data.created_at,
        "updated_at": data.updated_at
    }
}

export const todoResponse = (data: todos) =>{
    return{
        "id": data.todo_id,
        "title": data.title,
        "activity_group_id": data.activity_group_id,
        "is_active": (data.is_active) ? true : false,
        "priority": data.priority,
        "created_at": data.created_at,
        "updated_at": data.updated_at
    }
}
