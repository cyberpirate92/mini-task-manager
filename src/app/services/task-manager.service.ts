import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GenericResponse, TaskItem, TaskListResponse } from '../models';
import { DateUtils } from '../utils/date-utils';

@Injectable({
    providedIn: 'root'
})
export class TaskManagerService {    
    private API_URL: string;
    private API_KEY: string;
    
    public tasks$: BehaviorSubject<TaskItem[]>;
    public error$: BehaviorSubject<string>;
    
    constructor(private httpClient: HttpClient) { 
        this.API_URL = environment.apiUrl;
        this.API_KEY = environment.apiKey;
        
        this.tasks$ = new BehaviorSubject([]);
        this.error$ = new BehaviorSubject("");
    }
    
    /**
    * Fetch all tasks. 
    * `tasks$` will be updated with the results.
    * 
    * @returns Observable of the response object
    */
    public fetchAll() {
        return this.httpClient.get<TaskListResponse>(`${this.API_URL}/list`, {
            headers: {
                AuthToken: this.API_KEY,
            }
        }).pipe(tap({
            next: response => {
                if (response.status === 'success') {
                    this.tasks$.next(response.tasks.map(t => {
                        t.created_on = t.created_on && DateUtils.fromResponseFormat(t.created_on as any);
                        t.due_date = t.due_date && DateUtils.fromResponseFormat(t.due_date as any);
                        t.priority = t.priority && parseInt(t.priority as any);
                        t.assigned_to = t.assigned_to && parseInt(t.assigned_to as any);
                        return t;
                    }));
                } else {
                    this.error$.next(response.error || 'Unknown error, please try reloading the page');
                }
            },
            error: (error: HttpErrorResponse) => {
                console.error(error);
                this.error$.next(error.message);
            },
        }));
    }

    /**
     * Update existing task with provided values
     * @param task 
     * 
     * @returns Observable of the response object
     */
    public updateTask(task: TaskItem) {
        let requestBody = new FormData();
        requestBody.set('message', task.message);
        requestBody.set('priority', task.priority?.toString() || '');
        requestBody.set('due_date', DateUtils.toRequestFormat(task.due_date) || '');
        requestBody.set('assigned_to', task.assigned_to?.toString() || '');
        requestBody.set('taskid', task.id);

        return this.httpClient.post<GenericResponse>(`${this.API_URL}/update`, requestBody, {
            headers: {
                AuthToken: this.API_KEY,
            }
        }).pipe(tap({
            next: response => {
                if (response.status === 'success') {
                    const taskList = [...this.tasks$.getValue()];
                    const updateIndex = taskList.findIndex(x => x.id === task.id);
                    if (updateIndex >= 0) {
                        taskList[updateIndex] = task;
                    }
                    this.tasks$.next(taskList);
                    console.log('Task update successful');
                } else {
                    console.error('Task update failed', response.error || 'Unknown error');
                }
            }, error: error => {
                console.error('Updating task failed', error);
            }
        }));
    }
    
    /**
    * Delete a task
    * @param taskId ID of the task to be deleted 
    * 
    * @retuns Observable result of the delete operation
    */
    public deleteTask(taskId: string) {
        let requestBody = new FormData();
        requestBody.set('taskid', taskId);
        return this.httpClient.post<GenericResponse>(`${this.API_URL}/delete`, requestBody, {
            headers: {
                AuthToken: this.API_KEY,
            }
        }).pipe(tap({
            next: response => {
                if (response.status === 'success') {
                    this.tasks$.next(this.tasks$.getValue().filter(task => task.id !== taskId));
                }
            }
        }));
    }
}
