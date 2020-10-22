import { GenericResponse } from './generic-response';

export interface CreateTaskResponse extends GenericResponse {
    taskid: string;
}