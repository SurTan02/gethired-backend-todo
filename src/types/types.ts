export interface activity {
    activity_id?: Number,
    title: String,
    email: String,
    created_at: Date,
    updated_at: Date
}

export interface todos {
    todo_id?: Number,
    activity_group_id: Number,
    title: String,
    is_active: Boolean,
    priority: String,
    created_at: Date,
    updated_at: Date
}

export interface dbquery {
    fieldCount?: Number,
    affectedRows?: Number,
    insertId?: Number,
    info?: Number,
    serverStatus?: Number,
    warningStatus?: Number
    
}