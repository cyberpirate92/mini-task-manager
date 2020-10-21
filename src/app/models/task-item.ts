export interface TaskItem {
    id: string;
    message: string;
    assigned_to: number;
    assigned_name?: string;
    created_on: Date;
    due_date: Date;
    priority: number;
}