import { GenericResponse } from './generic-response';
import { TaskItem } from './task-item';

export interface TaskListResponse extends GenericResponse {
    tasks: TaskItem[];
}