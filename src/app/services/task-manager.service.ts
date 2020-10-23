import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateTaskResponse, GenericResponse, TaskItem, TaskListResponse } from '../models';
import { DateUtils } from '../utils/date-utils';

@Injectable({
    providedIn: 'root'
})
export class TaskManagerService {    
    private API_URL: string;
    
    public tasks$: BehaviorSubject<TaskItem[]>;
    public error$: BehaviorSubject<string>;
    public pauseSync$: BehaviorSubject<boolean>;
    
    public readonly PRIORITIES = [{
        value: 1,
        label: 'Low Priority',
        styleClass: 'priority-low',
    }, {
        value: 2,
        label: 'Medium Priority',
        styleClass: 'priority-medium',
    }, {
        value: 3,
        label: 'High Priority',
        styleClass: 'priority-high',
    }];
    
    constructor(private httpClient: HttpClient) { 
        this.API_URL = environment.apiUrl;
        
        this.tasks$ = new BehaviorSubject([]);
        this.error$ = new BehaviorSubject("");
        this.pauseSync$ = new BehaviorSubject(false);
    }
    
    /**
    * Fetch all tasks. 
    * `tasks$` will be updated with the results.
    * @param isAutoSync Set this to `true` when calling this method as part of auto sync
    * 
    * @returns Observable of the response object
    */
    public fetchAll(isAutoSync: boolean = false) {
        if (isAutoSync && this.pauseSync$.getValue()) {
            // If sync is paused, do nothing
            console.log('Sync paused');
            return EMPTY;
        }
        console.log('Syncing...');
        return this.httpClient.get<TaskListResponse>(`${this.API_URL}/list`).pipe(tap({
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
    * Create task with provided values
    * @param task The task to be created
    * 
    * @returns Observable with the response object
    */
    public createTask(task: TaskItem) {
        let requestBody = new FormData();
        requestBody.set('message', task.message);
        requestBody.set('priority', task.priority?.toString() || '');
        requestBody.set('due_date', DateUtils.toRequestFormat(task.due_date) || '');
        requestBody.set('assigned_to', task.assigned_to?.toString() || '');
        
        return this.httpClient.post<CreateTaskResponse>(`${this.API_URL}/create`, requestBody).pipe(tap({
            next: response => {
                if (response.status === 'success') {
                    task.id = response.taskid;
                    this.tasks$.next([task, ...this.tasks$.getValue()]);
                } else {
                    console.error('Task creation failed', response.error || response.message || 'Unknown error');
                }
            }
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
        
        return this.httpClient.post<GenericResponse>(`${this.API_URL}/update`, requestBody).pipe(tap({
            next: response => {
                if (response.status === 'success') {
                    const taskList = [...this.tasks$.getValue()];
                    const updateIndex = taskList.findIndex(x => x.id === task.id);
                    if (updateIndex >= 0) {
                        taskList[updateIndex] = task;
                    }
                    this.tasks$.next(taskList);
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
        return this.httpClient.post<GenericResponse>(`${this.API_URL}/delete`, requestBody).pipe(tap({
            next: response => {
                if (response.status === 'success') {
                    this.tasks$.next(this.tasks$.getValue().filter(task => task.id !== taskId));
                }
            }
        }));
    }
}
