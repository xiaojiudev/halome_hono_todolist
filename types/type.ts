export interface CreateTaskReq {
    taskName: string;
}

export interface UpdateTaskReq {
    taskName: string;
    taskCompleted: boolean;
}